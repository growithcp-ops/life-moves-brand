import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  as: As = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: any;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {typeof As === "string" ? children : <As>{children}</As>}
    </motion.div>
  );
}

export function StaggerWords({
  text,
  className,
  italic = false,
  delay = 0,
}: {
  text: string;
  className?: string;
  italic?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const words = text.split(" ");
  return (
    <div ref={ref} className={className} style={{ fontStyle: italic ? "italic" : undefined }}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline pb-5 -mb-5"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block pb-1"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function DrawLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  return (
    <div ref={ref} className={"relative overflow-hidden " + className} style={{ height: 1 }}>
      <motion.div
        className="absolute inset-y-0 left-0 bg-current opacity-30"
        initial={{ width: "0%" }}
        animate={inView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 1.2, ease }}
      />
    </div>
  );
}

export function ClipReveal({
  src,
  alt,
  className,
  ratio = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  return (
    <div ref={ref} className={`relative overflow-hidden ${ratio} ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        animate={inView ? { scale: 1 } : { scale: 1.15 }}
        transition={{ duration: 1.6, ease }}
      />
      <motion.div
        className="absolute inset-0 bg-charcoal"
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={inView ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0 0)" }}
        transition={{ duration: 1.4, ease }}
      />
    </div>
  );
}

export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) {
      setVal(0);
      return;
    }
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}

export function MagneticButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-10, Math.min(10, mx * 0.3)));
    y.set(Math.max(-10, Math.min(10, my * 0.3)));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group inline-flex items-center gap-3 px-7 py-4 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors duration-500 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-clay text-offwhite hover:bg-charcoal"
      : "border border-offwhite/40 text-offwhite hover:bg-offwhite hover:text-charcoal";

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ ease }}
      className={`${base} ${styles} ${className}`}
      {...(props as any)}
    >
      <span>{children}</span>
      <svg
        width="22"
        height="6"
        viewBox="0 0 22 6"
        fill="none"
        className="transition-transform duration-500 group-hover:translate-x-1"
      >
        <path d="M0 3H21M21 3L18 1M21 3L18 5" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </motion.button>
  );
}

export function Parallax({
  children,
  amount = 40,
  className = "",
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
