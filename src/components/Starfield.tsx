import React from 'react';
import { motion } from 'framer-motion';

export const Starfield: React.FC = () => {
  // Generate random stars for the background
  const stars = React.useMemo(() => {
    return Array.from({ length: 45 }).map((_, idx) => ({
      id: idx,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
    }));
  }, []);

  // Generate random grid accents to resemble satellite telemetry targets
  const gridAccents = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050A15]">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-60" />

      {/* Radar Sweep Indicator */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="radar-sweep-indicator opacity-40" />
      </div>

      {/* Shimmering Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-30 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Futuristic telemetry marks / brackets (+) randomly scattered on grid intersections */}
      {gridAccents.map((accent) => (
        <div
          key={accent.id}
          className="absolute text-space-cyan/30 text-[10px] font-mono select-none"
          style={{ top: accent.top, left: accent.left }}
        >
          +
        </div>
      ))}

      {/* Ambient Radial Vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(5, 10, 21, 0.9) 100%)'
        }}
      />
    </div>
  );
};
