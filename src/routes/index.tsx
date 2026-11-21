import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import heroImg from "@/assets/velira-hero.webp";
import yogaImg from "@/assets/velira-yoga.webp";
import dietImg from "@/assets/velira-diet.webp";
import resetImg from "@/assets/velira-reset.webp";
import consultationImg from "@/assets/velira-consultation.webp";
import founderBgImg from "@/assets/velira-founder-bg.webp";
import lifestyleImg from "@/assets/velira-lifestyle.webp";

import {
  Reveal,
  StaggerWords,
  MagneticButton,
} from "@/components/life-moves/primitives";
import { ApplicationModal } from "@/components/life-moves/application";
import { useInquiryModal } from "@/hooks/use-inquiry-modal";
import { Nav, Footer } from "@/components/velira/layout";

export { Nav, Footer };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velira Health & Wellness — Care Shaped Around You" },
      {
        name: "description",
        content:
          "We specialize in wellness services like lifestyle modification, personalised yoga and diet therapy with reset programs to rejuvenate and feel good from inside.",
      },
      { property: "og:title", content: "Velira Health & Wellness — Care Shaped Around You" },
      {
        property: "og:description",
        content:
          "Personalised yoga, diet therapy, lifestyle modification, and reset programs tailored around you.",
      },
    ],
  }),
  component: Index,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Index() {
  const [open, setOpen] = useInquiryModal();
  const apply = () => setOpen(true);

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-safe selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={apply} />

      {/* Botanical Watermark background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <img
          src="/velira-botanical-bg.webp"
          alt="Velira botanical watermark"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10">
        <Hero onApply={apply} />
        <WhoFor />
        <WhatThisIs />
        <TrustLogos />
        <Method />
        <Outcome />
        <Facilitator onApply={apply} />
        <Programs onApply={apply} />
        <FinalCTA onApply={apply} />
        <Footer onApply={apply} />
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/* ───────────── WAVY DIVIDER ───────────── */
function WavyDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-[2px]">
      <svg
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto min-h-[100px] md:min-h-[180px] block"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 C320,160 640,40 960,110 C1180,160 1310,120 1440,70 L1440,220 L0,220 Z"
          fill="rgba(45, 90, 61, 0.35)"
        />
        <path
          d="M0,120 C280,180 560,90 840,150 C1120,210 1280,130 1440,110 L1440,220 L0,220 Z"
          fill="var(--clay-soft)"
          opacity="0.65"
        />
        <path
          d="M0,150 C400,90 700,210 1000,160 C1200,130 1320,170 1440,150 L1440,220 L0,220 Z"
          fill="var(--clay)"
          opacity="0.85"
        />
        <path
          d="M0,180 C360,130 720,200 1080,170 C1260,150 1350,190 1440,180 L1440,220 L0,220 Z"
          fill="var(--offwhite)"
        />
      </svg>
    </div>
  );
}

