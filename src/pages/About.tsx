import React, { useState } from 'react';
import { Info, Globe, ChevronDown, ChevronUp, CheckCircle, Database } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface SatelliteSpec {
  name: string;
  agency: string;
  orbit: string;
  channels: string[];
  swath: string;
  resolution: string;
  purpose: string;
}

export const About: React.FC = () => {
  const [expandedSpec, setExpandedSpec] = useState<string | null>('insat');

  const satelliteSpecs: Record<string, SatelliteSpec> = {
    insat: {
      name: 'INSAT-3DR Atmospheric Sounder',
      agency: 'Indian Space Research Organisation (ISRO)',
      orbit: 'Geostationary (74° East longitude)',
      channels: [
        'Visible Channel (0.55-0.75 µm)',
        'Short-Wave Infrared (1.55-1.70 µm)',
        'Mid-Wave Infrared (3.80-4.00 µm) - Hotspots',
        'Thermal Infrared 1 & 2 (10.3-12.5 µm)'
      ],
      swath: 'Full Disk coverage / Geostationary footprint',
      resolution: '4 km for Thermal IR / 1 km for Visible',
      purpose: 'Tracks active hotspots, thermal anomalies, surface temperature gradients, and regional convective setups over South Asia.'
    },
    sentinel: {
      name: 'Sentinel-5P TROPOMI Instrument',
      agency: 'European Space Agency (ESA) / Copernicus',
      orbit: 'Sun-Synchronous Polar orbit (Altitude: 824 km)',
      channels: [
        'UV Channel (270-320 nm)',
        'UV-VIS Channel (310-500 nm) - NO2 & HCHO',
        'NIR Channel (675-775 nm) - Cloud Fraction',
        'SWIR Channel (2305-2385 nm) - CO & Methane'
      ],
      swath: '2600 km Swath Width (Daily Global coverage)',
      resolution: '5.5 km × 3.5 km at Nadir',
      purpose: 'Performs high-resolution column density sweeps mapping trace gases (CO, NO2, SO2, HCHO) and aerosol indicators.'
    }
  };

  const toggleSpec = (key: string) => {
    setExpandedSpec(prev => (prev === key ? null : key));
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <Info className="w-5 h-5 text-space-cyan" />
          <span>ABOUT AIRTRACE AI INFRASTRUCTURE</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          SATELLITE ATMOSPHERIC SENSORS & DATA FUSION DESCRIPTION
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Description (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard title="Mission Architecture" subtitle="COPERNICUS-ISRO DATA FUSION" glowColor="cyan">
            <div className="space-y-4 mt-1 font-inter text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>AirTrace AI</strong> is a futuristic, interactive environmental telemetry dashboard designed for monitoring atmospheric aerosols, trace gas concentrations, and active thermal anomalies.
              </p>
              <p>
                By merging geostationary thermal infrared scans from ISRO's <strong>INSAT-3DR</strong> sounder with high-resolution gas columns from the European Space Agency's Copernicus <strong>Sentinel-5P TROPOMI</strong> spectrometer, the system offers an overlay capability for pinpointing plume events and verifying active agricultural/industrial combustion hotspots.
              </p>
              
              <div className="p-3 border border-slate-900 bg-space-black/60 rounded-sm font-mono text-[10.5px] space-y-1">
                <div className="text-white font-bold mb-1 uppercase font-orbitron text-[9px] tracking-wider">ACQUISITION PROTOCOLS</div>
                <div className="flex justify-between">
                  <span>SWATH MERGE DELAY:</span>
                  <span className="text-space-cyan font-bold">0.45 Seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>CLOUD FRACTION FILTER:</span>
                  <span className="text-slate-200">&lt; 0.20 Threshold</span>
                </div>
                <div className="flex justify-between">
                  <span>GROUND STATION CORRELATION:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE (CPCB NET)</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Interactive Accodion Satellite Specs */}
          <GlassCard title="Active Sensor Specs" subtitle="CLICK SENSORS TO EXPAND OPERATIONAL PROPERTIES" glowColor="cyan">
            <div className="space-y-3 mt-1 font-mono text-xs">
              
              {Object.keys(satelliteSpecs).map((key) => {
                const spec = satelliteSpecs[key];
                const expanded = expandedSpec === key;
                return (
                  <div key={key} className="border border-slate-900 rounded-sm bg-space-black/50 overflow-hidden">
                    <button
                      onClick={() => toggleSpec(key)}
                      className="w-full p-3 flex justify-between items-center hover:bg-slate-900/40 text-slate-200 transition-colors"
                    >
                      <span className="font-bold text-left">{spec.name}</span>
                      {expanded ? <ChevronUp className="w-4 h-4 text-space-cyan" /> : <ChevronDown className="w-4 h-4 text-space-cyan" />}
                    </button>

                    {expanded && (
                      <div className="p-4 border-t border-slate-900/60 bg-slate-950/20 text-slate-400 space-y-2.5 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">AGENCY:</span>
                          <span className="text-white font-semibold">{spec.agency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">ORBIT TYPE:</span>
                          <span className="text-slate-200">{spec.orbit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">GRID SWATH:</span>
                          <span className="text-slate-200">{spec.swath}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">PIXEL RES:</span>
                          <span className="text-space-cyan font-bold">{spec.resolution}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-slate-500">SPECTRAL FEEDS:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[9.5px] mt-0.5 text-slate-300">
                            {spec.channels.map((chan, idx) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <span className="text-space-cyan">•</span>
                                <span>{chan}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-900 text-slate-400 font-inter leading-relaxed">
                          {spec.purpose}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </GlassCard>
        </div>

        {/* Operational Overview side metadata panel */}
        <div className="flex flex-col space-y-6">
          <GlassCard title="Atmospheric Data Feeds" subtitle="STATION GRID FEED REGISTRY" glowColor="cyan" className="flex-grow">
            <div className="space-y-3 font-mono text-[10.5px] mt-1 text-slate-400">
              <p className="text-[11px] font-inter text-slate-400 leading-relaxed">
                All data ingested by the station undergo radiometric calibration and geometric corrections at our ground downlink hubs before being processed.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                  <Database className="w-4 h-4 text-space-cyan" />
                  <div>
                    <div className="text-white font-bold">L1B Radiances</div>
                    <div className="text-[9.5px] text-slate-500">RAW SPECTRAL CHANNELS</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 border-b border-slate-900 pb-2">
                  <Globe className="w-4 h-4 text-space-cyan" />
                  <div>
                    <div className="text-white font-bold">L2 Column Densities</div>
                    <div className="text-[9.5px] text-slate-500">CALIBRATED DU SCANS</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-white font-bold">Quality Flags Check</div>
                    <div className="text-[9.5px] text-slate-500">CLOUD SWATH FILTERED</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
