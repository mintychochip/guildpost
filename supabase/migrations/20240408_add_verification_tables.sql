-- Migration: Add server verification and audit log tables
-- Run this in your Supabase SQL editor

-- Server Verifications Table
CREATE TABLE IF NOT EXISTS public.server_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id TEXT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    verification_token TEXT NOT NULL,
    owner_email TEXT,
    owner_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    last_checked TIMESTAMP WITH TIME ZONE,
    last_motd TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_server_verifications_server_id ON public.server_verifications(server_id);
CREATE INDEX IF NOT EXISTS idx_server_verifications_token ON public.server_verifications(verification_token);
CREATE INDEX IF NOT EXISTS idx_server_verifications_status ON public.server_verifications(status);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id TEXT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    actor TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit log lookups
CREATE INDEX IF NOT EXISTS idx_audit_logs_server_id ON public.audit_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Add columns to servers table if they don't exist
DO $$
BEGIN
    -- Add verified_owner column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'verified_owner') THEN
        ALTER TABLE public.servers ADD COLUMN verified_owner TEXT;
    END IF;
    
    -- Add verified_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'verified_at') THEN
        ALTER TABLE public.servers ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add verification_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'verification_id') THEN
        ALTER TABLE public.servers ADD COLUMN verification_id UUID REFERENCES public.server_verifications(id);
    END IF;
    
    -- Add updated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'servers' AND column_name = 'updated_at') THEN
        ALTER TABLE public.servers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.server_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for server_verifications
CREATE POLICY "Allow anon read" ON public.server_verifications
    FOR SELECT TO anon USING (true);
    
CREATE POLICY "Allow anon insert" ON public.server_verifications
    FOR INSERT TO anon WITH CHECK (true);
    
CREATE POLICY "Allow anon update" ON public.server_verifications
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- RLS Policies for audit_logs
CREATE POLICY "Allow anon read" ON public.audit_logs
    FOR SELECT TO anon USING (true);
    
CREATE POLICY "Allow anon insert" ON public.audit_logs
    FOR INSERT TO anon WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.server_verifications TO anon, authenticated, service_role;
GRANT ALL ON public.audit_logs TO anon, authenticated, service_role;

-- Function to clean up expired verifications (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE public.server_verifications
    SET status = 'expired'
    WHERE status = 'pending' AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.server_verifications IS 'Stores server ownership verification requests';
COMMENT ON TABLE public.audit_logs IS 'Audit trail for server changes and actions';
