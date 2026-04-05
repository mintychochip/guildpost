-- Add server icon/banner column
ALTER TABLE servers ADD COLUMN IF NOT EXISTS icon TEXT;
