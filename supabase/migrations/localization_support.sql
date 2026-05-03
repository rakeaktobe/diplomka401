-- Localize tariffs
ALTER TABLE public.tariffs RENAME COLUMN name TO name_ru;
ALTER TABLE public.tariffs RENAME COLUMN description TO description_ru;
ALTER TABLE public.tariffs ADD COLUMN name_kk TEXT;
ALTER TABLE public.tariffs ADD COLUMN name_en TEXT;
ALTER TABLE public.tariffs ADD COLUMN description_kk TEXT;
ALTER TABLE public.tariffs ADD COLUMN description_en TEXT;

-- Update existing records to have at least some data
UPDATE public.tariffs SET name_kk = name_ru, name_en = name_ru;
UPDATE public.tariffs SET description_kk = description_ru, description_en = description_ru;

-- Create News table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ru TEXT,
    title_kk TEXT,
    title_en TEXT,
    excerpt_ru TEXT,
    excerpt_kk TEXT,
    excerpt_en TEXT,
    content_ru TEXT,
    content_kk TEXT,
    content_en TEXT,
    date_ru TEXT,
    date_kk TEXT,
    date_en TEXT,
    gradient TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'news', -- 'news' or 'promo'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "News are viewable by everyone" ON public.news;
CREATE POLICY "News are viewable by everyone" ON public.news FOR SELECT USING (true);

-- Create Hero Slides table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT,
    badge_ru TEXT,
    badge_kk TEXT,
    badge_en TEXT,
    title_ru TEXT,
    title_kk TEXT,
    title_en TEXT,
    subtitle_ru TEXT,
    subtitle_kk TEXT,
    subtitle_en TEXT,
    cta_ru TEXT,
    cta_kk TEXT,
    cta_en TEXT,
    cta_href TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hero slides are viewable by everyone" ON public.hero_slides;
CREATE POLICY "Hero slides are viewable by everyone" ON public.hero_slides FOR SELECT USING (true);

-- Seed Hero Slides
INSERT INTO public.hero_slides (image_url, badge_ru, badge_kk, badge_en, title_ru, title_kk, title_en, subtitle_ru, subtitle_kk, subtitle_en, cta_ru, cta_kk, cta_en, cta_href, display_order)
VALUES 
('/images/baige 5g ad.png', '5G Интернет', '5G Интернеті', '5G Internet', 'Скорость нового поколения', 'Жаңа буын жылдамдығы', 'Next-gen speed', 'Подключайте 5G от Kazakhtelecom...', 'Kazakhtelecom 5G желісін қосыңыз...', 'Connect 5G from Kazakhtelecom...', 'Подключить сейчас', 'Қазір қосылу', 'Connect now', '/internet/home', 1),
('/images/kazakhtelecom prime ad.png', 'Premium Подписка', 'Premium Жазылым', 'Premium Subscription', 'Kazakhtelecom Prime', 'Kazakhtelecom Prime', 'Kazakhtelecom Prime', 'Единая подписка на интернет...', 'Интернетке бірыңғай жазылым...', 'Single subscription for internet...', 'Узнать больше', 'Көбірек білу', 'Learn more', '/combo', 2);
