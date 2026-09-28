"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Industry } from "@prisma/client";
import { IndustryNode, NODE_TINTS } from "./IndustryNode";
import { IndustriesCenter } from "./IndustriesCenter";
import { OrbitRing } from "./OrbitRing";

const AUTO_ROTATE_MS = 3500;
const CONNECTOR_GAP = 34; // px between the node's inner edge and its connector dot

type Slot = { x: number; y: number; width: number };

// Single, unified position map keyed by slug. x/y are px offsets of the
// node's CENTER point relative to the canvas center (0,0). Rows sit 180px
// apart vertically (node height ~128px + 50px margin), which on its own
// guarantees no two vertically-adjacent nodes can ever collide regardless of
// x — so the only thing that needs checking per row is the left/right pair's
// own horizontal separation (each node is ~270-290px wide, so pairs are kept
// at least 340px apart center-to-center) and clearance from the center
// circle (~320px wide) for the row that sits level with it.
const NODE_POSITIONS: Record<string, Slot> = {
  startups: { x: -180, y: -360, width: 290 },
  manufacturing: { x: 180, y: -360, width: 270 },
  "individuals-professionals": { x: -300, y: -180, width: 270 },
  "retail-trading": { x: 300, y: -180, width: 270 },
  "export-import": { x: -340, y: 0, width: 270 },
  "professional-services": { x: 340, y: 0, width: 270 },
  technology: { x: -300, y: 180, width: 270 },
  "e-commerce": { x: 300, y: 180, width: 270 },
  healthcare: { x: -180, y: 360, width: 270 },
  "real-estate": { x: 180, y: 360, width: 270 },
};

/** Evenly-distributed fallback ellipse position, used only for industries
 * that don't have a curated slot above (e.g. a new one added in the CMS). */
function fallbackSlot(index: number, total: number): Slot {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * 340, y: Math.sin(angle) * 360, width: 270 };
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const dotVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export function IndustriesOrbitDesktop({ industries }: { industries: Industry[] }) {
  const reduceMotion = useReducedMotion();
  const [autoActive, setAutoActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion || industries.length <= 1) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setAutoActive((a) => (a + 1) % industries.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [industries.length, reduceMotion]);

  const activeIndex = hovered ?? autoActive;

  const handleHoverStart = (index: number) => {
    pausedRef.current = true;
    setHovered(index);
  };
  const handleHoverEnd = () => {
    pausedRef.current = false;
    setHovered(null);
  };

  return (
    <div className="relative mx-auto hidden md:block md:h-[900px] md:max-w-[1000px] lg:h-[940px] lg:max-w-[1200px]">
      <OrbitRing />

      <div
        className="absolute"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <IndustriesCenter />
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="absolute inset-0"
      >
        {industries.map((industry, index) => {
          const slot = NODE_POSITIONS[industry.slug] ?? fallbackSlot(index, industries.length);
          const tint = NODE_TINTS[index % NODE_TINTS.length];

          // Angle of this node relative to the canvas center — the connector
          // dot and line are placed along this same angle, between the
          // node's inner edge and the center, so each one is derived from
          // the node's real position rather than a fixed left/right side.
          const distance = Math.sqrt(slot.x * slot.x + slot.y * slot.y);
          const angle = Math.atan2(slot.y, slot.x);
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const edgeRadius = Math.max(distance - slot.width / 2, 0);
          const dotRadius = Math.max(edgeRadius - CONNECTOR_GAP, 0);
          const edgeX = ux * edgeRadius;
          const edgeY = uy * edgeRadius;
          const dotX = ux * dotRadius;
          const dotY = uy * dotRadius;
          const angleDeg = (angle * 180) / Math.PI;
          const isActive = activeIndex === index;

          return (
            <div key={industry.id}>
              {/* connector line: node's inner edge → connector dot */}
              <motion.div
                variants={dotVariants}
                className={`absolute h-[1.5px] origin-left ${isActive ? "bg-gold-500" : "bg-border"}`}
                style={{
                  left: "50%",
                  top: "50%",
                  width: CONNECTOR_GAP,
                  opacity: isActive ? 0.9 : 0.6,
                  transform: `translate(calc(-50% + ${edgeX}px), calc(-50% + ${edgeY}px)) rotate(${angleDeg}deg)`,
                }}
              />
              {/* connector dot */}
              <motion.span
                variants={dotVariants}
                className={`absolute h-2.5 w-2.5 rounded-full border-2 border-white shadow-md ${isActive ? "bg-gold-500" : tint.dot}`}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`,
                }}
              />

              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: slot.width,
                  transform: `translate(calc(-50% + ${slot.x}px), calc(-50% + ${slot.y}px))`,
                }}
              >
                <IndustryNode
                  industry={industry}
                  index={index}
                  featured={industry.slug === "startups"}
                  active={isActive}
                  floaty
                  variants={itemVariants}
                  onHoverStart={() => handleHoverStart(index)}
                  onHoverEnd={handleHoverEnd}
                />
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
