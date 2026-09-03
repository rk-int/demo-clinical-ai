import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Bot, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  LineChart, 
  Network, 
  Settings, 
  Search, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  Sparkles, 
  FileText, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ChevronRight, 
  Sun, 
  Moon, 
  LogOut, 
  Shield, 
  HeartHandshake, 
  Cpu,
  X,
  Stethoscope,
  Lock,
  ArrowLeft,
  Download,
  User
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PatientSearchView } from './ClinicianPortal/PatientSearchView';
import { Patient360View } from './ClinicianPortal/Patient360View';
import { KnowledgeQAView } from './ClinicianPortal/KnowledgeQAView';
import { WorkflowWorkspaceView } from './ClinicianPortal/WorkflowWorkspaceView';
import { SafetyAuditView } from './ClinicianPortal/SafetyAuditView';
import { AgentOperationsDashboard } from './AgentOperations/AgentOperationsDashboard';
import { DocumentIngestionView } from './ClinicianPortal/DocumentIngestionView';
import { EvaluationLifecycleVisualizer } from './AgentOperations/EvaluationLifecycleVisualizer';
import { AIJudgeGovernanceView } from './AgentOperations/AIJudgeGovernanceView';
import { PostgreSQLArchitectureView } from './DataArchitecture/PostgreSQLArchitectureView';
import { AIGatewayView } from './AgentOperations/AIGatewayView';
import { LlmGatewayGuardrailsView } from './AgentOperations/LlmGatewayGuardrailsView';
import { HomeMetricDetailsPanel, MetricCategory } from './ClinicianPortal/HomeMetricDetailsPanel';
import { ClinicalReportsCenterView } from './ClinicianPortal/ClinicalReportsCenterView';
import { RegisterNewPatientModal } from './ClinicianPortal/RegisterNewPatientModal';
import { ExportZipModal } from './ExportZipModal';
import { getUserAvatarUrl } from '../utils/patientAvatar';
import { AuditComplianceCenterView } from './ClinicianPortal/AuditComplianceCenterView';
import { AppointmentsCenterView } from './ClinicianPortal/AppointmentsCenterView';
import { ExecutiveDashboardView } from './ClinicianPortal/ExecutiveDashboardView';
import { AwsTechStackView } from './ClinicianPortal/AwsTechStackView';
import { FileUp, GitBranch, Scale, Database as DatabaseIcon, Server } from 'lucide-react';
import { HospitalNetworkSelector } from './HospitalNetworkSelector';
import { NETWORK_HOSPITALS, HospitalFacility } from '../data/hospitalNetwork';


export type WorkspaceTab = 
  | 'HOME' 
  | 'PATIENTS' 
  | 'AI_ASSISTANT' 
  | 'WORKFLOW' 
  | 'INGESTION'
  | 'AI_GATEWAY'
  | 'LLM_GUARDRAILS'
  | 'EVALUATION_DAG'
  | 'AI_JUDGE'
  | 'POSTGRES'
  | 'APPOINTMENTS' 
  | 'REPORTS' 
  | 'OBSERVABILITY' 
  | 'AGENT_MONITOR' 
  | 'AUDIT_CENTER'
  | 'EXECUTIVE_DASHBOARD'
  | 'AWS_TECH_STACK'
  | 'SETTINGS';

interface HealthNetWorkspaceProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  setPurposeOfUse: (purpose: PurposeOfUse) => void;
  patients: SyntheticPatient[];
  selectedPatient: SyntheticPatient;
  onSelectPatient: (patientId: string) => void;
  onRegisterNewPatient: (patient: SyntheticPatient) => void;
  onDeletePatient?: (patientId: string) => void;
  onSignOut: () => void;
  onSwitchUser?: () => void;
}

