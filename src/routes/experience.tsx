import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Nav, Footer } from "./index";
import { ApplicationModal } from "@/components/life-moves/application";
import { Reveal, MagneticButton } from "@/components/life-moves/primitives";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "The Experience — Life Moves 5-Day Journey" },
      {
        name: "description",
        content:
          "A day-by-day walk through the 5-day Life Moves immersion — silence, breath, movement, solitude and return.",
      },
    ],
  }),
  component: ExperiencePage,
});

const ease = [0.16, 1, 0.3, 1] as const;

function ExperiencePage() {
  const [open, setOpen] = useState(false);
  const apply = () => setOpen(true);

  // Scroll details for the floating dots indicator
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const dayIds = ["day-01", "day-02", "day-03", "day-04", "day-05"];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < dayIds.length; i++) {
        const el = document.getElementById(dayIds[i]);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveDay(i + 1);
            return;
          }
        }
      }
      setActiveDay(0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToDay = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const days = [
    {
      id: "day-01",
      num: "01",
      title: "Arrival & Silence",
      desc: "You arrive. Phones go into a wooden box. A bell rings. From that moment until sunset, no one speaks. You walk the land barefoot, find your room, drink warm tea, and let your nervous system understand it's safe to slow down.",
      img: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&q=80",
    },
    {
      id: "day-02",
      num: "02",
      title: "Breath & Earth",
      desc: "Sunrise pranayama in the clearing. A guided forest walk where every footstep is the practice. Long, unhurried meals. An afternoon of grounding — bare skin, soft earth, no agenda.",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80",
    },
    {
      id: "day-03",
      num: "03",
      title: "Movement",
      desc: "Free-form embodied practice — guided gently, never choreographed. Dance if you dance. Crawl if you crawl. Climb if you climb. Your body chooses the shape; we hold the room.",
      img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&q=80",
    },
    {
      id: "day-04",
      num: "04",
      title: "Wilderness Solo",
      desc: "Six hours alone in the forest. Water, a journal, a designated patch of land. No phone, no clock, no task. Just you — and whatever rises when nothing is demanded of you.",
      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    },
    {
      id: "day-05",
      num: "05",
      title: "Integration & Return",
      desc: "Morning circle. Slow breakfast. We talk — finally — about what moved. You leave with a small ritual to carry home, and the quiet certainty that something has shifted.",
      img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-hidden selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={apply} alwaysSolid={true} />

      {/* Watermark background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply z-0">
        <img
          src="/banyan-tree.png"
          alt="Banyan tree watermark"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10">
        {/* Intro Section */}
        <section className="pt-48 pb-24 px-6 max-w-5xl mx-auto min-h-[50vh] flex flex-col justify-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-clay font-bold mb-6">
              The 5-day arc
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8.5xl leading-[1.05] text-charcoal">
              Five days. <br />
              <em className="text-forest font-serif italic font-normal">One slow exhale.</em>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-charcoal/70 max-w-2xl leading-relaxed font-light">
              What follows is a rhythm, not a syllabus. Each day moves a little deeper, but the only
              thing you have to do is show up.
            </p>
          </Reveal>
        </section>

        {/* Sticky Scroll container */}
        <div className="relative bg-transparent">
          {days.map((day, idx) => (
            <DaySection key={day.id} day={day} idx={idx} />
          ))}
        </div>

        {/* Floating Indicator Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6">
          {days.map((day, idx) => {
            const num = idx + 1;
            const isActive = activeDay === num;
            return (
              <button
                key={day.id}
                onClick={() => scrollToDay(day.id)}
                className="flex items-center gap-4 group text-right justify-end focus:outline-none cursor-pointer"
              >
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 translate-x-2 group-hover:opacity-75 group-hover:translate-x-0 ${
                    isActive ? "text-clay opacity-85 translate-x-0" : "text-charcoal/40 opacity-0"
                  }`}
                >
                  {day.title}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${
                    isActive
                      ? "bg-clay border-clay scale-125"
                      : "bg-charcoal/10 border-transparent group-hover:bg-charcoal/30"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Call to action section */}
        <section className="bg-forest text-cream py-32 px-6 text-center z-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest-deep/30 pointer-events-none" />

          <Reveal>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6.5xl leading-tight text-white mb-8">
              Ready to walk this with us?
            </h2>
            <div className="flex justify-center mt-6">
              <MagneticButton onClick={apply}>Reserve your seat</MagneticButton>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer onApply={apply} />
      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function DaySection({
  day,
  idx,
}: {
  day: { id: string; num: string; title: string; desc: string; img: string };
  idx: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1.05, 1, 1, 1.05]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 0.85, 0.85, 0.85]);

  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);
  const cardY = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [60, 0, 0, -60]);
  const cardScale = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0.96, 1, 1, 0.96]);

  return (
    <div ref={containerRef} id={day.id} className="relative h-[135vh] bg-transparent">
      {/* Sticky Background Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.img
            style={{ scale: imgScale, opacity: imgOpacity }}
            src={day.img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/70" />
        </div>

        {/* Centered Content Card */}
        <motion.div
          style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
          className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center text-cream"
        >
          {/* Text block */}
          <div className="space-y-6 text-left">
            <span className="font-serif text-5xl sm:text-7xl text-clay font-bold tracking-wider">
              {day.num}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6.5xl font-bold leading-tight text-white">
              {day.title}
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6" />
            <p className="text-base sm:text-lg lg:text-xl text-offwhite/90 leading-relaxed font-light max-w-xl">
              {day.desc}
            </p>
          </div>

          {/* Visual card frame */}
          <div className="hidden md:block relative p-4 max-w-md justify-self-center w-full group">
            <div className="absolute -inset-1 border border-clay/30 translate-x-4 translate-y-4 rounded-sm pointer-events-none transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className="absolute -inset-1 border border-white/10 -translate-x-3 -translate-y-3 rounded-sm pointer-events-none transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-white/10">
              <img
                src={day.img}
                alt={day.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
