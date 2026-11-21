import { Link } from "@tanstack/react-router";
import { Nav, Footer } from "./layout";
import { ApplicationModal } from "@/components/life-moves/application";
import { useInquiryModal } from "@/hooks/use-inquiry-modal";
import { Reveal } from "@/components/life-moves/primitives";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPageLayout({
  eyebrow,
  title,
  subtitle,
  updatedAt = "November 2026",
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  updatedAt?: string;
  sections: LegalSection[];
}) {
  const [open, setOpen] = useInquiryModal();

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-safe selection:bg-clay selection:text-offwhite font-sans">
      <Nav onApply={() => setOpen(true)} alwaysSolid />

      {/* Botanical Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <img
          src="/velira-botanical-bg.webp"
          alt="Velira botanical backdrop"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <main className="relative z-10 pt-32 sm:pt-40 pb-20 sm:pb-28 px-5 sm:px-6 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <span className="eyebrow text-clay mb-4 block">{eyebrow}</span>
            <h1 className="font-serif text-4xl sm:text-6xl font-black text-charcoal tracking-tight leading-[1.08]">
              {title}
            </h1>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-charcoal/70 font-light max-w-2xl">
              {subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-charcoal/45">
              <span>Velira Health &amp; Wellness</span>
              <span>·</span>
              <span>Last Updated: {updatedAt}</span>
            </div>
            <div className="w-20 h-0.5 bg-clay my-10" />
          </Reveal>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <Reveal key={sec.heading} delay={idx * 0.05}>
                <section className="glass rounded-sm p-6 md:p-9 space-y-3">
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-charcoal">
                    {sec.heading}
                  </h2>
                  {sec.body.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm md:text-base leading-relaxed text-charcoal/75 font-light"
                    >
                      {para}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-8">
              <Link
                to="/"
                className="eyebrow text-[10px] text-charcoal/65 hover:text-clay transition"
              >
                ← Return Home
              </Link>
              <Link
                to="/contact"
                className="eyebrow text-[10px] text-clay hover:text-charcoal transition"
              >
                Questions? Contact Velira →
              </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer onApply={() => setOpen(true)} />
      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
