import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wind, 
  AlertTriangle, 
  ThumbsUp, 
  Activity, 
  MapPin, 
  Thermometer, 
  Droplets,
  Heart,
  RefreshCw
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface CityAqiData {
  city: string;
  state: string;
  lat: number;
  lon: number;
  aqi: number;
  pm25: number;
  pm10: number;
  so2: number;
  no2: number;
  co: number;
  temp: number;
  humidity: number;
}

const cityDataList: CityAqiData[] = [
  { city: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, aqi: 324, pm25: 274, pm10: 388, so2: 12.5, no2: 48.2, co: 2.1, temp: 38, humidity: 42 },
  { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, aqi: 84, pm25: 28, pm10: 74, so2: 6.2, no2: 24.5, co: 0.8, temp: 31, humidity: 82 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, aqi: 42, pm25: 11, pm10: 35, so2: 3.1, no2: 12.8, co: 0.4, temp: 27, humidity: 65 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, aqi: 56, pm25: 16, pm10: 48, so2: 5.4, no2: 18.2, co: 0.6, temp: 33, humidity: 75 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, aqi: 142, pm25: 52, pm10: 124, so2: 9.8, no2: 32.4, co: 1.2, temp: 34, humidity: 80 },
  { city: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, aqi: 78, pm25: 25, pm10: 68, so2: 5.1, no2: 22.0, co: 0.7, temp: 32, humidity: 55 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, aqi: 165, pm25: 84, pm10: 154, so2: 8.5, no2: 28.6, co: 1.4, temp: 39, humidity: 38 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, aqi: 62, pm25: 18, pm10: 52, so2: 4.2, no2: 15.6, co: 0.5, temp: 30, humidity: 68 },
  { city: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, aqi: 245, pm25: 195, pm10: 290, so2: 11.2, no2: 41.5, co: 1.8, temp: 36, humidity: 50 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, aqi: 280, pm25: 230, pm10: 320, so2: 12.0, no2: 45.1, co: 1.9, temp: 37, humidity: 48 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, aqi: 128, pm25: 46, pm10: 110, so2: 6.8, no2: 20.4, co: 1.1, temp: 38, humidity: 30 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, aqi: 95, pm25: 32, pm10: 82, so2: 5.8, no2: 19.8, co: 0.9, temp: 35, humidity: 45 },
  { city: "Chandigarh", state: "Punjab", lat: 30.7333, lon: 76.7794, aqi: 115, pm25: 41, pm10: 98, so2: 7.2, no2: 22.5, co: 1.0, temp: 34, humidity: 52 },
  { city: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lon: 74.7973, aqi: 35, pm25: 8, pm10: 28, so2: 2.1, no2: 8.4, co: 0.3, temp: 22, humidity: 60 },
  { city: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, aqi: 130, pm25: 48, pm10: 115, so2: 8.0, no2: 25.4, co: 1.1, temp: 31, humidity: 85 },
  { city: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, aqi: 38, pm25: 9, pm10: 31, so2: 2.8, no2: 11.2, co: 0.4, temp: 30, humidity: 88 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, aqi: 68, pm25: 20, pm10: 58, so2: 4.8, no2: 17.5, co: 0.6, temp: 31, humidity: 78 },
  { city: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, aqi: 188, pm25: 138, pm10: 208, so2: 9.5, no2: 34.6, co: 1.5, temp: 36, humidity: 40 },
  { city: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, aqi: 125, pm25: 45, pm10: 108, so2: 7.0, no2: 23.4, co: 1.0, temp: 32, humidity: 55 },
  { city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, aqi: 48, pm25: 14, pm10: 38, so2: 3.5, no2: 13.2, co: 0.5, temp: 28, humidity: 58 }
];

