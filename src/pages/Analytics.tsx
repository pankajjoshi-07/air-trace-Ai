import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  // Multi-pollutant datasets depending on the time range selection
  const datasets = {
    '30d': [
      { name: 'Week 1', aerosol: 1.2, carbon: 0.8, sulfur: 0.4 },
      { name: 'Week 2', aerosol: 1.5, carbon: 0.9, sulfur: 0.5 },
      { name: 'Week 3', aerosol: 1.8, carbon: 1.2, sulfur: 0.7 },
      { name: 'Week 4', aerosol: 1.4, carbon: 0.7, sulfur: 0.3 },
    ],
    '90d': [
      { name: 'Month 1', aerosol: 1.3, carbon: 0.9, sulfur: 0.45 },
      { name: 'Month 2', aerosol: 1.6, carbon: 1.1, sulfur: 0.60 },
      { name: 'Month 3', aerosol: 1.2, carbon: 0.7, sulfur: 0.35 },
    ],
    '1y': [
      { name: 'Jan-Mar', aerosol: 1.1, carbon: 0.8, sulfur: 0.40 },
      { name: 'Apr-Jun', aerosol: 1.7, carbon: 1.3, sulfur: 0.75 },
      { name: 'Jul-Sep', aerosol: 1.0, carbon: 0.6, sulfur: 0.30 },
      { name: 'Oct-Dec', aerosol: 1.9, carbon: 1.4, sulfur: 0.85 },
    ]
  };

  const activeData = datasets[timeRange];

  const validationStats = [
    { source: 'INSAT-3DR (MIR)', target: 'Sentinel-5P TROPOMI', correlation: 0.942, status: 'HIGH CORRELATION', color: 'text-emerald-400' },
    { source: 'Ground CPCB Station', target: 'Sentinel-5P TROPOMI', correlation: 0.885, status: 'VALIDATED', color: 'text-emerald-400' },
    { source: 'INSAT-3D (Thermal)', target: 'Ground Fire Grids', correlation: 0.918, status: 'HIGH CORRELATION', color: 'text-emerald-400' },
    { source: 'AOT (MODIS)', target: 'Aerosol Index (S5P)', correlation: 0.854, status: 'VALIDATED', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-space-cyan" />
            <span>HISTORICAL ATMOSPHERIC ANALYTICS</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            MULTI-SPECTRAL CORRELATION OVER TIME & CROSS-SATELLITE VAL
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex bg-[#0F172A] border border-slate-800 rounded-sm p-0.5 text-xs font-mono">
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-sm transition-all ${timeRange === '30d' ? 'bg-space-cyan/10 text-space-cyan font-bold' : 'text-slate-400'}`}
          >
            30 DAYS
          </button>
          <button 
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 rounded-sm transition-all ${timeRange === '90d' ? 'bg-space-cyan/10 text-space-cyan font-bold' : 'text-slate-400'}`}
          >
            90 DAYS
          </button>
          <button 
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1 rounded-sm transition-all ${timeRange === '1y' ? 'bg-space-cyan/10 text-space-cyan font-bold' : 'text-slate-400'}`}
          >
            1 YEAR
          </button>
        </div>
      </div>

      {/* Multi-pollutant overlaid Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composed Chart */}
        <div className="lg:col-span-2 flex flex-col">
          <GlassCard 
            title="Multi-Pollutant Historical Trends" 
            subtitle={`CHART TIMEFRAME: ${timeRange === '30d' ? 'L30D WEEKLY' : timeRange === '90d' ? 'L90D MONTHLY' : '12M QUARTERLY'}`}
            glowColor="cyan"
            className="flex-1 flex flex-col min-h-[360px]"
          >
            <div className="flex-1 min-h-[300px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={activeData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', marginTop: 10 }} />
                  <Bar dataKey="aerosol" name="Aerosol Density (AI)" fill="#3B82F6" radius={[2, 2, 0, 0]} opacity={0.7} />
                  <Line type="monotone" dataKey="carbon" name="Carbon Monoxide (DU)" stroke="#F97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="sulfur" name="Sulfur Dioxide (DU)" stroke="#EF4444" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Cross Validation Metrics */}
        <div className="flex flex-col space-y-6">
          <GlassCard title="Satellite Cross-Validation" subtitle="INSTRUMENT CALIBRATION MATRIX" glowColor="cyan" className="flex-1">
            <div className="space-y-3 font-mono text-[10.5px] mt-1">
              <p className="text-[11px] font-inter text-slate-400">
                Daily comparison coefficients between orbital sensors and ground telemetry networks to detect sensor drift:
              </p>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {validationStats.map((stat, idx) => (
                  <div key={idx} className="p-2 border border-slate-900 bg-space-black/50 rounded-sm space-y-1">
                    <div className="text-white font-semibold truncate">
                      {stat.source} ↔ {stat.target}
                    </div>
                    <div className="flex justify-between text-[9.5px]">
                      <span className="text-slate-500">CORRELATION R:</span>
                      <span className="text-space-cyan font-bold">{(stat.correlation).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between text-[9.5px]">
                      <span className="text-slate-500">STATUS:</span>
                      <span className={`${stat.color} font-bold flex items-center space-x-1`}>
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>{stat.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
