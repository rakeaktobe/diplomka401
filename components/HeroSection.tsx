"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { type Dictionary } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

interface Slide {
  id: string;
  image_url: string;
  badge_ru: string | null;
  badge_kk: string | null;
  badge_en: string | null;
  title_ru: string | null;
  title_kk: string | null;
  title_en: string | null;
  subtitle_ru: string | null;
  subtitle_kk: string | null;
  subtitle_en: string | null;
  cta_ru: string | null;
  cta_kk: string | null;
  cta_en: string | null;
  cta_href: string | null;
}

interface HeroSectionProps {
  slides: Slide[];
  dict: Dictionary["hero"];
  locale: string;
}

export function HeroSection({ slides, dict, locale }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, slides.length]);

  if (!slides.length) return null;

  const currentSlide = slides[current];
  const badge = (currentSlide as any)[`badge_${locale}`] || currentSlide.badge_ru;
  const title = (currentSlide as any)[`title_${locale}`] || currentSlide.title_ru;
  const subtitle = (currentSlide as any)[`subtitle_${locale}`] || currentSlide.subtitle_ru;
  const cta = (currentSlide as any)[`cta_${locale}`] || currentSlide.cta_ru;

  return (
    <section 
      className="relative w-full overflow-hidden min-h-[600px] lg:min-h-[700px] xl:min-h-[80vh] flex items-center group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => (
            index === current && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image 
                  src={slide.image_url || '/favicon.svg'}
                  alt={title || ''}
                  fill
                  priority
                  className="object-cover object-center"
                  quality={100}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-2xl flex flex-col gap-6 py-20 text-white">
          {/* Badge */}
          <motion.div
            key={`badge-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex"
          >
            <span className="inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-md border border-blue-400/30 text-blue-300 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              {badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-200/90 leading-relaxed max-w-lg font-medium"
          >
            {subtitle}
          </motion.p>

          {/* CTA Group */}
          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-4 mt-4 flex-wrap"
          >
            <Link
              href={`/${locale}${currentSlide.cta_href}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 lg:py-5 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.7)] hover:-translate-y-1"
            >
              {cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-bold px-10 py-4 lg:py-5 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1"
            >
              {dict.ctaDash}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-4 md:left-8 z-30 flex items-center gap-8">
        {/* Pagination Dots */}
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === current ? "w-10 bg-blue-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
