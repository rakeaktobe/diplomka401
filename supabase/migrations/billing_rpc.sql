-- Create a secure RPC function to handle atomic billing transactions
CREATE OR REPLACE FUNCTION subscribe_to_tariff(p_user_id UUID, p_tariff_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Execute with the privileges of the user that created it
AS $$
DECLARE
  v_balance numeric;
  v_price numeric;
BEGIN
  -- 1. Fetch the user's current balance
  SELECT balance INTO v_balance FROM profiles WHERE id = p_user_id;
  
  -- Fetch the tariff price
  SELECT price INTO v_price FROM tariffs WHERE id = p_tariff_id;
  
  -- 2. Check if balance is sufficient
  IF v_balance < v_price THEN
    RAISE EXCEPTION 'INSUFFICIENT_FUNDS';
  END IF;
  
  -- 3. Perform the atomic transaction
  
  -- Deduct the price from the user's balance
  UPDATE profiles 
  SET balance = balance - v_price 
  WHERE id = p_user_id;
  
  -- Insert a payment record for the subscription fee
  INSERT INTO payments (user_id, amount, status, payment_method)
  VALUES (p_user_id, -v_price, 'fee', 'balance_deduction');
  
  -- Insert the active subscription
  INSERT INTO subscriptions (user_id, tariff_id, status, next_billing_date)
  VALUES (p_user_id, p_tariff_id, 'active', NOW() + INTERVAL '30 days');
  
END;
$$;
