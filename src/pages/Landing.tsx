import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Cpu, Database, ChevronRight, HelpCircle, X, Globe } from 'lucide-react';
import { Starfield } from '../components/Starfield';
import { GlassCard } from '../components/GlassCard';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showBriefing, setShowBriefing] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#050A15]">
      {/* Space Background */}
      <Starfield />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-12 my-auto">
        
        {/* Animated Planetary Orbiter */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          
          {/* Outer Orbit Path 1 (Flipped Ellipse) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[360px] h-[120px] border border-dashed border-space-cyan/20 rounded-full"
            style={{ transform: 'rotate(-30deg)' }}
          >
            {/* Satellite 1 */}
            <div className="absolute top-1/2 left-0 -translate-x-1.5 -translate-y-1.5 w-3.5 h-3.5 bg-space-cyan rounded-full flex items-center justify-center shadow-[0_0_10px_#00F0FF]">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {/* Pulsing signal wave */}
              <span className="absolute -inset-2 border border-space-cyan/40 rounded-full animate-ping" />
            </div>
            
            <div className="absolute top-0 right-10 text-[8px] font-mono text-space-cyan/50 select-none">
              INSAT-3DR [ALT: 824km]
            </div>
          </motion.div>

          {/* Outer Orbit Path 2 (Symmetrical Ellipse) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute w-[140px] h-[340px] border border-dashed border-space-orange/20 rounded-full"
            style={{ transform: 'rotate(45deg)' }}
          >
            {/* Satellite 2 */}
            <div className="absolute top-0 left-1/2 -translate-x-1.5 -translate-y-1.5 w-3 h-3 bg-space-orange rounded-full flex items-center justify-center shadow-[0_0_10px_#F97316]">
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>
            
            <div className="absolute bottom-1/3 left-0 text-[8px] font-mono text-space-orange/50 select-none">
              S5P TROPOMI
            </div>
          </motion.div>

          {/* Inner Orbital Earth Globe */}
          <motion.div
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-space-black via-[#0B1530] to-[#0A417A] shadow-[0_0_60px_rgba(0,240,255,0.25)] flex items-center justify-center border border-space-cyan/35"
          >
            {/* Scan Sweep overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,transparent_60%)] animate-pulse" />
            
            {/* World Icon in Center */}
            <Globe className="w-24 h-24 text-space-cyan/20 animate-[spin_40s_linear_infinite]" />

            {/* Earth Core Telemetry HUD elements */}
            <div className="absolute inset-2 border border-dashed border-space-cyan/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-4 border border-space-cyan/5 rounded-full" />
            
            {/* Scanning Ring */}
            <motion.div 
              animate={{ y: [-96, 96, -96] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-space-cyan/40 shadow-[0_0_10px_#00F0FF] z-10 pointer-events-none"
            />
          </motion.div>

          {/* Orbit center focal node */}
          <div className="absolute text-[9px] font-mono text-space-cyan/80 bg-space-black/70 px-2 py-0.5 border border-space-cyan/20 rounded-sm bottom-6">
            E.O.S. LINK ACTIVE
          </div>
        </div>

        {/* Title and Branding */}
        <div className="space-y-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 border border-space-cyan/30 bg-space-cyan/5 rounded-sm text-xs font-mono text-space-cyan tracking-[0.2em] uppercase"
          >
            Atmospheric Intelligence System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black tracking-widest text-white uppercase font-orbitron"
          >
            AirTrace <span className="text-space-cyan glow-cyan">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-xl text-slate-300 font-inter font-light tracking-wide max-w-xl mx-auto"
          >
            Satellite-Based Atmospheric Intelligence Platform
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6"
        >
          {/* Launch Mission Control Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 bg-space-cyan hover:bg-space-cyan/90 text-space-black font-orbitron font-extrabold tracking-wider text-sm rounded-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2"
          >
            <Rocket className="w-4 h-4 fill-current" />
            <span>LAUNCH MISSION CONTROL</span>
          </button>

          {/* Learn More Button */}
          <button
            onClick={() => setShowBriefing(true)}
            className="w-full sm:w-auto px-8 py-3.5 border border-space-cyan/30 hover:border-space-cyan/80 bg-space-cyan/5 text-space-cyan font-orbitron font-semibold tracking-wider text-sm rounded-sm transition-all hover:bg-space-cyan/10 flex items-center justify-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>SYSTEM BRIEFING</span>
          </button>
        </motion.div>

        {/* Footer Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl pt-8 border-t border-slate-800/80 text-left font-mono">
          <div className="p-3 border border-slate-900 bg-space-black/40 rounded-sm">
            <div className="text-[10px] text-slate-500">ORBIT PATHS</div>
            <div className="text-sm font-semibold text-white">POLAR RECURRENT</div>
          </div>
          <div className="p-3 border border-slate-900 bg-space-black/40 rounded-sm">
            <div className="text-[10px] text-slate-500">SPECTRAL CHANNELS</div>
            <div className="text-sm font-semibold text-space-cyan">8 CHANNELS</div>
          </div>
          <div className="p-3 border border-slate-900 bg-space-black/40 rounded-sm">
            <div className="text-[10px] text-slate-500">SENSOR CHASSIS</div>
            <div className="text-sm font-semibold text-white">Sentinel-5P / INSAT-3DR</div>
          </div>
          <div className="p-3 border border-slate-900 bg-space-black/40 rounded-sm">
            <div className="text-[10px] text-slate-500">GRID LATENCY</div>
            <div className="text-sm font-semibold text-space-orange">0.45 SECONDS</div>
          </div>
        </div>
      </div>

      {/* Briefing Overlay Modal */}
      <AnimatePresence>
        {showBriefing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl"
            >
              <GlassCard
                title="AirTrace AI System Briefing"
                subtitle="Orbital Monitoring Parameters & Infrastructure"
                glowColor="cyan"
                headerExtra={
                  <button
                    onClick={() => setShowBriefing(false)}
                    className="p-1 border border-slate-800 hover:border-slate-600 rounded-sm hover:text-space-cyan transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                }
              >
                <div className="space-y-5 my-2 text-slate-300 font-inter text-xs leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
                  <p>
                    <strong>AirTrace AI</strong> is a space-atmospheric fusion telemetry platform inspired by ISRO's environmental surveillance networks. The platform aggregates hyperspectral sensor feeds to produce high-resolution monitoring for greenhouse gases, aerosol density, formaldehyde concentrations (HCHO), and active thermal anomalies.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-3 border border-slate-800 bg-[#0F172A]/50 rounded-sm space-y-2">
                      <div className="flex items-center space-x-2 text-space-cyan">
                        <Database className="w-4 h-4" />
                        <span className="font-orbitron font-bold text-[10px] tracking-wide">SENSOR FUSION</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400">
                        Integrates TROPOMI spectral data from Copernicus Sentinel-5P and thermal bands from ISRO's INSAT-3DR satellite.
                      </p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-[#0F172A]/50 rounded-sm space-y-2">
                      <div className="flex items-center space-x-2 text-space-orange">
                        <Cpu className="w-4 h-4" />
                        <span className="font-orbitron font-bold text-[10px] tracking-wide">PLUME TRACKING</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400">
                        Combines wind vector analysis and dispersion algorithms to perform back-trajectory plume origin attribution.
                      </p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-[#0F172A]/50 rounded-sm space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-orbitron font-bold text-[10px] tracking-wide">FIRE VECTORING</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400">
                        Utilizes mid-wave infrared bands for instant hotspot alarm generation, preventing forest and agricultural fires.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border border-space-cyan/10 bg-space-cyan/5 font-mono text-[10.5px] text-slate-400 space-y-1">
                    <div className="text-white font-bold mb-1 uppercase font-orbitron tracking-wider text-[9px]">MISSION PROTOCOL STATUS</div>
                    <div>• Ground Station: ISRO Telemetry, Tracking and Command Network (ISTRAC)</div>
                    <div>• Satellite Orbit Altitude: 824.6 km Sun-Synchronous</div>
                    <div>• Alert Threshold Protocols: ISRO-IND-ST08 Active</div>
                    <div>• Encryption Status: ISAE-256 Symmetric Telemetry Stream</div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setShowBriefing(false);
                        navigate('/dashboard');
                      }}
                      className="px-5 py-2.5 bg-space-cyan hover:bg-space-cyan/90 text-space-black font-orbitron font-bold tracking-wider text-[11px] rounded-sm transition-all hover:scale-105 flex items-center space-x-1.5"
                    >
                      <span>LAUNCH SENSORS</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
