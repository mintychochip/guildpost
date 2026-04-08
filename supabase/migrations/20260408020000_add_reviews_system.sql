-- Migration: Add server reviews system
-- Players can leave ratings and reviews on servers

CREATE TABLE IF NOT EXISTS server_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username VARCHAR(16) NOT NULL, -- Minecraft username
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT FALSE, -- True if player actually joined server
  is_approved BOOLEAN DEFAULT FALSE, -- Moderation queue
  helpful_count INTEGER DEFAULT 0, -- Other users marking as helpful
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Prevent duplicate reviews from same user on same server
  UNIQUE(server_id, username)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_reviews_server_id ON server_reviews(server_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON server_reviews(is_approved, is_verified) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON server_reviews(server_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON server_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE server_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read of approved reviews
CREATE POLICY "Allow public read of approved reviews"
  ON server_reviews
  FOR SELECT
  TO anon
  USING (is_approved = TRUE);

-- Allow authenticated users to create reviews
CREATE POLICY "Allow authenticated users to create reviews"
  ON server_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update own reviews"
  ON server_reviews
  FOR UPDATE
  TO authenticated
  USING (username = current_user);

-- Function to update server rating stats
CREATE OR REPLACE FUNCTION update_server_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the server's average rating and count
  UPDATE servers
  SET 
    rating_average = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM server_reviews
      WHERE server_id = NEW.server_id AND is_approved = TRUE
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM server_reviews
      WHERE server_id = NEW.server_id AND is_approved = TRUE
    )
  WHERE id = NEW.server_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update server stats when reviews change
DROP TRIGGER IF EXISTS update_server_stats_on_review ON server_reviews;
CREATE TRIGGER update_server_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON server_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_server_rating_stats();

-- Add rating columns to servers table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='servers' AND column_name='rating_average') THEN
    ALTER TABLE servers ADD COLUMN rating_average NUMERIC(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='servers' AND column_name='rating_count') THEN
    ALTER TABLE servers ADD COLUMN rating_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE server_reviews IS 'Player reviews and ratings for servers';
COMMENT ON COLUMN server_reviews.is_verified IS 'True if player actually joined the server (verified via API)';
COMMENT ON COLUMN server_reviews.is_approved IS 'Moderation approval status - reviews start as false until approved';

-- Migration complete