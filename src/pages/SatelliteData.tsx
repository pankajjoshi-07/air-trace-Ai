import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, 
  Database, 
  Download, 
  CheckCircle2, 
  Layers, 
  Info, 
  Clock, 
  Compass,
  Activity,
  ShieldAlert,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Regional INSAT-3D dataset
const regionalAodData = [
  { region: 'Northern Plains', aod: 0.68, threshold: 0.4, status: 'Severe' },
  { region: 'Western Desert', aod: 0.42, threshold: 0.4, status: 'Moderate' },
  { region: 'Central Plateau', aod: 0.31, threshold: 0.4, status: 'Good' },
  { region: 'Southern Peninsula', aod: 0.22, threshold: 0.4, status: 'Good' },
  { region: 'Northeast Hills', aod: 0.18, threshold: 0.4, status: 'Good' },
];

// INSAT-3D Sounder atmospheric water vapor profile (TPW)
const waterVaporProfile = [
  { time: '00:00 IST', tpw: 38.4 },
  { time: '04:00 IST', tpw: 39.2 },
  { time: '08:00 IST', tpw: 41.5 },
  { time: '12:00 IST', tpw: 44.8 },
  { time: '16:00 IST', tpw: 43.1 },
  { time: '20:00 IST', tpw: 40.2 },
];

// Sentinel-5P TROPOMI NO2 Hotspot dataset (India Region)
const sentinelNo2Data = [
  { hotspot: 'Delhi NCR', no2: 18.2, limit: 10.0, status: 'Severe' },
  { hotspot: 'Singrauli Hub', no2: 24.5, limit: 10.0, status: 'Critical' },
  { hotspot: 'Mumbai Coast', no2: 12.1, limit: 10.0, status: 'Moderate' },
  { hotspot: 'Kolkata Delta', no2: 14.8, limit: 10.0, status: 'Unhealthy' },
  { hotspot: 'Ahmedabad Ind', no2: 16.2, limit: 10.0, status: 'Severe' },
];

// Sentinel-5P Trace Gas Column Daily Average Trend
const traceGasTrend = [
  { day: 'Mon', no2: 12.8, co: 210, hcho: 4.8 },
  { day: 'Tue', no2: 13.5, co: 224, hcho: 5.2 },
  { day: 'Wed', no2: 14.2, co: 235, hcho: 5.6 },
  { day: 'Thu', no2: 15.8, co: 240, hcho: 6.1 },
  { day: 'Fri', no2: 15.1, co: 228, hcho: 5.9 },
  { day: 'Sat', no2: 11.4, co: 198, hcho: 4.2 },
  { day: 'Sun', no2: 10.5, co: 185, hcho: 3.9 },
];

