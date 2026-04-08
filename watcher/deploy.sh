#!/bin/bash
# GuildPost Watcher Deployment Script for Oracle VM

set -e

echo "🔥 GuildPost Watcher Deploy Script"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Create watcher user if not exists
if ! id "watcher" &>/dev/null; then
    echo "Creating watcher user..."
    useradd -r -s /bin/false watcher
fi

# Create directories
echo "Setting up directories..."
mkdir -p /opt/watcher
chown watcher:watcher /opt/watcher

# Check if binary exists
if [ ! -f "./watcher" ]; then
    echo -e "${RED}Watcher binary not found. Please build first:${NC}"
    echo "  GOOS=linux GOARCH=amd64 go build -o watcher"
    exit 1
fi

# Stop existing service if running
echo "Stopping existing service..."
systemctl stop guildpost-watcher 2>/dev/null || true

# Copy files
echo "Deploying files..."
cp watcher /opt/watcher/watcher
chown watcher:watcher /opt/watcher/watcher
chmod +x /opt/watcher/watcher

# Install systemd service
echo "Installing systemd service..."
cp guildpost-watcher.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Prompt for environment variables
echo ""
echo -e "${YELLOW}Configuration Required:${NC}"
echo "Edit /etc/systemd/system/guildpost-watcher.service and set:"
echo "  - SUPABASE_SERVICE_KEY (required)"
echo "  - POLL_INTERVAL (optional, default 300s)"
echo "  - WORKER_COUNT (optional, default 5)"
echo ""

# Enable and start service
echo "Enabling service..."
systemctl enable guildpost-watcher

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Set your Supabase service key in the service file"
echo "  2. Run: systemctl start guildpost-watcher"
echo "  3. Check status: systemctl status guildpost-watcher"
echo "  4. View logs: journalctl -u guildpost-watcher -f"
echo ""
echo "Process management (no VM restart needed):"
echo "  - Stop:   systemctl stop guildpost-watcher"
echo "  - Start:  systemctl start guildpost-watcher"
echo "  - Restart: systemctl restart guildpost-watcher"
echo "  - Reload:  systemctl reload guildpost-watcher (or: kill -HUP \$(pgrep watcher))"
