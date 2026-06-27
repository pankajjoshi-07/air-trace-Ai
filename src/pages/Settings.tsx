import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Settings: React.FC = () => {
  const [activeSatellite, setActiveSatellite] = useState<'insat' | 'sentinel'>('insat');
  const [frequency, setFrequency] = useState('137.910 MHz');
  
  // API Toggles
  const [feeds, setFeeds] = useState({
    insatThermal: true,
    copernicusAerosol: true,
    groundCpcb: false,
    plumeAttribution: true,
  });

  // Coordinates
  const [bounds, setBounds] = useState({
    north: '37.0900',
    south: '8.4000',
    west: '68.7000',
    east: '97.2500',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleToggleFeed = (key: keyof typeof feeds) => {
    setFeeds(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCoordinateChange = (key: keyof typeof bounds, val: string) => {
    setBounds(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveSettings = () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus('idle');
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-space-cyan" />
          <span>STATION CONFIGURATION & TUNING</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          SATELLITE FREQUENCY TUNING • API TELEMETRY SOURCE ROUTING
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Frequency Tuner */}
        <GlassCard title="Satellite Transceiver Tuning" subtitle="FREQUENCY RECEIVER CONFIG" glowColor="cyan">
          <div className="space-y-4 mt-1 font-mono text-xs text-slate-300">
            
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">SELECT TARGET TRANCEIVER</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveSatellite('insat');
                    setFrequency('137.910 MHz');
                  }}
                  className={`py-2 border rounded-sm transition-all font-bold ${
                    activeSatellite === 'insat'
                      ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                      : 'border-slate-800 bg-[#050A15]/40 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  INSAT-3DR
                </button>
                <button
                  onClick={() => {
                    setActiveSatellite('sentinel');
                    setFrequency('401.585 MHz');
                  }}
                  className={`py-2 border rounded-sm transition-all font-bold ${
                    activeSatellite === 'sentinel'
                      ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                      : 'border-slate-800 bg-[#050A15]/40 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  SENTINEL-5P
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between">
                <span>TUNING FREQUENCY:</span>
                <span className="text-space-cyan font-bold">{frequency}</span>
              </div>
              <div className="flex justify-between">
                <span>UPLINK TRANSLATOR:</span>
                <span className="text-white font-bold">{activeSatellite === 'insat' ? 'ISRO UHF DEMOD' : 'ESA S-BAND TELE'}</span>
              </div>
              <div className="flex justify-between">
                <span>POLARIZATION:</span>
                <span className="text-slate-200">{activeSatellite === 'insat' ? 'RHCP (Right Hand)' : 'LHCP (Left Hand)'}</span>
              </div>
            </div>

          </div>
        </GlassCard>

        {/* API Feed Config */}
        <GlassCard title="Telemetry Feed Router" subtitle="ACTIVE API INGEST Toggles" glowColor="cyan">
          <div className="space-y-3 mt-1 font-mono text-xs text-slate-300">
            
            <div className="flex items-center justify-between p-2 bg-[#050A15]/50 border border-slate-900 rounded-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200">INSAT Thermal Stream</div>
                <div className="text-[9px] text-slate-500">Active anomalies & hotspots</div>
              </div>
              <button
                onClick={() => handleToggleFeed('insatThermal')}
                className={`w-10 h-5 border rounded-full relative transition-all ${
                  feeds.insatThermal ? 'border-space-cyan bg-space-cyan/10' : 'border-slate-850 bg-slate-950'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                  feeds.insatThermal ? 'bg-space-cyan left-[22px]' : 'bg-slate-600 left-[2px]'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#050A15]/50 border border-slate-900 rounded-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200">TROPOMI Aerosol Feed</div>
                <div className="text-[9px] text-slate-500">Sentinel-5P HCHO/SO2 swaths</div>
              </div>
              <button
                onClick={() => handleToggleFeed('copernicusAerosol')}
                className={`w-10 h-5 border rounded-full relative transition-all ${
                  feeds.copernicusAerosol ? 'border-space-cyan bg-space-cyan/10' : 'border-slate-850 bg-slate-950'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                  feeds.copernicusAerosol ? 'bg-space-cyan left-[22px]' : 'bg-slate-600 left-[2px]'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#050A15]/50 border border-slate-900 rounded-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200">Ground CPCB Node</div>
                <div className="text-[9px] text-slate-500">Cross-validation feeds</div>
              </div>
              <button
                onClick={() => handleToggleFeed('groundCpcb')}
                className={`w-10 h-5 border rounded-full relative transition-all ${
                  feeds.groundCpcb ? 'border-space-cyan bg-space-cyan/10' : 'border-slate-850 bg-slate-950'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                  feeds.groundCpcb ? 'bg-space-cyan left-[22px]' : 'bg-slate-600 left-[2px]'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#050A15]/50 border border-slate-900 rounded-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200">AI Trajectory Tracing</div>
                <div className="text-[9px] text-slate-500">Plume source prediction models</div>
              </div>
              <button
                onClick={() => handleToggleFeed('plumeAttribution')}
                className={`w-10 h-5 border rounded-full relative transition-all ${
                  feeds.plumeAttribution ? 'border-space-cyan bg-space-cyan/10' : 'border-slate-850 bg-slate-950'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                  feeds.plumeAttribution ? 'bg-space-cyan left-[22px]' : 'bg-slate-600 left-[2px]'
                }`} />
              </button>
            </div>

          </div>
        </GlassCard>

        {/* Boundary Coordinates Settings */}
        <GlassCard title="Bounding Grid Bounds" subtitle="STATION SCENE GEOGRAPHIC EXTENT" glowColor="cyan">
          <div className="space-y-3 mt-1 font-mono text-xs text-slate-300">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase">NORTH LIMIT</span>
                <input 
                  type="text" 
                  value={bounds.north} 
                  onChange={(e) => handleCoordinateChange('north', e.target.value)}
                  className="w-full bg-[#050A15] border border-slate-800 p-2 rounded-sm text-white focus:border-space-cyan outline-none text-xs" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase">SOUTH LIMIT</span>
                <input 
                  type="text" 
                  value={bounds.south} 
                  onChange={(e) => handleCoordinateChange('south', e.target.value)}
                  className="w-full bg-[#050A15] border border-slate-800 p-2 rounded-sm text-white focus:border-space-cyan outline-none text-xs" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase">WEST LIMIT</span>
                <input 
                  type="text" 
                  value={bounds.west} 
                  onChange={(e) => handleCoordinateChange('west', e.target.value)}
                  className="w-full bg-[#050A15] border border-slate-800 p-2 rounded-sm text-white focus:border-space-cyan outline-none text-xs" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase">EAST LIMIT</span>
                <input 
                  type="text" 
                  value={bounds.east} 
                  onChange={(e) => handleCoordinateChange('east', e.target.value)}
                  className="w-full bg-[#050A15] border border-slate-800 p-2 rounded-sm text-white focus:border-space-cyan outline-none text-xs" 
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full py-2.5 bg-space-cyan hover:bg-space-cyan/90 text-space-black font-orbitron font-extrabold tracking-wider text-xs rounded-sm transition-all hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>SAVING METADATA CONFIG...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 fill-current" />
                    <span>SAVE STATION CONFIG</span>
                  </>
                )}
              </button>
              
              {saveStatus === 'saved' && (
                <div className="text-center text-[10px] text-emerald-400 font-bold mt-2 uppercase animate-pulse">
                  ✓ configuration locked in storage registry
                </div>
              )}
            </div>

          </div>
        </GlassCard>

      </div>

    </div>
  );
};
