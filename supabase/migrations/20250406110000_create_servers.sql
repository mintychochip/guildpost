-- Base servers table creation
-- Must run before other migrations

CREATE TABLE IF NOT EXISTS servers (
  id TEXT PRIMARY KEY,
  ip TEXT NOT NULL,
  port INTEGER DEFAULT 25565,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,
  tags TEXT[] DEFAULT '{}',
  edition TEXT DEFAULT 'java',
  website TEXT,
  icon TEXT,
  banner TEXT,
  verified BOOLEAN DEFAULT false,
  vote_count INTEGER DEFAULT 0,
  players_online INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 0,
  status TEXT DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'unknown')),
  ping_ms INTEGER,
  last_error TEXT,
  last_ping_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anon read" ON servers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow auth read" ON servers FOR SELECT TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_servers_vote_count ON servers(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_servers_created_at ON servers(created_at DESC);
