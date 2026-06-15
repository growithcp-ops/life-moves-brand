import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight, ArrowRight, Play, Check, ChevronRight, X, Calendar, MapPin, Sparkles, Send, Volume2, VolumeX } from "lucide-react";

import heroImg from "@/assets/hero-goa.jpg";
import circleImg from "@/assets/gallery-circle.jpg";
import clayImg from "@/assets/gallery-clay.jpg";
import forestImg from "@/assets/gallery-forest.jpg";
import fireImg from "@/assets/gallery-fire.jpg";
import founderImg from "@/assets/founder.jpg";
import movementImg from "@/assets/gallery-movement.jpg";

import { Reveal, StaggerWords, DrawLine, ClipReveal, Counter, MagneticButton, Parallax } from "@/components/life-moves/primitives";
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
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          output[i] = pink * 0.08;
        }
      } else {
        // Brown noise simulation for whistling alpine wind
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
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
      { name: "description", content: "You're living. But are you alive? A 5-day embodied retreat in Goa & the Himalayas for founders, executives and creatives." },
      { property: "og:title", content: "LIFE MOVES — A Living Break" },
      { property: "og:description", content: "India's embodied living movement. 12 people per edition. Always." },
    ],
  }),
  component: Index,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Index() {
  const [open, setOpen] = useState(false);
  const apply = () => setOpen(true);

  return (
    <div className="min-h-screen bg-offwhite text-charcoal overflow-x-hidden selection:bg-clay selection:text-offwhite">
      <Nav onApply={apply} />
      <Hero onApply={apply} />
      <WhoFor />
      <WhatThisIs />
      <BreathingPacer />
      <SocialProof />
      <Method />
      <Gallery />
      <Founder />
      <Editions onApply={apply} />
      <FinalCTA onApply={apply} />
      <Footer />
      <ApplicationModal open={open} onClose={() => setOpen(false)} />
      <AmbientAudioController />
    </div>
  );
}

