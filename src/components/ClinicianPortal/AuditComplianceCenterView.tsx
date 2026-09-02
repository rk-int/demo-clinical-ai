import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Search, 
  Download, 
  Filter, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  AlertTriangle, 
  Check, 
  Building, 
  Clock, 
  Database,
  ArrowUpRight,
  Building2,
  PlusCircle,
  Sparkles,
  Server,
  KeyRound,
  Shield
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { NETWORK_HOSPITALS, HospitalFacility } from '../../data/hospitalNetwork';

type AuditSubTab = 'ACCESS_LOGS' | 'DATA_ACCESS' | 'APPROVALS' | 'SYSTEM_EVENTS' | 'POLICY_VIOLATIONS';

export interface DynamicAuditEntry {
  id: string;
  user: string;
  userRole: string;
  action: string;
  actionType: 'VIEW' | 'QUERY' | 'SUMMARY' | 'APPROVE' | 'REJECT' | 'SECURITY_BLOCK' | 'EXPORT' | 'SYNC' | 'GUARDRAIL_INTERCEPT';
  resource: string;
  patient: string;
  patientId: string;
  hospitalCode: string;
  hospitalName: string;
  time: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FLAGGED' | 'BLOCKED';
  notes?: string;
}

interface AuditComplianceCenterViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients?: SyntheticPatient[];
  selectedHospital?: HospitalFacility;
}

