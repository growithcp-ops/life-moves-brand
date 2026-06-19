import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Check,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";

import heroImg from "@/assets/hero-goa.jpg";
import circleImg from "@/assets/gallery-circle.jpg";
import clayImg from "@/assets/gallery-clay.jpg";
import forestImg from "@/assets/gallery-forest.jpg";
import fireImg from "@/assets/gallery-fire.jpg";
import founderImg from "@/assets/founder-portrait-v2.jpg";
import founderBgImg from "@/assets/founder-bg-v2.jpg";
import movementImg from "@/assets/gallery-movement.jpg";
import logoImg from "@/assets/logo.png";
import karanImg from "@/assets/karan_portrait.png";
import meeraImg from "@/assets/meera_portrait.png";
import priyaImg from "@/assets/priya_portrait.png";
import rohanImg from "@/assets/rohan_thumbnail.png";

import {
  Reveal,
  StaggerWords,
  DrawLine,
  ClipReveal,
  Counter,
  MagneticButton,
  Parallax,
} from "@/components/life-moves/primitives";
import { ApplicationModal } from "@/components/life-moves/application";

// Web Audio Ambient Synthesizer (procedurally generated waves and wind)
class SomaticSynth {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isRunning = false;
  private mode: "waves" | "wind" = "waves";

  constructor() {}

  start(mode: "waves" | "wind") {
    if (typeof window === "undefined") return;
    this.mode = mode;
    this.stop();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (mode === "waves") {
        // Pink noise approximation for wave sound
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          output[i] = pink * 0.08;
        }
      } else {
        // Brown noise simulation for whistling alpine wind
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5;
        }
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.filter = this.ctx.createBiquadFilter();
      if (mode === "waves") {
        this.filter.type = "lowpass";
        this.filter.frequency.value = 280;
        this.filter.Q.value = 1.0;
      } else {
        this.filter.type = "bandpass";
        this.filter.frequency.value = 450;
        this.filter.Q.value = 1.8;
      }

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = mode === "waves" ? 0.12 : 0.08;

      this.lfoNode = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();

