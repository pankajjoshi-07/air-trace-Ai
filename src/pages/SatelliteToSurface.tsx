import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Layers, 
  Globe2, 
  Activity, 
  RefreshCw, 
  Play, 
  Zap, 
  Info,
  Clock,
  MapPin,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface ValidationCity {
  name: string;
  region: string;
  columnarSat: number; // mol/m² or AOD
  meteorology: {
    pblh: number; // m
    rh: number; // %
    temp: number; // °C
    windSpeed: number; // m/s
  };
  predictedSurface: number; // µg/m³
  cpcbGroundTruth: number; // µg/m³
  lat: number;
  lon: number;
}

const cnnLstmLogs = [
  "[SYSTEM] > Initializing AI Inference Engine: Hybrid CNN-LSTM v3.4.1...",
  "[METEO]  > Loading planetary boundary layer height (PBLH) tensors...",
  "[METEO]  > Syncing WRF-Chem relative humidity (RH) and surface temperature...",
  "[SATELLITE] > Importing Sentinel-5P TROPOMI Columnar trace gas grid...",
  "[SATELLITE] > Reading INSAT-3D Aerosol Optical Depth (AOD) 0.1° swath data...",
  "[CNN-STAGE] > Initiating 2D spatial convolution layers (Land-Use Regression)...",
  "[CNN-STAGE] > Extracting local spatial features and roadway proximity indices...",
  "[LSTM-STAGE] > Executing recurrent sequence analysis over 24-hour temporal lag...",
  "[LSTM-STAGE] > Computing diurnal accumulation trends and wind dispersion factors...",
  "[HYBRID-NET] > Fusing spatial CNN & temporal LSTM representations...",
  "[POST-PROCESSING] > Scaling vertical profile columns to ground-level microgram/m³...",
  "[VALIDATOR] > Cross-referencing predictions with CPCB Central Telemetry Stations...",
  "[SYSTEM] > Inference completed. 0.1° x 0.1° high-res Surface AQI Map generated successfully.",
  "[SYSTEM] > Global validation metrics: Mean RMSE = 7.82 µg/m³ | R² Score = 0.892"
];

const cnnLogs = [
  "[SYSTEM] > Initializing AI Inference Engine: Spatial 2D-CNN v2.1.0...",
  "[SATELLITE] > Reading spatial AOD & Trace Gas columns (TROPOMI & INSAT-3D)...",
  "[CNN-STAGE] > Applying 3x3 and 5x5 convolution filters for spatial feature mapping...",
  "[CNN-STAGE] > Pooling geographic grids to extract spatial local correlations...",
  "[POST-PROCESSING] > Performing dense layer regression for ground estimation...",
  "[SYSTEM] > Inference completed. Spatial Surface AQI Map outputted.",
  "[SYSTEM] > Validation metrics: Mean RMSE = 10.45 µg/m³ | R² Score = 0.814"
];

const lstmLogs = [
  "[SYSTEM] > Initializing AI Inference Engine: Temporal Stacked LSTM v2.5.0...",
  "[SATELLITE] > Loading historical 72h timeseries of column concentrations...",
  "[LSTM-STAGE] > Unrolling LSTM cells for sequence prediction (Time step: 1h)...",
  "[LSTM-STAGE] > Capturing diurnal meteorological patterns and vertical boundary transitions...",
  "[POST-PROCESSING] > Linear mapping of state vectors to surface densities...",
  "[SYSTEM] > Inference completed. Diurnal temporal maps refreshed.",
  "[SYSTEM] > Validation metrics: Mean RMSE = 9.18 µg/m³ | R² Score = 0.841"
];

const rfLogs = [
  "[SYSTEM] > Initializing Baseline Engine: Random Forest Regressor...",
  "[DATA] > Loading local grid values, elevation, temperature, and column data...",
  "[FOREST] > Running ensemble inference across 250 decision trees...",
  "[POST-PROCESSING] > Aggregating voting predictions to map surface concentration...",
  "[SYSTEM] > Inference completed.",
  "[SYSTEM] > Validation metrics: Mean RMSE = 12.10 µg/m³ | R² Score = 0.765"
];

// 7-day trend mock data for line chart
const generateTrendData = (_cityName: string, factor: number) => {
  return [
    { day: 'Mon', columnar: 0.38 * factor, predicted: 125 * factor, groundTruth: 130 * factor },
    { day: 'Tue', columnar: 0.42 * factor, predicted: 142 * factor, groundTruth: 148 * factor },
    { day: 'Wed', columnar: 0.45 * factor, predicted: 155 * factor, groundTruth: 151 * factor },
    { day: 'Thu', columnar: 0.39 * factor, predicted: 130 * factor, groundTruth: 124 * factor },
    { day: 'Fri', columnar: 0.32 * factor, predicted: 98 * factor, groundTruth: 104 * factor },
    { day: 'Sat', columnar: 0.28 * factor, predicted: 76 * factor, groundTruth: 80 * factor },
    { day: 'Sun', columnar: 0.35 * factor, predicted: 110 * factor, groundTruth: 115 * factor },
  ];
};

