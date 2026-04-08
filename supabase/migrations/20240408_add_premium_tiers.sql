-- Migration: Add premium tier support for server monetization
-- Run this in your Supabase SQL editor

-- Add tier columns to servers table
DO $$
BEGIN
    -- Add tier column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'tier') THEN
        ALTER TABLE public.servers ADD COLUMN tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'elite'));
    END IF;
    
    -- Add featured_until column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'featured_until') THEN
        ALTER TABLE public.servers ADD COLUMN featured_until TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add stripe_customer_id for payment tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.servers ADD COLUMN stripe_customer_id TEXT;
    END IF;
    
    -- Add stripe_subscription_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE public.servers ADD COLUMN stripe_subscription_id TEXT;
    END IF;
    
    -- Add premium_since timestamp
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'premium_since') THEN
        ALTER TABLE public.servers ADD COLUMN premium_since TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create index for tier lookups
CREATE INDEX IF NOT EXISTS idx_servers_tier ON public.servers(tier);
CREATE INDEX IF NOT EXISTS idx_servers_featured_until ON public.servers(featured_until) WHERE featured_until IS NOT NULL;

-- Table to track premium subscriptions (for history/auditing)
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id TEXT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('premium', 'elite')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    amount_paid DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_server_id ON public.premium_subscriptions(server_id);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status ON public.premium_subscriptions(status);

-- Table for tracking server analytics (views, clicks)
CREATE TABLE IF NOT EXISTS public.server_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id TEXT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    click_throughs INTEGER DEFAULT 0,
    votes_received INTEGER DEFAULT 0,
    avg_session_seconds INTEGER,
    referrer_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(server_id, date)
);

-- Index for analytics lookups
CREATE INDEX IF NOT EXISTS idx_server_analytics_server_id ON public.server_analytics(server_id);
CREATE INDEX IF NOT EXISTS idx_server_analytics_date ON public.server_analytics(date DESC);

-- Enable RLS on new tables
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for premium_subscriptions
CREATE POLICY "Allow anon read" ON public.premium_subscriptions
    FOR SELECT TO anon USING (true);
    
CREATE POLICY "Allow service role all" ON public.premium_subscriptions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS Policies for server_analytics
CREATE POLICY "Allow anon read" ON public.server_analytics
    FOR SELECT TO anon USING (true);
    
CREATE POLICY "Allow service role all" ON public.server_analytics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Function to increment analytics counters
CREATE OR REPLACE FUNCTION increment_server_analytics(
    p_server_id TEXT,
    p_field TEXT,
    p_value INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO public.server_analytics (server_id, date, page_views, unique_visitors, click_throughs, votes_received)
    VALUES (p_server_id, today, 0, 0, 0, 0)
    ON CONFLICT (server_id, date) DO NOTHING;
    
    CASE p_field
        WHEN 'page_views' THEN
            UPDATE public.server_analytics SET page_views = page_views + p_value, updated_at = NOW()
            WHERE server_id = p_server_id AND date = today;
        WHEN 'unique_visitors' THEN
            UPDATE public.server_analytics SET unique_visitors = unique_visitors + p_value, updated_at = NOW()
            WHERE server_id = p_server_id AND date = today;
        WHEN 'click_throughs' THEN
            UPDATE public.server_analytics SET click_throughs = click_throughs + p_value, updated_at = NOW()
            WHERE server_id = p_server_id AND date = today;
        WHEN 'votes_received' THEN
            UPDATE public.server_analytics SET votes_received = votes_received + p_value, updated_at = NOW()
            WHERE server_id = p_server_id AND date = today;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get featured servers (for homepage spotlight)
CREATE OR REPLACE FUNCTION get_featured_servers(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    ip TEXT,
    port INTEGER,
    tier TEXT,
    vote_count INTEGER,
    players_online INTEGER,
    max_players INTEGER,
    status TEXT,
    featured_until TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.ip,
        s.port,
        s.tier,
        s.vote_count,
        s.players_online,
        s.max_players,
        s.status,
        s.featured_until
    FROM public.servers s
    WHERE s.tier = 'elite' 
      AND (s.featured_until IS NULL OR s.featured_until > NOW())
      AND s.status = 'online'
    ORDER BY s.vote_count DESC, s.players_online DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get priority servers (for listing pages)
CREATE OR REPLACE FUNCTION get_priority_servers(
    category_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    ip TEXT,
    port INTEGER,
    tier TEXT,
    vote_count INTEGER,
    players_online INTEGER,
    max_players INTEGER,
    status TEXT,
    description TEXT,
    tags TEXT[],
    version TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.ip,
        s.port,
        s.tier,
        s.vote_count,
        s.players_online,
        s.max_players,
        s.status,
        s.description,
        s.tags,
        s.version
    FROM public.servers s
    WHERE s.status = 'online'
      AND (category_filter IS NULL OR category_filter = ANY(s.tags))
    ORDER BY 
        CASE s.tier 
            WHEN 'elite' THEN 3 
            WHEN 'premium' THEN 2 
            ELSE 1 
        END DESC,
        s.vote_count DESC,
        s.players_online DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON public.premium_subscriptions TO anon, authenticated, service_role;
GRANT ALL ON public.server_analytics TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_server_analytics TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_featured_servers TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_priority_servers TO anon, authenticated, service_role;

COMMENT ON TABLE public.premium_subscriptions IS 'Tracks premium subscription history for servers';
COMMENT ON TABLE public.server_analytics IS 'Daily analytics metrics for server listings';
COMMENT ON FUNCTION increment_server_analytics IS 'Atomically increment an analytics counter for a server';
COMMENT ON FUNCTION get_featured_servers IS 'Returns elite-tier servers eligible for homepage spotlight';
COMMENT ON FUNCTION get_priority_servers IS 'Returns servers ordered by tier priority for listings';