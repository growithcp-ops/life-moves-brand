import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
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
        setLabel(cursorEl?.dataset.cursor ?? null);
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
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <motion.div
        animate={{
          width: label ? 72 : 10,
          height: label ? 72 : 10,
          backgroundColor: label ? "#C4845A" : "#F7F4EF",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center rounded-full"
      >
        {label && (
          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-offwhite">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