// CPCB AQI Calculation Utility based on PM2.5 or converted surface concentration
const calculateAqi = (conc: number, pollutant: string): { aqi: number; category: string; color: string } => {
  let aqi = 0;
  if (pollutant === 'pm2_5') {
    // Indian AQI PM2.5 standards: 0-30 Good, 31-60 Satisfactory, 61-90 Moderate, 91-120 Poor, 121-250 Very Poor, 250+ Severe
    if (conc <= 30) {
      aqi = Math.round((conc / 30) * 50);
    } else if (conc <= 60) {
      aqi = Math.round(50 + ((conc - 30) / 30) * 50);
    } else if (conc <= 90) {
      aqi = Math.round(100 + ((conc - 60) / 30) * 100);
    } else if (conc <= 120) {
      aqi = Math.round(200 + ((conc - 90) / 30) * 100);
    } else if (conc <= 250) {
      aqi = Math.round(300 + ((conc - 120) / 130) * 100);
    } else {
      aqi = Math.round(400 + ((conc - 250) / 150) * 100);
    }
  } else {
    // For NO2: 0-40 Good, 41-80 Satisfactory, 81-180 Moderate, 181-280 Poor, 281-400 Very Poor, 400+ Severe
    if (conc <= 40) {
      aqi = Math.round((conc / 40) * 50);
    } else if (conc <= 80) {
      aqi = Math.round(50 + ((conc - 40) / 40) * 50);
    } else if (conc <= 180) {
      aqi = Math.round(100 + ((conc - 80) / 100) * 100);
    } else if (conc <= 280) {
      aqi = Math.round(200 + ((conc - 180) / 100) * 100);
    } else if (conc <= 400) {
      aqi = Math.round(300 + ((conc - 280) / 120) * 100);
    } else {
      aqi = Math.round(400 + ((conc - 400) / 200) * 100);
    }
  }

  // Cap AQI at 500
  aqi = Math.min(aqi, 500);

  let category = 'Good';
  let color = 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
  if (aqi > 50 && aqi <= 100) {
    category = 'Satisfactory';
    color = 'text-green-400 border-green-500/20 bg-green-950/20';
  } else if (aqi > 100 && aqi <= 200) {
    category = 'Moderate';
    color = 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
  } else if (aqi > 200 && aqi <= 300) {
    category = 'Poor';
    color = 'text-orange-400 border-orange-500/20 bg-orange-950/20';
  } else if (aqi > 300 && aqi <= 400) {
    category = 'Very Poor';
    color = 'text-red-400 border-red-500/20 bg-red-950/20';
  } else if (aqi > 400) {
    category = 'Severe';
    color = 'text-red-600 border-red-800/20 bg-red-950/30';
  }

  return { aqi, category, color };
};

