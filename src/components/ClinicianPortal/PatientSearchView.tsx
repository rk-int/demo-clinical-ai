import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserCheck, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Building, 
  Calendar, 
  Filter, 
  ArrowRight, 
  Lock, 
  UserPlus, 
  FileText, 
  UploadCloud, 
  Layers, 
  Sparkles, 
  Cpu, 
  Eye, 
  Check, 
  Zap, 
  Activity, 
  FileCode, 
  Image as ImageIcon, 
  RotateCcw, 
  Shield, 
  Clock, 
  ChevronRight, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  FileUp, 
  Brain, 
  HardDrive,
  Users,
  X,
  Plus,
  LayoutGrid,
  List,
  Columns3,
  AlignLeft,
  AlertTriangle,
  Pill,
  ExternalLink,
  UserX,
  Trash2
} from 'lucide-react';
import { SyntheticPatient, UserProfile, PurposeOfUse, IngestionModality, MultimodalIngestionResult } from '../../types';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';
import { getPatientAvatarUrl } from '../../utils/patientAvatar';
import { VerticalPatientSearchFlowCanvas } from '../AgentOperations/VerticalPatientSearchFlowCanvas';
import { RegisterNewPatientModal } from './RegisterNewPatientModal';
import { ClinicalPatientDeletionModal } from './ClinicalPatientDeletionModal';

type DisplayMode = 'TILES' | 'LIST' | 'DETAILS' | 'CONTENT';

interface PatientSearchViewProps {
  currentUser: UserProfile;
  purposeOfUse: PurposeOfUse;
  patients?: SyntheticPatient[];
  onSelectPatient: (patientId: string) => void;
  onRegisterNewPatient?: (patient: SyntheticPatient) => void;
  onDeletePatient?: (patientId: string) => void;
}

