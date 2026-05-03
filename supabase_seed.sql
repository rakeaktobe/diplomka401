-- ================================================================
-- ТЕЛЕКОМ: Realistic Seed Data — Phase 6
-- Run in Supabase SQL Editor AFTER the Phase 2 migration script.
-- ================================================================

-- First, add 'combo' and 'b2b' to the category constraint
alter table public.tariffs
  drop constraint if exists tariffs_category_check;

alter table public.tariffs
  add constraint tariffs_category_check
  check (category in ('internet', 'tv', 'mobile', 'combo', 'b2b'));

-- ── B2C Combo packages ──────────────────────────────────────────
insert into public.tariffs (name, speed_mbps, price, description, category) values

-- Flagship combo
('Black',
 500,
 12990,
 'Флагманский комбо-пакет: 500 Мбит/с + 2 SIM-карты с безлимитным интернетом + ТВ+ (170 каналов в HD/4K). Один счёт на всё.',
 'combo'),

-- Mid-tier combo
('Silver',
 200,
 9990,
 'Оптимальный комбо-пакет: 200 Мбит/с + 1 SIM-карта с безлимитным интернетом + ТВ+ (120 каналов). Для семьи из 3–4 человек.',
 'combo'),

-- Entry combo
('Bereke Combo',
 100,
 6990,
 'Стартовый комбо-пакет: 100 Мбит/с + 1 SIM-карта (20 ГБ) + ТВ Базовый (80 каналов).',
 'combo'),

-- ── B2C Internet-only ───────────────────────────────────────────
('Bereke Home',
 100,
 5990,
 'Надёжный домашний интернет до 100 Мбит/с. Безлимитный трафик, бесплатное подключение.',
 'internet'),

('Turbo 300',
 300,
 7990,
 'Высокоскоростной доступ до 300 Мбит/с. Идеален для 4K-стриминга и онлайн-игр.',
 'internet'),

('Гигабит',
 1000,
 10990,
 'Максимальная скорость до 1 Гбит/с по оптике. Для тех, кому нужно всё и сразу.',
 'internet'),

-- ── B2C TV-only ─────────────────────────────────────────────────
('ТВ Базовый',
 null,
 2490,
 '80 каналов в цифровом качестве, включая казахстанские государственные и региональные.',
 'tv'),

('ТВ Плюс',
 null,
 3990,
 '170 каналов HD/4K + 30 дней просмотра в записи. Включает детские, спортивные, кино-пакеты.',
 'tv'),

-- ── B2C Mobile-only ─────────────────────────────────────────────
('Мобильный Старт',
 null,
 1990,
 '10 ГБ интернета, безлимит на звонки внутри сети ТЕЛЕКОМ. 500 минут на другие операторы.',
 'mobile'),

('Мобильный Безлим',
 null,
 3490,
 'Безлимитный мобильный интернет + безлимитные звонки по всему Казахстану. Роуминг по СНГ.',
 'mobile'),

-- ── B2B packages ────────────────────────────────────────────────
-- B2B packages
('Бизнес Стандарт',
 300, 19900,
 'До 300 Мбит/с, статический IP, SLA 99.5%, выделенная линия поддержки, 5 SIM-карт.',
 'b2b'),

('Бизнес Премиум',
 1000, 39900,
 'До 1 Гбит/с, 2 статических IP, SLA 99.9%, персональный менеджер, безлимитные SIM.',
 'b2b'),

('Корпоративный',
 1000, 69900,
 'Выделенный канал 1 Гбит/с, мультисайт, MPLS, SLA 99.99%, круглосуточная NOC-поддержка.',
 'b2b')

on conflict do nothing;

-- ── News & Promos ────────────────────────────────────────────────
insert into public.news (title_ru, title_kk, title_en, excerpt_ru, excerpt_kk, excerpt_en, date_ru, date_kk, date_en, gradient, image_url, category) values
('Запуск 5G в регионах', 'Өңірлерде 5G іске қосылды', '5G Launch in Regions', 'Мы расширяем сеть 5G по всему Казахстану. Теперь еще больше городов...', 'Біз бүкіл Қазақстан бойынша 5G желісін кеңейтудеміз...', 'We are expanding the 5G network across Kazakhstan...', '15 мая 2026', '15 мамыр 2026', 'May 15, 2026', 'from-blue-600 to-indigo-600', null, 'news'),
('Новые каналы в TV+', 'TV+ жаңа арналар', 'New Channels in TV+', 'Добавлено более 20 новых спортивных и развлекательных каналов...', '20-дан астам жаңа спорттық және ойын-сауық арналары қосылды...', 'More than 20 new sports and entertainment channels added...', '10 мая 2026', '10 мамыр 2026', 'May 10, 2026', 'from-purple-600 to-pink-600', null, 'news'),
('Кешбэк 10% на оплату', 'Төлемге 10% кешбэк', '10% Cashback on Payment', 'Оплачивайте услуги картой и получайте бонусы на свой баланс...', 'Қызметтерді картамен төлеңіз және балансыңызға бонустар алыңыз...', 'Pay for services with a card and get bonuses on your balance...', '05 мая 2026', '05 мамыр 2026', 'May 5, 2026', 'from-emerald-600 to-teal-600', null, 'news'),
('Бонусная система', 'Бонустық жүйе', 'Bonus System', 'Участвуйте в нашей обновленной бонусной системе и экономьте на связи.', 'Біздің жаңартылған бонустық жүйеге қатысыңыз және байланысқа үнемдеңіз.', 'Participate in our updated bonus system and save on communication.', '01 мая 2026', '01 мамыр 2026', 'May 1, 2026', null, '/images/bonus system ad.png', 'promo'),
('Спорт на TV+', 'TV+ спорты', 'Sports on TV+', 'Все главные события мирового спорта в одном пакете подписок.', 'Әлемдік спорттың барлық басты оқиғалары бір жазылым пакетінде.', 'All the main events of world sports in one subscription package.', '28 апреля 2026', '28 сәуір 2026', 'April 28, 2026', null, '/images/sportline tv+ ad.png', 'promo')
on conflict do nothing;

on conflict do nothing;