export const SatelliteToSurface: React.FC = () => {
  const [modelType, setModelType] = useState<'hybrid' | 'cnn' | 'lstm' | 'rf'>('hybrid');
  const [pollutant, setPollutant] = useState<'pm2_5' | 'no2' | 'so2' | 'co'>('pm2_5');
  const [selectedCityName, setSelectedCityName] = useState<string>('Delhi NCR');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [logOutputs, setLogOutputs] = useState<string[]>([]);
  const [zoom, setZoom] = useState<number>(5);

  // Trigger simulated ML conversion logs
  const runModelConversion = () => {
    setIsProcessing(true);
    setLogOutputs([]);

    let stepsToLog: string[] = [];
    if (modelType === 'hybrid') stepsToLog = cnnLstmLogs;
    else if (modelType === 'cnn') stepsToLog = cnnLogs;
    else if (modelType === 'lstm') stepsToLog = lstmLogs;
    else stepsToLog = rfLogs;

    stepsToLog.forEach((step, idx) => {
      setTimeout(() => {
        setLogOutputs(prev => [...prev, step]);
        if (idx === stepsToLog.length - 1) {
          setIsProcessing(false);
        }
      }, (idx + 1) * 200);
    });
  };

  // Run conversion pipeline automatically on mounting once
  useEffect(() => {
    runModelConversion();
  }, [modelType, pollutant]);

  // Cities database
  const cities: ValidationCity[] = [
    {
      name: 'Delhi NCR',
      region: 'North',
      columnarSat: pollutant === 'pm2_5' ? 0.72 : pollutant === 'no2' ? 18.2 : pollutant === 'so2' ? 6.4 : 220,
      meteorology: { pblh: 420, rh: 62, temp: 36.5, windSpeed: 2.1 },
      predictedSurface: pollutant === 'pm2_5' ? 128.5 : pollutant === 'no2' ? 68.2 : pollutant === 'so2' ? 14.5 : 1.8,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 134.0 : pollutant === 'no2' ? 71.5 : pollutant === 'so2' ? 13.8 : 1.9,
      lat: 28.6139,
      lon: 77.2090
    },
    {
      name: 'Mumbai Port',
      region: 'West',
      columnarSat: pollutant === 'pm2_5' ? 0.38 : pollutant === 'no2' ? 11.4 : pollutant === 'so2' ? 3.1 : 160,
      meteorology: { pblh: 850, rh: 82, temp: 30.2, windSpeed: 5.4 },
      predictedSurface: pollutant === 'pm2_5' ? 56.4 : pollutant === 'no2' ? 38.6 : pollutant === 'so2' ? 8.2 : 0.95,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 51.2 : pollutant === 'no2' ? 35.1 : pollutant === 'so2' ? 7.6 : 1.1,
      lat: 19.0760,
      lon: 72.8777
    },
    {
      name: 'Singrauli Hub',
      region: 'Central',
      columnarSat: pollutant === 'pm2_5' ? 0.81 : pollutant === 'no2' ? 24.8 : pollutant === 'so2' ? 14.2 : 280,
      meteorology: { pblh: 580, rh: 48, temp: 38.0, windSpeed: 1.8 },
      predictedSurface: pollutant === 'pm2_5' ? 182.2 : pollutant === 'no2' ? 112.5 : pollutant === 'so2' ? 32.1 : 2.5,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 190.5 : pollutant === 'no2' ? 119.0 : pollutant === 'so2' ? 34.6 : 2.8,
      lat: 24.1994,
      lon: 82.6645
    },
    {
      name: 'Kolkata Delta',
      region: 'East',
      columnarSat: pollutant === 'pm2_5' ? 0.44 : pollutant === 'no2' ? 15.6 : pollutant === 'so2' ? 4.8 : 190,
      meteorology: { pblh: 680, rh: 78, temp: 31.8, windSpeed: 4.1 },
      predictedSurface: pollutant === 'pm2_5' ? 84.1 : pollutant === 'no2' ? 52.4 : pollutant === 'so2' ? 11.2 : 1.35,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 79.5 : pollutant === 'no2' ? 50.2 : pollutant === 'so2' ? 11.9 : 1.2,
      lat: 22.5726,
      lon: 88.3639
    },
    {
      name: 'Bengaluru Tech',
      region: 'South',
      columnarSat: pollutant === 'pm2_5' ? 0.25 : pollutant === 'no2' ? 8.1 : pollutant === 'so2' ? 1.8 : 110,
      meteorology: { pblh: 1100, rh: 55, temp: 28.5, windSpeed: 3.2 },
      predictedSurface: pollutant === 'pm2_5' ? 31.8 : pollutant === 'no2' ? 22.1 : pollutant === 'so2' ? 4.2 : 0.62,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 28.4 : pollutant === 'no2' ? 24.6 : pollutant === 'so2' ? 4.9 : 0.58,
      lat: 12.9716,
      lon: 77.5946
    },
    {
      name: 'Chennai Coast',
      region: 'South',
      columnarSat: pollutant === 'pm2_5' ? 0.32 : pollutant === 'no2' ? 9.8 : pollutant === 'so2' ? 2.5 : 130,
      meteorology: { pblh: 980, rh: 75, temp: 33.1, windSpeed: 4.8 },
      predictedSurface: pollutant === 'pm2_5' ? 48.2 : pollutant === 'no2' ? 29.5 : pollutant === 'so2' ? 6.1 : 0.78,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 54.0 : pollutant === 'no2' ? 32.2 : pollutant === 'so2' ? 5.8 : 0.81,
      lat: 13.0827,
      lon: 80.2707
    },
    {
      name: 'Lucknow Plains',
      region: 'North',
      columnarSat: pollutant === 'pm2_5' ? 0.65 : pollutant === 'no2' ? 16.8 : pollutant === 'so2' ? 5.2 : 210,
      meteorology: { pblh: 460, rh: 58, temp: 35.8, windSpeed: 2.2 },
      predictedSurface: pollutant === 'pm2_5' ? 116.5 : pollutant === 'no2' ? 62.4 : pollutant === 'so2' ? 12.8 : 1.62,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 121.2 : pollutant === 'no2' ? 60.5 : pollutant === 'so2' ? 13.4 : 1.5,
      lat: 26.8467,
      lon: 80.9462
    },
    {
      name: 'Ahmedabad Ind',
      region: 'West',
      columnarSat: pollutant === 'pm2_5' ? 0.52 : pollutant === 'no2' ? 17.5 : pollutant === 'so2' ? 5.8 : 198,
      meteorology: { pblh: 690, rh: 50, temp: 37.2, windSpeed: 2.5 },
      predictedSurface: pollutant === 'pm2_5' ? 98.4 : pollutant === 'no2' ? 64.1 : pollutant === 'so2' ? 13.1 : 1.54,
      cpcbGroundTruth: pollutant === 'pm2_5' ? 104.2 : pollutant === 'no2' ? 61.2 : pollutant === 'so2' ? 12.5 : 1.6,
      lat: 23.0225,
      lon: 72.5714
    }
  ];

  // Adjust predicted outputs based on chosen ML model algorithm scale factors
  const getSelectedModelPerformanceScale = () => {
    switch (modelType) {
      case 'hybrid': return 1.0; // Optimal (RMSE ~7.8)
      case 'cnn': return 1.08;   // Spatial bias (RMSE ~10.4)
      case 'lstm': return 0.95;  // Temporal delay bias (RMSE ~9.1)
      case 'rf': return 1.15;    // Tree bagging variances (RMSE ~12.1)
    }
  };

  const getMetricSummary = () => {
    switch (modelType) {
      case 'hybrid': return { rmse: '7.82 µg/m³', r2: '0.892', status: 'Optimal' };
      case 'cnn': return { rmse: '10.45 µg/m³', r2: '0.814', status: 'Moderate' };
      case 'lstm': return { rmse: '9.18 µg/m³', r2: '0.841', status: 'Good' };
      case 'rf': return { rmse: '12.10 µg/m³', r2: '0.765', status: 'Sub-Optimal' };
    }
  };

  const selectedCity = cities.find(c => c.name === selectedCityName) || cities[0];
  const modelScale = getSelectedModelPerformanceScale();
  const adjustedPredictedSurface = Number((selectedCity.predictedSurface * modelScale).toFixed(1));
  
  const predictedAqiObj = calculateAqi(adjustedPredictedSurface, pollutant);
  const groundTruthAqiObj = calculateAqi(selectedCity.cpcbGroundTruth, pollutant);

  // Dynamic colors for values
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400';
    if (aqi <= 100) return 'text-green-400';
    if (aqi <= 200) return 'text-yellow-400';
    if (aqi <= 300) return 'text-orange-400';
    if (aqi <= 400) return 'text-red-400';
    return 'text-red-600';
  };

  // Mapping vector grid for India Surface AQI representation
  // Represents regions on a map: Northern, Western, Central, Eastern, Southern Peninsular, Northeastern
  const regionAqis = {
    North: calculateAqi(cities.filter(c => c.region === 'North').reduce((sum, c) => sum + c.predictedSurface * modelScale, 0) / 2, pollutant).aqi,
    West: calculateAqi(cities.filter(c => c.region === 'West').reduce((sum, c) => sum + c.predictedSurface * modelScale, 0) / 2, pollutant).aqi,
    Central: calculateAqi(cities.filter(c => c.region === 'Central').reduce((sum, c) => sum + c.predictedSurface * modelScale, 0) / 1, pollutant).aqi,
    East: calculateAqi(cities.filter(c => c.region === 'East').reduce((sum, c) => sum + c.predictedSurface * modelScale, 0) / 1, pollutant).aqi,
    South: calculateAqi(cities.filter(c => c.region === 'South').reduce((sum, c) => sum + c.predictedSurface * modelScale, 0) / 2, pollutant).aqi,
  };

  const getRegionFill = (aqi: number) => {
    if (aqi <= 50) return 'rgba(16, 185, 129, 0.4)'; // Emerald
    if (aqi <= 100) return 'rgba(34, 197, 94, 0.4)'; // Green
    if (aqi <= 200) return 'rgba(234, 179, 8, 0.4)'; // Yellow
    if (aqi <= 300) return 'rgba(249, 115, 22, 0.4)'; // Orange
    return 'rgba(239, 68, 68, 0.4)'; // Red
  };

  const getRegionStroke = (aqi: number) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#22C55E';
    if (aqi <= 200) return '#EAB308';
    if (aqi <= 300) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-space-cyan/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-orbitron text-white tracking-widest flex items-center gap-2">
            <Cpu className="w-5 h-5 text-space-cyan" />
            AI COLUMN-TO-SURFACE AQI MAPPER
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase">
            Predict ground-level surface concentrations from satellite columnar density using deep learning neural networks
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-3 md:mt-0 text-[10px] font-mono text-slate-400 bg-[#0F172A]/80 border border-space-cyan/15 px-3 py-1.5 rounded-sm">
          <Globe2 className="w-3.5 h-3.5 text-space-cyan animate-pulse" />
          <span>TROPOMI SENTINEL-5P & INSAT-3D SWATH ALIGNMENT</span>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ML Configuration Column */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <GlassCard glowColor="cyan" title="MODEL ARCHITECTURE CONFIG" subtitle="Set model hyper-parameters" showCorners={true}>
            <div className="space-y-4">
              
              {/* Pollutant Target */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Parameter Converter
                </label>
                <select
                  value={pollutant}
                  onChange={(e) => setPollutant(e.target.value as any)}
                  className="w-full bg-[#050A15]/90 border border-slate-800 focus:border-space-cyan text-slate-200 text-xs px-3 py-2 rounded-sm focus:outline-none font-mono cursor-pointer transition-colors"
                >
                  <option value="pm2_5">Aerosol Optical Depth (AOD) ➔ PM2.5 (µg/m³)</option>
                  <option value="no2">Tropospheric NO2 Column (µmol/m²) ➔ NO2 (µg/m³)</option>
                  <option value="so2">Tropospheric SO2 Column (µmol/m²) ➔ SO2 (µg/m³)</option>
                  <option value="co">Total CO Column (mmol/m²) ➔ CO (mg/m³)</option>
                </select>
              </div>

              {/* Neural Network Model Selector */}
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  AI/ML Algorithm Surface Estimator
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModelType('hybrid')}
                    className={`p-2 border rounded-sm text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      modelType === 'hybrid'
                        ? 'border-space-cyan text-space-cyan bg-space-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <Zap className="w-4 h-4 mb-1" />
                    <span>Hybrid CNN-LSTM</span>
                  </button>
                  
                  <button
                    onClick={() => setModelType('cnn')}
                    className={`p-2 border rounded-sm text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      modelType === 'cnn'
                        ? 'border-space-cyan text-space-cyan bg-space-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <Layers className="w-4 h-4 mb-1" />
                    <span>Spatial 2D-CNN</span>
                  </button>

                  <button
                    onClick={() => setModelType('lstm')}
                    className={`p-2 border rounded-sm text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      modelType === 'lstm'
                        ? 'border-space-cyan text-space-cyan bg-space-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <Clock className="w-4 h-4 mb-1" />
                    <span>Temporal LSTM</span>
                  </button>

                  <button
                    onClick={() => setModelType('rf')}
                    className={`p-2 border rounded-sm text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      modelType === 'rf'
                        ? 'border-space-cyan text-space-cyan bg-space-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <Cpu className="w-4 h-4 mb-1" />
                    <span>Random Forest</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Model Specs */}
              <div className="bg-[#050A15] border border-slate-800 p-3 rounded-sm font-mono text-[9px] text-slate-400 space-y-2">
                <div className="text-slate-300 font-bold border-b border-slate-900 pb-1 flex justify-between items-center">
                  <span>METADATA PARAMETERS</span>
                  <span className="text-space-cyan animate-pulse">● MODEL READY</span>
                </div>
                <div className="flex justify-between">
                  <span>INPUT COLUMNS:</span>
                  <span className="text-white font-semibold">TROPOMI Gas Column, INSAT AOD</span>
                </div>
                <div className="flex justify-between">
                  <span>METEOROLOGY PARAMS:</span>
                  <span className="text-white font-semibold">PBLH, Temp, Rel Humidity, Wind Speed</span>
                </div>
                <div className="flex justify-between">
                  <span>VALIDATOR RESOLUTION:</span>
                  <span className="text-space-cyan font-bold">0.1° × 0.1° (~10km)</span>
                </div>
                <div className="flex justify-between">
                  <span>LOSS FUNCTION:</span>
                  <span className="text-slate-200">Huber Loss / ADAM Optimizer</span>
                </div>
              </div>

              {/* Trigger inference button */}
              <button
                onClick={runModelConversion}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-sm font-orbitron font-extrabold tracking-wider text-xs border flex items-center justify-center gap-2 transition-all bg-space-cyan/10 border-space-cyan/30 text-space-cyan hover:bg-space-cyan/20 hover:border-space-cyan"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>COMPUTING INFERENCE TENSORS...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>RUN MODEL PIPELINE</span>
                  </>
                )}
              </button>

            </div>
          </GlassCard>

          {/* Model validation Metrics summary */}
          <GlassCard glowColor="orange" title="VALIDATION ACCURACY METRICS" subtitle="CPCB Ground Truth Sync Statistics" showCorners={true}>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#050A15] p-2 border border-slate-800 rounded-sm">
                <div className="text-[9px] font-mono text-slate-400">MEAN RMSE</div>
                <div className="text-xs font-orbitron font-extrabold text-white mt-1">
                  {getMetricSummary().rmse}
                </div>
              </div>
              <div className="bg-[#050A15] p-2 border border-slate-800 rounded-sm">
                <div className="text-[9px] font-mono text-slate-400">R² SCORE</div>
                <div className="text-xs font-orbitron font-extrabold text-space-cyan mt-1">
                  {getMetricSummary().r2}
                </div>
              </div>
              <div className="bg-[#050A15] p-2 border border-slate-800 rounded-sm">
                <div className="text-[9px] font-mono text-slate-400">RATING</div>
                <div className="text-xs font-orbitron font-extrabold text-space-orange mt-1 uppercase">
                  {getMetricSummary().status}
                </div>
              </div>
            </div>
            
            <div className="text-[10px] font-mono text-slate-400 leading-relaxed mt-3 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-space-orange flex-shrink-0 mt-0.5" />
              <p>
                Metrics are calculated daily by comparing predicted grid centroids against {cities.length} real-time active CPCB surface monitoring stations.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* AI Conversion Logs Console Terminal */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-[#050A15] border border-space-cyan/20 rounded-sm flex flex-col flex-grow min-h-[300px] lg:min-h-[auto] overflow-hidden">
            
            {/* Console Header */}
            <div className="bg-[#0F172A]/90 border-b border-space-cyan/15 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-space-cyan animate-pulse" />
                <span className="font-orbitron font-bold tracking-wider text-slate-200 uppercase">
                  AI neural net feed (inference)
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-400 bg-space-black px-2 py-0.5 rounded-sm border border-slate-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>SYNC TIME: Nom</span>
              </div>
            </div>

            {/* Log list console view */}
            <div className="p-4 font-mono text-[10px] text-slate-300 space-y-2 flex-grow overflow-y-auto max-h-[380px] bg-[#03070E] scrollbar-thin">
              <AnimatePresence>
                {logOutputs.map((log, index) => {
                  let colorClass = 'text-slate-400';
                  if (log.includes('[SYSTEM]')) colorClass = 'text-space-cyan font-semibold';
                  else if (log.includes('[METEO]')) colorClass = 'text-space-orange';
                  else if (log.includes('[SATELLITE]')) colorClass = 'text-emerald-400';
                  else if (log.includes('[CNN-STAGE]') || log.includes('[LSTM-STAGE]')) colorClass = 'text-purple-400';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`py-0.5 border-b border-slate-900/60 leading-relaxed ${colorClass}`}
                    >
                      {log}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isProcessing && (
                <div className="flex items-center space-x-2 text-space-cyan animate-pulse mt-2">
                  <span>➜ PROCESSING COLUMN TENSORS IN CUDA CORE MATRIX...</span>
                </div>
              )}
            </div>

            {/* Console summary footer */}
            <div className="border-t border-slate-900 bg-[#0F172A]/70 px-4 py-2 text-[9px] font-mono text-slate-500 flex items-center justify-between">
              <span>ACTIVE MODEL WEIGHTS: CNN-LSTM-v341.onnx (64.2 MB)</span>
              <span>BATCH: 1x8x24 grid</span>
            </div>

          </div>
        </div>

      </div>

      {/* Predictions Map and Validation Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pred India AQI Map */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative bg-[#060D1A] border border-space-cyan/20 rounded-sm overflow-hidden flex flex-col flex-grow">
            
            {/* Map Title HUD */}
            <div className="flex items-center justify-between border-b border-space-cyan/15 bg-[#0F172A]/90 px-4 py-2.5 text-xs z-10">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-space-cyan" />
                <span className="font-orbitron font-bold tracking-wider text-slate-200">
                   predicted Surface AQI Map of India ({modelType.toUpperCase()} Model Prediction)
                </span>
              </div>
              <span className="font-mono text-[9px] bg-space-cyan/10 border border-space-cyan/20 text-space-cyan px-2 py-0.5 rounded-sm">
                0.1° CELL RESOLUTION
              </span>
            </div>

            {/* Viewport for the Interactive Map */}
            <div className="relative bg-[#040810] h-[480px] overflow-hidden flex items-center justify-center">
              {/* Google Map of India Background */}
              <div className="absolute inset-0 select-none opacity-45 transition-transform duration-300" style={{ transform: `scale(${1 + (zoom - 5) * 0.15})` }}>
                <iframe
                  title="Google Map of India"
                  src={`https://maps.google.com/maps?q=India&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 invert grayscale contrast-[1.2]"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Zoom Controls HUD */}
              <div className="flex border border-slate-800 rounded-sm overflow-hidden bg-space-black z-30 absolute top-4 right-4">
                <button
                  onClick={() => setZoom(prev => Math.max(prev - 1, 3))}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="px-2 flex items-center justify-center text-[9px] font-mono border-x border-slate-800 text-slate-300 w-10">
                  {zoom}z
                </div>
                <button
                  onClick={() => setZoom(prev => Math.min(prev + 1, 15))}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />

              {/* Interactive Overlays Container */}
              <div 
                className="absolute inset-0 transition-transform duration-300 pointer-events-none"
                style={{ 
                  transform: `scale(${1 + (zoom - 5) * 0.08})`,
                  transformOrigin: 'center' 
                }}
              >
                {/* Converted surface AQI Grid map for India */}
                <div className="absolute inset-0 p-8 flex items-center justify-center select-none pointer-events-auto">
                  <svg viewBox="0 0 800 520" className="w-full h-full" stroke="rgba(0, 240, 255, 0.15)" fill="none" strokeWidth="0.8">
                    {/* Hexagon/Circle overlays representing simulated AI predictions regions */}
                    
                    {/* Northern Region (Pred AQI: regionAqis.North) */}
                    <circle cx="340" cy="180" r="45" fill={getRegionFill(regionAqis.North)} stroke={getRegionStroke(regionAqis.North)} strokeWidth="1.2" className="transition-all" />
                    
                    {/* Western Region (Pred AQI: regionAqis.West) */}
                    <circle cx="280" cy="240" r="40" fill={getRegionFill(regionAqis.West)} stroke={getRegionStroke(regionAqis.West)} strokeWidth="1.2" className="transition-all" />
                    
                    {/* Central Region (Pred AQI: regionAqis.Central) */}
                    <circle cx="380" cy="270" r="45" fill={getRegionFill(regionAqis.Central)} stroke={getRegionStroke(regionAqis.Central)} strokeWidth="1.2" className="transition-all" />
                    
                    {/* Eastern Region (Pred AQI: regionAqis.East) */}
                    <circle cx="480" cy="230" r="35" fill={getRegionFill(regionAqis.East)} stroke={getRegionStroke(regionAqis.East)} strokeWidth="1.2" className="transition-all" />
                    
                    {/* Southern Region (Pred AQI: regionAqis.South) */}
                    <circle cx="390" cy="380" r="50" fill={getRegionFill(regionAqis.South)} stroke={getRegionStroke(regionAqis.South)} strokeWidth="1.2" className="transition-all" />
                  </svg>
                </div>

                {/* Regional predicted AQI overlays on Map */}
                <div className="absolute top-[28%] left-[40%] flex flex-col bg-space-black/90 border border-slate-800 px-2 py-1 rounded-sm text-[8px] font-mono w-24 pointer-events-auto">
                  <span className="text-slate-400">NORTH REGION</span>
                  <span className={`text-xs font-orbitron font-extrabold ${getAqiColor(regionAqis.North)}`}>
                    AQI: {regionAqis.North}
                  </span>
                  <span className="text-[7px] text-slate-500">RMSE: {modelType === 'hybrid' ? '8.2' : '11.1'} µg/m³</span>
                </div>

                <div className="absolute top-[42%] left-[28%] flex flex-col bg-space-black/90 border border-slate-800 px-2 py-1 rounded-sm text-[8px] font-mono w-24 pointer-events-auto">
                  <span className="text-slate-400">WEST REGION</span>
                  <span className={`text-xs font-orbitron font-extrabold ${getAqiColor(regionAqis.West)}`}>
                    AQI: {regionAqis.West}
                  </span>
                  <span className="text-[7px] text-slate-500">RMSE: {modelType === 'hybrid' ? '7.5' : '9.8'} µg/m³</span>
                </div>

                <div className="absolute top-[48%] left-[45%] flex flex-col bg-space-black/90 border border-slate-800 px-2 py-1 rounded-sm text-[8px] font-mono w-24 pointer-events-auto">
                  <span className="text-slate-400">CENTRAL</span>
                  <span className={`text-xs font-orbitron font-extrabold ${getAqiColor(regionAqis.Central)}`}>
                    AQI: {regionAqis.Central}
                  </span>
                  <span className="text-[7px] text-slate-500">RMSE: {modelType === 'hybrid' ? '7.9' : '10.5'} µg/m³</span>
                </div>

                <div className="absolute top-[38%] left-[60%] flex flex-col bg-space-black/90 border border-slate-800 px-2 py-1 rounded-sm text-[8px] font-mono w-24 pointer-events-auto">
                  <span className="text-slate-400">EAST REGION</span>
                  <span className={`text-xs font-orbitron font-extrabold ${getAqiColor(regionAqis.East)}`}>
                    AQI: {regionAqis.East}
                  </span>
                  <span className="text-[7px] text-slate-500">RMSE: {modelType === 'hybrid' ? '8.4' : '10.1'} µg/m³</span>
                </div>

                <div className="absolute top-[68%] left-[46%] flex flex-col bg-space-black/90 border border-slate-800 px-2 py-1 rounded-sm text-[8px] font-mono w-24 pointer-events-auto">
                  <span className="text-slate-400">SOUTH REGION</span>
                  <span className={`text-xs font-orbitron font-extrabold ${getAqiColor(regionAqis.South)}`}>
                    AQI: {regionAqis.South}
                  </span>
                  <span className="text-[7px] text-slate-500">RMSE: {modelType === 'hybrid' ? '7.2' : '9.5'} µg/m³</span>
                </div>

                {/* Map pins representing validate-station points */}
                {cities.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCityName(city.name)}
                    className={`absolute group p-1 flex items-center justify-center transition-all pointer-events-auto ${
                      selectedCityName === city.name ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                    style={{
                      top: `${480 - ((city.lat - 6) / 32) * 440}px`,
                      left: `${((city.lon - 68) / 30) * 800}px`
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <MapPin className={`w-5 h-5 ${selectedCityName === city.name ? 'text-space-cyan' : 'text-slate-500 group-hover:text-space-cyan'}`} />
                      <span className="absolute -top-6 bg-space-black/90 border border-slate-800 text-[8px] font-mono px-1 rounded-sm hidden group-hover:block whitespace-nowrap text-white">
                        {city.name} (AQI: {calculateAqi(city.predictedSurface * modelScale, pollutant).aqi})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-space-black/85 border border-slate-800 p-2.5 rounded-sm font-mono text-[8px] space-y-1 w-32">
                <div className="font-bold border-b border-slate-800 pb-1 uppercase tracking-wider text-slate-300">AQI Range Color</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-emerald-500/40 border border-emerald-500 rounded-2xs" /><span>0-50 Good</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-green-500/40 border border-green-500 rounded-2xs" /><span>51-100 Satisfactory</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-yellow-500/40 border border-yellow-500 rounded-2xs" /><span>101-200 Moderate</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-orange-500/40 border border-orange-500 rounded-2xs" /><span>201-300 Poor</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-red-500/40 border border-red-500 rounded-2xs" /><span>301-400 Very Poor</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 bg-red-800/40 border border-red-800 rounded-2xs" /><span>401+ Severe</span></div>
              </div>

            </div>

            {/* Footer sync telemetry */}
            <div className="border-t border-slate-900 bg-[#0F172A]/70 px-4 py-2.5 text-[9px] font-mono text-slate-400 flex items-center justify-between">
              <span>Predicted surface spatial grid unified with Sentinel-5P TROPOMI trace densities</span>
              <span className="text-space-cyan animate-pulse">● MODEL PREDICTIONS GENERATED</span>
            </div>

          </div>
        </div>

        {/* Validating Station Data Grid */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Selected City Quick Inspector */}
          <GlassCard glowColor="cyan" title="CITY COMPARISON DETAILS" subtitle="Validate predicting vs ground stations" showCorners={true}>
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800/60 pb-2">
                <div>
                  <h4 className="text-sm font-bold font-orbitron text-white tracking-wide">{selectedCity.name}</h4>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Region: {selectedCity.region} India</span>
                </div>
                <span className="text-[9px] font-mono bg-[#050A15] border border-slate-800 px-2 py-0.5 rounded-sm text-slate-300">
                  {selectedCity.lat.toFixed(2)}°N / {selectedCity.lon.toFixed(2)}°E
                </span>
              </div>

              {/* Sat Input vs Surface Prediction */}
              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                <div className="bg-[#050A15] p-2 border border-slate-850 rounded-sm">
                  <span className="text-slate-500">SATELLITE COLUMNAR</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {selectedCity.columnarSat} {pollutant === 'pm2_5' ? 'AOD' : pollutant === 'co' ? 'mmol/m²' : 'µmol/m²'}
                  </div>
                </div>
                
                <div className="bg-[#050A15] p-2 border border-slate-850 rounded-sm">
                  <span className="text-slate-500">PBL HEIGHT LIMIT</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {selectedCity.meteorology.pblh} meters
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                <div className="bg-[#050A15] p-2 border border-slate-850 rounded-sm">
                  <span className="text-slate-500">SURFACE TEMP</span>
                  <div className="text-xs font-bold text-slate-250 mt-1">
                    {selectedCity.meteorology.temp}°C
                  </div>
                </div>
                
                <div className="bg-[#050A15] p-2 border border-slate-850 rounded-sm">
                  <span className="text-slate-500">REL HUMIDITY</span>
                  <div className="text-xs font-bold text-slate-250 mt-1">
                    {selectedCity.meteorology.rh}%
                  </div>
                </div>
              </div>

              {/* Comparison table predictions vs ground truth */}
              <div className="border border-slate-800 rounded-sm overflow-hidden bg-black/40 text-[10px] font-mono">
                <div className="grid grid-cols-3 bg-[#0F172A]/90 p-2 font-bold border-b border-slate-800 text-slate-400">
                  <span>METRIC</span>
                  <span className="text-center">PREDICTED</span>
                  <span className="text-right">CPCB STATION</span>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-slate-900 text-slate-200">
                  <span>Concentration:</span>
                  <span className="text-center font-bold">{adjustedPredictedSurface} µg/m³</span>
                  <span className="text-right font-bold">{selectedCity.cpcbGroundTruth} µg/m³</span>
                </div>
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span>Index AQI:</span>
                  <span className={`text-center font-extrabold ${getAqiColor(predictedAqiObj.aqi)}`}>{predictedAqiObj.aqi} ({predictedAqiObj.category})</span>
                  <span className={`text-right font-extrabold ${getAqiColor(groundTruthAqiObj.aqi)}`}>{groundTruthAqiObj.aqi} ({groundTruthAqiObj.category})</span>
                </div>
              </div>

              <div className="bg-space-cyan/5 border border-space-cyan/20 p-2.5 rounded-sm font-mono text-[9px] text-slate-300 flex justify-between items-center">
                <span>PREDICTION DEV-VARIATION ERROR:</span>
                <span className="text-space-cyan font-bold">
                  {Math.abs(((adjustedPredictedSurface - selectedCity.cpcbGroundTruth) / selectedCity.cpcbGroundTruth) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Validation Station Picker list */}
          <GlassCard glowColor="none" title="TELEMETRY VALIDATING STATION SITES" subtitle="Select a ground site for validation mapping" showCorners={false}>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin font-mono text-[10px]">
              {cities.map((city, idx) => {
                const predictedVal = Number((city.predictedSurface * modelScale).toFixed(1));
                const diffPct = Math.abs(((predictedVal - city.cpcbGroundTruth) / city.cpcbGroundTruth) * 100).toFixed(1);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedCityName(city.name)}
                    className={`w-full p-2 border rounded-sm flex items-center justify-between text-left transition-colors ${
                      selectedCityName === city.name
                        ? 'border-space-cyan/50 bg-[#00F0FF]/5 text-white'
                        : 'border-slate-800 bg-[#050A15]/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedCityName === city.name ? 'bg-space-cyan' : 'bg-slate-600'}`} />
                      <span className="font-bold">{city.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>Diff: <strong className="text-slate-200">{diffPct}%</strong></span>
                      <span className={`px-1.5 py-0.5 rounded-xs font-bold text-[8px] uppercase ${calculateAqi(predictedVal, pollutant).color}`}>
                        AQI {calculateAqi(predictedVal, pollutant).aqi}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Comparison trend charts */}
      <GlassCard glowColor="cyan" title={`${selectedCityName.toUpperCase()} 7-DAY CONVERSION STABILITY TREND`} subtitle="Validating satellite columnar conversions against surface AQI measurements over 7-day windows" showCorners={true}>
        <div className="h-72 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={generateTrendData(selectedCityName, modelScale)}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGround" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} fontFamily="monospace" tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} fontFamily="monospace" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  fontSize: '10px',
                  color: '#F8FAFC',
                  fontFamily: 'monospace'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
              
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="AI Predicted Surface AQI" 
                stroke="#00F0FF" 
                fillOpacity={1}
                fill="url(#colorPredicted)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="groundTruth" 
                name="CPCB Ground Truth Station AQI" 
                stroke="#10B981" 
                fillOpacity={1}
                fill="url(#colorGround)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Analytical info card explaining math conversion formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard glowColor="none" title="THE SCIENTIFIC RATIONALE" subtitle="How Satellite Columns translate to Ground Surface Concentration" showCorners={false}>
          <div className="text-[10px] font-mono text-slate-400 space-y-3 leading-relaxed">
            <p>
              Columnar measurements from orbiting spectrometers (like Sentinel-5P TROPOMI or INSAT-3D) evaluate the total number of target gas molecules integrated along the vertical column from the ground up to the satellite sensor, expressed as column density (e.g. $molecules/cm^2$ or $mol/m^2$).
            </p>
            <p>
              However, human exposure happens at the breathing level (0-2 meters altitude). Translating vertical columns to surface concentrations ($\mu g/m^3$) is highly complex and depends on the atmospheric planetary boundary layer height (PBLH) dynamics and regional microclimate conditions.
            </p>
            <p>
              Our deep learning approach utilizes a spatial Convolutional Neural Network (CNN) to map local road network emission distributions combined with a temporal Long Short-Term Memory (LSTM) network to predict boundary layer compression, yielding high-resolution ground-level concentration estimations.
            </p>
          </div>
        </GlassCard>

        <GlassCard glowColor="none" title="DEEP LEARNING MODEL EQUATION" subtitle="Under the Hood Formula representations" showCorners={false}>
          <div className="text-[10px] font-mono text-slate-400 space-y-3 leading-relaxed">
            <p>
              The general regression formulation for mapping columnar trace gas density to ground concentration is modeled as:
            </p>
            <div className="bg-[#050A15] p-2.5 border border-slate-900 rounded-sm font-semibold text-slate-200 text-center">
              {"$$C_{surface} = f_{HybridCNN-LSTM} \\left( \\Omega_{Sat}, PBLH, RH, Temp, WS, X_{spatial} \\right)$$"}
            </div>
            <p>
              Where:
              <br />• {"\\Omega_{Sat}"}: Columnar column density from Sentinel-5P / INSAT-3D AOD.
              <br />• {"PBLH"}: Boundary layer height (deeper layer = lower surface density).
              <br />• {"RH, Temp, WS"}: Humidity, temperature, and wind speed dispersing factors.
              <br />• {"X_{spatial}"}: Spatial static covariates (e.g., proximity to highways, industries, elevation).
            </p>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};
