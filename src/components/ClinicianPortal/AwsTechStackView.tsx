import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Database, 
  Layers, 
  Search, 
  Lock, 
  Radio, 
  Zap, 
  Activity, 
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles,
  ExternalLink,
  Bot,
  FileCode,
  CheckCircle2,
  Globe,
  HardDrive,
  Workflow,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Move,
  Compass,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { UserProfile } from '../../types/auth.types';

interface AwsTechStackViewProps {
  currentUser: UserProfile;
  purposeOfUse: string;
  onGoBack?: () => void;
}

export interface AwsDomainItem {
  domainId: number;
  domainName: string;
  category: 'Edge & Ingress' | 'Voice & AI' | 'IAM & Security' | 'Agentic Core' | 'Data & EHR' | 'Observability & DR';
  localPrototype: string;
  awsTechStack: string;
  awsServices: string[];
  purposeRole: string;
}

const AWS_TECH_STACK_DOMAINS: AwsDomainItem[] = [
  {
    domainId: 1,
    domainName: '1. User Channels, Secure Edge & Gateway',
    category: 'Edge & Ingress',
    localPrototype: 'React 18 SPA, Vite dev server (npm run dev), simulated TLS badge',
    awsTechStack: 'AWS Amplify, Amazon CloudFront, Amazon Route 53, AWS WAF, AWS Shield Advanced, Amazon API Gateway',
    awsServices: ['AWS Amplify', 'Amazon CloudFront', 'Amazon Route 53', 'AWS WAF', 'AWS Shield Advanced', 'Amazon API Gateway'],
    purposeRole: 'Global low-latency edge delivery via CloudFront CDN, Route 53 DNS failover, AWS WAF/Shield L7 DDoS protection, API Gateway zero-trust mTLS ingress with rate limiting.'
  },
  {
    domainId: 2,
    domainName: '2. Clinical Voice & Ambient AI Services',
    category: 'Voice & AI',
    localPrototype: 'Text-only prompt input in KnowledgeQAView.tsx',
    awsTechStack: 'Amazon Transcribe Medical, Amazon Lex, Amazon Textract, Comprehend Medical, Amazon Polly, Amazon Translate',
    awsServices: ['Amazon Transcribe Medical', 'Amazon Lex', 'Amazon Textract', 'Amazon Comprehend Medical', 'Amazon Polly', 'Amazon Translate'],
    purposeRole: 'Speech-to-text for clinical voice dictation (Transcribe Medical), conversational voice bots (Lex), medical OCR chart extraction (Textract), and multi-lingual translation.'
  },
  {
    domainId: 3,
    domainName: '3. Identity, Access & SSO',
    category: 'IAM & Security',
    localPrototype: 'Simulated JWT state (auth.types.ts) with clinician/admin roles',
    awsTechStack: 'Amazon Cognito, AWS IAM / IAM Identity Center, AWS Managed SSO',
    awsServices: ['Amazon Cognito', 'AWS IAM', 'AWS IAM Identity Center', 'AWS Managed SSO'],
    purposeRole: 'User Pools for clinician login, SAML 2.0 / OIDC federation for hospital EMR SSO (Epic/Cerner IDP), custom JWT role claims (isAdmin), and fine-grained IAM policy scoping.'
  },
  {
    domainId: 4,
    domainName: '4. Agentic Orchestration & Agent Core',
    category: 'Agentic Core',
    localPrototype: 'State machine state (VerticalPatientSearchFlowCanvas.tsx, agentEngine.ts)',
    awsTechStack: 'Amazon Agent Core (Multi-Agent Engine), Amazon Bedrock, AWS Lambda, AWS ECS Fargate',
    awsServices: ['Amazon Agent Core', 'Amazon Bedrock', 'AWS Step Functions', 'AWS Lambda', 'AWS ECS Fargate'],
    purposeRole: 'Amazon Agent Core orchestrates multi-agent delegation across Orchestrator, Clinical, Workflow, and Compliance agents. Lambda executes serverless tool actions (FHIR queries, order drafting).'
  },
  {
    domainId: 5,
    domainName: '5. Context, Session & Agent Core Memory',
    category: 'Agentic Core',
    localPrototype: 'React in-memory component state',
    awsTechStack: 'Amazon Agent Core Memory, Amazon ElastiCache for Redis, Amazon DynamoDB',
    awsServices: ['Amazon Agent Core Memory', 'Amazon ElastiCache for Redis', 'Amazon DynamoDB', 'Apache Pinot'],
    purposeRole: 'Amazon Agent Core Memory maintains long-term clinical conversation context, patient session state, and multi-agent context fusion. ElastiCache Redis handles LLM semantic caching.'
  },
  {
    domainId: 6,
    domainName: '6. Foundation Model Fabric & Guardrails',
    category: 'Voice & AI',
    localPrototype: 'Simulated LLM response generator in agentEngine.ts',
    awsTechStack: 'Amazon Bedrock (Claude 3.5 Sonnet), SageMaker Endpoints, Amazon Bedrock Guardrails',
    awsServices: ['Amazon Bedrock', 'SageMaker Endpoints', 'Amazon Bedrock Guardrails'],
    purposeRole: 'Bedrock managed access to Anthropic Claude 3.5 Sonnet. SageMaker for fine-tuned clinical models. Bedrock Guardrails for DLP PHI redaction, prompt injection defense, & zero-hallucination checks.'
  },
  {
    domainId: 7,
    domainName: '7. Advanced RAG & Knowledge Graph',
    category: 'Voice & AI',
    localPrototype: 'Static guideline arrays in KnowledgeQAView.tsx',
    awsTechStack: 'Amazon Bedrock Knowledge Bases, Amazon OpenSearch Service, Amazon Neptune (Health KG)',
    awsServices: ['Amazon Bedrock Knowledge Bases', 'Amazon OpenSearch Service', 'Amazon Neptune'],
    purposeRole: 'Bedrock Knowledge Bases parses clinical PDFs. OpenSearch Service handles hybrid vector + BM25 search. Amazon Neptune manages Health Knowledge Graph (Care Pathways & Entity Linking).'
  },
  {
    domainId: 8,
    domainName: '8. Governed Data Platform & Integration',
    category: 'Data & EHR',
    localPrototype: 'Synthetic FHIR R4 JSON schemas (syntheticFhirData.ts)',
    awsTechStack: 'AWS HealthLake, Amazon S3 Lakehouse, AWS Lake Formation, Amazon Aurora (RDS), Amazon Redshift, AWS AppFlow, Amazon MSK, Amazon MQ',
    awsServices: ['AWS HealthLake', 'Amazon S3 Lakehouse', 'AWS Lake Formation', 'Amazon Aurora PostgreSQL', 'Amazon Redshift', 'AWS AppFlow', 'Amazon MSK', 'Amazon MQ'],
    purposeRole: 'AWS HealthLake manages HIPAA FHIR R4 store. S3 Lakehouse + Glue + Athena for analytics. Lake Formation for FGAC governance. AppFlow/MSK/MQ for HL7v2, DICOM, and streaming EHR events.'
  },
  {
    domainId: 9,
    domainName: '9. Observability & Agent Core Evaluation',
    category: 'Observability & DR',
    localPrototype: 'Console logs & step state counters (currentExecutionStep)',
    awsTechStack: 'Amazon Agent Core Evaluation Harness, Amazon CloudWatch, AWS X-Ray, AWS CodePipeline',
    awsServices: ['Amazon Agent Core Evaluation', 'Amazon CloudWatch', 'AWS X-Ray', 'AWS CodePipeline', 'AWS Cost Explorer'],
    purposeRole: 'Amazon Agent Core Evaluation Harness measures agent task accuracy, RAG faithfulness, recall, & zero-hallucination metrics. X-Ray provides end-to-end multi-agent latency tracing.'
  },
  {
    domainId: 10,
    domainName: '10. Security Overlay & Multi-Region Resilience',
    category: 'IAM & Security',
    localPrototype: 'Local environment variables and in-memory execution',
    awsTechStack: 'AWS KMS, AWS CloudHSM, AWS Secrets Manager, Amazon Macie, Amazon GuardDuty, AWS Security Hub, AWS Config, AWS CloudTrail, AWS Global Accelerator, Aurora Global Database, AWS Backup',
    awsServices: ['AWS KMS', 'AWS CloudHSM', 'AWS Secrets Manager', 'Amazon Macie', 'Amazon GuardDuty', 'AWS Security Hub', 'AWS Config', 'AWS CloudTrail', 'AWS Global Accelerator', 'Amazon Aurora Global Database', 'AWS Backup'],
    purposeRole: 'KMS envelope encryption, CloudHSM FIPS 140-2 L3 key vault, Macie automated PHI discovery in S3, GuardDuty threat detection, CloudTrail immutable audit logs, Global Accelerator + Aurora Global DB for multi-region failover.'
  }
];

