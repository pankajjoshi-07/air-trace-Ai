import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Fingerprint, Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface SourceEvent {
  id: string;
  name: string;
  sourceType: string;
  confidence: number;
  location: string;
  distance: string;
  chemicalFingerprint: Array<{ subject: string; value: number; fullMark: number }>;
  timeline: Array<{ time: string; coords: string; event: string }>;
}

export const AiSourceAttribution: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('EV-302');

  const events: Record<string, SourceEvent> = {
    'EV-302': {
      id: 'EV-302',
      name: 'Mundra Refinery Plume Anomaly',
      sourceType: 'Petrochemical Refining Core',
      confidence: 96.4,
      location: 'Mundra SEZ Cluster, GJ',
      distance: '14.2 km upwind',
      chemicalFingerprint: [
        { subject: 'SO2', value: 85, fullMark: 100 },
        { subject: 'NO2', value: 65, fullMark: 100 },
        { subject: 'CO', value: 50, fullMark: 100 },
        { subject: 'HCHO', value: 40, fullMark: 100 },
        { subject: 'Aerosol', value: 30, fullMark: 100 },
      ],
      timeline: [
        { time: 'T-00:00 (Scan)', coords: '22.8421° N, 69.7210° E', event: 'Satellite plume lock' },
        { time: 'T-01:30 (Back)', coords: '22.8120° N, 69.7540° E', event: 'Boundary layer tracking' },
        { time: 'T-03:00 (Back)', coords: '22.7840° N, 69.7820° E', event: 'Point Source Attribution: Refineries' },
      ]
    },
    'EV-314': {
      id: 'EV-314',
      name: 'Singrauli Thermal Vent Plume',
      sourceType: 'Coal-Fired Combustion',
      confidence: 94.1,
      location: 'Singrauli Super Thermal, MP',
      distance: '6.8 km upwind',
      chemicalFingerprint: [
        { subject: 'SO2', value: 60, fullMark: 100 },
        { subject: 'NO2', value: 92, fullMark: 100 },
        { subject: 'CO', value: 80, fullMark: 100 },
        { subject: 'HCHO', value: 15, fullMark: 100 },
        { subject: 'Aerosol', value: 75, fullMark: 100 },
      ],
      timeline: [
        { time: 'T-00:00 (Scan)', coords: '24.1120° N, 82.6840° E', event: 'Sentinel NO2 column alert' },
        { time: 'T-00:45 (Back)', coords: '24.0950° N, 82.6710° E', event: 'Wind plume vector alignment' },
        { time: 'T-01:30 (Back)', coords: '24.0810° N, 82.6620° E', event: 'Stack vent footprint match' },
      ]
    },
    'EV-325': {
      id: 'EV-325',
      name: 'Bathinda Crop Pyrolysis Plume',
      sourceType: 'Agricultural Biomass Burning',
      confidence: 89.7,
      location: 'Bathinda Rural Area, PB',
      distance: '25.4 km upwind',
      chemicalFingerprint: [
        { subject: 'SO2', value: 15, fullMark: 100 },
        { subject: 'NO2', value: 45, fullMark: 100 },
        { subject: 'CO', value: 95, fullMark: 100 },
        { subject: 'HCHO', value: 82, fullMark: 100 },
        { subject: 'Aerosol', value: 90, fullMark: 100 },
      ],
      timeline: [
        { time: 'T-00:00 (Scan)', coords: '30.1540° N, 74.8840° E', event: 'INSAT thermal hotspot overlap' },
        { time: 'T-02:00 (Back)', coords: '30.1120° N, 74.9120° E', event: 'Low boundary layer transport' },
        { time: 'T-04:00 (Back)', coords: '30.0820° N, 74.9450° E', event: 'Multiple crop fire clusters' },
      ]
    }
  };

  const activeEvent = events[selectedEventId];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <Fingerprint className="w-5 h-5 text-space-cyan" />
          <span>AI POLLUTANT SOURCE ATTRIBUTION</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          SPECTRAL FINGERPRINT MATCHING & BACK-TRAJECTORY WIND MODELLING
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Event Log Selector */}
        <div className="space-y-6 flex flex-col">
          
          <GlassCard title="Active Plume Events" subtitle="DETECTED ANOMALIES" glowColor="cyan">
            <div className="space-y-2 mt-1">
              {Object.keys(events).map((key) => {
                const ev = events[key];
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full p-2.5 border rounded-sm font-mono text-left transition-all text-xs ${
                      selectedEventId === ev.id
                        ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                        : 'border-slate-800 bg-[#050A15]/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-200">{ev.name}</div>
                    <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
                      <span>{ev.location}</span>
                      <span className="text-space-cyan font-bold">{ev.confidence}% MATCH</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Event Metadata Summary */}
          <GlassCard title="Attribution Telemetry" subtitle="FINGERPRINT COEFFICIENTS" glowColor="cyan" className="flex-1">
            <div className="space-y-2.5 font-mono text-[10.5px] text-slate-400 mt-1">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>EST. SOURCE:</span>
                <span className="text-white font-bold truncate max-w-[150px]">{activeEvent.sourceType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>SECTOR:</span>
                <span className="text-slate-200">{activeEvent.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>BACK-TRACE LENGTH:</span>
                <span className="text-space-cyan font-bold">{activeEvent.distance}</span>
              </div>
              <div className="flex justify-between">
                <span>ATTRIBUTION STATUS:</span>
                <span className="text-emerald-400 font-bold uppercase flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>RESOLVED</span>
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Chemical Fingerprint Radar Chart */}
        <GlassCard 
          title="Chemical Plume Fingerprint" 
          subtitle="SPECTRUM AMPLITUDE CORRELATION PATTERN"
          glowColor="cyan"
          className="lg:col-span-1"
        >
          <div className="h-[280px] w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeEvent.chemicalFingerprint}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }} />
                <Radar 
                  name={activeEvent.id} 
                  dataKey="value" 
                  stroke="#00F0FF" 
                  fill="#00F0FF" 
                  fillOpacity={0.2} 
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
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Back-Trajectory Tracking Map path steps */}
        <GlassCard 
          title="Back-Trajectory Vector path" 
          subtitle="METEOROLOGICAL MODEL TRACING STEPS"
          glowColor="cyan"
          className="lg:col-span-1"
        >
          <div className="space-y-4 font-mono text-[10.5px] mt-2">
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
              {activeEvent.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-4 pl-7">
                  {/* Bullet */}
                  <div className={`absolute left-1 w-4 h-4 rounded-full border border-space-cyan flex items-center justify-center z-10 ${
                    idx === 2 ? 'bg-space-cyan text-space-black' : 'bg-[#050A15] text-space-cyan'
                  }`}>
                    <span className="text-[8px] font-bold">{idx + 1}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">{step.time}</div>
                    <div className="text-[9px] text-slate-400">{step.coords}</div>
                    <div className="text-space-cyan/90 font-semibold">{step.event}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-inter leading-relaxed flex items-start space-x-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Back-trajectory models calculate air parcel vectors backward in time using simulated wind profiles to locate plume launch centroids.</span>
            </div>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
