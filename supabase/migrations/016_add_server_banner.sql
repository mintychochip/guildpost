-- Add banner URL column for server promotional banners
ALTER TABLE servers ADD COLUMN IF NOT EXISTS banner TEXT;
