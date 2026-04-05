# Combatting Outdated & Zombie Servers

## Context

Players are frustrated copying IPs from server lists only to get "Connection Refused" — half the servers are offline or running a version the player doesn't want (e.g., 1.8 when they want 1.21+). The site already runs a watcher cron every 5 minutes that pings all servers via SLP, but it only stores the MOTD and online/offline status — not the version, and not a "last online" timestamp.

## Design

### 1. Data Model

**Add `last_online_at` to `servers` table:**

```sql
ALTER TABLE servers ADD COLUMN last_online_at TIMESTAMPTZ;
CREATE INDEX idx_servers_last_online_at ON servers(last_online_at);
```

**Schema stays as-is** — `server_status` already has `last_checked` and `status`. `last_online_at` is the new derived column for filtering.

**Version sync:** The watcher already extracts `version` from the SLP response but doesn't persist it anywhere. On every successful ping, `servers.version` gets overwritten with the server-reported value, and `servers.last_online_at` gets set to `now()`.

**No new tables needed.** The existing `server_status` row already tracks online/offline per ping.

---

### 2. Watcher Changes (`/api/cron/watcherroute.ts`)

**In `upsertServerStatus`**, add a second upsert to `servers` when `status === true`:

```ts
// After successful ping, sync version and last_online_at
if (status) {
  await supabase
    .from("servers")
    .update({ version: result.version, last_online_at: new Date().toISOString() })
    .eq("id", serverId);
}
```

Also persist the `version` from the ping result — currently returned by `pingServer` but only the MOTD is stored in `server_status`. The raw version string should be stored in `server_status` too:

```ts
// Add version to server_status upsert
motd: result.motd,
version: result.version,
```

---

### 3. API — Filter by Online Recency

**Add `max_offline_hours` query param to `/api/servers`:**

```
GET /api/servers?max_offline_hours=24
```

Filters out servers where `last_online_at < now() - interval '24 hours'`. Default behavior stays unchanged (return all servers) to avoid breaking existing callers.

Implementation: join `servers` with `server_status`, filter by `server_status.status = true AND servers.last_online_at >= now() - interval '24 hours'`. If `last_online_at IS NULL` (never been online), treat as perpetually offline — exclude from main list.

**Add `show_offline` param** for the "Recently Offline" section:

```
GET /api/servers?show_offline=true&max_offline_hours=72
```

Returns servers in the 24–72 hour offline window for the "Recently Offline" tab.

---

### 4. Frontend — UI Changes

**On server cards and detail pages:** Display `version` prominently (server-reported, not declared). Show a green "Online" / red "Offline" badge with the last-seen relative time (e.g., "5 min ago", "3 hours ago").

**On the main list page:** Add a toggle/filter — "Hide offline servers" (default: ON). This calls `max_offline_hours=24`.

**New "Recently Offline" tab:** A secondary tab showing servers that went offline in the last 72 hours. Calls `show_offline=true&max_offline_hours=72`. Useful for players who want to catch servers before they're delisted.

**Version badge:** Clear version string displayed on each card. No ambiguity about 1.8 vs 1.21.

**Bedrock/Java cross-play:** Out of scope for this iteration — requires separate detection logic or a registration-time field.

---

### 5. Edge Cases

| Case | Behavior |
|------|----------|
| Server never been online | `last_online_at = NULL`, treated as offline, excluded from main list |
| Server goes offline then back online | `last_online_at` updated on re-connection, server reappears in main list |
| Version string empty/invalid from ping | Keep previous version (don't null it out) |
| Watcher runs during a server's temporary hiccup | Consecutive failures don't affect `last_online_at` — only online pings update it |
| Very old server (months offline) | Stays in "Recently Offline" tab until manually removed or hits 30-day threshold for full archival |

---

### 6. Testing Approach

- Unit test `pingServer` with a mock UDP socket
- Integration test the watcher against a known live server and a known offline IP
- Verify the filter logic in `/api/servers` with various `max_offline_hours` values
- Manual: register a test server, confirm it appears, stop it, confirm it disappears from main list after 24h
