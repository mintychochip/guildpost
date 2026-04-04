# PvP Index — Server Directory Design

## Overview

A high-performance Minecraft PvP server directory built on Vercel + Supabase. Targets competitive PvP players with real-time latency data, developer-first integrations, and a modern dark-themed UI.

Stack: Next.js (App Router) + Supabase (Postgres + Edge Functions) + SLP (Server List Ping) for Minecraft status.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────────┐
│   Browser  │────▶│  Next.js     │────▶│  Supabase          │
│   (User)   │     │  (Vercel)    │     │  - Postgres        │
└─────────────┘     └──────────────┘     │  - Edge Functions  │
                           │            │  - Row Level Sec   │
                           │            └────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ Minecraft   │
                    │ Servers     │
                    │ (SLP Ping)  │
                    └─────────────┘
```

**Ping flow:**
1. User visits server page → calls `/api/server/[ip]`
2. API checks `server_status` table — if `last_checked` < 10 min, return cached
3. If stale → Supabase Edge Function pings server via SLP (UDP port 25565)
4. Edge Function updates `server_status`, returns fresh data
5. On timeout (3s) or failure → return last known status

---

## Database Schema (Supabase Postgres)

### Table: `servers`

| Column        | Type         | Notes                           |
|---------------|--------------|----------------------------------|
| id            | UUID (PK)    | Default `gen_random_uuid()`      |
| ip            | TEXT         | Unique, server IP               |
| port          | INTEGER      | Default 25565                   |
| name          | TEXT         | Server display name             |
| description   | TEXT         | Long-form description           |
| version       | TEXT         | e.g., "1.8", "1.20.4"          |
| tags          | TEXT[]       | ["crystal", "pvp", "lifesteal"] |
| verified      | BOOLEAN      | Default false                   |
| votifier_key  | TEXT         | Encrypted RSA public key        |
| vote_count    | INTEGER      | Default 0                       |
| created_at    | TIMESTAMPTZ  | Default now()                   |
| updated_at    | TIMESTAMPTZ  | Default now()                   |

### Table: `server_status`

| Column        | Type         | Notes                           |
|---------------|--------------|----------------------------------|
| id            | UUID (PK)    | Default `gen_random_uuid()`      |
| server_id     | UUID (FK)    | References servers.id            |
| status        | BOOLEAN      | true = online                   |
| latency_ms    | INTEGER      | Ping in milliseconds            |
| player_count  | INTEGER      | Current players online          |
| max_players   | INTEGER      | Max capacity                    |
| motd          | TEXT         | Server description/banner        |
| last_checked  | TIMESTAMPTZ  | Default now()                   |

Unique constraint on `server_id`.

### Table: `votes`

| Column        | Type         | Notes                           |
|---------------|--------------|----------------------------------|
| id            | UUID (PK)    | Default `gen_random_uuid()`      |
| server_id     | UUID (FK)    | References servers.id           |
| visitor_ip    | TEXT         | Hashed IP for cooldown check     |
| created_at    | TIMESTAMPTZ  | Default now()                   |

24-hour vote cooldown enforced at query time:
```sql
SELECT COUNT(*) < 1 FROM votes
WHERE server_id = $1
AND visitor_ip = $2
AND created_at > now() - interval '24 hours';
```

### Table: `verification_tokens`

| Column        | Type         | Notes                           |
|---------------|--------------|----------------------------------|
| id            | UUID (PK)    | Default `gen_random_uuid()`      |
| server_id     | UUID (FK)    | References servers.id           |
| token         | TEXT         | Unique verification string      |
| motd_pattern  | TEXT         | Expected pattern in MOTD        |
| expires_at    | TIMESTAMPTZ  | Default now() + 10 minutes      |
| verified_at   | TIMESTAMPTZ  | Null until verified             |

---

## Backend: SLP Ping (Supabase Edge Function)

Written in TypeScript (Deno runtime).

**Protocol:** Minecraft Server List Ping (SLP) — UDP, port 25565 (or server's port).

**Packet flow:**
1. Handshake: `0xFE (0xFD response)` → send `0x01` with handshake payload
2. Request: `0xFE` → server responds with SLP data
3. Parse: MOTD, player count, max players, version string
4. Latency: `Date.now()` before send, `Date.now()` after recv

**Timeout:** 3 second socket timeout. On timeout → return `{ status: last_known.status, latency_ms: null }`.

**Staleness check:** Query `server_status` by `server_id`, compare `last_checked < now() - interval '10 minutes'`.

**Edge Function signature:**
```
POST /functions/v1/ping-server
Body: { ip: string, port: number }
Response: { status: boolean, latency_ms: number, player_count: number, max_players: number, motd: string }
```

---

## Frontend (Next.js App Router)

### Pages

| Route                      | Description                              |
|----------------------------|------------------------------------------|
| `/`                        | Home — server list, filters, search     |
| `/servers/[ip]`            | Individual server page (real-time data)  |
| `/submit`                  | Server submission + verification flow     |
| `/top`                     | Top-ranked servers by votes               |
| `/category/[slug]`          | Category-filtered server list            |
| `/version/[version]`        | Version-filtered server list             |
| `/blog`                    | Blog index                               |
| `/blog/[slug]`              | Blog post                                |
| `/api/server/[ip]`         | Server status proxy endpoint              |
| `/api/vote`                | Vote endpoint (POST, CSRF protected)     |
| `/api/servers`             | Server list API (paginated, filterable)   |
| `/api/v1/servers/[ip]/status` | Public API: server status JSON         |
| `/api/v1/servers/[ip]/badge` | Public API: SVG rank/latency badge     |

### Server Card Component

```
┌─────────────────────────────────────────────────────┐
│ [Icon]  ServerName                          [Ping] │
│         play.example.com                    32ms   │
│         ★ 4.2 (128 votes)                           │
│                                                     │
│ [1.20.4] [PvP] [Lifesteal] [Cross-Play]           │
│                                                     │
│ 124/500 players online                    [Vote]   │
└─────────────────────────────────────────────────────┘
```

**Ping badge colors:**
- Green: < 50ms
- Yellow: 50-150ms
- Red: > 150ms
- Gray: offline / unknown

### Filter Bar

- Search by name
- Filter by tag: Crystal PvP, UHC, Sumo, NoDebuff, Lifesteal, SMP, etc.
- Filter by version: 1.8, 1.12, 1.20.4, etc.
- Sort: Votes, Players, Latency, Newest

### Caching Strategy

- Server list pages: ISR with 60s revalidation
- Individual server pages: SSR + client-side polling every 30s
- API routes: no cache, always fresh

---

## Verification System (No-Plugin)

**Flow:**
1. Owner submits server via `/submit` form
2. Backend generates unique token (UUID), stores in `verification_tokens`
3. Owner sees: "Add `PvPIndex: {token}` to your server MOTD"
4. Backend pings server, extracts MOTD, checks for token pattern
5. If found within 10 minutes → `servers.verified = true`, token marked `verified_at`
6. If not found → token expires, owner can retry

**MOTD parsing:** SLP response includes raw MOTD text. Extract using regex `/PvPIndex:\s*([a-zA-Z0-9-]+)/`.

---

## Votifier Bridge

**Setup:**
- Owner provides their NuVotifier RSA public key in dashboard
- Key encrypted at rest using AES-256 (key stored in env var)
- "Send Test Vote" button in owner dashboard

**Vote packet:** When user votes, server sends signed JSON using owner's RSA key via NuVotifier v2 protocol.

---

## Public API (Server Owners)

**Status endpoint:**
```
GET https://api.pvpserverlist.com/v1/servers/192.168.1.1:25565/status
Response:
{
  "rank": 42,
  "name": "ExamplePvP",
  "latency_ms": 28,
  "player_count": 124,
  "max_players": 500,
  "last_checked": "2026-04-04T23:00:00Z"
}
```

**Badge endpoint:**
```
GET https://api.pvpserverlist.com/v1/servers/192.168.1.1:25565/badge
Response: SVG image (server owners can embed in their website)
```

---

## SEO Strategy

### 10 High-Intent PvP Keywords

1. `Crystal PvP servers 1.20.4`
2. `Lunar PvP practice server`
3. `NoDebuff PvP servers`
4. `UHC PvP servers`
5. `Hunger Games PvP servers`
6. `Bridge PvP servers`
7. `Sumo PvP servers`
8. `Practice PvP servers 1.8`
9. `1.8 PvP servers no lag`
10. `Lifesteal PvP servers`

### Category Pages

Each keyword maps to a `/category/[slug]` page:
- `/category/crystal-pvp`
- `/category/uhc-pvp`
- `/category/sumo-pvp`
- `/category/lifesteal`
- `/category/nodepuff-pvp`
- `/category/hunger-games-pvp`
- `/category/bridge-pvp`
- `/category/practice-pvp`

Server owners select tags at submission. Tag → slug mapping generates category pages automatically.

### JSON-LD Schema

**Homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best Minecraft PvP Servers 2026",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": "ServerName",
        "applicationCategory": "GameServer",
        "operatingSystem": "Minecraft 1.20.4",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1240"
        }
      }
    }
  ]
}
```

