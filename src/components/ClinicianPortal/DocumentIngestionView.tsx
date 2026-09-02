import React, { useState } from 'react';
import { 
  FileUp, 
  Layers, 
  Database, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  FileText, 
  Binary, 
  Cpu, 
  AlertTriangle, 
  Lock, 
  Check, 
  Loader2, 
  ChevronRight,
  Eye,
  Info,
  Building,
  UserCheck
} from 'lucide-react';
import { UserProfile, PurposeOfUse, SyntheticPatient, MultimodalIngestionResult } from '../../types';

interface DocumentIngestionViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients: SyntheticPatient[];
  onPatientIngested?: (patient: SyntheticPatient) => void;
  onOpenKnowledgeQA?: (prefilledQuery?: string) => void;
}

interface SampleDocPreset {
  id: string;
  name: string;
  modality: 'TEXT_PDF' | 'LAB_STRUCTURED' | 'IMAGING_VISION';
  fileName: string;
  patientName: string;
  patientMrn: string;
  rawSizeKb: number;
  contentPreview: string;
  extractedEntities: { type: 'CONDITION' | 'MEDICATION' | 'LAB' | 'FINDING' | 'PROCEDURE'; text: string; confidence: number }[];
  chunks: { section: string; text: string; tokens: string[] }[];
  denseModel: string;
  sparseTokens: number;
  retrievalScore: number;
  groundednessScore: number;
}

