import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, ZoomIn, ZoomOut, Layers, Target, Compass, Navigation } from 'lucide-react';


interface MapPlaceholderProps {
  title?: string;
  className?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  title = "Atmospheric Orbital Grid",
  className = ""
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [activeLayer, setActiveLayer] = useState<'thermal' | 'aerosol' | 'wind' | 'hcho'>('aerosol');
  const [reticlePos, setReticlePos] = useState({ x: 50, y: 40 });
  const [targetLock, setTargetLock] = useState(true);

  const layers = [
    { id: 'aerosol', name: 'AEROSOL (S5P)', color: 'text-space-cyan border-space-cyan/30 bg-space-cyan/5' },
    { id: 'thermal', name: 'THERMAL (INSAT)', color: 'text-space-orange border-space-orange/30 bg-space-orange/5' },
    { id: 'wind', name: 'WIND FLUX', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' },
    { id: 'hcho', name: 'HCHO PIXEL', color: 'text-purple-400 border-purple-400/30 bg-purple-400/5' },
  ];

  // Adjust zoom levels
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  // Change reticle coordinates
  const triggerScan = () => {
    setReticlePos({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    });
    setTargetLock(false);
    setTimeout(() => setTargetLock(true), 1200);
  };

  return (
    <div className={`relative bg-space-black border border-space-cyan/20 overflow-hidden flex flex-col ${className}`}>
      
      {/* Top Map HUD Bar */}
      <div className="flex items-center justify-between border-b border-space-cyan/15 bg-[#0F172A]/90 px-4 py-2 text-xs z-10">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-3.5 h-3.5 text-space-cyan animate-pulse" />
          <span className="font-orbitron font-bold tracking-wider text-slate-200">{title}</span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[10px] text-slate-400">
          <span>LAT: <span className="text-white font-semibold">{(20.5937 * zoom).toFixed(4)}° N</span></span>
          <span>LNG: <span className="text-white font-semibold">{(78.9629 * zoom).toFixed(4)}° E</span></span>
          <span className="hidden sm:inline">ALT: <span className="text-space-cyan font-semibold">824.6 KM</span></span>
        </div>
      </div>

      {/* Map Content Viewport */}
      <div className="flex-1 relative bg-[#040810] overflow-hidden flex items-center justify-center min-h-[300px]">
        {/* Radar grids overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
        
        {/* Radar Concentric Circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[80%] h-[80%] border border-space-cyan/5 rounded-full" />
          <div className="w-[55%] h-[55%] border border-space-cyan/5 rounded-full" />
          <div className="w-[30%] h-[30%] border border-space-cyan/10 rounded-full" />
        </div>

        {/* Slow radar scanning sweep sweep */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="radar-sweep-indicator opacity-20" />
        </div>

        {/* Google Map of India */}
        <div className="absolute inset-0 select-none opacity-40 transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
          <iframe
            title="Google Map of India"
            src={`https://maps.google.com/maps?q=India&t=&z=${Math.round(5 + (zoom - 1.0) * 4)}&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 invert grayscale contrast-[1.2]"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Dynamic heatmap points based on active layer */}
        <AnimatePresence>
          {activeLayer === 'aerosol' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Cyan aerosol plumes */}
              <div className="absolute top-[35%] left-[45%] w-32 h-32 bg-space-cyan/20 rounded-full filter blur-xl animate-pulse" />
              <div className="absolute top-[48%] left-[40%] w-24 h-24 bg-space-cyan/30 rounded-full filter blur-xl" />
              <div className="absolute top-[20%] left-[60%] w-40 h-40 bg-space-cyan/15 rounded-full filter blur-2xl" />
            </motion.div>
          )}
          {activeLayer === 'thermal' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Orange/Red thermal hotspots */}
              <div className="absolute top-[42%] left-[46%] w-16 h-16 bg-space-orange/40 rounded-full filter blur-md animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-[42%] left-[46%] w-12 h-12 bg-space-red/50 rounded-full filter blur-md" />
              
              <div className="absolute top-[28%] left-[35%] w-10 h-10 bg-space-orange/30 rounded-full filter blur-md animate-pulse" />
              <div className="absolute top-[55%] left-[52%] w-14 h-14 bg-space-red/40 rounded-full filter blur-md" />
            </motion.div>
          )}
          {activeLayer === 'wind' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Green wind trajectories vector lines */}
              <svg className="w-full h-full text-emerald-400/40" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 10,20 Q 30,15 50,30 T 90,20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1, 4" className="animate-[dash_10s_linear_infinite]" />
                <path d="M 5,45 Q 35,40 55,60 T 95,45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1, 4" className="animate-[dash_8s_linear_infinite]" />
                <path d="M 20,75 Q 40,80 60,65 T 100,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1, 4" className="animate-[dash_12s_linear_infinite]" />
              </svg>
            </motion.div>
          )}
          {activeLayer === 'hcho' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Purple Formaldehyde dispersion */}
              <div className="absolute top-[30%] left-[50%] w-28 h-28 bg-purple-500/25 rounded-full filter blur-xl animate-pulse" />
              <div className="absolute top-[34%] left-[53%] w-14 h-14 bg-purple-600/35 rounded-full filter blur-lg" />
              <div className="absolute top-[48%] left-[32%] w-20 h-20 bg-purple-500/20 rounded-full filter blur-xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic target reticle */}
        <motion.div
          animate={{
            x: `${reticlePos.x}%`,
            y: `${reticlePos.y}%`,
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="absolute -ml-5 -mt-5 w-10 h-10 flex items-center justify-center z-10 pointer-events-none"
        >
          <div className={`relative w-full h-full flex items-center justify-center ${targetLock ? 'text-space-cyan' : 'text-space-orange'}`}>
            <Target className={`w-8 h-8 ${targetLock ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
            <div className="absolute w-2 h-2 bg-current rounded-full animate-ping" />
            
            {/* Target telemetry lock popup */}
            {targetLock && (
              <div className="absolute top-8 left-8 bg-space-black/90 border border-space-cyan/30 px-2 py-1 rounded-sm text-[8px] font-mono text-space-cyan w-24 pointer-events-auto">
                <div className="font-bold flex justify-between items-center">
                  <span>LOCK SECURED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-space-cyan animate-ping" />
                </div>
                <div>X-REF: IND-8239</div>
                <div>VAL: {activeLayer === 'aerosol' ? '0.42 DU' : activeLayer === 'thermal' ? '312 K' : activeLayer === 'wind' ? '18 m/s' : '0.15 DU'}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Orbit Ground Track Path */}
        <div className="absolute bottom-6 left-6 font-mono text-[9px] bg-space-black/80 border border-slate-800 p-2.5 rounded-sm space-y-1 text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-space-cyan animate-pulse" />
            <span className="text-slate-200 font-bold">ORBIT TRACKING ACTIVE</span>
          </div>
          <div>SWATH WIDTH: 2600 KM</div>
          <div>SENSOR STATUS: STREAMING</div>
          <div>ZENITH ANGLE: 12.4°</div>
        </div>

        {/* Compass HUD */}
        <div className="absolute top-4 right-4 flex flex-col items-center space-y-1 text-slate-400 bg-space-black/70 p-2 border border-slate-800/80 rounded-sm">
          <Compass className="w-5 h-5 text-space-cyan animate-pulse" />
          <span className="text-[8px] font-mono">N 0.00°</span>
        </div>
      </div>

      {/* Bottom Map Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-space-cyan/15 bg-[#0F172A]/90 px-4 py-2.5 gap-2 z-10">
        
        {/* Layer Selector */}
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="text-[10px] font-mono text-slate-400 mr-1.5 hidden sm:inline">OVERLAY:</span>
          <div className="flex flex-wrap gap-1">
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`px-2 py-1 text-[9px] font-mono font-bold border rounded-sm transition-all ${
                  activeLayer === layer.id 
                    ? layer.color
                    : 'text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Scan buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={triggerScan}
            className="px-2.5 py-1 text-[9px] font-orbitron font-semibold tracking-wider bg-space-cyan/10 hover:bg-space-cyan/20 border border-space-cyan/30 text-space-cyan rounded-sm transition-all flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 rotate-45" />
            <span>SCAN GRID</span>
          </button>
          
          <div className="flex border border-slate-800 rounded-sm overflow-hidden bg-space-black">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="px-2 flex items-center justify-center text-[9px] font-mono border-x border-slate-800 text-slate-300 w-10">
              {zoom.toFixed(1)}x
            </div>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
