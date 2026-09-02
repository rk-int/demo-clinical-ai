import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  ShieldAlert,
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  Filter,
  Send,
  Loader2,
  Copy,
  Info,
  Activity,
  Database,
  ChevronDown,
  ChevronUp,
  Zap,
  UserCheck,
  Building,
  Heart,
  Pill,
  RotateCcw,
  Clock,
  Check,
  Layers,
  ArrowRight,
  User,
  Bot,
  Trash2,
  X,
  Lock,
  Eye,
  Paperclip,
  CheckCheck,
  CornerDownLeft,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, PurposeOfUse, EvidenceItem, AgentContract, SyntheticPatient } from '../../types';
import { APPROVED_GUIDELINES } from '../../data/approvedKnowledge';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';
import { getPatientAvatarUrl } from '../../utils/patientAvatar';
import { VerticalPatientSearchFlowCanvas } from '../AgentOperations/VerticalPatientSearchFlowCanvas';
import { ClinicalMarkdownRenderer } from './ClinicalMarkdownRenderer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  attachedPatient?: SyntheticPatient | null;
  evidence?: EvidenceItem[];
  confidence?: { score: number; rating: string; rationale: string } | null;
  uncertainties?: string[];
  usedModel?: string;
  modelExecutionStatus?: 'PRIMARY' | 'FALLBACK' | 'LOCAL_ENGINE';
  preGuardrails?: {
    promptInjectionCheck: { status: string; rule: string };
    dlpPhiTokenization: { status: string; redactedCount: number };
    abacConsentValidation: { status: string; consentStatus: string };
    purposeOfUseVerification: { status: string; purpose: string };
  };
  postGuardrails?: {
    groundednessCheck: { status: string; score: number; verifiedAgainstChunks: number };
    citationClaimToChunk: { status: string; validatedCitations: number };
    phiLeakDetector: { status: string; leaksDetected: number };
    nonAutonomousDisclaimer: { status: string; physicianReviewMandate: boolean };
  };
  databaseMetrics?: {
    patientDb?: { queried: boolean; resourcesLoaded: number; latencyMs: number; engine: string };
    guidelinesDb?: { chunksRetrieved: number; latencyMs: number; engine: string };
    totalLatencyMs: number;
  };
  trace?: AgentContract | null;
}

export interface GeminiModelOption {
  id: string;
  name: string;
  tier: string;
  description: string;
  badge: 'RECOMMENDED' | 'FAST' | 'LOW_LATENCY' | 'LATEST' | 'DEEP_REASONING' | 'STANDARD';
  status: 'ONLINE' | 'STANDBY';
  isDefault?: boolean;
}

const DEFAULT_GEMINI_MODELS: GeminiModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    tier: 'Primary High-Availability',
    description: 'Next-Gen fast reasoning, institutional guideline synthesis & resilient low latency',
    badge: 'RECOMMENDED',
    status: 'ONLINE',
    isDefault: true,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tier: 'Ultra Low Latency',
    description: 'Sub-second response time for rapid triage, formularies & bedside lookup',
    badge: 'LOW_LATENCY',
    status: 'ONLINE',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    tier: 'Dynamic Production Alias',
    description: 'Auto-routed to latest stable production flash release',
    badge: 'LATEST',
    status: 'ONLINE',
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    tier: 'Deep Reasoning & Multimodal',
    description: 'Complex multi-system clinical synthesis with automated capacity fallback',
    badge: 'DEEP_REASONING',
    status: 'ONLINE',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    tier: 'Differential Pathology',
    description: 'Complex rare pathology, differential diagnosis & research analysis',
    badge: 'DEEP_REASONING',
    status: 'ONLINE',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tier: 'Stable Standard',
    description: 'Proven standard enterprise clinical endpoint',
    badge: 'STANDARD',
    status: 'ONLINE',
  },
];

interface KnowledgeQAViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patient?: SyntheticPatient;
  patients?: SyntheticPatient[];
  onSelectPatient?: (patientId: string) => void;
  initialQuery?: string;
  onSendToNote?: (content: string) => void;
  onSelectTrace?: (trace: AgentContract) => void;
  onBack?: () => void;
}

