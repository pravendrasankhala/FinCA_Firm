"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export function StatCounter({
  value,
  prefix,
  suffix,
}: {
  value: string;
  prefix?: string | null;
  suffix?: string | null;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const isNumeric = !Number.isNaN(numericValue);
  const [display, setDisplay] = useState(() => (isNumeric ? "0" : value));

  useEffect(() => {
    if (!inView || !isNumeric) return;
    const controls = animate(0, numericValue, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        const decimals = value.includes(".") ? 1 : 0;
        setDisplay(latest.toFixed(decimals));
      },
    });
    return () => controls.stop();
  }, [inView, isNumeric, numericValue, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
