-- Migration: Add server_ping_history table for time-series data
-- This stores historical player counts and uptime data

CREATE TABLE IF NOT EXISTS server_ping_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  players_online INTEGER NOT NULL DEFAULT 0,
  max_players INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER,
  pinged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_ping_history_server_id ON server_ping_history(server_id);
CREATE INDEX IF NOT EXISTS idx_ping_history_ping_at ON server_ping_history(pinged_at DESC);
CREATE INDEX IF NOT EXISTS idx_ping_history_server_time ON server_ping_history(server_id, pinged_at DESC);

-- Enable RLS (but allow service role to insert)
ALTER TABLE server_ping_history ENABLE ROW LEVEL SECURITY;

-- Allow anon to read (for public stats)
CREATE POLICY "Allow public read of ping history"
  ON server_ping_history
  FOR SELECT
  TO anon
  USING (true);

-- Auto-cleanup old records (keep 30 days)
-- Run this periodically: DELETE FROM server_ping_history WHERE pinged_at < NOW() - INTERVAL '30 days';

-- Add comment for documentation
COMMENT ON TABLE server_ping_history IS 'Stores historical player counts from server pings for analytics';

-- Add last_ping_at to servers table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='servers' AND column_name='last_ping_at') THEN
    ALTER TABLE servers ADD COLUMN last_ping_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;