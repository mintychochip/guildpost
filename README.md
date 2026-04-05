# PvP Index

Real-time Minecraft PvP server directory. Live latency checks, player counts, and community votes — ranked by performance.

**Live:** [pvp-directory.vercel.app](https://pvp-directory.vercel.app) (custom domain: pvpserverlist.gg — coming soon)

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Vercel (serverless), Supabase Edge Functions (Deno)
- **Database:** Supabase Postgres with RLS
- **Watcher:** Node.js cron (runs on Oracle VM) — pings servers every 5 min via SLP protocol

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SECRET_KEY` | Supabase service role key (server-only) |

### Google AdSense (monetization)

Ad slots are integrated and will show placeholder boxes until AdSense credentials are added. Apply at [google.com/adsense](https://www.google.com/adsense).

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Your AdSense publisher ID (e.g. `ca-pub-XXXXXXXX`) |
| `NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD` | Ad slot ID for the 728×90 leaderboard |
| `NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE` | Ad slot ID for the 300×250 rectangle |
| `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` | Ad slot ID for the sidebar (rectangle + skyscraper share one ID) |

**Ad placements:**
- Homepage, Top, and Server detail pages: leaderboard (top) + sidebar
- Submit and Verify pages: footer banner only
- When credentials are not set, styled placeholder boxes are shown instead

## Database

Schema and migrations live in `supabase/migrations/`. The `servers` table holds listings; `server_status` holds live ping data.

## Watcher

The `watcher/` directory is a standalone Node.js cron that polls all servers every 5 minutes and updates `server_status` in Supabase. See `watcher/README.md` for setup.

## API Routes

| Route | Description |
|---|---|
| `GET /api/servers` | Paginated server list with filters |
| `GET /api/server/[ip]` | Single server with staleness-aware refresh |
| `POST /api/vote` | Submit a vote for a server |
| `GET /api/v1/servers/[ip]/status` | SVG status badge |
| `GET /api/v1/servers/[ip]/badge` | SVG latency badge |
| `POST /api/submit` | Submit a new server listing |

## SEO

- JSON-LD schema (ItemList, SoftwareApplication) on all listing pages
- Subdomain strategy: `minecraft.pvpserverlist.gg` → Minecraft topical authority
- Programmatic SEO pages: `/minecraft/version/[version]/[tag]/[region]`
