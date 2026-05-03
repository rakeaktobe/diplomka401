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

const SLIDES: Slide[] = [
  {
    image: "/images/baige 5g ad.png",
    badge: "5G Интернет",
    title: "Скорость нового поколения",
    subtitle: "Подключайте 5G от Kazakhtelecom и забудьте о задержках. Максимальная скорость для вашего комфорта.",
    cta: "Подключить сейчас",
    ctaHref: "/internet/home"
  },
  {
    image: "/images/kazakhtelecom prime ad.png",
    badge: "Premium Подписка",
    title: "Kazakhtelecom Prime",
    subtitle: "Единая подписка на интернет, ТВ и мобильную связь с эксклюзивными бонусами и приоритетной поддержкой.",
    cta: "Узнать больше",
    ctaHref: "/combo"
  },
  {
    image: "/images/general tv+ ad.png",
    badge: "TV+ Сервис",
    title: "Более 170 каналов в Full HD",
    subtitle: "Смотрите любимые фильмы и шоу на любом устройстве. Кинотеатры онлайн в одном приложении.",
    cta: "Выбрать пакет",
    ctaHref: "/tv/digital"
  }
];

interface HeroSectionProps {
  dict: Dictionary["hero"];
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <section 
      className="relative w-full overflow-hidden min-h-[600px] lg:min-h-[700px] xl:min-h-[80vh] flex items-center group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {SLIDES.map((slide, index) => (
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
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
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
            <span className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-md text-blue-400 text-xs font-black px-4 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-widest">
              <Zap className="w-3 h-3" />
              {SLIDES[current].badge}
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
            {SLIDES[current].title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-200/90 leading-relaxed max-w-lg font-medium"
          >
            {SLIDES[current].subtitle}
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
              href={`/${locale}${SLIDES[current].ctaHref}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1"
            >
              {SLIDES[current].cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 backdrop-blur-md transition-all duration-300"
            >
              {locale === 'ru' ? "Личный кабинет" : locale === 'kk' ? "Жеке кабинет" : "Personal Account"}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-4 md:left-8 z-30 flex items-center gap-8">
        {/* Pagination Dots */}
        <div className="flex items-center gap-3">
          {SLIDES.map((_, i) => (
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
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
