-- Add Version & Country Filters Migration
-- Adds version and country columns for filtering

-- Add country column for geo-location
ALTER TABLE servers 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Add version normalization (for filtering by major version)
ALTER TABLE servers
ADD COLUMN IF NOT EXISTS version_normalized TEXT;

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_servers_country ON servers(country_code);
CREATE INDEX IF NOT EXISTS idx_servers_version ON servers(version_normalized);

-- Function to normalize version strings
CREATE OR REPLACE FUNCTION normalize_mc_version(version TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Extract major.minor version (e.g., "1.21.11" -> "1.21")
  IF version IS NULL THEN RETURN NULL; END IF;
  
  RETURN regexp_replace(
    regexp_replace(version, '[^0-9.]', '', 'g'),
    '^([0-9]+\.[0-9]+).*$', '\1'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-normalize version on insert/update
CREATE OR REPLACE FUNCTION update_version_normalized()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version_normalized := normalize_mc_version(NEW.version);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_version_normalized ON servers;
CREATE TRIGGER trigger_version_normalized
BEFORE INSERT OR UPDATE ON servers
FOR EACH ROW
EXECUTE FUNCTION update_version_normalized();

-- View for distinct versions with counts
CREATE OR REPLACE VIEW server_versions AS
SELECT 
  version_normalized as version,
  COUNT(*) as server_count
FROM servers
WHERE version_normalized IS NOT NULL
GROUP BY version_normalized
ORDER BY version_normalized DESC;

-- View for distinct countries with counts
CREATE OR REPLACE VIEW server_countries AS
SELECT 
  country,
  country_code,
  COUNT(*) as server_count
FROM servers
WHERE country IS NOT NULL
GROUP BY country, country_code
ORDER BY server_count DESC;

-- Function to update country from IP (for use with Cloudflare Workers)
CREATE OR REPLACE FUNCTION update_server_country(
  server_id TEXT,
  country_name TEXT,
  country_code_input TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE servers
  SET country = country_name,
      country_code = country_code_input
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql;
