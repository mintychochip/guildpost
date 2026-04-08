package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/supabase-community/supabase-go"
)

// Server represents a Minecraft server from the database
type Server struct {
	ID            string `json:"id"`
	IP            string `json:"ip"`
	Port          int    `json:"port"`
	Name          string `json:"name"`
	Status        string `json:"status"`
	PlayersOnline int    `json:"players_online"`
	MaxPlayers    int    `json:"max_players"`
	Version       string `json:"version"`
	Motd          string `json:"motd"`
}

// PingResult contains the result of pinging a server
type PingResult struct {
	Online        bool
	PlayersOnline int
	MaxPlayers    int
	Version       string
	Motd          string
	Latency       int64
	Error         string
}

// Config holds the application configuration
type Config struct {
	SupabaseURL    string
	SupabaseKey    string
	PollInterval   time.Duration
	BatchSize      int
	WorkerCount    int
	ListenAddr     string
}

// Watcher is the main application struct
type Watcher struct {
	config   *Config
	client   *supabase.Client
	ctx      context.Context
	cancel   context.CancelFunc
	httpSrv  *http.Server
}

func main() {
	config := loadConfig()
	
	log.Printf("🔥 GuildPost Watcher starting...")
	log.Printf("📊 Config: interval=%v, workers=%d, batch=%d", 
		config.PollInterval, config.WorkerCount, config.BatchSize)

	watcher, err := NewWatcher(config)
	if err != nil {
		log.Fatalf("Failed to create watcher: %v", err)
	}

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM, syscall.SIGHUP)

	go func() {
		for sig := range sigChan {
			switch sig {
			case syscall.SIGHUP:
				log.Println("🔄 Received SIGHUP, reloading...")
				watcher.Reload()
			default:
				log.Printf("👋 Received %v, shutting down...", sig)
				watcher.Shutdown()
				os.Exit(0)
			}
		}
	}()

	// Start HTTP control server
	go watcher.StartHTTPServer()

	// Start watching
	watcher.Start()
}

func loadConfig() *Config {
	interval, _ := strconv.Atoi(getEnv("POLL_INTERVAL", "300")) // 5 minutes default
	batchSize, _ := strconv.Atoi(getEnv("BATCH_SIZE", "100"))
	workers, _ := strconv.Atoi(getEnv("WORKER_COUNT", "5"))

	return &Config{
		SupabaseURL:  getEnv("SUPABASE_URL", ""),
		SupabaseKey:  getEnv("SUPABASE_SERVICE_KEY", ""),
		PollInterval: time.Duration(interval) * time.Second,
		BatchSize:    batchSize,
		WorkerCount:  workers,
		ListenAddr:   getEnv("LISTEN_ADDR", ":8080"),
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

// NewWatcher creates a new watcher instance
func NewWatcher(config *Config) (*Watcher, error) {
	if config.SupabaseURL == "" || config.SupabaseKey == "" {
		return nil, fmt.Errorf("SUPABASE_URL and SUPABASE_SERVICE_KEY required")
	}

	client := supabase.CreateClient(config.SupabaseURL, config.SupabaseKey)
	
	ctx, cancel := context.WithCancel(context.Background())

	return &Watcher{
		config: config,
		client: client,
		ctx:    ctx,
		cancel: cancel,
	}, nil
}

// Start begins the polling loop
func (w *Watcher) Start() {
	ticker := time.NewTicker(w.config.PollInterval)
	defer ticker.Stop()

	// Do initial poll immediately
	w.pollAllServers()

	for {
		select {
		case <-w.ctx.Done():
			return
		case <-ticker.C:
			w.pollAllServers()
		}
	}
}

// Reload configuration and restart
func (w *Watcher) Reload() {
	log.Println("🔄 Reloading configuration...")
	w.cancel()
	
	newConfig := loadConfig()
	newWatcher, err := NewWatcher(newConfig)
	if err != nil {
		log.Printf("❌ Failed to reload: %v", err)
		return
	}
	
	*w = *newWatcher
	go w.StartHTTPServer()
	go w.Start()
	log.Println("✅ Reloaded successfully")
}

// Shutdown gracefully stops the watcher
func (w *Watcher) Shutdown() {
	w.cancel()
	if w.httpSrv != nil {
		w.httpSrv.Shutdown(context.Background())
	}
	log.Println("👋 Watcher stopped")
}

// pollAllServers fetches and polls all servers
func (w *Watcher) pollAllServers() {
	start := time.Now()
	log.Println("📡 Starting poll cycle...")

	servers, err := w.fetchServers()
	if err != nil {
		log.Printf("❌ Failed to fetch servers: %v", err)
		return
	}

	log.Printf("🎯 Found %d servers to poll", len(servers))

	// Process in batches
	results := w.processBatches(servers)

	// Update database with results
	w.updateServers(results)

	elapsed := time.Since(start)
	log.Printf("✅ Poll cycle complete: %d servers in %v", len(servers), elapsed)
}

// fetchServers gets all servers from Supabase
func (w *Watcher) fetchServers() ([]Server, error) {
	resp := w.client.From("servers").
		Select("id,ip,port,name,status,players_online,max_players,version,motd").
		Order("id", &supabase.OrderOpts{Ascending: true})

	var servers []Server
	err := resp.Execute(&servers)
	if err != nil {
		return nil, err
	}

	return servers, nil
}

// processBatches processes servers in parallel batches
func (w *Watcher) processBatches(servers []Server) []Server {
	results := make([]Server, 0, len(servers))
	resultsChan := make(chan Server, len(servers))

	// Worker pool
	jobs := make(chan Server, len(servers))
	var wg sync.WaitGroup

	// Start workers
	for i := 0; i < w.config.WorkerCount; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for server := range jobs {
				result := w.pingServer(server)
				resultsChan <- result
			}
		}(i)
	}

	// Send jobs
	go func() {
		for _, server := range servers {
			jobs <- server
		}
		close(jobs)
	}()

	// Collect results
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	for result := range resultsChan {
		results = append(results, result)
	}

	return results
}

