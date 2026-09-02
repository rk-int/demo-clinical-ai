import React from 'react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../../../types';
import { HomeMetricDetailsPanel, MetricCategory } from './HomeMetricDetailsPanel';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Stethoscope,
  HeartPulse
} from 'lucide-react';

interface HomeDashboardViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients: SyntheticPatient[];
  onSelectPatient: (patientId: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  purposeOfUse,
  patients,
  onSelectPatient,
  onNavigateToTab,
}) => {
  const { isDark } = useTheme();
  const [selectedMetric, setSelectedMetric] = React.useState<MetricCategory | null>(null);

  const assignedPatients = patients.filter(p => currentUser.assignedPatientIds.includes(p.id));
  const activeCensus = assignedPatients.length > 0 ? assignedPatients : patients;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border-slate-800' : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentUser.role} • {currentUser.department}
            </span>
            <span className="text-xs text-slate-400">{currentUser.hospitalSite}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Welcome back, {currentUser.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time longitudinal telemetry, FHIR clinical pipelines, and multi-agent AI copilot active.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateToTab('PATIENTS')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span>View All Patients</span>
          </button>
          <button
            onClick={() => onNavigateToTab('KNOWLEDGE_QA')}
            className="px-3.5 py-2 rounded-xl border border-blue-500/30 hover:bg-blue-600/10 text-blue-300 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ask Clinical AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedMetric('PATIENTS_SEEN')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedMetric === 'PATIENTS_SEEN' ? 'ring-2 ring-blue-500' : ''
          } ${isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Census</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{activeCensus.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active longitudinal records</div>
        </button>

        <button
          onClick={() => setSelectedMetric('ALERTS')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedMetric === 'ALERTS' ? 'ring-2 ring-rose-500' : ''
          } ${isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Biomarkers</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">
            {patients.reduce((acc, p) => acc + p.observations.filter(o => o.status === 'CRITICAL' || o.status === 'ABNORMAL_HIGH').length, 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring provider attention</div>
        </button>

        <button
          onClick={() => setSelectedMetric('PENDING_APPROVALS')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedMetric === 'PENDING_APPROVALS' ? 'ring-2 ring-emerald-500' : ''
          } ${isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Co-Signs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">3</div>
          <div className="text-[11px] text-slate-400 mt-1">Human-in-the-loop approvals</div>
        </button>

        <button
          onClick={() => setSelectedMetric('TASKS')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedMetric === 'TASKS' ? 'ring-2 ring-cyan-500' : ''
          } ${isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Care Tasks</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">8</div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled clinical tasks</div>
        </button>
      </div>

      {/* Selected Metric Details Drawer */}
      {selectedMetric && (
        <HomeMetricDetailsPanel
          category={selectedMetric}
          onClose={() => setSelectedMetric(null)}
          onSelectCategory={(cat) => setSelectedMetric(cat)}
          patients={patients}
          currentUser={currentUser}
          purposeOfUse={purposeOfUse}
          onOpenPatient360={(pid) => {
            onSelectPatient(pid);
            onNavigateToTab('PATIENTS');
          }}
          onOpenKnowledgeQA={(query, pat) => {
            if (typeof pat === 'string') {
              onSelectPatient(pat);
            } else if (pat && pat.id) {
              onSelectPatient(pat.id);
            }
            onNavigateToTab('KNOWLEDGE_QA');
          }}
          isDark={isDark}
        />
      )}

      {/* Patient Census List */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200">Patient Longitudinal Census</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{activeCensus.length} Patients Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeCensus.map((patient) => (
            <div
              key={patient.id}
              onClick={() => {
                onSelectPatient(patient.id);
                onNavigateToTab('PATIENTS');
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isDark ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-bold text-xs text-slate-100">{patient.fullName}</div>
                  <div className="text-[11px] text-slate-400">MRN: {patient.mrn} • Age: {patient.age} ({patient.gender})</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {patient.roomBed || 'Outpatient'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 mb-2 truncate">
                Conditions: {patient.conditions.map(c => c.name).join(', ')}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/40">
                <span>{patient.observations.length} Labs • {patient.medications.length} Meds</span>
                <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                  View 360 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
