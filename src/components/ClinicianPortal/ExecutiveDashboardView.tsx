import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  Calendar, 
  Download, 
  RefreshCw, 
  DollarSign, 
  Activity, 
  Zap, 
  FileText,
  LineChart,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { NETWORK_HOSPITALS, HospitalFacility } from '../../data/hospitalNetwork';

interface ExecutiveDashboardViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients?: SyntheticPatient[];
  selectedHospital?: HospitalFacility;
  onGoBack?: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  currentUser,
  purposeOfUse,
  patients = [],
  selectedHospital,
  onGoBack,
}) => {
  const { isDark } = useTheme();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(selectedHospital?.id || 'hosp-all');
  const [timePeriod, setTimePeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeFacility = useMemo(() => {
    return NETWORK_HOSPITALS.find((h) => h.id === selectedFacilityId) || NETWORK_HOSPITALS[0];
  }, [selectedFacilityId]);

  // Dynamic multiplier based on selected facility to ensure statistics adjust dynamically
  const facilityMultiplier = useMemo(() => {
    if (selectedFacilityId === 'hosp-all') return 1.0;
    if (selectedFacilityId === 'hosp-01') return 0.38; // St. Jude
    if (selectedFacilityId === 'hosp-02') return 0.28; // Metropolitan General
    if (selectedFacilityId === 'hosp-03') return 0.18; // Mercy Community
    return 0.16; // St. Luke Surgical
  }, [selectedFacilityId]);

  // Scaled statistics matching user screenshot baseline (8542 patients, 1248 hrs, -40%, 62%, 0 incidents)
  const stats = useMemo(() => {
    const periodMult = timePeriod === 'MONTH' ? 1.0 : timePeriod === 'QUARTER' ? 2.8 : 10.5;
    const combinedMult = facilityMultiplier * periodMult;

    return {
      patientsImpacted: Math.round(8542 * combinedMult).toLocaleString(),
      timeSavedHours: Math.round(1248 * combinedMult).toLocaleString(),
      timeSavedTrend: '18.9%',
      documentationTimeReduction: '-40%',
      automationRate: '62%',
      safetyIncidents: 0,
      safetyIncidentRate: '(0.0%)',
      costAvoidanceDollars: `$${Math.round(342800 * combinedMult).toLocaleString()}`,
      chartReviewTime: '3.4 mins',
      chartReviewBaseline: '8.5 mins',
      aiPrecisionScore: '99.4%',
      readmissionReduction: '-14.8%',
    };
  }, [facilityMultiplier, timePeriod]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExportReport = () => {
    const reportData = `Executive Clinical AI Impact Summary
Facility: ${activeFacility.name}
Period: ${timePeriod}
Patients Impacted: ${stats.patientsImpacted}
Time Saved: ${stats.timeSavedHours} hrs
Documentation Reduction: ${stats.documentationTimeReduction}
Automation Rate: ${stats.automationRate}
Safety Incidents: ${stats.safetyIncidents}
Cost Avoidance: ${stats.costAvoidanceDollars}
AI Precision: ${stats.aiPrecisionScore}`;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Executive_Dashboard_${activeFacility.code}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Header Banner - NO '17.' number as requested */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Executive Dashboard
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
                ENTERPRISE METRICS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High-level impact analytics on clinical time savings, documentation reduction, AI automation rate, and safety compliance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Period Filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setTimePeriod('MONTH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timePeriod === 'MONTH' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriod('QUARTER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timePeriod === 'QUARTER' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimePeriod('YEAR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timePeriod === 'YEAR' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Year
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Dynamic Multi-Hospital Scope Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900/80 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Multi-Hospital Network Context:
            </label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className={`mt-0.5 px-3 py-1 rounded-xl text-xs font-extrabold focus:outline-none cursor-pointer border ${
                isDark ? 'bg-slate-950 border-cyan-500/40 text-cyan-300' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              {NETWORK_HOSPITALS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center gap-2">
            <span className="text-slate-400">EHR System:</span>
            <strong className="text-cyan-300">{activeFacility.ehrSystem}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Mesh Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5 TOP EXECUTIVE KPI METRIC CARDS (EXACT MATCH TO REFERENCE SCREENSHOT)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Patients Impacted */}
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patients Impacted</span>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-white">{stats.patientsImpacted}</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>Aggregated patient cohort</span>
          </div>
        </div>

        {/* Card 2: Time Saved (hrs) */}
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Saved (hrs)</span>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-white">{stats.timeSavedHours}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              <span>{stats.timeSavedTrend}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <span>Clinician workflow gain</span>
          </div>
        </div>

        {/* Card 3: Documentation Time */}
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documentation Time</span>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-blue-400">{stats.documentationTimeReduction}</div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <span>Chart note burden reduction</span>
          </div>
        </div>

        {/* Card 4: Automation Rate */}
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automation Rate</span>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-blue-400">{stats.automationRate}</div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <span>AI task delegation index</span>
          </div>
        </div>

        {/* Card 5: Safety Incidents */}
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Incidents</span>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-white">{stats.safetyIncidents}</div>
            <div className="text-xs font-bold text-slate-400 mt-1">
              <span>{stats.safetyIncidentRate}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <span>Zero hallucination threshold</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 MAIN VISUALIZATION PANELS (EXACT MATCH TO REFERENCE SCREENSHOT)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Visual Panel: Value Realized (Bar Chart) */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Value Realized</h3>
              <p className="text-xs text-slate-400">Cumulative productivity gains across clinical operations</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Hours Realized
            </span>
          </div>

          {/* Custom SVG / HTML Responsive Bar Chart */}
          <div className="pt-4 pb-2 px-2">
            <div className="h-64 flex items-end justify-between gap-6 border-b border-white/10 pb-2 relative">
              {/* Grid Y-axis background lines */}
              <div className="absolute inset-x-0 top-0 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">1200</div>
              <div className="absolute inset-x-0 top-1/4 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">900</div>
              <div className="absolute inset-x-0 top-2/4 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">600</div>
              <div className="absolute inset-x-0 top-3/4 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">300</div>

              {/* Bar 1: Documentation Time Saved */}
              <div className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                <div className="text-[11px] font-bold text-blue-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  420 hrs
                </div>
                <div 
                  className="w-full max-w-[64px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-500/20"
                  style={{ height: '35%' }}
                />
              </div>

              {/* Bar 2: Faster Decisions */}
              <div className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                <div className="text-[11px] font-bold text-blue-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  780 hrs
                </div>
                <div 
                  className="w-full max-w-[64px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-500/20"
                  style={{ height: '65%' }}
                />
              </div>

              {/* Bar 3: Better Care Coordination */}
              <div className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                <div className="text-[11px] font-bold text-blue-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  1,050 hrs
                </div>
                <div 
                  className="w-full max-w-[64px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-500/20"
                  style={{ height: '85%' }}
                />
              </div>

              {/* Bar 4: Clinician Productivity */}
              <div className="flex-1 flex flex-col items-center gap-2 group z-10 h-full justify-end">
                <div className="text-[11px] font-bold text-blue-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  1,248 hrs
                </div>
                <div 
                  className="w-full max-w-[64px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-blue-500/30"
                  style={{ height: '98%' }}
                />
              </div>
            </div>

            {/* X-Axis Category Labels */}
            <div className="grid grid-cols-4 gap-2 pt-3 text-center text-[10px] font-bold text-slate-400">
              <div>Documentation<br />Time Saved</div>
              <div>Faster<br />Decisions</div>
              <div>Better Care<br />Coordination</div>
              <div>Clinician<br />Productivity</div>
            </div>
          </div>
        </div>

        {/* Right Visual Panel: AI Performance Trend (Multi-Line Chart) */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold tracking-tight">AI Performance Trend</h3>
              <p className="text-xs text-slate-400">Accuracy & precision progression across query volume batches</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Model Accuracy
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Precision Index
              </span>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="pt-2 pb-2">
            <div className="h-64 relative flex flex-col justify-between">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                {/* Background Grid Lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="0" y1="200" x2="500" y2="200" stroke="currentColor" strokeOpacity="0.1" />

                {/* Line 1: Model Accuracy (Upper Line) */}
                <path
                  d="M 10 130 L 80 110 L 150 85 L 220 70 L 290 90 L 360 60 L 430 55 L 490 20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Line 1 Points */}
                {[
                  { x: 10, y: 130 }, { x: 80, y: 110 }, { x: 150, y: 85 }, { x: 220, y: 70 },
                  { x: 290, y: 90 }, { x: 360, y: 60 }, { x: 430, y: 55 }, { x: 490, y: 20 }
                ].map((pt, i) => (
                  <circle key={`l1-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                ))}

                {/* Line 2: Precision Index (Lower Line) */}
                <path
                  d="M 10 160 L 80 165 L 150 150 L 220 130 L 290 145 L 360 120 L 430 135 L 490 100"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Line 2 Points */}
                {[
                  { x: 10, y: 160 }, { x: 80, y: 165 }, { x: 150, y: 150 }, { x: 220, y: 130 },
                  { x: 290, y: 145 }, { x: 360, y: 120 }, { x: 430, y: 135 }, { x: 490, y: 100 }
                ].map((pt, i) => (
                  <circle key={`l2-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                ))}
              </svg>
            </div>

            {/* X-Axis Batch Labels */}
            <div className="flex justify-between pt-3 text-[10px] font-mono text-slate-400 px-1">
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
              <span>600</span>
              <span>700</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ADDITIONAL NECESSARY EXECUTIVE STATISTICS                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Cost Avoidance */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-md ${
          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Est. Cost Avoidance</span>
            <div className="text-lg font-black text-white">{stats.costAvoidanceDollars}</div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Avoided overtime & readmissions</span>
          </div>
        </div>

        {/* Metric 2: Time Per Chart Review */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-md ${
          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Time per Chart Review</span>
            <div className="text-lg font-black text-white">{stats.chartReviewTime}</div>
            <span className="text-[10px] text-blue-400 font-mono font-bold">vs {stats.chartReviewBaseline} baseline (-60%)</span>
          </div>
        </div>

        {/* Metric 3: AI Grounded Precision */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-md ${
          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Precision Score</span>
            <div className="text-lg font-black text-white">{stats.aiPrecisionScore}</div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Zero hallucination threshold</span>
          </div>
        </div>

        {/* Metric 4: Readmission Reduction */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-md ${
          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Readmission Reduction</span>
            <div className="text-lg font-black text-white">{stats.readmissionReduction}</div>
            <span className="text-[10px] text-purple-400 font-mono font-bold">30-day post-discharge cohort</span>
          </div>
        </div>
      </div>
    </div>
  );
};
