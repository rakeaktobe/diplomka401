-- ================================================================
-- ТЕЛЕКОМ — Complete Database Setup
-- Single idempotent script: run this in the Supabase SQL Editor.
-- Safe to run multiple times. Order: Extensions → Tables →
-- Schema patches → RLS → Policies → Triggers → Dedup → Seed data.
-- ================================================================


-- ════════════════════════════════════════════════════════════════
-- 1. EXTENSIONS
-- ════════════════════════════════════════════════════════════════
create extension if not exists "uuid-ossp";


-- ════════════════════════════════════════════════════════════════
-- 2. TABLES  (all idempotent via IF NOT EXISTS)
-- ════════════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade not null primary key,
  full_name   text,
  phone       text,
  address     text,
  balance     numeric default 0.0,
  created_at  timestamptz default timezone('utc', now()) not null,
  updated_at  timestamptz default timezone('utc', now()) not null
);

-- NOTE: category intentionally supports internet|tv|mobile|combo|b2b
create table if not exists public.tariffs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  speed_mbps  integer,
  price       numeric not null,
  description text,
  category    text check (category in ('internet','tv','mobile','combo','b2b')),
  created_at  timestamptz default timezone('utc', now()) not null
);

create table if not exists public.subscriptions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references public.profiles(id) on delete cascade not null,
  tariff_id         uuid references public.tariffs(id)  on delete restrict not null,
  status            text check (status in ('active','pending','cancelled')) default 'pending',
  next_billing_date timestamptz,
  created_at        timestamptz default timezone('utc', now()) not null
);

create table if not exists public.payments (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.profiles(id) on delete cascade not null,
  amount     numeric not null,
  status     text check (status in ('success','pending')) default 'pending',
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.tickets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  subject     text not null,
  description text not null,
  status      text check (status in ('open','in_progress','closed')) default 'open',
  created_at  timestamptz default timezone('utc', now()) not null
);

create table if not exists public.network_status (
  id         uuid primary key default uuid_generate_v4(),
  region     text not null,
  status     text check (status in ('online','degraded','offline')) default 'online',
  updated_at timestamptz default timezone('utc', now()) not null,
  unique (region)
);


-- ════════════════════════════════════════════════════════════════
-- 3. SCHEMA PATCHES  (upgrade existing installs without data loss)
-- ════════════════════════════════════════════════════════════════

-- Widen the tariffs category check constraint to include combo & b2b.
-- Drops the old 3-value constraint if it still exists.
do $$
begin
  if exists (
    select 1
    from   information_schema.check_constraints
    where  constraint_name = 'tariffs_category_check'
      and  check_clause not like '%combo%'
  ) then
    alter table public.tariffs drop constraint if exists tariffs_category_check;
    alter table public.tariffs
      add constraint tariffs_category_check
      check (category in ('internet','tv','mobile','combo','b2b'));
  end if;
end;
$$;


-- ════════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY  (idempotent — enable is a no-op if on)
-- ════════════════════════════════════════════════════════════════
alter table public.profiles       enable row level security;
alter table public.tariffs        enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.payments       enable row level security;
alter table public.tickets        enable row level security;
alter table public.network_status enable row level security;


-- ════════════════════════════════════════════════════════════════
-- 5. RLS POLICIES  (drop-then-create = fully idempotent)
-- ════════════════════════════════════════════════════════════════

-- ── tariffs (public read) ────────────────────────────────────────
drop policy if exists "Tariffs are viewable by everyone"    on public.tariffs;
create policy          "Tariffs are viewable by everyone"   on public.tariffs
  for select using (true);

-- ── network_status (public read) ────────────────────────────────
drop policy if exists "Network status is viewable by everyone"   on public.network_status;
create policy          "Network status is viewable by everyone"  on public.network_status
  for select using (true);

-- ── profiles ─────────────────────────────────────────────────────
drop policy if exists "Users can view own profile"   on public.profiles;
create policy          "Users can view own profile"  on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile"   on public.profiles;
create policy          "Users can update own profile"  on public.profiles
  for update using (auth.uid() = id);

-- ── subscriptions ────────────────────────────────────────────────
drop policy if exists "Users can view own subscriptions"   on public.subscriptions;
create policy          "Users can view own subscriptions"  on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscriptions"   on public.subscriptions;
create policy          "Users can insert own subscriptions"  on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscriptions"   on public.subscriptions;
create policy          "Users can update own subscriptions"  on public.subscriptions
  for update using (auth.uid() = user_id);

-- ── payments ─────────────────────────────────────────────────────
drop policy if exists "Users can view own payments"   on public.payments;
create policy          "Users can view own payments"  on public.payments
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own payments"   on public.payments;
create policy          "Users can insert own payments"  on public.payments
  for insert with check (auth.uid() = user_id);