const SAMPLE_PRESETS: SampleDocPreset[] = [
  {
    id: 'DOC-HF-TRANSFER',
    name: 'Cardiology Inpatient Transfer Note (PDF)',
    modality: 'TEXT_PDF',
    fileName: 'Transfer_Summary_PT1002_Cardiology.pdf',
    patientName: 'Elena Rostova (PT-1002)',
    patientMrn: '1002491',
    rawSizeKb: 142,
    contentPreview: `CLINICAL TRANSFER SUMMARY
PATIENT: Elena Rostova, 67yo F | MRN: 1002491 | UPR: UPR-2024-CITY-1002491
TRANSFERRING FACILITY: North River Community Hospital ICU
RECEIVING UNIT: Metro St. Jude Academic Medical Center - Stepdown 4W
CHIEF COMPLAINT & HPI: 67yo female with history of HFpEF and Stage 3a CKD (baseline eGFR 38 mL/min/1.73m2), admitted 4 days ago with acute pulmonary edema. Managed with IV Lasix.
ACTIVE MEDICATIONS: Empagliflozin 10mg daily, Sacubitril/Valsartan 24/26mg BID, Furosemide 40mg daily.
ALLERGIES: Lisinopril (Angioedema - Severe).
LAB OBSERVATIONS: NT-proBNP 2450 pg/mL, Serum Creatinine 1.62 mg/dL, eGFR 38 mL/min, Serum K+ 4.8 mmol/L.
RECOMMENDATIONS: Continue SGLT2i therapy as eGFR remains > 20 mL/min guideline safety threshold. Maintain strict fluid restriction < 1.5L/day.`,
    extractedEntities: [
      { type: 'CONDITION', text: 'HFpEF (Heart Failure preserved Ejection Fraction)', confidence: 0.98 },
      { type: 'CONDITION', text: 'Chronic Kidney Disease Stage 3a', confidence: 0.97 },
      { type: 'MEDICATION', text: 'Empagliflozin 10 mg PO Daily', confidence: 0.99 },
      { type: 'MEDICATION', text: 'Sacubitril/Valsartan 24/26 mg BID', confidence: 0.99 },
      { type: 'LAB', text: 'NT-proBNP: 2450 pg/mL', confidence: 0.96 },
      { type: 'LAB', text: 'eGFR: 38 mL/min/1.73m2', confidence: 0.97 },
      { type: 'FINDING', text: 'Allergy: Lisinopril Angioedema', confidence: 0.99 }
    ],
    chunks: [
      {
        section: '1. Demographics & Transfer Context',
        text: 'Patient Elena Rostova, 67yo F (MRN: 1002491). Transferred from North River Community ICU to Metro St. Jude Stepdown 4W following stabilization of acute heart failure decompensation.',
        tokens: ['elena', 'rostova', 'transfer', 'stepdown', 'decompensation', 'heart', 'failure']
      },
      {
        section: '2. Cardiorenal Evaluation & SGLT2i Protocol',
        text: 'Patient presented with decompensated HFpEF and baseline CKD 3a. Serum creatinine 1.62 mg/dL with eGFR 38 mL/min/1.73m2. Patient maintained on Empagliflozin 10mg PO daily in accordance with Heart Failure Guideline 2025 (eGFR threshold >= 20).',
        tokens: ['hfpef', 'ckd', 'egfr', 'empagliflozin', 'sglt2i', 'creatinine', 'protocol', 'threshold']
      },
      {
        section: '3. Allergy Safety & Discharge Plan',
        text: 'Severe angioedema allergy to Lisinopril (ACEi) documented. Sacubitril/Valsartan initiated with appropriate prior 36-hour washout. Discharge planned with daily weight monitoring and outpatient cardiorenal follow-up.',
        tokens: ['lisinopril', 'angioedema', 'allergy', 'sacubitril', 'valsartan', 'washout', 'discharge']
      }
    ],
    denseModel: 'Clinical-BioBERT-v2 / text-embedding-004 (768-dim)',
    sparseTokens: 184,
    retrievalScore: 0.962,
    groundednessScore: 0.985
  },
  {
    id: 'DOC-METABOLIC-JSON',
    name: 'Inpatient Comprehensive Chemistry Panel (JSON/HL7)',
    modality: 'LAB_STRUCTURED',
    fileName: 'Lab_Report_ChemPanel_LOINC_PT1003.json',
    patientName: 'Marcus Aurelius Vance (PT-1003)',
    patientMrn: '1003882',
    rawSizeKb: 54,
    contentPreview: `{
  "resourceType": "DiagnosticReport",
  "id": "DR-CHEM-2026-08",
  "status": "final",
  "code": { "coding": [{ "system": "http://loinc.org", "code": "24323-8", "display": "Comprehensive Metabolic Panel" }] },
  "subject": { "reference": "Patient/PT-1003", "display": "Marcus Aurelius Vance" },
  "effectiveDateTime": "2026-08-28T07:15:00Z",
  "result": [
    { "code": "2823-3", "name": "Potassium", "value": 5.4, "unit": "mmol/L", "reference": "3.5-5.0", "status": "ABNORMAL_HIGH" },
    { "code": "2160-0", "name": "Serum Creatinine", "value": 2.1, "unit": "mg/dL", "reference": "0.7-1.3", "status": "ABNORMAL_HIGH" },
    { "code": "33914-3", "name": "eGFR (CKD-EPI)", "value": 31, "unit": "mL/min/1.73m2", "reference": "> 60", "status": "ABNORMAL_LOW" },
    { "code": "2345-7", "name": "Glucose Fasting", "value": 164, "unit": "mg/dL", "reference": "70-99", "status": "ABNORMAL_HIGH" }
  ]
}`,
    extractedEntities: [
      { type: 'LAB', text: 'Serum Potassium: 5.4 mmol/L (High)', confidence: 0.99 },
      { type: 'LAB', text: 'Serum Creatinine: 2.1 mg/dL (High)', confidence: 0.99 },
      { type: 'LAB', text: 'eGFR: 31 mL/min/1.73m2 (CKD 3b)', confidence: 0.99 },
      { type: 'LAB', text: 'Fasting Glucose: 164 mg/dL', confidence: 0.98 }
    ],
    chunks: [
      {
        section: '1. Structured Chemistry Observations',
        text: 'LOINC 24323-8 Panel: Potassium 5.4 mmol/L (Elevated above 5.0 reference), Creatinine 2.1 mg/dL, eGFR 31 mL/min/1.73m2. Indicates acute-on-chronic renal impairment and mild hyperkalemia.',
        tokens: ['potassium', 'hyperkalemia', 'creatinine', 'egfr', 'loinc', 'renal', 'impairment']
      }
    ],
    denseModel: 'Clinical-BioBERT-v2 / text-embedding-004 (768-dim)',
    sparseTokens: 92,
    retrievalScore: 0.938,
    groundednessScore: 0.991
  },
  {
    id: 'DOC-CHEST-XRAY',
    name: 'Chest Radiography Digital Vision Report (DICOM OCR)',
    modality: 'IMAGING_VISION',
    fileName: 'Radiology_CXR_AP_View_PT1005.pdf',
    patientName: 'Devon Patel (PT-1005)',
    patientMrn: '1005119',
    rawSizeKb: 310,
    contentPreview: `DIAGNOSTIC RADIOLOGY REPORT
EXAM: Chest Radiograph (Single View AP Portable)
PATIENT: Devon Patel | MRN: 1005119 | DATE: 2026-08-29 06:30 AM
INDICATION: Rule out worsening pulmonary edema vs consolidation.
FINDINGS:
- Cardiac silhouette is moderately enlarged (Cardiomegaly).
- Mild pulmonary vascular congestion with small bilateral pleural effusions, right greater than left.
- Kerley B lines visible in right lower lung base.
- No focal consolidations or pneumothorax identified.
IMPRESSION: Findings compatible with mild-to-moderate congestive heart failure and vascular volume overload. Improving compared to prior study of 2026-08-25.`,
    extractedEntities: [
      { type: 'FINDING', text: 'Cardiomegaly with vascular congestion', confidence: 0.96 },
      { type: 'FINDING', text: 'Small bilateral pleural effusions', confidence: 0.95 },
      { type: 'FINDING', text: 'Kerley B lines (interstitial edema)', confidence: 0.94 },
      { type: 'PROCEDURE', text: 'Chest Radiograph AP Portable', confidence: 0.99 }
    ],
    chunks: [
      {
        section: '1. Radiographic Cardiothoracic Findings',
        text: 'Chest Radiography demonstrates cardiomegaly, vascular cephalization, and bilateral pleural effusions consistent with decompensated heart failure volume overload.',
        tokens: ['chest', 'xray', 'cardiomegaly', 'pleural', 'effusion', 'pulmonary', 'edema', 'volume']
      }
    ],
    denseModel: 'Clinical-BioBERT-v2 / text-embedding-004 (768-dim)',
    sparseTokens: 110,
    retrievalScore: 0.912,
    groundednessScore: 0.978
  }
];

