# Semantic Search Setup Guide

## Problem Fixed
The original migration had wrong embedding dimensions (768 instead of 3072). Gemini's `text-embedding-004` produces 3072-dimensional vectors.

## Setup Steps

### 1. Run the Migration in Supabase

Go to Supabase SQL Editor and run:

```sql
-- Check current embedding status
SELECT * FROM servers_embedding_status;

-- Run migration: contents of supabase/migrations/20260407220000_fix_semantic_search.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 2. Set Cloudflare Pages Secrets

For Cloudflare Pages, environment variables are set differently than Workers:

**Via Cloudflare Dashboard:**
1. Go to Workers & Pages > guildpost > Settings > Environment variables
2. Add production variables:
   - `GEMINI_API_KEY` - Get from https://aistudio.google.com/apikey
   - `SUPABASE_SERVICE_KEY` - Get from Supabase Dashboard > Settings > API > service_role

**Via Wrangler CLI:**
```bash
# For Pages projects, use wrangler pages secret
wrangler pages secret put GEMINI_API_KEY
wrangler pages secret put SUPABASE_SERVICE_KEY
```

### 3. Generate Embeddings

Run the embedding generation script:

```bash
cd scripts
npm install @supabase/supabase-js

# Test Gemini connection first
GEMINI_API_KEY=your_key SUPABASE_SERVICE_KEY=your_key node generate-embeddings-gemini.mjs --test

# Check status
GEMINI_API_KEY=your_key SUPABASE_SERVICE_KEY=your_key node generate-embeddings-gemini.mjs --status

# Generate embeddings
GEMINI_API_KEY=your_key SUPABASE_SERVICE_KEY=your_key node generate-embeddings-gemini.mjs
```

### 4. Verify

Test the API endpoint:

```bash
curl -X POST https://guildpost.tech/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "pvp factions server", "limit": 5}'
```

## Quick Fix for Testing

If you just want to test, set the env vars in `.env` locally and use:

```bash
# Create .env file
echo "GEMINI_API_KEY=your_key" >> .env
echo "SUPABASE_SERVICE_KEY=your_key" >> .env

# Run with dotenv
node -r dotenv/config scripts/generate-embeddings-gemini.mjs
```

## Troubleshooting

### "GEMINI_API_KEY not configured"
- The secret isn't set in Cloudflare Pages
- Check Workers & Pages > Settings > Environment variables

### "No servers have embeddings"
- Run the generate-embeddings-gemini.mjs script
- Check servers_embedding_status view

### "Search returned 0 results"
- Lower the match_threshold (default 0.5, try 0.3)
- Make sure embeddings exist: SELECT COUNT(*) FROM servers WHERE embedding IS NOT NULL

### "Wrong embedding dimension"
- The old migration used vector(768)
- Run the fix migration to recreate as vector(3072)