export const AuditComplianceCenterView: React.FC<AuditComplianceCenterViewProps> = ({
  currentUser,
  purposeOfUse,
  patients = [],
  selectedHospital,
}) => {
  const { isDark } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<AuditSubTab>('ACCESS_LOGS');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'BLOCKED' | 'FLAGGED'>('ALL');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>(selectedHospital?.id || 'hosp-all');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveLogQueue, setLiveLogQueue] = useState<DynamicAuditEntry[]>([]);

  // Synchronize initial hospital filter if selectedHospital prop updates
  useEffect(() => {
    if (selectedHospital?.id) {
      setSelectedHospitalFilter(selectedHospital.id);
    }
  }, [selectedHospital?.id]);

  // Role Gate: Visible ONLY to Portal Admin
  const isPortalAdmin = currentUser.role === 'PORTAL_ADMIN';

  // Available Hospitals List
  const hospitalList = useMemo(() => {
    return NETWORK_HOSPITALS;
  }, []);

  // Generate dynamic initial audit records based on real patient records and hospital sites
  const baseDynamicLogs = useMemo<DynamicAuditEntry[]>(() => {
    const logs: DynamicAuditEntry[] = [];
    let logCounter = 1000;

    const getTimeOffset = (minutesAgo: number) => {
      const d = new Date(Date.now() - minutesAgo * 60 * 1000);
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const day = d.getDate().toString().padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      return `${day} ${month} ${formattedHours}:${minutes} ${ampm}`;
    };

    // If patients array is provided, dynamically bind patient names, MRNs, assigned hospital sites, and conditions
    if (patients.length > 0) {
      patients.forEach((p, idx) => {
        const hospFacility = hospitalList.find((h) => h.code === p.hospitalSite || h.id === p.hospitalSite) || hospitalList[1];
        
        // 1. Patient Record View Log
        logCounter++;
        logs.push({
          id: `LOG-${logCounter}`,
          user: p.assignedPhysicianId || currentUser.name || 'Dr. John Smith',
          userRole: 'Attending Physician',
          action: 'View Record',
          actionType: 'VIEW',
          resource: `Patient 360 EHR (${p.conditions?.[0]?.name || 'General Health'})`,
          patient: p.fullName,
          patientId: p.mrn || p.id,
          hospitalCode: hospFacility.code,
          hospitalName: hospFacility.shortName,
          time: getTimeOffset(15 + idx * 8),
          ipAddress: `10.0.0.${12 + (idx % 20)}`,
          status: 'SUCCESS',
          notes: `FHIR Patient 360 lookup verified via ABAC treatment scope at ${hospFacility.shortName}`
        });

        // 2. AI Decision Support Q&A Log
        logCounter++;
        logs.push({
          id: `LOG-${logCounter}`,
          user: currentUser.name || 'Dr. John Smith',
          userRole: currentUser.role === 'PORTAL_ADMIN' ? 'Portal Admin / MD' : 'Attending MD',
          action: 'AI Query',
          actionType: 'QUERY',
          resource: `Clinical Q&A (${p.medications?.[0]?.name || 'Guideline Match'})`,
          patient: p.fullName,
          patientId: p.mrn || p.id,
          hospitalCode: hospFacility.code,
          hospitalName: hospFacility.shortName,
          time: getTimeOffset(12 + idx * 8),
          ipAddress: `10.0.0.${12 + (idx % 20)}`,
          status: 'SUCCESS',
          notes: `Gemini 3.6 Flash inference routed with ${purposeOfUse} token`
        });

        // 3. Multimodal RAG Discharge Note Summary
        logCounter++;
        logs.push({
          id: `LOG-${logCounter}`,
          user: currentUser.name || 'Dr. John Smith',
          userRole: 'Attending MD',
          action: 'Generate Summary',
          actionType: 'SUMMARY',
          resource: 'Discharge Note (RAG Vector Index)',
          patient: p.fullName,
          patientId: p.mrn || p.id,
          hospitalCode: hospFacility.code,
          hospitalName: hospFacility.shortName,
          time: getTimeOffset(8 + idx * 8),
          ipAddress: `10.0.0.${12 + (idx % 20)}`,
          status: 'SUCCESS',
          notes: `Multimodal RAG parsed PDF document for ${p.fullName} (${p.mrn})`
        });

        // 4. Order Approval Log
        logCounter++;
        logs.push({
          id: `LOG-${logCounter}`,
          user: p.assignedPhysicianId || 'Dr. John Smith',
          userRole: 'Attending MD',
          action: 'Approve',
          actionType: 'APPROVE',
          resource: `Clinical Order (${p.conditions?.[0]?.name || 'Care Plan'})`,
          patient: p.fullName,
          patientId: p.mrn || p.id,
          hospitalCode: hospFacility.code,
          hospitalName: hospFacility.shortName,
          time: getTimeOffset(3 + idx * 8),
          ipAddress: `10.0.0.${12 + (idx % 20)}`,
          status: 'SUCCESS',
          notes: `Digitally signed SHA-256 order committed to PostgreSQL RDS`
        });
      });
    }

    // Add security audit events & policy blocks for completeness
    logCounter++;
    logs.push({
      id: `LOG-${logCounter}`,
      user: 'External Guest User',
      userRole: 'Unauthenticated Request',
      action: 'Access Attempt',
      actionType: 'SECURITY_BLOCK',
      resource: 'Restricted PHI Endpoint',
      patient: patients[0]?.fullName || 'John Doe',
      patientId: patients[0]?.mrn || 'PT-1000',
      hospitalCode: 'MET-GEN',
      hospitalName: 'Metropolitan General',
      time: getTimeOffset(45),
      ipAddress: '192.168.1.104',
      status: 'BLOCKED',
      notes: 'ABAC Access Denied: Unassigned patient access attempt blocked'
    });

    logCounter++;
    logs.push({
      id: `LOG-${logCounter}`,
      user: currentUser.name || 'Portal Admin',
      userRole: 'System Administrator',
      action: 'Export Logs',
      actionType: 'EXPORT',
      resource: 'HIPAA Compliance Telemetry',
      patient: 'All Network Cohort',
      patientId: 'NET-ALL',
      hospitalCode: 'NET-ALL',
      hospitalName: 'All Network Sites',
      time: getTimeOffset(60),
      ipAddress: '10.0.0.1',
      status: 'SUCCESS',
      notes: 'Exported quarterly HIPAA audit package'
    });

    return logs;
  }, [patients, currentUser, purposeOfUse, hospitalList]);

  // Combine initial dynamic logs with live appended real-time events
  const allDynamicLogs = useMemo(() => {
    return [...liveLogQueue, ...baseDynamicLogs];
  }, [liveLogQueue, baseDynamicLogs]);

  // Filter logs dynamically by Sub-Tab, Selected Hospital, Selected Patient, Search Term, and Status
  const filteredLogs = useMemo(() => {
    return allDynamicLogs.filter((log) => {
      // 1. Hospital Filter
      if (selectedHospitalFilter !== 'hosp-all') {
        const targetHosp = hospitalList.find((h) => h.id === selectedHospitalFilter);
        if (targetHosp && log.hospitalCode !== targetHosp.code && log.hospitalCode !== 'NET-ALL') {
          return false;
        }
      }

      // 2. Patient Filter
      if (selectedPatientFilter !== 'ALL' && log.patientId !== selectedPatientFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== 'ALL' && log.status !== statusFilter) {
        return false;
      }

      // 4. Sub-Tab Specific Filtering
      if (activeSubTab === 'DATA_ACCESS') {
        if (log.actionType !== 'VIEW' && log.actionType !== 'EXPORT') return false;
      } else if (activeSubTab === 'APPROVALS') {
        if (log.actionType !== 'APPROVE' && log.actionType !== 'REJECT') return false;
      } else if (activeSubTab === 'SYSTEM_EVENTS') {
        if (log.actionType !== 'QUERY' && log.actionType !== 'SUMMARY' && log.actionType !== 'SYNC') return false;
      } else if (activeSubTab === 'POLICY_VIOLATIONS') {
        if (log.status !== 'BLOCKED' && log.status !== 'FLAGGED' && log.actionType !== 'SECURITY_BLOCK' && log.actionType !== 'GUARDRAIL_INTERCEPT') return false;
      }

      // 5. Text Search Term Filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.resource.toLowerCase().includes(term) ||
        log.patient.toLowerCase().includes(term) ||
        log.patientId.toLowerCase().includes(term) ||
        log.hospitalName.toLowerCase().includes(term) ||
        log.ipAddress.includes(term)
      );
    });
  }, [allDynamicLogs, selectedHospitalFilter, selectedPatientFilter, statusFilter, activeSubTab, searchTerm, hospitalList]);

  // Simulate a dynamic real-time audit event
  const handleSimulateLiveEvent = () => {
    const randomPatient = patients.length > 0 ? patients[Math.floor(Math.random() * patients.length)] : { fullName: 'Sarah Jenkins', mrn: 'PT-1004', hospitalSite: 'MET-GEN' };
    const currentHosp = hospitalList.find((h) => h.code === randomPatient.hospitalSite || h.id === selectedHospitalFilter) || hospitalList[1];
    
    const actions: Array<{ action: string; actionType: DynamicAuditEntry['actionType']; status: DynamicAuditEntry['status']; resource: string; notes: string }> = [
      {
        action: 'AI Query',
        actionType: 'QUERY',
        status: 'SUCCESS',
        resource: 'Gemini 3.6 Flash Inference',
        notes: `Clinician executed Q&A prompt for ${randomPatient.fullName} at ${currentHosp.shortName}`
      },
      {
        action: 'Approve Order',
        actionType: 'APPROVE',
        status: 'SUCCESS',
        resource: 'Medication Order Signature',
        notes: `Physician electronically signed order for ${randomPatient.fullName}`
      },
      {
        action: 'Guardrail Intercept',
        actionType: 'GUARDRAIL_INTERCEPT',
        status: 'FLAGGED',
        resource: 'DLP Sanitizer Engine',
        notes: `Pre-guardrail sanitized 2 PHI tokens before model inference`
      },
      {
        action: 'FHIR Mesh Sync',
        actionType: 'SYNC',
        status: 'SUCCESS',
        resource: 'Cross-Facility Sync',
        notes: `Synchronized ${randomPatient.fullName} EHR bundle across ${currentHosp.shortName}`
      }
    ];

    const chosen = actions[Math.floor(Math.random() * actions.length)];
    const d = new Date();
    const formattedTime = `${d.getHours() % 12 || 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newLog: DynamicAuditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: currentUser.name || 'Dr. John Smith',
      userRole: currentUser.role === 'PORTAL_ADMIN' ? 'Portal Admin' : 'Attending MD',
      action: chosen.action,
      actionType: chosen.actionType,
      resource: chosen.resource,
      patient: randomPatient.fullName,
      patientId: randomPatient.mrn || randomPatient.id || 'PT-1000',
      hospitalCode: currentHosp.code,
      hospitalName: currentHosp.shortName,
      time: `Today ${formattedTime}`,
      ipAddress: '10.0.0.12',
      status: chosen.status,
      notes: chosen.notes
    };

    setLiveLogQueue((prev) => [newLog, ...prev]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExportCsv = () => {
    const headers = ['Log ID', 'User', 'Role', 'Action', 'Resource', 'Patient', 'Patient ID', 'Hospital', 'Time', 'IP Address', 'Status', 'Notes'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.user,
      l.userRole,
      l.action,
      l.resource,
      l.patient,
      l.patientId,
      l.hospitalName,
      l.time,
      l.ipAddress,
      l.status,
      `"${l.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Compliance_Report_${selectedHospitalFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If user is not Portal Admin, display Security Gate Notice
  if (!isPortalAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 max-w-md space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Portal Admin Authorization Required</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              The <strong className="text-white">Audit & Compliance Center</strong> is strictly restricted to authenticated <span className="text-rose-300 font-bold font-mono">PORTAL_ADMIN</span> users per HIPAA § 164.312 security rule requirements.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 text-[11px] font-mono text-slate-400">
            Current User Role: <strong className="text-amber-300">{currentUser.role}</strong> ({currentUser.name})
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Header Banner - NO '16.' number as per user requirement */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Audit & Compliance Center
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              PORTAL ADMIN VIEW ONLY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic real-time security telemetry, ABAC data access logs, HITL order approvals, and HIPAA/GDPR audit verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic Event Simulation Trigger */}
          <button
            onClick={handleSimulateLiveEvent}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            title="Record a live audit event for current patient cohort"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Real-Time Event</span>
          </button>

          <button
            onClick={handleRefresh}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="Refresh active audit logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC HOSPITAL & PATIENT SELECTION BAR */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900/80 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Dynamic Hospital Network Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Dynamic Hospital Scope:
            </label>
            <select
              value={selectedHospitalFilter}
              onChange={(e) => setSelectedHospitalFilter(e.target.value)}
              className={`mt-0.5 px-3 py-1.5 rounded-xl text-xs font-extrabold focus:outline-none cursor-pointer border ${
                isDark 
                  ? 'bg-slate-950 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              {hospitalList.map((hosp) => (
                <option key={hosp.id} value={hosp.id}>
                  {hosp.name} ({hosp.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Patient Cohort Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Patient Scope:
            </label>
            <select
              value={selectedPatientFilter}
              onChange={(e) => setSelectedPatientFilter(e.target.value)}
              className={`mt-0.5 px-3 py-1.5 rounded-xl text-xs font-extrabold focus:outline-none cursor-pointer border ${
                isDark 
                  ? 'bg-slate-950 border-purple-500/40 text-purple-300' 
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="ALL">All Network Patients ({patients.length})</option>
              {patients.map((p) => (
                <option key={p.id} value={p.mrn || p.id}>
                  {p.fullName} ({p.mrn || p.id}) - {p.hospitalSite}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Purpose of Use Token Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-mono font-bold">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>ABAC Token: {purposeOfUse}</span>
        </div>
      </div>

      {/* Main Workspace Layout: Left Sidebar Navigation + Right Data Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: AUDIT CENTER NAVIGATION CARD                                */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-3 rounded-2xl border p-4 shadow-xl space-y-3 ${
          isDark ? 'bg-[#0a121e] border-white/10' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Audit Center</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {/* Nav 1: Access Logs */}
            <button
              onClick={() => setActiveSubTab('ACCESS_LOGS')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'ACCESS_LOGS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="flex-1">Access Logs</span>
            </button>

            {/* Nav 2: Data Access */}
            <button
              onClick={() => setActiveSubTab('DATA_ACCESS')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'DATA_ACCESS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="flex-1">Data Access</span>
            </button>

            {/* Nav 3: Approvals */}
            <button
              onClick={() => setActiveSubTab('APPROVALS')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'APPROVALS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="flex-1">Approvals</span>
            </button>

            {/* Nav 4: System Events */}
            <button
              onClick={() => setActiveSubTab('SYSTEM_EVENTS')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'SYSTEM_EVENTS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="flex-1">System Events</span>
            </button>

            {/* Nav 5: Policy Violations */}
            <button
              onClick={() => setActiveSubTab('POLICY_VIOLATIONS')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeSubTab === 'POLICY_VIOLATIONS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="flex-1">Policy Violations</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT DATA PANEL: DYNAMIC AUDIT LOGS TABLE & DETAILS                       */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-9 rounded-2xl border p-5 sm:p-6 shadow-xl space-y-4 ${
          isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Panel Header & Filter Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {activeSubTab === 'ACCESS_LOGS' && 'Access Logs'}
                {activeSubTab === 'DATA_ACCESS' && 'Data Access Telemetry'}
                {activeSubTab === 'APPROVALS' && 'Clinician & Order Approvals'}
                {activeSubTab === 'SYSTEM_EVENTS' && 'System Audit Events'}
                {activeSubTab === 'POLICY_VIOLATIONS' && 'Policy Violations & Intercepts'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Showing <strong className="text-cyan-400 font-bold">{filteredLogs.length}</strong> dynamic audit records for site <span className="text-emerald-400 font-bold">{hospitalList.find(h => h.id === selectedHospitalFilter)?.shortName}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by user, patient, IP..."
                  className={`pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                    isDark 
                      ? 'bg-slate-950 border-white/10 text-white focus:border-cyan-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                  isDark ? 'bg-slate-950 border-white/10 text-cyan-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success Only</option>
                <option value="FLAGGED">Flagged Only</option>
                <option value="BLOCKED">Blocked Only</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC ACCESS LOGS TABLE (Matches User Screenshot Format) */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                  isDark ? 'bg-slate-950/70 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <th className="p-3.5 font-bold">User</th>
                  <th className="p-3.5 font-bold">Action</th>
                  <th className="p-3.5 font-bold">Resource</th>
                  <th className="p-3.5 font-bold">Patient</th>
                  <th className="p-3.5 font-bold">Time</th>
                  <th className="p-3.5 font-bold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-mono text-xs">
                      No audit records found matching current hospital/patient filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className={`transition-colors ${
                        log.status === 'BLOCKED' 
                          ? 'bg-rose-500/10 hover:bg-rose-500/15' 
                          : log.status === 'FLAGGED'
                          ? 'bg-amber-500/10 hover:bg-amber-500/15'
                          : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* User */}
                      <td className="p-3.5 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{log.user}</span>
                          {log.userRole.includes('MD') || log.userRole.includes('Physician') ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                              MD
                            </span>
                          ) : log.userRole.includes('Admin') ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                              ADMIN
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{log.userRole}</span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono ${
                          log.actionType === 'VIEW' 
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : log.actionType === 'QUERY'
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : log.actionType === 'SUMMARY'
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            : log.actionType === 'APPROVE'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : log.actionType === 'GUARDRAIL_INTERCEPT'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="p-3.5 text-slate-200 font-mono">
                        <div>{log.resource}</div>
                        <span className="text-[10px] text-slate-500 block">{log.notes}</span>
                      </td>

                      {/* Patient */}
                      <td className="p-3.5 font-semibold text-cyan-300">
                        {log.patient}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{log.patientId}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{log.hospitalCode}</span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="p-3.5 text-slate-300 font-mono whitespace-nowrap">
                        {log.time}
                      </td>

                      {/* IP Address */}
                      <td className="p-3.5 text-slate-400 font-mono">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM COMPLIANCE BADGES (EXACT MATCH TO USER SCREENSHOT)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Badge 1: HIPAA Compliant */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm shadow-md transition-transform hover:scale-[1.01] ${
          isDark 
            ? 'bg-slate-900/90 border-emerald-500/30 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>HIPAA Compliant</span>
        </div>

        {/* Badge 2: GDPR Compliant */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm shadow-md transition-transform hover:scale-[1.01] ${
          isDark 
            ? 'bg-slate-900/90 border-emerald-500/30 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>GDPR Compliant</span>
        </div>

        {/* Badge 3: Audit Ready */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm shadow-md transition-transform hover:scale-[1.01] ${
          isDark 
            ? 'bg-slate-900/90 border-emerald-500/30 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>Audit Ready</span>
        </div>
      </div>
    </div>
  );
};
