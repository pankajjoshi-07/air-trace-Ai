import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Play, CheckCircle2, RefreshCw, Cpu, Database, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface CompiledReport {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: 'READY' | 'COMPILING';
}

export const Reports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('daily');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStep, setCompileStep] = useState(0);
  const [reportsList, setReportsList] = useState<CompiledReport[]>([
    { id: 'REP-8041', name: 'INSAT-3DR Swath Summary (North-West)', type: 'Daily Swath Summary', date: '2026-06-27', size: '4.2 MB', status: 'READY' },
    { id: 'REP-7992', name: 'Punjab Crop Fire Thermal Anomaly Index', type: 'Thermal Hotspot Log', date: '2026-06-26', size: '12.8 MB', status: 'READY' },
    { id: 'REP-7945', name: 'Gujarat Petrochemical Plume Attribution', type: 'AI Plume Attribution', date: '2026-06-25', size: '8.4 MB', status: 'READY' },
  ]);

  const reportOptions = [
    { id: 'daily', name: 'DAILY SWATH ATMOSPHERIC SUMMARY', desc: 'Aggregated daily average values for all gas columns and aerosol parameters over India.' },
    { id: 'thermal', name: 'THERMAL ANOMALY EXTREME LOG', desc: 'Dedicated list of fire hotspots, coordinates, and fire radiative power (FRP) metrics.' },
    { id: 'ai-plume', name: 'AI SOURCE ATTRIBUTION PROFILE', desc: 'Back-trajectory plume trace reports for industrial and biogenic volatile releases.' }
  ];

  const compileSteps = [
    { name: 'Extracting satellite swath grids...', icon: Database },
    { name: 'Calibrating chemical channel coefficients...', icon: Cpu },
    { name: 'Compiling thermal hotspots...', icon: AlertCircle },
    { name: 'Formulating trajectory vectors...', icon: RefreshCw },
    { name: 'Finalizing PDF telemetry package...', icon: CheckCircle2 }
  ];

  const handleGenerateReport = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompileStep(0);

    const stepInterval = setInterval(() => {
      setCompileStep(prev => {
        if (prev >= compileSteps.length - 1) {
          clearInterval(stepInterval);
          // Add generated report to the top of list
          const selectedOpt = reportOptions.find(o => o.id === selectedReportType);
          const newReport: CompiledReport = {
            id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: selectedOpt ? selectedOpt.name.charAt(0) + selectedOpt.name.slice(1).toLowerCase() : 'Custom Swath Report',
            type: selectedOpt ? selectedOpt.name : 'Custom',
            date: new Date().toISOString().split('T')[0],
            size: `${(2 + Math.random() * 10).toFixed(1)} MB`,
            status: 'READY'
          };
          setReportsList(prevList => [newReport, ...prevList]);
          setIsCompiling(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleMockDownload = (reportName: string) => {
    alert(`Initiating secure telemetry download for: ${reportName}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-space-cyan/15 pb-4">
        <h2 className="text-xl font-bold font-orbitron text-slate-100 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-space-cyan" />
          <span>MISSION REPORTS & COMPRESSION FEEDS</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          AUTOMATED DATA COMPILATION • TELEMETRY PDF ARCHIVE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report Compiler Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <GlassCard title="Report Generation Console" subtitle="SELECT REPORT FEEDS" glowColor="cyan">
            <div className="space-y-4 mt-1 font-mono text-xs">
              
              <div className="space-y-2">
                {reportOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => !isCompiling && setSelectedReportType(opt.id)}
                    className={`w-full p-3 border rounded-sm text-left transition-all flex flex-col space-y-1 ${
                      selectedReportType === opt.id
                        ? 'border-space-cyan bg-space-cyan/5 text-space-cyan'
                        : 'border-slate-800 bg-[#050A15]/40 text-slate-400 hover:border-slate-700'
                    } ${isCompiling ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-bold text-slate-200">{opt.name}</span>
                    <span className="text-[10px] text-slate-400 font-inter leading-relaxed">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateReport}
                  disabled={isCompiling}
                  className={`w-full py-3 border font-orbitron font-extrabold tracking-wider text-sm rounded-sm transition-all flex items-center justify-center space-x-2 ${
                    isCompiling 
                      ? 'border-slate-800 bg-[#0F172A] text-slate-500 cursor-not-allowed'
                      : 'border-space-cyan bg-space-cyan/10 hover:bg-space-cyan/20 text-space-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:scale-[1.01]'
                  }`}
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-space-cyan" />
                      <span>COMPILING TELEMETRY DATA...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>COMPILE SECURE TELEMETRY PDF</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </GlassCard>

          {/* Compilation Ticker / Status Bar */}
          <AnimatePresence>
            {isCompiling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlassCard title="Telemetry Compilation Ticker" subtitle="COMPILING..." glowColor="orange">
                  <div className="space-y-4 font-mono text-[11px] mt-1 text-slate-300">
                    <div className="flex items-center space-x-3">
                      {React.createElement(compileSteps[compileStep].icon, {
                        className: "w-4 h-4 text-space-orange animate-pulse"
                      })}
                      <span className="font-bold">{compileSteps[compileStep].name}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>COMPILING SWATH ARCHIVE</span>
                        <span>{Math.floor(((compileStep + 1) / compileSteps.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#050A15] border border-slate-800 rounded-sm h-1.5 overflow-hidden">
                        <motion.div 
                          className="bg-space-orange h-full"
                          style={{ width: `${((compileStep + 1) / compileSteps.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Generated Reports Archive */}
        <GlassCard title="Reports Archive" subtitle="RECENT SECURE PDF DOWNLOADS" glowColor="cyan" className="lg:col-span-1">
          <div className="space-y-3 font-mono text-xs mt-1">
            <p className="text-[10px] font-inter text-slate-400">
              Download compiled multi-spectral reports stored securely in the station registry:
            </p>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {reportsList.map((rep) => (
                <div key={rep.id} className="p-2.5 border border-slate-900 bg-space-black/50 rounded-sm space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200 truncate max-w-[150px]" title={rep.name}>
                      {rep.name}
                    </span>
                    <button
                      onClick={() => handleMockDownload(rep.name)}
                      className="p-1 border border-slate-800 hover:border-space-cyan rounded-sm text-slate-400 hover:text-space-cyan transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>{rep.type}</span>
                    <span>{rep.size}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>DATE: {rep.date}</span>
                    <span className="text-emerald-400 font-bold">{rep.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