      if (mode === "waves") {
        this.lfoNode.frequency.value = 0.08;
        this.lfoGain.gain.value = 0.06;
      } else {
        this.lfoNode.frequency.value = 0.15;
        this.lfoGain.gain.value = 0.04;
      }

      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.gainNode.gain);

      const filterLfoGain = this.ctx.createGain();
      filterLfoGain.gain.value = mode === "waves" ? 180 : 250;
      this.lfoNode.connect(filterLfoGain);
      filterLfoGain.connect(this.filter.frequency);

      this.noiseNode.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.noiseNode.start(0);
      this.lfoNode.start(0);
      this.isRunning = true;
    } catch (err) {
      console.error("Audio Context Init Failed: ", err);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }

  getActiveMode() {
    return this.isRunning ? this.mode : null;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIFE MOVES — A Living Break in India" },
      {
        name: "description",
        content:
          "You're living. But are you alive? A 5-day embodied retreat in Goa & the Himalayas for founders, executives and creatives.",
      },
      { property: "og:title", content: "LIFE MOVES — A Living Break" },
      {
        property: "og:description",
        content: "India's embodied living movement. 12 people per edition. Always.",
      },
    ],
  }),
  component: Index,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Index() {
  const [open, setOpen] = useState(false);
  const apply = () => setOpen(true);

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-hidden selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={apply} />

      {/* Watermark background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply z-0">
        <img
          src="/banyan-tree.png"
          alt="Banyan tree watermark"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10">
        <Hero onApply={apply} />
        <WhoFor />
        <WhatThisIs />
        <SocialProof />
        <Method />
        <Gallery />
        <Outcome />
        <Facilitator onApply={apply} />
        <Editions onApply={apply} />
        <FinalCTA onApply={apply} />
        <FAQ />
        <Footer onApply={apply} />
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
      <AmbientAudioController />
    </div>
  );
}

/* ───────────── NAV ───────────── */
export function Nav({
  onApply,
  alwaysSolid = false,
}: {
  onApply: () => void;
  alwaysSolid?: boolean;
}) {
  const [solid, setSolid] = useState(alwaysSolid);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysSolid) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease, delay: 0.2 }}
        className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          solid
            ? "top-4 w-[92%] max-w-[1300px] rounded-full border border-white/5 bg-charcoal/80 backdrop-blur-xl px-8 py-3 text-offwhite shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            : "top-0 w-full px-6 py-6 md:px-12 text-offwhite bg-transparent"
        }`}
      >
        <div className="mx-auto flex items-center justify-between gap-6 max-w-[1500px]">
          <Link to="/" className="flex items-center transition hover:opacity-85">
            <LogoMark className="text-white" />
          </Link>

          <div className="hidden items-center gap-3 lg:flex bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
            </span>
            <span className="text-[9.5px] uppercase font-medium tracking-wider text-offwhite/80">
              Goa · August 12 · 6 Places Left
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/experience"
              className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100"
            >
              The Experience
            </Link>
            <a
              href="/#editions"
              className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100"
            >
              Upcoming Editions
            </a>
            <a
              href="/#founder"
              className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100"
            >
              About Aman
            </a>

            <button
              onClick={onApply}
              className={`rounded-full px-5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] transition duration-500 border ${
                solid
                  ? "bg-clay border-clay text-offwhite hover:bg-transparent hover:text-clay"
                  : "bg-offwhite border-offwhite text-charcoal hover:bg-transparent hover:text-offwhite"
              }`}
            >
              Apply Now
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="eyebrow justify-self-end md:hidden text-offwhite/85 text-[9.5px]"
          >
            Menu
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-[60] flex flex-col bg-charcoal px-8 py-8 text-offwhite md:hidden grain"
          >
            <div className="flex items-center justify-between border-b border-offwhite/10 pb-6">
              <div className="flex items-center gap-3">
                <LogoMark className="text-white" />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="eyebrow flex items-center gap-1 hover:text-clay transition text-[9.5px]"
              >
                <span>Close</span> <span>✕</span>
              </button>
            </div>

            <nav className="mt-20 flex flex-1 flex-col justify-center gap-8">
              {[
                ["The Experience", "/experience"],
                ["Upcoming Editions", "/#editions"],
                ["About Aman", "/#founder"],
                ["Apply for Edition", "#apply"],
              ].map(([l, h], i) => {
                if (h.startsWith("/")) {
                  return (
                    <motion.div
                      key={l}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                    >
                      <Link
                        to={h as any}
                        onClick={() => setMenuOpen(false)}
                        className="font-serif text-4xl hover:text-clay transition"
                      >
                        {l}
                      </Link>
                    </motion.div>
                  );
                }
                return (
                  <motion.a
                    key={l}
                    href={h}
                    onClick={() => {
                      setMenuOpen(false);
                      if (l.startsWith("Apply")) onApply();
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                    className="font-serif text-4xl hover:text-clay transition"
                  >
                    {l}
                  </motion.a>
                );
              })}
            </nav>
            <p className="eyebrow opacity-50 mt-auto border-t border-offwhite/10 pt-6 text-[9.5px]">
              Life moves. Come move with it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        height: "46px",
        width: "98px",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${logoImg})`,
        maskImage: `url(${logoImg})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
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
        {/* Layer 1: Sage Green Wave */}
        <path
          d="M0,90 C320,160 640,40 960,110 C1180,160 1310,120 1440,70 L1440,220 L0,220 Z"
          fill="oklch(0.36 0.05 145)"
          opacity="0.35"
        />
        {/* Layer 2: Soft Clay Wave */}
        <path
          d="M0,120 C280,180 560,90 840,150 C1120,210 1280,130 1440,110 L1440,220 L0,220 Z"
          fill="var(--clay-soft)"
          opacity="0.65"
        />
        {/* Layer 3: Terracotta/Clay Wave */}
        <path
          d="M0,150 C400,90 700,210 1000,160 C1200,130 1320,170 1440,150 L1440,220 L0,220 Z"
          fill="var(--clay)"
          opacity="0.85"
        />
        {/* Layer 4: Offwhite Wave */}
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
      className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-charcoal text-offwhite grain"
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-105 bg-charcoal">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-[115%] w-full object-cover opacity-50 filter brightness-[0.7] saturate-[0.85]"
          poster={heroImg}
        >
          <source
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e36913c1ca117bbbc0a147d0d38&profile_id=165&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/15 to-charcoal/90 pointer-events-none" />
      </motion.div>

      <motion.div
        style={{ opacity, y: yText }}
        className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-between px-6 pt-32 pb-24 md:px-12 md:pt-40 md:pb-32"
      >
        <Reveal delay={0.4}>
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-6 bg-clay" />
            <span className="eyebrow tracking-[0.24em] opacity-90 text-clay-soft">
              Life Moves · Goa Retreat · India
            </span>
          </div>
        </Reveal>

        <div className="max-w-[1100px] mt-8">
          <h1 className="font-serif text-[clamp(2.8rem,9vw,8rem)] leading-[1.1] pb-2">
            <StaggerWords text="You're living." className="block text-white" delay={0.4} />
            <span className="block overflow-hidden pb-5 -mb-5">
              <motion.span
                initial={{ y: "100%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.4, delay: 0.9, ease }}
                className="inline-block pb-2 italic text-offwhite/50 font-light"
              >
                But are you{" "}
                <span className="text-clay-soft font-normal relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-clay-soft/40">
                  alive?
                </span>
              </motion.span>
            </span>
          </h1>

          <Reveal delay={1.8} y={16}>
            <p className="mt-8 max-w-[480px] text-base leading-relaxed text-offwhite/70 md:text-lg font-light">
              A 5-day Living Break for founders, executives and creatives who've built the life they
              were told to want — and quietly suspect there's more.
            </p>
          </Reveal>

          <Reveal delay={2.2}>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <MagneticButton onClick={onApply}>Take a Living Break</MagneticButton>
              <div className="flex items-center gap-3 text-offwhite/60">
                <span className="h-px w-8 bg-current opacity-30" />
                <span className="eyebrow text-[9.5px]">Goa · August 12 · 6 Places Remaining</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="flex items-end justify-between border-t border-offwhite/10 pt-8 mt-12">
          <Reveal delay={2.4}>
            <a
              href="#experience"
              className="group flex items-center gap-3 eyebrow text-[9.5px] opacity-65 hover:opacity-100 transition duration-300"
            >
              <span className="animate-bounce">↓</span>
              <span>Scroll to feel it</span>
            </a>
          </Reveal>
          <Reveal delay={2.4}>
            <div className="eyebrow text-[9.5px] opacity-50">Est. 2010 · India</div>
          </Reveal>
        </div>
      </motion.div>

      {/* Floating SVG Rotating Circular Text Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.5, ease }}
        className="pointer-events-none absolute right-6 top-24 z-10 md:right-16 md:top-32"
      >
        <div className="relative h-28 w-28 md:h-36 md:w-36 flex items-center justify-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute h-full w-full text-offwhite/30"
            viewBox="0 0 100 100"
          >
            <path
              id="circlePath"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              fill="none"
            />
            <text className="font-sans text-[7px] uppercase tracking-[0.24em] fill-current font-semibold">
              <textPath href="#circlePath" startOffset="0%">
                · GOA EDITION · AUGUST 12 · 6 PLACES REMAINING · EMBODIED RETREAT
              </textPath>
            </text>
          </motion.svg>
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl md:text-4xl text-clay font-medium">
              <Counter to={6} />
            </span>
            <span className="text-[7.5px] uppercase tracking-widest text-offwhite/50">Spaces</span>
          </div>
        </div>
      </motion.div>

      <WavyDivider />
    </section>
  );
}

/* ───────────── WHO FOR ───────────── */
function WhoFor() {
  const signs = [
    { num: "01", text: "You optimised your calendar. But not your aliveness." },
    { num: "02", text: "Your wins feel quieter than your fears." },
    { num: "03", text: "Sunday evenings hold a small, specific dread." },
    { num: "04", text: "You take photos of moments you barely felt." },
    { num: "05", text: "You're 'fine,' said the way no one believes." },
    { num: "06", text: "You wonder, often, if this is it." },
  ];

  return (
    <section
      id="experience"
      className="scroll-mt-32 bg-cream text-charcoal py-32 md:py-48 border-b border-charcoal/5 relative overflow-hidden"
    >
      {/* Background Image with soft elegant overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/who-this-is-for-bg.png"
          alt="Who This Is For Background"
          className="w-full h-full object-cover object-center opacity-35 mix-blend-multiply scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/10 to-cream z-[1]" />
      </div>

      {/* Floating abstract blobs */}
      <div className="absolute top-1/4 -left-48 w-[40rem] h-[40rem] bg-clay/5 rounded-full blur-3xl pointer-events-none animate-float z-[2]" />
      <div className="absolute bottom-1/4 -right-48 w-[35rem] h-[35rem] bg-moss/5 rounded-full blur-3xl pointer-events-none animate-float-reverse z-[2]" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-12 relative z-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.3fr] items-start">
          {/* Left Column - Sticky */}
          <div className="md:sticky md:top-32 h-fit space-y-6">
            <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-1 block">
              This isn't for everyone
            </span>
            <h2 className="font-serif text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05]">
              Who This Is For.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6" />
            <div className="space-y-4 max-w-md">
              <p className="text-base leading-relaxed text-charcoal/80 font-light">
                For founders, builders, creatives, and professionals who have built a life that
                works and still feel something missing.
              </p>
              <p className="text-base leading-relaxed text-charcoal/60 font-light">
                You're not in crisis. You're managing. And managing isn't the same as living.
              </p>
            </div>
          </div>

          {/* Right Column - Scroll list of signs aligned to a clean grid */}
          <div className="space-y-4">
            {signs.map((s, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <div className="group relative glass p-6 md:p-8 transition-all duration-500 hover:bg-cream/90 rounded-sm">
                  {/* Subtle hover lines drawing */}
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

/* ───────────── PHILOSOPHY (WHAT THIS IS) ───────────── */
function WhatThisIs() {
  const items = [
    {
      title: "Yoga & Somatic Movement",
      desc: "Realigning with the body through slow, intuitive, and nature-guided motion.",
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
      title: "Creative Expression",
      desc: "Clay, ink, and texture workshops to release the quiet tension we hold in our hands.",
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
            d="M9.53 16.122A3 3 0 00.17 15M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="14" cy="11" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Mindful Connections",
      desc: "Structured open circles, silent beach walks, and organic farm-to-table meals.",
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
            fill="oklch(0.95 0.012 110)"
            opacity="0.6"
          />
          <path
            d="M-50,350 C400,250 600,500 1100,350 C1400,260 1550,450 1650,380 L1650,800 L-50,800 Z"
            fill="oklch(0.92 0.018 85)"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] items-center">
          {/* Left Column: Philosophy details */}
          <div className="space-y-6">
            <Reveal>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-clay">02 / Our Philosophy</span>
              </div>
              <h2 className="font-serif text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.05] mt-2">
                A Living Break. <br />
                <em className="italic text-forest font-serif font-normal">Not a holiday.</em>
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
              <p className="mt-4 text-base leading-relaxed text-charcoal/70 font-light max-w-xl">
                A holiday distracts you from your life. A Living Break gives you back to it. We
                bring together twelve people for five days of deep rest, tactile creativity, and
                body-led practices in absolute quiet.
              </p>
            </Reveal>
          </div>

          {/* Right Column: Wavy Decorative circle mask (scaled down) */}
          <div className="relative flex justify-center items-center">
            {/* Wavy background decor behind circle */}
            <div className="absolute w-[110%] h-[110%] bg-clay/5 rounded-full blur-2xl -z-10" />
            <div className="absolute w-[95%] h-[95%] bg-[#e9e4d9] rounded-wavy -z-10 animate-[pulse_8s_infinite]" />
            <div className="absolute w-[102%] h-[102%] border border-dashed border-clay/20 rounded-full -z-10 animate-[spin_60s_linear_infinite]" />

            <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] overflow-hidden rounded-full border-[8px] border-white shadow-2xl relative">
              <img
                src={forestImg}
                alt="Forest Path Philosophy"
                className="w-full h-full object-cover scale-105 transition-transform duration-[6s] hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent mix-blend-multiply" />
            </div>

            {/* Floating details badge */}
            <div className="absolute bottom-3 right-3 sm:right-8 bg-white/95 backdrop-blur shadow-md px-3.5 py-1.5 rounded-full border border-charcoal/5 flex items-center gap-1.5 text-[8px] uppercase font-semibold tracking-wider text-charcoal">
              <span className="h-1.5 w-1.5 rounded-full bg-clay animate-ping" />
              <span>Somatic Focus</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: List of practices pills in a horizontal 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-charcoal/5 mt-12">
          {items.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.15}>
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

// Removed Somatic Pacer section

/* ───────────── SOCIAL PROOF (TESTIMONIALS) ───────────── */
function SocialProof() {
  const [activeSlide, setActiveSlide] = useState(0);
  const testimonials = [
    {
      name: "Vikram S.",
      role: "Founder, Series B SaaS",
      quote: "I came for a break. I left with a different operating system.",
      img: movementImg,
    },
    {
      name: "Anjali R.",
      role: "Creative Director",
      quote: "Five days that quietly rearranged the next five years.",
      img: fireImg,
    },
    {
      name: "Devraj M.",
      role: "Investor",
      quote: "I forgot how loud my own life was until I stepped out of it.",
      img: circleImg,
    },
  ];

  return (
    <section className="bg-cream text-charcoal py-16 md:py-24 overflow-hidden relative border-y border-charcoal/5">
      {/* Background Image with soft elegant overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/people-like-you-bg.png"
          alt="People Like You Background"
          className="w-full h-full object-cover object-center opacity-65 mix-blend-multiply scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/5 to-cream z-[1]" />
      </div>

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-3 block">
              What shifted for them
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05] text-center">
              People Like You.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-5 mx-auto" />
          </div>
        </Reveal>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((c, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group bg-white border border-charcoal/10 hover:border-clay/30 p-6 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full space-y-6 text-charcoal">
                <div>
                  <span className="font-serif text-4xl leading-none text-clay/20 select-none block h-3 overflow-hidden">
                    “
                  </span>
                  <p className="font-serif text-base md:text-lg italic leading-relaxed text-charcoal/90 mt-1 font-light">
                    “{c.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-charcoal/10 pt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-clay/20 shadow-sm relative bg-charcoal/5">
                    <img src={c.img} className="w-full h-full object-cover" alt={c.name} />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold tracking-wider text-clay">
                      {c.name}
                    </h4>
                    <p className="text-[9px] text-charcoal/50 uppercase tracking-widest font-semibold mt-0.5">
                      {c.role}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── METHOD ───────────── */
function Method() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top;

      const isOutOfSnapZone = rect.top < -120 || rect.top > 120;
      if (isOutOfSnapZone) {
        setJustUnlocked(false);
      }

      if (!isLocked && !justUnlocked) {
        // If the top is within a snapping zone
        if (rect.top >= -80 && rect.top <= 80) {
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
          setIsLocked(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLocked, justUnlocked]);

  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Block native page scroll

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      if (isScrolling.current) {
        scrollTimeout.current = setTimeout(() => {
          isScrolling.current = false;
        }, 150);
        return;
      }

      isScrolling.current = true;

      if (e.deltaY > 0) {
        // Scroll down
        if (activeIndex < 3) {
          setActiveIndex((prev) => prev + 1);
        } else {
          setIsLocked(false);
          setJustUnlocked(true);
          window.scrollBy({ top: 150, behavior: "smooth" });
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        } else {
          setIsLocked(false);
          setJustUnlocked(true);
          window.scrollBy({ top: -150, behavior: "smooth" });
        }
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      if (Math.abs(deltaY) > 40) {
        e.preventDefault(); // Block touch scroll inside snapping zone

        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        if (isScrolling.current) {
          scrollTimeout.current = setTimeout(() => {
            isScrolling.current = false;
          }, 150);
          return;
        }

        isScrolling.current = true;

        if (deltaY > 0) {
          if (activeIndex < 3) {
            setActiveIndex((prev) => prev + 1);
            touchStartY.current = touchY;
          } else {
            setIsLocked(false);
            setJustUnlocked(true);
            window.scrollBy({ top: 150, behavior: "smooth" });
          }
        } else {
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
            touchStartY.current = touchY;
          } else {
            setIsLocked(false);
            setJustUnlocked(true);
            window.scrollBy({ top: -150, behavior: "smooth" });
          }
        }

        scrollTimeout.current = setTimeout(() => {
          isScrolling.current = false;
        }, 150);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (isScrolling.current) return;

        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);

        if (activeIndex < 3) {
          setActiveIndex((prev) => prev + 1);
        } else {
          setIsLocked(false);
          setJustUnlocked(true);
          window.scrollBy({ top: 150, behavior: "smooth" });
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (isScrolling.current) return;

        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 700);

        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        } else {
          setIsLocked(false);
          setJustUnlocked(true);
          window.scrollBy({ top: -150, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isLocked, activeIndex]);

  const practices = [
    {
      t: "Art",
      d: "Clay, paint, ink. No skill required.",
      iconD: "M4 22 Q12 4 22 18 T36 22",
      img: "/art.png",
    },
    {
      t: "Movement",
      d: "Body-led practice. No mats of shame.",
      iconD: "M6 30 Q14 6 22 18 T34 8",
      img: "/movement.png",
    },
    {
      t: "Mindfulness",
      d: "Quiet attention. Not silent retreat.",
      iconD: "M4 20 C 8 8, 32 8, 36 20 C 32 32, 8 32, 4 20 Z",
      img: "/mindfulness.png",
    },
    {
      t: "Connection",
      d: "Eleven strangers who become a circle.",
      iconD: "M6 28 L20 6 L34 28 Z M14 22 L26 22",
      img: "/connection.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative h-screen bg-offwhite text-charcoal border-b border-charcoal/5 grain overflow-hidden flex flex-col justify-center items-center py-8 md:py-12"
    >
      <div className="w-full max-w-[1500px] px-6 md:px-12 flex flex-col h-full justify-between relative z-10">
        
        {/* Header Row */}
        <div className="text-center max-w-2xl mx-auto mt-4 md:mt-6">
          <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-2 block">
            Four ways back to yourself
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05]">
            The Method.
          </h2>
          <div className="w-16 h-0.5 bg-clay mt-3 mx-auto" />
        </div>

        {/* Active Card Container */}
        <div className="flex-1 flex items-center justify-center my-4 md:my-8">
          <div className="w-full max-w-4xl relative h-[480px] sm:h-[420px] md:h-[380px]">
            <AnimatePresence mode="wait">
              {practices.map((p, i) => {
                if (i !== activeIndex) return null;
                return (
                  <motion.div
                    key={p.t}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-white border border-charcoal/10 rounded-sm shadow-luxury overflow-hidden grid grid-rows-[200px_1fr] md:grid-rows-none md:grid-cols-2 h-full"
                  >
                    {/* Left: Image Container */}
                    <div className="relative h-full w-full overflow-hidden bg-charcoal/5">
                      <img
                        src={p.img}
                        alt={p.t}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-charcoal/5 mix-blend-multiply" />
                    </div>

                    {/* Right: Content Container */}
                    <div className="p-6 md:p-10 flex flex-col justify-between h-full relative">
                      {/* Background subtle glow */}
                      <div className="absolute -inset-40 bg-gradient-to-br from-clay/5 to-transparent opacity-100 blur-3xl pointer-events-none" />

                      <div className="space-y-4 md:space-y-6 relative z-10">
                        {/* Icon & Sparkle */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-full border border-clay/15 bg-clay/5 flex items-center justify-center text-clay">
                            <PathIcon d={p.iconD} isHovered={true} size={20} />
                          </div>
                          <Sparkles className="h-4.5 w-4.5 text-clay-soft" />
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-3">
                          <h3 className="font-serif text-xl md:text-2xl font-bold tracking-[0.12em] text-charcoal">
                            {p.t}
                          </h3>
                          <p className="text-xs md:text-sm leading-relaxed text-charcoal/70 font-light">
                            {p.d}
                          </p>
                        </div>
                      </div>

                      {/* Pagination indicator inside card */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-charcoal/5 relative z-10">
                        {practices.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              idx === activeIndex
                                ? "w-8 bg-clay"
                                : "w-2 bg-charcoal/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Scrolling hint / Indicator */}


      </div>
    </section>
  );
}

function PathIcon({ d, isHovered, size = 24 }: { d: string; isHovered: boolean; size?: number }) {
  return (
    <svg
      width={size + 6}
      height={size + 2}
      viewBox="0 0 40 40"
      fill="none"
      className="overflow-visible"
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0.3 }}
        animate={
          isHovered ? { pathLength: 1, strokeWidth: 1.6 } : { pathLength: 0.3, strokeWidth: 1.2 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ───────────── GALLERY (SOCIAL FEED) ───────────── */
function Gallery() {
  const images = [
    {
      src: movementImg,
      alt: "Somatic movement on deck",
      className: "col-span-1 row-span-2",
    },
    {
      src: forestImg,
      alt: "Forest path walk",
      className: "col-span-1 row-span-1",
    },
    {
      src: clayImg,
      alt: "Hands folding clay",
      className: "col-span-2 row-span-2",
    },
    {
      src: circleImg,
      alt: "Meditation circle",
      className: "col-span-1 row-span-2",
    },
    {
      src: fireImg,
      alt: "Fire circle sharing",
      className: "col-span-1 row-span-1",
    },
    {
      src: heroImg,
      alt: "Goa beach retreat view",
      className: "col-span-2 row-span-2",
    },
    {
      src: founderImg,
      alt: "Aman facilitating circle",
      className: "col-span-1 row-span-2",
    },
    {
      src: karanImg,
      alt: "Somatic integration",
      className: "col-span-1 row-span-1",
    },
    {
      src: meeraImg,
      alt: "Morning yoga practice",
      className: "col-span-1 row-span-1",
    },
    {
      src: priyaImg,
      alt: "Quiet reflection journaling",
      className: "col-span-1 row-span-1",
    },
    {
      src: rohanImg,
      alt: "Coastal sunset walk group",
      className: "col-span-1 row-span-1",
    },
  ];

  return (
    <section className="bg-charcoal text-white py-16 md:py-20 border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow text-clay-soft tracking-[0.24em] font-semibold text-xs uppercase mb-3 block">
              __no performance required.
            </span>
            <h2 className="font-serif text-3.5xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] text-center">
              Real Moments. Real People.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6 mx-auto" />
          </div>
        </Reveal>

        {/* Organic Masonry/Grid Collage */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-3 md:gap-4 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] lg:auto-rows-[190px] max-w-[1250px] mx-auto py-6">
          {images.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.04} className={`${item.className} h-full`}>
              <div
                className="group relative w-full h-full overflow-hidden rounded-xl bg-charcoal/20 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <p className="font-serif text-xl md:text-2xl text-offwhite/80 tracking-wide font-light">
              Twelve people. Five days.{" "}
              <em className="italic text-clay-soft font-serif font-normal">
                This is what it actually looks like.
              </em>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── THE OUTCOME ───────────── */
function Outcome() {
  const [activeIndex, setActiveIndex] = useState(0);

  const outcomes = [
    {
      title: "A clearer decision they’ve been avoiding",
      description: "Gain the distance needed to cut through the noise, leaving Goa with absolute clarity on the single most critical choice ahead of you.",
      image: circleImg,
      tagline: "Clarity",
    },
    {
      title: "A conversation they’ve needed to have",
      description: "Reclaim your voice. Learn how to speak from a place of alignment, resolving long-standing tension with honesty and grace.",
      image: clayImg,
      tagline: "Expression",
    },
    {
      title: "A different relationship with themselves.",
      description: "Shift from constant self-critique to a deeper state of self-trust and somatic presence that supports your long-term expansion.",
      image: forestImg,
      tagline: "Self-Trust",
    },
    {
      title: "More energy than they arrived with",
      description: "Release deep physical fatigue through morning movement, breath, and soundscapes, returning home fully recharged.",
      image: movementImg,
      tagline: "Vitality",
    },
    {
      title: "Practical practices to carry home",
      description: "Simple, repeatable daily habits—somatic tools, journaling techniques, and breathing exercises—that fit seamlessly into your life.",
      image: fireImg,
      tagline: "Integration",
    },
    {
      title: "A 90-day map to keep moving",
      description: "A structured integration path designed to keep the momentum going, ensuring the changes translate into lasting routine.",
      image: heroImg,
      tagline: "Direction",
    },
  ];

  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

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
      {/* Floating abstract decorative elements */}
      <div className="absolute top-1/3 -left-48 w-[35rem] h-[35rem] bg-moss/5 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-clay/5 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="mx-auto max-w-[1300px] px-6 md:px-12 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-center">
          
          {/* Left Column: Heading and Subtitle */}
          <div className="space-y-6 lg:sticky lg:top-40 h-fit">
            <Reveal>
              <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-1 block">
                Not temporary inspiration
              </span>
              <h2 className="font-serif text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05]">
                The Outcome.
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
            </Reveal>
            
            <Reveal delay={0.15}>
              <div className="space-y-4 max-w-md">
                <p className="text-base leading-relaxed text-charcoal/80 font-light">
                  Something real to take home.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-lg md:text-xl font-serif italic text-clay tracking-wider mt-6">
                  <span>Clarity.</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  <span>Energy.</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  <span>Truth.</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Unified Auto-Sliding Card */}
          <div className="w-full">
            <div className="bg-cream/40 backdrop-blur-md rounded-2xl border border-charcoal/10 shadow-2xl overflow-hidden grid md:grid-cols-[1.1fr_1.4fr] items-stretch min-h-[460px] relative group">
              
              {/* Left side: Animated Image Frame */}
              <div className="relative h-64 md:h-auto overflow-hidden bg-charcoal/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={outcomes[activeIndex].image}
                      alt={outcomes[activeIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Category Tag */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-4 z-20 bg-cream/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal/5 shadow-sm text-[10px] uppercase tracking-widest font-semibold text-charcoal/80"
                  >
                    {outcomes[activeIndex].tagline}
                  </motion.div>
                </AnimatePresence>

                {/* Massive decorative background number */}
                <div className="absolute top-2 right-2 text-white/10 text-9xl font-serif font-black select-none pointer-events-none">
                  0{activeIndex + 1}
                </div>
              </div>

              {/* Right side: Active Content Panel */}
              <div className="p-8 md:p-12 flex flex-col justify-between h-full bg-cream/90">
                {/* Text Content */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-clay tracking-wider">
                      Outcome 0{activeIndex + 1} of 06
                    </span>
                    <span className="text-[10px] bg-forest/10 text-forest px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                      Retreat Benefit
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4"
                    >
                      <h3 className="font-serif text-2.5xl md:text-3.5xl text-forest font-bold tracking-tight leading-[1.2]">
                        {outcomes[activeIndex].title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed text-charcoal/80 font-light">
                        {outcomes[activeIndex].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Controls (Progress Bar + Navigation) */}
                <div className="mt-8 pt-6 border-t border-charcoal/5 space-y-6">
                  {/* Progress Line indicators */}
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
                              key={activeIndex} // Reset animation when activeIndex changes
                            />
                          )}
                          {!isActive && idx < activeIndex && (
                            <div className="absolute inset-0 bg-clay/40" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Previous / Next buttons */}
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

/* ───────────── MEET YOUR FACILITATOR (SECTION 8) ───────────── */
function Facilitator({ onApply }: { onApply: () => void }) {
  return (
    <section
      id="founder"
      className="scroll-mt-32 bg-offwhite text-charcoal py-32 md:py-44 relative overflow-hidden border-t border-charcoal/5"
    >
      {/* Section Background Image */}
      <img
        src={founderBgImg}
        alt="Facilitator Background"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.18] pointer-events-none z-0"
      />

      {/* Floating abstract blobs */}
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-clay/5 rounded-full blur-3xl pointer-events-none animate-float z-10" />
      <div className="absolute top-10 right-10 w-[35rem] h-[35rem] bg-[#e3decf]/10 rounded-full blur-3xl pointer-events-none animate-float-reverse z-10" />

      <div className="mx-auto max-w-[1500px] px-6 md:px-12 relative z-20">
        <div className="grid gap-16 md:grid-cols-[0.75fr_1.25fr] md:gap-20 items-center max-w-5xl mx-auto">
          {/* Photo frame */}
          <div className="relative max-w-[340px] w-full mx-auto md:mr-0">
            {/* Wrapper for image and its borders */}
            <div className="relative group">
              <div className="absolute -inset-1 border border-clay/30 translate-x-4 translate-y-4 rounded-sm pointer-events-none transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="absolute -inset-1 border border-charcoal/10 -translate-x-3 -translate-y-3 rounded-sm pointer-events-none transition-transform duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />

              <Parallax amount={15}>
                <ClipReveal
                  src={founderImg}
                  alt="Aman Gupta, Facilitator of Life Moves"
                  ratio="aspect-[4/5]"
                  className="shadow-2xl border border-charcoal/10 rounded-sm"
                />
              </Parallax>
            </div>

            {/* Signature Outside Borders */}
            <div className="mt-8 flex items-center gap-4 border-l border-clay/35 pl-4">
              <span className="font-serif text-2xl italic font-serif">— Aman Gupta</span>
              <span className="eyebrow text-charcoal/50 text-[9px] font-semibold tracking-widest relative top-[0.5px]">
                Facilitator, Life Moves
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <Reveal>
              <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-2 block">
                Aman Gupta · Facilitator
              </span>
              <h2 className="font-serif text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05]">
                Led By.
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-6 max-w-xl">
                <p className="text-base leading-relaxed text-charcoal/90 font-medium">
                  15 years of practice. 200+ retreats and workshops. 10,000+ people taught from
                  India, Europe, the US, and Southeast Asia.
                </p>
                <p className="text-base leading-relaxed text-charcoal/70 font-light">
                  Aman built Life Moves around one question most growth programmes never ask: how do
                  you actually want to live? A Living Break is where that question gets answered —
                  through movement, art, and the body, not just talk.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── EDITIONS (UPCOMING RETREATS) ───────────── */
function Editions({ onApply }: { onApply: () => void }) {
  const list = [
    {
      loc: "Oasis Monsoon Retreat",
      date: "Aug 12, 2026",
      desc: "Coastal villa. Arabian Sea at the doorstep. Experience the raw luxury of Goa's coastal rain.",
      spots: "6 spots left",
      img: circleImg,
      coords: "Goa Beachfront",
    },
    {
      loc: "Oceanic Vinyasa Retreat",
      date: "Aug 26, 2026",
      desc: "Same sea-facing villa. Different circle. Cool ocean breeze and crisp, sun-drenched coastal walks.",
      spots: "9 spots left",
      img: heroImg,
      coords: "Goa Beachfront",
    },
    {
      loc: "Alpine Forest Silence",
      date: "Oct 14, 2026",
      desc: "A hand-built timber house above the clouds. Tall pines, morning woodsmoke, and absolute silence.",
      spots: "Waitlist open",
      img: forestImg,
      coords: "Himachal Alpine",
    },
  ];

  return (
    <section
      id="editions"
      className="scroll-mt-24 py-24 md:py-36 bg-cream text-charcoal relative overflow-hidden border-t border-charcoal/5"
    >
      {/* Soft abstract background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clay/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-moss/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 md:px-12 relative z-10">
        {/* Main outer card container with curved/wavy shapes */}
        <div className="bg-white rounded-sm p-8 md:p-14 border border-charcoal/10 shadow-luxury relative overflow-hidden">
          {/* Top curved SVG overlay line for abstract accent */}
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
              Small circle · Limited places
            </span>
            <h2 className="font-serif text-5xl md:text-8xl font-black text-charcoal tracking-tight leading-[1.05] text-center">
              Editions.
            </h2>
            <div className="w-20 h-0.5 bg-clay my-6 mx-auto" />
          </div>

          {/* Retreat Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {list.map((e, idx) => (
              <Reveal key={idx} delay={idx * 0.15}>
                <div className="group bg-offwhite border border-charcoal/10 hover:border-clay/30 p-4 rounded-sm shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-1 text-charcoal">
                  {/* Landscape Image with float badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-charcoal/10 shadow-sm bg-charcoal/5">
                    <img
                      src={e.img}
                      alt={e.loc}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-60" />

                    {/* Floating date badge */}
                    <span className="absolute top-4 left-4 bg-clay text-white text-[9.5px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                      {e.date}
                    </span>

                    {/* Floating spot badge */}
                    <span className="absolute bottom-4 right-4 bg-charcoal/85 backdrop-blur-md text-offwhite border border-white/10 text-[9px] font-semibold tracking-wider px-3 py-1 rounded-full">
                      {e.spots}
                    </span>
                  </div>

                  {/* Content below image */}
                  <div className="pt-5 px-1 pb-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-[9px] text-charcoal/50 tracking-wider">
                        {e.coords}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-clay transition-colors duration-300 font-semibold leading-tight">
                      {e.loc}
                    </h3>

                    <p className="text-xs text-charcoal/70 leading-relaxed font-light min-h-[48px]">
                      {e.desc}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={onApply}
                        className="w-full py-2.5 rounded-sm border border-clay/20 group-hover:border-clay group-hover:bg-clay group-hover:text-white transition-all duration-500 eyebrow text-[9.5px] font-bold text-clay tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Request Invite</span>
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom abstract accent curve */}
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
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[1.5px] w-[1.5px] rounded-full bg-offwhite"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 43) % 100}%`,
              boxShadow: "0 0 5px rgba(247, 244, 239, 0.5)",
            }}
            animate={{ opacity: [0.1, 0.85, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 4 + (i % 6),
              repeat: Infinity,
              delay: (i % 8) * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-12">
        <Reveal>
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="eyebrow text-clay-soft">08 / Take a Living Break</span>
          </div>
        </Reveal>
        <h2 className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.18] tracking-normal">
          <StaggerWords text="The next five days" className="block text-white" />
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={{ y: "100%", rotate: 1 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="inline-block italic text-offwhite/50 font-light font-serif"
            >
              could change the next five years.
            </motion.span>
          </span>
        </h2>
        <Reveal delay={0.4}>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-offwhite/70 font-light">
            Twelve seats. A short application. A real conversation before you say yes. No mass
            intake. No upsell. Just a careful door, opened on purpose.
          </p>
        </Reveal>
        <Reveal delay={0.6}>
          <div className="mt-8 flex justify-center">
            <MagneticButton onClick={onApply}>Take a Living Break</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.8}>
          <motion.p
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12 font-serif text-2xl italic text-clay-soft font-light tracking-wide font-serif"
          >
            Life is meant to be felt.
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
function FAQ() {
  const faqData = [
    {
      q: "Do I need experience?",
      a: "No.",
    },
    {
      q: "How is this different from other programmes?",
      a: "Most programmes work through your mind — more thinking, more frameworks, more strategy. A Living Break works through your body, your creativity, and your emotions first.",
    },
    {
      q: "Is this spiritual?",
      a: "No guru, no doctrine. Just real human work.",
    },
    {
      q: "What's the investment?",
      a: "Starting at ₹48,000.",
    },
    {
      q: "What if I don't know what I need?",
      a: "That's the best reason to come.",
    },
    {
      q: "What if I'm introverted?",
      a: "That's welcome here. There's space for both connection and solitude — nothing is forced.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-cream text-charcoal py-24 md:py-32 border-t border-charcoal/5 relative z-10">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr]">
          {/* Left Column: Heading */}
          <div className="lg:sticky lg:top-40 h-fit space-y-4">
            <Reveal>
              <span className="eyebrow text-clay tracking-[0.24em] font-semibold text-xs uppercase mb-1 block">
                FAQ
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.1]">
                Questions people ask.
              </h2>
              <div className="w-20 h-0.5 bg-clay my-6" />
            </Reveal>
          </div>

          {/* Right Column: Accordion */}
          <div className="space-y-4">
            {faqData.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div className="border-b border-charcoal/10 pb-4">
                    <button
                      onClick={() => toggle(idx)}
                      className="w-full py-4 flex justify-between items-center text-left text-charcoal hover:text-clay transition-colors duration-300 focus:outline-none group cursor-pointer"
                    >
                      <span className="font-serif text-lg md:text-xl font-medium tracking-tight pr-4">
                        {item.q}
                      </span>
                      <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {/* Horizontal line */}
                        <span className="absolute w-4 h-[1.5px] bg-charcoal/60 group-hover:bg-clay transition-colors duration-300" />
                        {/* Vertical line (rotates/fades to open) */}
                        <motion.span
                          initial={{ rotate: 90 }}
                          animate={{ rotate: isOpen ? 0 : 90, opacity: isOpen ? 0 : 1 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute w-[1.5px] h-4 bg-charcoal/60 group-hover:bg-clay transition-colors"
                        />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 pt-1 text-sm md:text-base leading-relaxed text-charcoal/70 font-light max-w-2xl">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
export function Footer({ onApply }: { onApply?: () => void }) {
  return (
    <footer className="bg-offwhite py-20 md:py-24 border-t border-hairline relative z-10 text-charcoal">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <a href="#top" className="flex items-center gap-2 text-charcoal">
              <LogoMark className="text-charcoal" />
              <span className="font-serif text-lg font-bold tracking-tight">Life Moves</span>
            </a>
            <div className="space-y-1">
              <p className="max-w-xs text-sm leading-relaxed text-charcoal/80 font-medium">
                India's Embodied Living Movement
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-charcoal/50 font-light">
                Twelve people, five days, one quiet circle.
              </p>
            </div>
          </div>

          {/* Column 2: Explore Links */}
          <div className="space-y-4">
            <div className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-wider uppercase">
              Explore
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/experience"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  The Experience
                </Link>
              </li>
              <li>
                <a
                  href="/#editions"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Editions
                </a>
              </li>
              <li>
                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    onApply?.();
                  }}
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light cursor-pointer"
                >
                  Request Your Invite
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="space-y-4">
            <div className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-wider uppercase">
              Legal
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#privacy"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#refund"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <div className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-wider uppercase">
              Contact
            </div>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:info@lifemoves.in"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  info@lifemoves.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <DrawLine className="my-14 text-charcoal" />

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-charcoal/50 uppercase tracking-widest font-medium">
            <a href="mailto:info@lifemoves.in" className="hover:text-clay transition duration-300">
              info@lifemoves.in
            </a>
            <span>Goa · Himachal Pradesh · India</span>
          </div>
          <p className="font-serif text-xl italic text-clay font-light font-serif">
            Life moves. A way to more Human Living.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────── AMBIENT AUDIO CONTROLLER ───────────── */
function AmbientAudioController() {
  const synthRef = useRef<SomaticSynth | null>(null);
  const [activeMode, setActiveMode] = useState<"waves" | "wind" | null>(null);

  useEffect(() => {
    synthRef.current = new SomaticSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  const toggle = (mode: "waves" | "wind") => {
    if (!synthRef.current) return;
    if (activeMode === mode) {
      synthRef.current.stop();
      setActiveMode(null);
    } else {
      synthRef.current.start(mode);
      setActiveMode(mode);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full bg-charcoal/80 backdrop-blur-md border border-white/10 p-1.5 text-offwhite shadow-2xl">
      <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-offwhite/50 hidden md:block">
        Soundscape
      </div>
      <button
        onClick={() => toggle("waves")}
        className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-semibold transition ${
          activeMode === "waves"
            ? "bg-clay text-offwhite animate-pulse"
            : "hover:bg-white/5 text-offwhite/75"
        }`}
      >
        Waves
      </button>
      <button
        onClick={() => toggle("wind")}
        className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-semibold transition ${
          activeMode === "wind"
            ? "bg-clay text-offwhite animate-pulse"
            : "hover:bg-white/5 text-offwhite/75"
        }`}
      >
        Wind
      </button>
      {activeMode && (
        <span className="flex h-1.5 w-1.5 relative mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-clay"></span>
        </span>
      )}
    </div>
  );
}
