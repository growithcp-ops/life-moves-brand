import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Outer ring spring (smooth, slight lag)
  const sxOuter = useSpring(x, { stiffness: 180, damping: 25, mass: 0.6 });
  const syOuter = useSpring(y, { stiffness: 180, damping: 25, mass: 0.6 });

  // Inner dot spring (tight, fast)
  const sxInner = useSpring(x, { stiffness: 400, damping: 35, mass: 0.2 });
  const syInner = useSpring(y, { stiffness: 400, damping: 35, mass: 0.2 });

  const [label, setLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setVisible(true);

    const move = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);

        const target = e.target as HTMLElement | null;
        const cursorEl = target?.closest("[data-cursor]") as HTMLElement | null;
        const buttonEl = target?.closest("button, a, input, select") as HTMLElement | null;

        setLabel(cursorEl?.dataset.cursor ?? null);
        setIsHovered(!!cursorEl || !!buttonEl);
      });
    };

    window.addEventListener("mousemove", move);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.style.cursor = "";
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{ x: sxOuter, y: syOuter }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <motion.div
          animate={{
            width: label ? 88 : isHovered ? 44 : 28,
            height: label ? 88 : isHovered ? 44 : 28,
            backgroundColor: label ? "rgba(86, 92, 70, 0.15)" : "rgba(247, 244, 239, 0.05)",
            borderColor: label ? "var(--clay)" : "rgba(18, 18, 18, 0.15)",
            borderWidth: 1,
            backdropFilter: label ? "blur(2px)" : "blur(0px)",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center rounded-full border border-charcoal/20"
        >
          {label && (
            <span className="px-2 text-center text-[8.5px] font-semibold uppercase tracking-[0.22em] text-clay">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner Core Dot */}
      <motion.div
        style={{ x: sxInner, y: syInner }}
        className="pointer-events-none fixed left-0 top-0 z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference will-change-transform"
      >
        <motion.div
          animate={{
            scale: isHovered ? 0.4 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="h-1.5 w-1.5 rounded-full bg-offwhite"
        />
      </motion.div>
    </>
  );
}
