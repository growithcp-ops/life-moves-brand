import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

import heroImg from "@/assets/hero-goa.jpg";
import circleImg from "@/assets/gallery-circle.jpg";
import clayImg from "@/assets/gallery-clay.jpg";
import forestImg from "@/assets/gallery-forest.jpg";
import fireImg from "@/assets/gallery-fire.jpg";
import founderImg from "@/assets/founder.jpg";
import movementImg from "@/assets/gallery-movement.jpg";

import { Reveal, StaggerWords, DrawLine, ClipReveal, Counter, MagneticButton, Parallax } from "@/components/life-moves/primitives";
import { CustomCursor } from "@/components/life-moves/cursor";
import { ApplicationModal } from "@/components/life-moves/application";

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
    <div className="min-h-screen bg-offwhite text-charcoal">
      <CustomCursor />
      <Nav onApply={apply} />
      <Hero onApply={apply} />
      <WhoFor />
      <WhatThisIs />
      <SocialProof />
      <Method />
      <Gallery />
      <Founder />
      <Editions onApply={apply} />
      <FinalCTA onApply={apply} />
      <Footer />
      <ApplicationModal open={open} onClose={() => setOpen(false)} />
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
        transition={{ duration: 1, ease, delay: 0.4 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
          solid ? "bg-charcoal/85 backdrop-blur-xl text-offwhite" : "text-offwhite"
        }`}
      >
        <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 md:px-12">
          <a href="#top" className="flex items-center gap-3" data-cursor="Home">
            <LogoMark />
            <span className="eyebrow">Life Moves</span>
          </a>
          <div className="hidden items-center gap-3 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            <span className="eyebrow opacity-80">Goa · August 12 · 6 Places Remaining</span>
          </div>
          <nav className="hidden items-center justify-end gap-8 md:flex">
            <a href="#experience" className="eyebrow opacity-80 transition hover:opacity-100">The Experience</a>
            <a href="#editions" className="eyebrow opacity-80 transition hover:opacity-100">Upcoming Editions</a>
            <a href="#founder" className="eyebrow opacity-80 transition hover:opacity-100">About Aman</a>
            <button
              onClick={onApply}
              data-cursor="Apply"
              className="bg-clay px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.22em] text-offwhite transition hover:bg-offwhite hover:text-charcoal"
            >
              Take a Living Break
            </button>
          </nav>
          <button
            onClick={() => setMenuOpen(true)}
            className="eyebrow justify-self-end md:hidden"
            data-cursor="Menu"
          >
            Menu
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-[60] flex flex-col bg-charcoal px-8 py-8 text-offwhite md:hidden"
          >
            <div className="flex items-center justify-between">
              <LogoMark className="text-offwhite" />
              <button onClick={() => setMenuOpen(false)} className="eyebrow">Close ✕</button>
            </div>
            <nav className="mt-20 flex flex-1 flex-col justify-center gap-8">
              {[
                ["The Experience", "#experience"],
                ["Upcoming Editions", "#editions"],
                ["About Aman", "#founder"],
                ["Apply", "#apply"],
              ].map(([l, h], i) => (
                <motion.a
                  key={l}
                  href={h}
                  onClick={() => { setMenuOpen(false); if (l === "Apply") onApply(); }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease }}
                  className="font-serif text-5xl"
                >
                  {l}
                </motion.a>
              ))}
            </nav>
            <p className="eyebrow opacity-50">Life moves. Come move with it.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className={className}>
      <path d="M1 14 Q5 4 10 14 T19 14 T27 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ───────────── HERO ───────────── */
function Hero({ onApply }: { onApply: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-charcoal text-offwhite grain">
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <img src={heroImg} alt="Goa coast at dusk" width={1920} height={1080} className="absolute inset-0 h-[115%] w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/20 to-charcoal/85" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-between px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-20">
        <Reveal delay={0.7}>
          <div className="eyebrow opacity-80">Life Moves · Goa · India</div>
        </Reveal>

        <div className="max-w-[1100px]">
          <h1 className="font-serif text-[clamp(3.2rem,9.5vw,9rem)] leading-[0.95]">
            <StaggerWords text="You're living." className="block" delay={0.4} />
            <StaggerWords text="But are you alive?" italic className="block text-offwhite/70" delay={1.1} />
          </h1>

          <Reveal delay={2.2} y={16}>
            <p className="mt-10 max-w-[440px] text-base leading-relaxed text-offwhite/75 md:text-[17px]">
              A 5-day Living Break for founders, executives and creatives who've built the
              life they were told to want — and quietly suspect there's more.
            </p>
          </Reveal>

          <Reveal delay={2.6}>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <MagneticButton onClick={onApply}>Take a Living Break</MagneticButton>
              <div className="flex items-center gap-3 text-offwhite/70">
                <span className="h-px w-8 bg-current opacity-40" />
                <span className="eyebrow">Goa · August 12 · 6 Places Remaining</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="flex items-end justify-between">
          <Reveal delay={2.8}>
            <a href="#experience" className="eyebrow opacity-70 hover:opacity-100" data-cursor="Scroll">
              ↓ Scroll to feel it
            </a>
          </Reveal>
          <Reveal delay={2.8}>
            <div className="eyebrow opacity-60">Est. 2010 · India</div>
          </Reveal>
        </div>
      </motion.div>

      {/* floating spots badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.6, ease }}
        className="pointer-events-none absolute right-6 top-28 z-10 flex flex-col items-end text-right md:right-12 md:top-36"
      >
        <span className="font-serif text-[7rem] leading-none text-clay md:text-[10rem]">
          <Counter to={6} />
        </span>
        <span className="eyebrow mt-2 text-offwhite/70">Places Remaining</span>
      </motion.div>
    </section>
  );
}

/* ───────────── WHO FOR ───────────── */
function WhoFor() {
  const signs = [
    "You optimised your calendar. But not your aliveness.",
    "Your wins feel quieter than your fears.",
    "Sunday evenings hold a small, specific dread.",
    "You take photos of moments you barely felt.",
    "You're 'fine,' said the way no one believes.",
    "You wonder, often, if this is it.",
  ];
  return (
    <section id="experience" className="bg-offwhite py-32 md:py-48">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <Reveal>
            <div className="eyebrow mb-6 text-clay">01 · Who This Is For</div>
            <h2 className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.02]">
              For those who are <em className="italic text-forest">living well</em><br />
              but no longer <em className="italic text-clay">feeling</em> it.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-md text-base leading-relaxed text-charcoal/70 md:ml-auto">
              You don't need fixing. You need a few days where the world stops asking
              anything of you — so you can hear what you've been quietly carrying.
            </p>
          </Reveal>
        </div>

        <DrawLine className="my-20 text-charcoal" />

        <Reveal>
          <div className="eyebrow mb-10 text-charcoal/60">Signs you might be running on autopilot</div>
        </Reveal>

        <div className="grid grid-cols-1 border-t border-l border-hairline md:grid-cols-3">
          {signs.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <div className="group relative flex h-full min-h-[220px] flex-col justify-between border-b border-r border-hairline p-8 transition-colors duration-500 hover:bg-parchment md:p-10">
                <span className="font-serif text-6xl text-charcoal/15 transition-colors duration-500 group-hover:text-clay/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-12 font-serif text-2xl leading-snug md:text-[28px]">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-24 max-w-2xl text-center font-serif text-3xl leading-snug md:text-4xl">
            If any of this lands, <em className="italic text-clay">you're in the right place</em>.
          </p>
        </Reveal>
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
    <section className="relative bg-forest text-offwhite grain">
      <div className="mx-auto grid max-w-[1500px] gap-0 md:grid-cols-[1.1fr_1fr]">
        <div className="px-6 py-32 md:px-16 md:py-48">
          <Reveal>
            <div className="eyebrow mb-6 text-clay-soft">02 · What This Is</div>
            <h2 className="font-serif text-[clamp(2.6rem,5.8vw,5.4rem)] leading-[1.02]">
              Not a holiday. <br />
              <em className="italic text-clay-soft">A Living Break.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-md text-base leading-relaxed text-offwhite/75">
              A holiday distracts you from your life. A Living Break gives you back to it.
              Five days, twelve people, one quiet villa on the Arabian Sea — and the
              uncomfortable, beautiful work of remembering who you are when nothing is
              being asked of you.
            </p>
          </Reveal>

          <DrawLine className="my-16 text-offwhite" />

          <div className="space-y-0">
            <Reveal>
              <div className="grid grid-cols-2 gap-6 pb-4">
                <div className="eyebrow text-offwhite/50">A Holiday</div>
                <div className="eyebrow text-clay-soft">A Living Break</div>
              </div>
            </Reveal>
            {rows.map(([a, b], i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="grid grid-cols-2 gap-6 border-t border-offwhite/15 py-6">
                  <p className="text-sm leading-relaxed text-offwhite/55">{a}</p>
                  <p className="text-base leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <a href="#editions" className="mt-14 inline-flex items-center gap-3 eyebrow text-clay-soft hover:text-offwhite" data-cursor="Editions">
              See Upcoming Editions
              <svg width="22" height="6" viewBox="0 0 22 6"><path d="M0 3H21M21 3L18 1M21 3L18 5" stroke="currentColor" strokeWidth="0.8" fill="none" /></svg>
            </a>
          </Reveal>
        </div>

        <div className="relative min-h-[480px] md:min-h-0">
          <Parallax amount={30}>
            <ClipReveal src={circleImg} alt="A small group in a Goan villa" ratio="aspect-[4/5] md:aspect-auto md:h-[120%]" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}

/* ───────────── SOCIAL PROOF ───────────── */
function SocialProof() {
  const quotes = [
    { word: "STAYED", text: "I came for a break. I left with a different operating system.", name: "Vikram S.", role: "Founder, Series B SaaS" },
    { word: "FELT", text: "Five days that quietly rearranged the next five years.", name: "Anjali R.", role: "Creative Director" },
    { word: "MOVED", text: "I forgot how loud my own life was until I stepped out of it.", name: "Devraj M.", role: "Investor" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-parchment py-32 md:py-48">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 0.07, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 1.4, ease }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-serif text-[28vw] leading-none text-forest">{quotes[i].word}</span>
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="eyebrow mb-6 text-clay">03 · In Their Own Words</div>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-[1.3fr_1fr] md:items-end">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease }}
              className="font-serif text-[clamp(2.2rem,4.4vw,4rem)] italic leading-[1.15] text-charcoal"
            >
              "{quotes[i].text}"
              <footer className="mt-10 not-italic">
                <div className="eyebrow text-clay">{quotes[i].name}</div>
                <div className="mt-2 text-sm text-charcoal/60">{quotes[i].role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex flex-col gap-6 md:items-end">
            <div className="grid grid-cols-3 gap-3">
              {[movementImg, fireImg, circleImg].map((src, idx) => (
                <motion.button
                  key={idx}
                  data-cursor="Play"
                  whileHover={{ y: -4 }}
                  className="relative aspect-[3/4] overflow-hidden bg-charcoal"
                  onClick={() => setI(idx)}
                >
                  <img src={src} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-105" alt="" />
                  <div className="absolute inset-0 bg-charcoal/20" />
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className="h-px w-10 bg-charcoal/30 transition-all"
                  style={{ height: idx === i ? 2 : 1, background: idx === i ? "var(--clay)" : undefined }}
                />
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
  const steps = [
    { n: "I", t: "Explore", d: "Three days of stripping away the noise — slow walks, no phones, long silences, longer meals." },
    { n: "II", t: "Express", d: "Movement, art, conversation. The body remembers what the mind has forgotten." },
    { n: "III", t: "Evolve", d: "A return protocol. Not lessons — practices small enough to survive a Monday." },
  ];
  const practices = [
    { t: "Art", d: "Clay, paint, ink. No skill required.", icon: <PathIcon d="M4 22 Q12 4 22 18 T36 22" /> },
    { t: "Movement", d: "Body-led practice. No mats of shame.", icon: <PathIcon d="M6 30 Q14 6 22 18 T34 8" /> },
    { t: "Mindfulness", d: "Quiet attention. Not silent retreat.", icon: <PathIcon d="M4 20 C 8 8, 32 8, 36 20 C 32 32, 8 32, 4 20 Z" /> },
    { t: "Connection", d: "Eleven strangers who become a circle.", icon: <PathIcon d="M6 28 L20 6 L34 28 Z M14 22 L26 22" /> },
  ];
  return (
    <section className="bg-offwhite py-32 md:py-48">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="eyebrow mb-6 text-clay">04 · The Method</div>
          <h2 className="max-w-3xl font-serif text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[1.02]">
            Three movements. <em className="italic text-forest">One arc.</em>
          </h2>
        </Reveal>

        <div className="relative mt-24">
          {/* connecting line */}
          <svg className="absolute left-0 top-12 hidden h-2 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <motion.path
              d="M0 1 L100 1"
              stroke="var(--clay)"
              strokeWidth="0.4"
              strokeDasharray="0.6 1.2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease }}
            />
          </svg>
          <div className="grid gap-16 md:grid-cols-3 md:gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.15}>
                <div>
                  <div className="relative flex items-center gap-5">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-offwhite ring-1 ring-clay">
                      <span className="font-serif text-xl text-clay">{s.n}</span>
                    </div>
                    <span className="eyebrow text-charcoal/40">Movement 0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-5xl">{s.t}</h3>
                  <p className="mt-5 max-w-sm text-base leading-relaxed text-charcoal/70">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-32">
          <Reveal>
            <div className="eyebrow mb-10 text-charcoal/60">The Practices</div>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-sm bg-charcoal text-offwhite md:grid-cols-4">
            {practices.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div className="group relative flex h-full flex-col gap-6 bg-charcoal p-10 transition-colors duration-500 hover:bg-forest grain">
                  <div className="text-clay-soft transition-transform duration-700 group-hover:-translate-y-1">{p.icon}</div>
                  <div className="eyebrow text-clay-soft">{p.t}</div>
                  <p className="text-sm leading-relaxed text-offwhite/70">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-24 max-w-3xl text-center font-serif text-3xl leading-snug text-charcoal md:text-4xl">
            Five days that quietly rearrange <em className="italic text-clay">the next five years</em>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PathIcon({ d }: { d: string }) {
  return (
    <svg width="44" height="40" viewBox="0 0 40 40" fill="none">
      <motion.path d={d} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ───────────── GALLERY ───────────── */
function Gallery() {
  return (
    <section className="bg-parchment py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="mb-16 flex items-end justify-between">
            <div>
              <div className="eyebrow mb-6 text-clay">05 · A Few Frames</div>
              <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02]">
                <em className="italic">Not</em> the brochure version.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-charcoal/60 md:block">
              No filters. No staging. A handful of moments from the last few editions.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-6 grid-rows-2 gap-3 md:gap-5">
          <div className="col-span-3 row-span-2 md:col-span-3 md:row-span-2"><ClipReveal src={forestImg} alt="Barefoot walk" ratio="aspect-[3/4] md:h-full" /></div>
          <div className="col-span-3 md:col-span-2"><ClipReveal src={fireImg} alt="Fire circle" ratio="aspect-[4/3]" /></div>
          <div className="col-span-3 md:col-span-1"><ClipReveal src={clayImg} alt="Hands working clay" ratio="aspect-square" /></div>
          <div className="col-span-3 md:col-span-2"><ClipReveal src={circleImg} alt="Group circle" ratio="aspect-[4/3]" /></div>
          <div className="col-span-3 md:col-span-1"><ClipReveal src={movementImg} alt="Movement at sunrise" ratio="aspect-square" /></div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FOUNDER ───────────── */
function Founder() {
  return (
    <section id="founder" className="bg-offwhite py-32 md:py-48">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-24">
          <div>
            <Parallax amount={20}>
              <ClipReveal src={founderImg} alt="Aman, founder of Life Moves" ratio="aspect-[4/5]" />
            </Parallax>
            <div className="mt-8 flex items-center gap-4">
              <span className="font-serif text-2xl italic">— Aman</span>
              <span className="eyebrow text-charcoal/50">Founder, Life Moves</span>
            </div>
          </div>

          <div>
            <Reveal>
              <div className="eyebrow mb-6 text-clay">06 · The Person Behind It</div>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.02]">
                Fifteen years asking <br />
                <em className="italic text-clay">one stubborn question.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-10 max-w-lg text-base leading-relaxed text-charcoal/75">
                I spent a decade in the rooms most people are trying to get into.
                Boardrooms, brand decks, investor calls. Then I spent five years
                walking out of them — into ashrams, art studios, mountains, and the
                quietest beaches in Goa — to figure out what nobody around the table
                was asking.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <blockquote className="my-12 border-l border-clay pl-6 font-serif text-3xl italic leading-snug text-forest md:text-4xl">
                Not how do you feel right now? But <span className="text-clay">how do you actually want to live?</span>
              </blockquote>
            </Reveal>

            <div className="grid grid-cols-3 gap-6 border-y border-hairline py-8">
              {[
                { n: 15, s: "", l: "Years on the road" },
                { n: 3, s: "", l: "Countries studied in" },
                { n: 400, s: "+", l: "Guests, twelve at a time" },
              ].map((x) => (
                <Reveal key={x.l}>
                  <div>
                    <div className="font-serif text-5xl text-clay md:text-6xl">
                      <Counter to={x.n} suffix={x.s} />
                    </div>
                    <div className="eyebrow mt-3 text-charcoal/60">{x.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <a href="#" data-cursor="Play" className="mt-10 inline-flex items-center gap-4 eyebrow text-clay hover:text-charcoal">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-clay">
                  <svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12 Z" fill="currentColor" /></svg>
                </span>
                Watch Aman's story · 4 min
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
    { loc: "Goa", date: "August 12 – 16, 2026", desc: "Coastal villa. Arabian Sea at the doorstep.", spots: 6, cap: 12, waitlist: false },
    { loc: "Goa", date: "August 26 – 30, 2026", desc: "Same villa. Different circle. Last of the monsoon.", spots: 9, cap: 12, waitlist: false },
    { loc: "Himachal", date: "October 2026 — Waitlist", desc: "A timber house above the clouds. Pines, woodsmoke, silence.", spots: 0, cap: 12, waitlist: true },
  ];
  return (
    <section id="editions" className="relative bg-charcoal py-32 text-offwhite grain md:py-48">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Reveal>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow mb-6 text-clay-soft">07 · Upcoming Editions</div>
              <h2 className="font-serif text-[clamp(2.4rem,5.4vw,5rem)] leading-[1.02]">
                Three dates. <em className="italic text-clay-soft">Two seasons.</em>
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="flex items-center gap-3 rounded-full border border-offwhite/20 px-5 py-3"
            >
              <span className="h-2 w-2 rounded-full bg-clay" />
              <span className="eyebrow">12 People Per Edition. Always.</span>
            </motion.div>
          </div>
        </Reveal>

        <div className="border-t border-offwhite/15">
          {list.map((e, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className={`group grid grid-cols-1 items-center gap-6 border-b border-offwhite/15 py-10 transition-all duration-500 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-10 md:py-14 hover:bg-offwhite/[0.04] hover:pl-6 ${e.waitlist ? "opacity-55" : ""}`}>
                <div>
                  <div className="eyebrow mb-3 text-clay-soft">{e.date}</div>
                  <h3 className="font-serif text-[clamp(2.8rem,5.4vw,5rem)] leading-none">
                    <span className="bg-[length:0%_1px] bg-gradient-to-r from-clay to-clay bg-no-repeat transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]" style={{ backgroundPosition: "0 100%" }}>
                      {e.loc}
                    </span>
                  </h3>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-offwhite/70">{e.desc}</p>
                <div>
                  <div className="eyebrow mb-3 text-offwhite/50">Places</div>
                  {e.cap > 0 ? (
                    <div className="flex gap-1.5">
                      {Array.from({ length: e.cap }).map((_, k) => (
                        <span
                          key={k}
                          className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                          style={{ background: k < e.cap - e.spots ? "rgba(247,244,239,0.22)" : "var(--clay)" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="eyebrow text-offwhite/60">Waitlist Open</span>
                  )}
                </div>
                <button
                  onClick={onApply}
                  data-cursor={e.waitlist ? "Waitlist" : "Apply"}
                  className={`justify-self-start eyebrow inline-flex items-center gap-3 transition-colors md:justify-self-end ${
                    e.waitlist ? "text-offwhite/70 hover:text-offwhite" : "text-clay hover:text-offwhite"
                  }`}
                >
                  {e.waitlist ? "Join Waitlist" : "Apply for this edition"}
                  <svg width="22" height="6" viewBox="0 0 22 6"><path d="M0 3H21M21 3L18 1M21 3L18 5" stroke="currentColor" strokeWidth="0.8" fill="none" /></svg>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FINAL CTA ───────────── */
function FinalCTA({ onApply }: { onApply: () => void }) {
  return (
    <section id="apply" className="relative overflow-hidden bg-charcoal py-40 text-offwhite grain md:py-56">
      {/* starscape */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-px w-px rounded-full bg-offwhite"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 71) % 100}%`,
              boxShadow: "0 0 4px rgba(247,244,239,0.6)",
            }}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.4, ease: "easeInOut" }}
          />
        ))}
        <svg className="absolute bottom-0 left-0 w-full text-charcoal/0" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0 200 Q360 120 720 160 T1440 140 L1440 200 Z" fill="var(--forest)" opacity="0.45" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-12">
        <Reveal>
          <div className="eyebrow mb-8 text-clay-soft">08 · Take a Living Break</div>
        </Reveal>
        <h2 className="font-serif text-[clamp(2.6rem,6.6vw,6.4rem)] leading-[1.02]">
          <StaggerWords text="The next five days" className="block" />
          <StaggerWords text="could change the next five years." italic className="block text-offwhite/75" delay={0.4} />
        </h2>
        <Reveal delay={0.5}>
          <p className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-offwhite/70">
            Twelve seats. A short application. A real conversation before you say yes.
            No mass intake. No upsell. Just a careful door, opened on purpose.
          </p>
        </Reveal>
        <Reveal delay={0.7}>
          <div className="mt-14 flex justify-center">
            <MagneticButton onClick={onApply}>Take a Living Break</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.9}>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-20 font-serif text-2xl italic text-clay-soft md:text-3xl"
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
    <footer className="bg-offwhite py-20 md:py-24">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-charcoal">
              <LogoMark />
              <span className="font-serif text-2xl">Life Moves</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/60">
              India's Embodied Living Movement. Twelve people, five days, one quiet circle at a time.
            </p>
          </div>
          {[
            ["The Experience", ["What it is", "The Method", "A Few Frames"]],
            ["Editions", ["Goa · Aug 12", "Goa · Aug 26", "Himachal · Oct"]],
            ["About", ["Aman", "Press", "Contact"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <div className="eyebrow mb-5 text-charcoal/50">{h as string}</div>
              <ul className="space-y-3">
                {(items as string[]).map((i) => (
                  <li key={i}><a href="#" className="text-sm text-charcoal/75 hover:text-clay">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DrawLine className="my-12 text-charcoal" />

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-charcoal/70">
            <a href="mailto:hello@lifemoves.in" className="hover:text-clay">hello@lifemoves.in</a>
            <a href="#" className="hover:text-clay">WhatsApp · +91 ·</a>
            <span>Goa · Himachal Pradesh · India</span>
          </div>
          <p className="font-serif text-xl italic text-clay">Life moves. Come move with it.</p>
        </div>
      </div>
    </footer>
  );
}