/* ───────────── NAV ───────────── */
function Nav({ onApply }: { onApply: () => void }) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <a href="#top" className="flex items-center gap-3 transition hover:opacity-85">
            <LogoMark className="text-clay" />
            <span className="eyebrow tracking-[0.24em] font-semibold text-xs relative top-[0.5px]">Life Moves</span>
          </a>
          
          <div className="hidden items-center gap-3 lg:flex bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
            </span>
            <span className="text-[9.5px] uppercase font-medium tracking-wider text-offwhite/80">Goa · August 12 · 6 Places Left</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#experience" className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100">The Experience</a>
            <a href="#editions" className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100">Upcoming Editions</a>
            <a href="#founder" className="eyebrow text-[9.5px] opacity-75 transition hover:opacity-100">About Aman</a>
            
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
                <LogoMark className="text-clay" />
                <span className="eyebrow font-semibold">Life Moves</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="eyebrow flex items-center gap-1 hover:text-clay transition text-[9.5px]">
                <span>Close</span> <span>✕</span>
              </button>
            </div>
            
            <nav className="mt-20 flex flex-1 flex-col justify-center gap-8">
              {[
                ["The Experience", "#experience"],
                ["Upcoming Editions", "#editions"],
                ["About Aman", "#founder"],
                ["Apply for Edition", "#apply"],
              ].map(([l, h], i) => (
                <motion.a
                  key={l}
                  href={h}
                  onClick={() => { setMenuOpen(false); if (l.startsWith("Apply")) onApply(); }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                  className="font-serif text-4xl"
                >
                  {l}
                </motion.a>
              ))}
            </nav>
            <p className="eyebrow opacity-50 mt-auto border-t border-offwhite/10 pt-6 text-[9.5px]">Life moves. Come move with it.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className={className}>
      <path d="M1 14 Q5 4 10 14 T19 14 T27 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
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
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-charcoal text-offwhite grain">
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-105">
        <motion.img 
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, ease }}
          src={heroImg} 
          alt="Goa coast at dusk" 
          width={1920} 
          height={1080} 
          className="absolute inset-0 h-[115%] w-full object-cover opacity-85" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/15 to-charcoal/90" />
      </motion.div>

      <motion.div 
        style={{ opacity, y: yText }} 
        className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-between px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-20"
      >
        <Reveal delay={0.4}>
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-6 bg-clay" />
            <span className="eyebrow tracking-[0.24em] opacity-90 text-clay-soft">Life Moves · Goa Retreat · India</span>
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
                But are you <span className="text-clay-soft font-normal relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-clay-soft/40">alive?</span>
              </motion.span>
            </span>
          </h1>

          <Reveal delay={1.8} y={16}>
            <p className="mt-8 max-w-[480px] text-base leading-relaxed text-offwhite/70 md:text-lg font-light">
              A 5-day Living Break for founders, executives and creatives who've built the
              life they were told to want — and quietly suspect there's more.
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
            <a href="#experience" className="group flex items-center gap-3 eyebrow text-[9.5px] opacity-65 hover:opacity-100 transition duration-300">
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
            <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            <text className="font-sans text-[7px] uppercase tracking-[0.24em] fill-current font-semibold">
              <textPath href="#circlePath" startOffset="0%">
                · GOA EDITION · AUGUST 12 · 6 PLACES REMAINING · EMBODIED RETREAT
              </textPath>
            </text>
          </motion.svg>
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif text-3xl md:text-4xl text-clay font-medium"><Counter to={6} /></span>
            <span className="text-[7.5px] uppercase tracking-widest text-offwhite/50">Spaces</span>
          </div>
        </div>
      </motion.div>
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
    <section id="experience" className="scroll-mt-32 bg-offwhite py-32 md:py-48 border-b border-hairline">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-[1fr_1.3fr] items-start">
          
          {/* Left Column - Sticky */}
          <div className="md:sticky md:top-32 h-fit space-y-6">
            <div className="flex items-center gap-2">
              <span className="eyebrow text-clay">01 / Who This Is For</span>
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.18] tracking-normal">
              For those who are <br/>
              <em className="italic text-forest">living well</em> but no longer <em className="italic text-clay font-normal">feeling</em> it.
            </h2>
            <p className="text-base leading-relaxed text-charcoal/70 max-w-sm font-light">
              You don't need fixing. You need a few days where the world stops asking
              anything of you — so you can hear what you've been quietly carrying.
            </p>
            
            <div className="hidden md:block pt-8 border-t border-hairline max-w-xs">
              <span className="text-[9.5px] uppercase tracking-[0.2em] text-charcoal/40 font-semibold">
                Symptom check · autopilot state
              </span>
            </div>
          </div>

          {/* Right Column - Scroll list of signs aligned to a clean grid */}
          <div className="space-y-4">
            {signs.map((s, i) => (
              <Reveal key={i} delay={0.08}>
                <div className="group relative border border-hairline p-6 md:p-8 transition-all duration-500 hover:bg-parchment/40 bg-white/[0.01] rounded-sm">
                  {/* Subtle hover lines drawing */}
                  <div className="absolute top-0 left-0 w-0 h-px bg-clay transition-all duration-500 group-hover:w-full" />
                  <div className="absolute top-0 left-0 w-px h-0 bg-clay transition-all duration-500 group-hover:h-full" />
                  
                  <div className="grid grid-cols-[3.5rem_1fr] gap-6 items-start">
                    <span className="eyebrow text-[11px] text-clay/70 tracking-widest font-semibold pt-[3px]">{s.num}</span>
                    <p className="font-serif text-xl md:text-2xl leading-normal text-charcoal/90">
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

/* ───────────── WHAT THIS IS ───────────── */
function WhatThisIs() {
  const rows = [
    ["You leave with photos.", "You leave with a different relationship to yourself."],
    ["You escape your life.", "You re-enter it."],
    ["It ends when you fly home.", "It begins when you fly home."],
  ];
  return (
    <section className="relative bg-forest text-offwhite grain overflow-hidden">
      <div className="mx-auto grid max-w-[1500px] gap-0 md:grid-cols-[1.1fr_1fr]">
        <div className="px-6 pt-36 pb-28 md:px-16 md:pt-48 md:pb-40">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <span className="eyebrow text-clay-soft">02 / What This Is</span>
            </div>
            <h2 className="font-serif text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.18] tracking-normal">
              Not a holiday. <br />
              <em className="italic text-clay-soft font-light">A Living Break.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-offwhite/70 font-light">
              A holiday distracts you from your life. A Living Break gives you back to it.
              Five days, twelve people, one quiet villa on the Arabian Sea — and the
              uncomfortable, beautiful work of remembering who you are when nothing is
              being asked of you.
            </p>
          </Reveal>

          <DrawLine className="my-14 text-offwhite/20" />

          {/* Architectural split list comparing on matching base lines */}
          <div className="mt-14 space-y-0 rounded-sm border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8">
            <Reveal>
              <div className="grid grid-cols-2 gap-8 pb-4 border-b border-offwhite/10">
                <div className="eyebrow text-offwhite/45">A Holiday</div>
                <div className="eyebrow text-clay-soft font-semibold">A Living Break</div>
              </div>
            </Reveal>
            {rows.map(([a, b], i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="grid grid-cols-2 gap-8 border-b border-offwhite/10 last:border-b-0 py-6 transition hover:bg-white/[0.01] items-start">
                  <div className="flex items-start gap-2.5">
                    <span className="text-offwhite/35 select-none font-sans text-xs mt-1.5">—</span>
                    <p className="text-base leading-relaxed text-offwhite/60 font-light">{a}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-clay-soft select-none font-sans text-[10px] mt-1.5">◆</span>
                    <p className="text-base leading-relaxed text-white font-medium">{b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <a href="#editions" className="mt-14 inline-flex items-center gap-3 eyebrow text-clay-soft hover:text-offwhite transition duration-300 group">
              <span>See Upcoming Editions</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        {/* Goa image with slow-zoom pan masking */}
        <div className="relative min-h-[480px] md:min-h-0 overflow-hidden w-full h-full">
          <Parallax amount={20} className="absolute inset-0 h-full w-full">
            <div className="relative h-[115%] w-full overflow-hidden">
              <img 
                src={circleImg} 
                alt="A small group in a Goan villa" 
                className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[4s] hover:scale-100" 
              />
              <div className="absolute inset-0 bg-charcoal/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-60" />
              
              {/* Floating badges for visual alignment & luxury feel */}
              <div className="absolute top-8 right-8 bg-charcoal/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-[9px] uppercase font-semibold tracking-wider text-offwhite/90 z-20">
                <span className="h-1.5 w-1.5 rounded-full bg-clay animate-pulse" />
                <span className="relative top-[0.5px]">Goa Beachfront Villa</span>
              </div>
              
              <div className="absolute bottom-8 left-8 space-y-1.5 max-w-[280px] z-20">
                <div className="eyebrow text-clay-soft font-semibold text-[9.5px]">Goa, India</div>
                <p className="text-xs text-offwhite/80 leading-relaxed font-light">
                  A quiet beachfront villa on the Arabian Sea, dedicated to deep rest, somatic alignment, and slow movement.
                </p>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

/* ───────────── BREATHING PACER ("THE GROUNDING ROOM") ───────────── */
function BreathingPacer() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale": return "hold";
              case "hold": return "exhale";
              case "exhale": return "rest";
              case "rest": return "inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const getInstructions = () => {
    if (!active) return "Take a living break. Click to begin.";
    switch (phase) {
      case "inhale": return "Breathe in slowly";
      case "hold": return "Hold your breath";
      case "exhale": return "Let it go";
      case "rest": return "Rest and observe";
    }
  };

  const getCircleScale = () => {
    if (!active) return 1.0;
    switch (phase) {
      case "inhale": return 1.4;
      case "hold": return 1.4;
      case "exhale": return 0.85;
      case "rest": return 0.85;
    }
  };

  return (
    <section className="bg-charcoal text-offwhite py-24 md:py-36 relative overflow-hidden border-y border-offwhite/5 grain">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-forest/15 to-charcoal pointer-events-none" />
      <div className="mx-auto max-w-4xl px-6 text-center relative z-10 flex flex-col items-center">
        <span className="eyebrow text-clay-soft mb-6">Somatic Pacer · Pause and Align</span>
        <h2 className="font-serif text-[clamp(2.2rem,5vw,4.2rem)] mb-12 max-w-2xl leading-[1.22] text-white tracking-normal">
          Slowing down isn't <em className="italic text-clay-soft font-light">abstract</em>. <br/>
          It starts with a breath.
        </h2>
        
        {/* Animated breathing circle */}
        <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
          <motion.div
            animate={{
              scale: getCircleScale(),
              backgroundColor: active 
                ? (phase === "inhale" || phase === "hold" ? "rgba(196,132,90,0.15)" : "rgba(86,92,70,0.18)") 
                : "rgba(247,244,239,0.02)",
              borderColor: active ? "var(--clay)" : "rgba(247,244,239,0.1)",
              boxShadow: active 
                ? (phase === "inhale" || phase === "hold" ? "0 0 80px rgba(196,132,90,0.1)" : "0 0 80px rgba(86,92,70,0.15)") 
                : "0 0 0px rgba(0,0,0,0)",
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-dashed flex items-center justify-center"
          />
          
          <motion.div
            animate={{
              scale: active && (phase === "inhale" || phase === "hold") ? 1.2 : 0.9,
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute h-40 w-40 rounded-full bg-forest/25 blur-3xl pointer-events-none"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={getInstructions()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-2xl italic text-offwhite/90"
              >
                {getInstructions()}
              </motion.span>
            </AnimatePresence>
            {active && (
              <span className="font-sans text-[11px] uppercase tracking-widest text-clay-soft mt-3 font-semibold">
                {timer} seconds
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setActive(!active);
            setPhase("inhale");
            setTimer(4);
          }}
          className="mt-12 rounded-full border border-offwhite/20 px-8 py-3 text-[10px] uppercase tracking-[0.24em] bg-white/5 hover:bg-offwhite hover:text-charcoal transition duration-500 font-semibold"
        >
          {active ? "Pause Pacer" : "Begin Breathing"}
        </button>
      </div>
    </section>
  );
}

/* ───────────── SOCIAL PROOF ───────────── */
function SocialProof() {
  const quotes = [
    { word: "STAYED", text: "I came for a break. I left with a different operating system.", name: "Vikram S.", role: "Founder, Series B SaaS", img: movementImg },
    { word: "FELT", text: "Five days that quietly rearranged the next five years.", name: "Anjali R.", role: "Creative Director", img: fireImg },
    { word: "MOVED", text: "I forgot how loud my own life was until I stepped out of it.", name: "Devraj M.", role: "Investor", img: circleImg },
  ];
  
  const [i, setI] = useState(0);
  const [timerReset, setTimerReset] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, [timerReset]);

  const selectQuote = (idx: number) => {
    setI(idx);
    setTimerReset((prev) => prev + 1);
  };

  return (
    <section className="relative overflow-hidden bg-parchment py-32 md:py-44">
      {/* Background massive font watermark */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.04, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-serif text-[26vw] leading-none text-forest select-none font-bold">{quotes[i].word}</span>
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-12 z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="eyebrow text-clay">03 / In Their Own Words</span>
          </div>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-[1.2.fr_1fr] md:items-center">
          
          {/* Quote Block with hanging quotes alignment */}
          <div className="relative min-h-[280px] flex flex-col justify-center pl-8 md:pl-12">
            <span className="font-serif text-[10rem] leading-none text-clay/15 absolute -left-2 -top-16 pointer-events-none select-none">“</span>
            
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.7, ease }}
                className="font-serif text-[clamp(1.8rem,3.8vw,3.3rem)] italic leading-[1.25] text-charcoal tracking-normal"
              >
                {quotes[i].text}
                
                <footer className="mt-8 not-italic">
                  <div className="eyebrow text-clay tracking-[0.24em] font-semibold text-[11px]">{quotes[i].name}</div>
                  <div className="mt-1.5 text-[9.5px] text-charcoal/50 uppercase tracking-widest font-semibold">{quotes[i].role}</div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-8 md:items-end">
            <div className="grid grid-cols-3 gap-4 w-full md:max-w-md">
              {quotes.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -6 }}
                  className={`relative aspect-[3/4] overflow-hidden bg-charcoal border transition-all duration-500 shadow-lg ${
                    idx === i ? "border-clay scale-[1.03] ring-4 ring-clay/10" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => selectQuote(idx)}
                >
                  <img 
                    src={item.img} 
                    loading="lazy" 
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-charcoal/20 transition-opacity hover:opacity-10" />
                </motion.button>
              ))}
            </div>
            
            <div className="flex gap-4">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectQuote(idx)}
                  className="group relative py-3"
                >
                  <div 
                    className="h-[2px] w-12 bg-charcoal/20 transition-all duration-500" 
                    style={{ background: idx === i ? "var(--clay)" : undefined }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── METHOD ───────────── */
function Method() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [hoveredPractice, setHoveredPractice] = useState<number | null>(null);

  const steps = [
    { 
      n: "01", 
      t: "Explore", 
      time: "Days 1 – 3", 
      focus: "The Clearing",
      d: "Three days of stripping away the noise — slow walks, no phones, long silences, longer meals.",
      img: forestImg
    },
    { 
      n: "02", 
      t: "Express", 
      time: "Day 4", 
      focus: "Somatic Release",
      d: "Movement, art, conversation. The body remembers what the mind has forgotten.",
      img: movementImg
    },
    { 
      n: "03", 
      t: "Evolve", 
      time: "Day 5", 
      focus: "The Integration",
      d: "A return protocol. Not lessons — practices small enough to survive a Monday.",
      img: circleImg
    },
  ];
  
  const practices = [
    { t: "Art", d: "Clay, paint, ink. No skill required.", iconD: "M4 22 Q12 4 22 18 T36 22" },
    { t: "Movement", d: "Body-led practice. No mats of shame.", iconD: "M6 30 Q14 6 22 18 T34 8" },
    { t: "Mindfulness", d: "Quiet attention. Not silent retreat.", iconD: "M4 20 C 8 8, 32 8, 36 20 C 32 32, 8 32, 4 20 Z" },
    { t: "Connection", d: "Eleven strangers who become a circle.", iconD: "M6 28 L20 6 L34 28 Z M14 22 L26 22" },
  ];

  return (
    <section id="method" className="bg-offwhite pt-24 pb-24 md:pt-32 md:pb-32 border-b border-hairline relative grain overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-4">
            <span className="eyebrow text-clay">04 / The Method</span>
          </div>
          <h2 className="max-w-3xl font-serif text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.18] tracking-normal mb-8">
            Three movements. <em className="italic text-forest">One arc.</em>
          </h2>
        </Reveal>

        {/* Timeline Desktop View */}
        <div className="relative mt-16 md:mt-24 hidden md:block">
          {/* Horizontal connecting line */}
          <div className="absolute left-[12%] right-[12%] top-[232px] h-[1px] bg-clay/15 -z-10">
            <motion.div 
              className="h-full bg-clay/60" 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, ease }}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.18}>
                <div 
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="group relative flex h-full flex-col bg-[#f4efe4]/65 backdrop-blur-sm border border-charcoal/5 p-8 text-charcoal transition-all duration-500 hover:bg-white hover:-translate-y-2 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_40px_rgba(202,110,66,0.05)] hover:border-clay/20 overflow-hidden"
                >
                  {/* Editorial Photo Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-charcoal/5 mb-6 rounded-sm bg-charcoal/5 z-10">
                    <motion.img 
                      src={s.img} 
                      alt={s.t}
                      className="absolute inset-0 h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Timeline Intersection Node */}
                  <div className="absolute top-[180px] left-[40px] w-5 h-5 rounded-full border-2 border-clay/35 bg-[#f4efe4] z-20 flex items-center justify-center transition-all duration-500 group-hover:border-clay group-hover:scale-110 group-hover:bg-clay">
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-clay transition-all duration-500 group-hover:bg-offwhite"
                      animate={hoveredStep === i ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>

                  {/* Large watermarked serif number */}
                  <span className="font-serif text-[10rem] font-bold text-clay/3 absolute right-6 bottom-[-20px] pointer-events-none select-none transition-colors duration-500 group-hover:text-clay/6 leading-none">
                    {s.n}
                  </span>
                  
                  {/* Phase tags and time indicator */}
                  <div className="flex flex-col gap-2 mb-10 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="bg-clay/5 border border-clay/15 text-clay text-[9.5px] font-semibold tracking-[0.24em] uppercase px-3 py-1 rounded-full">
                        {s.time}
                      </span>
                      <span className="text-[9.5px] uppercase tracking-wider text-charcoal/40 font-medium">
                        {s.focus}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-3.5xl text-charcoal group-hover:text-clay transition-colors duration-300 leading-tight mb-4 relative z-10">
                    {s.t}
                  </h3>
                  <div className="h-px w-8 bg-clay/25 mb-6 group-hover:w-16 group-hover:bg-clay transition-all duration-500 relative z-10" />
                  <p className="max-w-sm text-base leading-relaxed text-charcoal/65 font-light relative z-10">
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Timeline Mobile View */}
        <div className="relative mt-12 md:hidden pl-8">
          {/* Vertical connection line */}
          <div className="absolute left-[15px] top-6 bottom-6 w-[1px] bg-clay/15">
            <motion.div 
              className="w-full bg-clay/60 origin-top" 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, ease }}
              style={{ height: "100%" }}
            />
          </div>

          <div className="flex flex-col gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative group">
                  {/* Mobile Timeline Node */}
                  <div className="absolute left-[-31.5px] top-2 w-[17px] h-[17px] rounded-full border-2 border-clay/35 bg-offwhite z-20 flex items-center justify-center transition-all duration-500 group-hover:border-clay group-hover:bg-clay">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay group-hover:bg-offwhite" />
                  </div>
                  
                  <div className="group relative flex flex-col bg-[#f4efe4]/65 backdrop-blur-sm border border-charcoal/5 p-6 text-charcoal rounded-sm shadow-sm hover:bg-white transition-all duration-500 hover:border-clay/20">
                    {/* Faint large step number */}
                    <span className="font-serif text-[6.5rem] font-bold text-clay/3 absolute right-2 bottom-[-15px] pointer-events-none select-none leading-none">
                      {s.n}
                    </span>

                    {/* Mobile Photo Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden border border-charcoal/5 mb-4 rounded-sm bg-charcoal/5">
                      <img src={s.img} alt={s.t} className="absolute inset-0 h-full w-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="bg-clay/5 border border-clay/15 text-clay text-[9px] tracking-[0.2em] font-semibold uppercase px-2.5 py-0.5 rounded-full">
                        {s.time}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-charcoal/40 font-medium">
                        {s.focus}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-charcoal mb-2 leading-tight">
                      {s.t}
                    </h3>
                    <div className="h-px w-8 bg-clay/25 mb-4" />
                    <p className="text-[14px] leading-relaxed text-charcoal/65 font-light">
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Practices Section */}
        <div className="mt-28 md:mt-32">
          <Reveal>
            <div className="eyebrow mb-10 text-charcoal/40 font-semibold">The Practices</div>
          </Reveal>
          
          <div className="grid gap-8 sm:grid-cols-2">
            {practices.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div 
                  onMouseEnter={() => setHoveredPractice(i)}
                  onMouseLeave={() => setHoveredPractice(null)}
                  className="group relative flex flex-col sm:flex-row gap-8 items-start bg-white/95 backdrop-blur-sm border border-charcoal/5 p-8 md:p-10 text-charcoal transition-all duration-700 hover:bg-forest hover:text-offwhite hover:border-forest rounded-sm shadow-sm hover:shadow-xl overflow-hidden h-full"
                >
                  {/* Subtle radial glow highlights */}
                  <div className="absolute -inset-40 bg-gradient-to-br from-clay/5 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100 blur-3xl pointer-events-none" />
                  
                  {/* Left Side: Icon Circle Container */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full border border-clay/15 bg-clay/5 group-hover:bg-white/10 group-hover:border-white/20 flex items-center justify-center text-clay group-hover:text-clay-soft transition-all duration-500">
                    <PathIcon d={p.iconD} isHovered={hoveredPractice === i} size={28} />
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 space-y-3 relative z-10 w-full">
                    <div className="flex items-center justify-between gap-4">
                      <div className="eyebrow text-clay group-hover:text-clay-soft font-semibold tracking-[0.24em] transition-colors duration-500">
                        {p.t}
                      </div>
                      {/* Decorative Sparkle for luxury accent */}
                      <motion.div 
                        className="text-clay/20 group-hover:text-clay-soft transition-colors duration-500"
                        animate={hoveredPractice === i ? { rotate: 90, scale: 1.15 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    </div>
                    <p className="text-base leading-relaxed text-charcoal/65 group-hover:text-offwhite/80 font-light transition-colors duration-500">
                      {p.d}
                    </p>
                  </div>
                  
                  {/* Sliding terracotta baseline indicator */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-clay transition-all duration-500 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-20 max-w-3xl text-center font-serif text-3xl leading-snug text-charcoal md:text-4xl italic">
            Five days that quietly rearrange <em className="italic text-clay font-normal font-serif">the next five years</em>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PathIcon({ d, isHovered, size = 24 }: { d: string; isHovered: boolean; size?: number }) {
  return (
    <svg width={size + 6} height={size + 2} viewBox="0 0 40 40" fill="none" className="overflow-visible">
      <motion.path 
        d={d} 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        fill="none" 
        initial={{ pathLength: 0.3 }}
        animate={isHovered ? { pathLength: 1, strokeWidth: 1.6 } : { pathLength: 0.3, strokeWidth: 1.2 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ───────────── GALLERY ───────────── */
function Gallery() {
  return (
    <section className="bg-parchment py-28 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="eyebrow text-clay">05 / A Few Frames</span>
              </div>
              <h2 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.18] tracking-normal">
                <em className="italic text-charcoal/80 font-light font-serif">Not</em> the brochure version.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-charcoal/65 font-light">
              No filters. No staging. A handful of real, unedited moments from our last few editions in Goa.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          <div className="md:col-span-6 overflow-hidden">
            <Parallax amount={20}>
              <ClipReveal src={forestImg} alt="Barefoot forest walk" ratio="aspect-[3/4]" className="shadow-2xl border border-charcoal/10" />
            </Parallax>
          </div>
          
          <div className="md:col-span-6 flex flex-col gap-6 justify-between">
            <div className="grid grid-cols-2 gap-6">
              <Parallax amount={-10}>
                <ClipReveal src={fireImg} alt="Fire circle assembly" ratio="aspect-square" className="shadow-lg border border-charcoal/5" />
              </Parallax>
              <Parallax amount={10}>
                <ClipReveal src={clayImg} alt="Hands folding clay" ratio="aspect-square" className="shadow-lg border border-charcoal/5" />
              </Parallax>
            </div>
            
            <ClipReveal src={circleImg} alt="Group sitting in villa circle" ratio="aspect-[16/10]" className="shadow-2xl border border-charcoal/10" />
            
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-7">
                <p className="font-serif text-lg italic text-charcoal/60 leading-relaxed font-serif">
                  "We meet in silence. We speak from details. We leave with a map of what's true."
                </p>
              </div>
              <div className="col-span-5">
                <ClipReveal src={movementImg} alt="Somatic movement on deck" ratio="aspect-square" className="shadow-lg border border-charcoal/5" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

/* ───────────── FOUNDER ───────────── */
function Founder() {
  return (
    <section id="founder" className="scroll-mt-32 bg-offwhite py-32 md:py-44">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-[1fr_1.1fr] md:gap-24 items-center">
          
          <div className="relative group">
            <div className="absolute -inset-3 bg-clay/5 rounded-sm -rotate-1 transition-transform duration-500 group-hover:rotate-0" />
            <div className="absolute inset-0 border border-clay/10 translate-x-4 translate-y-4 -z-10" />
            
            <Parallax amount={15}>
              <ClipReveal src={founderImg} alt="Aman, founder of Life Moves" ratio="aspect-[4/5]" className="shadow-2xl border border-charcoal/10" />
            </Parallax>
            
            <div className="mt-8 flex items-center gap-4 border-l border-clay/35 pl-4">
              <span className="font-serif text-2xl italic font-serif">— Aman</span>
              <span className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-widest relative top-[0.5px]">Founder, Life Moves</span>
            </div>
          </div>

          <div>
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <span className="eyebrow text-clay">06 / The Person Behind It</span>
              </div>
              <h2 className="font-serif text-[clamp(2.4rem,4.8vw,4.4rem)] leading-[1.18] tracking-normal">
                Fifteen years asking <br />
                <em className="italic text-clay font-light font-serif">one stubborn question.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-charcoal/75 font-light">
                I spent a decade in the rooms most people are trying to get into.
                Boardrooms, brand decks, investor calls. Then I spent five years
                walking out of them — into ashrams, art studios, mountains, and the
                quietest beaches in Goa — to figure out what nobody around the table
                was asking.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <blockquote className="my-10 border-l-2 border-clay pl-6 font-serif text-3xl italic leading-snug text-forest md:text-3xl font-serif">
                Not "how do you feel right now?" but <span className="text-clay font-normal not-italic relative after:absolute after:bottom-1 after:left-0 after:w-full after:h-px after:bg-clay/30">how do you actually want to live?</span>
              </blockquote>
            </Reveal>

            <div className="grid grid-cols-3 gap-6 border-y border-hairline py-8 items-start">
              {[
                { n: 15, s: "", l: "Years on the road" },
                { n: 3, s: "", l: "Countries studied in" },
                { n: 400, s: "+", l: "Guests, twelve at a time" },
              ].map((x) => (
                <Reveal key={x.l}>
                  <div className="flex flex-col">
                    <div className="font-serif text-4xl text-clay md:text-5xl font-medium">
                      <Counter to={x.n} suffix={x.s} />
                    </div>
                    <div className="eyebrow mt-3 text-charcoal/50 text-[9px] tracking-wider leading-relaxed min-h-[2.5rem]">{x.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <a href="#" className="mt-8 inline-flex items-center gap-4 eyebrow text-[10px] text-clay hover:text-charcoal transition group">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-clay/30 group-hover:border-clay group-hover:bg-clay group-hover:text-offwhite transition duration-500">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </span>
                <span className="font-semibold tracking-[0.2em]">Watch Aman's story · 4 min</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── EDITIONS ───────────── */
function Editions({ onApply }: { onApply: () => void }) {
  const list = [
    { 
      loc: "Goa (Monsoon)", 
      date: "August 12 – 16, 2026", 
      desc: "Coastal villa. Arabian Sea at the doorstep. Experience the raw luxury of Goa's coastal rain.", 
      spots: 6, 
      cap: 12, 
      waitlist: false, 
      img: circleImg,
      coords: "15.2993° N, 73.7909° E",
      altitude: "0m (Sea Level)"
    },
    { 
      loc: "Goa (Late Summer)", 
      date: "August 26 – 30, 2026", 
      desc: "Same sea-facing villa. Different circle. Cool ocean breeze and crisp, sun-drenched coastal walks.", 
      spots: 9, 
      cap: 12, 
      waitlist: false, 
      img: heroImg,
      coords: "15.2993° N, 73.7909° E",
      altitude: "0m (Sea Level)"
    },
    { 
      loc: "Himachal (Waitlist)", 
      date: "October 14 – 18, 2026", 
      desc: "A hand-built timber house above the clouds. Tall pines, morning woodsmoke, and absolute Himalayan silence.", 
      spots: 0, 
      cap: 12, 
      waitlist: true, 
      img: forestImg,
      coords: "32.2396° N, 77.1887° E",
      altitude: "2,200m (Alpine)"
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section id="editions" className="scroll-mt-32 relative bg-charcoal py-32 text-offwhite grain md:py-44 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="eyebrow text-clay-soft">07 / Upcoming Editions</span>
              </div>
              <h2 className="font-serif text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.18] tracking-normal text-white">
                Three dates. <em className="italic text-clay-soft font-light font-serif">Two seasons.</em>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-wider text-offwhite/50 hidden md:inline">← Drag card to explore →</span>
              <div className="flex items-center gap-3 rounded-full border border-offwhite/10 px-5 py-2.5 bg-white/[0.02] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                <span className="eyebrow text-[9.5px] text-offwhite/85">12 People Per Edition. Always.</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Draggable Carousel Container */}
        <motion.div ref={carouselRef} className="cursor-grab active:cursor-grabbing overflow-hidden">
          <motion.div 
            drag="x" 
            dragConstraints={{ right: 0, left: -width }}
            className="flex gap-8 w-fit py-4"
          >
            {list.map((e, idx) => (
              <motion.div 
                key={idx} 
                className="w-[300px] sm:w-[420px] shrink-0 border border-offwhite/10 rounded-sm bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 flex flex-col justify-between h-[520px] group transition duration-500 hover:border-clay/40"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 border border-offwhite/5">
                    <img 
                      src={e.img} 
                      alt={e.loc} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[4s] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-charcoal/20" />
                    
                    <div className="absolute bottom-3 left-3 bg-charcoal/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[9px] uppercase font-semibold tracking-wider text-offwhite">
                      <MapPin className="h-3 w-3 text-clay animate-pulse" />
                      <span className="relative top-[0.5px]">{e.coords}</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="eyebrow text-clay-soft text-[9.5px] font-semibold">{e.date}</span>
                      <h3 className="font-serif text-3xl md:text-4xl text-white mt-1 group-hover:text-clay transition-colors duration-300 font-serif">
                        {e.loc}
                      </h3>
                    </div>
                    {e.waitlist && (
                      <span className="text-[8px] uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-semibold">
                        Waitlist
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-offwhite/65 font-light">
                    {e.desc}
                  </p>
                </div>

                <div className="border-t border-offwhite/10 pt-6 mt-8 flex items-baseline justify-between">
                  <div className="space-y-1">
                    <div className="eyebrow text-offwhite/40 text-[9px]">Details</div>
                    <span className="text-xs font-light text-offwhite/75 block">Alt: {e.altitude}</span>
                    <span className="text-xs font-light text-offwhite/75 block">Cohort: 12 Limit</span>
                  </div>
                  
                  <button
                    onClick={onApply}
                    className={`eyebrow flex items-center gap-2 text-[10px] font-semibold transition ${
                      e.waitlist ? "text-offwhite/50 hover:text-white" : "text-clay hover:text-white"
                    }`}
                  >
                    <span>{e.waitlist ? "Waitlist" : "Apply"}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── FINAL CTA ───────────── */
function FinalCTA({ onApply }: { onApply: () => void }) {
  return (
    <section id="apply" className="scroll-mt-32 relative overflow-hidden bg-charcoal py-40 text-offwhite grain md:py-52">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-charcoal/95 to-charcoal" />
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
            transition={{ duration: 4 + (i % 6), repeat: Infinity, delay: (i % 8) * 0.5, ease: "easeInOut" }}
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
          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-offwhite/60 font-light">
            Twelve seats. A short application. A real conversation before you say yes.
            No mass intake. No upsell. Just a careful door, opened on purpose.
          </p>
        </Reveal>
        <Reveal delay={0.6}>
          <div className="mt-12 flex justify-center">
            <MagneticButton onClick={onApply}>Take a Living Break</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.8}>
          <motion.p
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-20 font-serif text-2xl italic text-clay-soft font-light tracking-wide font-serif"
          >
            Life is meant to be felt.
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer() {
  return (
    <footer className="bg-offwhite py-20 md:py-24 border-t border-hairline relative z-10">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          
          <div className="space-y-4">
            <a href="#top" className="flex items-center gap-3 text-charcoal">
              <LogoMark className="text-clay" />
              <span className="font-serif text-2xl font-semibold font-serif">Life Moves</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-charcoal/60 font-light">
              India's Embodied Living Movement. Twelve people, five days, one quiet circle at a time.
            </p>
          </div>

          {[
            ["The Experience", [["What it is", "#experience"], ["The Method", "#experience"], ["A Few Frames", "#experience"]]],
            ["Editions", [["Goa · Aug 12", "#editions"], ["Goa · Aug 26", "#editions"], ["Himachal · Oct", "#editions"]]],
            ["About", [["Aman", "#founder"], ["Press", "#founder"], ["Contact", "mailto:hello@lifemoves.in"]]],
          ].map(([h, items]) => (
            <div key={h as string} className="space-y-4">
              <div className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-wider">{h as string}</div>
              <ul className="space-y-2.5">
                {(items as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="space-y-4">
            <div className="eyebrow text-charcoal/40 text-[9px] font-semibold tracking-wider">Newsletter</div>
            <p className="text-xs text-charcoal/55 leading-relaxed max-w-[260px] font-light">
              Receive very occasional letters on slowing down and living on purpose.
            </p>
            <div className="relative max-w-[280px]">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full border-b border-charcoal/20 bg-transparent py-2 text-xs outline-none transition focus:border-clay pr-8 font-light text-charcoal"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-clay transition duration-300">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          
        </div>

        <DrawLine className="my-14 text-charcoal" />

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-charcoal/50 uppercase tracking-widest font-medium">
            <a href="mailto:hello@lifemoves.in" className="hover:text-clay transition duration-300">hello@lifemoves.in</a>
            <span>Goa · Himachal Pradesh · India</span>
          </div>
          <p className="font-serif text-xl italic text-clay font-light font-serif">Life moves. Come move with it.</p>
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
          activeMode === "waves" ? "bg-clay text-offwhite animate-pulse" : "hover:bg-white/5 text-offwhite/75"
        }`}
      >
        Waves
      </button>
      <button
        onClick={() => toggle("wind")}
        className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-semibold transition ${
          activeMode === "wind" ? "bg-clay text-offwhite animate-pulse" : "hover:bg-white/5 text-offwhite/75"
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
