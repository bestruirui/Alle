"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MemphisBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Animated circles */}
      <motion.div
        className="absolute top-[8%] left-[5%] w-24 h-24 rounded-full border-[6px] border-[var(--memphis-pink)]"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.7 }}
      />

      <motion.div
        className="absolute top-[15%] right-[12%] w-16 h-16 rounded-full bg-[var(--memphis-yellow)]"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.6 }}
      />

      {/* Triangles */}
      <motion.div
        className="absolute bottom-[20%] left-[15%]"
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ opacity: 0.55 }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "45px solid transparent",
            borderRight: "45px solid transparent",
            borderBottom: "80px solid var(--memphis-cyan)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-[55%] right-[8%]"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.5 }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "35px solid transparent",
            borderRight: "35px solid transparent",
            borderTop: "60px solid var(--memphis-purple)",
          }}
        />
      </motion.div>

      {/* Squiggly lines / Wave patterns */}
      <motion.div
        className="absolute top-[35%] left-[8%] w-32 h-2 bg-[var(--memphis-pink)]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%)",
          opacity: 0.65,
        }}
        animate={{
          x: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[35%] right-[18%] w-28 h-3 bg-[var(--memphis-yellow)]"
        style={{
          transform: "rotate(-25deg)",
          clipPath: "polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%, 10% 50%)",
          opacity: 0.6,
        }}
        animate={{
          rotate: [-25, -15, -25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dots pattern overlay */}
      <motion.div
        className="absolute top-[65%] left-[25%] w-20 h-20 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--memphis-cyan) 3px, transparent 3px)",
          backgroundSize: "15px 15px",
          opacity: 0.5,
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Zigzag patterns */}
      <motion.div
        className="absolute top-[80%] left-[40%] w-24 h-1"
        style={{
          background: "repeating-linear-gradient(90deg, var(--memphis-purple) 0, var(--memphis-purple) 10px, transparent 10px, transparent 20px)",
          opacity: 0.65,
        }}
        animate={{
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small accent circles */}
      <motion.div
        className="absolute top-[42%] right-[30%] w-8 h-8 rounded-full border-[4px] border-[var(--memphis-cyan)]"
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.7 }}
      />

      <motion.div
        className="absolute bottom-[15%] left-[60%] w-12 h-12 rounded-full bg-[var(--memphis-purple)]"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.5 }}
      />

      {/* Rectangle with rotation */}
      <motion.div
        className="absolute top-[25%] right-[45%] w-16 h-20 border-[5px] border-[var(--memphis-yellow)]"
        animate={{
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.6 }}
      />

      {/* Additional small geometric elements */}
      <motion.div
        className="absolute bottom-[45%] left-[70%] w-10 h-10 bg-[var(--memphis-pink)]"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          opacity: 0.55,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
