import React, { useState } from 'react';
import { 
  SyntheticPatient, 
  UserProfile, 
  PurposeOfUse,
  UserRole 
} from '../../types';
import { getPatientAvatarUrl } from '../../utils/patientAvatar';
import { 
  UserCheck, 
  Calendar, 
  Building, 
  AlertTriangle, 
  Pill, 
  Activity, 
  Clock, 
  ShieldCheck, 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Stethoscope,
  HeartPulse,
  Share2,
  FileCheck,
  Filter,
  History
} from 'lucide-react';
import { 
  getTeamNotesForPatient, 
  getRoleBadgeStyle, 
  getDraftNoteButtonLabel 
} from '../../data/syntheticTeamNotes';

interface Patient360ViewProps {
  patient: SyntheticPatient;
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onBackToSearch: () => void;
  onOpenKnowledgeQA: (prefilledQuery?: string, patient?: SyntheticPatient) => void;
  onOpenWorkflow: (workflowType: 'CLINICAL_NOTE' | 'DISCHARGE_SUMMARY' | 'SPECIALIST_REFERRAL') => void;
}

export const Patient360View: React.FC<Patient360ViewProps> = ({
  patient,
  currentUser,
  purposeOfUse,
  onBackToSearch,
  onOpenKnowledgeQA,
  onOpenWorkflow,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAM_NOTES' | 'TIMELINE' | 'LABS' | 'MEDS' | 'PROVENANCE'>('OVERVIEW');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoteIds, setExpandedNoteIds] = useState<Record<string, boolean>>({
    'NOTE-DOC-001': true,
    'NOTE-NURSE-001': true,
    'NOTE-DOC-002': true,
    'NOTE-NURSE-002': true,
    'NOTE-DOC-003': true,
    'NOTE-NURSE-003': true,
  });
  const [expandedAiDraftIds, setExpandedAiDraftIds] = useState<Record<string, boolean>>({});
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const teamNotes = getTeamNotesForPatient(patient.id);

  const filteredNotes = teamNotes.filter((note) => {
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

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(q);
      const authorMatch = note.authorName.toLowerCase().includes(q);
      const roleMatch = note.authorRole.toLowerCase().includes(q);
      const textMatch = (
        (note.content.subjective || '') +
        (note.content.assessment || '') +
        (note.content.plan || '') +
        (note.content.summary || '')
      ).toLowerCase().includes(q);
      return titleMatch || authorMatch || roleMatch || textMatch;
    }

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedNoteIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAiDraftExpand = (id: string) => {
    setExpandedAiDraftIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllNotes = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    filteredNotes.forEach(n => {
      next[n.id] = expand;
    });
    setExpandedNoteIds(next);
  };

  const allAreExpanded = filteredNotes.length > 0 && filteredNotes.every(n => expandedNoteIds[n.id] !== false);

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Counts by role
  const docCount = teamNotes.filter(n => ['DOCTOR', 'PHYSICIAN', 'CLINICIAN'].includes(n.authorRole)).length;
  const nurseCount = teamNotes.filter(n => n.authorRole === 'NURSE').length;
  const specCount = teamNotes.filter(n => n.authorRole === 'SPECIALIST').length;
  const coordCount = teamNotes.filter(n => n.authorRole === 'CARE_COORDINATOR').length;
  const adminCount = teamNotes.filter(n => n.authorRole === 'ADMINISTRATOR').length;
  const portalCount = teamNotes.filter(n => n.authorRole === 'PORTAL_ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Patient Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onBackToSearch}
              className="mt-1 p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors cursor-pointer"
              title="Back to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Patient Portrait Photo */}
            <div className="relative shrink-0">
              <img
                src={getPatientAvatarUrl(patient)}
                alt={patient.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                patient.consentStatus === 'ACTIVE_CONSENT' ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white">{patient.fullName}</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {patient.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  patient.consentStatus === 'ACTIVE_CONSENT'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {patient.consentStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>DOB: <strong className="text-white">{patient.birthDate}</strong> ({patient.age} yrs)</span>
                <span>Gender: <strong className="text-white">{patient.gender}</strong></span>
                <span>MRN: <strong className="text-white font-mono">{patient.mrn}</strong></span>
                <span>Facility: <strong className="text-white">{patient.hospitalSite}</strong></span>
                {patient.roomBed && <span>Location: <strong className="text-blue-300">{patient.roomBed}</strong></span>}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Clinician */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenKnowledgeQA(
                `What is the recommended hospital protocol and medication guidelines for managing ${patient.fullName} (MRN: ${patient.mrn}) with ${patient.conditions[0]?.name || 'Heart Failure'}?`,
                patient
              )}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Guideline Q&A for Patient
            </button>

            <button
              onClick={() => onOpenWorkflow('CLINICAL_NOTE')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{getDraftNoteButtonLabel(currentUser.role)}</span>
            </button>
          </div>
        </div>

        {/* Data Completeness Alerts Banner if present */}
        {patient.completenessAlerts.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Data Quality Alert:</strong> {patient.completenessAlerts[0].message}</span>
            </div>
            <span className="text-[11px] font-mono text-amber-300 shrink-0">FHIR Resource: {patient.completenessAlerts[0].field}</span>
          </div>
        )}

        {/* Navigation Tabs for Patient 360 */}
        <div className="flex items-center gap-1 mt-6 border-t border-white/10 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveTab('TEAM_NOTES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'TEAM_NOTES'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Care Team Notes ({teamNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'TIMELINE'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Longitudinal Timeline ({patient.encounters.length} Encounters)
          </button>
          <button
            onClick={() => setActiveTab('LABS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'LABS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Lab Trends & Vitals ({patient.observations.length})
          </button>
          <button
            onClick={() => setActiveTab('MEDS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'MEDS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            Medications & Allergies
          </button>
          <button
            onClick={() => setActiveTab('PROVENANCE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'PROVENANCE'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Data Provenance & Integrity
          </button>
        </div>
      </div>

      {/* Care Team Notes Tab */}
      {activeTab === 'TEAM_NOTES' && (
        <div className="space-y-6">
          {/* Top Filter and Search Bar */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Interdisciplinary Care Team Notes ({filteredNotes.length} of {teamNotes.length})
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Cross-disciplinary clinical, nursing, specialist, care coordination, and administrative documentation for <strong className="text-white">{patient.fullName}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenWorkflow('CLINICAL_NOTE')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ {getDraftNoteButtonLabel(currentUser.role)}</span>
                </button>
              </div>
            </div>

            {/* Current user session banner */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace(/_/g, ' ')}) • Viewing notes contributed by all disciplines who treated this patient.
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-300 shrink-0">
                Department: {currentUser.department}
              </span>
            </div>

            {/* Separate Option Buttons to filter by author role */}
            <div className="pt-2 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  Filter by Role:
                </span>
                <button
                  onClick={() => setSelectedRoleFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  All Notes ({teamNotes.length})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('DOCTOR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'DOCTOR'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Doctors ({docCount})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('NURSE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'NURSE'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Nurses ({nurseCount})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('SPECIALIST')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'SPECIALIST'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Specialists ({specCount})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('CARE_COORDINATOR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'CARE_COORDINATOR'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Care Coordinators ({coordCount})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('ADMINISTRATOR')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'ADMINISTRATOR'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Administrators ({adminCount})
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('PORTAL_ADMIN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRoleFilter === 'PORTAL_ADMIN'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Portal Admins ({portalCount})
                </button>
              </div>

              {/* Search in notes */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search note content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* List of Team Notes Header & Master Expand/Collapse Control */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="text-xs text-slate-300">
              Showing <strong className="text-white">{filteredNotes.length}</strong> care team documentation record{filteredNotes.length === 1 ? '' : 's'}
            </div>

            {filteredNotes.length > 0 && (
              <button
                onClick={() => toggleAllNotes(!allAreExpanded)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer hover:border-white/20"
              >
                {allAreExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{allAreExpanded ? 'Collapse All Notes' : 'Expand All Notes'}</span>
              </button>
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-12 text-center text-slate-300 space-y-3 shadow-xl">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Notes Found for this Selection</h3>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                No care team documentation matches the selected role filter or search criteria for {patient.fullName}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => {
                const badge = getRoleBadgeStyle(note.authorRole);
                const isExpanded = expandedNoteIds[note.id] ?? true;
                const isCurrentUsersNote = currentUser.id === note.authorId || currentUser.role === note.authorRole;

                const fullNoteText = [
                  `NOTE: ${note.title}`,
                  `AUTHOR: ${note.authorName} (${note.authorRole}) - ${note.authorDepartment}`,
                  `DATE: ${note.timestamp}`,
                  `PATIENT: ${note.patientName} (${patient.mrn})`,
                  note.content.subjective ? `\nSUBJECTIVE:\n${note.content.subjective}` : '',
                  note.content.objective ? `\nOBJECTIVE:\n${typeof note.content.objective === 'string' ? note.content.objective : `Vitals: ${note.content.objective.vitals}\nExam: ${note.content.objective.physicalExam}\nLabs: ${note.content.objective.recentLabs}`}` : '',
                  note.content.assessment ? `\nASSESSMENT:\n${note.content.assessment}` : '',
                  note.content.plan ? `\nPLAN:\n${note.content.plan}` : '',
                  note.content.summary ? `\nSUMMARY:\n${note.content.summary}` : '',
                  note.content.keyRecommendations?.length ? `\nRECOMMENDATIONS:\n${note.content.keyRecommendations.join('\n- ')}` : '',
                  `\nSIGNATURE: ${note.signatureHash}`
                ].filter(Boolean).join('\n');

                return (
                  <div 
                    key={note.id}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 transition-all hover:border-white/20"
                  >
                    {/* Note Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-white/10">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${badge.bg} ${badge.border} border text-white shrink-0 mt-0.5`}>
                          {note.authorRole === 'DOCTOR' || note.authorRole === 'PHYSICIAN' ? <Stethoscope className="w-5 h-5 text-blue-400" /> :
                           note.authorRole === 'NURSE' ? <HeartPulse className="w-5 h-5 text-emerald-400" /> :
                           note.authorRole === 'SPECIALIST' ? <Activity className="w-5 h-5 text-purple-400" /> :
                           note.authorRole === 'CARE_COORDINATOR' ? <Share2 className="w-5 h-5 text-amber-400" /> :
                           note.authorRole === 'ADMINISTRATOR' ? <Building className="w-5 h-5 text-rose-400" /> :
                           <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white">{note.title}</h3>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                            {isCurrentUsersNote && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Your Discipline
                              </span>
                            )}
                            {(note.isEditedByClinician || note.originalAiDraft) && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                AI Draft Amended & Signed by {note.editorName || note.authorName}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span>Author: <strong className="text-white">{note.authorName}</strong></span>
                            <span>•</span>
                            <span>Dept: <strong className="text-slate-200">{note.authorDepartment}</strong></span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {note.status.replace(/_/g, ' ')}
                        </span>

                        <button
                          onClick={() => handleCopyNote(note.id, fullNoteText)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Full Note Text"
                        >
                          {copiedNoteId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => toggleExpand(note.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse Note' : 'Expand Note'}
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Note Content (Expandable) */}
                    {isExpanded && (
                      <div className="space-y-4 text-xs">
                        {/* Earlier AI Draft Comparison (if present) */}
                        {note.originalAiDraft && (
                          <div className="border border-cyan-500/30 bg-slate-950/60 rounded-xl p-3.5 space-y-2 backdrop-blur-md">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                                <History className="w-3.5 h-3.5 text-cyan-400" />
                                Archived Earlier AI Draft (Pre-Correction Snapshot)
                              </div>
                              <button
                                onClick={() => toggleAiDraftExpand(note.id)}
                                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {expandedAiDraftIds[note.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {expandedAiDraftIds[note.id] ? 'Hide Earlier AI Draft' : 'Expand Earlier AI Draft'}
                              </button>
                            </div>

                            {expandedAiDraftIds[note.id] && (
                              <div className="pt-2 border-t border-cyan-500/20 space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-3 rounded-lg leading-relaxed">
                                {note.originalAiDraft.subjective && (
                                  <div>
                                    <strong className="text-cyan-400">AI Subjective:</strong> {note.originalAiDraft.subjective}
                                  </div>
                                )}
                                {note.originalAiDraft.assessment && (
                                  <div>
                                    <strong className="text-cyan-400">AI Assessment:</strong> {note.originalAiDraft.assessment}
                                  </div>
                                )}
                                {note.originalAiDraft.plan && (
                                  <div>
                                    <strong className="text-cyan-400">AI Plan:</strong> {note.originalAiDraft.plan}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Subjective */}
                        {note.content.subjective && (
                          <div className="space-y-1">
                            <div className="font-bold text-cyan-300 uppercase text-[11px] flex items-center gap-1.5">
                              <span>Subjective / Clinical History</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                              {note.content.subjective}
                            </p>
                          </div>
                        )}

                        {/* Objective */}
                        {note.content.objective && (
                          <div className="space-y-1">
                            <div className="font-bold text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
                              <span>Objective Telemetry, Physical & Labs</span>
                            </div>
                            <div className="text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1.5 backdrop-blur-md">
                              {typeof note.content.objective === 'string' ? (
                                <p>{note.content.objective}</p>
                              ) : (
                                <>
                                  {note.content.objective.vitals && (
                                    <div><strong className="text-slate-200">Vitals / Telemetry:</strong> {note.content.objective.vitals}</div>
                                  )}
                                  {note.content.objective.physicalExam && (
                                    <div><strong className="text-slate-200">Physical Exam:</strong> {note.content.objective.physicalExam}</div>
                                  )}
                                  {note.content.objective.recentLabs && (
                                    <div><strong className="text-slate-200">Diagnostics / Labs:</strong> {note.content.objective.recentLabs}</div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Assessment */}
                        {note.content.assessment && (
                          <div className="space-y-1">
                            <div className="font-bold text-blue-300 uppercase text-[11px] flex items-center gap-1.5">
                              <span>Assessment & Diagnostic Synthesis</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                              {note.content.assessment}
                            </p>
                          </div>
                        )}

                        {/* Plan */}
                        {note.content.plan && (
                          <div className="space-y-1">
                            <div className="font-bold text-emerald-300 uppercase text-[11px] flex items-center gap-1.5">
                              <span>Plan of Care & Orders</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
                              {note.content.plan}
                            </p>
                          </div>
                        )}

                        {/* Key Recommendations */}
                        {note.content.keyRecommendations && note.content.keyRecommendations.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 space-y-1.5 backdrop-blur-md">
                            <div className="font-bold uppercase tracking-wider text-[11px] text-cyan-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                              Key Interdisciplinary Recommendations:
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-200 text-xs">
                              {note.content.keyRecommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Footer with Tags, Cryptographic Signature, and Ask AI action */}
                        <div className="pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-mono">Tags:</span>
                            {note.tags.map((tag, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-teal-400" />
                              Sig: {note.signatureHash.slice(0, 18)}...
                            </span>

                            <button
                              onClick={() => onOpenKnowledgeQA(
                                `Review the ${badge.label} note written by ${note.authorName} on ${note.timestamp.split('T')[0]} for ${patient.fullName}: "${note.title}". What are the key clinical takeaways and next steps?`,
                                patient
                              )}
                              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-blue-400" />
                              Ask AI about this Note
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
      )}

      {/* Main Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Conditions */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Active Clinical Conditions
              </h2>
              <span className="text-[11px] font-mono text-slate-400">{patient.conditions.length} Active</span>
            </div>

            <div className="space-y-3">
              {patient.conditions.map((cond) => (
                <div key={cond.id} className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white">{cond.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                      {cond.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Onset: {cond.onsetDate}</span>
                    <span className="text-rose-400 font-semibold">{cond.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Medications & Allergy Alerts */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-400" />
                Current Regimen & Allergies
              </h2>
              <span className="text-[11px] font-mono text-slate-400">{patient.medications.length} Meds</span>
            </div>

            {/* Critical Allergy Card */}
            {patient.allergies.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 backdrop-blur-md">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Active Severe Allergy Alert
                </div>
                {patient.allergies.map((alg) => (
                  <div key={alg.id} className="text-xs">
                    <strong className="text-white">{alg.substance}:</strong> {alg.reaction} ({alg.severity})
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {patient.medications.map((med) => (
                <div key={med.id} className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white">{med.name}</span>
                    <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    <div>Route: {med.route} • {med.frequency}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Prescribed by {med.prescribingProvider}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Lab Indicators & Trends */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Key Diagnostic Biomarkers
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Latest Values</span>
            </div>

            <div className="space-y-3">
              {patient.observations.map((lab) => {
                return (
                  <div key={lab.id} className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-100">{lab.name}</div>
                        <div className="text-[10px] text-slate-400">Ref: {lab.referenceRange}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-extrabold font-mono ${
                          lab.status === 'ABNORMAL_HIGH' ? 'text-amber-400' :
                          lab.status === 'ABNORMAL_LOW' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {lab.value} <span className="text-[10px] text-slate-400">{lab.unit}</span>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">
                          {lab.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Sparkline trend representation */}
                    {lab.trend && lab.trend.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span>5-point Trend:</span>
                        <div className="flex items-center gap-1 font-mono text-slate-300">
                          {lab.trend.map((val, idx) => (
                            <span key={idx} className="bg-white/10 px-1 py-0.5 rounded border border-white/10">
                              {val}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Longitudinal Timeline Tab */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Longitudinal Clinical Encounter History
          </h2>

          <div className="relative border-l-2 border-white/10 pl-6 ml-3 space-y-8">
            {patient.encounters.map((enc) => (
              <div key={enc.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 group-hover:scale-125 transition-transform" />

                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {enc.type} ENCOUNTER
                      </span>
                      <h3 className="text-sm font-bold text-white">{enc.department}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{enc.admissionDate.split('T')[0]}</span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1.5">
                    <div><strong className="text-slate-400">Chief Complaint:</strong> {enc.chiefComplaint}</div>
                    <div><strong className="text-slate-400">Attending Physician:</strong> {enc.attendingPhysician}</div>
                    {enc.dischargeSummaryNote && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-300 italic">
                        "{enc.dischargeSummaryNote}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Labs Tab */}
      {activeTab === 'LABS' && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            Complete Laboratory Observations & Diagnostic Series
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.observations.map((lab) => (
              <div key={lab.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm text-white">{lab.name}</div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">LOINC: {lab.code}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-cyan-400 font-mono">{lab.value}</span>
                  <span className="text-xs text-slate-400">{lab.unit}</span>
                  <span className="text-xs text-slate-400 ml-auto">Ref: {lab.referenceRange}</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-white/10">
                  <div>Timestamp: {lab.effectiveDateTime}</div>
                  <div>Source: {lab.provenance.sourceSystem}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'MEDS' && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-400" />
            Active Inpatient & Home Medication Administration Record (MAR)
          </h2>

          <div className="space-y-3">
            {patient.medications.map((med) => (
              <div key={med.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{med.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-mono">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Route: {med.route} • Frequency: {med.frequency} • Indication: {med.indications}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 shrink-0">
                  <div>Prescribed: {med.prescribedDate}</div>
                  <div className="text-slate-400">{med.prescribingProvider}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provenance Tab */}
      {activeTab === 'PROVENANCE' && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            FHIR Resource Provenance & Cryptographic Lineage
          </h2>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 font-mono text-xs space-y-3">
            <div><strong className="text-slate-400">Authoritative Source System:</strong> <span className="text-cyan-300">{patient.provenance.sourceSystem}</span></div>
            <div><strong className="text-slate-400">Ingestion Timestamp:</strong> <span className="text-slate-200">{patient.provenance.ingestionTimestamp}</span></div>
            <div><strong className="text-slate-400">Attesting Clinician:</strong> <span className="text-slate-200">{patient.provenance.recordedBy}</span></div>
            <div><strong className="text-slate-400">Verification Status:</strong> <span className="text-emerald-400">{patient.provenance.verificationStatus}</span></div>
            <div><strong className="text-slate-400">Data Integrity Checksum:</strong> <span className="text-slate-300">{patient.provenance.checksum}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

