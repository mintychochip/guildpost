-- Fix embedding dimensions for Gemini (3072 instead of 768)
-- Run this in Supabase Dashboard SQL Editor

-- Drop old index and column
DROP INDEX IF EXISTS servers_embedding_idx;
ALTER TABLE servers DROP COLUMN IF EXISTS embedding;

-- Add column with correct dimensions
ALTER TABLE servers ADD COLUMN embedding vector(3072);

-- Create index for similarity search
CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops);

-- Update match_servers function for 3072 dimensions
CREATE OR REPLACE FUNCTION match_servers(
  query_embedding vector(3072),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE(
  id text,
  name text,
  ip text,
  port int,
  description text,
  tags text[],
  icon text,
  status text,
  players_online int,
  max_players int,
  vote_count int,
  country_code text,
  version text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.ip,
    s.port,
    s.description,
    s.tags,
    s.icon,
    s.status,
    s.players_online,
    s.max_players,
    s.vote_count,
    s.country_code,
    s.version,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM servers s
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create view for embedding status
CREATE OR REPLACE VIEW servers_embedding_status AS
SELECT 
  COUNT(*) FILTER (WHERE embedding IS NOT NULL) as with_embeddings,
  COUNT(*) FILTER (WHERE embedding IS NULL) as without_embeddings,
  COUNT(*) as total
FROM servers;

-- Success message
SELECT 'Embedding schema updated to 3072 dimensions for Gemini compatibility' as result;
