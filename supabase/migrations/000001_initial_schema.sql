-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 1: TABLE CREATION

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    balance NUMERIC DEFAULT 0,
    role TEXT DEFAULT 'user'
);

-- Ensure columns exist in case the table was created in an earlier phase
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Tariffs Table
CREATE TABLE IF NOT EXISTS public.tariffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    speed_mbps INTEGER,
    price NUMERIC,
    description TEXT,
    category TEXT
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tariff_id UUID REFERENCES public.tariffs(id) ON DELETE CASCADE,
    status TEXT,
    next_billing_date TIMESTAMP WITH TIME ZONE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT,
    description TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Network Status Table
CREATE TABLE IF NOT EXISTS public.network_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region TEXT,
    status TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: TRIGGERS (AUTH -> PROFILES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to make it idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- STEP 3: ROW LEVEL SECURITY (RLS) & POLICIES

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_status ENABLE ROW LEVEL SECURITY;

    -- Public Access Policies
    DROP POLICY IF EXISTS "Tariffs are viewable by everyone" ON public.tariffs;
    CREATE POLICY "Tariffs are viewable by everyone" ON public.tariffs FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Network status is viewable by everyone" ON public.network_status;
    CREATE POLICY "Network status is viewable by everyone" ON public.network_status FOR SELECT USING (true);

    -- User Access Policies
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
    CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
    CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
    CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert own tickets" ON public.tickets;
    CREATE POLICY "Users can insert own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Admin Access Policies (Overrides others if Admin)
    -- Profiles Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
    CREATE POLICY "Admins have full access to profiles" ON public.profiles 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

    -- Tariffs Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to tariffs" ON public.tariffs;
    CREATE POLICY "Admins have full access to tariffs" ON public.tariffs 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

    -- Subscriptions Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to subscriptions" ON public.subscriptions;
    CREATE POLICY "Admins have full access to subscriptions" ON public.subscriptions 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

    -- Payments Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;
    CREATE POLICY "Admins have full access to payments" ON public.payments 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

    -- Tickets Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to tickets" ON public.tickets;
    CREATE POLICY "Admins have full access to tickets" ON public.tickets 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

    -- Network Status Admin Policy
    DROP POLICY IF EXISTS "Admins have full access to network_status" ON public.network_status;
    CREATE POLICY "Admins have full access to network_status" ON public.network_status 
    FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );


-- STEP 4: BILLING RPC (REMOTE PROCEDURE CALL)
CREATE OR REPLACE FUNCTION public.subscribe_to_tariff(p_user_id UUID, p_tariff_id UUID)
RETURNS void AS $$
DECLARE
    v_balance NUMERIC;
    v_price NUMERIC;
BEGIN
    -- Get user balance
    SELECT balance INTO v_balance FROM public.profiles WHERE id = p_user_id;
    
    -- Get tariff price
    SELECT price INTO v_price FROM public.tariffs WHERE id = p_tariff_id;

    -- Check if tariff exists
    IF v_price IS NULL THEN
        RAISE EXCEPTION 'TARIFF_NOT_FOUND';
    END IF;

    -- Check balance
    IF v_balance < v_price THEN
        RAISE EXCEPTION 'INSUFFICIENT_FUNDS';
    END IF;

    -- Deduct balance
    UPDATE public.profiles
    SET balance = balance - v_price
    WHERE id = p_user_id;

    -- Insert payment record (negative for deduction)
    INSERT INTO public.payments (user_id, amount, status)
    VALUES (p_user_id, -v_price, 'success');

    -- Insert subscription record
    INSERT INTO public.subscriptions (user_id, tariff_id, status, next_billing_date)
    VALUES (p_user_id, p_tariff_id, 'active', NOW() + INTERVAL '1 month');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- STEP 5: ADMIN SEED
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'admin@telecom.kz'
);
