import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  Share2, 
  Building, 
  ShieldCheck, 
  Lock, 
  Eye, 
  History, 
  Download, 
  Users, 
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { 
  SyntheticPatient, 
  UserProfile, 
  PurposeOfUse, 
  ClinicalTeamNote 
} from '../../types';
import { 
  getAllTeamNotes, 
  getRoleBadgeStyle 
} from '../../data/syntheticTeamNotes';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';

interface ClinicalReportsCenterViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients?: SyntheticPatient[];
  onOpenPatient360: (patientId: string) => void;
  onOpenKnowledgeQA: (query: string, patientRef?: SyntheticPatient) => void;
  onOpenWorkflow: () => void;
  onBack?: () => void;
}

export const ClinicalReportsCenterView: React.FC<ClinicalReportsCenterViewProps> = ({
  currentUser,
  purposeOfUse,
  patients = SYNTHETIC_PATIENTS,
  onOpenPatient360,
  onOpenKnowledgeQA,
  onOpenWorkflow,
  onBack,
}) => {
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReportIds, setExpandedReportIds] = useState<Record<string, boolean>>({
    'NOTE-DOC-001': true,
    'NOTE-NURSE-001': true,
    'NOTE-DOC-002': true,
    'NOTE-NURSE-002': true,
    'NOTE-DOC-003': true,
  });
  const [expandedAiDraftIds, setExpandedAiDraftIds] = useState<Record<string, boolean>>({});
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);

  const allNotes = getAllTeamNotes();

  const filteredReports = allNotes.filter((note) => {
    // Patient filter
    if (selectedPatientFilter !== 'ALL' && note.patientId !== selectedPatientFilter) {
      return false;
    }

    // Role filter
    if (selectedRoleFilter !== 'ALL') {
      if (selectedRoleFilter === 'DOCTOR' && !['DOCTOR', 'PHYSICIAN', 'CLINICIAN'].includes(note.authorRole)) {
        return false;
      }
      if (selectedRoleFilter === 'NURSE' && note.authorRole !== 'NURSE') {
        return false;
      }
      if (selectedRoleFilter === 'SPECIALIST' && note.authorRole !== 'SPECIALIST') {
        return false;
      }
      if (selectedRoleFilter === 'CARE_COORDINATOR' && note.authorRole !== 'CARE_COORDINATOR') {
        return false;
      }
      if (selectedRoleFilter === 'ADMINISTRATOR' && note.authorRole !== 'ADMINISTRATOR') {
        return false;
      }
      if (selectedRoleFilter === 'PORTAL_ADMIN' && note.authorRole !== 'PORTAL_ADMIN') {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(q);
      const authorMatch = note.authorName.toLowerCase().includes(q);
      const patientMatch = note.patientName.toLowerCase().includes(q);
      const roleMatch = note.authorRole.toLowerCase().includes(q);
      const textMatch = (
        (note.content.subjective || '') +
        (note.content.assessment || '') +
        (note.content.plan || '') +
        (note.content.summary || '')
      ).toLowerCase().includes(q);

      return titleMatch || authorMatch || patientMatch || roleMatch || textMatch;
    }

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedReportIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAiDraftExpand = (id: string) => {
    setExpandedAiDraftIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllReports = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    filteredReports.forEach((r) => {
      next[r.id] = expand;
    });
    setExpandedReportIds(next);
  };

  const allAreExpanded = filteredReports.length > 0 && filteredReports.every((r) => expandedReportIds[r.id] !== false);

  const handleCopyReport = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReportId(id);
    setTimeout(() => setCopiedReportId(null), 2000);
  };

  // Metric counts
  const totalNotes = allNotes.length;
  const docNotesCount = allNotes.filter((n) => ['DOCTOR', 'PHYSICIAN', 'CLINICIAN'].includes(n.authorRole)).length;
  const nurseNotesCount = allNotes.filter((n) => n.authorRole === 'NURSE').length;
  const specialistNotesCount = allNotes.filter((n) => n.authorRole === 'SPECIALIST').length;
  const coordNotesCount = allNotes.filter((n) => n.authorRole === 'CARE_COORDINATOR').length;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back Action */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Interdisciplinary Clinical Reports & Documentation Center</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Universal Care Team Access
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Centralized repository of verified clinical documentation, progress notes, and signed care summaries accessible to all practitioners.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenWorkflow}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Draft New Clinical Note</span>
            </button>
          </div>
        </div>

        {/* Analytics Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Reports</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalNotes}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Across all active wards</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Physician & Specialist</div>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">{docNotesCount + specialistNotesCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Progress & Consults</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nursing & Shift</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{nurseNotesCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Telemetry & Vitals</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Care Coordination</div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">{coordNotesCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Discharge & Handoffs</div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Patient Selector Filter */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">
              Filter by Patient
            </label>
            <select
              value={selectedPatientFilter}
              onChange={(e) => setSelectedPatientFilter(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              <option value="ALL">All Patients ({patients.length} records)</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id}) - {p.mrn}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline / Role Selector Filter */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">
              Filter by Author Discipline
            </label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              <option value="ALL">All Disciplines & Roles</option>
              <option value="DOCTOR">Attending Physicians & Doctors</option>
              <option value="NURSE">Registered Nurses (RN / BSN)</option>
              <option value="SPECIALIST">Cardiology & Medical Specialists</option>
              <option value="CARE_COORDINATOR">Care Coordinators & Navigators</option>
              <option value="ADMINISTRATOR">Clinical Administrators</option>
              <option value="PORTAL_ADMIN">Portal Auditors & Admins</option>
            </select>
          </div>

          {/* Free text search bar */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">
              Search Clinical Text
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search diagnoses, plans, vitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-blue-400 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List Header & Master Expand/Collapse */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="text-xs text-slate-300">
          Showing <strong className="text-white">{filteredReports.length}</strong> verified clinical report{filteredReports.length === 1 ? '' : 's'}
        </div>

        {filteredReports.length > 0 && (
          <button
            onClick={() => toggleAllReports(!allAreExpanded)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer hover:border-white/20"
          >
            {allAreExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{allAreExpanded ? 'Collapse All Reports' : 'Expand All Reports'}</span>
          </button>
        )}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-12 text-center text-slate-300 space-y-3 shadow-xl">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Clinical Reports Match Filter</h3>
          <p className="text-xs max-w-md mx-auto text-slate-400">
            Try resetting your search query or author discipline filters above to view all documentation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const badge = getRoleBadgeStyle(report.authorRole);
            const isExpanded = expandedReportIds[report.id] ?? true;
            const patientRef = patients.find((p) => p.id === report.patientId);

            const fullReportText = [
              `REPORT: ${report.title}`,
              `PATIENT: ${report.patientName} (${report.patientId})`,
              `AUTHOR: ${report.authorName} (${report.authorRole}) - ${report.authorDepartment}`,
              `DATE: ${report.timestamp}`,
              report.content.subjective ? `\nSUBJECTIVE:\n${report.content.subjective}` : '',
              report.content.objective ? `\nOBJECTIVE:\n${typeof report.content.objective === 'string' ? report.content.objective : `Vitals: ${report.content.objective.vitals}\nExam: ${report.content.objective.physicalExam}\nLabs: ${report.content.objective.recentLabs}`}` : '',
              report.content.assessment ? `\nASSESSMENT:\n${report.content.assessment}` : '',
              report.content.plan ? `\nPLAN:\n${report.content.plan}` : '',
              report.content.keyRecommendations?.length ? `\nRECOMMENDATIONS:\n- ${report.content.keyRecommendations.join('\n- ')}` : '',
              `\nSIGNATURE: ${report.signatureHash}`
            ].filter(Boolean).join('\n');

            return (
              <div 
                key={report.id}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 transition-all hover:border-white/20"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${badge.bg} ${badge.border} border text-white shrink-0 mt-0.5`}>
                      {report.authorRole === 'DOCTOR' || report.authorRole === 'PHYSICIAN' ? <Stethoscope className="w-5 h-5 text-blue-400" /> :
                       report.authorRole === 'NURSE' ? <HeartPulse className="w-5 h-5 text-emerald-400" /> :
                       report.authorRole === 'SPECIALIST' ? <Activity className="w-5 h-5 text-purple-400" /> :
                       report.authorRole === 'CARE_COORDINATOR' ? <Share2 className="w-5 h-5 text-amber-400" /> :
                       report.authorRole === 'ADMINISTRATOR' ? <Building className="w-5 h-5 text-rose-400" /> :
                       <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{report.title}</h3>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                        {(report.isEditedByClinician || report.originalAiDraft) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            AI Draft Amended & Signed by {report.editorName || report.authorName}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span>Patient: <strong className="text-white">{report.patientName}</strong> ({report.patientId})</span>
                        <span>•</span>
                        <span>Author: <strong className="text-slate-200">{report.authorName}</strong> ({report.authorDepartment})</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {report.status.replace(/_/g, ' ')}
                    </span>

                    <button
                      onClick={() => handleCopyReport(report.id, fullReportText)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Full Report Text"
                    >
                      {copiedReportId === report.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => toggleExpand(report.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse Report' : 'Expand Report'}
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Report Content */}
                {isExpanded && (
                  <div className="space-y-4 text-xs">
                    {/* Earlier AI Draft Comparison if amended */}
                    {report.originalAiDraft && (
                      <div className="border border-cyan-500/30 bg-slate-950/60 rounded-xl p-3.5 space-y-2 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-cyan-400" />
                            Archived Earlier AI Draft (Pre-Correction Snapshot)
                          </div>
                          <button
                            onClick={() => toggleAiDraftExpand(report.id)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {expandedAiDraftIds[report.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {expandedAiDraftIds[report.id] ? 'Hide Earlier AI Draft' : 'Expand Earlier AI Draft'}
                          </button>
                        </div>

                        {expandedAiDraftIds[report.id] && (
                          <div className="pt-2 border-t border-cyan-500/20 space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-3 rounded-lg leading-relaxed">
                            {report.originalAiDraft.subjective && (
                              <div><strong className="text-cyan-400">AI Subjective:</strong> {report.originalAiDraft.subjective}</div>
                            )}
                            {report.originalAiDraft.assessment && (
                              <div><strong className="text-cyan-400">AI Assessment:</strong> {report.originalAiDraft.assessment}</div>
                            )}
                            {report.originalAiDraft.plan && (
                              <div><strong className="text-cyan-400">AI Plan:</strong> {report.originalAiDraft.plan}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Subjective */}
                    {report.content.subjective && (
                      <div className="space-y-1">
                        <div className="font-bold text-cyan-300 uppercase text-[11px] flex items-center gap-1.5">
                          <span>Subjective / Clinical History</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                          {report.content.subjective}
                        </p>
                      </div>
                    )}

                    {/* Objective */}
                    {report.content.objective && (
                      <div className="space-y-1">
                        <div className="font-bold text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
                          <span>Objective Telemetry, Physical & Labs</span>
                        </div>
                        <div className="text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1.5 backdrop-blur-md">
                          {typeof report.content.objective === 'string' ? (
                            <p>{report.content.objective}</p>
                          ) : (
                            <>
                              {report.content.objective.vitals && (
                                <div><strong className="text-slate-200">Vitals / Telemetry:</strong> {report.content.objective.vitals}</div>
                              )}
                              {report.content.objective.physicalExam && (
                                <div><strong className="text-slate-200">Physical Exam:</strong> {report.content.objective.physicalExam}</div>
                              )}
                              {report.content.objective.recentLabs && (
                                <div><strong className="text-slate-200">Diagnostics / Labs:</strong> {report.content.objective.recentLabs}</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assessment */}
                    {report.content.assessment && (
                      <div className="space-y-1">
                        <div className="font-bold text-blue-300 uppercase text-[11px] flex items-center gap-1.5">
                          <span>Assessment & Diagnostic Synthesis</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                          {report.content.assessment}
                        </p>
                      </div>
                    )}

                    {/* Plan */}
                    {report.content.plan && (
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-300 uppercase text-[11px] flex items-center gap-1.5">
                          <span>Plan of Care & Orders</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                          {report.content.plan}
                        </p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {report.content.keyRecommendations && report.content.keyRecommendations.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 space-y-1.5 backdrop-blur-md">
                        <div className="font-bold uppercase tracking-wider text-[11px] text-cyan-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          Key Interdisciplinary Recommendations:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-200 text-xs">
                          {report.content.keyRecommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-teal-400" />
                          Sig: {report.signatureHash.slice(0, 18)}...
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onOpenPatient360(report.patientId)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Patient 360</span>
                        </button>

                        <button
                          onClick={() => onOpenKnowledgeQA(
                            `Synthesize the ${badge.label} documentation written by ${report.authorName} for patient ${report.patientName}: "${report.title}". What are the critical clinical insights?`,
                            patientRef
                          )}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          <span>Ask AI About Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