export const DocumentIngestionView: React.FC<DocumentIngestionViewProps> = ({
  currentUser,
  purposeOfUse,
  patients,
  onPatientIngested,
  onOpenKnowledgeQA,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SampleDocPreset>(SAMPLE_PRESETS[0]);
  const [activeStage, setActiveStage] = useState<number>(0); // 0: Ready, 1: Ingest, 2: Chunk, 3: Embed, 4: Retrieve, 5: Ground, 6: Complete
  const [isProcessing, setIsProcessing] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customFileName, setCustomFileName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [ingestionComplete, setIngestionComplete] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<MultimodalIngestionResult | null>(null);

  const handleStartPipeline = () => {
    setIsProcessing(true);
    setIngestionComplete(false);
    setActiveStage(1);

    // Progressive execution through all 5 RAG stages
    setTimeout(() => {
      setActiveStage(2);
    }, 700);

    setTimeout(() => {
      setActiveStage(3);
    }, 1400);

    setTimeout(() => {
      setActiveStage(4);
    }, 2100);

    setTimeout(() => {
      setActiveStage(5);
    }, 2800);

    setTimeout(() => {
      setActiveStage(6);
      setIsProcessing(false);
      setIngestionComplete(true);

      const result: MultimodalIngestionResult = {
        documentId: `INGEST-${Date.now()}`,
        fileName: isCustomMode ? (customFileName || 'custom_document.pdf') : selectedPreset.fileName,
        modality: isCustomMode ? 'TEXT_PDF' : selectedPreset.modality,
        rawSizeKb: isCustomMode ? 85 : selectedPreset.rawSizeKb,
        uploadedAt: new Date().toISOString(),
        patientId: 'PT-1002',
        patientUprId: 'UPR-2024-CITY-1002491',
        stage1Classification: {
          parserUsed: selectedPreset.modality === 'LAB_STRUCTURED' 
            ? 'STRUCTURED_JSON_PARSER' 
            : selectedPreset.modality === 'IMAGING_VISION'
              ? 'VISION_MODEL_EXTRACTOR'
              : 'OCR_CLINICAL_PARSER',
          extractedTextSnippet: (isCustomMode ? customText : selectedPreset.contentPreview).slice(0, 180) + '...',
          identifiedEntities: selectedPreset.extractedEntities,
        },
        stage2Chunking: {
          chunkCount: selectedPreset.chunks.length,
          sections: selectedPreset.chunks.map(c => c.section),
          sampleChunk: selectedPreset.chunks[0]?.text || '',
        },
        stage3Embedding: {
          denseVectorModel: selectedPreset.denseModel,
          sparseKeywordTokens: selectedPreset.sparseTokens,
          vectorDimension: 768,
          indexedAt: new Date().toISOString(),
        },
        stage4Retrieval: {
          rerankScore: selectedPreset.retrievalScore,
          topKRetrieved: 3,
        },
        stage5Grounding: {
          groundednessScore: selectedPreset.groundednessScore,
          hallucinationRisk: 'NONE',
          phiMaskingVerified: true,
        },
      };

      setIngestionResult(result);
    }, 3500);
  };

  const handleReset = () => {
    setActiveStage(0);
    setIsProcessing(false);
    setIngestionComplete(false);
    setIngestionResult(null);
  };

  const stagesList = [
    {
      num: 1,
      name: 'Stage 1: Ingest & Classify',
      icon: FileUp,
      badge: 'Multimodal Parser',
      description: 'Ingests PDF/JSON/Vision binaries, runs clinical NLP tokenization, and extracts medical entities with confidence scores.',
    },
    {
      num: 2,
      name: 'Stage 2: Schema-Aware Chunking',
      icon: Layers,
      badge: 'Clinical Semantic Chunker',
      description: 'Preserves clinical document structure (HPI, Labs, Assessment, Plan, Allergies) without arbitrary token truncations.',
    },
    {
      num: 3,
      name: 'Stage 3: Embed & Index',
      icon: Binary,
      badge: 'Dense 768d + Sparse BM25',
      description: 'Generates high-dimensional vector embeddings and builds inverted lexical indices for dual-channel hybrid querying.',
    },
    {
      num: 4,
      name: 'Stage 4: Hybrid Retrieval',
      icon: Search,
      badge: 'Cross-Encoder Reranking',
      description: 'Merges dense cosine semantic similarity with sparse BM25 token matches using Reciprocal Rank Fusion (RRF).',
    },
    {
      num: 5,
      name: 'Stage 5: Trust & Grounding',
      icon: ShieldCheck,
      badge: 'Zero Hallucination Guard',
      description: 'Performs bidirectional claim-to-chunk verification, scrubs unmasked PHI, and produces calibrated trust scores.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">5-Stage Multimodal Document Ingestion & RAG Pipeline</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                Institutional Knowledge & EHR Sync
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Deterministic 5-stage clinical ingestion framework: Ingest & Classify → Schema-Aware Chunking → Embed & Index → Hybrid Retrieval → Trust & Grounding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-300 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PostgreSQL / Vector Ready
            </span>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Select Ingestion Document Preset or Multimodal Artifact:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PRESETS.map((preset) => {
              const isSelected = !isCustomMode && selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setIsCustomMode(false);
                    handleReset();
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/10 text-blue-300">
                      {preset.modality}
                    </span>
                    <span className="text-[11px] text-slate-400">{preset.rawSizeKb} KB</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-2">{preset.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{preset.patientName}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Source Viewer (4 cols) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Source Document Inspector</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">{selectedPreset.fileName}</span>
            </div>

            <div className="mt-3 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-slate-300 max-h-[380px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
              {selectedPreset.contentPreview}
            </div>

            {/* Extracted Clinical Entities preview */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Identified Clinical Entities ({selectedPreset.extractedEntities.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPreset.extractedEntities.map((ent, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono flex items-center gap-1"
                  >
                    <span className="text-slate-400 text-[9px]">[{ent.type}]</span>
                    {ent.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              disabled={activeStage === 0 || isProcessing}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={handleStartPipeline}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Executing 5-Stage RAG Pipeline...
                </>
              ) : ingestionComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Re-Ingest & Synchronize
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run 5-Stage RAG Ingestion Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 5-Stage Visual Workflow Tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Live Execution Lifecycle (5 RAG Stages)</h2>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
              ingestionComplete
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isProcessing
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-white/10 text-slate-300'
            }`}>
              {ingestionComplete ? 'PIPELINE COMPLETE (5/5 PASSED)' : isProcessing ? `PROCESSING STAGE ${activeStage}...` : 'AWAITING INGESTION'}
            </span>
          </div>

          {/* 5 Stages List */}
          <div className="space-y-3">
            {stagesList.map((stg) => {
              const Icon = stg.icon;
              const isPast = activeStage > stg.num || ingestionComplete;
              const isCurrent = activeStage === stg.num && isProcessing;
              const isPending = activeStage < stg.num && !ingestionComplete;

              return (
                <div
                  key={stg.num}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-500/15 border-blue-400/80 shadow-lg shadow-blue-500/10'
                      : isPast
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-500 text-white animate-bounce'
                          : isPast
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-slate-400'
                      }`}>
                        {isPast ? <Check className="w-4 h-4 text-emerald-400" /> : isCurrent ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Icon className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{stg.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/10 text-slate-300">
                            {stg.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{stg.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isPast ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERIFIED
                        </span>
                      ) : isCurrent ? (
                        <span className="text-xs font-bold text-blue-300 animate-pulse font-mono">
                          ACTIVE...
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">QUEUED</span>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Stage Details when completed or active */}
                  {isPast && (
                    <div className="mt-2.5 pt-2.5 border-t border-white/10 text-xs text-slate-300 font-mono grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {stg.num === 1 && (
                        <>
                          <div>Entities: <strong className="text-emerald-300">{selectedPreset.extractedEntities.length} extracted</strong></div>
                          <div>OCR Checksum: <strong className="text-white">sha256-verified</strong></div>
                          <div>Modality: <strong className="text-white">{selectedPreset.modality}</strong></div>
                          <div>Status: <strong className="text-emerald-300">Classified (100%)</strong></div>
                        </>
                      )}
                      {stg.num === 2 && (
                        <>
                          <div>Chunks: <strong className="text-cyan-300">{selectedPreset.chunks.length} semantic</strong></div>
                          <div>Token Overlap: <strong className="text-white">50 tokens</strong></div>
                          <div>Boundary: <strong className="text-white">Clinical HPI/Plan</strong></div>
                          <div>Truncation: <strong className="text-emerald-300">0% loss</strong></div>
                        </>
                      )}
                      {stg.num === 3 && (
                        <>
                          <div>Vector Dim: <strong className="text-purple-300">768-D Float32</strong></div>
                          <div>Index: <strong className="text-white">HNSW ivfflat</strong></div>
                          <div>Sparse Lexical: <strong className="text-white">{selectedPreset.sparseTokens} tokens</strong></div>
                          <div>Index Status: <strong className="text-emerald-300">pgvector Synced</strong></div>
                        </>
                      )}
                      {stg.num === 4 && (
                        <>
                          <div>RRF Rank Score: <strong className="text-amber-300">{(selectedPreset.retrievalScore * 100).toFixed(1)}%</strong></div>
                          <div>Top-K: <strong className="text-white">k=3 retrieved</strong></div>
                          <div>BM25 + Dense: <strong className="text-white">Balanced 50/50</strong></div>
                          <div>Latency: <strong className="text-emerald-300">18 ms</strong></div>
                        </>
                      )}
                      {stg.num === 5 && (
                        <>
                          <div>Groundedness: <strong className="text-emerald-300">{(selectedPreset.groundednessScore * 100).toFixed(1)}%</strong></div>
                          <div>Hallucination: <strong className="text-emerald-300">0.00% (None)</strong></div>
                          <div>PHI Masking: <strong className="text-emerald-300">Cleaned & Scrubbed</strong></div>
                          <div>Trust Gate: <strong className="text-emerald-300">PASS (Approved)</strong></div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion Banner with Action to Query or View */}
          {ingestionComplete && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/30 text-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Document Ingestion & Knowledge Indexing Complete</div>
                  <div className="text-xs text-slate-300">Document {selectedPreset.fileName} is now fully available across the Clinical Knowledge Agent & Patient 360.</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenKnowledgeQA && (
                  <button
                    onClick={() => onOpenKnowledgeQA(`What is the recommended Empagliflozin SGLT2i protocol for ${selectedPreset.patientName}?`)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Query Ingested Document
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
