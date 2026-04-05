# PvP Index Watcher

Polls all servers from Supabase every 5 minutes and updates their live status.

## Setup

```bash
cd watcher
npm install
cp .env.example .env
# Edit .env with your SUPABASE_SERVICE_KEY
npm run build
```

## Run

```bash
# Single run
npm start

# Cron mode (runs every 5 minutes)
npm run cron
```

## How it works

1. Fetches all servers from Supabase `servers` table
2. Pings each via Minecraft SLP (Server List Ping) protocol over UDP
3. Upserts results into `server_status` table with latency, player count, max players, MOTD
4. Runs on a 5-minute interval when in cron mode

## No external dependencies for SLP

Raw SLP is implemented directly using Node.js `dgram` (UDP). No minecraft-specific npm packages needed.