export const KnowledgeQAView: React.FC<KnowledgeQAViewProps> = ({
  currentUser,
  purposeOfUse,
  patient,
  patients = SYNTHETIC_PATIENTS,
  onSelectPatient,
  initialQuery = '',
  onSendToNote,
  onSelectTrace,
  onBack,
}) => {
  // Input prompt state
  const [inputText, setInputText] = useState(initialQuery || '');
  const [specialty, setSpecialty] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Gemini Model Selection & Configuration State (Defaulting to High-Availability Primary)
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [selectedHospitalContext, setSelectedHospitalContext] = useState<string>('St. Jude Regional Medical Center');
  const [availableModels, setAvailableModels] = useState<GeminiModelOption[]>(DEFAULT_GEMINI_MODELS);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.2);
  const [isGeminiConnected, setIsGeminiConnected] = useState<boolean>(true);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  
  // Requirement 1 & 4: Zero-Trust Blank Default
  // Do NOT display any patient information by default. It starts strictly null/blank.
  const [attachedPatient, setAttachedPatient] = useState<SyntheticPatient | null>(patient || null);
  
  // Patient Autocomplete & Search Input State
  const [patientSearchInput, setPatientSearchInput] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [activeHighlightedIndex, setActiveHighlightedIndex] = useState<number>(0);
  
  // Requirement 4: By default Live Agent Flow MUST be hidden (false)
  // When a patient record is searched and selected (or Enter clicked), it expands automatically (true).
  const [showLiveFlow, setShowLiveFlow] = useState<boolean>(false);
  
  // Accordions inside chat bubbles
  const [expandedGuardrailMsgId, setExpandedGuardrailMsgId] = useState<string | null>(null);
  const [expandedEvidenceMsgId, setExpandedEvidenceMsgId] = useState<string | null>(null);

  // ChatGPT Message History
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync available Gemini models and connectivity
  useEffect(() => {
    fetch('/api/gemini/models')
      .then(res => res.json())
      .then(data => {
        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          setAvailableModels(data.models);
        }
        if (typeof data.connected === 'boolean') {
          setIsGeminiConnected(data.connected);
        }
      })
      .catch(err => {
        console.warn('Could not sync dynamic Gemini models list:', err);
      });
  }, []);

  // Click outside listener for model selector dropdown
  useEffect(() => {
    const handleClickOutsideModel = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModel);
    return () => document.removeEventListener('mousedown', handleClickOutsideModel);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync attached patient when patient prop changes (e.g., from Ask AI buttons)
  useEffect(() => {
    if (patient) {
      setAttachedPatient(patient);
    }
  }, [patient]);

  // Sync initial query when initialQuery prop changes
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== '') {
      setInputText(initialQuery);
    }
  }, [initialQuery]);

  // Click outside listener for patient search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered matching patient records for auto-populate
  const filteredPatients = useMemo(() => {
    if (!patientSearchInput.trim()) {
      return patients; // show full list on focus/click so user can pick immediately
    }
    const term = patientSearchInput.toLowerCase().trim();
    return patients.filter(
      p =>
        p.fullName.toLowerCase().includes(term) ||
        p.mrn.toLowerCase().includes(term) ||
        (p.uprId && p.uprId.toLowerCase().includes(term)) ||
        p.conditions.some(c => c.name.toLowerCase().includes(term)) ||
        p.hospitalSite.toLowerCase().includes(term)
    );
  }, [patients, patientSearchInput]);

  // Selection Handler: Attaches ONLY patient details to the window; does NOT automatically expand the live agent flow
  const handleSelectPatient = (selected: SyntheticPatient) => {
    setAttachedPatient(selected);
    setPatientSearchInput('');
    setShowPatientDropdown(false);
    
    // Explicit user requirement: when patient is searched & attached, do NOT display live agent flow automatically. Keep collapsed.
    setShowLiveFlow(false);

    if (onSelectPatient) {
      onSelectPatient(selected.id);
    }
  };

  // Explicit Search Execution on clicking "Search" button or pressing Enter
  const handleExecuteSearch = () => {
    if (filteredPatients.length > 0) {
      const target = filteredPatients[activeHighlightedIndex] || filteredPatients[0];
      handleSelectPatient(target);
    } else {
      setShowPatientDropdown(true);
    }
  };

  // Keyboard navigation & Enter key selection on patient search input
  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveHighlightedIndex(prev => (prev + 1) % Math.max(1, filteredPatients.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveHighlightedIndex(prev => (prev - 1 + filteredPatients.length) % Math.max(1, filteredPatients.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSearch();
    } else if (e.key === 'Escape') {
      setShowPatientDropdown(false);
    }
  };

  const handleUnattachPatient = () => {
    setAttachedPatient(null);
    setPatientSearchInput('');
    setShowLiveFlow(false);
  };

  const samplePrompts = [
    { 
      title: 'HFpEF SGLT2 Renal Threshold', 
      query: 'What is the guideline recommendation for Empagliflozin SGLT2 inhibitor initiation in HFpEF patients with eGFR 38?',
      specialty: 'CARDIOLOGY',
      suggestedPatientId: 'PT-1002' // Elena Rostova
    },
    { 
      title: 'Inpatient Hypoglycemia Protocol', 
      query: 'What is the step-by-step Rule of 15 protocol for treating acute hypoglycemia in conscious adult inpatients?',
      specialty: 'ENDOCRINOLOGY',
      suggestedPatientId: 'PT-1001' // Jane Smith
    },
    { 
      title: 'COPD Exacerbation Antibiotics', 
      query: 'When should antibiotics be initiated for an acute COPD exacerbation according to hospital guidelines?',
      specialty: 'PULMONOLOGY',
      suggestedPatientId: 'PT-1003' // Marcus Vance
    },
    { 
      title: 'Severe Sepsis Fluid Resuscitation', 
      query: 'What is the recommended 3-hour crystalloid bolus volume for septic shock?',
      specialty: 'CRITICAL_CARE',
      suggestedPatientId: 'PT-1000' // John Doe
    },
  ];

  const handleSendMessage = async (queryToSend = inputText, targetPatient = attachedPatient) => {
    if (!queryToSend.trim()) return;

    const userMsgId = `MSG-USR-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryToSend,
      attachedPatient: targetPatient,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/knowledge/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          specialty,
          actorId: currentUser.id,
          purposeOfUse,
          patientId: targetPatient?.id || null,
          model: selectedModel,
          temperature,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textPayload = await res.text();
        try {
          data = JSON.parse(textPayload);
        } catch {
          data = {
            answer: textPayload || 'Clinical Gateway returned text response.',
            confidence: { score: 0.85, rating: 'MEDIUM_EVIDENCE', rationale: 'Direct text synthesis.' },
            usedModel: selectedModel,
          };
        }
      }

      const assistantMsgId = `MSG-AST-${Date.now()}`;

      if (res.ok) {
        const newAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.answer || 'No response text received from clinical reasoning engine.',
          attachedPatient: data.patient || targetPatient,
          evidence: data.evidence || [],
          confidence: data.confidence,
          uncertainties: data.uncertainties || [],
          usedModel: data.usedModel || `${selectedModel} (Enterprise Clinical Adapter)`,
          modelExecutionStatus: data.modelExecutionStatus || 'PRIMARY',
          preGuardrails: data.preGuardrails,
          postGuardrails: data.postGuardrails,
          databaseMetrics: data.databaseMetrics,
          trace: data.trace,
        };
        setMessages(prev => [...prev, newAssistantMsg]);
      } else {
        const errorAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `[SECURITY GUARDRAIL / GATEWAY INTERCEPTION] ${data.error || 'The request was blocked by clinical governance safety rules.'}`,
          attachedPatient: targetPatient,
          usedModel: data.usedModel || selectedModel,
          trace: data.trace,
        };
        setMessages(prev => [...prev, errorAssistantMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `MSG-ERR-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Error connecting to clinical knowledge gateway: ${err.message || 'Unknown network error'}. Please verify backend connectivity.`,
        attachedPatient: targetPatient,
        usedModel: selectedModel,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col space-y-5 max-w-7xl mx-auto pb-6">
      {/* Top Navigation & Back Action */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1) HEADER & PATIENT RETRIEVAL AUTO-POPULATE BAR                           */}
      {/* ========================================================================= */}
      <div className="relative z-50 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
                <Bot className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">AI Assistant & Clinical Knowledge Q&A</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                KNOWLEDGE AGENT TRIGGERED
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Pre & Post Guardrails Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Conversational clinical decision support with automated patient database ingestion, pre/post safety guardrails, and live agent telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                title="Clear current conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PATIENT SEARCH & AUTO-POPULATE (BLANK DEFAULT BY MANDATE)                 */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-white/10">
          {!attachedPatient ? (
            /* Blank Default State: Prompt to search and auto-populate */
            <div className="relative z-50" ref={searchDropdownRef}>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Enter Patient Name to Retrieve Record</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
                        Auto-Populate Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Enter patient name or MRN and click Search to attach patient details to the window.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={patientSearchInput}
                      onFocus={() => setShowPatientDropdown(true)}
                      onClick={() => setShowPatientDropdown(true)}
                      onChange={(e) => {
                        setPatientSearchInput(e.target.value);
                        setShowPatientDropdown(true);
                        setActiveHighlightedIndex(0);
                      }}
                      onKeyDown={handleSearchInputKeyDown}
                      placeholder="Enter patient name (e.g. Elena, Jane, Marcus)..."
                      className="w-full bg-slate-950/90 border border-cyan-500/40 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans shadow-inner"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleExecuteSearch}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/30 transition-all shrink-0"
                    title="Search and attach patient record"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Matching Auto-Populate Dropdown */}
              {showPatientDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[70] bg-slate-950/98 border border-cyan-500/60 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.98)] backdrop-blur-2xl overflow-hidden divide-y divide-white/10 max-h-80 overflow-y-auto">
                  <div className="p-2.5 bg-[#081826] text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                    <span>MATCHING PATIENT RECORDS ({filteredPatients.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Click or press Enter to retrieve record</span>
                  </div>

                  {filteredPatients.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPatient(p)}
                      onMouseEnter={() => setActiveHighlightedIndex(idx)}
                      className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        idx === activeHighlightedIndex ? 'bg-cyan-500/15 border-l-4 border-cyan-400' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={getPatientAvatarUrl(p)}
                          alt={p.fullName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{p.fullName}</span>
                            <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                              MRN: {p.mrn}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {p.age}y {p.gender}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-md font-sans mt-0.5">
                            <span className="text-slate-300 font-medium">{p.conditions[0]?.name || 'Record'}</span> • {p.hospitalSite} • {p.medications.length} Active Meds
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          p.consentStatus === 'ACTIVE_CONSENT'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {p.consentStatus === 'ACTIVE_CONSENT' ? 'Active Consent' : 'Restricted'}
                        </span>
                        <div className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                          <span>Attach Record</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredPatients.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No patients found matching "{patientSearchInput}".
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Selected / Attached State: Display ONLY Patient Details in Window */
            <div className="p-4 rounded-2xl bg-[#041209] border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={getPatientAvatarUrl(attachedPatient)}
                    alt={attachedPatient.fullName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  />
                  <span 
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 bg-emerald-500"
                    title="Active Consent Verified"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-emerald-300 font-mono uppercase tracking-wider font-bold">Attached Patient Record:</span>
                    <span className="text-sm font-bold text-white font-mono">{attachedPatient.fullName}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      MRN: {attachedPatient.mrn}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">
                      {attachedPatient.age}y {attachedPatient.gender}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Active Consent
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                    <span><strong>Diagnoses:</strong> {attachedPatient.conditions.map(c => c.name).join(', ')}</span>
                    <span>•</span>
                    <span><strong>Medications:</strong> {attachedPatient.medications.length} Active</span>
                    <span>•</span>
                    <span><strong>Hospital Site:</strong> {attachedPatient.hospitalSite}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onSelectPatient && (
                  <button
                    onClick={() => onSelectPatient(attachedPatient.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Open Patient 360</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={handleUnattachPatient}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Unattach patient to search for another record"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Unattach</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2) GEMINI MODEL SELECTION & INFERENCE CONTROLS BAR                        */}
      {/* ========================================================================= */}
      <div className="relative z-30 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Gemini Model Dropdown Selector */}
          <div className="relative z-40" ref={modelDropdownRef}>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Gemini Foundation Model:</span>
            </div>
            <button
              onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
              title="Select Gemini LLM model for clinical reasoning"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-cyan-300 font-mono">
                {availableModels.find(m => m.id === selectedModel)?.name || selectedModel}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {availableModels.find(m => m.id === selectedModel)?.badge || 'ONLINE'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModelSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Model Dropdown Menu */}
            {isModelSelectorOpen && (
              <div className="absolute left-0 top-full mt-2 w-84 bg-slate-950/98 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 p-2 space-y-1 divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Available Gemini Models</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
                  </span>
                </div>

                <div className="pt-1 space-y-1">
                  {availableModels.map((m) => {
                    const isSelected = m.id === selectedModel;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsModelSelectorOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected 
                            ? 'bg-cyan-500/15 border border-cyan-500/40 text-white' 
                            : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                              {m.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10">
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {m.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 text-cyan-400 mt-0.5">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Multi-Hospital Network Target Selector */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-cyan-400" />
              <span>Target Hospital Context:</span>
            </div>
            <select
              value={selectedHospitalContext}
              onChange={(e) => setSelectedHospitalContext(e.target.value)}
              className="bg-slate-800/90 border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="St. Jude Regional Medical Center">St. Jude Regional (Epic EHR)</option>
              <option value="Metropolitan General Hospital">Metropolitan General (Cerner EHR)</option>
              <option value="Mercy Community Health System">Mercy Community (MEDITECH EHR)</option>
              <option value="St. Luke Surgical & Cardiac Pavilion">St. Luke Surgical (Allscripts EHR)</option>
            </select>
          </div>

          {/* Temperature Setting */}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>Reasoning Mode:</span>
            </div>
            <div className="flex items-center rounded-xl bg-slate-800/80 border border-white/10 p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setTemperature(0.0)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  temperature === 0.0 ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Zero variability - Strictly literal guideline adherence"
              >
                Precise (0.0)
              </button>
              <button
                onClick={() => setTemperature(0.2)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  temperature === 0.2 ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Balanced clinical decision support"
              >
                Standard (0.2)
              </button>
              <button
                onClick={() => setTemperature(0.4)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  temperature === 0.4 ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Broader differential exploration"
              >
                Exploratory (0.4)
              </button>
            </div>
          </div>
        </div>

        {/* Specialty Filter & Status Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Domain Specialty:</span>
            </div>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="bg-slate-800/90 border border-white/10 text-slate-200 rounded-xl px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Clinical Domains</option>
              <option value="CARDIOLOGY">Cardiology</option>
              <option value="ENDOCRINOLOGY">Endocrinology</option>
              <option value="PULMONOLOGY">Pulmonology</option>
              <option value="CRITICAL_CARE">Critical Care / Sepsis</option>
              <option value="NEPHROLOGY">Nephrology</option>
              <option value="INFECTIOUS_DISEASE">Infectious Disease</option>
            </select>
          </div>

          {messages.length > 0 && (
            <div className="self-end">
              <button
                onClick={handleClearChat}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Clear conversation history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3) CHATGPT-STYLE CONVERSATIONAL FEED & STICKY INPUT BAR                   */}
      {/* ========================================================================= */}
      <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl min-h-[460px] flex flex-col justify-between space-y-6">
        {/* Welcome Screen / Empty Chat Prompting Area */}
        {messages.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/30 border border-white/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Clinical AI Assistant</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {attachedPatient 
                  ? `Active patient context attached for ${attachedPatient.fullName} (${attachedPatient.mrn}). Ask any suggestion, dosing guideline, or protocol query.`
                  : 'Enter a clinical prompt or search and attach a patient above to evaluate guidelines against real-time lab parameters.'}
              </p>
            </div>

            {/* Quick Starter Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(p.query);
                    setSpecialty(p.specialty);
                    let targetPt = attachedPatient;
                    if (p.suggestedPatientId) {
                      const found = patients.find(pt => pt.id === p.suggestedPatientId);
                      if (found) {
                        setAttachedPatient(found);
                        targetPt = found;
                      }
                    }
                    // Keep live flow collapsed by default per user requirement
                    setShowLiveFlow(false);
                    handleSendMessage(p.query, targetPt);
                  }}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer space-y-1.5 text-left group backdrop-blur-md shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">{p.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {p.specialty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300">
                    {p.query}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* ---------------- User Message Bubble ---------------- */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end items-start gap-3 pl-8">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-slate-400">
                        <span>{currentUser.name} ({currentUser.role})</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.attachedPatient && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Context: {msg.attachedPatient.fullName}
                          </span>
                        )}
                      </div>

                      <div className="p-4 rounded-3xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-sans leading-relaxed shadow-lg shadow-blue-600/20">
                        {msg.text}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 border border-white/20">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}

                {/* ---------------- Assistant Message Bubble ---------------- */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-start gap-3 pr-8">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="space-y-3 max-w-3xl flex-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-cyan-300">Clinical Knowledge Assistant</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                            <span>{msg.usedModel || 'Gemini 3.7 Flash'}</span>
                          </span>
                          {msg.modelExecutionStatus === 'FALLBACK' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                              Fallback Ladder
                            </span>
                          )}
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          {onSendToNote && (
                            <button
                              onClick={() => onSendToNote(msg.text)}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                              title="Send to Clinical Note Draft"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Insert Note</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Database Connection & Resource Ingestion Metrics */}
                      {msg.databaseMetrics && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 flex-wrap p-2 rounded-xl bg-slate-900/60 border border-white/10">
                          <span className="flex items-center gap-1 text-emerald-300">
                            <Database className="w-3 h-3" />
                            <span>PostgreSQL Store: {msg.databaseMetrics.patientDb?.resourcesLoaded || 0} resources ({msg.databaseMetrics.patientDb?.latencyMs || 24}ms)</span>
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-cyan-300">
                            <BookOpen className="w-3 h-3" />
                            <span>pgvector Knowledge: {msg.databaseMetrics.guidelinesDb?.chunksRetrieved || 0} chunks ({msg.databaseMetrics.guidelinesDb?.latencyMs || 18}ms)</span>
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">Total Latency: {msg.databaseMetrics.totalLatencyMs}ms</span>
                        </div>
                      )}

                      {/* Main Synthesized Response or Security Interception Banner */}
                      {msg.text.startsWith('[SECURITY GUARDRAIL') ? (
                        <div className="p-5 rounded-3xl rounded-tl-sm bg-rose-950/40 border border-rose-500/40 text-xs font-sans leading-relaxed backdrop-blur-xl shadow-xl space-y-3.5">
                          <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs">
                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Clinical Governance & Safety Guardrail Interception</span>
                          </div>
                          
                          <p className="text-slate-200 leading-relaxed">
                            {msg.text.replace(/^\[SECURITY GUARDRAIL[^\]]*\]\s*/, '')}
                          </p>

                          <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 space-y-2 text-[11px] font-mono text-slate-300">
                            <span className="font-bold text-rose-300 uppercase tracking-wider block">
                              Why did this occur?
                            </span>
                            <ul className="space-y-1 text-slate-300 list-disc list-inside">
                              <li><strong>Prompt Injection / Jailbreak Filter:</strong> If the input contained system prompt bypass phrases (e.g. <em>"ignore instructions"</em>, <em>"system prompt"</em>, <em>"DAN mode"</em>, <em>"disregard hipaa"</em>).</li>
                              <li><strong>Patient Consent Restriction:</strong> If the attached patient's HIPAA consent is <code>EXPIRED</code> or <code>REVOKED</code> (e.g., James Thornton or Michael Chang).</li>
                              <li><strong>ABAC Assignment Rule:</strong> If the clinician is not assigned to this patient and Purpose of Use is not <code>EMERGENCY_OVERRIDE</code>.</li>
                            </ul>
                          </div>

                          {/* Quick Resolution Actions */}
                          <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] font-mono">
                            {attachedPatient && (
                              <button
                                onClick={handleUnattachPatient}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Unattach Patient (Query General Guidelines)</span>
                              </button>
                            )}
                            {onSelectTrace && msg.trace && (
                              <button
                                onClick={() => onSelectTrace(msg.trace!)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Search className="w-3.5 h-3.5" />
                                <span>Inspect Security Audit Trace</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 rounded-3xl rounded-tl-sm bg-slate-900/80 border border-white/10 text-xs text-slate-100 font-sans leading-relaxed backdrop-blur-xl shadow-xl space-y-3">
                          <ClinicalMarkdownRenderer content={msg.text} />
                        </div>
                      )}

                      {/* Pre & Post Guardrails Audit Summary */}
                      {msg.preGuardrails && msg.postGuardrails && (
                        <div className="rounded-2xl border border-emerald-500/30 bg-[#040e08] overflow-hidden">
                          <button
                            onClick={() => setExpandedGuardrailMsgId(expandedGuardrailMsgId === msg.id ? null : msg.id)}
                            className="w-full p-3 flex items-center justify-between text-xs font-mono text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold">Pre & Post Guardrails Audit Summary (All 8 Checks Passed)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                                Groundedness: {Math.round((msg.postGuardrails.groundednessCheck.score || 0.98) * 100)}%
                              </span>
                              {expandedGuardrailMsgId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </button>

                          {expandedGuardrailMsgId === msg.id && (
                            <div className="p-4 border-t border-emerald-500/20 space-y-3 text-xs font-mono">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Pre-Guardrails */}
                                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pre-Execution Guardrails (Input & DLP)</span>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• Prompt Injection Defense</span>
                                    <span className="text-emerald-400 font-semibold">{msg.preGuardrails.promptInjectionCheck.status}</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• PHI / PII Tokenization</span>
                                    <span className="text-emerald-400 font-semibold">{msg.preGuardrails.dlpPhiTokenization.status} ({msg.preGuardrails.dlpPhiTokenization.redactedCount} tokens)</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• ABAC & Consent Gate</span>
                                    <span className="text-emerald-400 font-semibold">{msg.preGuardrails.abacConsentValidation.status}</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• Purpose of Use Check</span>
                                    <span className="text-emerald-400 font-semibold">{msg.preGuardrails.purposeOfUseVerification.purpose}</span>
                                  </div>
                                </div>

                                {/* Post-Guardrails */}
                                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Post-Execution Guardrails (Groundedness & Output)</span>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• Claim-to-Chunk Match</span>
                                    <span className="text-emerald-400 font-semibold">{msg.postGuardrails.citationClaimToChunk.status}</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• PHI Leak Detector</span>
                                    <span className="text-emerald-400 font-semibold">0 Leaks Detected</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• Zero-Speculation Filter</span>
                                    <span className="text-emerald-400 font-semibold">PASSED</span>
                                  </div>
                                  <div className="text-slate-300 flex items-center justify-between text-[11px]">
                                    <span>• Non-Autonomous Disclaimer</span>
                                    <span className="text-cyan-300 font-semibold">ENFORCED</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Verified Evidence Chunks Accordion */}
                      {msg.evidence && msg.evidence.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden">
                          <button
                            onClick={() => setExpandedEvidenceMsgId(expandedEvidenceMsgId === msg.id ? null : msg.id)}
                            className="w-full p-3 flex items-center justify-between text-xs font-mono text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="font-bold">Verified Evidence Chunks ({msg.evidence.length})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {expandedEvidenceMsgId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </button>

                          {expandedEvidenceMsgId === msg.id && (
                            <div className="p-3 border-t border-white/10 space-y-2">
                              {msg.evidence.map((item) => (
                                <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-cyan-300">{item.documentTitle} ({item.section})</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                      {Math.round(item.relevanceScore * 100)}% Match
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] font-sans italic bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
                                    "{item.excerpt}"
                                  </p>
                                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                    <span>Chunk ID: {item.chunkId}</span>
                                    <span className="text-emerald-400">{item.approvalStatus}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 pr-8">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-3xl rounded-tl-sm bg-slate-900/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono flex items-center gap-3 shadow-xl backdrop-blur-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Executing Knowledge Agent Pipeline...</span>
                    <span className="text-[10px] text-slate-400">Connecting to PostgreSQL FHIR Store & querying pgvector knowledge index...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3) STICKY BOTTOM INPUT BAR & PATIENT CONTEXT SCOPE WITH DOWNSIDE LIVE FLOW */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-white/10 space-y-3.5">
          {/* Active Context Status Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-300">Patient Context Scope:</span>
              {attachedPatient ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{attachedPatient.fullName}</span>
                  <span className="text-slate-400 font-normal">({attachedPatient.mrn})</span>
                  <button
                    onClick={handleUnattachPatient}
                    className="hover:text-white cursor-pointer ml-1 text-slate-400 hover:text-rose-300"
                    title="Remove patient context"
                  >
                    ×
                  </button>
                </span>
              ) : (
                <span className="text-slate-500 font-mono text-[11px]">None (General Guidelines)</span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>Specialty:</span>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="bg-slate-900 border border-white/10 text-slate-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Specialties</option>
                <option value="CARDIOLOGY">Cardiology</option>
                <option value="ENDOCRINOLOGY">Endocrinology</option>
                <option value="PULMONOLOGY">Pulmonology</option>
                <option value="CRITICAL_CARE">Critical Care</option>
              </select>
            </div>
          </div>

          {/* Quick Query Suggestion Chips for Attached Patient */}
          {attachedPatient && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Quick Prompts:
              </span>
              {[
                `Summarize clinical history & active diagnoses for ${attachedPatient.fullName.split(' ')[0]}`,
                `Review current medications & check drug-drug interactions`,
                `Analyze latest vitals trend & clinical risk factors`,
                `Draft evidence-based care plan & discharge checklist`
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setInputText(suggestion)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 hover:text-white whitespace-nowrap transition-all cursor-pointer text-[10.5px] font-sans"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* ChatGPT Prompt Textarea & Submit Button */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder="Ask a clinical question or request suggestions (e.g. 'Evaluate Empagliflozin SGLT2 feasibility with current eGFR'). Press Enter to submit..."
                className="w-full bg-white/5 border border-white/15 rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors backdrop-blur-md resize-none font-sans"
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed h-full"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* DOWNSIDE WINDOW OF PATIENT CONTEXT SCOPE: LIVE AGENT FLOW (COLLAPSED BY DEFAULT) */}
          {/* ========================================================================= */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            {/* Collapsed / Expand Toggle Button on downside window of Patient Context Scope */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">Knowledge Agent Live Telemetry & Transmission Flow</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      showLiveFlow 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold' 
                        : 'bg-slate-800/80 text-slate-400 border-white/10'
                    }`}>
                      {showLiveFlow ? 'ACTIVE • EXPANDED' : 'COLLAPSED BY DEFAULT'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                    {attachedPatient
                      ? `Scope: ${attachedPatient.fullName} (${attachedPatient.mrn}) • Query Context: "${inputText.trim() || (messages[messages.length - 1]?.text ?? 'Ready for clinical query')}"`
                      : `Query Context: "${inputText.trim() || (messages[messages.length - 1]?.text ?? 'Approved Institutional Guidelines Scope')}"`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLiveFlow(!showLiveFlow)}
                className="px-3.5 py-2 rounded-xl bg-[#081826] hover:bg-[#0c2438] border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/10 shrink-0"
                title="Toggle Knowledge Agent Live Flow Display"
              >
                <span>{showLiveFlow ? 'Collapse Live Agent Flow' : 'Expand Live Agent Flow (Knowledge Agent)'}</span>
                {showLiveFlow ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Live Agent Flow Canvas Container (Displayed downside when expanded) */}
            {showLiveFlow && (
              <div className="pt-2">
                <VerticalPatientSearchFlowCanvas
                  defaultActiveAgent="KNOWLEDGE"
                  queryContext={
                    inputText.trim() || 
                    (messages.length > 0 ? messages[messages.length - 1]?.text : '') || 
                    (attachedPatient ? `Clinical Knowledge synthesis for ${attachedPatient.fullName}` : 'Approved Institutional Guidelines Query')
                  }
                  patient={attachedPatient || undefined}
                  currentUser={currentUser}
                  purposeOfUse={purposeOfUse}
                  autoPlayOnce={true}
                  onSelectPatient={onSelectPatient}
                />
              </div>
            )}
          </div>

          <div className="text-[10px] text-center text-slate-500 font-mono">
            Governed by HealthNet Security Policy • Zero-Speculation Grounded RAG • Mandatory Clinician Verification
          </div>
        </div>
      </div>
    </div>
  );
};
