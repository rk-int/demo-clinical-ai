import React, { useState } from 'react';
import { 
  Server, 
  ArrowLeft, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Bot, 
  Users, 
  FileText, 
  Database, 
  Lock, 
  Zap, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { UserProfile, PurposeOfUse } from '../../types';

interface ApiArchitectureViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  onGoBack?: () => void;
}

interface ApiEndpointItem {
  method: 'GET' | 'POST';
  path: string;
  category: 'GATEWAY' | 'PATIENTS' | 'AI_RAG' | 'WORKFLOW' | 'TELEMETRY' | 'EXTERNAL';
  title: string;
  description: string;
  security: string;
}

const SYSTEM_APIS: ApiEndpointItem[] = [
  // 1. Gateway & System APIs
  {
    method: 'GET',
    path: '/api/health',
    category: 'GATEWAY',
    title: 'System Gateway Health & Readiness',
    description: 'Checks server health, active Gemini client connection, and model fallback status.',
    security: 'Public Health Check'
  },
  {
    method: 'GET',
    path: '/api/gemini/models',
    category: 'GATEWAY',
    title: 'Gemini LLM Models Registry',
    description: 'Discovers active Gemini models, latency tiers, and recommended clinical endpoints.',
    security: 'Bearer Auth / Session'
  },
  {
    method: 'GET',
    path: '/api/export/zip',
    category: 'GATEWAY',
    title: 'Codebase ZIP Package Exporter',
    description: 'Packs full source code into a downloadable zip archive for deployment.',
    security: 'Admin Exclusive'
  },

  // 2. Patient & FHIR Data APIs
  {
    method: 'GET',
    path: '/api/patients',
    category: 'PATIENTS',
    title: 'FHIR Patient Directory Search',
    description: 'Searches synthetic FHIR R4 records filtered dynamically by hospital facility context.',
    security: 'ABAC Care Roster Check'
  },
  {
    method: 'GET',
    path: '/api/patients/:id',
    category: 'PATIENTS',
    title: 'Patient 360 Biomarker & Lab Profile',
    description: 'Retrieves full FHIR patient data: vitals, lab trends, active diagnoses & medications.',
    security: 'ABAC + Purpose of Use'
  },
  {
    method: 'POST',
    path: '/api/patients',
    category: 'PATIENTS',
    title: 'Ingest New FHIR Patient Record',
    description: 'Registers a new synthetic FHIR patient with automated provenance checksum.',
    security: 'Clinician / Admin Role'
  },

  // 3. AI Assistant & RAG Query API
  {
    method: 'POST',
    path: '/api/knowledge/query',
    category: 'AI_RAG',
    title: 'Clinical Knowledge & RAG Assistant',
    description: 'Executes 10-stage pipeline: NeMo Guardrails -> DLP PHI Redaction -> Hybrid Search (BM25 + pgvector) -> Gemini Reasoning -> Citation Validation.',
    security: 'NeMo Input/Output Guardrails'
  },

  // 4. Clinical Workflow & Order APIs
  {
    method: 'POST',
    path: '/api/workflows/draft',
    category: 'WORKFLOW',
    title: 'AI Clinical Note & Order Synthesizer',
    description: 'Drafts structured SOAP notes or order sets locked to the attached patient context.',
    security: 'Context Lock'
  },
  {
    method: 'POST',
    path: '/api/workflows/approve',
    category: 'WORKFLOW',
    title: 'Digital Signature & Note Commit',
    description: 'Digitally signs and commits clinical orders with SHA-256 audit entry.',
    security: 'Mandatory Digital Signature'
  },
  {
    method: 'POST',
    path: '/api/workflows/rollback',
    category: 'WORKFLOW',
    title: 'Note Workspace Draft Rollback',
    description: 'Reverts note workspace cleanly to previous verified draft state.',
    security: 'Clinician Approval Gate'
  },

  // 5. Telemetry & Audit APIs
  {
    method: 'GET',
    path: '/api/telemetry/traces',
    category: 'TELEMETRY',
    title: 'Security Audit & Agent Trace Stream',
    description: 'Retrieves full SHA-256 event audit log stream and agent execution latencies.',
    security: 'Audit / Admin Role Guard'
  },
  {
    method: 'GET',
    path: '/api/telemetry/kpis',
    category: 'TELEMETRY',
    title: 'Executive ROI & Precision Metrics',
    description: 'Fetches operational KPIs: hours saved, chart review time, and cost avoidance.',
    security: 'Enterprise Analytics'
  },

  // 6. External Third-Party APIs
  {
    method: 'POST',
    path: 'https://generativelanguage.googleapis.com',
    category: 'EXTERNAL',
    title: 'Google Gemini LLM API (@google/genai)',
    description: 'Official SDK integration for Gemini models (Gemini 3.6 Flash, 3.1 Flash-Lite, 3.7 Flash).',
    security: 'TLS 1.3 + API Key Token'
  },
  {
    method: 'POST',
    path: 'https://openrouter.ai/api/v1/chat/completions',
    category: 'EXTERNAL',
    title: 'OpenRouter Fallback Gateway',
    description: 'Secondary LLM provider bridge for capacity failover ladder.',
    security: 'Bearer Key'
  },
  {
    method: 'GET',
    path: 'https://api.dicebear.com/7.x/avataaars/svg',
    category: 'EXTERNAL',
    title: 'Dicebear Vector Avatar Generator',
    description: 'Generates dynamic SVGs for synthetic patients and clinician profiles.',
    security: 'Public Static Assets'
  }
];

export const ApiArchitectureView: React.FC<ApiArchitectureViewProps> = ({
  currentUser,
  purposeOfUse,
  onGoBack,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredApis = filterCategory === 'ALL'
    ? SYSTEM_APIS
    : SYSTEM_APIS.filter(api => api.category === filterCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0"
              title="Back to Previous View"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/30 border border-white/20">
            <Server className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white tracking-tight">API Info & Endpoint Directory</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Portal Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Crisp & lightweight summary of internal REST endpoints and third-party cloud APIs powering this application.
            </p>
          </div>
        </div>

        {/* Quick Stats Metrics */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-white/10 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Endpoints</span>
            <span className="text-sm font-extrabold text-purple-300 font-mono">15 REST APIs</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-white/10 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">External APIs</span>
            <span className="text-sm font-extrabold text-cyan-300 font-mono">3 Services</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Security Protocol</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">TLS 1.3 / mTLS</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { key: 'ALL', label: 'All APIs (15)' },
          { key: 'GATEWAY', label: '🌐 System Gateway (3)' },
          { key: 'PATIENTS', label: '🏥 Patient & FHIR (3)' },
          { key: 'AI_RAG', label: '🤖 AI & RAG Engine (1)' },
          { key: 'WORKFLOW', label: '✍️ Workflow & Notes (3)' },
          { key: 'TELEMETRY', label: '📊 Telemetry & Audit (2)' },
          { key: 'EXTERNAL', label: '⚡ External APIs (3)' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === tab.key
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* API Endpoint Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApis.map((api, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 transition-all duration-200 backdrop-blur-xl shadow-xl space-y-3 group"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-extrabold shadow-sm ${
                  api.method === 'GET'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {api.method}
                </span>
                <code className="text-xs font-mono font-bold text-cyan-300 break-all">
                  {api.path}
                </code>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                {api.security}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {api.title}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-sans">
                {api.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-400">
                <Code2 className="w-3 h-3 text-purple-400" />
                <span>Format: JSON / FHIR R4</span>
              </span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Endpoint
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
