-- Add RLS policy to allow anonymous read access to servers table

-- First, enable RLS if not already enabled
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anon read" ON servers;

-- Create policy allowing anonymous users to read servers
CREATE POLICY "Allow anon read"
ON servers
FOR SELECT
TO anon
USING (true);

-- Also create policy for authenticated users (if needed later)
DROP POLICY IF EXISTS "Allow auth read" ON servers;
CREATE POLICY "Allow auth read"
ON servers
FOR SELECT
TO authenticated
USING (true);

-- Note: Insert/Update/Delete policies should be restricted to server owners/admins
-- For now, submissions go through Edge Functions which use service_role key