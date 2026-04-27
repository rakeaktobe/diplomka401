"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

const SLIDES: Slide[] = [
  {
    image: "/images/general tv+ ad.png",
    badge: "📺 Комбо",
    title: "ИНТЕРНЕТ + ТВ + МОБАЙЛ В ОДНОМ ПАКЕТЕ",
    subtitle: "Тариф «Black» — 500 Мбит/с, 2 SIM-карты и 170 каналов. Всё включено",
    cta: "Выбрать пакет",
    ctaHref: "/shop",
  },
  {
    image: "/images/baige 5g ad.png",
    badge: "🔥 5G",
    title: "УЧАСТВУЙ В БАЙГЕ СО СКОРОСТЬЮ 5G",
    subtitle: "Подключай мобильный интернет нового поколения и наслаждайся максимальной скоростью",
    cta: "Подробнее",
    ctaHref: "/promotions/baige-5g",
  },
  {
    image: "/images/kazakhtelecom prime ad.png",
    badge: "💎 Premium",
    title: "ПРЕМИАЛЬНЫЕ УСЛУГИ С KAZAKHTELECOM PRIME",
    subtitle: "Особый статус, выделенная линия поддержки и максимальный приоритет",
    cta: "Стать клиентом",
    ctaHref: "/promotions/prime",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance every 5s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(nextSlide, 5000);
    return () => clearInterval(id);
  }, [isHovered, nextSlide]);

  return (
    <section 
      className="relative overflow-hidden min-h-[520px] flex items-center bg-slate-900 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <Image 
            src={slide.image}
            alt={slide.title}
            fill
            quality={100}
            className="object-cover"
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent z-20 pointer-events-none" />

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 w-full relative z-20 flex items-center justify-between gap-12 py-20 text-white">
        {/* Left: text content */}
        <div className="flex flex-col gap-5 max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center self-start gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30 transition-all duration-300">
            {SLIDES[current].badge}
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight min-h-[100px] transition-all duration-300">
            {SLIDES[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 leading-relaxed min-h-[60px] transition-all duration-300">
            {SLIDES[current].subtitle}
          </p>

          {/* CTA */}
          <div className="flex gap-3 mt-2 flex-wrap">
            <Link
              href={SLIDES[current].ctaHref}
              className="inline-flex items-center gap-2 bg-white text-kt-blue font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {SLIDES[current].cta}
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
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