**Individual server page:** SoftwareApplication schema with server IP, version, player count.

### Blog (Top-of-Funnel Content)

- "Top 10 Crystal PvP Servers [Year]" — listicle
- "1.8 vs 1.20 PvP: Which Version is Actually Better?" — comparison
- "How to Join a PvP Server (Step-by-Step Guide)" — informational
- "Best Lifesteal Servers for Competitive Players" — category promotion
- "PvP Terminology Guide: Gapple, NoDebuff, Crystal, Sumo Explained" — glossary

Each post links to relevant category pages and server listings.

---

## Security

- **CSRF protection** on vote endpoint (same-site cookie + token)
- **Rate limiting** on vote API (1 vote per IP per 24h, enforced server-side)
- **Votifier key encryption** (AES-256, env-var stored key)
- **RLS (Row Level Security)** in Supabase for vote table
- **IP hashing** for visitor IPs in votes table (privacy)

---

## Performance Targets

- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Supabase Edge Function timeout: 10s max

---

## Tech Stack

| Layer           | Technology                        |
|-----------------|-----------------------------------|
| Frontend        | Next.js 15 (App Router)           |
| Hosting         | Vercel                            |
| Database        | Supabase Postgres                 |
| Ping Worker     | Supabase Edge Functions (Deno)    |
| Auth            | Supabase Auth (for owner accounts)|
| CSS             | Tailwind CSS (dark theme)          |
| Icons           | Lucide React                      |
| Fonts           | Inter (Google Fonts)              |