export const HealthNetWorkspace: React.FC<HealthNetWorkspaceProps> = ({
  currentUser,
  purposeOfUse,
  setPurposeOfUse,
  patients,
  selectedPatient,
  onSelectPatient,
  onRegisterNewPatient,
  onDeletePatient,
  onSignOut,
  onSwitchUser,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('HOME');
  const [tabHistory, setTabHistory] = useState<WorkspaceTab[]>(['HOME']);
  const [patientViewMode, setPatientViewMode] = useState<'SEARCH' | '360'>('360');

  const navigateToTab = (newTab: WorkspaceTab) => {
    if (newTab === activeTab) return;
    setTabHistory((prev) => [...prev, activeTab]);
    setActiveTab(newTab);
  };

  const handleGoBack = () => {
    if (activeTab === 'PATIENTS' && patientViewMode === '360') {
      setPatientViewMode('SEARCH');
      return;
    }
    if (tabHistory.length > 0) {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory((h) => h.slice(0, -1));
      setActiveTab(prev || 'HOME');
    } else {
      setActiveTab('HOME');
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [qaPrefilledQuery, setQaPrefilledQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<HospitalFacility>(NETWORK_HOSPITALS[0]);

  const [qaAttachedPatient, setQaAttachedPatient] = useState<SyntheticPatient | null>(null);
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<MetricCategory | null>(null);

  const handleOpenKnowledgeQA = (query: string, patientRef?: SyntheticPatient | string) => {
    setQaPrefilledQuery(query || '');
    if (patientRef) {
      if (typeof patientRef === 'object' && patientRef !== null) {
        setQaAttachedPatient(patientRef);
        onSelectPatient(patientRef.id);
      } else if (typeof patientRef === 'string') {
        const found = patients.find(p => p.id === patientRef || p.mrn === patientRef);
        if (found) {
          setQaAttachedPatient(found);
          onSelectPatient(found.id);
        }
      }
    } else if (selectedPatient) {
      setQaAttachedPatient(selectedPatient);
    }
    setActiveTab('AI_ASSISTANT');
  };

  // Role display styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DOCTOR':
      case 'PHYSICIAN':
        return { title: 'Cardiologist & Attending Doctor', tag: 'Attending MD', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'NURSE':
        return { title: 'Clinical Staff Nurse (RN)', tag: 'Acute Care RN', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'SPECIALIST':
        return { title: 'Clinical Specialist & Surgeon', tag: 'Consultant MD', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      case 'CARE_COORDINATOR':
        return { title: 'Care Coordinator & Social Work', tag: 'Care Coord', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'CLINICIAN':
        return { title: 'Attending Clinician (MD/DO)', tag: 'Clinician', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'PORTAL_ADMIN':
        return { title: 'Enterprise Portal & AI Governance Admin', tag: 'Portal Admin', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case 'AUDITOR':
        return { title: 'HIPAA & Compliance Auditor', tag: 'Lead Auditor', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      default:
        return { title: 'Clinical Practitioner', tag: 'Clinician', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);
  const isAdmin = currentUser.role === 'PORTAL_ADMIN';

  const renderRestrictedAdminBanner = (featureTitle: string) => (
    <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[60vh]">
      <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl text-center space-y-4 ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            Admin & Portal Admin Gated
          </span>
          <h2 className="text-xl font-bold mt-2">Restricted: {featureTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access to this operational and architecture layer is restricted exclusively to <strong>Administrator</strong> and <strong>Portal Admin</strong> logins. Current role: <span className="text-cyan-400 font-semibold">{currentUser.role.replace('_', ' ')}</span>.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('HOME')}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
          >
            Return to Clinical Home
          </button>
          {onSwitchUser && (
            <button
              onClick={onSwitchUser}
              className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-all"
            >
              Switch to Admin Account
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Filter patients for header search dropdown
  const filteredSearchPatients = searchQuery.trim()
    ? patients.filter(p => 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Recent 3 patients (dynamically prioritize newest/active patients)
  const recentPatients = patients.slice(0, 3);

  const notificationsList = [
    {
      id: 'notif-1',
      title: 'Critical Lab Alert: K+ 6.2 mmol/L',
      detail: 'Elena Rostova (Cardiology Bed 412) - Hyperkalemia detected',
      time: '10m ago',
      type: 'CRITICAL',
    },
    {
      id: 'notif-2',
      title: 'Pending Discharge Approval',
      detail: 'Jane Smith (Med 3W) ready for clinical note sign-off',
      time: '25m ago',
      type: 'APPROVAL',
    },
    {
      id: 'notif-3',
      title: 'AI Cross-EHR Reconciliation Complete',
      detail: '3 FHIR provenance records verified across Quest & Cerner',
      time: '1h ago',
      type: 'SYSTEM',
    }
  ];

  return (
    <div className={`relative flex min-h-screen font-sans ${isDark ? 'bg-[#0B1120] text-slate-100' : 'bg-[#F4F7FB] text-slate-900'}`}>
      
      {/* ========================================================================= */}
      {/* LEFT NAVIGATION SIDEBAR (Matching Screen 3)                                */}
      {/* ========================================================================= */}
      <aside className={`w-64 shrink-0 flex flex-col justify-between border-r transition-colors duration-200 z-30 ${
        isDark 
          ? 'bg-[#090E1A] border-white/10' 
          : 'bg-[#0A1128] border-slate-800 text-white'
      }`}>
        
        {/* Top Header Logo & Return */}
        <div>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                {/* HealthNet Cross Icon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-5 bg-white rounded-sm absolute"></div>
                </div>
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  HealthNet <span className="text-cyan-400">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Clinical Assistant</p>
              </div>
            </div>
            
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Return to Hospital World / Sign Out"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          {/* Quick Return to Hospital World Nav Link */}
          <div className="px-3 pt-2">
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Return to Hospital World
              </span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('HOME')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'HOME'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('PATIENTS');
                setPatientViewMode('SEARCH');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'PATIENTS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patients</span>
            </button>

            <button
              onClick={() => setActiveTab('AI_ASSISTANT')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'AI_ASSISTANT'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('WORKFLOW')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'WORKFLOW'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Workflow</span>
            </button>

            {/* Admin & Architecture Section (Restricted to Administrator and Portal Admin roles only) */}
            {isAdmin && (
              <>
                <div className="pt-2 pb-1 px-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Admin & Architecture</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">Admin Only</span>
                </div>

                <button
                  onClick={() => setActiveTab('INGESTION')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'INGESTION'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileUp className="w-4 h-4 text-cyan-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>RAG Ingestion</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">5-Stage</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('AI_GATEWAY')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'AI_GATEWAY'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>AI Gateway</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Live Graph</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('LLM_GUARDRAILS')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'LLM_GUARDRAILS'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>LLM Guardrails</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Pre/Post</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('EVALUATION_DAG')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'EVALUATION_DAG'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <GitBranch className="w-4 h-4 text-indigo-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>Evaluation DAG</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">14-Stage</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('AI_JUDGE')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'AI_JUDGE'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>AI Judge & Self-Imp</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${currentUser.role === 'PORTAL_ADMIN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {currentUser.role === 'PORTAL_ADMIN' ? 'Admin' : 'RBAC'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('POSTGRES')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'POSTGRES'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <DatabaseIcon className="w-4 h-4 text-emerald-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>PostgreSQL Layer</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">RDS</span>
                  </div>
                </button>
              </>
            )}

            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Operations</span>
            </div>

            <button
              onClick={() => setActiveTab('APPOINTMENTS')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'APPOINTMENTS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </button>

            <button
              onClick={() => setActiveTab('REPORTS')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'REPORTS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('OBSERVABILITY')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'OBSERVABILITY'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LineChart className="w-4 h-4 text-purple-400" />
              <span>Dashboard</span>
            </button>

            {/* Executive Dashboard: Visible to ALL USERS */}
            <button
              onClick={() => setActiveTab('EXECUTIVE_DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'EXECUTIVE_DASHBOARD'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Executive Dashboard</span>
            </button>

            {/* Agent Monitor & Audit Center: ONLY visible under Operations for Portal Admin */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('AGENT_MONITOR')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'AGENT_MONITOR'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>Agent Monitor</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Admin</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('AUDIT_CENTER')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'AUDIT_CENTER'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>Audit & Compliance</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Admin</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('AWS_TECH_STACK')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'AWS_TECH_STACK'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Server className="w-4 h-4 text-amber-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>Tech Stack</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Admin</span>
                  </div>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'SETTINGS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile Card in Sidebar */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser.role === 'DOCTOR' ? 'Cardiologist' : currentUser.department}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-[9px] text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Dedicated Sign Out & Return Action */}
          <button
            onClick={onSignOut}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            title="Sign Out of workspace and return to Hospital World"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out & Return</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEW CONTAINER                                                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className={`h-16 px-6 border-b flex items-center justify-between gap-4 transition-colors z-20 ${
          isDark 
            ? 'bg-[#0B1120]/90 border-white/10 backdrop-blur-xl' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Back button if not on Home Screen */}
          {activeTab !== 'HOME' && (
            <button
              onClick={handleGoBack}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm ${
                isDark 
                  ? 'bg-blue-950/60 border-blue-500/30 text-blue-300 hover:bg-blue-900/80 hover:text-white' 
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
              title="Go back to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search patient or MRN, name, DOB..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-slate-900/90 border-white/10 text-white placeholder-slate-400 focus:bg-slate-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white'
                }`}
              />
            </div>

            {/* Quick search popup results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className={`absolute top-full left-0 right-0 mt-1.5 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="p-2 border-b border-white/10 text-[11px] font-semibold text-slate-400">
                  Matching Patients ({filteredSearchPatients.length})
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredSearchPatients.length > 0 ? (
                    filteredSearchPatients.map(patient => (
                      <div
                        key={patient.id}
                        onMouseDown={() => {
                          onSelectPatient(patient.id);
                          setActiveTab('PATIENTS');
                          setPatientViewMode('360');
                          setSearchQuery('');
                        }}
                        className={`p-3 flex items-center justify-between hover:bg-blue-600/10 cursor-pointer border-b last:border-none ${
                          isDark ? 'border-white/5' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                            {patient.fullName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{patient.fullName}</p>
                            <p className="text-[10px] text-slate-400">MRN: {patient.mrn} • {patient.age}Y • {patient.gender}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching patient found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-white/10 text-amber-400 hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-white/10' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
                  isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold">Clinical Alerts & Notifications</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">3 New</span>
                  </div>
                  <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                    {notificationsList.map(n => (
                      <div key={n.id} className="p-3 hover:bg-blue-600/10 transition-colors">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-tight">{n.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{n.detail}</p>
                            <span className="text-[9px] text-slate-500 mt-1 inline-block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Bubble */}
            <button
              onClick={() => setActiveTab('AI_ASSISTANT')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Clinical Assistant Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Global Multi-Hospital Selector in Top Navbar */}
            <div className="hidden lg:block">
              <HospitalNetworkSelector
                selectedHospitalId={selectedHospital.id}
                onSelectHospital={setSelectedHospital}
                isDark={isDark}
              />
            </div>

            {/* Export ZIP Project Button (Portal Admin Only) */}
            {currentUser?.role === 'PORTAL_ADMIN' && (
              <button
                onClick={() => setExportModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isDark 
                    ? 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300 hover:text-white' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title="Download full project source code as a ZIP archive (27.0 MB)"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Export ZIP (27MB)</span>
              </button>
            )}


            {/* Direct Header Sign Out & Return Button */}
            <button
              onClick={onSignOut}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                isDark 
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white border-rose-500/30' 
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
              }`}
              title="Sign Out of workspace and return to Hospital World"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out & Return</span>
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate max-w-[130px]">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none">{roleInfo.tag}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  {/* Backdrop click dismiss */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)} 
                  />
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-fade-in ${
                    isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className="p-3.5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img
                          src={getUserAvatarUrl(currentUser)}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-blue-500/40 shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-blue-500 font-medium truncate">{roleInfo.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{currentUser.hospitalSite}</p>
                        </div>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> MFA Authenticated • HIPAA Verified
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('SETTINGS');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-blue-600/10 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings & IAM Role
                      </button>

                      {onSwitchUser && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSwitchUser();
                          }}
                          className="w-full px-3 py-2 text-left text-xs rounded-xl hover:bg-blue-600/10 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Users className="w-3.5 h-3.5 text-cyan-400" /> Switch Clinical User
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSignOut();
                        }}
                        className="w-full px-3 py-2 text-left text-xs rounded-xl text-rose-400 hover:bg-rose-500/15 flex items-center gap-2 cursor-pointer font-bold border-t border-white/5 mt-1 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out & Return to Hospital
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* TAB 1: HOME DASHBOARD (Exact representation of Screen 3)                   */}
        {/* ========================================================================= */}
        {activeTab === 'HOME' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
            
            {/* Top Welcome Header & Facility Indicator */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Doctor Avatar Photo */}
                <div className="relative group shrink-0">
                  <img
                    src={getUserAvatarUrl(currentUser)}
                    alt={currentUser.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-500/80 shadow-xl ring-4 ring-blue-500/20 transition-transform group-hover:scale-105"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Welcome, {currentUser.name} <span className="animate-pulse">👋</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Here's what's happening today.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Hospital Network Selector */}
              <HospitalNetworkSelector
                selectedHospitalId={selectedHospital.id}
                onSelectHospital={setSelectedHospital}
                isDark={isDark}
              />
            </div>

            {/* Multi-Hospital Network Status Overview Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md shadow-lg ${
              isDark ? 'bg-slate-900/80 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Multi-Hospital Healthcare Network: <span className="text-cyan-400 font-extrabold">{selectedHospital.name}</span>
                    </h3>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      4 REGIONAL SITES
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    EHR System: <strong className="text-cyan-300">{selectedHospital.ehrSystem}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2">
                  <span className="text-slate-400">Total Network Beds:</span>
                  <strong className="text-white">{selectedHospital.occupiedBeds} / {selectedHospital.totalBeds}</strong>
                  <span className="text-emerald-400 font-bold">({Math.round((selectedHospital.occupiedBeds / selectedHospital.totalBeds) * 100)}%)</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Cross-Facility Sync Active ⚡</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 4 KEY METRIC CARDS                                                        */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Patients Seen Today */}
              <div 
                onClick={() => setSelectedMetricCategory(selectedMetricCategory === 'PATIENTS_SEEN' ? null : 'PATIENTS_SEEN')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer flex items-start justify-between relative group ${
                  selectedMetricCategory === 'PATIENTS_SEEN'
                    ? isDark 
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' 
                      : 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10'
                    : isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-blue-500/40' 
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    selectedMetricCategory === 'PATIENTS_SEEN'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight leading-none">12</div>
                    <p className="text-xs font-bold text-slate-400 mt-1 group-hover:text-blue-400 transition-colors">Patients Seen Today</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-1">
                      <span>↑ 18% vs yesterday</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl font-mono whitespace-nowrap shrink-0 transition-all ${
                    selectedMetricCategory === 'PATIENTS_SEEN'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 group-hover:bg-blue-500/20 group-hover:text-blue-300 border border-white/10'
                  }`}>
                    {selectedMetricCategory === 'PATIENTS_SEEN' ? 'Active' : 'Click to View'}
                  </span>
                </div>
              </div>

              {/* Stat 2: Pending Approvals */}
              <div 
                onClick={() => setSelectedMetricCategory(selectedMetricCategory === 'PENDING_APPROVALS' ? null : 'PENDING_APPROVALS')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer flex items-start justify-between relative group ${
                  selectedMetricCategory === 'PENDING_APPROVALS'
                    ? isDark 
                      ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' 
                      : 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30 shadow-md shadow-purple-500/10'
                    : isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-purple-500/40' 
                      : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    selectedMetricCategory === 'PENDING_APPROVALS'
                      ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                      : 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                  }`}>
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight leading-none">8</div>
                    <p className="text-xs font-bold text-slate-400 mt-1 group-hover:text-purple-400 transition-colors">Pending Approvals</p>
                    <div className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold mt-1">
                      <span>3 require your review</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl font-mono whitespace-nowrap shrink-0 transition-all ${
                    selectedMetricCategory === 'PENDING_APPROVALS'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 group-hover:bg-purple-500/20 group-hover:text-purple-300 border border-white/10'
                  }`}>
                    {selectedMetricCategory === 'PENDING_APPROVALS' ? 'Active' : 'Click to View'}
                  </span>
                </div>
              </div>

              {/* Stat 3: Alerts & Notifications */}
              <div 
                onClick={() => setSelectedMetricCategory(selectedMetricCategory === 'ALERTS' ? null : 'ALERTS')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer flex items-start justify-between relative group ${
                  selectedMetricCategory === 'ALERTS'
                    ? isDark 
                      ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10' 
                      : 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
                    : isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-amber-500/40' 
                      : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    selectedMetricCategory === 'ALERTS'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight leading-none">5</div>
                    <p className="text-xs font-bold text-slate-400 mt-1 group-hover:text-amber-400 transition-colors">Alerts & Notifications</p>
                    <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-1">
                      <span>2 high priority</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl font-mono whitespace-nowrap shrink-0 transition-all ${
                    selectedMetricCategory === 'ALERTS'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/10 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-300 border border-white/10'
                  }`}>
                    {selectedMetricCategory === 'ALERTS' ? 'Active' : 'Click to View'}
                  </span>
                </div>
              </div>

              {/* Stat 4: Tasks Due */}
              <div 
                onClick={() => setSelectedMetricCategory(selectedMetricCategory === 'TASKS' ? null : 'TASKS')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer flex items-start justify-between relative group ${
                  selectedMetricCategory === 'TASKS'
                    ? isDark 
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                      : 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/10'
                    : isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-emerald-500/40' 
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    selectedMetricCategory === 'TASKS'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight leading-none">3</div>
                    <p className="text-xs font-bold text-slate-400 mt-1 group-hover:text-emerald-400 transition-colors">Tasks Due</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-1">
                      <span>Due within 24 hours</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl font-mono whitespace-nowrap shrink-0 transition-all ${
                    selectedMetricCategory === 'TASKS'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 border border-white/10'
                  }`}>
                    {selectedMetricCategory === 'TASKS' ? 'Active' : 'Click to View'}
                  </span>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* EXPANDED METRIC DETAILS PANEL (Rendered when any of the 4 cards is clicked) */}
            {/* ========================================================================= */}
            {selectedMetricCategory && (
              <HomeMetricDetailsPanel
                category={selectedMetricCategory}
                onClose={() => setSelectedMetricCategory(null)}
                onSelectCategory={(cat) => setSelectedMetricCategory(cat)}
                patients={patients}
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                onOpenPatient360={(patientId) => {
                  onSelectPatient(patientId);
                  const found = patients.find(p => p.id === patientId || p.mrn === patientId);
                  if (found) {
                    setQaAttachedPatient(found);
                  }
                  setActiveTab('PATIENTS');
                  setPatientViewMode('360');
                }}
                onOpenKnowledgeQA={handleOpenKnowledgeQA}
                isDark={isDark}
              />
            )}

            {/* ========================================================================= */}
            {/* 6 MAIN ACTION TILES (2 Rows x 3 Columns)                                  */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Tile 1: Patient Search */}
              <div
                onClick={() => {
                  setActiveTab('PATIENTS');
                  setPatientViewMode('SEARCH');
                }}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-blue-500/50' 
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-blue-500 transition-colors">Patient Search</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Search existing patients and view records</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <Users className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 2: New Patient */}
              <div
                onClick={() => setShowNewPatientModal(true)}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-emerald-500/50' 
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-emerald-500 transition-colors">New Patient</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Register a new patient and capture details</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <FileText className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 3: Clinical Q&A */}
              <div
                onClick={() => setActiveTab('AI_ASSISTANT')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-indigo-500/50' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-indigo-500 transition-colors">Clinical Q&A</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Ask AI assistant for clinical insights</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <Sparkles className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 4: Workflow Center */}
              <div
                onClick={() => setActiveTab('WORKFLOW')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-rose-500/50' 
                    : 'bg-white border-slate-200 hover:border-rose-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-rose-500 transition-colors">Workflow Center</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage appointments, referrals, discharge & more</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <ClipboardList className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 5: Agent Operations (Admin) OR Clinical Encounters (Clinicians) */}
              {isAdmin ? (
                <div
                  onClick={() => setActiveTab('AGENT_MONITOR')}
                  className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                    isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-cyan-500/50' 
                      : 'bg-white border-slate-200 hover:border-cyan-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold group-hover:text-cyan-500 transition-colors">Agent Operations</h3>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-cyan-500/20 text-cyan-300">Admin</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Live view of AI agents and orchestration</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all z-10" />
                  {/* Background Watermark */}
                  <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                    <Network className="w-24 h-24" />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setActiveTab('APPOINTMENTS')}
                  className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                    isDark 
                      ? 'bg-slate-900/70 border-white/10 hover:border-blue-500/50' 
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold group-hover:text-blue-500 transition-colors">Clinical Encounters</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Inpatient ward rounds & outpatient visits</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all z-10" />
                  {/* Background Watermark */}
                  <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                    <Calendar className="w-24 h-24" />
                  </div>
                </div>
              )}

              {/* Tile 6: Executive Dashboard (ALL USERS) */}
              <div
                onClick={() => setActiveTab('EXECUTIVE_DASHBOARD')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-blue-500/50' 
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-blue-400 transition-colors">Executive Dashboard</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Patients impacted, hours saved, & value realized</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <BarChart3 className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 7: Observability */}
              <div
                onClick={() => setActiveTab('OBSERVABILITY')}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                  isDark 
                    ? 'bg-slate-900/70 border-white/10 hover:border-purple-500/50' 
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold group-hover:text-purple-500 transition-colors">Dashboard</h3>
                    <p className="text-xs text-slate-400 mt-0.5">AI performance, safety & system metrics</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all z-10" />
                {/* Background Watermark */}
                <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                  <LineChart className="w-24 h-24" />
                </div>
              </div>

              {/* Tile 7: Audit & Compliance Center (Portal Admin) */}
              {isAdmin && (
                <>
                  <div
                    onClick={() => setActiveTab('AUDIT_CENTER')}
                    className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                      isDark 
                        ? 'bg-slate-900/70 border-white/10 hover:border-emerald-500/50' 
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4 z-10">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold group-hover:text-emerald-400 transition-colors">Audit & Compliance</h3>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300">Admin</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">HIPAA/GDPR access logs, approvals & policy audit</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all z-10" />
                    {/* Background Watermark */}
                    <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                      <ShieldCheck className="w-24 h-24" />
                    </div>
                  </div>

                  {/* Tile 8: Enterprise AWS Tech Stack (Portal Admin) */}
                  <div
                    onClick={() => setActiveTab('AWS_TECH_STACK')}
                    className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer group relative overflow-hidden flex items-center justify-between ${
                      isDark 
                        ? 'bg-slate-900/70 border-white/10 hover:border-amber-500/50' 
                        : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4 z-10">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Server className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold group-hover:text-amber-400 transition-colors">AWS Tech Stack</h3>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-500/20 text-amber-300">Admin</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Full 10-domain AWS cloud reference architecture</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all z-10" />
                    {/* Background Watermark */}
                    <div className="absolute right-3 -bottom-2 text-slate-800/10 dark:text-white/5 pointer-events-none">
                      <Server className="w-24 h-24" />
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* ========================================================================= */}
            {/* RECENT PATIENTS SECTION                                                   */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-extrabold">Recent Patients</h2>
                <button
                  onClick={() => {
                    setActiveTab('PATIENTS');
                    setPatientViewMode('SEARCH');
                  }}
                  className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all patients <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPatients.map((patient, idx) => {
                  const borderColors = ['border-l-blue-500', 'border-l-cyan-400', 'border-l-indigo-500'];
                  return (
                    <div
                      key={patient.id}
                      onClick={() => {
                        onSelectPatient(patient.id);
                        setActiveTab('PATIENTS');
                        setPatientViewMode('360');
                      }}
                      className={`p-4 rounded-2xl border border-l-4 ${borderColors[idx % 3]} transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer flex items-center justify-between ${
                        isDark 
                          ? 'bg-slate-900/70 border-white/10 hover:bg-slate-900' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow">
                          {patient.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold">{patient.fullName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">
                            MRN: {patient.mrn} • {patient.age} Y / {patient.gender === 'MALE' ? 'Male' : 'Female'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Last visit: May {12 - idx}, 2024
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* BOTTOM COMPLIANCE & SAFETY STRIP                                         */}
            {/* ========================================================================= */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 text-xs ${
              isDark 
                ? 'bg-slate-900/50 border-white/10 text-slate-400' 
                : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>AI responses are evidence-based and require clinical review.</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span><strong>Synthetic Data Only</strong> • No real PHI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                  <span><strong>Human-in-the-Loop</strong> • Clinician review required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>HIPAA-Aligned Demo</strong> • Privacy by design</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PATIENTS DIRECTORY / PATIENT 360                                   */}
        {/* ========================================================================= */}
        {activeTab === 'PATIENTS' && (
          <div className="flex-1 overflow-y-auto p-6">
            {patientViewMode === 'SEARCH' ? (
              <PatientSearchView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                patients={selectedHospital.id === 'hosp-all' 
                  ? patients 
                  : patients.filter(p => 
                      p.hospitalSite.toLowerCase().includes(selectedHospital.shortName.toLowerCase()) || 
                      p.hospitalSite.toLowerCase().includes(selectedHospital.name.split(' ')[0].toLowerCase())
                    )}
                onSelectPatient={(id) => {
                  onSelectPatient(id);
                  const p = patients.find(pat => pat.id === id);
                  if (p) setQaAttachedPatient(p);
                  setPatientViewMode('360');
                }}
                onRegisterNewPatient={onRegisterNewPatient}
                onDeletePatient={onDeletePatient}
              />
            ) : (
              <Patient360View
                patient={selectedPatient}
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                onBackToSearch={() => setPatientViewMode('SEARCH')}
                onOpenKnowledgeQA={(query, patientRef) => handleOpenKnowledgeQA(query || '', patientRef || selectedPatient)}
                onOpenWorkflow={() => setActiveTab('WORKFLOW')}
                onDeletePatient={(patientId) => {
                  if (onDeletePatient) onDeletePatient(patientId);
                  setPatientViewMode('SEARCH');
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AI ASSISTANT / CLINICAL KNOWLEDGE QA                               */}
        {/* ========================================================================= */}
        {activeTab === 'AI_ASSISTANT' && (
          <div className="flex-1 overflow-y-auto p-6">
            <KnowledgeQAView
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
              patient={qaAttachedPatient || selectedPatient || undefined}
              patients={patients}
              onSelectPatient={(id) => {
                onSelectPatient(id);
                const p = patients.find(pat => pat.id === id);
                if (p) setQaAttachedPatient(p);
              }}
              initialQuery={qaPrefilledQuery}
              onSendToNote={() => setActiveTab('WORKFLOW')}
              onBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WORKFLOW WORKSPACE                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'WORKFLOW' && (
          <div className="flex-1 overflow-y-auto p-6">
            <WorkflowWorkspaceView
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
              selectedPatientId={selectedPatient.id}
              patients={patients}
              onNavigateToPatient360={(patientId) => {
                onSelectPatient(patientId);
                const p = patients.find(pat => pat.id === patientId);
                if (p) setQaAttachedPatient(p);
                setActiveTab('PATIENTS');
                setPatientViewMode('360');
              }}
              onNavigateToReports={() => setActiveTab('REPORTS')}
              onBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: 5-STAGE RAG DOCUMENT INGESTION                                      */}
        {/* ========================================================================= */}
        {activeTab === 'INGESTION' && (
          !isAdmin ? renderRestrictedAdminBanner('5-Stage RAG Document Ingestion') : (
            <div className="flex-1 overflow-y-auto p-6">
              <DocumentIngestionView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                patients={patients}
                onPatientIngested={(pat) => {
                  onRegisterNewPatient(pat);
                  onSelectPatient(pat.id);
                  setActiveTab('PATIENTS');
                  setPatientViewMode('360');
                }}
                onOpenKnowledgeQA={(query) => {
                  setQaPrefilledQuery(query || '');
                  setActiveTab('AI_ASSISTANT');
                }}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB: AI GATEWAY & LIVE AGENT GRAPH ROUTING                                */}
        {/* ========================================================================= */}
        {activeTab === 'AI_GATEWAY' && (
          !isAdmin ? renderRestrictedAdminBanner('AI Gateway & Live Routing Graph') : (
            <div className="flex-1 overflow-y-auto p-6">
              <AIGatewayView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                patients={patients}
                selectedPatient={selectedPatient}
                onNavigateToPatient360={(patId) => {
                  onSelectPatient(patId);
                  setActiveTab('PATIENTS');
                  setPatientViewMode('360');
                }}
                onNavigateToKnowledgeQA={(query) => {
                  setQaPrefilledQuery(query);
                  setActiveTab('AI_ASSISTANT');
                }}
                onNavigateToWorkflow={() => {
                  setActiveTab('WORKFLOW');
                }}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB: LLM GATEWAY & GUARDRAILS (Portal Admin Only)                          */}
        {/* ========================================================================= */}
        {activeTab === 'LLM_GUARDRAILS' && (
          !isAdmin ? renderRestrictedAdminBanner('LLM Gateway & Pre/Post Guardrails Architecture') : (
            <div className="flex-1 overflow-y-auto p-6">
              <LlmGatewayGuardrailsView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                onBack={handleGoBack}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB: 14-STAGE EVALUATION DAG LIFECYCLE                                    */}
        {/* ========================================================================= */}
        {activeTab === 'EVALUATION_DAG' && (
          !isAdmin ? renderRestrictedAdminBanner('14-Stage Evaluation DAG Lifecycle') : (
            <div className="flex-1 overflow-y-auto p-6">
              <EvaluationLifecycleVisualizer
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB: AI JUDGE & SELF-IMPROVEMENT (PORTAL ADMIN RBAC GATED)                */}
        {/* ========================================================================= */}
        {activeTab === 'AI_JUDGE' && (
          !isAdmin ? renderRestrictedAdminBanner('AI Judge & Continuous Self-Improvement') : (
            <div className="flex-1 overflow-y-auto p-6">
              <AIJudgeGovernanceView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                onSwitchToPortalAdmin={onSwitchUser}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB: POSTGRESQL & VECTOR ARCHITECTURE LAYER                               */}
        {/* ========================================================================= */}
        {activeTab === 'POSTGRES' && (
          !isAdmin ? renderRestrictedAdminBanner('PostgreSQL & RDS Vector Architecture Layer') : (
            <div className="flex-1 overflow-y-auto p-6">
              <PostgreSQLArchitectureView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB 5: APPOINTMENTS VIEW                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="flex-1 overflow-y-auto p-6">
            <AppointmentsCenterView
              selectedHospital={selectedHospital}
              patients={patients}
              onGoBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: REPORTS & CLINICAL ANALYTICS                                       */}
        {/* ========================================================================= */}
        {activeTab === 'REPORTS' && (
          <div className="flex-1 overflow-y-auto p-6">
            <ClinicalReportsCenterView
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
              patients={patients}
              onOpenPatient360={(patientId) => {
                onSelectPatient(patientId);
                const p = patients.find(pat => pat.id === patientId);
                if (p) setQaAttachedPatient(p);
                setActiveTab('PATIENTS');
                setPatientViewMode('360');
              }}
              onOpenKnowledgeQA={(query, patientRef) => {
                handleOpenKnowledgeQA(query || '', patientRef || selectedPatient);
              }}
              onOpenWorkflow={() => setActiveTab('WORKFLOW')}
              onBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: OBSERVABILITY & SAFETY AUDIT                                       */}
        {/* ========================================================================= */}
        {activeTab === 'OBSERVABILITY' && (
          <div className="flex-1 overflow-y-auto p-6">
            <SafetyAuditView
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
              onBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: AGENT MONITOR & OPERATIONS                                         */}
        {/* ========================================================================= */}
        {activeTab === 'AGENT_MONITOR' && (
          !isAdmin ? renderRestrictedAdminBanner('Agent Monitor & Multi-Agent Operations') : (
            <div className="flex-1 overflow-y-auto p-6">
              <AgentOperationsDashboard
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB 9: AUDIT & COMPLIANCE CENTER (PORTAL ADMIN ONLY)                      */}
        {/* ========================================================================= */}
        {activeTab === 'AUDIT_CENTER' && (
          !isAdmin ? renderRestrictedAdminBanner('Audit & Compliance Center') : (
            <div className="flex-1 overflow-y-auto p-6">
              <AuditComplianceCenterView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                patients={patients}
                selectedHospital={selectedHospital}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB 10: EXECUTIVE DASHBOARD (VISIBLE TO ALL USERS)                        */}
        {/* ========================================================================= */}
        {activeTab === 'EXECUTIVE_DASHBOARD' && (
          <div className="flex-1 overflow-y-auto p-6">
            <ExecutiveDashboardView
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
              patients={patients}
              selectedHospital={selectedHospital}
              onGoBack={handleGoBack}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 11: AWS ENTERPRISE TECH STACK (PORTAL ADMIN ONLY)                    */}
        {/* ========================================================================= */}
        {activeTab === 'AWS_TECH_STACK' && (
          !isAdmin ? renderRestrictedAdminBanner('Enterprise AWS Tech Stack Architecture') : (
            <div className="flex-1 overflow-y-auto p-6">
              <AwsTechStackView
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                onGoBack={handleGoBack}
              />
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* TAB 11: SETTINGS & ROLE IAM                                               */}
        {/* ========================================================================= */}
        {activeTab === 'SETTINGS' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors cursor-pointer"
                title="Back to Previous Page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-2xl font-extrabold">Practitioner Settings & Security</h2>
                <p className="text-xs text-slate-400">Role-based access control (RBAC), Purpose-of-Use justification, and EHR FHIR endpoints</p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> Active Practitioner Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Full Name</label>
                  <p className="font-bold mt-0.5">{currentUser.name}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Assigned Role</label>
                  <p className="font-bold mt-0.5 text-blue-400">{currentUser.role} ({roleInfo.tag})</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Clinical Department</label>
                  <p className="font-bold mt-0.5">{currentUser.department}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Hospital Facility</label>
                  <p className="font-bold mt-0.5">{currentUser.hospitalSite}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">License / NPI Number</label>
                  <p className="font-bold mt-0.5 font-mono">{currentUser.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">MFA Status</label>
                  <p className="font-bold mt-0.5 text-emerald-400">Verified • Hardware Token active</p>
                </div>
              </div>
            </div>

            {/* Purpose of Use Selector */}
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-sm font-extrabold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" /> Purpose of Use (HIPAA Context)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                All patient queries, note creations, and agent executions are auditable under this declared clinical justification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'TREATMENT' as const, label: 'Direct Treatment', desc: 'Direct patient care, diagnosis, and order management' },
                  { key: 'CARE_COORDINATION' as const, label: 'Care Coordination', desc: 'Discharge planning, referral management, and transition of care' },
                  { key: 'CLINICAL_AUDIT' as const, label: 'Clinical Audit & Quality', desc: 'Safety audit, compliance metrics, and guideline adherence reviews' },
                  { key: 'EMERGENCY_OVERRIDE' as const, label: 'Emergency Override (Break-Glass)', desc: 'Emergency access protocol for life-threatening acute scenarios' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setPurposeOfUse(item.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      purposeOfUse === item.key
                        ? 'border-blue-500 bg-blue-600/15 text-white'
                        : isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Management & Return */}
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-sm font-extrabold mb-2 flex items-center gap-2 text-rose-400">
                <LogOut className="w-4 h-4 text-rose-400" /> Active Session Management
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Securely sign out of this practitioner profile and return to the main Hospital World landing page or switch to another clinical account.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onSignOut}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out & Return to Hospital World</span>
                </button>

                {onSwitchUser && (
                  <button
                    onClick={onSwitchUser}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Switch Active Practitioner</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* NEW PATIENT REGISTRATION MODAL                                            */}
      {/* ========================================================================= */}
      <RegisterNewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        currentUser={currentUser}
        patients={patients}
        onPatientRegistered={(newPatient) => {
          onRegisterNewPatient(newPatient);
          onSelectPatient(newPatient.id);
          setShowNewPatientModal(false);
          setActiveTab('PATIENTS');
          setPatientViewMode('360');
        }}
        onSelectExistingPatient={(patientId) => {
          onSelectPatient(patientId);
          setShowNewPatientModal(false);
          setActiveTab('PATIENTS');
          setPatientViewMode('360');
        }}
        isDark={isDark}
      />

      {/* Full Project Export ZIP Modal */}
      <ExportZipModal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </div>
  );
};

