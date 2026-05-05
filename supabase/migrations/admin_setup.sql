-- 1. Add a `role` column to the `profiles` table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Create a function to check if the current user is an admin
-- SECURITY DEFINER allows this function to bypass RLS when checking the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update the RLS (Row Level Security) policies for ALL tables 
-- ('profiles', 'tariffs', 'subscriptions', 'payments', 'tickets')

-- Ensure RLS is enabled on these tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin can perform any action on profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can perform any action on tariffs" ON tariffs;
DROP POLICY IF EXISTS "Admin can perform any action on subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admin can perform any action on payments" ON payments;
DROP POLICY IF EXISTS "Admin can perform any action on tickets" ON tickets;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Admins have full access to tariffs" ON tariffs;
DROP POLICY IF EXISTS "Admins have full access to subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins have full access to payments" ON payments;
DROP POLICY IF EXISTS "Admins have full access to tickets" ON tickets;

-- profiles admin policy
CREATE POLICY "Admins have full access to profiles" 
ON profiles FOR ALL TO authenticated USING (is_admin());

-- tariffs admin policy
CREATE POLICY "Admins have full access to tariffs" 
ON tariffs FOR ALL TO authenticated USING (is_admin());

-- subscriptions admin policy
CREATE POLICY "Admins have full access to subscriptions" 
ON subscriptions FOR ALL TO authenticated USING (is_admin());

-- payments admin policy
CREATE POLICY "Admins have full access to payments" 
ON payments FOR ALL TO authenticated USING (is_admin());

-- tickets admin policy
CREATE POLICY "Admins have full access to tickets" 
ON tickets FOR ALL TO authenticated USING (is_admin());

-- 4. Update statement to make a specific user the admin.
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@telecom.kz');