export const AwsTechStackView: React.FC<AwsTechStackViewProps> = ({
  currentUser,
  purposeOfUse,
  onGoBack,
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Zoom & Pan Navigation State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeModalDiagram, setActiveModalDiagram] = useState<'LOCAL' | 'AWS' | null>(null);

  const handleZoomIn = () => setZoomScale(prev => Math.min(+(prev + 0.25).toFixed(2), 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(+(prev - 0.25).toFixed(2), 0.5));
  
  // Pan Direction Handlers
  const handleMoveUp = () => setPanOffset(prev => ({ ...prev, y: prev.y + 80 }));
  const handleMoveDown = () => setPanOffset(prev => ({ ...prev, y: prev.y - 80 }));
  const handleMoveLeft = () => setPanOffset(prev => ({ ...prev, x: prev.x + 80 }));
  const handleMoveRight = () => setPanOffset(prev => ({ ...prev, x: prev.x - 80 }));
  
  const handleResetAll = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const openDiagramModal = (type: 'LOCAL' | 'AWS') => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveModalDiagram(type);
  };

  const categories = ['ALL', 'Edge & Ingress', 'Voice & AI', 'IAM & Security', 'Agentic Core', 'Data & EHR', 'Observability & DR'];

  const filteredDomains = AWS_TECH_STACK_DOMAINS.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.domainName.toLowerCase().includes(term) ||
      item.awsTechStack.toLowerCase().includes(term) ||
      item.purposeRole.toLowerCase().includes(term) ||
      item.localPrototype.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Portal Admin Exclusive
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                Amazon Agent Core Architecture
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Enterprise AWS Production Tech Stack
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive 10-domain AWS cloud migration reference architecture mapping local prototype to native AWS services
            </p>
          </div>
        </div>

        <a
          href="file:///Users/rk/Antigravity/demo/demo-clinical-ai/Clinical_AI_Portal_AWS_Architecture_Blueprint.docx"
          download="Clinical_AI_Portal_AWS_Architecture_Blueprint.docx"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Word Architecture (.docx)</span>
        </a>
      </div>

      {/* Amazon Agent Core Announcement Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">Powered by Amazon Agent Core Framework</h3>
              <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-purple-500/30 text-purple-300 border border-purple-500/40">
                AWS Agentic Platform Core
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              With legacy/classic agent orchestration sunset, this portal architecture uses <strong>Amazon Agent Core</strong> for native multi-agent collaboration (Orchestrator Agent, Specialist Knowledge Agent, Patient EHR Agent, Workflow Agent), agentic long-term memory management, and automated clinical evaluation harnesses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-purple-950/90 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Amazon Agent Core Memory
          </span>
        </div>
      </div>

      {/* Domain Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="text-slate-400 text-[11px]">AWS Domains Covered</div>
          <div className="text-xl font-bold text-amber-400 mt-1">10 / 10</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% HIPAA Aligned</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="text-slate-400 text-[11px]">AWS Native Services</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">32+ Services</div>
          <div className="text-[10px] text-cyan-300 mt-0.5">Fully Serverless / Managed</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="text-slate-400 text-[11px]">Agent Framework</div>
          <div className="text-xl font-bold text-purple-400 mt-1">Amazon Agent Core</div>
          <div className="text-[10px] text-purple-300 mt-0.5">Multi-Agent & Memory</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="text-slate-400 text-[11px]">Resilience & DR</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">Multi-Region</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">RPO: 5m | RTO: 15m</div>
        </div>
      </div>

      {/* DIAGRAM 1: LOCAL DEVELOPMENT ARCHITECTURE */}
      <div className={`p-6 rounded-2xl border space-y-4 shadow-xl ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                Local Development Scope
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                Click Image to Expand
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>1. Local Development Architecture Diagram</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              7-layer local execution topology: React 18 UI ➔ Clinical AI Gateway ➔ Multi-Agent Dispatch ➔ Context Fusion ➔ LLM Inference ➔ Response Validator
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href="/local_development_architecture.png"
              download="Local_Development_Architecture.png"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </a>

            <button
              onClick={() => openDiagramModal('LOCAL')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Fullscreen Presentation</span>
            </button>
          </div>
        </div>

        {/* High Quality Preview Image Viewport (Clickable to Popup Full Window) */}
        <div 
          onClick={() => openDiagramModal('LOCAL')}
          className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/90 p-4 shadow-inner max-h-[500px] relative transition-all cursor-pointer group hover:border-emerald-500/50"
          title="Click to popup full window diagram"
        >
          <div className="flex items-center justify-center h-full">
            <img
              src="/local_development_architecture.png"
              alt="Local Development Architecture Diagram"
              className="w-full h-auto rounded-lg object-contain max-h-[460px] mx-auto transition-transform group-hover:scale-[1.01]"
            />
          </div>
          <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-lg group-hover:bg-emerald-500/20 transition-all">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Popup Full Window</span>
          </div>
        </div>
      </div>

      {/* DIAGRAM 2: ENTERPRISE HEALTHCARE AI PLATFORM ON AWS */}
      <div className={`p-6 rounded-2xl border space-y-4 shadow-xl ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                Enterprise Production Scope
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                10-Domain AWS Architecture
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <span>2. Enterprise Healthcare AI Platform on AWS (Reference Architecture)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              HIPAA-aligned agentic RAG topology: Amplify ➔ CloudFront ➔ API Gateway ➔ Amazon Agent Core ➔ Bedrock ➔ HealthLake ➔ Multi-Region Aurora
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href="/aws_enterprise_architecture.png"
              download="AWS_Enterprise_Healthcare_AI_Architecture.png"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </a>

            <button
              onClick={() => openDiagramModal('AWS')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Fullscreen Presentation</span>
            </button>
          </div>
        </div>

        {/* High Quality Preview Image Viewport (Clickable to Popup Full Window) */}
        <div 
          onClick={() => openDiagramModal('AWS')}
          className="rounded-xl border border-white/10 overflow-hidden bg-slate-950/90 p-4 shadow-inner max-h-[500px] relative transition-all cursor-pointer group hover:border-cyan-500/50"
          title="Click to popup full window diagram"
        >
          <div className="flex items-center justify-center h-full">
            <img
              src="/aws_enterprise_architecture.png"
              alt="AWS Enterprise Healthcare AI Architecture Diagram"
              className="w-full h-auto rounded-lg object-contain max-h-[460px] mx-auto transition-transform group-hover:scale-[1.01]"
            />
          </div>
          <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg group-hover:bg-cyan-500/20 transition-all">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Popup Full Window</span>
          </div>
        </div>
      </div>

      {/* FULLSCREEN POPUP LIGHTBOX MODAL WITH 2D PAN & ZOOM CONTROLS */}
      {activeModalDiagram && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-white/10 mb-4 shrink-0 shadow-2xl flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {activeModalDiagram === 'LOCAL' ? <Layers className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {activeModalDiagram === 'LOCAL' 
                    ? 'Local Development Architecture — Presentation Mode' 
                    : 'Enterprise Healthcare AI Platform on AWS — Presentation Mode'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  300 DPI High-Res Vector PNG • Scale: {Math.round(zoomScale * 100)}% • Position X: {panOffset.x}px | Y: {panOffset.y}px
                </p>
              </div>
            </div>

            {/* Modal Navigation Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Switch Diagram Button */}
              <button
                onClick={() => openDiagramModal(activeModalDiagram === 'LOCAL' ? 'AWS' : 'LOCAL')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Switch to {activeModalDiagram === 'LOCAL' ? 'AWS Architecture' : 'Local Architecture'}</span>
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  onClick={handleZoomIn}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-400 font-bold"
                  title="Zoom In"
                >
                  +
                </button>
                <span className="text-amber-300 font-bold px-1.5">{Math.round(zoomScale * 100)}%</span>
                <button
                  onClick={handleZoomOut}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-400 font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>

              {/* Directional Pad Controls */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-mono text-cyan-300">
                <button onClick={handleMoveUp} className="p-1.5 rounded bg-white/10 hover:bg-white/20" title="Move Top"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={handleMoveDown} className="p-1.5 rounded bg-white/10 hover:bg-white/20" title="Move Down / Front"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button onClick={handleMoveLeft} className="p-1.5 rounded bg-white/10 hover:bg-white/20" title="Move Left"><ArrowLeft className="w-3.5 h-3.5" /></button>
                <button onClick={handleMoveRight} className="p-1.5 rounded bg-white/10 hover:bg-white/20" title="Move Right"><ArrowRight className="w-3.5 h-3.5" /></button>
              </div>

              <button
                onClick={handleResetAll}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Reset</span>
              </button>

              <a
                href={activeModalDiagram === 'LOCAL' ? '/local_development_architecture.png' : '/aws_enterprise_architecture.png'}
                download={activeModalDiagram === 'LOCAL' ? 'Local_Development_Architecture.png' : 'AWS_Enterprise_Healthcare_AI_Architecture.png'}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all ml-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </a>

              <button
                onClick={() => setActiveModalDiagram(null)}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer transition-all ml-2"
                title="Close Full Window Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Image Viewport */}
          <div className="flex-1 overflow-hidden bg-slate-950 p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center relative">
            <div 
              className="transition-transform duration-200 origin-center cursor-grab active:cursor-grabbing"
              style={{ 
                transform: `scale(${zoomScale}) translate(${panOffset.x}px, ${panOffset.y}px)` 
              }}
            >
              <img
                src={activeModalDiagram === 'LOCAL' ? '/local_development_architecture.png' : '/aws_enterprise_architecture.png'}
                alt={activeModalDiagram === 'LOCAL' ? 'Local Development Architecture Diagram' : 'AWS Enterprise Healthcare AI Architecture Diagram'}
                className="max-w-none w-[1850px] h-auto rounded-xl shadow-2xl border border-white/10 select-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl space-y-4 ${
        isDark ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Table Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span>Full AWS Services Tech Stack Matrix</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {filteredDomains.length} Domains
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Component-by-component comparison: Local React/Express vs AWS Cloud Production Stack
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AWS service, domain..."
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-slate-950 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer border ${
                isDark ? 'bg-slate-950 border-white/10 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tech Stack Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                isDark ? 'bg-slate-950/80 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <th className="p-3.5 font-bold w-1/5">Architecture Domain</th>
                <th className="p-3.5 font-bold w-1/4">Current Local Prototype</th>
                <th className="p-3.5 font-bold w-1/4">Target AWS Tech Stack (Production)</th>
                <th className="p-3.5 font-bold w-3/10">Architectural Role & Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredDomains.map((item) => (
                <tr key={item.domainId} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  {/* Domain Name */}
                  <td className="p-3.5 font-semibold align-top">
                    <span className="text-white font-bold text-xs block">{item.domainName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-mono inline-block mt-1">
                      {item.category}
                    </span>
                  </td>

                  {/* Local Prototype */}
                  <td className="p-3.5 align-top text-slate-300 font-mono text-[11px] bg-slate-950/40">
                    {item.localPrototype}
                  </td>

                  {/* Target AWS Tech Stack */}
                  <td className="p-3.5 align-top bg-amber-500/5">
                    <div className="font-mono font-bold text-amber-300 text-xs mb-1.5">
                      {item.awsTechStack}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.awsServices.map((svc) => (
                        <span 
                          key={svc} 
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Architectural Role & Capabilities */}
                  <td className="p-3.5 align-top text-slate-300 leading-relaxed text-xs">
                    {item.purposeRole}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
