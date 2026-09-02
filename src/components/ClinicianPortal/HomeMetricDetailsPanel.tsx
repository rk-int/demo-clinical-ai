import React, { useState } from 'react';
import { 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  Search, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  ArrowUpRight, 
  Stethoscope, 
  Pill, 
  Activity, 
  UserCheck, 
  AlertCircle, 
  Plus,
  Filter,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { SyntheticPatient, UserProfile, PurposeOfUse } from '../../types';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';
import { getUserAvatarUrl } from '../../utils/patientAvatar';

export type MetricCategory = 'PATIENTS_SEEN' | 'PENDING_APPROVALS' | 'ALERTS' | 'TASKS';

interface HomeMetricDetailsPanelProps {
  category: MetricCategory;
  onClose: () => void;
  onSelectCategory: (cat: MetricCategory) => void;
  patients: SyntheticPatient[];
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onOpenPatient360: (patientId: string) => void;
  onOpenKnowledgeQA: (query: string, patient?: SyntheticPatient | string) => void;
  isDark: boolean;
}

interface PendingApprovalItem {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  title: string;
  type: 'DISCHARGE' | 'MEDICATION' | 'REFERRAL' | 'ORDER' | 'CONSENT';
  department: string;
  aiSafetyScore: number;
  requestedTime: string;
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
}

interface ClinicalAlertItem {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'LAB_VALUE' | 'DRUG_INTERACTION' | 'EARLY_WARNING' | 'CONSENT' | 'VITALS';
  title: string;
  details: string;
  recommendation: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

interface TaskItem {
  id: string;
  patientId?: string;
  patientName?: string;
  mrn?: string;
  title: string;
  dueTime: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  category: 'CLINICAL' | 'DOCUMENTATION' | 'COORDINATION' | 'REVIEW';
  completed: boolean;
  assignedTo: string;
  completedAt?: string;
}

export const HomeMetricDetailsPanel: React.FC<HomeMetricDetailsPanelProps> = ({
  category,
  onClose,
  onSelectCategory,
  patients,
  currentUser,
  purposeOfUse,
  onOpenPatient360,
  onOpenKnowledgeQA,
  isDark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubtype, setFilterSubtype] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');

  // Approvals State
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>([
    {
      id: 'APP-101',
      patientId: patients[0]?.id || 'pat-1',
      patientName: patients[0]?.fullName || 'Robert Chen',
      mrn: patients[0]?.mrn || 'MRN-90214',
      title: 'AI-Generated Inpatient Discharge Summary & Follow-Up Plan',
      type: 'DISCHARGE',
      department: 'Cardiology Acute Unit',
      aiSafetyScore: 99.4,
      requestedTime: '15 mins ago',
      priority: 'URGENT',
      description: 'Discharge summary for post-STEMI recovery with dual antiplatelet regimen and outpatient cardiac rehab schedule.',
      status: 'PENDING',
    },
    {
      id: 'APP-102',
      patientId: patients[1]?.id || 'pat-2',
      patientName: patients[1]?.fullName || 'Eleanor Vance',
      mrn: patients[1]?.mrn || 'MRN-88319',
      title: 'High-Dose Atorvastatin (80mg) Titration & Lipid Panel Order',
      type: 'MEDICATION',
      department: 'Heart Failure Clinic',
      aiSafetyScore: 98.8,
      requestedTime: '42 mins ago',
      priority: 'HIGH',
      description: 'Statin dose escalation following LDL elevation (164 mg/dL); contraindication check passed with no active hepatic warnings.',
      status: 'PENDING',
    },
    {
      id: 'APP-103',
      patientId: patients[2]?.id || 'pat-3',
      patientName: patients[2]?.fullName || 'Marcus Brody',
      mrn: patients[2]?.mrn || 'MRN-77401',
      title: 'Outpatient Cardiac Electrophysiology Referral to Dr. Emily Vance',
      type: 'REFERRAL',
      department: 'Electrophysiology',
      aiSafetyScore: 99.1,
      requestedTime: '1 hr ago',
      priority: 'ROUTINE',
      description: 'Referral for symptomatic paroxysmal atrial fibrillation episode evaluation and Holter monitor telemetry review.',
      status: 'PENDING',
    },
    {
      id: 'APP-104',
      patientId: patients[3]?.id || 'pat-4',
      patientName: patients[3]?.fullName || 'Sarah Jenkins',
      mrn: patients[3]?.mrn || 'MRN-65120',
      title: 'Post-Procedural Transthoracic Echocardiogram (TTE) Order',
      type: 'ORDER',
      department: 'Cardiovascular Imaging',
      aiSafetyScore: 97.9,
      requestedTime: '2 hrs ago',
      priority: 'HIGH',
      description: 'Resting echo to evaluate LVEF progression and left ventricular wall motion following medical therapy adjustment.',
      status: 'PENDING',
    },
    {
      id: 'APP-105',
      patientId: patients[4]?.id || 'pat-5',
      patientName: patients[4]?.fullName || 'David Kim',
      mrn: patients[4]?.mrn || 'MRN-54918',
      title: 'Digital HIPAA Research Data De-Identification & Secondary Use Consent',
      type: 'CONSENT',
      department: 'Clinical Informatics & Governance',
      aiSafetyScore: 100,
      requestedTime: '3 hrs ago',
      priority: 'ROUTINE',
      description: 'Secondary clinical telemetry dataset access request for institutional quality improvement review under IRB protocol.',
      status: 'PENDING',
    },
    {
      id: 'APP-106',
      patientId: patients[5]?.id || 'pat-6',
      patientName: patients[5]?.fullName || 'Maria Rodriguez',
      mrn: patients[5]?.mrn || 'MRN-43892',
      title: 'Warfarin INR Dose Adjustment Protocol & Home Coagulation Kit',
      type: 'MEDICATION',
      department: 'Anticoagulation Service',
      aiSafetyScore: 98.2,
      requestedTime: '4 hrs ago',
      priority: 'HIGH',
      description: 'INR measured at 3.4 (target 2.0 - 3.0); protocol recommends holding 1 dose and reducing weekly regimen by 10%.',
      status: 'PENDING',
    },
    {
      id: 'APP-107',
      patientId: patients[0]?.id || 'pat-1',
      patientName: patients[0]?.fullName || 'Robert Chen',
      mrn: patients[0]?.mrn || 'MRN-90214',
      title: 'Cardiac Rehabilitation Phase II Program Enrollment Order',
      type: 'ORDER',
      department: 'Physical Medicine & Rehab',
      aiSafetyScore: 99.5,
      requestedTime: '5 hrs ago',
      priority: 'ROUTINE',
      description: '36-session monitored aerobic conditioning regimen with continuous 3-lead telemetry oversight.',
      status: 'PENDING',
    },
    {
      id: 'APP-108',
      patientId: patients[1]?.id || 'pat-2',
      patientName: patients[1]?.fullName || 'Eleanor Vance',
      mrn: patients[1]?.mrn || 'MRN-88319',
      title: 'Home Telehealth Blood Pressure & Weight Cellular Monitor Dispense',
      type: 'ORDER',
      department: 'Remote Patient Monitoring',
      aiSafetyScore: 99.8,
      requestedTime: '6 hrs ago',
      priority: 'ROUTINE',
      description: 'Cellular connected cuff and scale for daily heart failure decompensation early warning surveillance.',
      status: 'PENDING',
    },
  ]);

  // Alerts State
  const [alerts, setAlerts] = useState<ClinicalAlertItem[]>([
    {
      id: 'ALT-201',
      patientId: patients[0]?.id || 'pat-1',
      patientName: patients[0]?.fullName || 'Robert Chen',
      mrn: patients[0]?.mrn || 'MRN-90214',
      severity: 'CRITICAL',
      category: 'LAB_VALUE',
      title: 'Critical High Sensitivity Troponin-I Elevation (0.42 ng/mL)',
      details: 'Elevated from baseline (0.03 ng/mL). Baseline reference threshold: <0.04 ng/mL. Associated with non-sustained VT run on bedside telemetry.',
      recommendation: 'Immediate 12-lead ECG acquisition, repeat cardiac enzymes in 2 hours, and notify Attending Cardiologist on call.',
      timestamp: '10 mins ago',
      acknowledged: false,
    },
    {
      id: 'ALT-202',
      patientId: patients[1]?.id || 'pat-2',
      patientName: patients[1]?.fullName || 'Eleanor Vance',
      mrn: patients[1]?.mrn || 'MRN-88319',
      severity: 'CRITICAL',
      category: 'DRUG_INTERACTION',
      title: 'Severe Drug-Drug Interaction: Warfarin + Fluconazole Co-Prescription',
      details: 'Fluconazole inhibits CYP2C9 metabolism of S-warfarin, causing precipitous INR elevation (bleeding hazard index: 4.8/5.0).',
      recommendation: 'Consider topical/alternative antifungal agent or decrease warfarin dose by 50% with daily INR surveillance.',
      timestamp: '25 mins ago',
      acknowledged: false,
    },
    {
      id: 'ALT-203',
      patientId: patients[4]?.id || 'pat-5',
      patientName: patients[4]?.fullName || 'David Kim',
      mrn: patients[4]?.mrn || 'MRN-54918',
      severity: 'WARNING',
      category: 'EARLY_WARNING',
      title: 'qSOFA Score Triggered (Score: 2) — Sepsis Risk Alert',
      details: 'Respiratory rate: 24 breaths/min, Systolic Blood Pressure: 94 mmHg, Temperature: 38.6°C (101.5°F).',
      recommendation: 'Initiate sepsis screening protocol, draw blood cultures x2 prior to antibiotic escalation, and administer IV crystalloid bolus.',
      timestamp: '1 hr ago',
      acknowledged: false,
    },
    {
      id: 'ALT-204',
      patientId: patients[2]?.id || 'pat-3',
      patientName: patients[2]?.fullName || 'Marcus Brody',
      mrn: patients[2]?.mrn || 'MRN-77401',
      severity: 'WARNING',
      category: 'CONSENT',
      title: 'Patient Digital Consent Expiring Within 24 Hours',
      details: 'HIPAA treatment data exchange consent for telemetry monitoring scheduled to expire on 2026-09-03 at 08:00 AM.',
      recommendation: 'Present digital renewal authorization during afternoon rounds or trigger automated SMS e-consent portal link.',
      timestamp: '3 hrs ago',
      acknowledged: false,
    },
    {
      id: 'ALT-205',
      patientId: patients[3]?.id || 'pat-4',
      patientName: patients[3]?.fullName || 'Sarah Jenkins',
      mrn: patients[3]?.mrn || 'MRN-65120',
      severity: 'INFO',
      category: 'LAB_VALUE',
      title: 'External Laboratory Results Synced via FHIR R4 Ingestion',
      details: 'Comprehensive Metabolic Panel (CMP) and HbA1c (6.2%) successfully normalized and attached to longitudinal EHR chart.',
      recommendation: 'No acute action required. Values recorded in baseline trend charts.',
      timestamp: '4 hrs ago',
      acknowledged: false,
    },
  ]);

  // Tasks State
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'TSK-301',
      patientId: patients[0]?.id || 'pat-1',
      patientName: patients[0]?.fullName || 'Robert Chen',
      mrn: patients[0]?.mrn || 'MRN-90214',
      title: 'Perform femoral catheterization puncture site check & pedal pulse check',
      dueTime: 'In 45 minutes',
      priority: 'URGENT',
      category: 'CLINICAL',
      completed: false,
      assignedTo: currentUser.name,
    },
    {
      id: 'TSK-302',
      patientId: patients[1]?.id || 'pat-2',
      patientName: patients[1]?.fullName || 'Eleanor Vance',
      mrn: patients[1]?.mrn || 'MRN-88319',
      title: 'Review morning 12-lead ECG and telemetry strip recording for QT prolongation',
      dueTime: 'Today by 2:00 PM',
      priority: 'HIGH',
      category: 'REVIEW',
      completed: false,
      assignedTo: currentUser.name,
    },
    {
      id: 'TSK-303',
      patientId: patients[3]?.id || 'pat-4',
      patientName: patients[3]?.fullName || 'Sarah Jenkins',
      mrn: patients[3]?.mrn || 'MRN-65120',
      title: 'Sign pending electronic discharge summary & prescription reconciliation',
      dueTime: 'Today by 4:30 PM',
      priority: 'HIGH',
      category: 'DOCUMENTATION',
      completed: false,
      assignedTo: currentUser.name,
    },
    {
      id: 'TSK-304',
      patientId: patients[2]?.id || 'pat-3',
      patientName: patients[2]?.fullName || 'Marcus Brody',
      mrn: patients[2]?.mrn || 'MRN-77401',
      title: 'Follow-up tele-health triage call regarding beta-blocker titration tolerance',
      dueTime: 'Today by 6:00 PM',
      priority: 'MEDIUM',
      category: 'COORDINATION',
      completed: true,
      assignedTo: 'Jennifer Walsh, RN',
      completedAt: '10:30 AM Today',
    },
    {
      id: 'TSK-305',
      patientId: patients[4]?.id || 'pat-5',
      patientName: patients[4]?.fullName || 'David Kim',
      mrn: patients[4]?.mrn || 'MRN-54918',
      title: 'Pre-procedure anesthesia clearance review for scheduled diagnostic endoscopy',
      dueTime: 'Tomorrow at 8:00 AM',
      priority: 'MEDIUM',
      category: 'REVIEW',
      completed: true,
      assignedTo: 'Dr. Marcus Vance, MD',
      completedAt: '09:15 AM Today',
    },
  ]);

  // Handle Approving / Rejecting
  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'APPROVED',
          approvedBy: currentUser.name,
          approvedAt: 'Just now',
        };
      }
      return item;
    }));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'REJECTED',
          approvedBy: currentUser.name,
          approvedAt: 'Just now',
        };
      }
      return item;
    }));
  };

  // Handle Acknowledging Alerts
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          acknowledged: true,
          acknowledgedBy: currentUser.name,
          acknowledgedAt: 'Just now',
        };
      }
      return item;
    }));
  };

  // Handle Toggling Tasks
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        return {
          ...item,
          completed: nextState,
          completedAt: nextState ? 'Just now' : undefined,
        };
      }
      return item;
    }));
  };

  // Category Configuration
  const categoryConfig = {
    PATIENTS_SEEN: {
      title: 'Patients Seen Today',
      subtitle: 'Encountered & scheduled clinical cohort across inpatient units and outpatient clinics',
      icon: Users,
      color: 'blue',
      badgeText: '12 Active Encounters',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    PENDING_APPROVALS: {
      title: 'Pending Approvals',
      subtitle: 'Clinical orders, AI notes, discharge authorizations, and prescription reconciliations',
      icon: ClipboardList,
      color: 'purple',
      badgeText: `${approvals.filter(a => a.status === 'PENDING').length} Action Required`,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    ALERTS: {
      title: 'Alerts & Notifications',
      subtitle: 'Critical lab values, high-risk drug interactions, qSOFA alarms, and consent alerts',
      icon: AlertTriangle,
      color: 'amber',
      badgeText: `${alerts.filter(a => !a.acknowledged).length} Unacknowledged`,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    TASKS: {
      title: 'Tasks Due',
      subtitle: 'Time-sensitive clinical duties, pre-procedure reviews, and patient check-ins',
      icon: Calendar,
      color: 'emerald',
      badgeText: `${tasks.filter(t => !t.completed).length} Due in 24h`,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  }[category];

  const CurrentIcon = categoryConfig.icon;

  // Enrich patient list for today's visits
  const todayPatientsData = [
    {
      patient: patients[0] || SYNTHETIC_PATIENTS[0],
      encounterTime: '08:30 AM',
      status: 'Completed',
      location: 'Cardiology Ward 4B • Bed 12',
      chiefComplaint: 'Post-PCI acute coronary syndrome recovery & dual antiplatelet review',
      vitals: { bp: '128/82', hr: '74 bpm', spo2: '98%', temp: '98.4°F' },
      attendingDoctor: 'Dr. Marcus Vance, MD',
      diagnosis: 'Acute Coronary Syndrome (STEMI)',
      riskLevel: 'MODERATE',
    },
    {
      patient: patients[1] || SYNTHETIC_PATIENTS[1],
      encounterTime: '09:45 AM',
      status: 'Completed',
      location: 'Heart Failure Clinic • Room 302',
      chiefComplaint: 'HFrEF follow-up, progressive dyspnea on exertion, medication reconciliation',
      vitals: { bp: '134/86', hr: '68 bpm', spo2: '96%', temp: '98.6°F' },
      attendingDoctor: 'Dr. Emily Vance, MD',
      diagnosis: 'Heart Failure with Reduced Ejection Fraction (HFrEF)',
      riskLevel: 'HIGH',
    },
    {
      patient: patients[2] || SYNTHETIC_PATIENTS[2],
      encounterTime: '11:15 AM',
      status: 'In Progress',
      location: 'Electrophysiology Suite • Bed 3',
      chiefComplaint: 'Paroxysmal Atrial Fibrillation with palpitations & dizziness',
      vitals: { bp: '142/90', hr: '104 bpm', spo2: '97%', temp: '98.2°F' },
      attendingDoctor: 'Dr. Marcus Vance, MD',
      diagnosis: 'Paroxysmal Atrial Fibrillation (AFib)',
      riskLevel: 'HIGH',
    },
    {
      patient: patients[3] || SYNTHETIC_PATIENTS[3],
      encounterTime: '01:30 PM',
      status: 'Scheduled',
      location: 'Outpatient Care Center • Room 108',
      chiefComplaint: 'Essential Hypertension & Type 2 Diabetes routine surveillance',
      vitals: { bp: '138/88', hr: '78 bpm', spo2: '99%', temp: '98.5°F' },
      attendingDoctor: 'Dr. Marcus Vance, MD',
      diagnosis: 'Hypertension & T2 Diabetes Mellitus',
      riskLevel: 'LOW',
    },
    {
      patient: patients[4] || SYNTHETIC_PATIENTS[4],
      encounterTime: '02:45 PM',
      status: 'Scheduled',
      location: 'Inpatient Stepdown • Bed 8',
      chiefComplaint: 'COPD exacerbation with productive cough & nocturnal dyspnea',
      vitals: { bp: '122/78', hr: '88 bpm', spo2: '93%', temp: '99.1°F' },
      attendingDoctor: 'Dr. Emily Vance, MD',
      diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
      riskLevel: 'MODERATE',
    },
    {
      patient: patients[5] || SYNTHETIC_PATIENTS[5],
      encounterTime: '04:00 PM',
      status: 'Scheduled',
      location: 'Vascular Medicine • Room 204',
      chiefComplaint: 'Deep Vein Thrombosis anticoagulation titration & lower extremity ultrasound review',
      vitals: { bp: '126/80', hr: '72 bpm', spo2: '98%', temp: '98.3°F' },
      attendingDoctor: 'Dr. Marcus Vance, MD',
      diagnosis: 'Deep Vein Thrombosis (DVT)',
      riskLevel: 'MODERATE',
    },
  ];

  return (
    <div className={`p-6 rounded-3xl border shadow-2xl transition-all space-y-6 ${
      isDark 
        ? 'bg-slate-900/95 border-blue-500/30 text-white' 
        : 'bg-white border-blue-200 text-slate-900 shadow-blue-500/5'
    }`}>
      
      {/* Header with Switcher Tabs and Close button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${
            category === 'PATIENTS_SEEN' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            category === 'PENDING_APPROVALS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
            category === 'ALERTS' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            <CurrentIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black tracking-tight">{categoryConfig.title}</h2>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${categoryConfig.badgeColor}`}>
                {categoryConfig.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{categoryConfig.subtitle}</p>
          </div>
        </div>

        {/* Quick Category Switcher Tabs & Close Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-800/60 border border-white/10 text-xs">
            <button
              onClick={() => onSelectCategory('PATIENTS_SEEN')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                category === 'PATIENTS_SEEN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patients (12)</span>
            </button>
            <button
              onClick={() => onSelectCategory('PENDING_APPROVALS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                category === 'PENDING_APPROVALS' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Approvals ({approvals.filter(a => a.status === 'PENDING').length})</span>
            </button>
            <button
              onClick={() => onSelectCategory('ALERTS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                category === 'ALERTS' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alerts ({alerts.filter(a => !a.acknowledged).length})</span>
            </button>
            <button
              onClick={() => onSelectCategory('TASKS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                category === 'TASKS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tasks ({tasks.filter(t => !t.completed).length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer transition-all"
            title="Collapse Details Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. PATIENTS SEEN TODAY DETAILS VIEW (LIST VIEW BY DEFAULT)             */}
      {/* ===================================================================== */}
      {category === 'PATIENTS_SEEN' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search today's patients by name, MRN, or diagnosis..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-mono text-[11px] text-slate-400 hidden md:inline">
                Department: <strong className="text-slate-300">Cardiovascular & Internal Med</strong>
              </span>

              {/* View Mode Switcher: LIST (default) vs GRID */}
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'LIST' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View (Default)"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'GRID' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* LIST VIEW (DEFAULT) */}
          {viewMode === 'LIST' ? (
            <div className="space-y-2.5">
              {todayPatientsData
                .filter(item => {
                  const match = item.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
                  return match;
                })
                .map((item, idx) => (
                  <div
                    key={item.patient.id || idx}
                    className={`p-4 rounded-2xl border transition-all hover:scale-[1.005] hover:shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isDark 
                        ? 'bg-slate-800/60 border-white/10 hover:border-blue-500/50 hover:bg-slate-800/80' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white shadow-sm'
                    }`}
                  >
                    {/* Patient Core Identity */}
                    <div className="flex items-start gap-3.5 min-w-[240px]">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                        {item.patient.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-white">{item.patient.fullName}</h4>
                          <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/30">
                            {item.patient.mrn}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                          <span>{item.patient.age} Y • {item.patient.gender === 'MALE' ? 'Male' : 'Female'} • Attending:</span>
                          <span className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 text-slate-200 font-bold">
                            <img 
                              src={getUserAvatarUrl(item.attendingDoctor)} 
                              alt={item.attendingDoctor}
                              className="w-4 h-4 rounded-full object-cover border border-cyan-400/50" 
                            />
                            <span>{item.attendingDoctor}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          <span>{item.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Encounter & Diagnosis */}
                    <div className="flex-1 max-w-xl space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.status} ({item.encounterTime})
                        </span>
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {item.diagnosis}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.chiefComplaint}
                      </p>
                    </div>

                    {/* Vitals Mini-Dashboard */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/25 border border-white/5 font-mono text-[10px] shrink-0">
                      <div className="px-2 py-0.5 text-center">
                        <span className="text-slate-500 block text-[8px]">BP</span>
                        <span className="font-bold text-slate-200">{item.vitals.bp}</span>
                      </div>
                      <div className="h-6 w-px bg-white/10"></div>
                      <div className="px-2 py-0.5 text-center">
                        <span className="text-slate-500 block text-[8px]">HR</span>
                        <span className="font-bold text-cyan-400">{item.vitals.hr}</span>
                      </div>
                      <div className="h-6 w-px bg-white/10"></div>
                      <div className="px-2 py-0.5 text-center">
                        <span className="text-slate-500 block text-[8px]">SpO2</span>
                        <span className="font-bold text-emerald-400">{item.vitals.spo2}</span>
                      </div>
                      <div className="h-6 w-px bg-white/10"></div>
                      <div className="px-2 py-0.5 text-center">
                        <span className="text-slate-500 block text-[8px]">TEMP</span>
                        <span className="font-bold text-slate-300">{item.vitals.temp}</span>
                      </div>
                    </div>

                    {/* Actions: Ask AI & Open 360 */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenKnowledgeQA(
                          `Explain clinical background, current management protocol, and medication reconciliation for ${item.patient.fullName} (${item.diagnosis})`,
                          item.patient
                        )}
                        className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title={`Attach ${item.patient.fullName} and consult AI Assistant`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ask AI</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => onOpenPatient360(item.patient.id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                        title="Open complete Patient 360 chart"
                      >
                        <span>Open 360</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            /* GRID VIEW (ALTERNATIVE) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayPatientsData
                .filter(item => {
                  const match = item.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
                  return match;
                })
                .map((item, idx) => (
                  <div
                    key={item.patient.id || idx}
                    className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between gap-3 ${
                      isDark 
                        ? 'bg-slate-800/60 border-white/10 hover:border-blue-500/50' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
                            {item.patient.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold">{item.patient.fullName}</h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              MRN: {item.patient.mrn} • {item.patient.age} Y / {item.patient.gender}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.status} ({item.encounterTime})
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                        <p className="font-semibold text-slate-200">{item.diagnosis}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.chiefComplaint}</p>
                        <p className="text-[10px] text-slate-500 pt-0.5">Location: <span className="text-slate-300">{item.location}</span></p>
                      </div>

                      {/* Vitals Snapshot */}
                      <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-black/20 text-center font-mono text-[10px]">
                        <div>
                          <span className="text-slate-500 block text-[8px]">BP</span>
                          <span className="font-bold text-slate-200">{item.vitals.bp}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px]">HR</span>
                          <span className="font-bold text-cyan-400">{item.vitals.hr}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px]">SpO2</span>
                          <span className="font-bold text-emerald-400">{item.vitals.spo2}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[8px]">TEMP</span>
                          <span className="font-bold text-slate-300">{item.vitals.temp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenKnowledgeQA(
                          `Explain clinical background, current management protocol, and medication reconciliation for ${item.patient.fullName} (${item.diagnosis})`,
                          item.patient
                        )}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        title={`Attach ${item.patient.fullName} and consult AI`}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Ask AI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPatient360(item.patient.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1 cursor-pointer ml-auto"
                      >
                        <span>Open 360</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. PENDING APPROVALS DETAILS VIEW                                     */}
      {/* ===================================================================== */}
      {category === 'PENDING_APPROVALS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'PENDING', 'APPROVED', 'MEDICATION', 'DISCHARGE'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterSubtype(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterSubtype === tab 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Role Authorized: <strong>{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          <div className="space-y-3">
            {approvals
              .filter(item => {
                if (filterSubtype === 'PENDING') return item.status === 'PENDING';
                if (filterSubtype === 'APPROVED') return item.status === 'APPROVED';
                if (filterSubtype === 'MEDICATION') return item.type === 'MEDICATION';
                if (filterSubtype === 'DISCHARGE') return item.type === 'DISCHARGE';
                return true;
              })
              .map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    item.status === 'APPROVED' 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : item.status === 'REJECTED'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : isDark
                      ? 'bg-slate-800/60 border-white/10 hover:border-purple-500/40'
                      : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono uppercase ${
                        item.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                        {item.type}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        Patient: <button onClick={() => onOpenPatient360(item.patientId)} className="text-cyan-400 hover:underline cursor-pointer font-bold">{item.patientName}</button> ({item.mrn})
                      </span>
                      <span className="text-[11px] text-slate-400">• {item.requestedTime}</span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        AI Validation Confidence: {item.aiSafetyScore}%
                      </span>
                      <span>Department: {item.department}</span>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    {item.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Sign</span>
                        </button>
                      </>
                    ) : item.status === 'APPROVED' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Signed by {item.approvedBy || currentUser.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs">
                        <X className="w-4 h-4" />
                        <span>Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ALERTS & NOTIFICATIONS DETAILS VIEW                                */}
      {/* ===================================================================== */}
      {category === 'ALERTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSubtype(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterSubtype === sev 
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Real-time Clinical Safety & EHR Surveillance Engine
            </span>
          </div>

          <div className="space-y-3">
            {alerts
              .filter(item => {
                if (filterSubtype === 'CRITICAL') return item.severity === 'CRITICAL';
                if (filterSubtype === 'WARNING') return item.severity === 'WARNING';
                if (filterSubtype === 'INFO') return item.severity === 'INFO';
                return true;
              })
              .map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : isDark
                      ? 'bg-slate-800/60 border-white/10'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      alert.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          alert.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                          alert.severity === 'WARNING' ? 'bg-amber-500 text-slate-900' :
                          'bg-blue-500 text-white'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          Patient: <button onClick={() => onOpenPatient360(alert.patientId)} className="text-cyan-400 hover:underline cursor-pointer font-bold">{alert.patientName}</button> ({alert.mrn})
                        </span>
                        <span className="text-[11px] text-slate-400">• {alert.timestamp}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
                      <p className="text-xs text-slate-300">{alert.details}</p>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-amber-300/90 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Recommended Action:</strong> {alert.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end md:self-center">
                    {!alert.acknowledged ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onOpenKnowledgeQA(
                            `How should we clinically manage this alert: ${alert.title} for patient ${alert.patientName}?`,
                            alert.patientId
                          )}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI Triage</span>
                        </button>
                        <button
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/30 cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledged</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TASKS DUE DETAILS VIEW                                             */}
      {/* ===================================================================== */}
      {category === 'TASKS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">
                Assigned to: <span className="text-emerald-400 font-semibold">{currentUser.name}</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {tasks.filter(t => t.completed).length} of {tasks.length} Completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Click any checkbox to complete task</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-900/30 border-white/5 opacity-70'
                    : isDark
                    ? 'bg-slate-800/60 border-white/10 hover:border-emerald-500/40 hover:bg-slate-800/80'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    task.completed 
                      ? 'bg-emerald-500 text-white' 
                      : 'border-2 border-slate-500 hover:border-emerald-400'
                  }`}>
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-bold transition-all ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                      {task.patientName && (
                        <span className="font-semibold text-cyan-400">
                          {task.patientName} ({task.mrn})
                        </span>
                      )}
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 text-amber-400 font-mono">
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 font-mono text-slate-300">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {task.patientId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPatient360(task.patientId!);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Chart</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
