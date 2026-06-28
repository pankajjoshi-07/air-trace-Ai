import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radio,
  Atom,
  Flame,
  Wind,
  Fingerprint,
  BarChart3,
  ShieldAlert,
  FileText,
  Settings as SettingsIcon,
  Info,
  Rocket,
  Menu,
  X,
  Cpu,
  Globe2,
  Clock,
  RefreshCw
} from 'lucide-react';


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdateSec, setLastUpdateSec] = useState(0);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate last update time incrementing
  useEffect(() => {
    const updateTimer = setInterval(() => {
      setLastUpdateSec(prev => (prev >= 59 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(updateTimer);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Monitoring', path: '/live', icon: Radio },
    { name: 'AQI India', path: '/aqi-india', icon: Wind },
    { name: 'HCHO Analysis', path: '/hcho', icon: Atom },
    { name: 'Fire Detection', path: '/fire', icon: Flame },
    { name: 'Wind Analysis', path: '/wind', icon: Wind },
    { name: 'AI Source Attribution', path: '/source-attribution', icon: Fingerprint },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Decision Support', path: '/decision-support', icon: ShieldAlert },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Check if current path matches
  const isActive = (path: string) => location.pathname === path;

  // Format date to UTC & IST format for mission control look
  const formatTimeIST = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST';
  };
  const formatTimeUTC = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }) + ' UTC';
  };

  return (
    <div className="min-h-screen bg-[#050A15] text-[#F8FAFC] flex flex-col font-inter selection:bg-[#00F0FF]/30 select-none">
      
      {/* Top Status Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/85 backdrop-blur-md border-b border-space-cyan/20 z-40 px-4 md:px-6 flex items-center justify-between">
        
        {/* Logo and Mission Title */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center border border-space-cyan bg-space-cyan/10 rounded-sm overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-space-cyan/20"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Rocket className="w-4 h-4 text-space-cyan group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-sm tracking-[0.15em] text-white">
                AIRTRACE <span className="text-space-cyan">AI</span>
              </span>
              <div className="text-[9px] font-mono text-space-cyan/70 tracking-widest uppercase">
                ISRO Space-Atmosphere Link
              </div>
            </div>
          </Link>
        </div>

        {/* Telemetry and System Status - Desktop */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-mono">
          
          {/* Mission Status */}
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-5">
            <span className="text-slate-400">MISSION STATUS:</span>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold glow-emerald">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>NOMINAL</span>
            </span>
          </div>

          {/* Connected Satellite */}
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-5">
            <Globe2 className="w-3.5 h-3.5 text-space-cyan" />
            <span className="text-slate-400">SATELLITE:</span>
            <span className="text-space-cyan font-bold">INSAT-3DR / SENTINEL-5P</span>
          </div>

          {/* System Health */}
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-5">
            <Cpu className="w-3.5 h-3.5 text-space-orange" />
            <span className="text-slate-400">HEALTH:</span>
            <span className="text-space-orange font-bold">98.4%</span>
          </div>

          {/* Last Update */}
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-5">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-slate-400">LAST SYNC:</span>
            <span className="text-white font-bold">{lastUpdateSec}s AGO</span>
          </div>

          {/* Current Time (IST & UTC) */}
          <div className="flex items-center space-x-3 bg-space-black/80 px-3 py-1 border border-space-cyan/15 rounded-sm">
            <Clock className="w-3.5 h-3.5 text-space-cyan" />
            <div className="flex flex-col text-right">
              <span className="text-white leading-none font-bold">{formatTimeIST(currentTime)}</span>
              <span className="text-slate-500 text-[9px] leading-none mt-0.5">{formatTimeUTC(currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Mobile Control Buttons */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 border border-emerald-500/20 bg-emerald-950/20 rounded-sm text-[10px] font-mono text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>NOMINAL</span>
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 border border-space-cyan/20 rounded-sm flex items-center justify-center text-space-cyan bg-[#0F172A] hover:border-space-cyan/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 pt-16 flex relative">
        
        {/* Sidebar - Desktop (Fixed 280px) */}
        <aside className="hidden lg:block w-[280px] bg-[#0F172A]/70 backdrop-blur-md border-r border-space-cyan/10 fixed top-16 bottom-0 left-0 z-30 p-4 overflow-y-auto">
          <div className="space-y-6">
            
            {/* Mission Section */}
            <div>
              <div className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase px-3">
                MISSION MONITORING
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`relative flex items-center space-x-3 px-3 py-2.5 rounded-sm transition-all group font-mono text-xs ${
                        active
                          ? 'text-space-cyan bg-[#00F0FF]/5 border-l-2 border-space-cyan font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-space-cyan' : 'text-slate-400 group-hover:text-space-cyan'}`} />
                      <span>{item.name}</span>
                      
                      {active && (
                        <motion.div
                          layoutId="sidebarGlow"
                          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-space-cyan shadow-[0_0_8px_#00F0FF]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions / Telemetry Briefing */}
            <div className="pt-4 border-t border-slate-800/80 px-3">
              <div className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase">
                TELEMETRY LINK
              </div>
              <div className="bg-space-black/60 border border-space-cyan/10 p-3 rounded-sm font-mono text-[10px] space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>ORBITAL SPEED:</span>
                  <span className="text-space-cyan font-bold">7.42 km/s</span>
                </div>
                <div className="flex justify-between">
                  <span>ALTITUDE:</span>
                  <span className="text-slate-200">824.7 km</span>
                </div>
                <div className="flex justify-between">
                  <span>DATA LATENCY:</span>
                  <span className="text-emerald-400 font-bold">0.45s</span>
                </div>
                <div className="flex justify-between">
                  <span>DECAY RATE:</span>
                  <span className="text-slate-200">0.02 m/yr</span>
                </div>
              </div>
            </div>

            {/* Back to Mission Briefing (Landing) Button */}
            <div className="pt-2">
              <Link
                to="/"
                className="flex items-center justify-center space-x-2 w-full py-2 border border-dashed border-space-cyan/20 hover:border-space-cyan/50 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 text-space-cyan text-xs font-orbitron font-semibold tracking-wider rounded-sm transition-all"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>MISSION BRIEFING</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-30 lg:hidden"
              />
              
              {/* Drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-16 bottom-0 left-0 w-[280px] bg-[#0F172A] border-r border-space-cyan/20 z-45 p-4 overflow-y-auto lg:hidden"
              >
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase px-3">
                      MISSION NAVIGATION
                    </div>
                    <nav className="space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <button
                            key={item.name}
                            onClick={() => handleNavClick(item.path)}
                            className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-sm transition-all font-mono text-xs text-left ${
                              active
                                ? 'text-space-cyan bg-[#00F0FF]/5 border-l-2 border-space-cyan font-semibold'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${active ? 'text-space-cyan' : 'text-slate-400'}`} />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-slate-800 px-3">
                    <button
                      onClick={() => handleNavClick('/')}
                      className="flex items-center justify-center space-x-2 w-full py-2 border border-space-cyan/30 bg-[#00F0FF]/5 text-space-cyan text-xs font-orbitron font-semibold tracking-wider rounded-sm"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>MISSION BRIEFING</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-[280px] min-h-[calc(100vh-4rem)] flex flex-col pb-16 lg:pb-0">
          <div className="flex-1 p-4 md:p-6 lg:p-8 z-10 max-w-[1600px] w-full mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation (Visible on small screens, provides direct quick action shortcuts) */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0F172A]/90 backdrop-blur-md border-t border-space-cyan/20 lg:hidden z-30 flex items-center justify-around px-2">
          <button 
            onClick={() => handleNavClick('/dashboard')} 
            className={`flex flex-col items-center justify-center ${isActive('/dashboard') ? 'text-space-cyan' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-1">Dashboard</span>
          </button>
          <button 
            onClick={() => handleNavClick('/live')} 
            className={`flex flex-col items-center justify-center ${isActive('/live') ? 'text-space-cyan' : 'text-slate-400'}`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-1">Live</span>
          </button>
          <button 
            onClick={() => handleNavClick('/aqi-india')} 
            className={`flex flex-col items-center justify-center ${isActive('/aqi-india') ? 'text-space-cyan' : 'text-slate-400'}`}
          >
            <Wind className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-1">AQI India</span>
          </button>
          <button 
            onClick={() => handleNavClick('/fire')} 
            className={`flex flex-col items-center justify-center ${isActive('/fire') ? 'text-space-cyan' : 'text-slate-400'}`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-1">Fire</span>
          </button>
          <button 
            onClick={() => handleNavClick('/')} 
            className={`flex flex-col items-center justify-center text-space-orange`}
          >
            <Rocket className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-1">Briefing</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