-- ── tickets ──────────────────────────────────────────────────────
drop policy if exists "Users can view own tickets"   on public.tickets;
create policy          "Users can view own tickets"  on public.tickets
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tickets"   on public.tickets;
create policy          "Users can insert own tickets"  on public.tickets
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own tickets"   on public.tickets;
create policy          "Users can update own tickets"  on public.tickets
  for update using (auth.uid() = user_id);


-- ════════════════════════════════════════════════════════════════
-- 6. TRIGGER — auto-create profile on new user signup
-- ════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, address, balance)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    null,
    0.0
  )
  on conflict (id) do nothing;  -- safe on re-run
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ════════════════════════════════════════════════════════════════
-- 7. DEDUPLICATION  (Phase 11 fix — removes duplicate tariff rows)
--    Step A: re-point subscriptions from duplicate IDs → kept ID.
--    Step B: delete the now-unreferenced duplicate rows.
--    Safe to run when no duplicates exist (both steps become no-ops).
-- ════════════════════════════════════════════════════════════════

-- Step A: reassign subscriptions that reference a duplicate tariff
--         to the canonical (oldest created_at) tariff with that name.
update public.subscriptions s
set    tariff_id = keeper.id
from (
  select distinct on (name) id, name
  from   public.tariffs
  order  by name, created_at asc
) keeper
join public.tariffs dup
  on  dup.name = keeper.name
  and dup.id  <> keeper.id
where s.tariff_id = dup.id;

-- Step B: now it's safe to delete the duplicate rows.
delete from public.tariffs
where id not in (
  select distinct on (name) id
  from   public.tariffs
  order  by name, created_at asc
);


-- ════════════════════════════════════════════════════════════════
-- 8. SEED DATA  (all upserts — safe to re-run)
-- ════════════════════════════════════════════════════════════════

-- ── Network status nodes ─────────────────────────────────────────
insert into public.network_status (region, status) values
  ('Алматы',    'online'),
  ('Астана',    'online'),
  ('Шымкент',   'degraded'),
  ('Караганда', 'offline'),
  ('Актобе',    'online'),
  ('Тараз',     'online')
on conflict (region) do update set
  status     = excluded.status,
  updated_at = timezone('utc', now());

-- ── Tariffs ──────────────────────────────────────────────────────
-- Using ON CONFLICT DO NOTHING — the dedup step above ensures only
-- one row per name exists before we reach this point.

insert into public.tariffs (name, speed_mbps, price, description, category) values

  -- Combo packages
  ('Black',
   500, 12990,
   'Флагманский комбо-пакет: 500 Мбит/с + 2 SIM-карты с безлимитным интернетом + ТВ+ (170 каналов в HD/4K). Один счёт на всё.',
   'combo'),

  ('Silver',
   200, 9990,
   'Оптимальный комбо-пакет: 200 Мбит/с + 1 SIM-карта с безлимитным интернетом + ТВ+ (120 каналов). Для семьи из 3–4 человек.',
   'combo'),

  ('Bereke Combo',
   100, 6990,
   'Стартовый комбо-пакет: 100 Мбит/с + 1 SIM-карта (20 ГБ) + ТВ Базовый (80 каналов).',
   'combo'),

  -- Internet-only
  ('Bereke Home',
   100, 5990,
   'Надёжный домашний интернет до 100 Мбит/с. Безлимитный трафик, бесплатное подключение.',
   'internet'),

  ('Turbo 300',
   300, 7990,
   'Высокоскоростной доступ до 300 Мбит/с. Идеален для 4K-стриминга и онлайн-игр.',
   'internet'),

  ('Гигабит',
   1000, 10990,
   'Максимальная скорость до 1 Гбит/с по оптике. Для тех, кому нужно всё и сразу.',
   'internet'),

  -- TV-only
  ('ТВ Базовый',
   null, 2490,
   '80 каналов в цифровом качестве, включая казахстанские государственные и региональные.',
   'tv'),

  ('ТВ Плюс',
   null, 3990,
   '170 каналов HD/4K + 30 дней просмотра в записи. Включает детские, спортивные, кино-пакеты.',
   'tv'),

  -- Mobile-only
  ('Мобильный Старт',
   null, 1990,
   '10 ГБ интернета, безлимит на звонки внутри сети ТЕЛЕКОМ. 500 минут на другие операторы.',
   'mobile'),

  ('Мобильный Безлим',
   null, 3490,
   'Безлимитный мобильный интернет + безлимитные звонки по всему Казахстану. Роуминг по СНГ.',
   'mobile'),

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
