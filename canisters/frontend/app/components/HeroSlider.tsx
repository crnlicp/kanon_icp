import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";

interface Slide {
  id: number;
  imageUrl: string;
  title_fa: string;
  title_sv: string;
  subtitle_fa: string;
  subtitle_sv: string;
  ctaText_fa: string;
  ctaText_sv: string;
  ctaLink: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const { localized, isRtl } = useI18n();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, slides.length]);

  const slide = slides.length > 0 ? slides[current] : null;
  const resolvedImage = useAssetUrl(slide?.imageUrl);

  if (!slide) return null;

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-2xl sm:rounded-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${slide.id}`}
            className="text-center max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 text-glow">
              {localized(slide.title_fa, slide.title_sv)}
            </h2>
            <p className="text-lg sm:text-xl text-white/70 mb-6">
              {localized(slide.subtitle_fa, slide.subtitle_sv)}
            </p>
            {slide.ctaLink && (
              <motion.a
                href={slide.ctaLink}
                className="inline-block px-8 py-3 bg-primary/90 hover:bg-primary text-navy font-semibold rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {localized(slide.ctaText_fa, slide.ctaText_sv) || (isRtl ? "بیشتر" : "Läs mer")}
              </motion.a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