/* ───────────── HERO ───────────── */
function Hero({ onApply }: { onApply: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBg = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex flex-col min-h-screen min-h-[100svh] w-full overflow-hidden bg-charcoal text-offwhite grain"
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-105 bg-charcoal">
        <img
          src={heroImg}
          alt="Velira Health & Wellness Sanctuary"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-[115%] w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/25 to-charcoal/95 pointer-events-none" />
      </motion.div>

      <motion.div
        style={{ opacity, y: yText }}
        className="relative z-10 mx-auto flex flex-1 w-full max-w-[1500px] flex-col justify-between px-5 sm:px-6 pt-28 pb-20 sm:pt-32 sm:pb-24 md:px-12 md:pt-40 md:pb-32"
      >
        <div className="max-w-[1280px] my-auto">
          <h1 className="font-serif text-[clamp(2rem,7.1vw,6.4rem)] leading-[1.08] pb-2">
            <span className="block text-white">Velira health &amp; wellness</span>
            <span className="block italic text-offwhite/65 font-light">
              — Care shaped{" "}
              <span className="text-clay-soft font-normal relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-clay-soft/40">
                around you
              </span>
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 max-w-[600px] text-sm sm:text-base leading-relaxed text-offwhite/80 md:text-lg font-light">
            We specialize in wellness services like lifestyle modification, personalised yoga and
            diet therapy, reset programs to rejuvenate and feel good from inside — with{" "}
            <span className="font-medium text-clay-soft underline decoration-clay-soft/50 underline-offset-4">
              naturopathy and yoga doctors
            </span>{" "}
            guiding you — engineered for quality, reliability, and measurable success.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-5 sm:gap-8">
            <MagneticButton data-open-inquiry="true" onClick={onApply}>
              Step into Velira
            </MagneticButton>
            <Link
              to="/experience"
              className="flex items-center gap-3 text-offwhite/70 hover:text-clay-soft transition-colors"
            >
              <span className="h-px w-8 bg-current opacity-40" />
              <span className="eyebrow text-[9.5px]">Explore Services &amp; Reset Journey</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-offwhite/10 pt-6 sm:pt-8 mt-10 sm:mt-12">
          <a
            href="#who-for"
            className="group flex items-center gap-3 eyebrow text-[9.5px] opacity-65 hover:opacity-100 transition duration-300"
          >
            <span className="animate-bounce">↓</span>
            <span>Scroll to explore</span>
          </a>
          <div className="eyebrow text-[9.5px] opacity-55">1-on-1 Guided Wellness · India</div>
        </div>
      </motion.div>

      {/* Floating SVG Rotating Circular Text Badge */}
      <div className="pointer-events-none hidden sm:block absolute right-6 top-24 z-10 md:right-16 md:top-32">
        <div className="relative h-28 w-28 md:h-36 md:w-36 flex items-center justify-center">
          <svg
            className="absolute h-full w-full text-offwhite/30 animate-[spin_25s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <path
              id="circlePath"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              fill="none"
            />
            <text className="font-sans text-[8.5px] uppercase tracking-[0.41em] fill-current font-semibold">
              <textPath href="#circlePath" startOffset="0%">
                VELIRA - CARE SHAPED AROUND ·
              </textPath>
            </text>
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl md:text-4xl text-clay font-medium">4</span>
            <span className="text-[7.5px] uppercase tracking-widest text-offwhite/55">
              Pillars
            </span>
          </div>
        </div>
      </div>

      <WavyDivider />
    </section>
  );
}

