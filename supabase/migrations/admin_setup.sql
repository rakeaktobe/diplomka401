-- 1. Add a `role` column to the `profiles` table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Update the RLS (Row Level Security) policies for ALL tables 
-- ('profiles', 'tariffs', 'subscriptions', 'payments', 'tickets')

-- Ensure RLS is enabled on these tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- DROP existing policies with the same name if they exist to avoid conflicts when re-running
DROP POLICY IF EXISTS "Admin can perform any action on profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can perform any action on tariffs" ON tariffs;
DROP POLICY IF EXISTS "Admin can perform any action on subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admin can perform any action on payments" ON payments;
DROP POLICY IF EXISTS "Admin can perform any action on tickets" ON tickets;

-- profiles admin policy
CREATE POLICY "Admin can perform any action on profiles" 
ON profiles 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin') 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- tariffs admin policy
CREATE POLICY "Admin can perform any action on tariffs" 
ON tariffs 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin') 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- subscriptions admin policy
CREATE POLICY "Admin can perform any action on subscriptions" 
ON subscriptions 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin') 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- payments admin policy
CREATE POLICY "Admin can perform any action on payments" 
ON payments 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin') 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- tickets admin policy
CREATE POLICY "Admin can perform any action on tickets" 
ON tickets 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin') 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 3. Update statement to make a specific user the admin.
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@telecom.kz');
