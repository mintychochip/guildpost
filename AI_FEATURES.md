# 🤖 AI-Powered Features Setup Guide

This guide explains how to set up the AI semantic search features for GuildPost.

## Features

1. **AI Semantic Search** - Users can search by describing what they want (e.g., "pvp factions with economy")
2. **AI Search Suggestions** - Smart autocomplete powered by Gemma 4B

## Architecture

- **Frontend**: Astro pages with JavaScript for AI toggle
- **Backend**: Cloudflare Workers calling Gemini API
- **Database**: Supabase with pgvector extension for embeddings
- **AI Models**:
  - `text-embedding-004` for embeddings (Gemini)
  - `gemma-3-4b-it` for text generation (Gemma 4B)

## Setup Steps

### 1. Enable pgvector in Supabase

Run the SQL in `supabase/migrations/003_semantic_search.sql`:

```bash
# Connect to Supabase and run:
psql $SUPABASE_URL -f supabase/migrations/003_semantic_search.sql
```

Or run in Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
-- ... (see full SQL in file)
```

### 2. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Copy the key for the next step

### 3. Deploy Cloudflare Worker

```bash
# Install wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set secrets
wrangler secret put SUPABASE_SERVICE_KEY
# (Enter your Supabase service_role key)

wrangler secret put GEMINI_API_KEY
# (Enter your Gemini API key)

# Deploy the worker
wrangler deploy
```

### 4. Generate Embeddings for Existing Servers

```bash
# Install dependencies
cd scripts
npm install @supabase/supabase-js

# Run embedding generation (requires deployed worker)
node generate-embeddings.mjs

# Or test if worker is working first
node generate-embeddings.mjs --test
```

**Note**: This will use the Gemini API to generate embeddings for each server based on:
- Server name
- Description
- Tags

### 5. Configure Frontend

The frontend is already configured. The AI search toggle will appear on the minecraft page.

**API Endpoints**:
- `POST /api/search/semantic` - AI semantic search (uses Gemini embeddings)
- `GET /api/search/suggestions` - AI search suggestions (uses Gemma 4B)
- `POST /api/embed` - Generate embeddings for a text string

## Usage

### For Users

1. Go to `/minecraft` page
2. Click the "Semantic" button to toggle AI search
3. Type natural language queries like:
   - "pvp factions server with economy"
   - "chill survival smp for building"
   - "competitive bedwars with tournaments"

### For Developers

Test the semantic search endpoint:
```bash
curl -X POST https://guildpost-api.your-subdomain.workers.dev/search/semantic \
  -H "Content-Type: application/json" \
  -d '{"query": "pvp factions server", "limit": 5}'
```

## How It Works

### Semantic Search

1. User enters natural language query
2. Worker calls Gemini `text-embedding-004` to generate embedding
3. Searches Supabase using pgvector cosine similarity
4. Returns servers ranked by semantic relevance

### Search Suggestions

1. User types partial query
2. Worker calls `gemma-3-4b-it` via Gemini API
3. Returns 5 relevant completions

## API Pricing

**Gemini API (Google AI Studio)**:
- Free tier available with generous limits
- `text-embedding-004`: Free for reasonable use
- `gemma-3-4b-it`: Free tier available

See [Google AI Studio pricing](https://ai.google.dev/pricing) for current limits.

## Troubleshooting

### Embeddings not generating
- Check Worker is deployed and accessible
- Verify `GEMINI_API_KEY` secret is set correctly
- Check pgvector extension is enabled in Supabase

### AI search not working
- Verify `GEMINI_API_KEY` is set in wrangler secrets
- Check browser console for errors
- Check Cloudflare Workers logs for API errors

### "GEMINI_API_KEY not configured" error
```bash
wrangler secret put GEMINI_API_KEY
# Enter your API key from Google AI Studio
```

## Next Steps

1. **Fine-tune embeddings** - Optimize for Minecraft-specific language
2. **Add recommendation engine** - "Servers like this" based on embeddings
3. **Cache popular queries** - Reduce API calls for common searches
4. **Add query expansion** - Automatically expand abbreviations (SMP → Survival Multiplayer)

## API Reference

### POST /api/search/semantic
```json
{
  "query": "pvp factions server",
  "limit": 10
}
```

Response:
```json
{
  "query": "pvp factions server",
  "results": [...],
  "count": 10,
  "semantic": true
}
```

### GET /api/search/suggestions?q=pvp
Response:
```json
{
  "query": "pvp",
  "suggestions": [
    "pvp factions server",
    "pvp anarchy server",
    "pvp minigames server"
  ]
}
```

### POST /api/embed
```json
{
  "text": "A fun survival server with custom enchants"
}
```

Response:
```json
{
  "embedding": [0.123, -0.456, ...],
  "dimensions": 768
}
```

---

**Note**: AI features use Gemini API via Cloudflare Workers. Regular search (by name/IP) works without AI enabled.
