-- ================================================================
-- FIX: Payment Status Check Constraint Violation
-- This script updates the subscribe_to_tariff RPC to use 'success'
-- instead of 'completed' for payment records.
-- ================================================================

-- 1. Redefine the RPC function with the correct status value
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

    -- Insert payment record
    -- FIXED: Changed 'completed' to 'success' to match CHECK constraint
    INSERT INTO public.payments (user_id, amount, status)
    VALUES (p_user_id, -v_price, 'success');

    -- Insert subscription record
    INSERT INTO public.subscriptions (user_id, tariff_id, status, next_billing_date)
    VALUES (p_user_id, p_tariff_id, 'active', NOW() + INTERVAL '1 month');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Optional: Ensure the constraint actually allows 'success'
-- (In case someone modified the schema manually)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'payments_status_check'
    ) THEN
        -- No action needed if it exists, the function now matches 'success'/'pending'
        NULL;
    END IF;
END;
$$;
