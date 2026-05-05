-- ================================================================
-- KAZAKHTELECOM — MASTER DATABASE SETUP & FIX
-- Один скрипт для полной настройки БД и исправления всех ошибок.
-- Абсолютно безопасен для повторного запуска (Idempotent).
-- ================================================================

-- 1. РАСШИРЕНИЯ
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ТАБЛИЦЫ
-- Создаем таблицы, если их нет
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  balance NUMERIC DEFAULT 0.0,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tariffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ru TEXT NOT NULL,
  name_kk TEXT,
  name_en TEXT,
  speed_mbps INTEGER,
  price NUMERIC NOT NULL,
  description_ru TEXT,
  description_kk TEXT,
  description_en TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tariff_id UUID REFERENCES public.tariffs(id)  ON DELETE RESTRICT NOT NULL,
  status TEXT DEFAULT 'pending',
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount     NUMERIC NOT NULL,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject     TEXT NOT NULL,
  description TEXT NOT NULL,
  status      TEXT DEFAULT 'open',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ru TEXT, title_kk TEXT, title_en TEXT,
    excerpt_ru TEXT, excerpt_kk TEXT, excerpt_en TEXT,
    content_ru TEXT, content_kk TEXT, content_en TEXT,
    gradient TEXT, image_url TEXT,
    category TEXT DEFAULT 'news',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.1. ДОБАВЛЕНИЕ КОЛОНОК (для старых баз, где таблицы уже были)
DO $$
BEGIN
    BEGIN ALTER TABLE public.profiles ADD COLUMN balance NUMERIC DEFAULT 0.0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user'; EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN ALTER TABLE public.tariffs ADD COLUMN name_kk TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.tariffs ADD COLUMN name_en TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.tariffs ADD COLUMN description_kk TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.tariffs ADD COLUMN description_en TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.tariffs ADD COLUMN category TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN ALTER TABLE public.subscriptions ADD COLUMN next_billing_date TIMESTAMPTZ; EXCEPTION WHEN duplicate_column THEN NULL; END;

    BEGIN ALTER TABLE public.news ADD COLUMN title_kk TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN title_en TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN excerpt_kk TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN excerpt_en TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN content_kk TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN content_en TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN gradient TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN image_url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.news ADD COLUMN category TEXT DEFAULT 'news'; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- 2.2. ИСПРАВЛЕНИЕ ОГРАНИЧЕНИЙ И ДАННЫХ
-- Конвертируем старые статусы
UPDATE public.payments SET status = 'success' WHERE status = 'completed';

-- Безопасно удаляем старые строгие чек-констрейнты, чтобы не было ошибок при вставке
DO $$ 
BEGIN
    BEGIN ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_status_check; EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN ALTER TABLE public.tariffs DROP CONSTRAINT IF EXISTS tariffs_category_check; EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check; EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_status_check; EXCEPTION WHEN undefined_object THEN NULL; END;
END $$;

-- 3. БЕЗОПАСНОСТЬ (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Политики доступа (дропаем старые для чистоты)
DROP POLICY IF EXISTS "Public read access" ON public.tariffs;
CREATE POLICY "Public read access" ON public.tariffs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read news" ON public.news;
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own payments" ON public.payments;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own payments" ON public.payments;
CREATE POLICY "Users insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own tickets" ON public.tickets;
CREATE POLICY "Users view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own tickets" ON public.tickets;
CREATE POLICY "Users insert own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own tickets" ON public.tickets;
CREATE POLICY "Users update own tickets" ON public.tickets FOR UPDATE USING (auth.uid() = user_id);

-- 4. ТРИГГЕР: Автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, balance, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 0.0, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. ИСПРАВЛЕННАЯ ФУНКЦИЯ ПОДПИСКИ (FIX)
CREATE OR REPLACE FUNCTION public.subscribe_to_tariff(p_user_id UUID, p_tariff_id UUID)
RETURNS void AS $$
DECLARE
    v_balance NUMERIC;
    v_price NUMERIC;
BEGIN
    SELECT balance INTO v_balance FROM public.profiles WHERE id = p_user_id;
    SELECT price INTO v_price FROM public.tariffs WHERE id = p_tariff_id;

    IF v_price IS NULL THEN RAISE EXCEPTION 'TARIFF_NOT_FOUND'; END IF;
    IF v_balance < v_price THEN RAISE EXCEPTION 'INSUFFICIENT_FUNDS'; END IF;

    -- Списание
    UPDATE public.profiles SET balance = balance - v_price WHERE id = p_user_id;

    -- Статус 'success' (был 'completed')
    INSERT INTO public.payments (user_id, amount, status)
    VALUES (p_user_id, -v_price, 'success');

    -- Активация подписки
    INSERT INTO public.subscriptions (user_id, tariff_id, status, next_billing_date)
    VALUES (p_user_id, p_tariff_id, 'active', NOW() + INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ТЕСТОВЫЕ ДАННЫЕ (SEED - без дубликатов)
INSERT INTO public.tariffs (name_ru, speed_mbps, price, category, description_ru)
SELECT 'Bereke Home', 100, 5990, 'internet', 'Надёжный интернет до 100 Мбит/с'
WHERE NOT EXISTS (SELECT 1 FROM public.tariffs WHERE name_ru = 'Bereke Home');

INSERT INTO public.tariffs (name_ru, speed_mbps, price, category, description_ru)
SELECT 'Turbo 300', 300, 7990, 'internet', 'Высокоскоростной интернет 300 Мбит/с'
WHERE NOT EXISTS (SELECT 1 FROM public.tariffs WHERE name_ru = 'Turbo 300');

INSERT INTO public.tariffs (name_ru, speed_mbps, price, category, description_ru)
SELECT 'Black', 500, 12990, 'combo', '500 Мбит/с + SIM + TV+'
WHERE NOT EXISTS (SELECT 1 FROM public.tariffs WHERE name_ru = 'Black');

INSERT INTO public.tariffs (name_ru, speed_mbps, price, category, description_ru)
SELECT 'Silver', 200, 9990, 'combo', '200 Мбит/с + SIM + TV+'
WHERE NOT EXISTS (SELECT 1 FROM public.tariffs WHERE name_ru = 'Silver');

INSERT INTO public.news (title_ru, excerpt_ru, category, gradient)
SELECT 'Запуск 5G в регионах', 'Мы расширяем сеть 5G по всему Казахстану...', 'news', 'from-blue-600 to-indigo-600'
WHERE NOT EXISTS (SELECT 1 FROM public.news WHERE title_ru = 'Запуск 5G в регионах');

INSERT INTO public.news (title_ru, excerpt_ru, category, gradient)
SELECT 'Кешбэк 10% на оплату', 'Оплачивайте услуги картой и получайте бонусы...', 'news', 'from-emerald-600 to-teal-600'
WHERE NOT EXISTS (SELECT 1 FROM public.news WHERE title_ru = 'Кешбэк 10% на оплату');