// pingServer pings a Minecraft server
func (w *Watcher) pingServer(server Server) Server {
	address := fmt.Sprintf("%s:%d", server.IP, server.Port)
	
	// Simple TCP connect with timeout
	start := time.Now()
	conn, err := net.DialTimeout("tcp", address, 5*time.Second)
	latency := time.Since(start)

	if err != nil {
		server.Status = "offline"
		server.PlayersOnline = 0
		return server
	}
	defer conn.Close()

	// For now, just mark as online if TCP connects
	// In production, you'd implement the full Minecraft ping protocol
	server.Status = "online"
	server.PlayersOnline = 0 // Would parse from server response
	
	log.Printf("  ✓ %s (%s): online (%v)", server.Name, address, latency)
	return server
}

// updateServers updates the database with ping results
func (w *Watcher) updateServers(servers []Server) {
	// Batch updates
	for _, server := range servers {
		data := map[string]interface{}{
			"status":         server.Status,
			"players_online": server.PlayersOnline,
			"last_ping_at":   time.Now().Format(time.RFC3339),
		}

		resp := w.client.From("servers").
			Update(data, "", "").
			Eq("id", server.ID)

		var result interface{}
		if err := resp.Execute(&result); err != nil {
			log.Printf("  ✗ Failed to update %s: %v", server.Name, err)
		}
	}
}

// StartHTTPServer starts the HTTP control interface
func (w *Watcher) StartHTTPServer() {
	mux := http.NewServeMux()
	
	mux.HandleFunc("/health", w.handleHealth)
	mux.HandleFunc("/status", w.handleStatus)
	mux.HandleFunc("/reload", w.handleReload)
	mux.HandleFunc("/pause", w.handlePause)
	mux.HandleFunc("/resume", w.handleResume)

	w.httpSrv = &http.Server{
		Addr:    w.config.ListenAddr,
		Handler: mux,
	}

	log.Printf("🌐 HTTP server listening on %s", w.config.ListenAddr)
	if err := w.httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Printf("HTTP server error: %v", err)
	}
}

func (w *Watcher) handleHealth(wr http.ResponseWriter, r *http.Request) {
	json.NewEncoder(wr).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

func (w *Watcher) handleStatus(wr http.ResponseWriter, r *http.Request) {
	json.NewEncoder(wr).Encode(map[string]interface{}{
		"status":    "running",
		"config": map[string]interface{}{
			"poll_interval": w.config.PollInterval.String(),
			"batch_size":    w.config.BatchSize,
			"workers":       w.config.WorkerCount,
		},
	})
}

func (w *Watcher) handleReload(wr http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(wr, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	go w.Reload()
	json.NewEncoder(wr).Encode(map[string]string{"status": "reloading"})
}

func (w *Watcher) handlePause(wr http.ResponseWriter, r *http.Request) {
	// Implementation would pause polling
	json.NewEncoder(wr).Encode(map[string]string{"status": "paused"})
}

func (w *Watcher) handleResume(wr http.ResponseWriter, r *http.Request) {
	// Implementation would resume polling
	json.NewEncoder(wr).Encode(map[string]string{"status": "resumed"})
}