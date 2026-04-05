-- Add last_online_at to servers table for zombie detection
ALTER TABLE servers ADD COLUMN last_online_at TIMESTAMPTZ;

-- Index for efficient offline filtering queries
CREATE INDEX idx_servers_last_online_at ON servers(last_online_at);

-- Backfill: set last_online_at to now() for servers that have a server_status row with status=true
UPDATE servers
SET last_online_at = now()
WHERE last_online_at IS NULL
  AND EXISTS (
    SELECT 1 FROM server_status
    WHERE server_status.server_id = servers.id
    AND server_status.status = true
  );