const calculateIndianAqi = (pm25: number, pm10: number): number => {
  let aqi25 = 0;
  if (pm25 <= 30) aqi25 = (pm25 * 50) / 30;
  else if (pm25 <= 60) aqi25 = 50 + ((pm25 - 30) * 50) / 30;
  else if (pm25 <= 90) aqi25 = 100 + ((pm25 - 60) * 100) / 30;
  else if (pm25 <= 120) aqi25 = 200 + ((pm25 - 90) * 100) / 30;
  else if (pm25 <= 250) aqi25 = 300 + ((pm25 - 120) * 100) / 130;
  else aqi25 = 400 + ((pm25 - 250) * 100) / 150;

  let aqi10 = 0;
  if (pm10 <= 50) aqi10 = (pm10 * 50) / 50;
  else if (pm10 <= 100) aqi10 = 50 + ((pm10 - 50) * 50) / 50;
  else if (pm10 <= 250) aqi10 = 100 + ((pm10 - 100) * 100) / 150;
  else if (pm10 <= 350) aqi10 = 200 + ((pm10 - 250) * 100) / 100;
  else if (pm10 <= 430) aqi10 = 300 + ((pm10 - 350) * 100) / 80;
  else aqi10 = 400 + ((pm10 - 430) * 100) / 100;

  return Math.round(Math.max(aqi25, aqi10));
};

