"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Slide {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  visual: string; // emoji or text visual
}

const SLIDES: Slide[] = [
  {
    badge: "🎁 Акция",
    title: "ПРИГЛАСИ СОСЕДА И ПОЛУЧИ БОНУСЫ",
    subtitle: "Порекомендуй нас другу — оба получите 3 месяца интернета в подарок",
    cta: "Узнать подробнее",
    ctaHref: "/shop",
    bgFrom: "from-blue-700",
    bgTo: "to-kt-blue",
    accent: "shadow-blue-600/40",
    visual: "🎉",
  },
  {
    badge: "🔥 Новинка",
    title: "ГИГАБИТНЫЙ ИНТЕРНЕТ УЖЕ ДОСТУПЕН",
    subtitle: "Скорость до 1000 Мбит/с для частных домов и бизнеса по всему Казахстану",
    cta: "Подключить тариф",
    ctaHref: "/shop",
    bgFrom: "from-indigo-700",
    bgTo: "to-blue-500",
    accent: "shadow-indigo-600/40",
    visual: "⚡",
  },
  {
    badge: "📺 Комбо",
    title: "ИНТЕРНЕТ + ТВ + МОБАЙЛ В ОДНОМ ПАКЕТЕ",
    subtitle: "Тариф «Black» — 500 Мбит/с, 2 SIM-карты и 170 каналов. Всё включено",
    cta: "Выбрать пакет",
    ctaHref: "/shop",
    bgFrom: "from-violet-700",
    bgTo: "to-kt-purple",
    accent: "shadow-violet-600/40",
    visual: "📡",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance every 5s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [isHovered]);

  const slide = SLIDES[current];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-r ${slide.bgFrom} ${slide.bgTo} text-white min-h-[520px] flex items-center transition-all duration-700`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorative blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 w-full relative z-10 flex items-center justify-between gap-12 py-20">
        {/* Left: text content */}
        <div className="flex flex-col gap-5 max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center self-start gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30">
            {slide.badge}
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div className="flex gap-3 mt-2 flex-wrap">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 bg-white text-kt-blue font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white/15 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 backdrop-blur-sm transition-all duration-300"
            >
              Личный кабинет
            </Link>
          </div>
        </div>

        {/* Right: big emoji visual — desktop only */}
        <div className="hidden lg:flex items-center justify-center w-72 h-72 shrink-0">
          <div className="text-[10rem] drop-shadow-2xl select-none animate-bounce-slow">
            {slide.visual}
          </div>
        </div>
      </div>

      {/* Carousel dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Слайд ${i + 1}`}
            className={`carousel-dot ${i === current ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
