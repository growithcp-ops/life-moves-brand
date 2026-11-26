import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import consultationImg from "@/assets/velira-consultation.webp";
import lifestyleImg from "@/assets/velira-lifestyle.webp";
import yogaImg from "@/assets/velira-yoga.webp";
import dietImg from "@/assets/velira-diet.webp";
import resetImg from "@/assets/velira-reset.webp";

import { Nav, Footer } from "@/components/velira/layout";
import { ApplicationModal } from "@/components/life-moves/application";
import { useInquiryModal } from "@/hooks/use-inquiry-modal";
import { Reveal, MagneticButton } from "@/components/life-moves/primitives";
import { useDesktopMotion } from "@/hooks/use-desktop-motion";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Services & Reset Journey — Velira Health & Wellness" },
      {
        name: "description",
        content:
          "Explore Velira Health & Wellness services: Personal Consultation, Lifestyle Modification, Personalised Yoga, Diet Therapy, and Reset Programs.",
      },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  const [open, setOpen] = useInquiryModal();
  const apply = () => setOpen(true);

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const stageIds = ["stage-01", "stage-02", "stage-03", "stage-04", "stage-05"];
    const elements = stageIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = stageIds.indexOf(entry.target.id);
            if (idx !== -1) setActiveStage(idx + 1);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToStage = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stages = [
    {
      id: "stage-01",
      num: "01",
      title: "Personal Consultation",
      desc: "Everything starts with a thoughtful, unhurried conversation. We listen to your energy levels, digestion, sleep patterns, stress load, and goals so your plan is built around your life — never a recycled template.",
      img: consultationImg,
    },
    {
      id: "stage-02",
      num: "02",
      title: "Lifestyle Modification",
      desc: "Sustainable change happens in the small rhythms of your day. We simplify morning routines, hydration, rest cycles, and work breaks with clear, practical guidance and prompt check-ins.",
      img: lifestyleImg,
    },
    {
      id: "stage-03",
      num: "03",
      title: "Personalised Yoga",
      desc: "Tailored 1-on-1 yoga and breathwork sequenced for your mobility, spine health, and nervous system balance. Whether easing desk stiffness or rebuilding stamina, each movement meets you right where you are.",
      img: yogaImg,
    },
    {
      id: "stage-04",
      num: "04",
      title: "Diet Therapy",
      desc: "Earthy, realistic nutrition designed around natural whole foods you actually enjoy. We focus on calming digestion, stabilising energy, and nourishing your body from within without extreme rules.",
      img: dietImg,
    },
    {
      id: "stage-05",
      num: "05",
      title: "Reset Programs",
      desc: "Guided inside-out reset phases that bring together gentle cleansing nourishment, restorative movement, and deep rest — helping you feel genuinely light, clear, and fresh from inside.",
      img: resetImg,
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-safe selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={apply} alwaysSolid={true} />

      {/* Botanical Watermark background (desktop only to keep mobile scroll fast) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <img
          src="/velira-botanical-bg.webp"
          alt="Velira botanical watermark"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10">
        {/* Intro Section */}
        <section className="pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-5 sm:px-6 max-w-5xl mx-auto min-h-[45vh] flex flex-col justify-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-clay font-bold mb-6">
              Services &amp; Reset Journey
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-8xl leading-[1.05] text-charcoal">
              Care shaped <br />
              <em className="text-forest font-serif italic font-normal">around your rhythm.</em>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-charcoal/70 max-w-2xl leading-relaxed font-light">
              Scroll through the five pillars of the Velira experience — from personal consultation
              and lifestyle modification to personalised yoga, diet therapy, and reset programs.
            </p>
          </Reveal>
        </section>

        {/* Sticky Scroll container */}
        <div className="relative bg-transparent">
          {stages.map((stage, idx) => (
            <StageSection key={stage.id} stage={stage} idx={idx} />
          ))}
        </div>

        {/* Floating Indicator Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6">
          {stages.map((stage, idx) => {
            const num = idx + 1;
            const isActive = activeStage === num;
            return (
              <button
                key={stage.id}
                onClick={() => scrollToStage(stage.id)}
                className="flex items-center gap-4 group text-right justify-end focus:outline-none cursor-pointer"
              >
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 translate-x-2 group-hover:opacity-75 group-hover:translate-x-0 ${
                    isActive ? "text-clay opacity-85 translate-x-0" : "text-charcoal/40 opacity-0"
                  }`}
                >
                  {stage.title}
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
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl leading-tight text-white mb-8">
              Ready to feel fresh from inside?
            </h2>
            <div className="flex justify-center mt-6">
              <MagneticButton data-open-inquiry="true" onClick={apply}>
                Step into Velira
              </MagneticButton>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer onApply={apply} />
      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function StageSection({
  stage,
  idx,
}: {
  stage: { id: string; num: string; title: string; desc: string; img: string };
  idx: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const enableDesktopScroll = useDesktopMotion();

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
    <div
      ref={containerRef}
      id={stage.id}
      className="relative md:h-[135vh] bg-transparent"
    >
      <div className="md:sticky md:top-0 md:h-screen w-full overflow-hidden flex items-center justify-center py-16 sm:py-20 md:py-0">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.img
            style={enableDesktopScroll ? { scale: imgScale, opacity: imgOpacity } : undefined}
            src={stage.img}
            alt=""
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover filter brightness-[0.25] opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/70" />
        </div>

        <motion.div
          style={
            enableDesktopScroll ? { opacity: cardOpacity, y: cardY, scale: cardScale } : undefined
          }
          className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center text-cream"
        >
          <div className="space-y-6 text-left">
            <span className="font-serif text-5xl sm:text-7xl text-clay font-bold tracking-wider">
              {stage.num}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {stage.title}
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6" />
            <p className="text-base sm:text-lg lg:text-xl text-offwhite/90 leading-relaxed font-light max-w-xl">
              {stage.desc}
            </p>
          </div>

          <div className="hidden md:block relative p-4 max-w-md justify-self-center w-full group">
            <div className="absolute -inset-1 border border-clay/30 translate-x-4 translate-y-4 rounded-sm pointer-events-none transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className="absolute -inset-1 border border-white/10 -translate-x-3 -translate-y-3 rounded-sm pointer-events-none transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-white/10">
              <img
                src={stage.img}
                alt={stage.title}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
