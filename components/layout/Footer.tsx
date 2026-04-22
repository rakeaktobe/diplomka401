import Link from "next/link";
import { Phone, Mail, Instagram, Facebook, Youtube, Twitter, Smartphone, Apple } from "lucide-react";
import { TelecomLogo } from "@/components/TelecomLogo";

// ── Data ─────────────────────────────────────────────────────────────────────

const ABOUT_LINKS = [
  { label: "О нас",                    href: "/about" },
  { label: "Новости",                  href: "/about" },
  { label: "Инвесторам",               href: "/about" },
  { label: "Карьера",                  href: "/about" },
  { label: "Устойчивое развитие",      href: "/about" },
];

const B2C_LINKS = [
  { label: "Интернет",          href: "/shop" },
  { label: "Телевидение",       href: "/shop" },
  { label: "Мобильная связь",   href: "/shop" },
  { label: "Пакеты услуг",      href: "/shop" },
];

const SUPPORT_LINKS = [
  { label: "Помощь и инструкции",        href: "/dashboard/support" },
  { label: "Оплата без регистрации",     href: "/dashboard/payments" },
  { label: "Проверка скорости",          href: "/" },
  { label: "Контакты",                   href: "/about" },
];

const LEGAL_LINKS = [
  "Политика конфиденциальности",
  "Публичная оферта",
  "Карта сайта",
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "/",   hover: "hover:bg-pink-600" },
  { icon: Facebook,  label: "Facebook",  href: "/",   hover: "hover:bg-blue-600" },
  { icon: Youtube,   label: "YouTube",   href: "/",   hover: "hover:bg-red-600"  },
  { icon: Twitter,   label: "Twitter",   href: "/",   hover: "hover:bg-sky-500"  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-semibold uppercase tracking-wide text-sm mb-5">
      {children}
    </h4>
  );
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-sm text-slate-400 hover:text-kt-blue transition-colors duration-200"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-slate-300">

      {/* ═══════════════ MAIN GRID ═══════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Col 1: Brand & Apps ────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo — links to homepage */}
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <TelecomLogo size={44} />
                </div>
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-kt-blue transition-colors duration-300">
                  ТЕЛЕКОМ
                </span>
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-sm text-slate-400 leading-relaxed">
              Крупнейший телекоммуникационный оператор, предоставляющий полный
              спектр современных услуг связи.
            </p>

            {/* App store buttons — external links kept as <a> */}
            <div className="flex flex-col gap-2.5 mt-1">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 hover:bg-white/10 hover:border-white/25 transition-all duration-300 group"
              >
                <Apple className="w-6 h-6 text-white shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">Скачать в</p>
                  <p className="text-sm font-semibold text-white leading-tight mt-0.5">App Store</p>
                </div>
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 hover:bg-white/10 hover:border-white/25 transition-all duration-300 group"
              >
                <Smartphone className="w-6 h-6 text-white shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">Установить на</p>
                  <p className="text-sm font-semibold text-white leading-tight mt-0.5">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Col 2: О компании ──────────────────── */}
          <div>
            <ColumnTitle>О компании</ColumnTitle>
            <LinkList links={ABOUT_LINKS} />
          </div>

          {/* ── Col 3: Частным лицам ───────────────── */}
          <div>
            <ColumnTitle>Частным лицам</ColumnTitle>
            <LinkList links={B2C_LINKS} />
          </div>

          {/* ── Col 4: Поддержка ───────────────────── */}
          <div>
            <ColumnTitle>Поддержка</ColumnTitle>
            <LinkList links={SUPPORT_LINKS} />
          </div>

          {/* ── Col 5: Контакты ────────────────────── */}
          <div className="flex flex-col gap-5">
            <div>
              <ColumnTitle>Контакты</ColumnTitle>

              {/* Phone */}
              <a
                href="tel:160"
                className="flex items-center gap-3 group mb-4"
              >
                <div className="w-9 h-9 rounded-full bg-kt-blue/20 flex items-center justify-center group-hover:bg-kt-blue transition-colors duration-300 shrink-0">
                  <Phone className="w-4 h-4 text-kt-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Колл-центр</p>
                  <p className="text-xl font-black text-white leading-tight">160</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@telecom.kz"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-kt-blue/20 transition-colors duration-300 shrink-0">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-kt-blue transition-colors duration-300" />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-kt-blue transition-colors duration-200">
                  info@telecom.kz
                </span>
              </a>
            </div>

            {/* Social icons */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">
                Мы в соцсетях
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ icon: Icon, label, href, hover }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-slate-400 hover:text-white ${hover} transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════ BOTTOM BAR ═══════════════ */}
      <div className="border-t border-slate-700/50">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} АО «ТЕЛЕКОМ». Все права защищены.
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((label) => (
              <Link
                key={label}
                href="/about"
                className="text-sm text-slate-500 hover:text-kt-blue transition-colors duration-200 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
