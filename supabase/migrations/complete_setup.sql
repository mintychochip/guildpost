-- GuildPost Complete Database Setup
-- Run this entire file in Supabase Dashboard → SQL Editor

-- ============================================
-- PART 1: VOTIFIER VOTING SYSTEM
-- ============================================

-- Create votes table with full tracking
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id TEXT NOT NULL,
  username TEXT NOT NULL,
  ip_address TEXT,
  fingerprint TEXT, -- Browser fingerprint for device tracking
  country TEXT,
  isp TEXT,
  is_proxy BOOLEAN DEFAULT false,
  is_vpn BOOLEAN DEFAULT false,
  is_tor BOOLEAN DEFAULT false,
  fraud_score INTEGER DEFAULT 0,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for efficient lookups and abuse prevention
CREATE INDEX IF NOT EXISTS idx_votes_user_cooldown 
ON votes(server_id, username, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_ip_cooldown 
ON votes(server_id, ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_fingerprint 
ON votes(server_id, fingerprint, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_ip_abuse_check 
ON votes(ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_votes_server_stats 
ON votes(server_id, created_at DESC);

-- Add Votifier columns to servers table
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS votifier_key TEXT,
ADD COLUMN IF NOT EXISTS discord_webhook TEXT,
ADD COLUMN IF NOT EXISTS votifier_port INTEGER DEFAULT 8192;

-- Create view for suspicious activity monitoring
CREATE OR REPLACE VIEW suspicious_votes AS
SELECT 
  ip_address,
  COUNT(DISTINCT username) as unique_usernames,
  COUNT(*) as total_votes,
  MAX(created_at) as last_vote,
  BOOL_OR(is_vpn OR is_proxy OR is_tor) as used_proxy
FROM votes
WHERE created_at >= now() - interval '7 days'
GROUP BY ip_address
HAVING COUNT(DISTINCT username) > 5 OR COUNT(*) > 10;

-- Create function to get server vote stats
CREATE OR REPLACE FUNCTION get_server_vote_stats(server_uuid TEXT)
RETURNS TABLE (
  total_votes BIGINT,
  unique_voters BIGINT,
  votes_today BIGINT,
  votes_this_week BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_votes,
    COUNT(DISTINCT username)::BIGINT as unique_voters,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '1 day')::BIGINT as votes_today,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')::BIGINT as votes_this_week
  FROM votes
  WHERE server_id = server_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 2: SERVER STATUS & ANALYTICS
-- ============================================

-- Add status tracking columns to servers
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'unknown')),
ADD COLUMN IF NOT EXISTS players_online INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_players INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ping_ms INTEGER,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS last_ping_at TIMESTAMP WITH TIME ZONE;

-- Index for efficient status queries
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_servers_last_ping ON servers(last_ping_at);

-- View for online servers sorted by player count
CREATE OR REPLACE VIEW online_servers AS
SELECT *
FROM servers
WHERE status = 'online'
ORDER BY players_online DESC;

-- Table for detailed ping history (for analytics charts)
CREATE TABLE IF NOT EXISTS server_ping_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id TEXT NOT NULL REFERENCES servers(id),
  status TEXT,
  players_online INTEGER,
  max_players INTEGER,
  ping_ms INTEGER,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ping_history_server ON server_ping_history(server_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ping_history_time ON server_ping_history(created_at DESC);

-- Function to get player count history for charts
CREATE OR REPLACE FUNCTION get_player_history(
  server_uuid TEXT, 
  hours_back INTEGER DEFAULT 24,
  interval_minutes INTEGER DEFAULT 30
)
RETURNS TABLE (
  time_bucket TIMESTAMP WITH TIME ZONE,
  avg_players NUMERIC,
  max_players INTEGER,
  min_players INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('hour', created_at) + 
      (interval_minutes * (EXTRACT(MINUTE FROM created_at)::int / interval_minutes))::int * interval '1 minute' as time_bucket,
    ROUND(AVG(players_online), 0) as avg_players,
    MAX(players_online) as max_players,
    MIN(players_online) as min_players
  FROM server_ping_history
  WHERE server_id = server_uuid
    AND created_at >= now() - (hours_back || ' hours')::interval
    AND status = 'online'
  GROUP BY time_bucket
  ORDER BY time_bucket ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get server uptime stats
CREATE OR REPLACE FUNCTION get_server_uptime(server_uuid TEXT, days INTEGER DEFAULT 7)
RETURNS TABLE (
  total_pings BIGINT,
  online_pings BIGINT,
  uptime_percent NUMERIC,
  avg_players NUMERIC,
  max_players_seen INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_pings,
    COUNT(*) FILTER (WHERE status = 'online')::BIGINT as online_pings,
    ROUND((COUNT(*) FILTER (WHERE status = 'online') * 100.0 / NULLIF(COUNT(*), 0)), 2) as uptime_percent,
    ROUND(AVG(players_online), 2) as avg_players,
    MAX(players_online) as max_players_seen
  FROM server_ping_history
  WHERE server_id = server_uuid
  AND created_at >= now() - (days || ' days')::interval;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 3: REVIEWS SYSTEM
-- ============================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS server_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id TEXT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  playtime_hours INTEGER,
  helpful_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_reviews_server ON server_reviews(server_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON server_reviews(server_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_username ON server_reviews(username);

-- View for server rating stats
CREATE OR REPLACE VIEW server_rating_stats AS
SELECT 
  server_id,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating), 2) as avg_rating,
  COUNT(*) FILTER (WHERE rating = 5) as five_star,
  COUNT(*) FILTER (WHERE rating = 4) as four_star,
  COUNT(*) FILTER (WHERE rating = 3) as three_star,
  COUNT(*) FILTER (WHERE rating = 2) as two_star,
  COUNT(*) FILTER (WHERE rating = 1) as one_star
FROM server_reviews
GROUP BY server_id;

-- Function to get review distribution
CREATE OR REPLACE FUNCTION get_review_distribution(server_uuid TEXT)
RETURNS TABLE (
  rating INTEGER,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COUNT(*) INTO total FROM server_reviews WHERE server_id = server_uuid;
  
  RETURN QUERY
  SELECT 
    r.rating,
    COUNT(*)::BIGINT as count,
    ROUND(COUNT(*) * 100.0 / NULLIF(total, 0), 1) as percentage
  FROM server_reviews r
  WHERE r.server_id = server_uuid
  GROUP BY r.rating
  ORDER BY r.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reviews_updated_at ON server_reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON server_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Now deploy Edge Functions:
-- supabase functions deploy vote ping-servers analytics reviews
