import React, { useState } from 'react';
import { 
  Globe, 
  AlertTriangle, 
  Radio, 
  Zap, 
  MapPin 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { MapPlaceholder } from '../components/MapPlaceholder';

export const Dashboard: React.FC = () => {
  const [selectedOrbit, setSelectedOrbit] = useState<number>(10235);
  const [activeAlertFilter, setActiveAlertFilter] = useState<'all' | 'high'>('all');

  const stats = [
    { name: "ACTIVE SATELLITES", value: 3, decimals: 0, suffix: " UNITS", icon: Globe, color: "cyan" as const },
    { name: "SENSOR GRID FEEDS", value: 12, decimals: 0, suffix: " CHANNELS", icon: Radio, color: "cyan" as const },
    { name: "THERMAL ALERTS", value: 24, decimals: 0, suffix: " CRITICAL", icon: AlertTriangle, color: "orange" as const },
    { name: "ORBITAL LATENCY", value: 0.45, decimals: 2, suffix: " ms", icon: Zap, color: "cyan" as const },
  ];

  const recentAlerts = [
    { id: 1, loc: "Gharghoda, CG", type: "Thermal Hotspot", severity: "HIGH", val: "354 K", time: "12m ago" },
    { id: 2, loc: "Mundra, GJ", type: "SO2 Plume Anomaly", severity: "HIGH", val: "0.85 DU", time: "34m ago" },
    { id: 3, loc: "Delhi NCR", type: "Aerosol Index Peak", severity: "WARN", val: "3.4 AI", time: "1h ago" },
    { id: 4, loc: "Singrauli, MP", type: "NO2 Column Concentration", severity: "WARN", val: "18.5 mmol/m²", time: "2h ago" },
  ];

  const orbits = [
    { num: 10234, time: "09:42 UTC", satellite: "SENTINEL-5P", area: "NW India Region", status: "COMPLETED" },
    { num: 10235, time: "14:10 UTC", satellite: "INSAT-3DR", area: "Central Plains", status: "SCANNING" },
    { num: 10236, time: "18:30 UTC", satellite: "GSAT-18", area: "Eastern Peninsula", status: "SCHEDULED" },
    { num: 10237, time: "23:15 UTC", satellite: "SENTINEL-5P", area: "Southern Swath", status: "SCHEDULED" },
  ];

  const filteredAlerts = activeAlertFilter === 'high' 
    ? recentAlerts.filter(a => a.severity === 'HIGH') 
    : recentAlerts;

  return (
    <div className="space-y-6">
      
      {/* Hero Header Section */}
      <GlassCard glowColor="cyan" showCorners={true} className="relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.4)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-space-cyan tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-space-cyan animate-pulse" />
              <span>ISRO-INSA-LINK FEED ACTIVE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-orbitron uppercase text-slate-100 tracking-wider">
              ATMOSPHERIC MISSION CONTROL
            </h2>
            <p className="text-xs text-slate-400 font-inter max-w-xl">
              Continuous polar swath and geostationary scanning for multispectral aerosol analysis, formaldehyde detection, and thermal hotspot classification.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-start gap-4 text-xs font-mono">
            <div className="bg-[#050A15] border border-space-cyan/20 px-3 py-1.5 rounded-sm">
              <div className="text-slate-500 text-[9px]">SATELLITE SYNC STATUS</div>
              <div className="text-emerald-400 font-bold uppercase flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SYNC NOMINAL</span>
              </div>
            </div>
            
            <div className="bg-[#050A15] border border-space-orange/20 px-3 py-1.5 rounded-sm">
              <div className="text-slate-500 text-[9px]">GRID COVERAGE</div>
              <div className="text-space-orange font-bold uppercase mt-0.5">
                SWATH IND-08 ACTIVE
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Grid Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={idx} glowColor={stat.color} className="flex items-center space-x-4">
              <div className={`p-3 rounded-sm border ${
                stat.color === 'orange' ? 'border-space-orange/30 bg-space-orange/5 text-space-orange' : 'border-space-cyan/30 bg-space-cyan/5 text-space-cyan'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-mono tracking-wider">{stat.name}</div>
                <div className="text-lg font-black font-orbitron text-white mt-0.5">
                  <AnimatedCounter 
                    value={stat.value} 
                    decimals={stat.decimals}
                    suffix={stat.suffix} 
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Map, Telemetry Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Map Placeholder Component (Takes 2 cols) */}
        <div className="lg:col-span-2 flex flex-col">
          <MapPlaceholder 
            title="Real-Time Swath Coverage & Air Quality Hotspots" 
            className="flex-1 rounded-sm h-[480px]" 
          />
        </div>

        {/* Right Telemetry Config & Alarm Feeds Panel */}
        <div className="space-y-6 flex flex-col">
          
          {/* Active Sensor Channels */}
          <GlassCard title="Spectral Sensor Deck" subtitle="ACTIVE CHANNELS" glowColor="cyan" className="flex-1">
            <div className="space-y-3 font-mono text-[11px] mt-1">
              
              <div className="flex items-center justify-between p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-space-cyan" />
                  <span className="text-slate-300">SWIR-2.3µm (Aerosol)</span>
                </div>
                <span className="text-emerald-400 font-bold">100% OK</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-space-cyan" />
                  <span className="text-slate-300">TIR-10.8µm (Thermal)</span>
                </div>
                <span className="text-emerald-400 font-bold">100% OK</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-space-cyan" />
                  <span className="text-slate-300">UV-340nm (Formaldehyde)</span>
                </div>
                <span className="text-emerald-400 font-bold">100% OK</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-space-cyan" />
                  <span className="text-slate-300">NIR-760nm (Cloud Mask)</span>
                </div>
                <span className="text-emerald-400 font-bold">100% OK</span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>ORBITAL SYNC BUFFER</span>
                  <span>99.8%</span>
                </div>
                <div className="w-full bg-[#050A15] border border-slate-800 rounded-sm h-1.5 overflow-hidden">
                  <div className="bg-space-cyan h-full w-[99.8%]" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Alarm Feeds */}
          <GlassCard 
            title="Real-Time Event Alarms" 
            subtitle="DETECTIONS UNDER SWATH" 
            glowColor="orange"
            headerExtra={
              <div className="flex bg-[#050A15] border border-slate-800 rounded-sm p-0.5 text-[9px] font-mono">
                <button 
                  onClick={() => setActiveAlertFilter('all')}
                  className={`px-1.5 py-0.5 rounded-sm ${activeAlertFilter === 'all' ? 'bg-space-cyan/10 text-space-cyan' : 'text-slate-500'}`}
                >
                  ALL
                </button>
                <button 
                  onClick={() => setActiveAlertFilter('high')}
                  className={`px-1.5 py-0.5 rounded-sm ${activeAlertFilter === 'high' ? 'bg-space-orange/10 text-space-orange' : 'text-slate-500'}`}
                >
                  HIGH
                </button>
              </div>
            }
            className="flex-1"
          >
            <div className="space-y-2.5 font-mono text-[10px] max-h-[220px] overflow-y-auto pr-1 mt-1">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-2 border rounded-sm flex items-center justify-between ${
                    alert.severity === 'HIGH' 
                      ? 'border-space-red/20 bg-space-red/5' 
                      : 'border-space-orange/20 bg-space-orange/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${alert.severity === 'HIGH' ? 'bg-space-red' : 'bg-space-orange'}`} />
                      <span className="font-bold text-white">{alert.type}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" />
                      <span>{alert.loc}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${alert.severity === 'HIGH' ? 'text-space-red' : 'text-space-orange'}`}>
                      {alert.val}
                    </span>
                    <div className="text-[8px] text-slate-500">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>

      {/* Bottom Timeline Placeholder Section */}
      <GlassCard title="Orbital Path Tracking Timeline" subtitle="NEXT SATELLITE PASSES OVER INDIA SWATH" glowColor="cyan">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {orbits.map((orbit) => (
            <div
              key={orbit.num}
              onClick={() => setSelectedOrbit(orbit.num)}
              className={`p-3 border rounded-sm font-mono text-xs cursor-pointer transition-all ${
                selectedOrbit === orbit.num
                  ? 'border-space-cyan bg-space-cyan/5 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  : 'border-slate-800 bg-[#050A15] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5">
                <span className="text-[10px] text-slate-500">ORBIT #{orbit.num}</span>
                <span className={`text-[9px] font-bold px-1 py-0.5 rounded-sm ${
                  orbit.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400' :
                  orbit.status === 'SCANNING' ? 'bg-space-cyan/10 text-space-cyan animate-pulse' :
                  'bg-space-orange/10 text-space-orange'
                }`}>
                  {orbit.status}
                </span>
              </div>
              
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>TIME:</span>
                  <span className="text-white font-bold">{orbit.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>SAT:</span>
                  <span className="text-space-cyan font-bold">{orbit.satellite}</span>
                </div>
                <div className="flex justify-between">
                  <span>REGION:</span>
                  <span className="text-white truncate max-w-[120px]">{orbit.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};
