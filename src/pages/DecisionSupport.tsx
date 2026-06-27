import React, { useState } from 'react';
import { ShieldAlert, HeartPulse, CheckSquare } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface MitigationScenario {
  title: string;
  location: string;
  triggerLevel: string;
  healthIndex: { val: number; level: string; color: string };
  advisories: string[];
  recommendations: Array<{ text: string; done: boolean }>;
}

export const DecisionSupport: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'agriculture' | 'refinery' | 'urban'>('agriculture');

  const scenarios: Record<string, MitigationScenario> = {
    agriculture: {
      title: 'Biomass Burning (Punjab Belt)',
      location: 'Bathinda / Firozpur Grid Swath',
      triggerLevel: 'FRP > 150 MW & Aerosol Index > 3.0 AI',
      healthIndex: { val: 78, level: 'POOR (UNHEALTHY)', color: 'text-space-orange border-space-orange/30 bg-space-orange/5' },
      advisories: [
        'Recommend restriction of strenuous outdoor activities for children and elderly.',
        'Issue regional health advisories for high-concentration particulate pathways downwind.',
        'Ensure respiratory medical wards are stocked in downwind municipalities.'
      ],
      recommendations: [
        { text: 'Deploy boundary layer UAV telemetry to verify crop fire hotspot clusters.', done: true },
        { text: 'Broadcast SMS warning to farmers regarding active satellite detection grids.', done: true },
        { text: 'Correlate plume vectors with meteorological path charts.', done: false },
        { text: 'Issue health warnings to downwind districts (Sangrur, Patiala).', done: false }
      ]
    },
    refinery: {
      title: 'Petrochemical Refining Leak (Gujarat SEZ)',
      location: 'Mundra / Jamnagar Swath Grid',
      triggerLevel: 'SO2 Column Density > 0.8 DU',
      healthIndex: { val: 42, level: 'MODERATE', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' },
      advisories: [
        'Alert petrochemical safety coordinators in Mundra industrial belt.',
        'Continuous ambient monitoring for volatile organic compound (VOC) ratios.',
        'Standby protocol for chemical containment validation.'
      ],
      recommendations: [
        { text: 'Establish cross-instrument scan verification (Sentinel-5P vs Ground FTIR).', done: true },
        { text: 'Alert refinery environmental safety compliance directors.', done: true },
        { text: 'Simulate hydrocarbon plume trajectory backtrace matching.', done: true },
        { text: 'Activate regional chemical sensor array logs.', done: false }
      ]
    },
    urban: {
      title: 'Winter Inversion Smog (Delhi NCR)',
      location: 'National Capital Region Swath',
      triggerLevel: 'Particulate Density PM2.5 > 250 µg/m³',
      healthIndex: { val: 92, level: 'SEVERE (HAZARDOUS)', color: 'text-space-red border-space-red/30 bg-space-red/5' },
      advisories: [
        'Restrict industrial diesel generator operations in the urban grid.',
        'Issue advisory for complete shift to remote schooling/work where applicable.',
        'Deploy road-sweeping dust suppression vectors.'
      ],
      recommendations: [
        { text: 'Flag urban boundary layer height decay tracking (INSAT sounders).', done: true },
        { text: 'Enable emergency health advisory broadcasts across municipal networks.', done: true },
        { text: 'Enforce particulate scaleback on industrial stacks.', done: false },
        { text: 'Evaluate PM2.5/NO2 ratio shift indicating traffic contribution.', done: false }
      ]
    }
  };

  const activeScenario = scenarios[selectedScenario];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-space-cyan" />
          <span>MITIGATION DECISION SUPPORT PANEL</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          AUTOMATED DECISION SCENARIOS • REGIONAL HAZARD PROTOCOLS
        </p>
      </div>

      {/* Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(scenarios) as Array<'agriculture' | 'refinery' | 'urban'>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedScenario(key)}
            className={`p-3 border rounded-sm font-mono text-left transition-all text-xs ${
              selectedScenario === key
                ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                : 'border-slate-800 bg-[#0F172A]/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[9px] text-slate-500 font-bold mb-1">PROTOCOL PROFILE</div>
            <div className="font-bold text-slate-200">{scenarios[key].title}</div>
            <div className="text-[9px] text-slate-400 mt-1 truncate">{scenarios[key].location}</div>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Advisory & Severity gauge */}
        <div className="space-y-6 flex flex-col">
          
          <GlassCard title="Health Advisory Index" subtitle="REGIONAL EXPOSURE RISK" glowColor="cyan">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <HeartPulse className="w-10 h-10 text-space-red animate-pulse mb-2" />
              
              <div className="text-sm font-mono text-slate-400">INDEX SCORE</div>
              <div className="text-3xl font-black font-orbitron text-white my-2">{activeScenario.healthIndex.val} / 100</div>
              
              <div className={`px-3 py-1 text-[10px] font-mono font-bold rounded-sm border uppercase mt-1 ${activeScenario.healthIndex.color}`}>
                {activeScenario.healthIndex.level}
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Active Incident Details" subtitle="PROTOCOL TRIGGER SETTINGS" glowColor="cyan" className="flex-1">
            <div className="space-y-2.5 font-mono text-[10.5px] text-slate-400 mt-1">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>SCENARIO:</span>
                <span className="text-white font-bold">{activeScenario.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>SECTOR RANGE:</span>
                <span className="text-slate-200">{activeScenario.location}</span>
              </div>
              <div className="flex justify-between">
                <span>TRIGGER POINT:</span>
                <span className="text-space-orange font-bold text-[9.5px]">{activeScenario.triggerLevel}</span>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Recommended Action Checklist */}
        <GlassCard 
          title="Recommended Mitigation Checklist" 
          subtitle="AUTOMATED TASK COMPLIANCE LOG"
          glowColor="cyan"
          className="lg:col-span-2"
        >
          <div className="space-y-3 mt-1">
            <div className="space-y-2 font-mono text-[11px]">
              {activeScenario.recommendations.map((rec, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 border rounded-sm flex items-center justify-between ${
                    rec.done 
                      ? 'border-emerald-500/20 bg-emerald-950/10 text-slate-300' 
                      : 'border-slate-800 bg-space-black/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckSquare className={`w-4 h-4 flex-shrink-0 ${rec.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="leading-tight">{rec.text}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                    rec.done ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {rec.done ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900">
              <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase font-orbitron tracking-wider">
                REGIONAL MEDICAL ADVISORIES
              </div>
              <div className="space-y-1.5 font-mono text-[10px] text-slate-400">
                {activeScenario.advisories.map((adv, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-space-orange mt-0.5">•</span>
                    <span className="leading-normal">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