export const AqiIndia: React.FC = () => {
  const [citiesList, setCitiesList] = useState<CityAqiData[]>(cityDataList);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("Delhi");
  const [statusFilter, setStatusFilter] = useState<'all' | 'good' | 'moderate' | 'poor' | 'unhealthy' | 'severe'>('all');
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("SIMULATED");

  const selectedCity = citiesList.find(c => c.city === selectedCityName) || citiesList[0];

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const lats = cityDataList.map(c => c.lat).join(',');
      const lons = cityDataList.map(c => c.lon).join(',');
      
      const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=pm2_5,pm10,nitrogen_dioxide,sulfur_dioxide,carbon_monoxide`);
      const aqiJson = await aqiRes.json();
      
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m`);
      const weatherJson = await weatherRes.json();

      const updatedCities = cityDataList.map((city, index) => {
        const aqiData = Array.isArray(aqiJson) ? aqiJson[index]?.current : aqiJson?.current;
        const weatherData = Array.isArray(weatherJson) ? weatherJson[index]?.current : weatherJson?.current;

        const pm25 = aqiData?.pm2_5 ? Math.round(aqiData.pm2_5) : city.pm25;
        const pm10 = aqiData?.pm10 ? Math.round(aqiData.pm10) : city.pm10;
        const so2 = aqiData?.sulfur_dioxide ? Number((aqiData.sulfur_dioxide).toFixed(1)) : city.so2;
        const no2 = aqiData?.nitrogen_dioxide ? Number((aqiData.nitrogen_dioxide).toFixed(1)) : city.no2;
        const co = aqiData?.carbon_monoxide ? Number((aqiData.carbon_monoxide / 1000).toFixed(2)) : city.co;
        
        const temp = weatherData?.temperature_2m ? Math.round(weatherData.temperature_2m) : city.temp;
        const humidity = weatherData?.relative_humidity_2m ? Math.round(weatherData.relative_humidity_2m) : city.humidity;
        const aqi = calculateIndianAqi(pm25, pm10);

        return {
          ...city,
          aqi,
          pm25,
          pm10,
          so2,
          no2,
          co,
          temp,
          humidity
        };
      });

      setCitiesList(updatedCities);
      setIsLive(true);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching live AQI telemetry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500/20", glow: "glow-emerald", desc: "Minimal impact. Safe for outdoor activities." };
    if (aqi <= 100) return { label: "Satisfactory", color: "text-green-400", bg: "bg-green-400/10 border-green-500/20", glow: "glow-green", desc: "Minor breathing discomfort for sensitive people." };
    if (aqi <= 200) return { label: "Moderate", color: "text-space-orange", bg: "bg-space-orange/10 border-space-orange/20", glow: "glow-orange", desc: "Breathing discomfort to people with lungs, asthma, and heart diseases." };
    if (aqi <= 300) return { label: "Very Poor", color: "text-space-red", bg: "bg-space-red/10 border-space-red/20", glow: "glow-red", desc: "Respiratory illness to the people on prolonged exposure." };
    return { label: "Severe", color: "text-red-600", bg: "bg-red-950/20 border-red-600/30", glow: "glow-red", desc: "Healthy people also experience breathing effects; serious health impact." };
  };

  const filteredCities = citiesList.filter(city => {
    const matchesSearch = city.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          city.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'good') return matchesSearch && city.aqi <= 50;
    if (statusFilter === 'moderate') return matchesSearch && city.aqi > 50 && city.aqi <= 100;
    if (statusFilter === 'poor') return matchesSearch && city.aqi > 100 && city.aqi <= 200;
    if (statusFilter === 'unhealthy') return matchesSearch && city.aqi > 200 && city.aqi <= 300;
    if (statusFilter === 'severe') return matchesSearch && city.aqi > 300;
    return matchesSearch;
  });

  const sortedByPollution = [...citiesList].sort((a, b) => b.aqi - a.aqi);
  const topPolluted = sortedByPollution.slice(0, 5);
  const topCleanest = [...citiesList].sort((a, b) => a.aqi - b.aqi).slice(0, 5);

  const averageNationalAqi = Math.round(citiesList.reduce((acc, c) => acc + c.aqi, 0) / citiesList.length);

  return (
    <div className="space-y-6">
      
      {/* Title Header Panel */}
      <GlassCard glowColor="cyan" showCorners={true} className="relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,240,255,0.4)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-space-cyan tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-space-cyan animate-pulse" />
              <span>LIVE POLLUTION MAP FEED - INDIA</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-orbitron uppercase text-slate-100 tracking-wider">
              REAL-TIME INDIA AQI EXPLORER
            </h2>
            <p className="text-xs text-slate-400 font-inter max-w-xl">
              National Air Quality Index grid surveillance showing real-time particulate concentration (PM2.5, PM10) and ambient chemical telemetry across Indian states.
            </p>
          </div>
          
          <div className="bg-[#050A15] border border-space-cyan/20 px-4 py-2 rounded-sm font-mono text-xs flex items-center space-x-4">
            <div>
              <div className="text-slate-550 text-[9px] uppercase tracking-wider">GRID FEED UPDATE</div>
              <div className="text-space-cyan font-bold flex items-center space-x-1.5 mt-0.5 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-space-orange animate-ping'}`} />
                <span>{lastUpdated}</span>
              </div>
            </div>
            {loading ? (
              <RefreshCw className="w-4 h-4 text-space-cyan animate-spin" />
            ) : (
              <button 
                onClick={fetchLiveData} 
                className="p-1 border border-slate-800 hover:border-slate-600 rounded-sm text-slate-400 hover:text-space-cyan transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Grid Stats Header Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <GlassCard glowColor="cyan" className="flex items-center space-x-4">
          <div className="p-3 rounded-sm border border-space-cyan/30 bg-space-cyan/5 text-space-cyan">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">NATIONAL AVERAGE</div>
            <div className="text-lg font-black font-orbitron text-white mt-0.5">
              <AnimatedCounter value={averageNationalAqi} decimals={0} suffix=" AQI" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glowColor="red" className="flex items-center space-x-4">
          <div className="p-3 rounded-sm border border-space-red/30 bg-space-red/5 text-space-red">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">MOST POLLUTED CITY</div>
            <div className="text-lg font-black font-orbitron text-white mt-0.5">
              DELHI (324)
            </div>
          </div>
        </GlassCard>

        <GlassCard glowColor="orange" className="flex items-center space-x-4">
          <div className="p-3 rounded-sm border border-emerald-500/30 bg-emerald-950/20 text-emerald-400">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">CLEANEST CITY</div>
            <div className="text-lg font-black font-orbitron text-white mt-0.5">
              SRINAGAR (35)
            </div>
          </div>
        </GlassCard>

        <GlassCard glowColor="cyan" className="flex items-center space-x-4">
          <div className="p-3 rounded-sm border border-space-cyan/30 bg-space-cyan/5 text-space-cyan">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">ACTIVE STATIONS</div>
            <div className="text-lg font-black font-orbitron text-white mt-0.5">
              <AnimatedCounter value={248} decimals={0} suffix=" NODES" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Main Grid: Cities Table & Selected City Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cities Table (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <GlassCard title="Real-Time AQI Index Table" subtitle="SELECT CITY TO INSPECT LOCAL POLLUTANTS" glowColor="cyan" className="flex-1 flex flex-col justify-start">
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 mt-2">
              
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city or state..." 
                  className="w-full pl-9 pr-4 py-2 bg-[#050A15] border border-slate-800 rounded-sm font-mono text-xs text-white focus:outline-none focus:border-space-cyan/50 transition-colors"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap bg-[#050A15] border border-slate-850 p-0.5 rounded-sm font-mono text-[9px] gap-0.5">
                {(['all', 'good', 'moderate', 'poor', 'unhealthy', 'severe'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2 py-1 rounded-sm uppercase font-semibold transition-all ${
                      statusFilter === filter
                        ? 'bg-space-cyan/15 text-space-cyan border border-space-cyan/20'
                        : 'text-slate-500 hover:text-slate-350 border border-transparent'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

            </div>

            {/* Scrollable Data Table */}
            <div className="overflow-x-auto border border-slate-900 rounded-sm max-h-[460px] overflow-y-auto pr-1">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#050A15] text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-850">
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3 text-center">AQI Value</th>
                    <th className="py-2.5 px-3 text-center">PM2.5</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => {
                      const category = getAqiCategory(city.aqi);
                      const isSelected = city.city === selectedCityName;
                      return (
                        <tr 
                          key={city.city} 
                          onClick={() => setSelectedCityName(city.city)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-space-cyan/5 border-l-2 border-l-space-cyan' 
                              : 'hover:bg-slate-900/30'
                          }`}
                        >
                          <td className="py-3 px-3 font-semibold text-white">{city.city}</td>
                          <td className="py-3 px-3 text-slate-400">{city.state}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-100">{city.aqi}</td>
                          <td className="py-3 px-3 text-center text-slate-350">{city.pm25} µg/m³</td>
                          <td className={`py-3 px-3 text-center font-semibold ${category.color}`}>
                            <span className={`px-2 py-0.5 rounded-sm border ${category.bg} text-[9.5px]`}>
                              {category.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                        No stations match query filter parameters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </GlassCard>
        </div>

        {/* Selected City Details Panel */}
        <div className="flex flex-col space-y-6">
          <GlassCard title="Station Inspection Profile" subtitle={selectedCity.city.toUpperCase()} glowColor="cyan" className="flex-1">
            <div className="space-y-5 mt-2">
              
              {/* City location details */}
              <div className="flex items-center space-x-2.5 p-2.5 bg-[#050A15] border border-slate-900 rounded-sm">
                <MapPin className="w-4 h-4 text-space-cyan" />
                <div className="font-mono text-xs">
                  <div className="text-white font-bold">{selectedCity.city} Station</div>
                  <div className="text-slate-500 text-[10px] uppercase">{selectedCity.state}, India</div>
                </div>
              </div>

              {/* Large AQI Gauge style */}
              <div className={`p-4 border rounded-sm flex flex-col items-center justify-center text-center ${getAqiCategory(selectedCity.aqi).bg}`}>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AIR QUALITY INDEX</div>
                <div className="text-4xl font-black font-orbitron text-white mt-1.5 tracking-wider">
                  {selectedCity.aqi}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest font-mono mt-1 ${getAqiCategory(selectedCity.aqi).color}`}>
                  {getAqiCategory(selectedCity.aqi).label}
                </div>
                <p className="text-[10.5px] text-slate-400 font-inter mt-3 max-w-[220px]">
                  {getAqiCategory(selectedCity.aqi).desc}
                </p>
              </div>

              {/* Pollutants Breakdown Grid */}
              <div className="space-y-3 font-mono text-xs">
                <div className="text-[10px] text-slate-555 uppercase tracking-wider">PARTICULATE CHEMISTRY</div>
                
                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <div className="text-[9px] text-slate-500">PM2.5 DENSITY</div>
                    <div className="text-sm font-bold text-white mt-0.5">{selectedCity.pm25} <span className="text-[9px] text-slate-500">µg/m³</span></div>
                  </div>

                  <div className="p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <div className="text-[9px] text-slate-500">PM10 DENSITY</div>
                    <div className="text-sm font-bold text-white mt-0.5">{selectedCity.pm10} <span className="text-[9px] text-slate-500">µg/m³</span></div>
                  </div>

                  <div className="p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <div className="text-[9px] text-slate-500">SULFUR DIOXIDE (SO2)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{selectedCity.so2} <span className="text-[9px] text-slate-500">ppb</span></div>
                  </div>

                  <div className="p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <div className="text-[9px] text-slate-500">NITROGEN DIOXIDE (NO2)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{selectedCity.no2} <span className="text-[9px] text-slate-500">ppb</span></div>
                  </div>

                </div>

                {/* Temperature and Humidity stats */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center space-x-2 p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <Thermometer className="w-4 h-4 text-space-orange" />
                    <div>
                      <div className="text-[8px] text-slate-550 leading-none">TEMPERATURE</div>
                      <div className="text-xs font-bold text-white mt-0.5">{selectedCity.temp}°C</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-[#050A15] border border-slate-900 rounded-sm">
                    <Droplets className="w-4 h-4 text-space-cyan" />
                    <div>
                      <div className="text-[8px] text-slate-550 leading-none">HUMIDITY</div>
                      <div className="text-xs font-bold text-white mt-0.5">{selectedCity.humidity}%</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Health Advisory Warning Card */}
              <div className="p-3 border border-slate-800 bg-[#0F172A]/30 rounded-sm space-y-2 text-[10.5px]">
                <div className="flex items-center space-x-2 text-space-cyan font-orbitron font-semibold text-[9px] uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5" />
                  <span>HEALTH RECOMMENDATIONS</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-400">
                  {selectedCity.aqi > 200 ? (
                    <>
                      <div>• 😷 Wear an N95 respirator mask outdoors.</div>
                      <div>• 🏠 Keep windows closed; run air purifiers indoors.</div>
                      <div>• ❌ Avoid outdoor exercise or running.</div>
                    </>
                  ) : selectedCity.aqi > 100 ? (
                    <>
                      <div>• 🏠 Sensitive groups should reduce heavy outdoor exertion.</div>
                      <div>• 🚪 Close windows to avoid indoor dust build-up.</div>
                      <div>• 😷 Consider wearing a mask if you feel discomfort.</div>
                    </>
                  ) : (
                    <>
                      <div>• 🌳 Air quality is ideal for outdoor activities.</div>
                      <div>• 🍃 Open windows to let fresh outdoor air circulate.</div>
                      <div>• 👍 No special precautions required.</div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </GlassCard>
        </div>

      </div>

      {/* Leaderboard Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Polluted Leaderboard */}
        <GlassCard title="Top 5 Most Polluted Cities" subtitle="HIGHEST AQI RECORDED BY STATION NODES" glowColor="red">
          <div className="space-y-2 mt-1">
            {topPolluted.map((city, index) => {
              const category = getAqiCategory(city.aqi);
              return (
                <div key={city.city} className="flex items-center justify-between p-2.5 bg-[#050A15] border border-slate-900 hover:border-slate-850 rounded-sm font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-bold w-4">#{index + 1}</span>
                    <div className="space-y-0.5">
                      <div className="text-white font-bold">{city.city}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{city.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-space-red">{city.aqi} AQI</span>
                    <div className={`text-[8.5px] font-bold ${category.color}`}>{category.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Cleanest Leaderboard */}
        <GlassCard title="Top 5 Cleanest Cities" subtitle="LOWEST AQI RECORDED BY STATION NODES" glowColor="cyan">
          <div className="space-y-2 mt-1">
            {topCleanest.map((city, index) => {
              const category = getAqiCategory(city.aqi);
              return (
                <div key={city.city} className="flex items-center justify-between p-2.5 bg-[#050A15] border border-slate-900 hover:border-slate-850 rounded-sm font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-bold w-4">#{index + 1}</span>
                    <div className="space-y-0.5">
                      <div className="text-white font-bold">{city.city}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{city.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">{city.aqi} AQI</span>
                    <div className={`text-[8.5px] font-bold ${category.color}`}>{category.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

      </div>

    </div>
  );
};
