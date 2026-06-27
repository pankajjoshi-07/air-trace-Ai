import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Radio, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface TelemetryPoint {
  time: string;
  value: number;
  baseline: number;
}

export const LiveMonitoring: React.FC = () => {
  const [activeBand, setActiveBand] = useState<'uv' | 'swir' | 'tir' | 'nir'>('uv');
  const [dataStream, setDataStream] = useState<TelemetryPoint[]>([]);
  const [gridStatus, setGridStatus] = useState<'nominal' | 'scanning'>('nominal');

  // Simulated raw sensor telemetry feeds
  const bandConfigs = {
    uv: {
      name: 'Ultra-Violet (UV-340)',
      target: 'Formaldehyde (HCHO) / SO2',
      color: '#A855F7', // Purple
      min: 0.1,
      max: 0.9,
      unit: 'DU',
      status: 'RECEIVING Swath-05A',
    },
    swir: {
      name: 'Shortwave Infrared (SWIR-2.3)',
      target: 'CO Plumes / Aerosol Dust',
      color: '#00F0FF', // Cyan
      min: 0.2,
      max: 1.8,
      unit: 'AI',
      status: 'RECEIVING Swath-08',
    },
    tir: {
      name: 'Thermal Infrared (TIR-10.8)',
      target: 'Thermal Hotspots / Fires',
      color: '#EF4444', // Red
      min: 290,
      max: 360,
      unit: 'K',
      status: 'RECEIVING Geosync-3D',
    },
    nir: {
      name: 'Near Infrared (NIR-760)',
      target: 'AOT / Cloud Fraction',
      color: '#F97316', // Orange
      min: 0.05,
      max: 0.4,
      unit: 'Frac',
      status: 'RECEIVING Polar Orbit-2',
    }
  };

  // Generate initial mock data points
  const generateMockPoints = (band: keyof typeof bandConfigs) => {
    const config = bandConfigs[band];
    const points: TelemetryPoint[] = [];
    for (let i = 10; i >= 0; i--) {
      const date = new Date(Date.now() - i * 60000);
      const timeStr = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const val = config.min + Math.random() * (config.max - config.min);
      points.push({
        time: timeStr,
        value: Number(val.toFixed(3)),
        baseline: Number((config.min + (config.max - config.min) / 2).toFixed(3)),
      });
    }
    return points;
  };

  // Load initial data based on band selection
  useEffect(() => {
    setDataStream(generateMockPoints(activeBand));
  }, [activeBand]);

  // Periodic sensor ticker updates to make it feel "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setGridStatus('scanning');
      setTimeout(() => setGridStatus('nominal'), 800);

      setDataStream(prev => {
        const config = bandConfigs[activeBand];
        const nextTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const val = config.min + Math.random() * (config.max - config.min);
        const nextPoint: TelemetryPoint = {
          time: nextTime,
          value: Number(val.toFixed(3)),
          baseline: prev[0]?.baseline || 0,
        };
        // Keep last 10 points
        return [...prev.slice(1), nextPoint];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBand]);

  const activeConfig = bandConfigs[activeBand];
  const currentValue = dataStream[dataStream.length - 1]?.value || 0;

  return (
    <div className="space-y-6">
      
      {/* Upper Title HUD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-space-cyan/15 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-space-cyan animate-pulse" />
            <span>LIVE ORBITAL SPECTROMETRY</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            REAL-TIME HYPERSPECTRAL SCAN CHANNELS • SWATH GRID LATENCY: 0.45s
          </p>
        </div>

        {/* Live status ticker indicator */}
        <div className="flex items-center space-x-2 font-mono text-[10px] bg-space-black border border-slate-800 px-3 py-1.5 rounded-sm">
          <span>STREAM STATUS:</span>
          <span className={`font-bold flex items-center space-x-1 ${gridStatus === 'scanning' ? 'text-space-cyan' : 'text-emerald-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${gridStatus === 'scanning' ? 'animate-ping' : ''}`} />
            <span>{gridStatus === 'scanning' ? 'BUFF SWATH' : 'CONNECTED'}</span>
          </span>
        </div>
      </div>

      {/* Selectable Spectral Band row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(bandConfigs) as Array<keyof typeof bandConfigs>).map((key) => {
          const config = bandConfigs[key];
          const active = activeBand === key;
          return (
            <button
              key={key}
              onClick={() => setActiveBand(key)}
              className={`p-3 border rounded-sm font-mono text-left transition-all ${
                active 
                  ? 'border-space-cyan bg-space-cyan/5 shadow-[0_0_10px_rgba(0,240,255,0.08)]' 
                  : 'border-slate-800 bg-[#0F172A]/40 hover:border-slate-700'
              }`}
            >
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">
                BAND IDENTIFIER: {key.toUpperCase()}
              </div>
              <div className={`text-xs font-bold ${active ? 'text-space-cyan' : 'text-slate-200'}`}>
                {config.name}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 truncate">
                {config.target}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Graph & Current Reading Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hyperspectral Swath Area Chart */}
        <div className="lg:col-span-2 flex flex-col">
          <GlassCard 
            title="Real-Time Swath Telemetry Amplitude" 
            subtitle={`FEED REFERENCE: ${activeConfig.name.toUpperCase()}`}
            glowColor="cyan"
            className="flex-1 flex flex-col min-h-[360px]"
          >
            <div className="flex-1 min-h-[300px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dataStream}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    domain={['auto', 'auto']}
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
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={activeConfig.color} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Current Live Readings Console */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Main Reading Stat */}
          <GlassCard title="Console Telemetry Out" subtitle="LATEST PIXEL READING" glowColor="cyan" className="flex-1">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                TARGET POLLUTANT AMPLITUDE
              </div>
              
              <div className="text-4xl font-black font-orbitron text-white my-3 flex items-baseline">
                {currentValue > 0 ? (
                  <AnimatedCounter 
                    value={currentValue} 
                    decimals={3} 
                    duration={0.8}
                  />
                ) : (
                  <span>0.000</span>
                )}
                <span className="text-space-cyan font-mono text-sm ml-1.5">{activeConfig.unit}</span>
              </div>

              <div className="text-[10px] font-mono text-slate-400 border border-slate-800 bg-[#050A15]/80 px-3 py-1 rounded-sm uppercase mt-2">
                {activeConfig.status}
              </div>
            </div>
          </GlassCard>

          {/* Satellite Orbit Tracking details */}
          <GlassCard title="Ground Station Uplink" subtitle="IST-COM-SWATH" glowColor="cyan" className="flex-1">
            <div className="space-y-2.5 font-mono text-[10px] text-slate-400 mt-1">
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                <span>POLAR ASCENT SWATH:</span>
                <span className="text-white font-bold">GRID-IND-422</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                <span>ELEVATION ANGLE:</span>
                <span className="text-slate-200">54.21°</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                <span>DOPPLER SHIFT STABILITY:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 inline" />
                  <span>NOMINAL (+0.02 Hz)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>UPLINK SIGNAL GAIN:</span>
                <span className="text-space-cyan font-bold">42.8 dB</span>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
      
    </div>
  );
};
