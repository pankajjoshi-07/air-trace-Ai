import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Info, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  Activity,
  CheckCircle,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface CpcbCityRecord {
  sNo: number;
  city: string;
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  aqi: number;
  pollutant: string;
  stations: string;
}

const cpcbRecords: CpcbCityRecord[] = [
  { sNo: 1, city: "Agartala", category: "Satisfactory", aqi: 100, pollutant: "PM10", stations: "1/2" },
  { sNo: 2, city: "Agra", category: "Satisfactory", aqi: 95, pollutant: "PM2.5, PM10", stations: "6/6" },
  { sNo: 3, city: "Ahmedabad", category: "Satisfactory", aqi: 80, pollutant: "PM10", stations: "8/9" },
  { sNo: 4, city: "Ahmednagar", category: "Good", aqi: 39, pollutant: "PM10", stations: "1/1" },
  { sNo: 5, city: "Aizawl", category: "Good", aqi: 27, pollutant: "PM10", stations: "1/1" },
  { sNo: 6, city: "Ajmer", category: "Satisfactory", aqi: 79, pollutant: "PM10", stations: "1/1" },
  { sNo: 7, city: "Akola", category: "Good", aqi: 38, pollutant: "PM10", stations: "1/1" },
  { sNo: 8, city: "Alwar", category: "Satisfactory", aqi: 84, pollutant: "PM10", stations: "1/1" },
  { sNo: 9, city: "Amaravati", category: "Satisfactory", aqi: 75, pollutant: "PM10", stations: "1/1" },
  { sNo: 10, city: "Ambala", category: "Moderate", aqi: 123, pollutant: "PM10", stations: "1/1" },
  { sNo: 11, city: "Ambernath", category: "Good", aqi: 25, pollutant: "O3", stations: "1/1" },
  { sNo: 12, city: "Amravati", category: "Good", aqi: 36, pollutant: "PM10", stations: "2/2" },
  { sNo: 13, city: "Amritsar", category: "Satisfactory", aqi: 98, pollutant: "PM10", stations: "1/1" },
  { sNo: 14, city: "Anantapur", category: "Satisfactory", aqi: 77, pollutant: "PM10", stations: "1/1" },
  { sNo: 15, city: "Angul", category: "Satisfactory", aqi: 91, pollutant: "PM10", stations: "1/1" },
  { sNo: 16, city: "Ankleshwar", category: "Satisfactory", aqi: 70, pollutant: "PM10", stations: "1/1" },
  { sNo: 17, city: "Araria", category: "Satisfactory", aqi: 89, pollutant: "PM2.5", stations: "1/1" },
  { sNo: 18, city: "Arrah", category: "Satisfactory", aqi: 64, pollutant: "PM10", stations: "1/1" },
  { sNo: 19, city: "Asansol", category: "Good", aqi: 46, pollutant: "SO2, O3, PM10", stations: "4/4" },
  { sNo: 20, city: "Aurangabad", category: "Satisfactory", aqi: 63, pollutant: "PM10, CO", stations: "3/3" },
  { sNo: 21, city: "Baddi", category: "Satisfactory", aqi: 94, pollutant: "PM10", stations: "1/1" },
  { sNo: 22, city: "Badlapur", category: "Satisfactory", aqi: 86, pollutant: "PM10", stations: "1/1" },
  { sNo: 23, city: "Bagalkot", category: "Satisfactory", aqi: 51, pollutant: "PM10", stations: "1/1" },
  { sNo: 24, city: "Baghpat", category: "Moderate", aqi: 159, pollutant: "PM10", stations: "1/1" },
  { sNo: 25, city: "Bahadurgarh", category: "Moderate", aqi: 162, pollutant: "PM2.5", stations: "1/1" },
  { sNo: 26, city: "Balasore", category: "Satisfactory", aqi: 55, pollutant: "PM10", stations: "1/1" },
  { sNo: 27, city: "Ballabgarh", category: "Moderate", aqi: 161, pollutant: "PM10", stations: "1/1" },
  { sNo: 28, city: "Banswara", category: "Satisfactory", aqi: 89, pollutant: "PM10", stations: "1/1" },
  { sNo: 29, city: "Baran", category: "Satisfactory", aqi: 100, pollutant: "O3", stations: "1/1" },
  { sNo: 30, city: "Barbil", category: "Satisfactory", aqi: 87, pollutant: "PM10", stations: "1/1" },
  { sNo: 31, city: "Bareilly", category: "Satisfactory", aqi: 67, pollutant: "PM10", stations: "2/2" },
  { sNo: 32, city: "Baripada", category: "Satisfactory", aqi: 61, pollutant: "PM10", stations: "1/1" },
  { sNo: 33, city: "Barmer", category: "Satisfactory", aqi: 82, pollutant: "PM10", stations: "1/1" },
  { sNo: 34, city: "Barrackpore", category: "Good", aqi: 35, pollutant: "PM10", stations: "1/1" },
  { sNo: 35, city: "Bathinda", category: "Satisfactory", aqi: 78, pollutant: "CO", stations: "1/1" },
  { sNo: 36, city: "Beed", category: "Moderate", aqi: 102, pollutant: "PM10", stations: "1/1" },
  { sNo: 37, city: "Begusarai", category: "Satisfactory", aqi: 73, pollutant: "PM10", stations: "1/1" },
  { sNo: 38, city: "Belapur", category: "Good", aqi: 49, pollutant: "PM10", stations: "1/1" },
  { sNo: 39, city: "Bengaluru", category: "Satisfactory", aqi: 68, pollutant: "PM10", stations: "9/14" },
  { sNo: 40, city: "Bhagalpur", category: "Satisfactory", aqi: 95, pollutant: "PM10", stations: "1/2" },
  { sNo: 48, city: "Bhopal", category: "Satisfactory", aqi: 51, pollutant: "O3, PM10", stations: "3/3" },
  { sNo: 66, city: "Chennai", category: "Moderate", aqi: 102, pollutant: "PM10", stations: "6/9" },
  { sNo: 76, city: "Delhi", category: "Moderate", aqi: 130, pollutant: "O3, PM10, PM2.5", stations: "45/46" },
  { sNo: 95, city: "Greater Noida", category: "Poor", aqi: 204, pollutant: "PM10", stations: "2/2" },
  { sNo: 98, city: "Gurugram", category: "Moderate", aqi: 140, pollutant: "PM2.5, PM10", stations: "3/4" },
  { sNo: 108, city: "Hyderabad", category: "Satisfactory", aqi: 58, pollutant: "PM10", stations: "13/14" },
  { sNo: 139, city: "Kolkata", category: "Good", aqi: 44, pollutant: "PM10, CO", stations: "7/7" },
  { sNo: 146, city: "Lucknow", category: "Satisfactory", aqi: 85, pollutant: "PM2.5, PM10, O3", stations: "6/6" },
  { sNo: 159, city: "Meerut", category: "Moderate", aqi: 193, pollutant: "PM2.5, PM10", stations: "4/4" },
  { sNo: 162, city: "Modinagar", category: "Poor", aqi: 261, pollutant: "PM2.5", stations: "1/1" },
  { sNo: 164, city: "Mumbai", category: "Satisfactory", aqi: 51, pollutant: "PM10", stations: "18/30" },
  { sNo: 178, city: "Noida", category: "Moderate", aqi: 161, pollutant: "O3, PM10", stations: "4/4" },
  { sNo: 183, city: "Panipat", category: "Poor", aqi: 207, pollutant: "PM10", stations: "1/1" },
  { sNo: 191, city: "Pune", category: "Satisfactory", aqi: 52, pollutant: "CO, PM10", stations: "7/9" },
];