export const PatientSearchView: React.FC<PatientSearchViewProps> = ({
  currentUser,
  purposeOfUse,
  patients,
  onSelectPatient,
  onRegisterNewPatient,
  onDeletePatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<'ALL' | 'MY_ASSIGNMENTS' | 'CARDIOLOGY' | 'TRANSFERS' | 'ALERTS'>('ALL');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('ALL');
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [deletingTargetPatient, setDeletingTargetPatient] = useState<SyntheticPatient | null>(null);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Display Mode switcher: TILES | LIST | DETAILS | CONTENT (Default LIST view mode)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('LIST');

  // 1 & 2) Search state management - records visible by default so patient list shows immediately
  const [hasExecutedSearch, setHasExecutedSearch] = useState<boolean>(true);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('All Cohort');
  
  // 3) Separate option to view all patient records
  const [isViewingAllPatients, setIsViewingAllPatients] = useState<boolean>(true);

  // 4) Newly registered patient state & box expansion
  const [recentlyRegisteredPatient, setRecentlyRegisteredPatient] = useState<SyntheticPatient | null>(null);
  const [isRegisteredBoxExpanded, setIsRegisteredBoxExpanded] = useState<boolean>(true);

  // 7) Modal Form State & Historical Records Radio Button
  const [newPatientName, setNewPatientName] = useState('Eleanor Vance');
  const [newPatientUprId, setNewPatientUprId] = useState('UPR-2026-NRH-992014');
  const [newPatientAge, setNewPatientAge] = useState(62);
  const [newPatientGender, setNewPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [newPatientHospital, setNewPatientHospital] = useState('North River Community Hospital (Cross-Facility)');
  const [newPatientCondition, setNewPatientCondition] = useState('Acute Exacerbation of Bronchiectasis with Hypoxemia');
  
  // Duplicate check override checkbox state
  const [overrideDuplicateWarning, setOverrideDuplicateWarning] = useState<boolean>(false);
  const [duplicateFormError, setDuplicateFormError] = useState<string | null>(null);

  // Historical Records Radio Button (YES / NO) - Default 'YES' as per clinical registration requirements
  const [hasHistoricalRecords, setHasHistoricalRecords] = useState<'YES' | 'NO'>('YES');
  const [selectedModality, setSelectedModality] = useState<IngestionModality>('TEXT_PDF');
  const [uploadedFilesList, setUploadedFilesList] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const [customUploadedFileName, setCustomUploadedFileName] = useState<string | null>(null);
  const [ingestionStage, setIngestionStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<MultimodalIngestionResult | null>(null);

  // Pre-configured Sample Clinical Documents for Ingestion Testing
  const sampleDocs = {
    TEXT_PDF: {
      fileName: 'Discharge_Summary_NorthRiver_Transfer.pdf',
      rawText: `CLINICAL DISCHARGE SUMMARY & TRANSFER RECORD
Patient: Eleanor Vance | DOB: 1964-05-18 | UPR: UPR-2026-NRH-992014
Source Facility: North River Community Hospital -> Transfer to Metro St. Jude
Attending: Dr. Gregory Ross, MD

CHIEF COMPLAINT & ADMISSION:
62 y/o female with chronic bronchiectasis presenting with 4-day history of productive mucopurulent sputum, pleuritic chest tightness, and dyspnea on minimal exertion (SpO2 89% room air).

HOSPITAL COURSE & INTERVENTIONS:
Initiated on supplemental O2 via nasal cannula (2L/min, SpO2 titrated to 93-95%). Started on IV Cefepime 2g q8h and inhaled hypertonic saline nebulizers. Patient demonstrated moderate improvement in sputum clearance. 

DISCHARGE / TRANSFER RECOMMENDATIONS:
1. Continue pulmonary toilet with positive expiratory pressure (PEP) therapy.
2. Complete 7-day course of oral levofloxacin 500mg daily upon transfer.
3. Repeat sputum culture and high-resolution CT follow-up at 4 weeks.`,
    },
    LAB_STRUCTURED: {
      fileName: 'Quest_Diagnostics_Comprehensive_Metabolic_Panel.json',
      rawText: `{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    { "code": "2160-0", "display": "Serum Creatinine", "value": 1.42, "unit": "mg/dL", "status": "ABNORMAL_HIGH", "refRange": "0.6-1.2" },
    { "code": "33914-3", "display": "eGFR (CKD-EPI)", "value": 44, "unit": "mL/min/1.73m2", "status": "ABNORMAL_LOW", "refRange": "> 60" },
    { "code": "2823-3", "display": "Potassium", "value": 4.6, "unit": "mmol/L", "status": "NORMAL", "refRange": "3.5-5.1" },
    { "code": "30934-4", "display": "NT-proBNP", "value": 680, "unit": "pg/mL", "status": "ABNORMAL_HIGH", "refRange": "< 125" }
  ]
}`,
    },
    IMAGING_VISION: {
      fileName: 'Chest_Radiograph_PA_Lateral_DICOM.png',
      rawText: `[VISION MODEL EXTRACTED RADIOGRAPHIC REPORT]
Modality: Digital Chest Radiography (PA & Lateral)
Finding Extractor: Gemini 3.7 Vision Engine
Image Checksum: sha256-img89201a4e

IMPRESSION & FINDINGS:
1. Bilateral lower lobe bronchial wall thickening and "tram-track" sign consistent with established bronchiectasis.
2. No focal lobar consolidation or acute tension pneumothorax.
3. Mild cardiomegaly noted with cardiothoracic ratio (CTR) ~ 0.54.
4. Minimal blunting of the left costophrenic angle suggesting trace reactive pleural effusion.`,
    }
  };

  const activePatientList = patients && patients.length > 0 ? patients : SYNTHETIC_PATIENTS;

  const assignedCount = activePatientList.filter(
    (patient) => (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
                 patient.assignedPhysicianId === currentUser.id
  ).length;

  // Search filter logic
  const filteredPatients = activePatientList.filter((patient) => {
    const query = searchTerm.trim().toLowerCase();

    if (selectedHospitalFilter !== 'ALL') {
      const matchesHospital = patient.hospitalSite.toLowerCase().includes(selectedHospitalFilter.toLowerCase());
      if (!matchesHospital) return false;
    }
    
    // If user searched, check if matches search term
    if (query) {
      const matchesSearch = 
        patient.fullName.toLowerCase().includes(query) ||
        patient.mrn.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        (patient.uprId && patient.uprId.toLowerCase().includes(query)) ||
        patient.hospitalSite.toLowerCase().includes(query) ||
        patient.conditions.some((c) => c.name.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    if (selectedSpecialtyFilter === 'MY_ASSIGNMENTS') {
      return (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
             patient.assignedPhysicianId === currentUser.id;
    }
    if (selectedSpecialtyFilter === 'CARDIOLOGY') {
      return patient.conditions.some((c) => c.name.toLowerCase().includes('heart') || c.name.toLowerCase().includes('cardio') || c.name.toLowerCase().includes('fibrillation'));
    }
    if (selectedSpecialtyFilter === 'TRANSFERS') {
      return patient.hospitalSite.toLowerCase().includes('north river') || patient.hospitalSite.toLowerCase().includes('general') || patient.hospitalSite.toLowerCase().includes('valley');
    }
    if (selectedSpecialtyFilter === 'ALERTS') {
      return patient.completenessAlerts.length > 0 || patient.consentStatus !== 'ACTIVE_CONSENT';
    }

    return true;
  });

  // Handle Search Execution
  const handleExecuteSearch = (queryOverride?: string) => {
    const query = queryOverride !== undefined ? queryOverride : searchTerm;
    if (query.trim().length === 0 && !isViewingAllPatients && selectedSpecialtyFilter === 'ALL') {
      // If empty search submitted without filter, show all in list format
      setIsViewingAllPatients(true);
      setDisplayMode('LIST');
    } else {
      setIsViewingAllPatients(false);
    }
    setHasExecutedSearch(true);
    setLastExecutedQuery(query);
  };

  // Toggle View All Patients
  const handleToggleViewAll = () => {
    setIsViewingAllPatients(true);
    setHasExecutedSearch(true);
    setSearchTerm('');
    setSelectedSpecialtyFilter('ALL');
    setLastExecutedQuery('All Cohort');
    setDisplayMode('LIST');
  };

  // Reset to initial empty search state
  const handleResetSearch = () => {
    setSearchTerm('');
    setHasExecutedSearch(false);
    setIsViewingAllPatients(false);
    setSelectedSpecialtyFilter('ALL');
    setLastExecutedQuery('');
    setExpandedPatientId(null);
  };

  // File Upload Handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles: Array<{ name: string; size: string; type: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
      newFiles.push({
        name: file.name,
        size: sizeKb,
        type: file.type || 'Clinical Document'
      });
    }
    setUploadedFilesList((prev) => [...prev, ...newFiles]);
    setCustomUploadedFileName(newFiles[0].name);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFilesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (uploadedFilesList.length <= 1) {
      setCustomUploadedFileName(null);
    }
  };

  const handleRunIngestionPipeline = () => {
    setIsProcessing(true);
    setIngestionStage(1);

    setTimeout(() => {
      setIngestionStage(2);
      setTimeout(() => {
        setIngestionStage(3);
        setTimeout(() => {
          setIngestionStage(4);
          setTimeout(() => {
            setIngestionStage(5);
            setIsProcessing(false);
            setIngestionResult({
              documentId: 'DOC-INGEST-' + Math.floor(1000 + Math.random() * 9000),
              fileName: customUploadedFileName || (uploadedFilesList[0]?.name) || sampleDocs[selectedModality].fileName,
              modality: selectedModality,
              rawSizeKb: 342,
              uploadedAt: new Date().toISOString(),
              patientId: 'PT-NEW-99',
              patientUprId: newPatientUprId,
              stage1Classification: {
                parserUsed: selectedModality === 'TEXT_PDF' ? 'OCR_CLINICAL_PARSER' : selectedModality === 'LAB_STRUCTURED' ? 'STRUCTURED_JSON_PARSER' : 'VISION_MODEL_EXTRACTOR',
                extractedTextSnippet: 'Patient presented with acute decompensation. Prescribed Empagliflozin 10mg PO Daily. Baseline eGFR 38 mL/min/1.73m2.',
                identifiedEntities: [
                  { type: 'CONDITION', text: 'Bronchiectasis with Acute Exacerbation', confidence: 0.98 },
                  { type: 'MEDICATION', text: 'Levofloxacin 500mg', confidence: 0.99 },
                  { type: 'LAB', text: 'eGFR 44 mL/min/1.73m2', confidence: 0.97 }
                ]
              },
              stage2Chunking: {
                chunkCount: 4,
                sections: ['Chief Complaint', 'Hospital Course', 'Interventions', 'Discharge Orders'],
                sampleChunk: 'Section [Hospital Course]: Initiated on supplemental O2 via nasal cannula (2L/min). Started IV Cefepime 2g q8h...'
              },
              stage3Embedding: {
                denseVectorModel: 'text-embedding-004 (768-dim)',
                sparseKeywordTokens: 148,
                vectorDimension: 768,
                indexedAt: new Date().toISOString()
              },
              stage4Retrieval: {
                rerankScore: 0.94,
                topKRetrieved: 3
              },
              stage5Grounding: {
                groundednessScore: 0.98,
                hallucinationRisk: 'NONE',
                phiMaskingVerified: true
              }
            });
          }, 350);
        }, 350);
      }, 350);
    }, 350);
  };

  // Real-time duplicate checking against the active patient registry
  const duplicateMatch = useMemo(() => {
    const trimmedName = newPatientName.trim().toLowerCase();
    const trimmedUpr = newPatientUprId.trim().toLowerCase();
    
    if (!trimmedName && !trimmedUpr) return null;

    // Check exact or partial UPR ID match (UPR or MRN collision)
    if (trimmedUpr) {
      const uprMatch = activePatientList.find(
        (p) => (p.uprId && p.uprId.trim().toLowerCase() === trimmedUpr) || 
               p.mrn.trim().toLowerCase() === trimmedUpr
      );
      if (uprMatch) {
        return { patient: uprMatch, matchType: 'UPR' as const };
      }
    }

    // Check Full Name match (case-insensitive)
    if (trimmedName && trimmedName.length >= 3) {
      const exactNameMatch = activePatientList.find(
        (p) => p.fullName.trim().toLowerCase() === trimmedName
      );
      if (exactNameMatch) {
        return { patient: exactNameMatch, matchType: 'NAME' as const };
      }

      // Check near/substring match
      const fuzzyMatch = activePatientList.find((p) => {
        const existingName = p.fullName.trim().toLowerCase();
        return existingName === trimmedName || 
               (trimmedName.length >= 6 && (existingName.includes(trimmedName) || trimmedName.includes(existingName)));
      });
      if (fuzzyMatch) {
        return { patient: fuzzyMatch, matchType: 'NAME' as const };
      }
    }

    return null;
  }, [newPatientName, newPatientUprId, activePatientList]);

  const handleSaveAndOpenPatient = () => {
    setDuplicateFormError(null);

    // Validation checks
    if (!newPatientName.trim()) {
      setDuplicateFormError('Please enter a valid Patient Full Name.');
      return;
    }

    if (duplicateMatch) {
      if (duplicateMatch.matchType === 'UPR') {
        setDuplicateFormError(`Cannot register: Unique Patient Record ID (${newPatientUprId}) is already assigned to registered patient "${duplicateMatch.patient.fullName}" (MRN: ${duplicateMatch.patient.mrn}). Please specify a distinct UPR.`);
        return;
      }
      if (duplicateMatch.matchType === 'NAME' && !overrideDuplicateWarning) {
        setDuplicateFormError(`Duplicate Patient Name Detected: A patient named "${duplicateMatch.patient.fullName}" already exists in the EHR (MRN: ${duplicateMatch.patient.mrn}, Facility: ${duplicateMatch.patient.hospitalSite}). Please review the existing record or check "Override Duplicate Guard" below to confirm this is a distinct individual.`);
        return;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `PT-${randomSuffix}`;
    const newMRN = `MRN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPatient: SyntheticPatient = {
      id: newId,
      mrn: newMRN,
      uprId: newPatientUprId || `UPR-2026-NRH-${randomSuffix}`,
      fullName: newPatientName,
      birthDate: '1964-05-18',
      age: Number(newPatientAge) || 62,
      gender: newPatientGender,
      assignedPhysicianId: currentUser.id,
      hospitalSite: newPatientHospital,
      roomBed: 'Inpatient Step-Down - Bed 304',
      consentStatus: 'ACTIVE_CONSENT',
      avatarUrl: getPatientAvatarUrl({
        id: newId,
        fullName: newPatientName,
        gender: newPatientGender,
        uprId: newPatientUprId
      }),
      provenance: {
        sourceSystem: hasHistoricalRecords === 'YES' ? 'Multimodal RAG Ingestion Bridge' : 'Direct Clinical Registration',
        ingestionTimestamp: new Date().toISOString(),
        recordedBy: currentUser.name,
        verificationStatus: 'VERIFIED',
        checksum: 'sha256-' + Math.random().toString(36).slice(2, 10),
      },
      completenessAlerts: [
        {
          id: `CA-${randomSuffix}`,
          field: 'Encounter.CrossHospitalTransfer',
          severity: 'INFO',
          message: hasHistoricalRecords === 'YES' 
            ? `Historical records (${uploadedFilesList.length > 0 ? uploadedFilesList.length + ' documents' : 'Discharge package'}) ingested via Multimodal RAG Bridge. UPR verified.`
            : 'New patient registered in PostgreSQL EHR store without legacy attachments.',
          detectedAt: new Date().toISOString()
        }
      ],
      conditions: [
        {
          id: `COND-${randomSuffix}`,
          code: 'J47.0',
          name: newPatientCondition,
          category: 'ACUTE',
          onsetDate: '2026-08-20',
          clinicalStatus: 'ACTIVE',
          severity: 'SEVERE',
        }
      ],
      medications: [
        {
          id: `MED-${randomSuffix}`,
          code: 'RX-99201',
          name: 'Levofloxacin',
          dosage: '500 mg',
          route: 'Oral',
          frequency: 'Daily for 7 days',
          status: 'ACTIVE',
          prescribedDate: '2026-08-26',
          prescribingProvider: currentUser.name,
          indications: 'Bronchiectasis acute infection coverage',
        }
      ],
      allergies: [],
      observations: [
        {
          id: `LAB-${randomSuffix}`,
          code: '33914-3',
          name: 'eGFR (CKD-EPI)',
          value: 44,
          unit: 'mL/min/1.73m2',
          referenceRange: '> 60 mL/min/1.73m2',
          status: 'ABNORMAL_LOW',
          effectiveDateTime: '2026-08-26T08:00:00Z',
          trend: [52, 48, 45, 44],
          provenance: {
            sourceSystem: 'Quest Structured Parser',
            ingestionTimestamp: new Date().toISOString(),
            recordedBy: 'Automated Analyzer',
            verificationStatus: 'VERIFIED',
            checksum: 'sha256-egfr44',
          }
        }
      ],
      encounters: [
        {
          id: `ENC-${randomSuffix}`,
          type: 'INPATIENT',
          admissionDate: '2026-08-26T09:00:00Z',
          department: 'Pulmonary Medicine / Transitional Unit',
          attendingPhysician: currentUser.name,
          chiefComplaint: 'Transfer from North River Community Hospital for specialized pulmonary bronchiectasis management',
          dischargeSummaryNote: hasHistoricalRecords === 'YES' ? 'Multimodal transfer package parsed into FHIR & Vector store.' : 'Initial inpatient admission record.'
        }
      ]
    };

    if (onRegisterNewPatient) {
      onRegisterNewPatient(newPatient);
    }
    
    // Save as recently registered to display prominent box on webpage
    setRecentlyRegisteredPatient(newPatient);
    setIsRegisteredBoxExpanded(true);
    setIsIngestionModalOpen(false);
    setOverrideDuplicateWarning(false);
    setDuplicateFormError(null);

    // Also display in search view
    setHasExecutedSearch(true);
    setLastExecutedQuery(newPatient.fullName);
  };

  // Determine whether to display patient records:
  // 1) User typed a search term OR
  // 2) User clicked Search / executed a filter OR
  // 3) User clicked "View All Patient Records"
  const shouldDisplayRecords = hasExecutedSearch || isViewingAllPatients || searchTerm.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Patient Search & Multi-Hospital Ingestion</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                UPR Federated Directory
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Search patients by <strong className="text-white">Name</strong>, MRN, Condition, or Unique Patient Record (<strong className="text-cyan-300">UPR ID</strong>). Ingest historical records via Multimodal RAG.
            </p>
          </div>

          {/* Action Buttons & Quick Stats */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 7) REGISTER NEW PATIENT BUTTON (Opens registration pop-up with historical records radio options) */}
            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>

            {/* 3) SEPARATE OPTION TO VIEW ALL PATIENT RECORDS */}
            <button
              onClick={handleToggleViewAll}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isViewingAllPatients
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="View all patient records in database (displays as list by default)"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>View all patient records ({activePatientList.length})</span>
            </button>

            <div className="bg-white/5 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-white/10 text-xs">
              <div className="text-slate-400">Assigned Cohort</div>
              <div className="text-sm font-bold text-teal-400">{assignedCount} Patients</div>
            </div>
          </div>
        </div>

        {/* Multi-Hospital Healthcare Network Selector */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Filter Patient Directory by Network Hospital Facility:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedHospitalFilter}
              onChange={(e) => setSelectedHospitalFilter(e.target.value)}
              className="bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">All Network Hospitals (Healthcare Network)</option>
              <option value="St. Jude">St. Jude Regional Medical Center (Epic EHR)</option>
              <option value="Metropolitan">Metropolitan General Hospital (Cerner EHR)</option>
              <option value="Mercy">Mercy Community Health System (MEDITECH EHR)</option>
              <option value="St. Luke">St. Luke Surgical & Cardiac Pavilion (Allscripts EHR)</option>
            </select>
          </div>
        </div>

        {/* Search Input Bar & Quick Filters */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setHasExecutedSearch(true);
                  setLastExecutedQuery(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteSearch();
              }}
              placeholder="Search by patient name (e.g. Elena Rostova, John Doe, Marcus), MRN, UPR ID, or Condition..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-24 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  if (!isViewingAllPatients) {
                    setHasExecutedSearch(false);
                  }
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => handleExecuteSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1"
            >
              <span>Search</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                setSelectedSpecialtyFilter('MY_ASSIGNMENTS');
                handleExecuteSearch();
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedSpecialtyFilter === 'MY_ASSIGNMENTS'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Assigned to Me ({assignedCount})
            </button>

            <button
              onClick={() => {
                setSelectedSpecialtyFilter('TRANSFERS');
                handleExecuteSearch('transfer');
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedSpecialtyFilter === 'TRANSFERS'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Cross-Hospital Transfers
            </button>

            <button
              onClick={() => {
                setSelectedSpecialtyFilter('CARDIOLOGY');
                handleExecuteSearch('cardio');
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialtyFilter === 'CARDIOLOGY'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              Cardiology
            </button>

            <button
              onClick={() => {
                setSelectedSpecialtyFilter('ALERTS');
                handleExecuteSearch('alert');
              }}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedSpecialtyFilter === 'ALERTS'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Alerts
            </button>
          </div>
        </div>

        {/* Active Search & Directory Status Indicator + Display Mode Switcher */}
        {shouldDisplayRecords && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-semibold">
                {isViewingAllPatients
                  ? `Displaying all ${filteredPatients.length} patient records in directory`
                  : `Search Results for "${lastExecutedQuery || searchTerm}": ${filteredPatients.length} record(s) found`}
              </span>
            </div>

            {/* Display Options Switcher: Tiles | List | Details | Content */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Layout:</span>
              <div className="bg-slate-950/80 p-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setDisplayMode('TILES')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    displayMode === 'TILES'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  title="Tiles view (Grid cards with photos)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Tiles</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('LIST')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    displayMode === 'LIST'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  title="List view (Tabular row format with photos)"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('DETAILS')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    displayMode === 'DETAILS'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  title="Details view (Wide comprehensive cards with vitals, labs & meds)"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('CONTENT')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    displayMode === 'CONTENT'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  title="Content view (Clinical narrative summary & encounter notes)"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Content</span>
                </button>
              </div>

              <button
                onClick={handleResetSearch}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer pl-1"
                title="Reset search to default state"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4) RECENTLY REGISTERED PATIENT HIGHLIGHT BOX (When clinician registers a new patient) */}
      {recentlyRegisteredPatient && (
        <div className="bg-gradient-to-br from-[#07170c] via-[#091f11] to-[#040d07] border-2 border-[#4ade80]/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(74,222,128,0.25)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3e22]">
            <div className="flex items-center gap-3">
              {/* Photo Avatar */}
              <div className="relative shrink-0">
                <img
                  src={getPatientAvatarUrl(recentlyRegisteredPatient)}
                  alt={recentlyRegisteredPatient.fullName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-[#4ade80]/60 shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white font-mono">
                    {recentlyRegisteredPatient.fullName}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40 font-bold">
                    POSTGRESQL & VECTOR STORE COMMITTED
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Record committed to <code className="text-cyan-300">public.fhir_patients</code>. SHA-256 Checksum verified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRegisteredBoxExpanded(!isRegisteredBoxExpanded)}
                className="px-3.5 py-1.5 rounded-xl bg-[#142817] hover:bg-[#1f3f24] border border-[#4ade80]/40 text-xs font-mono font-bold text-[#4ade80] flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#4ade80]/15"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRegisteredBoxExpanded ? 'Hide Live Flow' : '⚡ Inspect Live Vertical Flow'}</span>
                {isRegisteredBoxExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => onSelectPatient(recentlyRegisteredPatient.id)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <span>Open Patient 360</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#040a06] p-3.5 rounded-2xl border border-[#142817] text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">PATIENT NAME:</span>
              <span className="font-bold text-white text-sm">{recentlyRegisteredPatient.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">MRN & UPR:</span>
              <span className="text-cyan-300 font-bold">{recentlyRegisteredPatient.mrn}</span>
              <span className="text-slate-400 block text-[10px]">{recentlyRegisteredPatient.uprId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PRIMARY CONDITION:</span>
              <span className="text-amber-300 font-semibold truncate block">{recentlyRegisteredPatient.conditions[0]?.name || 'Standard Inpatient'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">FACILITY SOURCE:</span>
              <span className="text-slate-300 truncate block">{recentlyRegisteredPatient.hospitalSite}</span>
            </div>
          </div>

          {/* 5 & 6) Expandable Vertical Patient Data Agent Flow with Demo Rerun */}
          {isRegisteredBoxExpanded && (
            <div className="pt-2">
              <VerticalPatientSearchFlowCanvas
                patient={recentlyRegisteredPatient}
                currentUser={currentUser}
                purposeOfUse={purposeOfUse}
                autoPlayOnce={true}
                onSelectPatient={onSelectPatient}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1, 2, 3) PATIENT SEARCH RESULTS & DIRECTORY DISPLAY                       */}
      {/* ========================================================================= */}
      {shouldDisplayRecords ? (
        <>
          {filteredPatients.length === 0 ? (
            /* No Results Found State */
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Matching Patient Records Found</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  No patient matches the search query <span className="text-cyan-300 font-mono">"{searchTerm}"</span>. Try searching with a different name (e.g., "Elena", "John", "Jane", "Marcus") or browse the entire cohort.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleToggleViewAll}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  View all patient records ({activePatientList.length})
                </button>
                <button
                  onClick={handleResetSearch}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            /* 4 DISPLAY MODES: TILES | LIST | DETAILS | CONTENT WITH NON-DUPLICATE PHOTOS */
            <div className="space-y-4">
              {/* ------------------------------------------------------------- */}
              {/* DISPLAY MODE 1: TILES (GRID CARDS WITH PHOTO & LIVE FLOW)     */}
              {/* ------------------------------------------------------------- */}
              {displayMode === 'TILES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPatients.map((patient) => {
                    const isAssigned = (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
                                        patient.assignedPhysicianId === currentUser.id;
                    const hasExpiredConsent = patient.consentStatus === 'EXPIRED_CONSENT';
                    const avatarPhoto = getPatientAvatarUrl(patient);

                    return (
                      <div
                        key={patient.id}
                        className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-2xl ${
                          expandedPatientId === patient.id ? 'col-span-1 md:col-span-2 lg:col-span-3 border-emerald-500/50 bg-[#061209]/70 ring-1 ring-emerald-500/30' : ''
                        } ${
                          hasExpiredConsent
                            ? 'border-rose-500/40 bg-rose-950/10'
                            : isAssigned && expandedPatientId !== patient.id
                            ? 'border-blue-500/40 bg-blue-950/10'
                            : expandedPatientId !== patient.id ? 'border-white/10 hover:border-white/20' : ''
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Card Top: Patient Photo, Name, MRN & Consent Badge */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Sample Photo Profile Image (Unique Non-Duplicated Avatar) */}
                              <div className="relative shrink-0">
                                <img
                                  src={avatarPhoto}
                                  alt={patient.fullName}
                                  referrerPolicy="no-referrer"
                                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                                  loading="lazy"
                                />
                                <span 
                                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                                    patient.consentStatus === 'ACTIVE_CONSENT' ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                  title={patient.consentStatus === 'ACTIVE_CONSENT' ? 'Active Consent Verified' : 'Expired Consent'}
                                />
                              </div>

                              <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                  <span>{patient.fullName}</span>
                                  {isAssigned && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-normal">
                                      Assigned
                                    </span>
                                  )}
                                </h3>
                                <div className="text-xs font-mono text-cyan-300 flex items-center gap-2 mt-0.5">
                                  <span>{patient.mrn}</span>
                                  <span className="text-slate-500">•</span>
                                  <span>{patient.age}y {patient.gender}</span>
                                </div>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                patient.consentStatus === 'ACTIVE_CONSENT'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {patient.consentStatus === 'ACTIVE_CONSENT' ? 'Active' : 'Expired'}
                            </span>
                          </div>

                          {/* UPR ID Badge */}
                          {patient.uprId && (
                            <div className="p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                              <span className="text-slate-400 text-[10px]">UPR ID:</span>
                              <span className="font-bold">{patient.uprId}</span>
                            </div>
                          )}

                          {/* Hospital Facility */}
                          <div className="text-xs text-slate-300 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{patient.hospitalSite}</span>
                          </div>

                          {/* Active Conditions */}
                          <div className="space-y-1">
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Conditions:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {patient.conditions.map((cond) => (
                                <span
                                  key={cond.id}
                                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-200"
                                >
                                  {cond.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Completeness / Transfer Alert Banner */}
                          {patient.completenessAlerts.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="line-clamp-1">{patient.completenessAlerts[0].message}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Actions & Live Flow Option */}
                        <div className="pt-3 border-t border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {patient.medications.length} Meds • {patient.observations.length} Labs
                            </span>

                            <div className="flex items-center gap-2">
                              {/* Delete Patient Button for Admins */}
                              {(currentUser.role === 'PORTAL_ADMIN') && (
                                <button
                                  type="button"
                                  onClick={() => setDeletingTargetPatient(patient)}
                                  className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                  title="Delete Patient Record (Admin RBAC & MDT Approval)"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                </button>
                              )}

                              {/* Live Flow Option: Shows live agent flow in VERTICAL MODE */}
                              <button
                                onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                  expandedPatientId === patient.id
                                    ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/50 shadow-[0_0_12px_rgba(74,222,128,0.25)]'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                                }`}
                                title="Inspect Live Patient Data Agent Flow in Vertical Mode"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>{expandedPatientId === patient.id ? 'Hide Flow' : 'Live Flow'}</span>
                                {expandedPatientId === patient.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => onSelectPatient(patient.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  hasExpiredConsent
                                    ? 'bg-rose-600/80 hover:bg-rose-600 text-white'
                                    : isAssigned
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                                }`}
                              >
                                Open 360
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Vertical Live Flow Canvas for Respective Patient Record */}
                          {expandedPatientId === patient.id && (
                            <div className="pt-2 border-t border-white/10">
                              <VerticalPatientSearchFlowCanvas
                                patient={patient}
                                currentUser={currentUser}
                                purposeOfUse={purposeOfUse}
                                autoPlayOnce={true}
                                onSelectPatient={onSelectPatient}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DISPLAY MODE 2: LIST (TABULAR DENSE ROWS WITH PHOTO)          */}
              {/* ------------------------------------------------------------- */}
              {displayMode === 'LIST' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono text-slate-400 uppercase">
                          <th className="py-3 px-4">Patient Profile</th>
                          <th className="py-3 px-4">MRN / UPR ID</th>
                          <th className="py-3 px-4">Demographics</th>
                          <th className="py-3 px-4">Hospital Site</th>
                          <th className="py-3 px-4">Primary Condition</th>
                          <th className="py-3 px-4">Consent Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredPatients.map((patient) => {
                          const isAssigned = (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
                                              patient.assignedPhysicianId === currentUser.id;
                          const hasExpiredConsent = patient.consentStatus === 'EXPIRED_CONSENT';
                          const avatarPhoto = getPatientAvatarUrl(patient);

                          return (
                            <React.Fragment key={patient.id}>
                              <tr className={`hover:bg-white/5 transition-colors ${expandedPatientId === patient.id ? 'bg-[#061209]/80' : ''}`}>
                                {/* Patient Profile with Photo */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                      <img
                                        src={avatarPhoto}
                                        alt={patient.fullName}
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm"
                                        loading="lazy"
                                      />
                                      <span
                                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                                          patient.consentStatus === 'ACTIVE_CONSENT' ? 'bg-emerald-500' : 'bg-rose-500'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <div className="font-bold text-white flex items-center gap-1.5">
                                        <span>{patient.fullName}</span>
                                        {isAssigned && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                                            Assigned
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-slate-400 font-mono">{patient.id}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* MRN & UPR */}
                                <td className="py-3 px-4 font-mono text-cyan-300">
                                  <div className="font-bold">{patient.mrn}</div>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{patient.uprId || '—'}</div>
                                </td>

                                {/* Demographics */}
                                <td className="py-3 px-4 text-slate-300">
                                  <span>{patient.age} yrs</span>
                                  <span className="text-slate-500"> • </span>
                                  <span>{patient.gender}</span>
                                </td>

                                {/* Hospital Site */}
                                <td className="py-3 px-4 text-slate-300 max-w-[180px] truncate">
                                  {patient.hospitalSite}
                                </td>

                                {/* Primary Condition */}
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-amber-300 font-medium inline-block max-w-[190px] truncate">
                                    {patient.conditions[0]?.name || 'Routine Care'}
                                  </span>
                                </td>

                                {/* Consent */}
                                <td className="py-3 px-4">
                                  <span
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                      patient.consentStatus === 'ACTIVE_CONSENT'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    }`}
                                  >
                                    {patient.consentStatus === 'ACTIVE_CONSENT' ? 'Active' : 'Expired'}
                                  </span>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {(currentUser.role === 'PORTAL_ADMIN') && (
                                      <button
                                        type="button"
                                        onClick={() => setDeletingTargetPatient(patient)}
                                        className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                        title="Delete Patient Record"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                                      className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-all ${
                                        expandedPatientId === patient.id
                                          ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/50 shadow-[0_0_10px_rgba(74,222,128,0.25)]'
                                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                                      }`}
                                      title="Inspect Live Agent Flow"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                                      <span className="hidden sm:inline">Live Flow</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onSelectPatient(patient.id)}
                                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                                        hasExpiredConsent
                                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                                      }`}
                                    >
                                      <span>360</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* Expanded Live Flow Row */}
                              {expandedPatientId === patient.id && (
                                <tr className="bg-[#061209]/95 border-b border-emerald-500/30">
                                  <td colSpan={7} className="p-4 sm:p-6">
                                    <VerticalPatientSearchFlowCanvas
                                      patient={patient}
                                      currentUser={currentUser}
                                      purposeOfUse={purposeOfUse}
                                      autoPlayOnce={true}
                                      onSelectPatient={onSelectPatient}
                                    />
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DISPLAY MODE 3: DETAILS (COMPREHENSIVE MULTI-COLUMN WIDE CARDS)*/}
              {/* ------------------------------------------------------------- */}
              {displayMode === 'DETAILS' && (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => {
                    const isAssigned = (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
                                        patient.assignedPhysicianId === currentUser.id;
                    const hasExpiredConsent = patient.consentStatus === 'EXPIRED_CONSENT';
                    const avatarPhoto = getPatientAvatarUrl(patient);

                    return (
                      <div
                        key={patient.id}
                        className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-2xl ${
                          expandedPatientId === patient.id ? 'border-emerald-500/50 bg-[#061209]/80 ring-1 ring-emerald-500/30' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                          {/* Left Column: Photo & Demographic Profile (4 cols) */}
                          <div className="lg:col-span-4 flex items-start gap-4">
                            <div className="relative shrink-0">
                              <img
                                src={avatarPhoto}
                                alt={patient.fullName}
                                referrerPolicy="no-referrer"
                                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                                loading="lazy"
                              />
                              <span
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                                  patient.consentStatus === 'ACTIVE_CONSENT' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                title={patient.consentStatus === 'ACTIVE_CONSENT' ? 'Active Consent Verified' : 'Expired Consent'}
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-bold text-white">{patient.fullName}</h3>
                                {isAssigned && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                                    Assigned
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-mono text-cyan-300">
                                MRN: {patient.mrn} • {patient.age}y {patient.gender}
                              </div>
                              {patient.uprId && (
                                <div className="text-[11px] font-mono text-slate-400">
                                  UPR: <span className="text-slate-300">{patient.uprId}</span>
                                </div>
                              )}
                              <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{patient.hospitalSite}</span>
                              </div>
                            </div>
                          </div>

                          {/* Middle Column: Clinical Diagnoses & Active Medications (5 cols) */}
                          <div className="lg:col-span-5 space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                            <div>
                              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                                Diagnoses & Conditions:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {patient.conditions.map((c) => (
                                  <span
                                    key={c.id}
                                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                                  >
                                    <strong className="text-cyan-300 font-mono mr-1">{c.code}</strong>
                                    {c.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Pill className="w-3 h-3 text-emerald-400" />
                                <span>Active Medications ({patient.medications.length}):</span>
                              </div>
                              <div className="text-xs text-slate-300 font-mono space-y-0.5">
                                {patient.medications.slice(0, 2).map((med) => (
                                  <div key={med.id} className="truncate">
                                    • <span className="text-emerald-300 font-semibold">{med.name}</span> {med.dosage} ({med.frequency})
                                  </div>
                                ))}
                                {patient.medications.length > 2 && (
                                  <div className="text-[10px] text-slate-400">+{patient.medications.length - 2} more medications in record</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Labs / Alerts & Actions (3 cols) */}
                          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-3">
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                Latest Observations:
                              </div>
                              {patient.observations.length > 0 ? (
                                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono">
                                  <div className="text-slate-400 text-[10px]">{patient.observations[0].name}</div>
                                  <div className="text-base font-bold text-cyan-300">
                                    {patient.observations[0].value} <span className="text-xs text-slate-400">{patient.observations[0].unit}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-400 font-mono">Standard metabolic profile</div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              {(currentUser.role === 'PORTAL_ADMIN') && (
                                <button
                                  type="button"
                                  onClick={() => setDeletingTargetPatient(patient)}
                                  className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                  title="Delete Patient Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                                className={`flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                                  expandedPatientId === patient.id
                                    ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/50'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                                }`}
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>{expandedPatientId === patient.id ? 'Hide Flow' : 'Live Flow'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onSelectPatient(patient.id)}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-blue-600/30"
                              >
                                <span>Open 360</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Live Flow */}
                        {expandedPatientId === patient.id && (
                          <div className="pt-4 border-t border-white/10">
                            <VerticalPatientSearchFlowCanvas
                              patient={patient}
                              currentUser={currentUser}
                              purposeOfUse={purposeOfUse}
                              autoPlayOnce={true}
                              onSelectPatient={onSelectPatient}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* DISPLAY MODE 4: CONTENT (CLINICAL NARRATIVE SUMMARY FORMAT)   */}
              {/* ------------------------------------------------------------- */}
              {displayMode === 'CONTENT' && (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => {
                    const isAssigned = (currentUser.assignedPatientIds && currentUser.assignedPatientIds.includes(patient.id)) ||
                                        patient.assignedPhysicianId === currentUser.id;
                    const hasExpiredConsent = patient.consentStatus === 'EXPIRED_CONSENT';
                    const avatarPhoto = getPatientAvatarUrl(patient);
                    const latestEncounter = patient.encounters && patient.encounters.length > 0 ? patient.encounters[0] : null;

                    return (
                      <div
                        key={patient.id}
                        className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-2xl ${
                          expandedPatientId === patient.id ? 'border-emerald-500/50 bg-[#061209]/80 ring-1 ring-emerald-500/30' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Narrative Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarPhoto}
                              alt={patient.fullName}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md"
                              loading="lazy"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white">{patient.fullName}</h3>
                                <span className="text-xs font-mono text-cyan-300">({patient.mrn})</span>
                                {isAssigned && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                                    Assigned
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {patient.age}y {patient.gender} • {patient.hospitalSite} • Room/Bed: {patient.roomBed || 'General Inpatient'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {(currentUser.role === 'PORTAL_ADMIN') && (
                              <button
                                type="button"
                                onClick={() => setDeletingTargetPatient(patient)}
                                className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                title="Delete Patient Record"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                expandedPatientId === patient.id
                                  ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/50'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span>{expandedPatientId === patient.id ? 'Hide Flow' : 'Live Flow'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onSelectPatient(patient.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-blue-600/30"
                            >
                              <span>Open Patient 360</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Clinical Narrative Content Body */}
                        <div className="space-y-3">
                          {latestEncounter && (
                            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-cyan-300 font-bold uppercase tracking-wide">
                                  Latest Encounter ({latestEncounter.type} - {latestEncounter.department})
                                </span>
                                <span className="text-slate-400 text-[11px]">Attending: {latestEncounter.attendingPhysician}</span>
                              </div>
                              <div className="text-xs text-slate-200 leading-relaxed font-sans">
                                <strong className="text-slate-400">Chief Complaint: </strong>
                                {latestEncounter.chiefComplaint}
                              </div>
                              {latestEncounter.dischargeSummaryNote && (
                                <div className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/5">
                                  "{latestEncounter.dischargeSummaryNote}"
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 items-center text-xs">
                            <span className="text-slate-400 text-[11px] font-mono uppercase">Diagnoses:</span>
                            {patient.conditions.map((cond) => (
                              <span key={cond.id} className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-200">
                                {cond.name} <span className="text-slate-400 font-mono text-[10px]">({cond.code})</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Expanded Live Flow */}
                        {expandedPatientId === patient.id && (
                          <div className="pt-4 border-t border-white/10">
                            <VerticalPatientSearchFlowCanvas
                              patient={patient}
                              currentUser={currentUser}
                              purposeOfUse={purposeOfUse}
                              autoPlayOnce={true}
                              onSelectPatient={onSelectPatient}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* 1) DEFAULT STATE: When user hasn't searched yet, show clean search callout rather than all patient records */
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Search Patient Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Patient records are protected under Zero-Trust clinical governance. Enter a patient name, MRN, condition, or UPR ID to retrieve records, or browse the complete cohort directory.
            </p>
          </div>

          {/* Quick Search Suggestions */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Quick Search Queries:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { name: 'Elena Rostova', query: 'Elena' },
                { name: 'John Doe', query: 'John' },
                { name: 'Jane Smith', query: 'Jane' },
                { name: 'Marcus Vance', query: 'Marcus' },
                { name: 'Robert Brown', query: 'Robert' },
                { name: 'Heart Failure', query: 'Heart' },
                { name: 'North River Transfer', query: 'North River' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setSearchTerm(item.query);
                    handleExecuteSearch(item.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 hover:text-white transition-all cursor-pointer hover:border-blue-400/50 flex items-center gap-1.5"
                >
                  <Search className="w-3 h-3 text-blue-400" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3) Distinct Button to View All Patients */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleToggleViewAll}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <Users className="w-4 h-4" />
              <span>View All Patient Records ({activePatientList.length})</span>
            </button>

            <button
              onClick={() => setIsIngestionModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Register New Patient</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7) NEW PATIENT REGISTRATION POPUP MODAL WITH HISTORICAL RECORDS & DUPLICATE CHECK */}
      {/* ========================================================================= */}
      <RegisterNewPatientModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        currentUser={currentUser}
        patients={patients}
        onPatientRegistered={(newPatient) => {
          if (onRegisterNewPatient) {
            onRegisterNewPatient(newPatient);
          }
          setRecentlyRegisteredPatient(newPatient);
          setIsRegisteredBoxExpanded(true);
          onSelectPatient(newPatient.id);
          setIsIngestionModalOpen(false);
        }}
        onSelectExistingPatient={(patientId) => {
          onSelectPatient(patientId);
          setIsIngestionModalOpen(false);
        }}
        isDark={true}
      />

      {/* Patient Record Deletion & Approval Modal */}
      <ClinicalPatientDeletionModal
        isOpen={!!deletingTargetPatient}
        onClose={() => setDeletingTargetPatient(null)}
        patient={deletingTargetPatient}
        currentUser={currentUser}
        onConfirmDelete={(patientId) => {
          if (onDeletePatient) {
            onDeletePatient(patientId);
          }
          setDeletingTargetPatient(null);
        }}
      />
    </div>
  );
};

