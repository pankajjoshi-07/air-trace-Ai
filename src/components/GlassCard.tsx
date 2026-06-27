import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'orange' | 'red' | 'none';
  title?: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  showCorners?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  title,
  subtitle,
  headerExtra,
  showCorners = true,
  onClick
}) => {
  // Border style classes based on color config
  let borderClass = 'border-space-cyan/15';
  let hoverClass = 'hover:border-space-cyan/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]';
  let glowStyleClass = 'glass-panel';

  if (glowColor === 'orange') {
    borderClass = 'border-space-orange/15';
    hoverClass = 'hover:border-space-orange/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]';
    glowStyleClass = 'glass-panel-orange';
  } else if (glowColor === 'red') {
    borderClass = 'border-space-red/15';
    hoverClass = 'hover:border-space-red/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]';
    glowStyleClass = 'glass-panel-red';
  } else if (glowColor === 'none') {
    borderClass = 'border-slate-800';
    hoverClass = 'hover:border-slate-700';
    glowStyleClass = 'bg-[#0F172A]/70 backdrop-blur-md border';
  }

  const cursorClass = onClick ? 'cursor-pointer select-none active:scale-[0.99] transition-transform' : '';

  return (
    <div
      onClick={onClick}
      className={`relative ${glowStyleClass} ${borderClass} ${hoverClass} ${cursorClass} p-5 rounded-sm overflow-hidden ${className}`}
    >
      {/* HUD corner brackets */}
      {showCorners && (
        <>
          <div className={`hud-corner hud-corner-tl ${glowColor === 'orange' ? 'border-space-orange' : glowColor === 'red' ? 'border-space-red' : 'border-space-cyan'}`} />
          <div className={`hud-corner hud-corner-tr ${glowColor === 'orange' ? 'border-space-orange' : glowColor === 'red' ? 'border-space-red' : 'border-space-cyan'}`} />
          <div className={`hud-corner hud-corner-bl ${glowColor === 'orange' ? 'border-space-orange' : glowColor === 'red' ? 'border-space-red' : 'border-space-cyan'}`} />
          <div className={`hud-corner hud-corner-br ${glowColor === 'orange' ? 'border-space-orange' : glowColor === 'red' ? 'border-space-red' : 'border-space-cyan'}`} />
        </>
      )}

      {/* Futuristic Background scanning line effect (subtle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />

      {/* Card Header */}
      {(title || subtitle || headerExtra) && (
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div>
            {title && (
              <h3 className={`text-sm font-semibold tracking-wider font-orbitron uppercase text-slate-100 ${
                glowColor === 'cyan' ? 'group-hover:text-space-cyan' : glowColor === 'orange' ? 'group-hover:text-space-orange' : glowColor === 'red' ? 'group-hover:text-space-red' : ''
              }`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5 uppercase">
                {subtitle}
              </p>
            )}
          </div>
          {headerExtra && <div className="text-xs">{headerExtra}</div>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