const healthStatements = [
  { range: "0 - 50", category: "Good", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400", impact: "Minimal Impact." },
  { range: "51 - 100", category: "Satisfactory", color: "border-green-500 bg-green-500/10 text-green-400", impact: "Minor breathing discomfort to sensitive people." },
  { range: "101 - 200", category: "Moderate", color: "border-yellow-500 bg-yellow-500/10 text-yellow-400", impact: "Breathing discomfort to the people with lungs, asthma and heart diseases." },
  { range: "201 - 300", category: "Poor", color: "border-orange-500 bg-orange-500/10 text-orange-400", impact: "Breathing discomfort to most people on prolonged exposure." },
  { range: "301 - 400", category: "Very Poor", color: "border-red-500 bg-red-500/10 text-red-400", impact: "Respiratory illness on prolonged exposure." },
  { range: "401 - 500", category: "Severe", color: "border-red-800 bg-red-950/20 text-red-600", impact: "Affects healthy people and seriously impacts those with existing diseases." },
];

// Color mapping for slices/bars
const COLORS = {
  Good: '#10B981',
  Satisfactory: '#22C55E',
  Moderate: '#EAB308',
  Poor: '#F97316',
  'Very Poor': '#EF4444',
  Severe: '#DC2626',
};

export const CpcbAqi: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Compute stats
  const totalCities = cpcbRecords.length;
  const averageAqi = Math.round(cpcbRecords.reduce((sum, item) => sum + item.aqi, 0) / totalCities);
  
  const categoryCounts = cpcbRecords.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartCategoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Calibrate pollutant frequency (count instances where pollutant type is present)
  const pollutantCounts = cpcbRecords.reduce((acc, item) => {
    if (item.pollutant.includes("PM10")) acc["PM10"] = (acc["PM10"] || 0) + 1;
    if (item.pollutant.includes("PM2.5")) acc["PM2.5"] = (acc["PM2.5"] || 0) + 1;
    if (item.pollutant.includes("O3")) acc["O3"] = (acc["O3"] || 0) + 1;
    if (item.pollutant.includes("CO")) acc["CO"] = (acc["CO"] || 0) + 1;
    if (item.pollutant.includes("SO2")) acc["SO2"] = (acc["SO2"] || 0) + 1;
    if (item.pollutant.includes("NO2")) acc["NO2"] = (acc["NO2"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartPollutantData = Object.entries(pollutantCounts).map(([name, value]) => ({
    name,
    count: value,
  }));

  // Filtering & Sorting
  const filteredRecords = cpcbRecords
    .filter(record => {
      const matchesSearch = record.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || record.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sortDirection === 'asc' ? a.aqi - b.aqi : b.aqi - a.aqi;
    });

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Good': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
      case 'Satisfactory': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'Moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20';
      case 'Poor': return 'text-orange-400 bg-orange-400/10 border-orange-500/20';
      case 'Very Poor': return 'text-red-400 bg-red-400/10 border-red-500/20';
      default: return 'text-red-600 bg-red-950/20 border-red-600/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-space-cyan/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-orbitron text-white tracking-widest flex items-center gap-2">
            <FileText className="w-5 h-5 text-space-cyan" />
            CPCB SURFACE AQI BULLETINS
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase">
            Official central pollution control board registry • National Grid telemetry
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-3 md:mt-0 text-[10px] font-mono text-slate-400 bg-[#0F172A]/80 border border-space-cyan/15 px-3 py-1.5 rounded-sm">
          <Calendar className="w-3.5 h-3.5 text-space-cyan" />
          <span>PUBLISHED: Jun 27, 2026 @ 16:00 IST</span>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glowColor="cyan" title="BULLETIN COUNT" subtitle="Total cities listed" showCorners={true}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-orbitron font-extrabold text-white">246</div>
              <div className="text-[9px] font-mono text-emerald-400 mt-0.5">COMPREHENSIVE SWATH</div>
            </div>
            <MapPin className="w-8 h-8 text-space-cyan/20" />
          </div>
        </GlassCard>
        
        <GlassCard glowColor="cyan" title="NATIONAL MEAN INDEX" subtitle="Average city AQI" showCorners={true}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-orbitron font-extrabold text-white">{averageAqi}</div>
              <div className="text-[9px] font-mono text-green-400 mt-0.5">SATISFACTORY ZONE</div>
            </div>
            <Activity className="w-8 h-8 text-space-cyan/20" />
          </div>
        </GlassCard>

        <GlassCard glowColor="red" title="CRITICAL EXPOSURES" subtitle="Poor or worse cities" showCorners={true}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-orbitron font-extrabold text-space-red">4</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">ACTION PROTOCOLS ACTIVE</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-space-red/25" />
          </div>
        </GlassCard>

        <GlassCard glowColor="cyan" title="MONITORING STATIONS" subtitle="National Grid Coverage" showCorners={true}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-orbitron font-extrabold text-white">462</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">STATIONS PARTICIPATED</div>
            </div>
            <CheckCircle className="w-8 h-8 text-space-cyan/20" />
          </div>
        </GlassCard>
      </div>

      {/* Main Registry Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main List and Table */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0F172A]/90 p-4 border border-space-cyan/15 rounded-sm">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city registry..."
                className="w-full bg-[#050A15]/90 border border-slate-800 focus:border-space-cyan text-white text-xs pl-9 pr-4 py-2 rounded-sm focus:outline-none placeholder-slate-500 transition-all font-mono"
              />
            </div>

            {/* Category Dropdown Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase whitespace-nowrap">Filter:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#050A15]/90 border border-slate-800 focus:border-space-cyan text-slate-300 text-xs px-3 py-1.5 rounded-sm focus:outline-none font-mono cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Good">Good</option>
                <option value="Satisfactory">Satisfactory</option>
                <option value="Moderate">Moderate</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

          </div>

          {/* Interactive Data Grid Table */}
          <div className="bg-[#060D1A]/95 border border-space-cyan/15 rounded-sm overflow-hidden flex flex-col">
            
            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                {/* Header */}
                <thead>
                  <tr className="border-b border-space-cyan/15 bg-[#0F172A]/90 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3 text-center w-12">S.No</th>
                    <th className="px-4 py-3">City Registry</th>
                    <th className="px-4 py-3 text-center">AQI Rating</th>
                    <th className="px-4 py-3 text-center cursor-pointer hover:bg-space-cyan/5 transition-colors" onClick={toggleSort}>
                      <span className="flex items-center justify-center gap-1">
                        Index Value
                        <ArrowUpDown className="w-3 h-3 text-space-cyan" />
                      </span>
                    </th>
                    <th className="px-4 py-3">Prominent Pollutant</th>
                    <th className="px-4 py-3 text-center">Stations Active</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-slate-900 font-mono text-xs text-slate-200">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                        No records matching query bounds found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.sNo} className="hover:bg-space-cyan/5 transition-colors">
                        <td className="px-4 py-2.5 text-center text-slate-500">{record.sNo}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-100">{record.city}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 text-[9px] border rounded-xs font-bold uppercase inline-block w-24 text-center ${getCategoryColor(record.category)}`}>
                            {record.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center font-bold text-white text-sm">{record.aqi}</td>
                        <td className="px-4 py-2.5 text-slate-400">{record.pollutant}</td>
                        <td className="px-4 py-2.5 text-center text-slate-400">{record.stations}</td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

            {/* Bottom info banner */}
            <div className="border-t border-slate-900 bg-[#0F172A]/70 px-4 py-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Showing {filteredRecords.length} of {totalCities} indexed records</span>
              <span className="text-space-cyan animate-pulse">● CPCB CENTRAL TELEMETRY SYNCED</span>
            </div>

          </div>

        </div>

        {/* Side Panel: Guidelines and Health Impacts */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Health Index Statements panel */}
          <GlassCard glowColor="cyan" title="AQI HEALTH IMPACTS" subtitle="Official CPCB Statements" showCorners={true}>
            <div className="space-y-3 mt-1">
              
              <div className="text-[10px] text-slate-400 font-mono leading-relaxed pb-2">
                Central environmental standard impact profiles mapped to index ranges:
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {healthStatements.map((item, idx) => (
                  <div key={idx} className={`p-2.5 border rounded-sm flex items-start space-x-2 text-[10px] font-mono leading-relaxed ${item.color}`}>
                    <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-current" />
                    <div>
                      <div className="font-bold uppercase flex justify-between gap-2">
                        <span>{item.category}</span>
                        <span className="opacity-75">{item.range}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{item.impact}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </GlassCard>

          {/* Abstract Note */}
          <GlassCard glowColor="orange" title="CPCB DIRECTIVE NOTE" subtitle="Bulletin specifications" showCorners={true}>
            <div className="text-[10px] font-mono text-slate-400 space-y-3 leading-relaxed">
              <div className="flex gap-1.5">
                <Info className="w-4 h-4 text-space-orange flex-shrink-0 mt-0.5" />
                <p>
                  Averages are calculated over the past 24 hours of sensor integration. AQI values representing multiple monitoring stations are unified to represent regional indexes.
                </p>
              </div>
              <div className="flex gap-1.5 border-t border-slate-800/80 pt-3">
                <ShieldAlert className="w-4 h-4 text-space-orange flex-shrink-0 mt-0.5" />
                <p>
                  Official reports verify prominent pollutants are dominated by $PM_{10}$ and $PM_{2.5}$ particles, indicating surface dust suspension and combusive soot accumulation.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

      {/* Analytics statistics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category distribution pie chart */}
        <GlassCard glowColor="cyan" title="AIR QUALITY INDEX BRACKETS" subtitle="City category distribution ratio" showCorners={true}>
          <div className="h-64 flex flex-col md:flex-row items-center justify-center mt-2 gap-4">
            
            {/* Pie chart */}
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      fontSize: '10px',
                      color: '#F8FAFC',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Pie
                    data={chartCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartCategoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS] || '#00F0FF'} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Labels Legend */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-1.5 font-mono text-[9px]">
              {chartCategoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1 border border-slate-900 rounded-sm bg-black/40">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-xs" 
                      style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || '#00F0FF' }} 
                    />
                    <span className="text-slate-300 font-bold uppercase">{item.name}</span>
                  </div>
                  <span className="text-white font-extrabold">{item.value} Cities ({Math.round(item.value / totalCities * 100)}%)</span>
                </div>
              ))}
            </div>

          </div>
        </GlassCard>

        {/* Pollutant frequency bar chart */}
        <GlassCard glowColor="cyan" title="PROMINENT POLLUTANTS IN INDIA" subtitle="Frequency of pollutant dominance across cities" showCorners={true}>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartPollutantData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748B" 
                  fontSize={9} 
                  fontFamily="monospace" 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={9} 
                  fontFamily="monospace" 
                  tickLine={false} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    fontSize: '10px',
                    color: '#F8FAFC',
                    fontFamily: 'monospace'
                  }}
                  cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Dominant Cities" 
                  fill="#00F0FF" 
                  radius={[2, 2, 0, 0]}
                  maxBarSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
