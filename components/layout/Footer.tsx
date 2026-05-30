import Link from "next/link";
import { Phone, Mail, Instagram, Facebook, Youtube, Twitter, Smartphone, Apple } from "lucide-react";
import { TelecomLogo } from "@/components/TelecomLogo";
import type { Dictionary } from "@/lib/i18n";

// ── types ─────────────────────────────────────────────────────────────────────

interface FooterProps {
  dict: Dictionary["footer"];
  locale: string;
}

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

export function Footer({ dict, locale }: FooterProps) {
  const ABOUT_LINKS = [
    { label: dict.about,                    href: `/${locale}/about` },
    { label: dict.news,                     href: `/${locale}/news` },
    { label: dict.investors,                href: `/${locale}/about` },
    { label: dict.career,                   href: `/${locale}/about` },
    { label: dict.sustainability,           href: `/${locale}/about` },
  ];

  const B2C_LINKS = [
    { label: dict.internet,          href: `/${locale}/shop` },
    { label: dict.tv,                href: `/${locale}/shop` },
    { label: dict.mobile,            href: `/${locale}/shop` },
    { label: dict.packages,          href: `/${locale}/shop` },
  ];

  const SUPPORT_LINKS = [
    { label: dict.helpdesk,                 href: `/${locale}/dashboard/support` },
    { label: dict.payment,                  href: `/${locale}/dashboard/payments` },
    { label: dict.speedTest,                href: `/${locale}/dashboard/speedtest` },
    { label: dict.contacts,                 href: `/${locale}/about` },
  ];

  const LEGAL_LINKS = [
    { label: dict.privacy, href: `/${locale}/about` },
    { label: dict.offer,   href: `/${locale}/about` },
    { label: dict.siteMap, href: `/${locale}/about` },
  ];

  const SOCIALS = [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/telecomkz",   hover: "hover:bg-pink-600" },
    { icon: Facebook,  label: "Facebook",  href: "https://facebook.com/telecomkz",  hover: "hover:bg-blue-600" },
    { icon: Youtube,   label: "YouTube",   href: "https://youtube.com/telecomkz",   hover: "hover:bg-red-600"  },
    { icon: Twitter,   label: "Twitter",   href: "https://twitter.com/telecomkz",   hover: "hover:bg-sky-500"  },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-slate-300">

      {/* ═══════════════ MAIN GRID ═══════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Col 1: Brand & Apps ────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo — links to homepage */}
            <div className="flex items-center gap-2.5">
              <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
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
              {dict.tagline}
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
                  <p className="text-[10px] text-slate-400 leading-none">{dict.downloadApp}</p>
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
                  <p className="text-[10px] text-slate-400 leading-none">{dict.installOn}</p>
                  <p className="text-sm font-semibold text-white leading-tight mt-0.5">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Col 2: About ──────────────────── */}
          <div>
            <ColumnTitle>{dict.about}</ColumnTitle>
            <LinkList links={ABOUT_LINKS} />
          </div>

          {/* ── Col 3: For Home ───────────────── */}
          <div>
            <ColumnTitle>{dict.b2c}</ColumnTitle>
            <LinkList links={B2C_LINKS} />
          </div>

          {/* ── Col 4: Support ───────────────────── */}
          <div>
            <ColumnTitle>{dict.support}</ColumnTitle>
            <LinkList links={SUPPORT_LINKS} />
          </div>

          {/* ── Col 5: Contacts ────────────────────── */}
          <div className="flex flex-col gap-5">
            <div>
              <ColumnTitle>{dict.contacts}</ColumnTitle>

              {/* Phone */}
              <a
                href="tel:160"
                className="flex items-center gap-3 group mb-4"
              >
                <div className="w-9 h-9 rounded-full bg-kt-blue/20 flex items-center justify-center group-hover:bg-kt-blue transition-colors duration-300 shrink-0">
                  <Phone className="w-4 h-4 text-kt-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">{dict.callCenter}</p>
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
                {dict.socials}
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
            © {new Date().getFullYear()} {dict.copyright}
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
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
