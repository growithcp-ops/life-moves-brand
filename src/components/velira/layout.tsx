import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DrawLine } from "@/components/life-moves/primitives";

const ease = [0.16, 1, 0.3, 1] as const;

const VELIRA_LOGO_SRC = "/d78ff232-1f84-4757-a9b7-98d9571875f6.jpg";

/** Square brand logo mark using the full Velira logo image. */
export function VeliraLogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center overflow-hidden border border-clay/35 bg-[#F7F4EC] shadow-sm ${className}`}
    >
      <img
        src={VELIRA_LOGO_SRC}
        alt="Velira Health & Wellness logo"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function VeliraLogo({
  className = "",
  showSubtitle = false,
}: {
  className?: string;
  showSubtitle?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <VeliraLogoMark />
      <div className="flex flex-col leading-none">
        <span className="font-serif text-xl font-bold tracking-tight">Velira</span>
        {showSubtitle && (
          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.26em] opacity-65">
            Health &amp; Wellness
          </span>
        )}
      </div>
    </div>
  );
}

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-5 sm:px-6 py-4 sm:py-5 md:px-12 text-offwhite transition-colors duration-300 ${
          solid
            ? "bg-charcoal/95 md:backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex items-center justify-between gap-4 lg:gap-6 max-w-[1500px]">
          <Link to="/" className="flex items-center transition hover:opacity-85 flex-shrink-0">
            <VeliraLogo className="text-white" showSubtitle />
          </Link>

          <div className="hidden items-center gap-3 xl:flex bg-white/5 px-4 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
            </span>
            <span className="text-[9.5px] uppercase font-medium tracking-wider text-offwhite/80">
              Care Shaped Around You · 1-on-1 Wellness
            </span>
          </div>

          <nav className="hidden items-center gap-5 xl:gap-6 lg:flex whitespace-nowrap">
            <Link
              to="/"
              className="eyebrow text-xs tracking-[0.18em] opacity-80 transition hover:opacity-100"
            >
              Home
            </Link>
            <Link
              to="/experience"
              className="eyebrow text-xs tracking-[0.18em] opacity-80 transition hover:opacity-100"
            >
              Services &amp; Journey
            </Link>
            <Link
              to="/contact"
              className="eyebrow text-xs tracking-[0.18em] opacity-80 transition hover:opacity-100"
            >
              Contact
            </Link>

            <button
              type="button"
              data-open-inquiry="true"
              onClick={onApply}
              className="rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 border cursor-pointer bg-offwhite border-offwhite text-charcoal hover:bg-transparent hover:text-offwhite"
            >
              Step into Velira
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="eyebrow justify-self-end lg:hidden text-offwhite/85 text-xs tracking-[0.18em] cursor-pointer"
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-charcoal px-6 py-6 sm:px-8 sm:py-8 text-offwhite lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-offwhite/10 pb-5 sm:pb-6">
              <div className="flex items-center gap-3">
                <VeliraLogo className="text-white" showSubtitle />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="eyebrow flex items-center gap-1 hover:text-clay transition text-[9.5px] cursor-pointer"
              >
                <span>Close</span> <span>✕</span>
              </button>
            </div>

            <nav className="my-8 sm:my-16 flex flex-1 flex-col justify-center gap-6 sm:gap-8">
              {[
                { label: "Home", to: "/" },
                { label: "Services & Journey", to: "/experience" },
                { label: "Contact", to: "/contact" },
              ].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                >
                  <Link
                    to={item.to as any}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl sm:text-4xl hover:text-clay transition"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                type="button"
                data-open-inquiry="true"
                onClick={() => {
                  setMenuOpen(false);
                  onApply();
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.34, ease }}
                className="font-serif text-3xl sm:text-4xl text-left text-clay-soft hover:text-clay transition cursor-pointer"
              >
                Step into Velira
              </motion.button>
            </nav>
            <p className="eyebrow opacity-50 mt-auto border-t border-offwhite/10 pt-6 text-[9.5px]">
              Velira Health &amp; Wellness · Care shaped around you.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer({ onApply }: { onApply?: () => void }) {
  return (
    <footer className="bg-offwhite py-16 sm:py-20 md:py-24 border-t border-hairline relative z-10 text-charcoal">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-6 md:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="h-28 w-28 overflow-hidden rounded-md border border-charcoal/10 bg-[#F7F4EC] shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={VELIRA_LOGO_SRC}
                  alt="Velira Health & Wellness"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div className="space-y-1">
              <p className="max-w-xs text-sm leading-relaxed text-charcoal/80 font-medium">
                Velira Health &amp; Wellness
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-charcoal/55 font-light">
                Care shaped around you — lifestyle modification, personalised yoga, diet therapy,
                and reset programs to feel fresh from inside.
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
                  to="/"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/experience"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Services &amp; Journey
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Contact &amp; Inquiry
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  data-open-inquiry="true"
                  onClick={onApply}
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light cursor-pointer text-left"
                >
                  Step into Velira
                </button>
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
                <Link
                  to="/privacy"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Refund Policy
                </Link>
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
                  href="mailto:velirahealth@gmail.com"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  velirahealth@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918148288704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  WhatsApp · +91 81482 88704
                </a>
              </li>
              <li>
                <a
                  href="tel:+918148288704"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Phone · +91 81482 88704
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/velirahealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal/70 transition hover:text-clay hover:pl-1 duration-300 inline-block font-light"
                >
                  Instagram · @velirahealth
                </a>
              </li>
            </ul>
          </div>
        </div>

        <DrawLine className="my-14 text-charcoal" />

        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-3 xl:gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] lg:text-[10px] xl:text-xs text-charcoal/50 uppercase tracking-[0.06em] lg:tracking-[0.04em] xl:tracking-wider font-medium lg:flex-nowrap lg:gap-x-3 xl:gap-x-5">
            <a
              href="mailto:velirahealth@gmail.com"
              className="hover:text-clay transition duration-300 whitespace-nowrap"
            >
              velirahealth@gmail.com
            </a>
            <a
              href="https://instagram.com/velirahealth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-clay transition duration-300 whitespace-nowrap"
            >
              @velirahealth
            </a>
            <span className="whitespace-nowrap">Velira Care Team · India</span>
          </div>

          <div className="shrink-0 text-[11px] lg:text-[10px] xl:text-xs tracking-wider lg:tracking-[0.04em] xl:tracking-wider text-charcoal/50 whitespace-nowrap">
            <span>Built by </span>
            <a
              href="https://growitate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold uppercase tracking-widest text-charcoal/80 hover:text-clay transition duration-300"
            >
              GROWITATE
            </a>
          </div>

          <p className="font-serif text-lg lg:text-sm xl:text-lg italic text-clay font-light lg:shrink-0 lg:whitespace-nowrap">
            Velira Health &amp; Wellness — Care shaped around you.
          </p>
        </div>
      </div>
    </footer>
  );
}
