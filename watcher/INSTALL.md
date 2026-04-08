# GuildPost Watcher - Oracle VM Installation

## VM Details
- **Instance ID:** `ocid1.instance.oc1.us-sanjose-1.anzwuljrdb5hswacletqurfurakgjvskz3o3ti4psoolyg5ndn2og2ges5uq`
- **Public IP:** `170.9.31.214`
- **Shape:** VM.Standard.E2.1.Micro (Always Free tier)
- **OS:** Oracle Linux 9
- **SSH Key:** `~/.ssh/oracle_watcher`

## Quick Start

### 1. SSH into the VM
```bash
ssh -i ~/.ssh/oracle_watcher opc@170.9.31.214
```

### 2. Install Go
```bash
sudo dnf update -y
sudo dnf install -y golang git
```

### 3. Deploy Watcher
```bash
cd /tmp
git clone https://github.com/mintychochip/guildpost.git
cd guildpost/watcher

# Install dependencies
go mod tidy

# Build
go build -o watcher

# Install
sudo mkdir -p /opt/watcher
sudo cp watcher /opt/watcher/
sudo cp guildpost-watcher.service /etc/systemd/system/

# Create user
sudo useradd -r -s /bin/false watcher || true
sudo chown -R watcher:watcher /opt/watcher

# Set environment variables
sudo tee /etc/systemd/system/guildpost-watcher.service.d/env.conf > /dev/null <<EOF
[Service]
Environment="SUPABASE_URL=https://wpxutsdbiampnxfgkjwq.supabase.co"
Environment="SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE"
Environment="POLL_INTERVAL=300"
Environment="WORKER_COUNT=5"
Environment="LISTEN_ADDR=:8080"
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable guildpost-watcher
sudo systemctl start guildpost-watcher
```

### 4. Verify
```bash
# Check status
sudo systemctl status guildpost-watcher

# View logs
sudo journalctl -u guildpost-watcher -f

# Test HTTP endpoint
curl http://localhost:8080/health
```

## Process Management (No VM Restart!)

| Command | Action |
|---------|--------|
| `sudo systemctl start guildpost-watcher` | Start watcher |
| `sudo systemctl stop guildpost-watcher` | Stop watcher |
| `sudo systemctl restart guildpost-watcher` | Restart (process only) |
| `sudo systemctl reload guildpost-watcher` | Reload config (SIGHUP) |
| `sudo kill -HUP $(pgrep watcher)` | Alternative reload |

## Updating Without VM Restart

```bash
# SSH to VM
ssh -i ~/.ssh/oracle_watcher opc@170.9.31.214

# Pull latest code
cd /tmp/guildpost && git pull

# Rebuild
cd watcher && go build -o watcher

# Deploy (only process restarts, VM stays up)
sudo cp watcher /opt/watcher/
sudo systemctl restart guildpost-watcher
```

## Firewall Rules (if needed)

```bash
# Open watcher API port
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

## Security
- Runs as unprivileged `watcher` user
- Service has `Restart=always` for auto-recovery
- SSH key-based auth only
- No root login
- Minimal attack surface
