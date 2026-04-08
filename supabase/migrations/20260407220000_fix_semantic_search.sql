-- Fix Semantic Search - Correct embedding dimensions for Gemini
-- Gemini embedding-001 produces 3072 dimensions, not 768

-- Drop the old index and column
DROP INDEX IF EXISTS servers_embedding_idx;
ALTER TABLE servers DROP COLUMN IF EXISTS embedding;

-- Add embedding column with correct dimensions
ALTER TABLE servers ADD COLUMN embedding vector(3072);

-- Create index for fast similarity search
CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops);

-- Fix the match_servers function to use correct dimension
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

-- Function to update a single server's embedding
CREATE OR REPLACE FUNCTION update_server_embedding(
  server_id text,
  new_embedding vector(3072)
)
RETURNS void AS $$
BEGIN
  UPDATE servers SET embedding = new_embedding WHERE id = server_id;
END;
$$ LANGUAGE plpgsql;

-- View to check which servers have embeddings
CREATE OR REPLACE VIEW servers_embedding_status AS
SELECT 
  COUNT(*) FILTER (WHERE embedding IS NOT NULL) as with_embeddings,
  COUNT(*) FILTER (WHERE embedding IS NULL) as without_embeddings,
  COUNT(*) as total
FROM servers;
