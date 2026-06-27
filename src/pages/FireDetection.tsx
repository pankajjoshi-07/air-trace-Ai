import React, { useState } from 'react';
import { Flame, Compass, MapPin, ZoomIn, Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface FireAnomaly {
  id: string;
  region: string;
  coords: string;
  frp: number; // Fire Radiative Power in MW
  temp: number; // Temp in Kelvin
  confidence: number; // Percentage
  satellite: string;
  aerosolCo: number; // CO index proxy
  status: 'CRITICAL' | 'MONITORING';
}

export const FireDetection: React.FC = () => {
  const [selectedFireId, setSelectedFireId] = useState<string>('FR-904');
  const [thermalContrast, setThermalContrast] = useState<'normal' | 'high'>('normal');

  const fires: FireAnomaly[] = [
    { id: 'FR-904', region: 'Bathinda Rural, PB', coords: '30.2116° N, 74.9454° E', frp: 184.5, temp: 362.4, confidence: 98, satellite: 'INSAT-3DR TIR', aerosolCo: 2.45, status: 'CRITICAL' },
    { id: 'FR-882', region: 'Chandrapur Ind., MH', coords: '20.0125° N, 79.2987° E', frp: 95.2, temp: 338.1, confidence: 91, satellite: 'Sentinel-3 SLSTR', aerosolCo: 1.82, status: 'CRITICAL' },
    { id: 'FR-910', region: 'Kachchh Vents, GJ', coords: '23.4021° N, 69.8152° E', frp: 42.8, temp: 320.5, confidence: 84, satellite: 'INSAT-3DR TIR', aerosolCo: 0.95, status: 'MONITORING' },
    { id: 'FR-915', region: 'Korba Forest, CT', coords: '22.3597° N, 82.7501° E', frp: 112.4, temp: 345.8, confidence: 96, satellite: 'INSAT-3D TIR', aerosolCo: 2.10, status: 'CRITICAL' },
    { id: 'FR-917', region: 'Haldia Refineries, WB', coords: '22.0235° N, 88.0674° E', frp: 35.6, temp: 318.2, confidence: 82, satellite: 'Sentinel-3 SLSTR', aerosolCo: 3.12, status: 'MONITORING' },
  ];

  const selectedFire = fires.find(f => f.id === selectedFireId) || fires[0];

  // Helper to generate simulated 8x8 thermal pixels
  const generateThermalGrid = (temp: number) => {
    const base = Math.floor(temp);
    const grid = [];
    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        // Create a heat distribution centered around (3,3) & (4,4)
        const dist = Math.sqrt(Math.pow(r - 3.5, 2) + Math.pow(c - 3.5, 2));
        const variance = Math.random() * 8 - 4;
        const heat = Math.max(295, base - (dist * 18) + variance);
        row.push(Math.floor(heat));
      }
      grid.push(row);
    }
    return grid;
  };

  const thermalPixels = React.useMemo(() => {
    return generateThermalGrid(selectedFire.temp);
  }, [selectedFire.temp]);

  // Color mapper based on Kelvin temperature
  const getThermalColor = (k: number) => {
    const ratio = Math.min(Math.max((k - 295) / 60, 0), 1); // scale between 0 and 1
    if (thermalContrast === 'high') {
      // High contrast: sharp yellow/red cutoff
      if (ratio > 0.8) return 'bg-[#FF0000] text-white shadow-[0_0_8px_#FF0000]';
      if (ratio > 0.5) return 'bg-[#FF8800] text-black';
      if (ratio > 0.2) return 'bg-[#FFFF00] text-black';
      return 'bg-[#112244] text-slate-500';
    } else {
      // Normal infrared gradient
      if (ratio > 0.75) return 'bg-space-red text-white';
      if (ratio > 0.5) return 'bg-space-orange text-white';
      if (ratio > 0.25) return 'bg-[#CA8A04] text-slate-100'; // dark yellow
      if (ratio > 0.1) return 'bg-[#1E293B] text-slate-400';
      return 'bg-[#0F172A] text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <Flame className="w-5 h-5 text-space-orange animate-pulse" />
          <span>ACTIVE THERMAL ANOMALY VECTORING</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          INSAT-3DR MID-INFRARED HOTSPOT STREAM • FIRE RADIATIVE POWER (FRP) PROTOCOL
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hotspot Alarm List */}
        <GlassCard 
          title="Active Hotspot Logs" 
          subtitle="SATELLITE THERMAL DETECTION ALARMS" 
          glowColor="orange"
          className="lg:col-span-1"
        >
          <div className="space-y-2 mt-1 max-h-[420px] overflow-y-auto pr-1">
            {fires.map((fire) => (
              <button
                key={fire.id}
                onClick={() => setSelectedFireId(fire.id)}
                className={`w-full p-2.5 border rounded-sm font-mono text-left transition-all text-xs flex items-center justify-between ${
                  selectedFireId === fire.id
                    ? 'border-space-orange bg-space-orange/5 text-space-orange'
                    : 'border-slate-800 bg-[#050A15]/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${fire.status === 'CRITICAL' ? 'bg-space-red animate-pulse' : 'bg-space-orange'}`} />
                    <span className="text-slate-200">{fire.id} ({fire.region.split(',')[0]})</span>
                  </div>
                  <div className="text-[9px] text-slate-400">{fire.coords}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{fire.frp} MW</div>
                  <div className="text-[8px] text-slate-500">{fire.satellite}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Selected Anomaly Thermal Detail Console */}
        <GlassCard 
          title={`Thermal Profile: ${selectedFire.id}`} 
          subtitle="INFRARED MATRIX HEATMAP SCAN" 
          glowColor="red"
          headerExtra={
            <div className="flex items-center space-x-2 text-[9px] font-mono bg-space-black border border-slate-800 rounded-sm p-0.5">
              <span className="text-slate-500 px-1">CONTRAST:</span>
              <button 
                onClick={() => setThermalContrast('normal')}
                className={`px-1.5 py-0.5 rounded-sm ${thermalContrast === 'normal' ? 'bg-space-orange/10 text-space-orange' : 'text-slate-500'}`}
              >
                NORMAL
              </button>
              <button 
                onClick={() => setThermalContrast('high')}
                className={`px-1.5 py-0.5 rounded-sm ${thermalContrast === 'high' ? 'bg-space-orange/10 text-space-orange' : 'text-slate-500'}`}
              >
                HIGH
              </button>
            </div>
          }
          className="lg:col-span-2 flex flex-col md:flex-row gap-6"
        >
          {/* Simulated 8x8 IR Thermal grid visualization */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center space-x-1">
              <ZoomIn className="w-3.5 h-3.5 text-space-orange" />
              <span>8x8 Swath IR Matrix Projection</span>
            </div>
            
            <div className="grid grid-cols-8 gap-0.5 bg-slate-950 p-1.5 border border-slate-800 rounded-sm w-[260px] h-[260px]">
              {thermalPixels.map((row, rIdx) => 
                row.map((kVal, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-full h-full text-[8px] font-mono flex items-center justify-center transition-all duration-300 ${getThermalColor(kVal)}`}
                    title={`Temp: ${kVal} K`}
                  >
                    {kVal}
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-3 text-[9px] font-mono mt-3 text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-space-red rounded-sm" />
                <span>&gt;340 K</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-space-orange rounded-sm" />
                <span>320-340 K</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-yellow-600 rounded-sm" />
                <span>305-320 K</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-[#0F172A] border border-slate-800 rounded-sm" />
                <span>Ambient (&lt;305 K)</span>
              </span>
            </div>
          </div>

          {/* Telemetry Detail sidebar */}
          <div className="w-full md:w-[240px] flex flex-col justify-between font-mono text-[10.5px] border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-5 space-y-4">
            
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">SCAN ANOMALY INDEX</div>
              <div className="p-2 border border-slate-900 bg-space-black/50 rounded-sm space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>FRP VALUE:</span>
                  <span className="text-white font-bold">{selectedFire.frp} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>CONFIDENCE:</span>
                  <span className="text-space-cyan font-bold">{selectedFire.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>MAX KELVIN:</span>
                  <span className="text-space-red font-bold">{selectedFire.temp} K</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">AEROSOL LINKAGE</div>
              <div className="p-2 border border-slate-900 bg-space-black/50 rounded-sm space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>AEROSOL CO INDEX:</span>
                  <span className="text-slate-200">{selectedFire.aerosolCo} DU</span>
                </div>
                <div className="flex justify-between">
                  <span>SMOKE DISPERSION:</span>
                  <span className="text-emerald-400 font-bold">W-NW VECTOR</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">COORDINATES</div>
              <div className="p-2 border border-slate-900 bg-space-black/50 rounded-sm space-y-1 text-slate-400">
                <div className="flex items-center space-x-1 text-white">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="text-[9.5px]">{selectedFire.coords}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500 text-[9px]">
                  <Compass className="w-3 h-3" />
                  <span>BEARING: 312.4°</span>
                </div>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>

      {/* Safety Briefing */}
      <GlassCard title="Fire Threat Analysis Briefing" subtitle="ISRO MISSION CONTROL PROTOCOL" glowColor="none">
        <div className="flex items-start space-x-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-space-orange flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The fire detection suite monitors mid-wave infrared channels (3.9µm) to spot sub-pixel hotspots and estimates their Fire Radiative Power (FRP), which is proportional to the biomass combustion rate. An automated alarm triggers if confidence exceeds 85%, alerting local forest management and mapping smoke plume dispersion directions.
          </p>
        </div>
      </GlassCard>

    </div>
  );
};
