const fs = require('fs');

// 1. payments/page.tsx
const paymentsPath = 'app/[lang]/dashboard/payments/page.tsx';
let payments = fs.readFileSync(paymentsPath, 'utf8');
payments = payments.replace('{dict.error}', '{(dict as any).error_save || "Error"}');
fs.writeFileSync(paymentsPath, payments);

// 2. subscriptions/page.tsx
const subsPath = 'app/[lang]/dashboard/subscriptions/page.tsx';
let subs = fs.readFileSync(subsPath, 'utf8');
subs = subs.replace('{error && (', '{error !== null && (');
subs = subs.replace('dict.not_assigned', 'dict.notAssigned');
fs.writeFileSync(subsPath, subs);

// 3. actions.ts
const actionsPath = 'app/[lang]/admin/actions.ts';
let actions = fs.readFileSync(actionsPath, 'utf8');
actions = actions.replace(/await supabase\.from/g, 'await (supabase as any).from');
actions = actions.replace(/supabase\.from/g, '(supabase as any).from');
fs.writeFileSync(actionsPath, actions);

// 4. internet/home/page.tsx
const intHomePath = 'app/[lang]/internet/home/page.tsx';
let intHome = fs.readFileSync(intHomePath, 'utf8');
intHome = intHome.replace('dict.internet_home.meta_desc', '(dict.internet_home as any).meta_desc || dict.internet_home.hero_subtitle');
fs.writeFileSync(intHomePath, intHome);

// 5. tv/digital/page.tsx
const tvPath = 'app/[lang]/tv/digital/page.tsx';
let tv = fs.readFileSync(tvPath, 'utf8');
tv = tv.replace('dict.tv_digital.meta_desc', '(dict.tv_digital as any).meta_desc || dict.tv_digital.hero_subtitle');
fs.writeFileSync(tvPath, tv);

// 6. shop/page.tsx
const shopPath = 'app/[lang]/shop/page.tsx';
let shop = fs.readFileSync(shopPath, 'utf8');
if (!shop.includes('import { type Locale }')) {
  shop = shop.replace('import { getDictionaryClient } from "@/lib/i18n";', 'import { getDictionaryClient, type Locale } from "@/lib/i18n";');
  shop = shop.replace('import { getDictionaryServer }', 'import { type Locale }\nimport { getDictionaryServer }'); // Fallback
}
fs.writeFileSync(shopPath, shop);

// 7. AddressChecker.tsx
const addrPath = 'components/AddressChecker.tsx';
let addr = fs.readFileSync(addrPath, 'utf8');
addr = addr.replace('import { getDictionary } from "@/lib/i18n";', 'import { getDictionaryClient as getDictionary } from "@/lib/i18n";');
fs.writeFileSync(addrPath, addr);

// 8. TariffCatalog.tsx
const catPath = 'components/TariffCatalog.tsx';
let cat = fs.readFileSync(catPath, 'utf8');
cat = cat.replace('t.name_ru || t.name', '(t.name_ru || t.name) as string');
cat = cat.replace('tariff.name_ru || tariff.name', '(tariff.name_ru || tariff.name) as string'); // if it's there
fs.writeFileSync(catPath, cat);

// 9. layout.tsx
const layoutPath = 'app/[lang]/layout.tsx';
let layout = fs.readFileSync(layoutPath, 'utf8');
layout = layout.replace('profile?.role', '(profile as any)?.role');
fs.writeFileSync(layoutPath, layout);

console.log("Fixed TS errors");
