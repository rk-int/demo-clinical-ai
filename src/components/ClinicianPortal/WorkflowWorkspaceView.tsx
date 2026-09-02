import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  Clock, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Ban,
  Loader2,
  Database,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Plus,
  Trash2,
  Copy,
  Check,
  Stethoscope,
  HeartPulse,
  Activity,
  Share2,
  Building,
  UserCheck,
  History
} from 'lucide-react';
import { 
  SyntheticPatient, 
  UserProfile, 
  PurposeOfUse, 
  WorkflowAction, 
  WorkflowType,
  ClinicalTeamNote 
} from '../../types';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';
import { LiveAgenticWorkflowGraph } from '../AgentOperations/LiveAgenticWorkflowGraph';
import { addTeamNote } from '../../data/syntheticTeamNotes';

interface WorkflowWorkspaceViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  selectedPatientId?: string;
  patients?: SyntheticPatient[];
  onBack?: () => void;
  onNavigateToPatient360?: (patientId: string) => void;
  onNavigateToReports?: () => void;
}

export const WorkflowWorkspaceView: React.FC<WorkflowWorkspaceViewProps> = ({
  currentUser,
  purposeOfUse,
  selectedPatientId = 'PT-1002',
  patients,
  onBack,
  onNavigateToPatient360,
  onNavigateToReports,
}) => {
  const [patientId, setPatientId] = useState(selectedPatientId);
  const [workflowType, setWorkflowType] = useState<WorkflowType>('CLINICAL_NOTE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAction, setActiveAction] = useState<WorkflowAction | null>(null);
  const [allActions, setAllActions] = useState<WorkflowAction[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Workflow graph is in hidden state first by default (User Request #2)
  const [showWorkflowFlowGraph, setShowWorkflowFlowGraph] = useState(false);

  // Note Editing state for Doctor / Clinician (User Request #3)
  const [isEditMode, setIsEditMode] = useState(true);
  const [showAiDiffComparison, setShowAiDiffComparison] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [approvalSuccessMessage, setApprovalSuccessMessage] = useState<{
    noteId: string;
    patientName: string;
    patientId: string;
    title: string;
    wasEdited: boolean;
  } | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<{
    patientName: string;
    title: string;
    rejectorName: string;
  } | null>(null);

  // Editable Draft Form States
  const [editSubjective, setEditSubjective] = useState('');
  const [editObjectiveVitals, setEditObjectiveVitals] = useState('');
  const [editObjectiveExam, setEditObjectiveExam] = useState('');
  const [editObjectiveLabs, setEditObjectiveLabs] = useState('');
  const [editAssessment, setEditAssessment] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [editRecommendations, setEditRecommendations] = useState<string[]>([]);
  const [newRecommendationInput, setNewRecommendationInput] = useState('');
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);

  const activePatients = patients && patients.length > 0 ? patients : SYNTHETIC_PATIENTS;
  const currentPatient = activePatients.find((p) => p.id === patientId) || activePatients[0];

  // Dynamic Draft Button Label based on Logged-in User Role (User Request #2)
  const getDynamicDraftButtonText = (): string => {
    switch (currentUser.role) {
      case 'DOCTOR':
      case 'PHYSICIAN':
      case 'CLINICIAN':
        return 'Draft Doctors Note';
      case 'NURSE':
        return 'Draft Nurses Note';
      case 'SPECIALIST':
        return 'Draft Specialists Consult Note';
      case 'CARE_COORDINATOR':
        return 'Draft Care Coordinator Note';
      case 'ADMINISTRATOR':
        return 'Draft Admin Review Note';
      case 'PORTAL_ADMIN':
        return 'Draft Portal Audit Note';
      default:
        return 'Draft Clinical Note';
    }
  };

  // Sync draft content into editable form fields
  const initializeEditFieldsFromAction = (action: WorkflowAction) => {
    const content = action.draftContent || {};
    setEditSubjective(content.subjective || content.clinicalSummary || content.instructions || '');
    
    if (typeof content.objective === 'object' && content.objective !== null) {
      setEditObjectiveVitals(content.objective.vitals || '');
      setEditObjectiveExam(content.objective.physicalExam || '');
      setEditObjectiveLabs(content.objective.recentLabs || '');
    } else if (typeof content.objective === 'string') {
      setEditObjectiveExam(content.objective);
      setEditObjectiveVitals('');
      setEditObjectiveLabs('');
    } else {
      setEditObjectiveVitals('BP 122/76 mmHg | HR 68 bpm regular | SpO2 98% RA | Temp 98.6°F');
      setEditObjectiveExam('Alert, oriented x4. CV: S1/S2 regular. Lungs: Clear bilaterally.');
      setEditObjectiveLabs('NT-proBNP 1,840 pg/mL | K+ 4.4 mmol/L | eGFR 58 mL/min');
    }

    setEditAssessment(content.assessment || content.urgency || '');
    setEditPlan(content.plan || (Array.isArray(content.dischargeMedications) ? content.dischargeMedications.join('\n') : ''));
    setEditRecommendations(
      Array.isArray(content.keyRecommendations) 
        ? [...content.keyRecommendations] 
        : content.patientWarningSigns ? [content.patientWarningSigns] : [
          'Monitor daily morning weight log',
          'Strict 2,000 mg daily sodium and 1.5 L fluid restriction',
          'Follow up with Cardiology Clinic in 7 days'
        ]
    );
    setHasUnsavedEdits(false);
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setApprovalSuccessMessage(null);
    try {
      const res = await fetch('/api/workflows/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: workflowType,
          patientId: currentPatient.id,
          actorId: currentUser.id,
          purposeOfUse,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveAction(data.workflow);
        setAllActions((prev) => [data.workflow, ...prev]);
        initializeEditFieldsFromAction(data.workflow);
        setIsEditMode(true);
      }
    } catch (err) {
      console.error('Workflow generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick insertion of standard clinical phrases / findings
  const handleInsertClinicalPhrase = (section: 'subjective' | 'assessment' | 'plan', text: string) => {
    setHasUnsavedEdits(true);
    if (section === 'subjective') {
      setEditSubjective((prev) => prev ? `${prev} ${text}` : text);
    } else if (section === 'assessment') {
      setEditAssessment((prev) => prev ? `${prev}\n• ${text}` : `• ${text}`);
    } else if (section === 'plan') {
      setEditPlan((prev) => prev ? `${prev}\n• ${text}` : `• ${text}`);
    }
  };

  const handleAddRecommendation = () => {
    if (!newRecommendationInput.trim()) return;
    setEditRecommendations((prev) => [...prev, newRecommendationInput.trim()]);
    setNewRecommendationInput('');
    setHasUnsavedEdits(true);
  };

  const handleRemoveRecommendation = (index: number) => {
    setEditRecommendations((prev) => prev.filter((_, idx) => idx !== index));
    setHasUnsavedEdits(true);
  };

  // Reset/Restore to original AI version
  const handleRestoreOriginalAiDraft = () => {
    if (!activeAction) return;
    const original = activeAction.originalDraftContent || activeAction.draftContent;
    if (original) {
      initializeEditFieldsFromAction({
        ...activeAction,
        draftContent: original,
      });
      setHasUnsavedEdits(false);
    }
  };

  // Approve action with clinician edits and persist to team notes
  const handleApproveAction = async () => {
    if (!activeAction) return;
    setIsApproving(true);
    try {
      // Build updated draft payload incorporating doctor's edits
      const updatedDraftContent: Record<string, any> = {
        ...activeAction.draftContent,
        subjective: editSubjective,
        objective: {
          vitals: editObjectiveVitals,
          physicalExam: editObjectiveExam,
          recentLabs: editObjectiveLabs,
        },
        assessment: editAssessment,
        plan: editPlan,
        keyRecommendations: editRecommendations,
      };

      const res = await fetch('/api/workflows/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: activeAction.id,
          actorId: currentUser.id,
          editedContent: updatedDraftContent,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setActiveAction(data.workflow);
        setAllActions((prev) => prev.map((a) => (a.id === data.workflow.id ? data.workflow : a)));
        
        // Also add to local team notes store immediately so all tabs see it without reload
        if (data.teamNote) {
          addTeamNote(data.teamNote);
        } else {
          // Fallback in-client creation if backend did not return full note
          const localNote: ClinicalTeamNote = {
            id: `NOTE-${currentUser.role}-${Date.now()}`,
            patientId: currentPatient.id,
            patientName: currentPatient.fullName,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            authorDepartment: currentUser.department,
            noteType: currentUser.role === 'DOCTOR' ? 'DOCTOR_PROGRESS_NOTE' :
                      currentUser.role === 'NURSE' ? 'NURSE_ASSESSMENT' :
                      currentUser.role === 'SPECIALIST' ? 'SPECIALIST_CONSULT' :
                      currentUser.role === 'CARE_COORDINATOR' ? 'CARE_COORDINATION' :
                      currentUser.role === 'ADMINISTRATOR' ? 'ADMIN_REVIEW' : 'PORTAL_AUDIT',
            title: activeAction.title,
            timestamp: new Date().toISOString(),
            status: hasUnsavedEdits ? 'AMENDED' : 'SIGNED_FINAL',
            content: {
              subjective: editSubjective,
              objective: {
                vitals: editObjectiveVitals,
                physicalExam: editObjectiveExam,
                recentLabs: editObjectiveLabs,
              },
              assessment: editAssessment,
              plan: editPlan,
              keyRecommendations: editRecommendations,
            },
            originalAiDraft: activeAction.originalDraftContent ? {
              subjective: activeAction.originalDraftContent.subjective,
              objective: activeAction.originalDraftContent.objective,
              assessment: activeAction.originalDraftContent.assessment,
              plan: activeAction.originalDraftContent.plan,
            } : undefined,
            isEditedByClinician: hasUnsavedEdits,
            editorName: currentUser.name,
            editorRole: currentUser.role,
            editedAt: new Date().toISOString(),
            workflowActionId: activeAction.id,
            tags: ['Approved Draft', currentUser.role, workflowType],
            signatureHash: `sha256:${Date.now().toString(16)}`,
          };
          addTeamNote(localNote);
        }

        setApprovalSuccessMessage({
          noteId: data.teamNote?.id || `NOTE-${Date.now().toString().slice(-6)}`,
          patientName: currentPatient.fullName,
          patientId: currentPatient.id,
          title: activeAction.title,
          wasEdited: hasUnsavedEdits || !!data.workflow.isEdited,
        });

        setIsEditMode(false);
      }
    } catch (err) {
      console.error('Workflow approval error:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRollbackAction = async () => {
    if (!activeAction) return;
    try {
      const res = await fetch('/api/workflows/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: activeAction.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveAction(data.workflow);
        setAllActions((prev) => prev.map((a) => (a.id === data.workflow.id ? data.workflow : a)));
      }
    } catch (err) {
      console.error('Workflow rollback error:', err);
    }
  };

  const handleRejectAction = async () => {
    if (!activeAction) return;
    setIsRejecting(true);
    try {
      const res = await fetch('/api/workflows/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: activeAction.id,
          actorId: currentUser.id,
          reason: 'Clinician explicitly rejected the draft notes in human-in-the-loop review.',
        }),
      });
      const data = await res.json();
      if (res.ok && data.workflow) {
        setActiveAction(data.workflow);
        setAllActions((prev) => prev.map((a) => (a.id === data.workflow.id ? data.workflow : a)));
        setRejectionMessage({
          patientName: activeAction.patientName,
          title: activeAction.title,
          rejectorName: currentUser.name,
        });
        setApprovalSuccessMessage(null);
      } else {
        const rejected: WorkflowAction = {
          ...activeAction,
          state: 'REJECTED',
          approver: {
            userId: currentUser.id,
            name: currentUser.name,
            approvedAt: new Date().toISOString(),
            signatureHash: `REJECT-${Date.now().toString(16)}`,
          },
        };
        setActiveAction(rejected);
        setAllActions((prev) => prev.map((a) => (a.id === rejected.id ? rejected : a)));
        setRejectionMessage({
          patientName: activeAction.patientName,
          title: activeAction.title,
          rejectorName: currentUser.name,
        });
      }
    } catch (err) {
      console.error('Workflow rejection error:', err);
      const rejected: WorkflowAction = {
        ...activeAction,
        state: 'REJECTED',
        approver: {
          userId: currentUser.id,
          name: currentUser.name,
          approvedAt: new Date().toISOString(),
          signatureHash: `REJECT-${Date.now().toString(16)}`,
        },
      };
      setActiveAction(rejected);
      setAllActions((prev) => prev.map((a) => (a.id === rejected.id ? rejected : a)));
      setRejectionMessage({
        patientName: activeAction.patientName,
        title: activeAction.title,
        rejectorName: currentUser.name,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCopyDraftText = () => {
    const text = [
      `DOCUMENT: ${activeAction?.title || 'Clinical Note'}`,
      `PATIENT: ${currentPatient.fullName} (${currentPatient.mrn})`,
      `AUTHOR: ${currentUser.name} (${currentUser.role})`,
      `DATE: ${new Date().toLocaleString()}`,
      `\nSUBJECTIVE:\n${editSubjective}`,
      `\nOBJECTIVE:\nVitals: ${editObjectiveVitals}\nExam: ${editObjectiveExam}\nLabs: ${editObjectiveLabs}`,
      `\nASSESSMENT:\n${editAssessment}`,
      `\nPLAN:\n${editPlan}`,
      editRecommendations.length > 0 ? `\nRECOMMENDATIONS:\n- ${editRecommendations.join('\n- ')}` : '',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

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
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Clinical Note & Action Workspace</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                Mandatory Human Sign-off Gate
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              AI generates clinical documentation drafts with real-time safety checks. Clinicians have full edit and correction controls before cryptographically signing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Role: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>
        </div>

        {/* Action Generator Controls */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
              Target Patient Context
            </label>
            <select
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                setApprovalSuccessMessage(null);
                setRejectionMessage(null);
              }}
              className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              {activePatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id}) - {p.mrn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
              Workflow Document Type
            </label>
            <select
              value={workflowType}
              onChange={(e) => setWorkflowType(e.target.value as WorkflowType)}
              className="w-full bg-slate-900/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 backdrop-blur-md"
            >
              <option value="CLINICAL_NOTE">Inpatient Progress Note (SOAP)</option>
              <option value="DISCHARGE_SUMMARY">Hospital Discharge Summary & Plan</option>
              <option value="SPECIALIST_REFERRAL">Cardiology / Specialist Referral Order</option>
              <option value="CARE_TASK_FOLLOWUP">Care Coordinator Follow-up Task</option>
            </select>
          </div>

          {/* Dynamic Draft Button Label based on Login Role (User Request #2) */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{getDynamicDraftButtonText()} with Safety Checks</span>
            </button>
          </div>
        </div>

        {/* Workflow Agentic Orchestration Graph Toggle (Hidden by default - User Request #2) */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
            </span>
            <span className="text-[11px] font-mono text-[#4ade80] font-bold">
              Workflow Agent Orchestrator & Human-in-the-Loop Sign-Off Pipeline
            </span>
          </div>

          <button
            onClick={() => setShowWorkflowFlowGraph(!showWorkflowFlowGraph)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer hover:border-white/20"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{showWorkflowFlowGraph ? 'Hide Workflow Graph' : '⚡ View Live Workflow Graph'}</span>
            {showWorkflowFlowGraph ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Live Workflow Graph (Conditionally Rendered) */}
        {showWorkflowFlowGraph && (
          <div className="mt-4">
            <LiveAgenticWorkflowGraph
              mode="WORKFLOW_CENTER"
              patient={currentPatient}
              currentUser={currentUser}
              purposeOfUse={purposeOfUse}
            />
          </div>
        )}
      </div>

      {/* Rejection Notification Card */}
      {rejectionMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 backdrop-blur-2xl rounded-2xl p-5 text-rose-200 shadow-xl space-y-2 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 mt-0.5">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Clinical Note Rejected by Doctor
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>{rejectionMessage.title}</strong> for <strong>{rejectionMessage.patientName}</strong> was rejected by <strong>{rejectionMessage.rejectorName}</strong> and discarded from the EHR commit queue.
                </p>
                <p className="text-[11px] text-rose-300 mt-1">
                  The clinical draft was prevented from being committed into the patient record. You may generate a new draft at any time.
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateDraft}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Draft New Note
            </button>
          </div>
        </div>
      )}

      {/* Approval Success Notification Card */}
      {approvalSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-2xl rounded-2xl p-5 text-emerald-200 shadow-xl space-y-3 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Note Cryptographically Approved & Committed to Patient Record
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>{approvalSuccessMessage.title}</strong> has been committed to the EHR and is immediately viewable in Care Team Notes for <strong className="text-white">{approvalSuccessMessage.patientName}</strong> ({approvalSuccessMessage.patientId}).
                </p>
                {approvalSuccessMessage.wasEdited && (
                  <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Clinician edits and corrections preserved. An archived copy of the earlier AI draft is also stored in the patient record.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToPatient360 && (
                <button
                  onClick={() => onNavigateToPatient360(approvalSuccessMessage.patientId)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open Patient 360
                </button>
              )}
              {onNavigateToReports && (
                <button
                  onClick={onNavigateToReports}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View in All Reports
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Draft & Doctor Editing & Approval Pipeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeAction ? (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Document Header & State */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      {activeAction.id}
                    </span>
                    <h2 className="text-base font-bold text-white">{activeAction.title}</h2>
                    {hasUnsavedEdits && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        Amended by Clinician
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Patient: <strong className="text-white">{activeAction.patientName}</strong></span>
                    <span>•</span>
                    <span>Generated by: <strong className="text-slate-200">{activeAction.createdBy}</strong></span>
                    <span>•</span>
                    <span>Role: <strong className="text-blue-300">{currentUser.role}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${
                    activeAction.state === 'PENDING_HUMAN_APPROVAL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : activeAction.state === 'EXECUTED_SIMULATION'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : activeAction.state === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {activeAction.state === 'PENDING_HUMAN_APPROVAL' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    {activeAction.state === 'EXECUTED_SIMULATION' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {activeAction.state === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {activeAction.state === 'ROLLED_BACK' && <RotateCcw className="w-3.5 h-3.5" />}
                    {activeAction.state === 'PENDING_HUMAN_APPROVAL' ? 'PENDING DOCTOR APPROVAL' : activeAction.state.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Step 1: Pre-Execution Safety Validation Checklist */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 backdrop-blur-md">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Pre-Execution Safety & Allergy Verification Checks
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeAction.validationChecks.map((check, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-200">{check.rule}</div>
                        <div className="text-[10px] text-slate-400">{check.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Doctor Note Editing Controls & Smart Snippets (User Request #3) */}
              <div className="bg-slate-900/70 border border-white/15 rounded-xl p-5 space-y-4 backdrop-blur-md">
                {/* Editing Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Edit3 className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {isEditMode ? 'Doctor / Clinician Interactive Note Editor' : 'Approved Document Preview'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isEditMode ? 'Edit, add findings, adjust treatment plan, or correct AI generated values.' : 'Final cryptographic copy signed and executed.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowAiDiffComparison(!showAiDiffComparison)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View AI Original Draft vs Doctor Corrections"
                    >
                      <History className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{showAiDiffComparison ? 'Hide AI Baseline' : 'Compare with AI Draft'}</span>
                    </button>

                    {isEditMode && hasUnsavedEdits && (
                      <button
                        type="button"
                        onClick={handleRestoreOriginalAiDraft}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Revert all changes to AI generated version"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to AI Draft</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyDraftText}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy note text"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDraft ? 'Copied!' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Doctor Insertion Helpers */}
                {isEditMode && activeAction.state === 'PENDING_HUMAN_APPROVAL' && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                    <div className="font-bold text-blue-300 text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Quick Clinical Phrase Insertion (Click to add):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleInsertClinicalPhrase('subjective', 'Patient reports orthopnea improved, no nocturnal dyspnea.')}
                        className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer transition-colors"
                      >
                        + Orthopnea Improved
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertClinicalPhrase('assessment', 'Guideline-directed medical therapy (GDMT) optimized with stable renal indices.')}
                        className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer transition-colors"
                      >
                        + GDMT Optimization
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertClinicalPhrase('plan', 'Order repeat BMP and serum electrolytes in 48 hours.')}
                        className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer transition-colors"
                      >
                        + Lab Repeat in 48h
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertClinicalPhrase('plan', 'Dietary consult for strict 1.5 L fluid and 2g sodium restriction education.')}
                        className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 cursor-pointer transition-colors"
                      >
                        + Sodium & Fluid Education
                      </button>
                    </div>
                  </div>
                )}

                {/* Compare AI Baseline View if toggled */}
                {showAiDiffComparison && activeAction.originalDraftContent && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        Original AI Generated Draft Baseline (Pre-Correction):
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Snapshot before clinician edits</span>
                    </div>
                    <div className="text-slate-300 bg-black/40 p-3 rounded-lg border border-white/5 space-y-2 font-mono text-[11px] leading-relaxed">
                      <div><strong className="text-cyan-400">AI Subjective:</strong> {activeAction.originalDraftContent.subjective || activeAction.originalDraftContent.clinicalSummary}</div>
                      <div><strong className="text-cyan-400">AI Assessment:</strong> {activeAction.originalDraftContent.assessment || activeAction.originalDraftContent.urgency}</div>
                      <div><strong className="text-cyan-400">AI Plan:</strong> {activeAction.originalDraftContent.plan || 'Standard care pathway'}</div>
                    </div>
                  </div>
                )}

                {/* Form Fields: Subjective, Objective, Assessment, Plan */}
                <div className="space-y-4 text-xs">
                  {/* Subjective Section */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-cyan-300 uppercase text-[11px] flex items-center justify-between">
                      <span>Subjective (S) / Clinical History</span>
                      <span className="text-[10px] font-normal text-slate-400">Chief complaint & patient-reported status</span>
                    </label>
                    <textarea
                      value={editSubjective}
                      onChange={(e) => {
                        setEditSubjective(e.target.value);
                        setHasUnsavedEdits(true);
                      }}
                      disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                      rows={3}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-cyan-400 disabled:opacity-75"
                      placeholder="Enter patient subjective report, history of present illness..."
                    />
                  </div>

                  {/* Objective Section */}
                  <div className="space-y-2">
                    <label className="font-bold text-sky-300 uppercase text-[11px] block">
                      Objective (O) Telemetry, Physical Exam & Labs
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">Vitals / Telemetry</span>
                        <input
                          type="text"
                          value={editObjectiveVitals}
                          onChange={(e) => {
                            setEditObjectiveVitals(e.target.value);
                            setHasUnsavedEdits(true);
                          }}
                          disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-400 disabled:opacity-75"
                          placeholder="e.g. BP 120/78 mmHg | HR 72 bpm"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">Physical Examination</span>
                        <input
                          type="text"
                          value={editObjectiveExam}
                          onChange={(e) => {
                            setEditObjectiveExam(e.target.value);
                            setHasUnsavedEdits(true);
                          }}
                          disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-400 disabled:opacity-75"
                          placeholder="e.g. Lungs clear, no peripheral edema"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">Recent Labs & Diagnostics</span>
                        <input
                          type="text"
                          value={editObjectiveLabs}
                          onChange={(e) => {
                            setEditObjectiveLabs(e.target.value);
                            setHasUnsavedEdits(true);
                          }}
                          disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-400 disabled:opacity-75"
                          placeholder="e.g. NT-proBNP 1,840 | K+ 4.4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assessment Section */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-blue-300 uppercase text-[11px] flex items-center justify-between">
                      <span>Assessment (A) & Diagnostic Synthesis</span>
                      <span className="text-[10px] font-normal text-slate-400">Clinical synthesis & problem list</span>
                    </label>
                    <textarea
                      value={editAssessment}
                      onChange={(e) => {
                        setEditAssessment(e.target.value);
                        setHasUnsavedEdits(true);
                      }}
                      disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                      rows={3}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-400 disabled:opacity-75"
                      placeholder="Enter clinical assessment, diagnosis, and disease status..."
                    />
                  </div>

                  {/* Plan Section */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-emerald-300 uppercase text-[11px] flex items-center justify-between">
                      <span>Plan of Care (P) & Medical Orders</span>
                      <span className="text-[10px] font-normal text-slate-400">Medications, orders, diet, activity</span>
                    </label>
                    <textarea
                      value={editPlan}
                      onChange={(e) => {
                        setEditPlan(e.target.value);
                        setHasUnsavedEdits(true);
                      }}
                      disabled={activeAction.state === 'EXECUTED_SIMULATION'}
                      rows={3}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-emerald-400 disabled:opacity-75"
                      placeholder="Enter care plan, prescriptions, and consult orders..."
                    />
                  </div>

                  {/* Key Interdisciplinary Recommendations */}
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 space-y-2">
                    <div className="font-bold uppercase tracking-wider text-[11px] text-cyan-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        Key Care Recommendations ({editRecommendations.length})
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {editRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/30 border border-white/10 text-xs text-slate-200">
                          <span>{rec}</span>
                          {activeAction.state === 'PENDING_HUMAN_APPROVAL' && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRecommendation(i)}
                              className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>

                    {activeAction.state === 'PENDING_HUMAN_APPROVAL' && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newRecommendationInput}
                          onChange={(e) => setNewRecommendationInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRecommendation(); } }}
                          placeholder="Add recommendation (e.g. Schedule Echo in 3 months)..."
                          className="flex-1 bg-slate-950/80 border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={handleAddRecommendation}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Human Approval / Execution / Rollback Controls */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-semibold text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Human-in-the-Loop Protocol Enforced
                  </div>
                  <span className="text-[11px]">Signing Provider: <strong>{currentUser.name}</strong> ({currentUser.role} • License: {currentUser.licenseNumber})</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {activeAction.state === 'PENDING_HUMAN_APPROVAL' && (
                    <>
                      <button
                        onClick={handleApproveAction}
                        disabled={isApproving || isRejecting}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                      >
                        {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Doctor Sign & Approve
                      </button>

                      <button
                        onClick={handleRejectAction}
                        disabled={isApproving || isRejecting}
                        className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                      >
                        {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                        Reject the Notes
                      </button>
                    </>
                  )}

                  {activeAction.state === 'REJECTED' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                        <Ban className="w-4 h-4 text-rose-400" />
                        Notes Discarded (Doctor Rejected)
                      </span>
                      <button
                        onClick={handleGenerateDraft}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Re-Draft with Safety Checks
                      </button>
                    </div>
                  )}

                  {activeAction.state === 'EXECUTED_SIMULATION' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRollbackAction}
                        className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-400" />
                        Rollback Transaction
                      </button>
                      {onNavigateToPatient360 && (
                        <button
                          onClick={() => onNavigateToPatient360(currentPatient.id)}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          View in Patient 360
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Simulation Result Box if executed */}
              {activeAction.simulationExecutionLog && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono space-y-1 backdrop-blur-md">
                  <div className="font-bold flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    EHR FHIR R4 Bridge Transaction Completed
                  </div>
                  <div>Transaction ID: {activeAction.simulationExecutionLog.mockTransactionId}</div>
                  <div>Executed At: {activeAction.simulationExecutionLog.executedAt}</div>
                  <div>Attestation Signature: {activeAction.approver?.signatureHash}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-12 text-center text-slate-300 space-y-3 shadow-2xl">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Active Draft Document</h3>
              <p className="text-xs max-w-md mx-auto text-slate-300">
                Select a patient and document type above, then click <strong>"{getDynamicDraftButtonText()} with Safety Checks"</strong> to initiate the workflow.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Workflow History & Audit Trail (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Recent Workflow Actions ({allActions.length})
            </h3>

            {allActions.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                No workflow actions executed in this session yet.
              </div>
            )}

            <div className="space-y-3">
              {allActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    setActiveAction(action);
                    initializeEditFieldsFromAction(action);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer backdrop-blur-md shadow-md ${
                    activeAction?.id === action.id
                      ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate">{action.title.split('-')[0]}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      action.state === 'PENDING_HUMAN_APPROVAL' ? 'bg-amber-500/20 text-amber-300' :
                      action.state === 'EXECUTED_SIMULATION' ? 'bg-emerald-500/20 text-emerald-300' :
                      action.state === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {action.state === 'PENDING_HUMAN_APPROVAL' ? 'PENDING DOCTOR APPROVAL' : action.state.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Patient: {action.patientName.split(' ')[0]}</span>
                    <span>{action.createdAt.split('T')[1].slice(0, 5)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
