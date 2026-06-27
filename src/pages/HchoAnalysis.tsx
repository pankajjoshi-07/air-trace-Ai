import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Atom, ShieldAlert, Thermometer, Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const HchoAnalysis: React.FC = () => {
  const [selectedPathway, setSelectedPathway] = useState<'methane' | 'isoprene' | 'industrial'>('methane');

  const regionalData = [
    { name: 'Indo-Gangetic', current: 0.72, baseline: 0.35, threshold: 0.5 },
    { name: 'Western Ghats', current: 0.21, baseline: 0.18, threshold: 0.5 },
    { name: 'Singrauli Ind.', current: 0.95, baseline: 0.42, threshold: 0.5 },
    { name: 'Delhi NCR', current: 0.88, baseline: 0.38, threshold: 0.5 },
    { name: 'Bengaluru Met', current: 0.45, baseline: 0.30, threshold: 0.5 },
  ];

  const reactionPathways = {
    methane: {
      name: 'Methane Photolysis (CH4)',
      equation: 'CH4 + OH + O2 → CH3O2 + H2O → ... → HCHO',
      description: 'Slow background photolysis pathway occurring globally in the troposphere. Responsible for the baseline formaldehyde concentrations in remote oceanic and clean air regions.',
      rate: '1.2 × 10^-5 molecules/cm³/s',
      alertLevel: 'NOMINAL',
      color: 'text-space-cyan border-space-cyan/20'
    },
    isoprene: {
      name: 'Biogenic Isoprene Oxidation',
      equation: 'C5H8 + OH + O2 → Isoprene Hydroperoxides → HCHO + MVK',
      description: 'Oxidation of volatile organic compounds (VOCs) emitted by vegetation. Particularly intense over tropical forests, deciduous woodlands, and agricultural areas during peak photosynthesis hours.',
      rate: '4.8 × 10^-4 molecules/cm³/s',
      alertLevel: 'MODERATE',
      color: 'text-space-orange border-space-orange/20'
    },
    industrial: {
      name: 'Anthropogenic Hydrocarbon Combustion',
      equation: 'CxHy + O2 (Combustion / Pyrolysis) → HCHO + CO + CO2',
      description: 'Direct emission and rapid chemical formation from vehicle exhaust, oil refineries, chemical plants, and coal-fired power stations. Frequently spikes in urban centers and manufacturing clusters.',
      rate: '9.5 × 10^-3 molecules/cm³/s',
      alertLevel: 'HIGH ALERT',
      color: 'text-space-red border-space-red/20'
    }
  };

  const activeReaction = reactionPathways[selectedPathway];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <Atom className="w-5 h-5 text-space-cyan" />
          <span>FORMALDEHYDE (HCHO) COLUMN ANALYSIS</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          TROPOMI SATELLITE COLUMN DENSITY CONCENTRATION DATA
        </p>
      </div>

      {/* Overview Cards & Reaction Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chemical Pathway Selector (Interactive) */}
        <GlassCard 
          title="Reaction Pathway Telemetry" 
          subtitle="ATMOSPHERIC SOURCE CHANNELS"
          glowColor="cyan"
          className="lg:col-span-1"
        >
          <div className="space-y-3 mt-1">
            <p className="text-[11px] text-slate-400 font-inter">
              Select an atmospheric pathway to evaluate chemical transformation rates and equations tracked by the satellite sensors:
            </p>
            
            <div className="space-y-2">
              {(Object.keys(reactionPathways) as Array<keyof typeof reactionPathways>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedPathway(key)}
                  className={`w-full p-2.5 border rounded-sm font-mono text-left transition-all text-[11px] flex justify-between items-center ${
                    selectedPathway === key
                      ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                      : 'border-slate-800 bg-[#050A15]/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{reactionPathways[key].name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-space-black border border-slate-800 rounded-sm">
                    {reactionPathways[key].alertLevel}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Reaction Detail display */}
            <div className="p-3 border border-slate-800/80 bg-space-black/60 rounded-sm space-y-2 mt-4 font-mono text-[10px]">
              <div className="text-white font-bold text-[11px] border-b border-slate-900 pb-1">
                {activeReaction.name}
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">EQUATION:</div>
                <div className="text-space-cyan text-[10.5px] leading-tight select-all">{activeReaction.equation}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">FORMATION RATE:</div>
                <div className="text-white font-semibold">{activeReaction.rate}</div>
              </div>
              <p className="text-slate-400 font-inter text-[10.5px] leading-relaxed pt-1.5 border-t border-slate-900">
                {activeReaction.description}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Regional Concentration comparative chart */}
        <GlassCard 
          title="Regional HCHO Column Densities" 
          subtitle="SATELLITE COMPARED SWATH VALUES vs HISTORICAL BASELINE"
          glowColor="cyan"
          className="lg:col-span-2"
        >
          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionalData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  label={{ value: '10¹⁵ molec/cm²', angle: -90, position: 'insideLeft', fontSize: 9, fill: 'rgba(255,255,255,0.4)', offset: 10 }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderColor: 'rgba(0, 240, 255, 0.2)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', marginTop: 10 }} 
                />
                <Bar dataKey="current" name="Current Concentration" fill="#00F0FF" radius={[2, 2, 0, 0]} />
                <Bar dataKey="baseline" name="Historical Baseline" fill="#3B82F6" opacity={0.5} radius={[2, 2, 0, 0]} />
                <Bar dataKey="threshold" name="Safety Threshold" fill="#EF4444" opacity={0.3} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Warning Protocols & Mitigations */}
      <GlassCard title="HCHO Atmospheric Risk protocol" subtitle="ISRO SAFETY STANDARDS" glowColor="orange">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 border border-slate-900 bg-space-black/50 rounded-sm space-y-1">
            <div className="text-space-cyan font-bold flex items-center space-x-1">
              <Info className="w-3.5 h-3.5" />
              <span>COPERNICUS BAND 3/4</span>
            </div>
            <p className="text-slate-400 font-inter text-[10.5px] leading-relaxed">
              Column density scans are calibrated daily using Sentinel-5P overpasses, filtered against a cloud cover fraction threshold of &lt;0.2.
            </p>
          </div>
          <div className="p-3 border border-slate-900 bg-space-black/50 rounded-sm space-y-1">
            <div className="text-space-orange font-bold flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>PHOTOCHEMICAL RATIO</span>
            </div>
            <p className="text-slate-400 font-inter text-[10.5px] leading-relaxed">
              Formaldehyde acts as a proxy for volatile organic reactivity. Ratios above 0.8 DU suggest volatile-limited ozone generation regimes.
            </p>
          </div>
          <div className="p-3 border border-slate-900 bg-space-black/50 rounded-sm space-y-1">
            <div className="text-space-red font-bold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-space-red animate-pulse" />
              <span>TRIGGER PROTOCOLS</span>
            </div>
            <p className="text-slate-400 font-inter text-[10.5px] leading-relaxed">
              Exceeding 1.0 × 10¹⁶ molecules/cm² automatically flags regional warning status, triggering secondary plume trajectory sweeps.
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
