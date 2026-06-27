import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Navigation } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const WindAnalysis: React.FC = () => {
  const [heightLevel, setHeightLevel] = useState<'surface' | '850hpa' | '500hpa' | '200hpa'>('850hpa');
  
  const windLevels = {
    surface: {
      name: 'Surface Layer (10m)',
      height: '10 Meters',
      speed: '12.4 km/h',
      direction: '240° (WSW)',
      temp: '32.1 °C',
      description: 'Influences local pollutants, industrial plumes, and urban canopy effects. Major driver of particulate matter concentrations at breathing level.',
      data: [
        { time: '00:00', speed: 8 },
        { time: '04:00', speed: 6 },
        { time: '08:00', speed: 10 },
        { time: '12:00', speed: 14 },
        { time: '16:00', speed: 15 },
        { time: '20:00', speed: 11 },
      ]
    },
    '850hpa': {
      name: 'Planetary Boundary Layer (850 hPa)',
      height: '1.5 Kilometers',
      speed: '34.8 km/h',
      direction: '295° (WNW)',
      temp: '18.4 °C',
      description: 'Key altitude for long-range transport of crop fires smoke and industrial plumes. Carries emissions across state borders.',
      data: [
        { time: '00:00', speed: 28 },
        { time: '04:00', speed: 30 },
        { time: '08:00', speed: 35 },
        { time: '12:00', speed: 38 },
        { time: '16:00', speed: 36 },
        { time: '20:00', speed: 32 },
      ]
    },
    '500hpa': {
      name: 'Mid-Troposphere (500 hPa)',
      height: '5.5 Kilometers',
      speed: '65.2 km/h',
      direction: '280° (W)',
      temp: '-12.5 °C',
      description: 'Governed by synoptic weather systems and large-scale atmospheric currents. Shows trans-continental aerosol transport vectors.',
      data: [
        { time: '00:00', speed: 55 },
        { time: '04:00', speed: 60 },
        { time: '08:00', speed: 68 },
        { time: '12:00', speed: 72 },
        { time: '16:00', speed: 65 },
        { time: '20:00', speed: 58 },
      ]
    },
    '200hpa': {
      name: 'Upper Troposphere / Jet Stream (200 hPa)',
      height: '12 Kilometers',
      speed: '142.5 km/h',
      direction: '275° (W)',
      temp: '-52.8 °C',
      description: 'Controlled by the subtropical jet stream. Disperses volcanic ash and high-altitude ozone inputs across the hemisphere.',
      data: [
        { time: '00:00', speed: 130 },
        { time: '04:00', speed: 145 },
        { time: '08:00', speed: 152 },
        { time: '12:00', speed: 138 },
        { time: '16:00', speed: 140 },
        { time: '20:00', speed: 148 },
      ]
    }
  };

  const activeLevel = windLevels[heightLevel];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <Wind className="w-5 h-5 text-space-cyan" />
          <span>ATMOSPHERIC TRANSPORT & WIND VECTOR STACK</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          POLAR WEATHER MODEL SIMULATION • PLUME TRAJECTORY FLUX FEEDS
        </p>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(windLevels) as Array<keyof typeof windLevels>).map((key) => (
          <button
            key={key}
            onClick={() => setHeightLevel(key)}
            className={`p-3 border rounded-sm font-mono text-left transition-all ${
              heightLevel === key
                ? 'border-space-cyan bg-space-cyan/5 shadow-[0_0_10px_rgba(0,240,255,0.08)]'
                : 'border-slate-800 bg-[#0F172A]/40 hover:border-slate-700'
            }`}
          >
            <div className="text-[9px] text-slate-500 font-bold mb-1">HEIGHT PROFILE</div>
            <div className={`text-xs font-bold ${heightLevel === key ? 'text-space-cyan' : 'text-slate-200'}`}>
              {key.toUpperCase()}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">{windLevels[key].name.split(' (')[0]}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wind Speed Trend Chart */}
        <div className="lg:col-span-2 flex flex-col">
          <GlassCard 
            title="Wind Speed Amplitude Over 24h" 
            subtitle={`ALTITUDE LEVEL: ${activeLevel.height.toUpperCase()}`}
            glowColor="cyan"
            className="flex-1 flex flex-col min-h-[320px]"
          >
            <div className="flex-1 min-h-[250px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeLevel.data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fontSize: 9, fill: 'rgba(255,255,255,0.4)', offset: 10 }}
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
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#00F0FF" 
                    strokeWidth={2.5}
                    dot={{ fill: '#050A15', stroke: '#00F0FF', strokeWidth: 1.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Telemetry Dials & Bearings */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Compass / Wind Direction Vector Panel */}
          <GlassCard title="Transport Vector Direction" subtitle="BEARING TELEMETRY" glowColor="cyan" className="flex-1">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              
              {/* Spinning compass reticle */}
              <div className="relative w-28 h-28 border border-dashed border-space-cyan/30 rounded-full flex items-center justify-center bg-[#050A15]/60 mb-3">
                <div className="absolute inset-2 border border-slate-900 rounded-full" />
                <div className="absolute text-[8px] font-mono text-slate-500 top-1">N</div>
                <div className="absolute text-[8px] font-mono text-slate-500 bottom-1">S</div>
                <div className="absolute text-[8px] font-mono text-slate-500 left-1">W</div>
                <div className="absolute text-[8px] font-mono text-slate-500 right-1">E</div>
                
                {/* Wind Arrow pointer rotated dynamically */}
                <div 
                  className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-500"
                  style={{ transform: `rotate(${activeLevel.direction.includes('WSW') ? 240 : activeLevel.direction.includes('WNW') ? 295 : 275}deg)` }}
                >
                  <Navigation className="w-5 h-5 text-space-cyan fill-space-cyan/20" />
                </div>
              </div>

              <div className="font-mono text-xs text-slate-300">
                DIRECTION: <span className="text-white font-bold">{activeLevel.direction}</span>
              </div>
              <div className="font-mono text-xs text-slate-300 mt-1">
                VELOCITY: <span className="text-space-cyan font-bold">{activeLevel.speed}</span>
              </div>
            </div>
          </GlassCard>

          {/* Level Details */}
          <GlassCard title="Level Properties" subtitle="GRID DATA" glowColor="cyan" className="flex-1">
            <div className="space-y-2 font-mono text-[10.5px] text-slate-400 mt-1">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>MEAN ALTITUDE:</span>
                <span className="text-white font-bold">{activeLevel.height}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>MEAN AMBIENT TEMP:</span>
                <span className="text-white font-bold">{activeLevel.temp}</span>
              </div>
              <p className="text-slate-400 font-inter text-[10.5px] leading-relaxed pt-1.5">
                {activeLevel.description}
              </p>
            </div>
          </GlassCard>

        </div>
      </div>

    </div>
  );
};