export const SatelliteData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insat' | 'sentinel'>('insat');
  
  // INSAT-3D page states
  const [insatLayer, setInsatLayer] = useState<'aerosol' | 'thermal' | 'clouds'>('aerosol');
  const [selectedInsatRegion, setSelectedInsatRegion] = useState<string>('Northern Plains');
  const [insatLogs, setInsatLogs] = useState<string[]>([]);
  const [isInsatQuerying, setIsInsatQuerying] = useState<boolean>(false);
  const [insatComplete, setInsatComplete] = useState<boolean>(false);
  const [insatZoom, setInsatZoom] = useState<number>(5);

  // Sentinel-5P page states
  const [sentinelLayer, setSentinelLayer] = useState<'no2' | 'co' | 'hcho'>('no2');
  const [selectedSentinelHotspot, setSelectedSentinelHotspot] = useState<string>('Singrauli Hub');
  const [sentinelLogs, setSentinelLogs] = useState<string[]>([]);
  const [isSentinelQuerying, setIsSentinelQuerying] = useState<boolean>(false);
  const [sentinelComplete, setSentinelComplete] = useState<boolean>(false);
  const [sentinelZoom, setSentinelZoom] = useState<number>(5);

  // Float visualizer variables
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setFloatOffset({
        x: Math.sin(Date.now() / 1500) * 8,
        y: Math.cos(Date.now() / 1800) * 6
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // MOSDAC API Simulation
  const runMosdacDownload = () => {
    if (isInsatQuerying) return;
    setIsInsatQuerying(true);
    setInsatComplete(false);
    setInsatLogs([]);

    const steps = [
      "> python mdapi.py --config config.json --query",
      "> Connecting to mosdac.gov.in/api/v1/download-gateway...",
      "> SSL Handshake verified with MOSDAC SSO Credentials.",
      "> Bounding Box filter: [Lat 6.0°N to 38.0°N] [Lon 68.0°E to 98.0°E]",
      "> Querying dataset: INSAT-3D_IMAGER_L3_PRODUCTS...",
      "> Match found: 1 scientific product file available.",
      "> Remote File: 3D_IMG_28JUN2026_0900_AOD_L3.h5 (Size: 48.2 MB)",
      "> Downloading HDF-5 dataset chunk stream...",
      "> progress: ██████░░░░░░░░░░░░░░ 30%",
      "> progress: ████████████░░░░░░░░ 60%",
      "> progress: ████████████████████ 100%",
      "> Decompressing HDF5 scientific layers locally...",
      "> Extraction OK: Aerosol Optical Depth (AOD) Layer successfully parsed.",
      "> Local grid cache refreshed. Render active."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setInsatLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsInsatQuerying(false);
          setInsatComplete(true);
        }
      }, (idx + 1) * 300);
    });
  };

  // Copernicus Data Space STAC API Simulation
  const runCopernicusDownload = () => {
    if (isSentinelQuerying) return;
    setIsSentinelQuerying(true);
    setSentinelComplete(false);
    setSentinelLogs([]);

    const steps = [
      "> python -m sentinelhub.catalog search --collection SENTINEL-5P",
      "> Requesting STAC Endpoint: catalogue.dataspace.copernicus.eu/stac/search...",
      "> Handshake established. Access Token approved.",
      "> Spatial parameters: BoundingBox [68.0, 6.0, 98.0, 38.0] (India)",
      "> Temporal query window: 2026-06-28T00:00:00Z to 23:59:59Z",
      "> Matching Sentinel-5P TROPOMI L2 Swaths...",
      "> Match found: S5P_OFFL_L2__NO2____20260628T093000.nc (NetCDF-4 format)",
      "> Initiating secure stream from CDSE S3 Bucket...",
      "> progress: ░░░░░░░░░░░░░░░░░░░░ 0%",
      "> progress: ████████░░░░░░░░░░░░ 40%",
      "> progress: ████████████████░░░░ 80%",
      "> progress: ████████████████████ 100%",
      "> Reading NetCDF dataset variables...",
      "> Extracted variable: NO2 tropospheric column density (mol/m²)",
      "> CDSE Sync success. India atmospheric chemistry grid loaded."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSentinelLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSentinelQuerying(false);
          setSentinelComplete(true);
        }
      }, (idx + 1) * 300);
    });
  };

  const currentInsatInfo = regionalAodData.find(r => r.region === selectedInsatRegion) || regionalAodData[0];
  const currentSentinelInfo = sentinelNo2Data.find(s => s.hotspot === selectedSentinelHotspot) || sentinelNo2Data[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Tab Switcher HUD Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-space-cyan/15 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold font-orbitron text-white tracking-widest flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-space-cyan animate-pulse" />
            SATELLITE DATA HUB (INDIA)
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase">
            Multi-mission orbital grids • ISRO & Copernicus Sentinel Link
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex bg-[#0A1120] border border-space-cyan/20 p-1 rounded-sm">
          <button
            onClick={() => setActiveTab('insat')}
            className={`px-4 py-1.5 font-orbitron text-xs font-bold uppercase transition-all rounded-xs flex items-center gap-2 ${
              activeTab === 'insat'
                ? 'bg-space-cyan/20 text-white border-b-2 border-space-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>INSAT-3D (ISRO)</span>
          </button>
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`px-4 py-1.5 font-orbitron text-xs font-bold uppercase transition-all rounded-xs flex items-center gap-2 ${
              activeTab === 'sentinel'
                ? 'bg-space-cyan/20 text-white border-b-2 border-space-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sentinel-5P (Copernicus)</span>
          </button>
        </div>
      </div>

      {/* INSAT-3D Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'insat' && (
          <motion.div
            key="insat-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard glowColor="cyan" title="SATELLITE STATUS" subtitle="ISRO Meteorological" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">INSAT-3D</div>
                    <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      ACTIVE • NOMINAL
                    </div>
                  </div>
                  <Compass className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>
              
              <GlassCard glowColor="cyan" title="ORBIT DETAILS" subtitle="Aligned longitude" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">74°E GEO</div>
                    <div className="text-[9px] font-mono text-slate-400">ALTITUDE: 35,786 KM</div>
                  </div>
                  <Clock className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>

              <GlassCard glowColor="orange" title="GEOGRAPHIC SPATIAL BOX" subtitle="India Bounding Sector" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-space-orange">6°N - 38°N</div>
                    <div className="text-[9px] font-mono text-slate-400">68°E - 98°E LIMITS</div>
                  </div>
                  <Layers className="w-8 h-8 text-space-orange/25" />
                </div>
              </GlassCard>

              <GlassCard glowColor="cyan" title="DATA REPOSITORY" subtitle="ISRO Portal Source" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">MOSDAC</div>
                    <div className="text-[9px] font-mono text-slate-400">SSO API HANDSHAKE ACTIVE</div>
                  </div>
                  <Database className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>
            </div>

            {/* Map and Terminal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Map */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="relative bg-[#060D1A] border border-space-cyan/25 rounded-sm overflow-hidden flex flex-col flex-grow">
                  
                  {/* Map Header */}
                  <div className="flex items-center justify-between border-b border-space-cyan/15 bg-[#0F172A]/90 px-4 py-2.5 text-xs z-10">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-space-cyan" />
                      <span className="font-orbitron font-bold tracking-wider text-slate-200">
                        INSAT-3D Meteorological Swath (India)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] bg-space-cyan/10 border border-space-cyan/20 text-space-cyan px-2 py-0.5 rounded-sm">
                      MOSDAC SCAN LOCK
                    </span>
                  </div>

                  {/* Viewport */}
                  <div className="relative bg-[#040810] h-[450px] overflow-hidden flex items-center justify-center">
                    {/* Google Map of India Background */}
                    <div className="absolute inset-0 select-none opacity-40 transition-transform duration-300" style={{ transform: `scale(${1 + (insatZoom - 5) * 0.15})` }}>
                      <iframe
                        title="Google Map of India"
                        src={`https://maps.google.com/maps?q=India&t=&z=${insatZoom}&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 invert grayscale contrast-[1.2]"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    {/* Zoom Controls HUD */}
                    <div className="flex border border-slate-800 rounded-sm overflow-hidden bg-space-black z-30 absolute top-4 right-4">
                      <button
                        onClick={() => setInsatZoom(prev => Math.max(prev - 1, 3))}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <div className="px-2 flex items-center justify-center text-[9px] font-mono border-x border-slate-800 text-slate-300 w-10 font-bold">
                        {insatZoom}z
                      </div>
                      <button
                        onClick={() => setInsatZoom(prev => Math.min(prev + 1, 15))}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.04)_0%,transparent_70%)] pointer-events-none" />
                    <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                    {/* INSAT Layers Container */}
                    <div 
                      className="absolute inset-0 transition-transform duration-300 pointer-events-none"
                      style={{ transform: `scale(${1 + (insatZoom - 5) * 0.08})`, transformOrigin: 'center' }}
                    >
                      {/* INSAT Layers */}
                      <AnimatePresence mode="wait">
                      {insatLayer === 'aerosol' && (
                        <motion.div 
                          key="insat-aerosol"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.65 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 pointer-events-none"
                        >
                          <div className="absolute top-[20%] left-[38%] w-56 h-28 bg-space-cyan/35 rounded-full filter blur-2xl animate-pulse" />
                          <div className="absolute top-[23%] left-[45%] w-36 h-20 bg-space-cyan/45 rounded-full filter blur-xl" />
                          <div className="absolute top-[45%] left-[36%] w-16 h-16 bg-space-cyan/25 rounded-full filter blur-xl" />
                          <div className="absolute top-[38%] left-[55%] w-24 h-24 bg-space-cyan/20 rounded-full filter blur-xl" />
                        </motion.div>
                      )}

                      {insatLayer === 'thermal' && (
                        <motion.div 
                          key="insat-thermal"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 pointer-events-none"
                        >
                          <div className="absolute top-[30%] left-[30%] w-48 h-48 bg-space-orange/30 rounded-full filter blur-3xl animate-pulse" />
                          <div className="absolute top-[40%] left-[35%] w-60 h-40 bg-space-orange/20 rounded-full filter blur-2xl" />
                        </motion.div>
                      )}

                      {insatLayer === 'clouds' && (
                        <motion.div 
                          key="insat-clouds"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 pointer-events-none"
                        >
                          <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[250px] bg-slate-300/15 rounded-full filter blur-3xl" style={{ transform: 'rotate(-25deg)' }} />
                          <div className="absolute bottom-[20%] left-[35%] w-[300px] h-[150px] bg-sky-200/20 rounded-full filter blur-2xl animate-pulse" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </div>

                    {/* Scanning Laser */}
                    <div className="absolute inset-x-0 h-0.5 bg-space-cyan/30 shadow-[0_0_15px_#00F0FF] pointer-events-none animate-[scan_6s_linear_infinite]" />

                    {/* Floating Satellite HUD */}
                    <div 
                      className="absolute top-16 right-16 z-20 flex flex-col items-center pointer-events-none"
                      style={{ transform: `translate(${floatOffset.x}px, ${floatOffset.y}px)` }}
                    >
                      <div className="bg-space-black/95 border border-space-cyan/50 p-2 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center space-x-2">
                        <div className="w-4 h-3.5 bg-space-cyan/35 border border-space-cyan rounded-xs animate-pulse" />
                        <span className="text-[8px] font-mono text-white font-bold">INSAT-3D</span>
                      </div>
                      <div className="w-0.5 h-12 bg-gradient-to-b from-space-cyan/40 to-transparent" />
                    </div>

                    {/* Region triggers */}
                    <div className="absolute top-[23%] left-[38%] z-10 cursor-pointer pointer-events-auto" onClick={() => setSelectedInsatRegion('Northern Plains')}>
                      <div className="relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-space-cyan border border-white rounded-full animate-pulse" />
                        <span className="absolute left-4 bg-space-black/90 border border-space-cyan/20 px-1.5 py-0.5 rounded-xs text-[8px] font-mono text-white whitespace-nowrap">
                          NORTH PLAIN (AOD: 0.68)
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-[32%] left-[32%] z-10 cursor-pointer pointer-events-auto" onClick={() => setSelectedInsatRegion('Western Desert')}>
                      <div className="relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-space-orange border border-white rounded-full" />
                        <span className="absolute left-4 bg-space-black/90 border border-space-orange/20 px-1.5 py-0.5 rounded-xs text-[8px] font-mono text-white whitespace-nowrap">
                          WEST DESERT (AOD: 0.42)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="border-t border-space-cyan/15 bg-[#0F172A]/90 p-3 flex flex-wrap items-center justify-between gap-3 z-10">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] font-mono text-slate-400 uppercase">INSAT LAYER:</span>
                    </div>
                    <div className="flex space-x-1">
                      {(['aerosol', 'thermal', 'clouds'] as const).map(layer => (
                        <button
                          key={layer}
                          onClick={() => setInsatLayer(layer)}
                          className={`px-3 py-1 text-[10px] font-mono rounded-sm border uppercase transition-all ${
                            insatLayer === layer
                              ? 'bg-space-cyan/20 border-space-cyan text-white shadow-[0_0_10px_#00F0FF]'
                              : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {layer === 'aerosol' && 'Aerosol Index (AOD)'}
                          {layer === 'thermal' && 'Land Temperature (LST)'}
                          {layer === 'clouds' && 'Water Vapor / Cloud'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 flex flex-col space-y-6">
                
                {/* MOSDAC Gateway */}
                <GlassCard glowColor="cyan" title="MOSDAC API SHELL" subtitle="ISRO Portal Sync" showCorners={true}>
                  <div className="space-y-4">
                    <div className="text-[10px] text-slate-400 font-mono leading-relaxed">
                      Calibrate scientific telemetry layers directly from the Meteorological & Oceanographic Gateway.
                    </div>
                    <div className="bg-black/95 rounded-sm border border-slate-800 p-3 h-48 font-mono text-[9px] text-slate-300 overflow-y-auto space-y-1">
                      <div className="text-slate-500">// Bounding Box Bounding coordinates:</div>
                      <div className="text-slate-500">// Lat 6.0N-38.0N | Lon 68.0E-98.0E</div>
                      {insatLogs.length === 0 && (
                        <div className="text-slate-500 italic">Terminal idle. Ready to query...</div>
                      )}
                      {insatLogs.map((log, idx) => (
                        <div key={idx} className={log.startsWith('>') ? 'text-space-cyan' : 'text-slate-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={runMosdacDownload}
                      disabled={isInsatQuerying}
                      className="w-full flex items-center justify-center space-x-2 bg-space-cyan text-black hover:bg-space-cyan/90 font-orbitron font-bold text-xs py-2 rounded-xs transition-all disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isInsatQuerying ? 'QUERYING MOSDAC...' : 'QUERY MOSDAC API'}</span>
                    </button>

                    {insatComplete && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-sm flex items-start space-x-2 text-[9px] font-mono">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold">GRID SYNC COMPLETE</span>
                          <p className="text-slate-400 mt-0.5">INSAT-3D aerosol index cache synchronized over India.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Region details */}
                <GlassCard glowColor="orange" title="INSAT ZONE DETECTOR" subtitle="Target Regional Bounding Lock" showCorners={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Lock Region:</span>
                      <span className="font-bold text-white font-orbitron">{currentInsatInfo.region}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono">
                      <span className="text-slate-400">Aerosol Density (AOD):</span>
                      <span className="font-bold text-space-orange">{currentInsatInfo.aod}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono">
                      <span className="text-slate-400">Calibrated Status:</span>
                      <span className="text-emerald-400">{currentInsatInfo.status}</span>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </div>

            {/* INSAT Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard glowColor="cyan" title="AEROSOL REGIONAL SWELL" subtitle="INSAT-3D Imager Channel AOD" showCorners={true}>
                <div className="h-60 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalAodData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="region" stroke="#64748B" fontSize={8} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#64748B" fontSize={9} tickLine={false} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(0, 240, 255, 0.2)', fontSize: '10px' }} />
                      <Bar dataKey="aod" fill="#00F0FF" radius={[2, 2, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard glowColor="cyan" title="TOTAL PRECIPITABLE WATER VAPOR" subtitle="INSAT-3D Sounder Channel 3 Profile" showCorners={true}>
                <div className="h-60 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waterVaporProfile} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="vaporInGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={8} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#64748B" fontSize={9} tickLine={false} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(0, 240, 255, 0.2)', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="tpw" stroke="#00F0FF" fillOpacity={1} fill="url(#vaporInGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

          </motion.div>
        )}

        {/* Sentinel-5P Tab Content */}
        {activeTab === 'sentinel' && (
          <motion.div
            key="sentinel-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard glowColor="cyan" title="SATELLITE MISSION" subtitle="ESA Copernicus Program" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">SENTINEL-5P</div>
                    <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      ACTIVE • NOMINAL
                    </div>
                  </div>
                  <Activity className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>
              
              <GlassCard glowColor="cyan" title="ORBIT DETAILS" subtitle="Sun-synchronous polar" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">824 KM ALT</div>
                    <div className="text-[9px] font-mono text-slate-400">16-DAY REPEAT PASS</div>
                  </div>
                  <Clock className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>

              <GlassCard glowColor="orange" title="PRIMARY INSTRUMENT" subtitle="Atmospheric Spectrometer" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-space-orange">TROPOMI</div>
                    <div className="text-[9px] font-mono text-slate-400">2600 KM SWATH WIDTH</div>
                  </div>
                  <Layers className="w-8 h-8 text-space-orange/25" />
                </div>
              </GlassCard>

              <GlassCard glowColor="cyan" title="DATA ACCESS POINT" subtitle="European CDSE Hub" showCorners={true}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-orbitron font-extrabold text-white">CDSE STAC</div>
                    <div className="text-[9px] font-mono text-slate-400">OAUTH GATEWAY ACTIVE</div>
                  </div>
                  <Database className="w-8 h-8 text-space-cyan/25" />
                </div>
              </GlassCard>
            </div>

            {/* Map and Terminal Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Map */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="relative bg-[#060D1A] border border-space-cyan/25 rounded-sm overflow-hidden flex flex-col flex-grow">
                  
                  {/* Map Header */}
                  <div className="flex items-center justify-between border-b border-space-cyan/15 bg-[#0F172A]/90 px-4 py-2.5 text-xs z-10">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-space-cyan" />
                      <span className="font-orbitron font-bold tracking-wider text-slate-200">
                        Copernicus Sentinel-5P TROPOMI Swath (India)
                      </span>
                    </div>
                    <span className="font-mono text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-sm">
                      TROPOMI TRACE GAS LOCK
                    </span>
                  </div>

                  {/* Viewport */}
                  <div className="relative bg-[#040810] h-[450px] overflow-hidden flex items-center justify-center">
                    {/* Google Map of India Background */}
                    <div className="absolute inset-0 select-none opacity-40 transition-transform duration-300" style={{ transform: `scale(${1 + (sentinelZoom - 5) * 0.15})` }}>
                      <iframe
                        title="Google Map of India"
                        src={`https://maps.google.com/maps?q=India&t=&z=${sentinelZoom}&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 invert grayscale contrast-[1.2]"
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    {/* Zoom Controls HUD */}
                    <div className="flex border border-slate-800 rounded-sm overflow-hidden bg-space-black z-30 absolute top-4 right-4">
                      <button
                        onClick={() => setSentinelZoom(prev => Math.max(prev - 1, 3))}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <div className="px-2 flex items-center justify-center text-[9px] font-mono border-x border-slate-800 text-slate-300 w-10 font-bold">
                        {sentinelZoom}z
                      </div>
                      <button
                        onClick={() => setSentinelZoom(prev => Math.min(prev + 1, 15))}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.04)_0%,transparent_70%)] pointer-events-none" />
                    <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

                    {/* Sentinel Layers Container */}
                    <div 
                      className="absolute inset-0 transition-transform duration-300 pointer-events-none"
                      style={{ transform: `scale(${1 + (sentinelZoom - 5) * 0.08})`, transformOrigin: 'center' }}
                    >
                      {/* S5P Trace Gas Layers */}
                      <AnimatePresence mode="wait">
                        {sentinelLayer === 'no2' && (
                          <motion.div 
                            key="sentinel-no2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            {/* Nitrogen Dioxide Plumes - Extreme around Singrauli, Delhi, Ahmedabad, Kolkata */}
                            <div className="absolute top-[23%] left-[38%] w-16 h-16 bg-red-650/40 rounded-full filter blur-xl animate-pulse" /> {/* Delhi */}
                            <div className="absolute top-[35%] left-[45%] w-24 h-24 bg-red-600/35 rounded-full filter blur-xl animate-pulse" /> {/* Singrauli energy belt */}
                            <div className="absolute top-[38%] left-[55%] w-20 h-20 bg-red-500/30 rounded-full filter blur-xl" /> {/* Kolkata */}
                            <div className="absolute top-[32%] left-[31%] w-16 h-16 bg-red-500/30 rounded-full filter blur-xl" /> {/* Ahmedabad */}
                          </motion.div>
                        )}

                        {sentinelLayer === 'co' && (
                          <motion.div 
                            key="sentinel-co"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            {/* Carbon Monoxide - Broad diffuse transport layer over Northern India */}
                            <div className="absolute top-[18%] left-[34%] w-[380px] h-[150px] bg-yellow-400/15 rounded-full filter blur-3xl animate-pulse" />
                            <div className="absolute top-[22%] left-[38%] w-[250px] h-[100px] bg-orange-400/20 rounded-full filter blur-2xl" />
                          </motion.div>
                        )}

                        {sentinelLayer === 'hcho' && (
                          <motion.div 
                            key="sentinel-hcho"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            {/* Formaldehyde biogenic plume over forested North-East India */}
                            <div className="absolute top-[24%] right-[10%] w-48 h-48 bg-purple-500/25 rounded-full filter blur-2xl animate-pulse" />
                            <div className="absolute top-[36%] left-[44%] w-32 h-32 bg-purple-500/15 rounded-full filter blur-2xl" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Scanning Laser */}
                    <div className="absolute inset-x-0 h-0.5 bg-[#8A2BE2]/40 shadow-[0_0_15px_#8A2BE2] pointer-events-none animate-[scan_6s_linear_infinite]" />

                    {/* Floating Satellite HUD */}
                    <div 
                      className="absolute top-16 right-16 z-20 flex flex-col items-center pointer-events-none"
                      style={{ transform: `translate(${floatOffset.x}px, ${floatOffset.y}px)` }}
                    >
                      <div className="bg-space-black/95 border border-purple-500/50 p-2 rounded-sm shadow-[0_0_10px_rgba(138,43,226,0.3)] flex items-center space-x-2">
                        <div className="w-4 h-3.5 bg-purple-500/35 border border-purple-500 rounded-xs animate-pulse" />
                        <span className="text-[8px] font-mono text-white font-bold">SENTINEL-5P</span>
                      </div>
                      <div className="w-0.5 h-12 bg-gradient-to-b from-purple-500/40 to-transparent" />
                    </div>

                    {/* Hotspot triggers */}
                    <div className="absolute top-[35%] left-[45%] z-10 cursor-pointer pointer-events-auto" onClick={() => setSelectedSentinelHotspot('Singrauli Hub')}>
                      <div className="relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-500 border border-white rounded-full animate-ping" />
                        <span className="absolute left-4 bg-space-black/90 border border-red-500/20 px-1.5 py-0.5 rounded-xs text-[8px] font-mono text-white whitespace-nowrap">
                          SINGRAULI IND (NO2: 24.5)
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-[23%] left-[38%] z-10 cursor-pointer pointer-events-auto" onClick={() => setSelectedSentinelHotspot('Delhi NCR')}>
                      <div className="relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-400 border border-white rounded-full" />
                        <span className="absolute left-4 bg-space-black/90 border border-red-400/20 px-1.5 py-0.5 rounded-xs text-[8px] font-mono text-white whitespace-nowrap">
                          DELHI NCR (NO2: 18.2)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="border-t border-space-cyan/15 bg-[#0F172A]/90 p-3 flex flex-wrap items-center justify-between gap-3 z-10">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] font-mono text-slate-400 uppercase">TRACE GAS COLUMN:</span>
                    </div>
                    <div className="flex space-x-1">
                      {(['no2', 'co', 'hcho'] as const).map(layer => (
                        <button
                          key={layer}
                          onClick={() => setSentinelLayer(layer)}
                          className={`px-3 py-1 text-[10px] font-mono rounded-sm border uppercase transition-all ${
                            sentinelLayer === layer
                              ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_10px_rgba(138,43,226,0.25)]'
                              : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {layer === 'no2' && 'Nitrogen Dioxide (NO2)'}
                          {layer === 'co' && 'Carbon Monoxide (CO)'}
                          {layer === 'hcho' && 'Formaldehyde (HCHO)'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 flex flex-col space-y-6">
                
                {/* CDSE Gateway */}
                <GlassCard glowColor="cyan" title="COPERNICUS DATA PORTAL" subtitle="STAC API Client" showCorners={true}>
                  <div className="space-y-4">
                    <div className="text-[10px] text-slate-400 font-mono leading-relaxed">
                      Interface directly with the Copernicus Data Space Ecosystem to search STAC collections over India.
                    </div>
                    <div className="bg-black/95 rounded-sm border border-slate-800 p-3 h-48 font-mono text-[9px] text-slate-300 overflow-y-auto space-y-1">
                      <div className="text-slate-500">// STAC: catalogue.dataspace.copernicus.eu/stac</div>
                      <div className="text-slate-500">// BoundingBox BBOX: [68.0, 6.0, 98.0, 38.0]</div>
                      {sentinelLogs.length === 0 && (
                        <div className="text-slate-500 italic">Terminal idle. Ready to query...</div>
                      )}
                      {sentinelLogs.map((log, idx) => (
                        <div key={idx} className={log.startsWith('>') ? 'text-purple-400' : 'text-slate-300'}>
                          {log}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={runCopernicusDownload}
                      disabled={isSentinelQuerying}
                      className="w-full flex items-center justify-center space-x-2 bg-space-cyan text-black hover:bg-space-cyan/90 font-orbitron font-bold text-xs py-2 rounded-xs transition-all disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isSentinelQuerying ? 'QUERYING CDSE STAC...' : 'QUERY COPERNICUS API'}</span>
                    </button>

                    {sentinelComplete && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-sm flex items-start space-x-2 text-[9px] font-mono">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold">NETCDF DOWNLOAD OK</span>
                          <p className="text-slate-400 mt-0.5">TROPOMI swath layers successfully loaded into memory grid.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Hotspot details */}
                <GlassCard glowColor="red" title="HOTSPOT LOCK DETECTED" subtitle="TROPOMI Gas Column Threshold" showCorners={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Trace Target:</span>
                      <span className="font-bold text-white font-orbitron">{currentSentinelInfo.hotspot}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono">
                      <span className="text-slate-400">NO2 Density (10^-6 mol/m²):</span>
                      <span className="font-bold text-space-red">{currentSentinelInfo.no2}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono">
                      <span className="text-slate-400">TROPOMI Alarm:</span>
                      <span className="text-red-500 uppercase font-bold">{currentSentinelInfo.status}</span>
                    </div>

                    {currentSentinelInfo.hotspot === 'Singrauli Hub' && (
                      <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-2 rounded-xs flex items-start space-x-1.5 text-[8px] font-mono leading-relaxed mt-1">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        <div>
                          <span className="font-bold">SINGRAULI CLUSTER LOCK:</span>
                          <p className="text-slate-400 mt-0.5">Tropospheric column density exceeds critical values due to dense concentration of heavy coal-fired thermal power stations.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>

              </div>
            </div>

            {/* Sentinel Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <GlassCard glowColor="cyan" title="TROPOMI NO2 COMPARATIVE SWELL" subtitle="Nitrogen Dioxide levels across Hotspots" showCorners={true}>
                <div className="h-60 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentinelNo2Data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="hotspot" stroke="#64748B" fontSize={8} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#64748B" fontSize={9} tickLine={false} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(0, 240, 255, 0.2)', fontSize: '10px' }} />
                      <Bar dataKey="no2" fill="#EF4444" radius={[2, 2, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="limit" fill="#F59E0B" opacity={0.25} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard glowColor="cyan" title="DAILY ATMOSPHERIC GAS TRENDS" subtitle="Sentinel-5P Weekly Column Aggregates (10^-6 mol/m²)" showCorners={true}>
                <div className="h-60 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={traceGasTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gasNo2Grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gasHchoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={8} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#64748B" fontSize={9} tickLine={false} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(0, 240, 255, 0.2)', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="no2" stroke="#EF4444" fillOpacity={1} fill="url(#gasNo2Grad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="hcho" stroke="#A855F7" fillOpacity={1} fill="url(#gasHchoGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* General Disclaimer Info box */}
      <GlassCard glowColor="none" showCorners={false}>
        <div className="flex items-start space-x-2.5 text-[10px] font-mono text-slate-400 leading-relaxed">
          <Info className="w-4 h-4 text-space-cyan flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white uppercase">Atmospheric Telemetry Sync Protocol</span>
            <p className="mt-0.5">
              The telemetry profiles shown display real-time sensor bands extracted from both geostationary (INSAT-3D at 74°E) and polar orbiting (Sentinel-5P TROPOMI spectrometer) swaths over India. Standard bounding boxes restrict the queries to coordinates 6.0°N–38.0°N and 68.0°E–98.0°E.
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