/* ───────────── WHO FOR (PROBLEM WE SOLVE) ───────────── */
function WhoFor() {
  const signs = [
    {
      num: "01",
      text: "You've tried rigid fitness or diet routines that ignored your daily schedule.",
    },
    {
      num: "02",
      text: "Confusing pricing and disconnected advice made it hard to trust where to start.",
    },
    {
      num: "03",
      text: "Slow turnaround times and generic plans slowed down your progress.",
    },
    {
      num: "04",
      text: "You keep pushing through fatigue, wishing your energy felt naturally steady.",
    },
    {
      num: "05",
      text: "You want personalised yoga, diet therapy, and reset support working together.",
    },
    {
      num: "06",
      text: "You're ready to rejuvenate and feel genuinely fresh from the inside out.",
    },
  ];

  return (
    <section
      id="who-for"
      className="scroll-mt-32 bg-cream text-charcoal py-32 md:py-48 border-b border-charcoal/5 relative overflow-hidden"
    >
      {/* Background Image with soft elegant overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/velira-who-bg.webp"
          alt="Velira Wellness Studio Space"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/25 to-cream z-[1]" />
      </div>

      {/* Floating abstract blobs */}
      <div className="absolute top-1/4 -left-48 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(196,132,90,0.08)_0%,transparent_70%)] pointer-events-none z-[2]" />
      <div className="absolute bottom-1/4 -right-48 w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(57,102,71,0.08)_0%,transparent_70%)] pointer-events-none z-[2]" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-12 relative z-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.3fr] items-start">
          {/* Left Column - Sticky */}
          <div className="md:sticky md:top-32 h-fit space-y-6">
            <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-1 block">
              Real challenges, seamless care
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05]">
              Who This Is For.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6" />
            <div className="space-y-4 max-w-md">
              <p className="text-base leading-relaxed text-charcoal/80 font-light">
                People seeking lifestyle modification, personalised yoga, diet therapy, and reset
                programs often struggle with unreliable guidance, confusing pricing, and slow
                turnaround times.
              </p>
              <p className="text-base leading-relaxed text-charcoal/65 font-light">
                Velira health &amp; wellness removes those hurdles with a warm, modern, and
                tailored experience built around your needs.
              </p>
            </div>
          </div>

          {/* Right Column - Scroll list */}
          <div className="space-y-4">
            {signs.map((s, i) => (
              <Reveal key={i} delay={Math.min(0.05 * i, 0.2)}>
                <div className="group relative glass p-6 md:p-8 transition-all duration-500 hover:bg-cream/90 rounded-sm">
                  <div className="absolute top-0 left-0 w-0 h-px bg-clay transition-all duration-500 group-hover:w-full" />
                  <div className="absolute top-0 left-0 w-px h-0 bg-clay transition-all duration-500 group-hover:h-full" />

                  <div className="grid grid-cols-[2rem_1fr] gap-4 items-start">
                    <span className="font-light text-2xl text-clay/60 leading-none pt-0.5 font-sans">
                      —
                    </span>
                    <p className="font-serif text-lg md:text-xl leading-normal text-charcoal/85">
                      {s.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── PHILOSOPHY (OUR USP) ───────────── */
function WhatThisIs() {
  const items = [
    {
      title: "Domain Expertise",
      desc: "Top-tier guidance across personalised yoga, diet therapy, and sustainable lifestyle habits.",
      icon: (
        <svg
          className="w-5 h-5 text-clay group-hover:text-white transition-colors duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M5 12h14M8.5 7.5L12 3l3.5 4.5M12 21l3.5-4.5M8.5 16.5L12 21"
          />
        </svg>
      ),
    },
    {
      title: "Rapid Execution",
      desc: "Fast, attentive onboarding and practical routines delivered without confusing delays.",
      icon: (
        <svg
          className="w-5 h-5 text-clay group-hover:text-white transition-colors duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
          />
        </svg>
      ),
    },
    {
      title: "Client-First Dedication",
      desc: "Clear inquiry-led consultation, honest communication, and care genuinely shaped around you.",
      icon: (
        <svg
          className="w-5 h-5 text-clay group-hover:text-white transition-colors duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-cream py-16 md:py-24 overflow-hidden border-b border-charcoal/5">
      {/* Abstract background flowing curves */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-full h-full object-cover"
        >
          <path
            d="M-100,200 C300,100 500,400 900,300 C1300,200 1500,500 1600,400 L1600,800 L-100,800 Z"
            fill="#f0ece0"
            opacity="0.6"
          />
          <path
            d="M-50,350 C400,250 600,500 1100,350 C1400,260 1550,450 1650,380 L1650,800 L-50,800 Z"
            fill="#e8e1d3"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <Reveal>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-clay">02 / Our Philosophy</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.05] mt-2">
                Care Shaped <br />
                <em className="italic text-forest font-serif font-normal">around your life.</em>
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
              <p className="mt-4 text-base leading-relaxed text-charcoal/75 font-light max-w-xl">
                Velira health &amp; wellness stands apart with our promise of &ldquo;Care shaped
                around you.&rdquo; We combine top-tier domain expertise, rapid execution, and
                client-first dedication so every yoga practice, nutrition guide, and reset feels
                effortless and sustainable.
              </p>
            </Reveal>
          </div>

          {/* Right Column: Wavy Decorative circle mask */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[110%] h-[110%] bg-[radial-gradient(circle,rgba(196,132,90,0.09)_0%,transparent_70%)] rounded-full -z-10" />
            <div className="absolute w-[95%] h-[95%] bg-[#e9e4d9] rounded-wavy -z-10" />
            <div className="absolute w-[102%] h-[102%] border border-dashed border-clay/20 rounded-full -z-10 animate-[spin_60s_linear_infinite]" />

            <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] overflow-hidden rounded-full border-[8px] border-white shadow-2xl relative">
              <img
                src={resetImg}
                alt="Velira Reset and Natural Care"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover scale-105 transition-transform duration-[6s] hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/15 to-transparent" />
            </div>

            <div className="absolute bottom-3 right-3 sm:right-8 bg-white/95 shadow-md px-3.5 py-1.5 rounded-full border border-charcoal/5 flex items-center gap-1.5 text-[8px] uppercase font-semibold tracking-wider text-charcoal">
              <span className="h-1.5 w-1.5 rounded-full bg-clay animate-ping" />
              <span>Inside-Out Renewal</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 USP Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-charcoal/5 mt-12">
          {items.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <div className="group flex items-start gap-4 bg-white border border-charcoal/10 hover:border-clay/20 p-5 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-0.5 h-full">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-clay/5 flex items-center justify-center group-hover:bg-clay group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans text-xs font-semibold tracking-wide text-charcoal group-hover:text-clay transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-charcoal/65 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── TRUST LOGOS & STANDARDS BADGES ───────────── */
function TrustLogos() {
  const badges = [
    {
      title: "Personalised Yoga",
      subtitle: "1-on-1 Posture & Breath",
      detail: "Adaptive sequences crafted around your mobility, stamina, and daily calm.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <path
            d="M24 11C19.5 16 18 22 24 33C30 22 28.5 16 24 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M14 29C17.5 26.5 21 26.5 24 29C27 26.5 30.5 26.5 34 29" stroke="#C4845A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Diet Therapy",
      subtitle: "Natural Whole-Food Balance",
      detail: "Gentle, sustainable meal guidance built around nourishment rather than restriction.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <path d="M13 24H35C34.5 30.5 29.8 35 24 35C18.2 35 13.5 30.5 13 24Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 13C26.5 15.5 26.5 19.5 24 22C21.5 19.5 21.5 15.5 24 13Z" stroke="#C4845A" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      title: "Guided Reset Programs",
      subtitle: "Feel Fresh From Inside",
      detail: "Structured lifestyle reset steps designed to restore clarity, digestion, and rest.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="7" stroke="#C4845A" strokeWidth="1.5" />
          <path d="M24 10V14M24 34V38M10 24H14M34 24H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Personal Consultation",
      subtitle: "Direct 1-on-1 Attention",
      detail: "Thoughtful, friendly 1-on-1 assessment with our wellness team before your plan begins.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <circle cx="20" cy="19" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 32C14.5 28 17 26.5 20 26.5C23 26.5 25.5 28 26.5 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M29 19H35M29 24H33" stroke="#C4845A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Rapid & Reliable Care",
      subtitle: "Zero Slow Turnaround",
      detail: "Prompt responses, crisp milestones, and ongoing check-ins you can depend on.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <path d="M24 14V24L30 28" stroke="#C4845A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="11.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      title: "Inquiry-Led Transparency",
      subtitle: "Care Shaped Around You",
      detail: "Every program is tailored to your goals with honest clarity and zero hidden fees.",
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-forest">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.2" />
          <path d="M24 12L33 16.5V23.5C33 29.5 29 33.8 24 36C19 33.8 15 29.5 15 23.5V16.5L24 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M20.5 24L23 26.5L28 21" stroke="#C4845A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-cream text-charcoal py-16 md:py-24 overflow-hidden relative border-y border-charcoal/5">
      {/* Background Image with soft elegant overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/velira-trust-bg.webp"
          alt="Velira Natural Trust Backdrop"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/25 to-cream z-[1]" />
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-3 block">
              Our Standards &amp; Trust Badges
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05] text-center">
              Built on Trust.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-5 mx-auto" />
            <p className="text-sm md:text-base text-charcoal/70 font-light max-w-xl">
              Six commitments that guide every personalised session, diet protocol, and reset
              program at Velira Health &amp; Wellness.
            </p>
          </div>
        </Reveal>

        {/* Trust Logos & Badges Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b, i) => (
            <Reveal key={b.title} delay={Math.min(i * 0.05, 0.2)}>
              <div className="group bg-white/95 border border-charcoal/10 hover:border-clay/30 p-6 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full space-y-5 text-charcoal">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-cream border border-charcoal/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {b.svg}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-charcoal group-hover:text-forest transition-colors">
                      {b.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-clay font-semibold">
                      {b.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm leading-relaxed text-charcoal/70 font-light border-t border-charcoal/10 pt-4">
                  {b.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── METHOD / CORE SERVICES (STATIC GRID) ───────────── */
function Method() {
  const services = [
    {
      t: "Personalised Yoga",
      d: "Thoughtfully paced postures, alignment, and pranayama tailored around your body's flexibility, strength, and stress load.",
      iconD: "M6 30 Q14 6 22 18 T34 8",
      img: yogaImg,
    },
    {
      t: "Diet Therapy",
      d: "Warm, nourishing therapeutic nutrition rooted in natural whole foods to support digestion, clarity, and steady daily energy.",
      iconD: "M4 22 Q12 4 22 18 T36 22",
      img: dietImg,
    },
    {
      t: "Reset Programs",
      d: "Guided lifestyle modification and restorative daily protocols designed to help your system cleanse, recalibrate, and feel fresh from inside.",
      iconD: "M4 20 C 8 8, 32 8, 36 20 C 32 32, 8 32, 4 20 Z",
      img: resetImg,
    },
    {
      t: "Personal Consultation",
      d: "Dedicated 1-on-1 conversations to map your health goals, simplify habits, and shape an actionable path without guesswork.",
      iconD: "M6 28 L20 6 L34 28 Z M14 22 L26 22",
      img: consultationImg,
    },
  ];

  return (
    <section
      id="services"
      className="scroll-mt-24 relative bg-offwhite text-charcoal border-b border-charcoal/5 grain py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        {/* Header Row */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-2 block">
            Four pillars of renewal
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05]">
            Our Services.
          </h2>
          <div className="w-16 h-0.5 bg-clay mt-3 mx-auto" />
        </div>

        {/* 2x2 Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {services.map((p, i) => (
            <div
              key={p.t}
              className="bg-white border border-charcoal/10 rounded-sm shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[260px] w-full overflow-hidden bg-charcoal/5">
                <img
                  src={p.img}
                  alt={p.t}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/5" />
              </div>

              {/* Content Container */}
              <div className="p-6 md:p-8 flex flex-col justify-between relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full border border-clay/15 bg-clay/5 flex items-center justify-center text-clay">
                      <svg
                        width="24"
                        height="22"
                        viewBox="0 0 40 40"
                        fill="none"
                        className="overflow-visible"
                      >
                        <path
                          d={p.iconD}
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <Sparkles className="h-4.5 w-4.5 text-clay-soft" />
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay block">
                      0{i + 1}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold tracking-[0.04em] text-charcoal">
                      {p.t}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed text-charcoal/70 font-light">
                      {p.d}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── THE OUTCOME ───────────── */
function Outcome() {
  const [activeIndex, setActiveIndex] = useState(0);

  const outcomes = [
    {
      title: "Natural, sustained daily energy",
      description:
        "Replace afternoon crashes and nervous exhaustion with steady energy backed by balanced nutrition and mindful movement.",
      image: heroImg,
      tagline: "Vitality",
    },
    {
      title: "Digestive calm & gut lightness",
      description:
        "Thoughtful diet therapy shaped around familiar, natural foods helps quiet bloating and restore metabolic clarity.",
      image: dietImg,
      tagline: "Diet Therapy",
    },
    {
      title: "Supple posture & tension relief",
      description:
        "Personalised yoga meets your body where it is — easing neck, hip, and lower-back tightness built up from desk hours.",
      image: yogaImg,
      tagline: "Personalised Yoga",
    },
    {
      title: "Clearer lifestyle rhythms that stick",
      description:
        "Simple sleep, hydration, and breath routines designed around your real workday so consistency feels natural.",
      image: lifestyleImg,
      tagline: "Lifestyle Modification",
    },
    {
      title: "Deep inner freshness & reset",
      description:
        "Guided reset programs help clear sluggishness and mental fog so you feel refreshed from the inside out.",
      image: resetImg,
      tagline: "Reset Programs",
    },
    {
      title: "Responsive 1-on-1 guidance",
      description:
        "No waiting weeks for answers — direct consultations and attentive check-ins keep your momentum strong.",
      image: consultationImg,
      tagline: "Personal Support",
    },
  ];

  const AUTO_PLAY_INTERVAL = 5000;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % outcomes.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex, outcomes.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + outcomes.length) % outcomes.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % outcomes.length);
  };

  const handleDotClick = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <section
      id="outcome"
      className="scroll-mt-32 bg-cream text-charcoal py-24 md:py-36 relative overflow-hidden border-t border-charcoal/5"
    >
      <div className="absolute top-1/3 -left-48 w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(57,102,71,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(196,132,90,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-center">
          {/* Left Column */}
          <div className="space-y-6 lg:sticky lg:top-40 h-fit">
            <Reveal>
              <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-1 block">
                Measurable well-being
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05]">
                The Outcome.
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4 max-w-md">
                <p className="text-base leading-relaxed text-charcoal/80 font-light">
                  Wellness engineered for real quality, reliability, and results you actually feel.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-lg md:text-xl font-serif italic text-clay tracking-wider mt-6">
                  <span>Freshness.</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  <span>Balance.</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  <span>Vitality.</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Auto-Sliding Card */}
          <div className="w-full">
            <div className="bg-cream/95 rounded-2xl border border-charcoal/10 shadow-2xl overflow-hidden grid md:grid-cols-[1.1fr_1.4fr] items-stretch min-h-[420px] md:min-h-[460px] relative group">
              <div className="relative h-64 md:h-auto overflow-hidden bg-charcoal/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={outcomes[activeIndex].image}
                      alt={outcomes[activeIndex].title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-4 left-4 z-20 bg-cream/95 px-3.5 py-1.5 rounded-full border border-charcoal/5 shadow-sm text-[10px] uppercase tracking-widest font-semibold text-charcoal/80"
                  >
                    {outcomes[activeIndex].tagline}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-2 right-2 text-white/15 text-9xl font-serif font-black select-none pointer-events-none">
                  0{activeIndex + 1}
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-between h-full bg-cream/90">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-clay tracking-wider">
                      Outcome 0{activeIndex + 1} of 06
                    </span>
                    <span className="text-[10px] bg-forest/10 text-forest px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                      Velira Care
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease }}
                      className="space-y-4"
                    >
                      <h3 className="font-serif text-2xl md:text-3xl text-forest font-bold tracking-tight leading-[1.2]">
                        {outcomes[activeIndex].title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed text-charcoal/80 font-light">
                        {outcomes[activeIndex].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-charcoal/5 space-y-6">
                  <div className="flex gap-2.5">
                    {outcomes.map((_, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={idx}
                          className="h-1 flex-1 bg-charcoal/10 rounded-full overflow-hidden cursor-pointer relative"
                          onClick={() => handleDotClick(idx)}
                        >
                          {isActive && (
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-clay"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                              key={activeIndex}
                            />
                          )}
                          {!isActive && idx < activeIndex && (
                            <div className="absolute inset-0 bg-clay/40" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/60 hover:text-clay hover:border-clay transition-all duration-300 active:scale-95 cursor-pointer"
                        aria-label="Previous outcome"
                      >
                        <ArrowRight className="h-4.5 w-4.5 rotate-180" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/60 hover:text-clay hover:border-clay transition-all duration-300 active:scale-95 cursor-pointer"
                        aria-label="Next outcome"
                      >
                        <ArrowRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── LED BY VELIRA TEAM ───────────── */
function Facilitator({ onApply }: { onApply: () => void }) {
  return (
    <section
      id="team"
      className="scroll-mt-32 bg-offwhite text-charcoal py-28 md:py-36 relative overflow-hidden border-t border-charcoal/5"
    >
      <img
        src={founderBgImg}
        alt="Natural sunlit wellness wall"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.22] pointer-events-none z-0"
      />

      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(196,132,90,0.08)_0%,transparent_70%)] pointer-events-none z-10" />
      <div className="absolute top-10 right-10 w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(227,222,207,0.16)_0%,transparent_70%)] pointer-events-none z-10" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-12 relative z-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Reveal>
            <div className="flex justify-center">
              <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-2">
                Collective Care · Naturopathy &amp; Yoga Doctors
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.05]">
              Led by Velira Team.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6 mx-auto" />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg leading-relaxed text-charcoal/90 font-medium">
                A collaborative team of naturopathy and yoga doctors, therapeutic diet
                specialists, and lifestyle guides working together for lasting freshness inside and
                out.
              </p>
              <p className="text-base leading-relaxed text-charcoal/70 font-light">
                Velira Health &amp; Wellness is built around a shared team effort — combining
                attentive 1-on-1 listening, personalised yoga, practical diet therapy, and ongoing
                check-ins so every step of your care is coordinated around you.
              </p>
              <div className="pt-4 flex justify-center">
                <MagneticButton data-open-inquiry="true" onClick={onApply}>
                  Book a Personal Consultation
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── PROGRAMS (INQUIRY BASED, PRICING HIDDEN) ───────────── */
function Programs({ onApply }: { onApply: () => void }) {
  const list = [
    {
      title: "Personalised Yoga & Lifestyle",
      badge: "Custom Pace",
      desc: "One-on-one posture work, breath guidance, and daily habit alignment adapted to your body and schedule.",
      tag: "Inquiry Only",
      img: yogaImg,
      category: "Personalised Yoga",
    },
    {
      title: "Therapeutic Diet & Gut Care",
      badge: "Whole-Food Therapy",
      desc: "Practical, earthy nutrition tailored to your digestion, energy rhythm, and daily culinary routine.",
      tag: "Inquiry Only",
      img: dietImg,
      category: "Diet Therapy",
    },
    {
      title: "Inside-Out Reset Program",
      badge: "Complete Renewal",
      desc: "A guided blend of personal consultation, lifestyle modification, yoga, and restorative reset habits.",
      tag: "Inquiry Only",
      img: resetImg,
      category: "Reset Programs",
    },
  ];

  return (
    <section
      id="programs"
      className="scroll-mt-24 py-24 md:py-36 bg-cream text-charcoal relative overflow-hidden border-t border-charcoal/5"
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(196,132,90,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(57,102,71,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-12 relative z-10">
        <div className="bg-white rounded-sm p-6 sm:p-8 md:p-14 border border-charcoal/10 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-10 pointer-events-none opacity-30">
            <svg
              viewBox="0 0 1000 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path d="M0,20 C300,44 700,-4 1000,20 L1000,0 L0,0 Z" fill="var(--clay-soft)" />
            </svg>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
            <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-3 block">
              Tailored Paths · Inquiry Based
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05] text-center">
              Programs.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6 mx-auto" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {list.map((e, idx) => (
              <Reveal key={e.title} delay={idx * 0.08}>
                <div className="group bg-offwhite border border-charcoal/10 hover:border-clay/30 p-4 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 text-charcoal h-full flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-charcoal/10 shadow-sm bg-charcoal/5">
                    <img
                      src={e.img}
                      alt={e.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-60" />

                    <span className="absolute top-4 left-4 bg-clay text-white text-[9.5px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                      {e.badge}
                    </span>

                    <span className="absolute bottom-4 right-4 bg-charcoal/90 text-offwhite border border-white/10 text-[9px] font-semibold tracking-wider px-3 py-1 rounded-full">
                      {e.tag}
                    </span>
                  </div>

                  <div className="pt-5 px-1 pb-2 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="eyebrow text-[9px] text-charcoal/50 tracking-wider">
                          {e.category}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
                      </div>

                      <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-clay transition-colors duration-300 font-semibold leading-tight">
                        {e.title}
                      </h3>

                      <p className="text-xs text-charcoal/70 leading-relaxed font-light min-h-[48px]">
                        {e.desc}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        data-open-inquiry="true"
                        onClick={onApply}
                        className="w-full py-2.5 rounded-sm border border-clay/20 group-hover:border-clay group-hover:bg-clay group-hover:text-white transition-all duration-500 eyebrow text-[9.5px] font-bold text-clay tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Inquire Now</span>
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-10 pointer-events-none opacity-30 translate-y-[2px]">
            <svg
              viewBox="0 0 1000 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path d="M0,20 C300,0 700,40 1000,20 L1000,40 L0,40 Z" fill="var(--charcoal)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FINAL CTA ───────────── */
function FinalCTA({ onApply }: { onApply: () => void }) {
  return (
    <section
      id="apply"
      className="scroll-mt-32 relative overflow-hidden bg-charcoal py-24 text-cream grain md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-charcoal/30 to-charcoal/10" />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[1.5px] w-[1.5px] rounded-full bg-offwhite/45"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 43) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-12">
        <Reveal>
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="eyebrow text-clay-soft">Step into Velira</span>
          </div>
        </Reveal>
        <h2 className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.18] tracking-normal">
          <StaggerWords text="Care shaped around you," className="block text-white" />
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={{ y: "100%", rotate: 1 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="inline-block italic text-offwhite/55 font-light font-serif"
            >
              ready to rejuvenate from inside.
            </motion.span>
          </span>
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-offwhite/70 font-light">
            Start with a friendly personal consultation. Share your goals, clarify your options, and
            let us design a calm, practical wellness plan tailored around your life.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-5">
            <MagneticButton data-open-inquiry="true" onClick={onApply}>
              Step into Velira
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-12 font-serif text-2xl italic text-clay-soft/80 font-light tracking-wide">
            Velira Health &amp; Wellness — Care shaped around you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
