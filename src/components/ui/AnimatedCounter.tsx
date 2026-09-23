"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Compteur animé au scroll : 0 → valeur finale.
 * Respecte prefers-reduced-motion.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  // Si la valeur est 0 (cas "Mobile First" par exemple), on n'anime pas
  if (value === 0) {
    return (
      <span ref={ref} className={className}>
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
