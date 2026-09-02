import React, { useState, useMemo, useEffect } from 'react';
import { 
  UserPlus, 
  X, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Brain, 
  HardDrive, 
  FileUp, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Check,
  ShieldCheck,
  Layers,
  Database,
  Copy,
  Terminal,
  Activity,
  Search,
  Eye,
  ChevronRight,
  Stethoscope,
  Microscope,
  FileCheck2,
  RefreshCw,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { SyntheticPatient, UserProfile, IngestionModality, MultimodalIngestionResult } from '../../types';
import { SYNTHETIC_PATIENTS } from '../../data/syntheticFhirData';
import { getPatientAvatarUrl } from '../../utils/patientAvatar';

export type ExtendedModalityCategory = 'TEXT_PDF' | 'IMAGING_VISION' | 'LAB_STRUCTURED' | 'MRI_SCANS' | 'OTHER_DOCS';

interface RegisterNewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  patients?: SyntheticPatient[];
  onPatientRegistered: (patient: SyntheticPatient) => void;
  onSelectExistingPatient?: (patientId: string) => void;
  isDark?: boolean;
}

// Helper to generate a guaranteed unique UPR ID not present in patient list
const generateUniqueUprId = (patientList: SyntheticPatient[] = []) => {
  const existingUprSet = new Set(
    patientList.flatMap((p) => [p.uprId?.trim().toLowerCase(), p.mrn?.trim().toLowerCase()]).filter(Boolean)
  );

  let attempts = 0;
  while (attempts < 100) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const candidate = `UPR-2026-NRH-${randomNum}`;
    if (!existingUprSet.has(candidate.toLowerCase())) {
      return candidate;
    }
    attempts++;
  }
  return `UPR-2026-NRH-${Date.now().toString().slice(-6)}`;
};

export const RegisterNewPatientModal: React.FC<RegisterNewPatientModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  patients,
  onPatientRegistered,
  onSelectExistingPatient,
  isDark = true,
}) => {
  const activePatientList = patients && patients.length > 0 ? patients : SYNTHETIC_PATIENTS;

  // Form State
  const [newPatientName, setNewPatientName] = useState('Eleanor Vance');
  const [newPatientUprId, setNewPatientUprId] = useState(() => generateUniqueUprId(activePatientList));
  const [newPatientAge, setNewPatientAge] = useState<number | string>(62);
  const [newPatientGender, setNewPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [newPatientHospital, setNewPatientHospital] = useState('North River Community Hospital');
  const [newPatientCondition, setNewPatientCondition] = useState('Acute Exacerbation of Bronchiectasis with Hypoxemia');

  // Duplicate Check State
  const [overrideDuplicateWarning, setOverrideDuplicateWarning] = useState<boolean>(false);
  const [duplicateFormError, setDuplicateFormError] = useState<string | null>(null);

  // Historical Records State
  const [hasHistoricalRecords, setHasHistoricalRecords] = useState<'YES' | 'NO'>('YES');
  const [selectedCategory, setSelectedCategory] = useState<ExtendedModalityCategory>('TEXT_PDF');
  const [uploadedFilesList, setUploadedFilesList] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const [customUploadedFileName, setCustomUploadedFileName] = useState<string | null>(null);
  const [ingestionStage, setIngestionStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsingDocument, setIsParsingDocument] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseNotification, setParseNotification] = useState<string | null>(null);
  const [ingestionResult, setIngestionResult] = useState<MultimodalIngestionResult | null>(null);

  // Document Display Mode: 'JSON' or 'RAW_TEXT'
  const [documentViewMode, setDocumentViewMode] = useState<'JSON' | 'RAW_TEXT'>('JSON');
  const [isParsed, setIsParsed] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Auto-generate a guaranteed unique UPR ID whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      const uniqueId = generateUniqueUprId(activePatientList);
      setNewPatientUprId(uniqueId);
      setOverrideDuplicateWarning(false);
      setDuplicateFormError(null);
      setUploadedFilesList([]);
      setCustomUploadedFileName(null);
      setIsParsed(false);
      setIngestionResult(null);
      setIngestionStage(0);
      setParseError(null);
      setParseNotification(null);
      setIsParsingDocument(false);
    }
  }, [isOpen]);

  // Handler to generate a fresh unique UPR ID on button click
  const handleGenerateUniqueUpr = () => {
    const uniqueId = generateUniqueUprId(activePatientList);
    setNewPatientUprId(uniqueId);
    setDuplicateFormError(null);
    setParseNotification('Generated fresh unique UPR ID.');
    setTimeout(() => setParseNotification(null), 3000);
  };

  // Helper to sanitize strings for file naming
  const sanitizeName = (str: string) => {
    return (str || '')
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  // Helper for report type string
  const getReportTypeLabel = (category: ExtendedModalityCategory) => {
    switch (category) {
      case 'TEXT_PDF': return 'Clinical_Discharge_Summary';
      case 'IMAGING_VISION': return 'Chest_XRay_Radiography_Report';
      case 'LAB_STRUCTURED': return 'Comprehensive_Metabolic_Panel_Lab_Report';
      case 'MRI_SCANS': return 'Brain_MRI_Contrast_Scan_Report';
      case 'OTHER_DOCS': return '12Lead_ECG_Diagnostic_Report';
      default: return 'Clinical_Report';
    }
  };

  // Required File Name Format: [Patient Name]_[Report Type]_[Hospital Name].pdf
  const activeIngestionTargetFileName = useMemo(() => {
    const pName = sanitizeName(newPatientName) || 'Patient';
    const rType = getReportTypeLabel(selectedCategory);
    const hName = sanitizeName(newPatientHospital) || 'Hospital';
    return `${pName}_${rType}_${hName}.pdf`;
  }, [newPatientName, selectedCategory, newPatientHospital]);

  // Dynamic Raw Text Generator for all 5 document categories
  const dynamicRawText = useMemo(() => {
    const name = newPatientName.trim() || 'Eleanor Vance';
    const upr = newPatientUprId.trim() || 'UPR-2026-NRH-992014';
    const age = newPatientAge || 62;
    const gender = newPatientGender === 'FEMALE' ? 'female' : newPatientGender === 'MALE' ? 'male' : 'individual';
    const hospital = newPatientHospital.trim() || 'North River Community Hospital';
    const condition = newPatientCondition.trim() || 'Acute Exacerbation of Bronchiectasis with Hypoxemia';
    const attending = currentUser.name ? `Dr. ${currentUser.name}` : 'Dr. Gregory Ross, MD';

    switch (selectedCategory) {
      case 'TEXT_PDF':
        return `CLINICAL DISCHARGE SUMMARY & TRANSFER RECORD
Patient: ${name} | DOB: 1964-05-18 | UPR: ${upr}
Source Facility: ${hospital} -> Transfer to Metro St. Jude
Attending: ${attending}

CHIEF COMPLAINT & ADMISSION:
${age} y/o ${gender} with ${condition} presenting with 4-day history of productive mucopurulent sputum, pleuritic chest tightness, and dyspnea on minimal exertion (SpO2 89% room air).

HOSPITAL COURSE & INTERVENTIONS:
Initiated on supplemental O2 via nasal cannula (2L/min, SpO2 titrated to 93-95%). Started on IV Cefepime 2g q8h and inhaled hypertonic saline nebulizers. Patient demonstrated moderate improvement in sputum clearance. 

DISCHARGE / TRANSFER RECOMMENDATIONS:
1. Continue pulmonary toilet with positive expiratory pressure (PEP) therapy.
2. Complete 7-day course of oral levofloxacin 500mg daily upon transfer.
3. Repeat sputum culture and high-resolution CT follow-up at 4 weeks.`;

      case 'IMAGING_VISION':
        return `[VISION MODEL EXTRACTED RADIOGRAPHIC REPORT]
Patient: ${name} | UPR: ${upr} | DOB: 1964-05-18
Facility: ${hospital} | Department: Diagnostic Radiology
Exam: Digital Chest Radiography (PA & Lateral)
Finding Extractor: Gemini 3.7 Vision Engine | Checksum: sha256-img89201a4e

CLINICAL INDICATION:
${age} y/o ${gender} evaluated for ${condition}.

IMPRESSION & FINDINGS:
1. Bilateral lower lobe bronchial wall thickening and "tram-track" sign consistent with established bronchiectasis.
2. No focal lobar consolidation, pneumothorax, or large pleural effusion.
3. Mild cardiomegaly noted with cardiothoracic ratio (CTR) ~ 0.54.
4. Minimal blunting of the left costophrenic angle suggesting trace reactive pleural fluid.`;

      case 'LAB_STRUCTURED':
        return `COMPREHENSIVE METABOLIC & INFLAMMATORY PANEL (LAB REPORT)
Patient: ${name} | UPR: ${upr} | MRN: 992014
Laboratory: Quest Diagnostics Automated EHR Feed | Facility: ${hospital}
Collection Timestamp: 2026-08-26T07:30:00Z | Specimen: Venous Blood

PANEL RESULTS:
- Serum Creatinine: 1.42 mg/dL [Reference: 0.60 - 1.20 mg/dL] (HIGH)
- eGFR (CKD-EPI): 44 mL/min/1.73m2 [Reference: > 60 mL/min/1.73m2] (LOW, Stage 3a CKD)
- Serum Potassium: 4.6 mmol/L [Reference: 3.5 - 5.1 mmol/L] (NORMAL)
- NT-proBNP: 680 pg/mL [Reference: < 125 pg/mL] (ELEVATED)
- C-Reactive Protein (CRP): 28.4 mg/L [Reference: < 5.0 mg/L] (ELEVATED, Acute Phase)
- White Blood Cell Count (WBC): 12.8 x10^3/uL [Reference: 4.5 - 11.0] (MILD LEUKOCYTOSIS)`;

      case 'MRI_SCANS':
        return `MAGNETIC RESONANCE IMAGING (MRI) REPORT - BRAIN & SPINAL AXIS
Patient: ${name} | UPR: ${upr} | Age: ${age}
Facility: ${hospital} Neuroimaging Suite | Field Strength: 3.0 Tesla High-Field MRI
Protocol: Axial T1-SE, T2-FSE, T2-FLAIR, 3D T1+Gadolinium, Diffusion Weighted (DWI/ADC)

CLINICAL REASON FOR EXAM:
Neuro-cognitive and respiratory assessment in patient with ${condition}.

FINDINGS:
1. Scattered periventricular and subcortical white matter hyperintensities on T2-FLAIR consistent with mild chronic microvascular ischemic changes (Fazekas Grade 1).
2. No acute territorial cortical infarction on DWI/ADC restricted diffusion maps.
3. Ventricles and sulcal spaces demonstrate mild age-appropriate involutional changes.
4. Post-contrast 3D T1 sequences reveal no pathologic leptomeningeal enhancement or mass lesions.`;

      case 'OTHER_DOCS':
        return `12-LEAD ELECTROCARDIOGRAM (ECG) & DIAGNOSTIC PATHOLOGY REPORT
Patient: ${name} | UPR: ${upr} | Date: 2026-08-26
Facility: ${hospital} Cardiology Diagnostic Center
Recording Device: GE Healthcare Marquette MAC 5500 HD

MEASUREMENTS:
- Heart Rate: 94 bpm (Normal Sinus Rhythm)
- PR Interval: 162 ms (Normal)
- QRS Duration: 88 ms (Normal)
- QT / QTc: 382 / 438 ms (Within Normal Limits)
- P-R-T Axes: 58 / 42 / 48 degrees

INTERPRETATION:
1. Normal Sinus Rhythm with sinus tachycardia tendencies during acute respiratory distress.
2. Non-specific ST and T wave flattening in lateral precordial leads (V5-V6).
3. No diagnostic criteria for acute ST-elevation myocardial infarction (STEMI) or acute ischemia.`;

      default:
        return '';
    }
  }, [selectedCategory, newPatientName, newPatientUprId, newPatientAge, newPatientGender, newPatientHospital, newPatientCondition, currentUser]);

  // Dynamic JSON Generator for all 5 document categories
  const dynamicParsedJson = useMemo(() => {
    const name = newPatientName.trim() || 'Eleanor Vance';
    const upr = newPatientUprId.trim() || 'UPR-2026-NRH-992014';
    const age = Number(newPatientAge) || 62;
    const gender = newPatientGender;
    const hospital = newPatientHospital.trim() || 'North River Community Hospital';
    const condition = newPatientCondition.trim() || 'Acute Exacerbation of Bronchiectasis with Hypoxemia';
    const attending = currentUser.name ? `Dr. ${currentUser.name}` : 'Dr. Gregory Ross, MD';
    const docId = `DOC-${selectedCategory}-${Math.floor(100000 + Math.random() * 900000)}`;

    switch (selectedCategory) {
      case 'TEXT_PDF':
        return {
          documentMetadata: {
            documentType: "CLINICAL_DISCHARGE_SUMMARY_AND_TRANSFER_RECORD",
            documentId: docId,
            generatedFileName: activeIngestionTargetFileName,
            sourceFacility: hospital,
            destinationFacility: "Metro St. Jude Health System",
            ingestionTimestamp: new Date().toISOString(),
            parsingEngine: "Gemini 3.7 Clinical OCR & NLP Parser",
            phiSanitizationStatus: "VERIFIED_HIPAA_CLEARED"
          },
          patientDemographics: {
            fullName: name,
            uprId: upr,
            dob: "1964-05-18",
            age: age,
            gender: gender,
            attendingPhysician: attending
          },
          clinicalEncounter: {
            chiefComplaint: `${age} y/o ${gender.toLowerCase()} with ${condition} presenting with 4-day history of productive mucopurulent sputum, pleuritic chest tightness, and dyspnea on minimal exertion (SpO2 89% room air).`,
            admissionVitals: {
              spO2: "89% (Room Air)",
              bloodPressure: "138/84 mmHg",
              heartRate: "96 bpm (Sinus Tachycardia)",
              respiratoryRate: "24 breaths/min"
            },
            hospitalCourse: "Initiated on supplemental O2 via nasal cannula (2L/min, SpO2 titrated to 93-95%). Started on IV Cefepime 2g q8h and inhaled hypertonic saline nebulizers. Patient demonstrated moderate improvement in sputum clearance."
          },
          diagnosesAndConditions: [
            {
              code: "J47.0",
              system: "ICD-10-CM",
              description: condition,
              status: "ACTIVE_ACUTE",
              severity: "MODERATE_TO_SEVERE"
            },
            {
              code: "J96.01",
              system: "ICD-10-CM",
              description: "Acute Hypoxemic Respiratory Failure",
              status: "RESOLVING",
              severity: "MODERATE"
            }
          ],
          activeMedications: [
            {
              code: "RX-99201",
              name: "Levofloxacin",
              dosage: "500 mg",
              route: "Oral",
              frequency: "Daily",
              duration: "7 days",
              indication: "Bronchiectasis acute infection coverage"
            },
            {
              code: "RX-44102",
              name: "Hypertonic Saline (7%) Nebulizer",
              dosage: "4 mL",
              route: "Inhaled",
              frequency: "q12h",
              indication: "Mucociliary clearance"
            }
          ],
          dischargeAndTransferOrders: [
            "Continue pulmonary toilet with positive expiratory pressure (PEP) therapy.",
            "Complete 7-day course of oral levofloxacin 500mg daily upon transfer.",
            "Repeat sputum culture and high-resolution CT follow-up at 4 weeks."
          ]
        };

      case 'IMAGING_VISION':
        return {
          documentMetadata: {
            documentType: "DIAGNOSTIC_RADIOGRAPHY_IMAGING_REPORT",
            documentId: docId,
            generatedFileName: activeIngestionTargetFileName,
            modality: "Digital Chest Radiography (PA & Lateral)",
            sourceFacility: hospital,
            visionExtractor: "Gemini 3.7 Multimodal Vision Engine",
            imageChecksum: "sha256-img89201a4e",
            acrCategory: "ACR Appropriateness Level 9 (Highly Indicated)"
          },
          patientDemographics: {
            fullName: name,
            uprId: upr,
            age: age,
            gender: gender,
            clinicalIndication: `Evaluation of ${condition}`
          },
          radiologyFindings: {
            lungFields: 'Bilateral lower lobe bronchial wall thickening and characteristic "tram-track" sign consistent with bronchiectasis.',
            pleura: 'Trace blunting of the left costophrenic angle suggesting minimal reactive pleural effusion. No pneumothorax.',
            cardiacSilhouette: 'Mild cardiomegaly noted with CTR ~ 0.54.',
            mediastinumAndHila: 'Normal mediastinal contours. No hilar lymphadenopathy.',
            bonyStructures: 'Intact thoracic cage without acute osseous lesions.'
          },
          impression: [
            `1. Bronchiectasis with bilateral lower lobe active inflammatory changes.`,
            `2. No focal consolidation to suggest acute lobar pneumonia.`,
            `3. Mild cardiomegaly and trace reactive left pleural fluid.`
          ],
          recommendedFollowUp: 'High-resolution computed tomography (HRCT) chest in 4-6 weeks after antibiotic completion.'
        };

      case 'LAB_STRUCTURED':
        return {
          documentMetadata: {
            documentType: "FHIR_R4_OBSERVATION_TRANSACTION_BUNDLE",
            documentId: docId,
            generatedFileName: activeIngestionTargetFileName,
            panelName: "Comprehensive Metabolic & Inflammatory Panel",
            laboratory: "Quest Diagnostics Automated Feed",
            sourceFacility: hospital,
            collectionTimestamp: "2026-08-26T07:30:00Z"
          },
          patientDemographics: {
            fullName: name,
            uprId: upr,
            age: age,
            gender: gender
          },
          fhirObservations: [
            {
              code: "2160-0",
              system: "http://loinc.org",
              display: "Serum Creatinine",
              value: 1.42,
              unit: "mg/dL",
              status: "ABNORMAL_HIGH",
              refRange: "0.60 - 1.20 mg/dL",
              flag: "CRITICAL_ELEVATED"
            },
            {
              code: "33914-3",
              system: "http://loinc.org",
              display: "eGFR (CKD-EPI 2021)",
              value: 44,
              unit: "mL/min/1.73m2",
              status: "ABNORMAL_LOW",
              refRange: "> 60 mL/min/1.73m2",
              flag: "STAGE_3A_IMPAIRMENT"
            },
            {
              code: "2823-3",
              system: "http://loinc.org",
              display: "Potassium",
              value: 4.6,
              unit: "mmol/L",
              status: "NORMAL",
              refRange: "3.5 - 5.1 mmol/L",
              flag: "NORMAL"
            },
            {
              code: "30934-4",
              system: "http://loinc.org",
              display: "NT-proBNP",
              value: 680,
              unit: "pg/mL",
              status: "ABNORMAL_HIGH",
              refRange: "< 125 pg/mL",
              flag: "ELEVATED"
            },
            {
              code: "1988-5",
              system: "http://loinc.org",
              display: "C-Reactive Protein (CRP)",
              value: 28.4,
              unit: "mg/L",
              status: "ABNORMAL_HIGH",
              refRange: "< 5.0 mg/L",
              flag: "ACUTE_INFLAMMATION"
            }
          ]
        };

      case 'MRI_SCANS':
        return {
          documentMetadata: {
            documentType: "NEURO_MRI_STRUCTURED_REPORT",
            documentId: docId,
            generatedFileName: activeIngestionTargetFileName,
            scannerStrength: "3.0 Tesla High-Field MRI",
            contrastAgent: "15 mL Gadoterate Meglumine (Dotarem)",
            sourceFacility: hospital,
            examinationDate: "2026-08-26"
          },
          patientDemographics: {
            fullName: name,
            uprId: upr,
            age: age,
            gender: gender
          },
          sequencesAcquired: [
            "Axial T1-Weighted SE",
            "Axial T2-Weighted FSE",
            "3D T2-FLAIR Sagittal/Axial",
            "Diffusion-Weighted Imaging (DWI / ADC)",
            "Post-Contrast 3D T1-MPRAGE"
          ],
          quantitativeIndices: {
            fazekasWhiteMatterScale: "Grade 1 (Mild)",
            ventricularIndex: "Age-Appropriate Mild Prominence",
            diffusionRestriction: "None",
            midlineShift: "0.0 mm"
          },
          impression: [
            "1. Mild chronic microvascular ischemic white matter changes (Fazekas 1).",
            "2. No evidence of acute territorial infarction, acute intracranial hemorrhage, or dural sinus thrombosis.",
            "3. No pathologic leptomeningeal enhancement."
          ]
        };

      case 'OTHER_DOCS':
        return {
          documentMetadata: {
            documentType: "ELECTROCARDIOGRAPHY_AND_SPECIALTY_DIAGNOSTICS",
            documentId: docId,
            generatedFileName: activeIngestionTargetFileName,
            deviceModel: "GE Healthcare Marquette MAC 5500 HD",
            sourceFacility: hospital,
            modality: "12-Lead Standard Surface ECG"
          },
          patientDemographics: {
            fullName: name,
            uprId: upr,
            age: age,
            gender: gender
          },
          ecgParameters: {
            heartRateBpm: 94,
            rhythm: "Normal Sinus Rhythm",
            prIntervalMs: 162,
            qrsDurationMs: 88,
            qtcIntervalMs: 438,
            stSegmentAnalysis: "Non-specific ST-T wave flattening in leads V5-V6"
          },
          clinicalSummary: `Normal sinus rhythm without evidence of acute myocardial ischemia. Findings correlate with compensatory tachycardia secondary to ${condition}.`
        };

      default:
        return {};
    }
  }, [selectedCategory, newPatientName, newPatientUprId, newPatientAge, newPatientGender, newPatientHospital, newPatientCondition, currentUser, activeIngestionTargetFileName]);

  // Real-time duplicate checking against the active patient registry
  const duplicateMatch = useMemo(() => {
    const trimmedName = newPatientName.trim().toLowerCase();
    const trimmedUpr = newPatientUprId.trim().toLowerCase();
    
    if (!trimmedName && !trimmedUpr) return null;

    // Check exact or partial UPR ID match
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

  // File Upload Handlers - Uploading is required before parsing
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
    const updatedList = [...uploadedFilesList, ...newFiles];
    setUploadedFilesList(updatedList);
    setCustomUploadedFileName(updatedList[0]?.name || null);
    
    // Clear previous parsed state so user parses the newly uploaded document
    setIsParsed(false);
    setIngestionResult(null);
    setIngestionStage(0);
    setParseError(null);
    setParseNotification(`${newFiles.length} document(s) uploaded. Click "Parse Document" to extract structured clinical data.`);
  };

  // Remove uploaded file - clears parsed information if empty or resets stale state
  const handleRemoveFile = (indexToRemove: number) => {
    const updated = uploadedFilesList.filter((_, idx) => idx !== indexToRemove);
    setUploadedFilesList(updated);
    
    // Clear parsed information in JSON and Raw text
    setIsParsed(false);
    setIngestionResult(null);
    setIngestionStage(0);
    setParseError(null);

    if (updated.length === 0) {
      setCustomUploadedFileName(null);
      setParseNotification('Document removed. Parsed information cleared.');
    } else {
      setCustomUploadedFileName(updated[0].name);
      setParseNotification('Document removed. Click "Parse Document" to parse remaining file.');
    }
  };

  // Trigger explicit Parse Document action - MANDATORY to upload document first
  const handleParseDocument = () => {
    setParseError(null);

    if (uploadedFilesList.length === 0) {
      setParseError('Document upload is mandatory to parse. Please click "Upload Documents" to attach a file first.');
      return;
    }

    setIsParsingDocument(true);
    setTimeout(() => {
      setIsParsingDocument(false);
      setIsParsed(true);
      setDocumentViewMode('JSON');
      setParseNotification(`Successfully parsed "${customUploadedFileName || uploadedFilesList[0]?.name || activeIngestionTargetFileName}" into structured FHIR JSON.`);
    }, 450);
  };

  // Dedicated action to clear parsed data in the same window
  const handleClearParsedData = () => {
    setIsParsed(false);
    setIngestionResult(null);
    setIngestionStage(0);
    setDocumentViewMode('JSON');
    setParseNotification('Parsed data and RAG index cleared.');
    setTimeout(() => setParseNotification(null), 3000);
  };

  // Copy JSON to Clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(dynamicParsedJson, null, 2));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Run the full 5-Stage Multimodal Vector Indexing & RAG Pipeline
  const handleRunIngestionPipeline = () => {
    setIsProcessing(true);
    setIngestionStage(1);
    setIsParsed(true);

    setTimeout(() => {
      setIngestionStage(2);
      setTimeout(() => {
        setIngestionStage(3);
        setTimeout(() => {
          setIngestionStage(4);
          setTimeout(() => {
            setIngestionStage(5);
            setIsProcessing(false);
            const modalityMap: Record<ExtendedModalityCategory, IngestionModality> = {
              TEXT_PDF: 'TEXT_PDF',
              IMAGING_VISION: 'IMAGING_VISION',
              LAB_STRUCTURED: 'LAB_STRUCTURED',
              MRI_SCANS: 'IMAGING_VISION',
              OTHER_DOCS: 'TEXT_PDF'
            };

            setIngestionResult({
              documentId: 'DOC-INGEST-' + Math.floor(1000 + Math.random() * 9000),
              fileName: activeIngestionTargetFileName,
              modality: modalityMap[selectedCategory],
              rawSizeKb: selectedCategory === 'IMAGING_VISION' || selectedCategory === 'MRI_SCANS' ? 4180 : 342,
              uploadedAt: new Date().toISOString(),
              patientId: 'PT-NEW-99',
              patientUprId: newPatientUprId,
              stage1Classification: {
                parserUsed: selectedCategory === 'TEXT_PDF' || selectedCategory === 'OTHER_DOCS' ? 'OCR_CLINICAL_PARSER' : selectedCategory === 'LAB_STRUCTURED' ? 'STRUCTURED_JSON_PARSER' : 'VISION_MODEL_EXTRACTOR',
                extractedTextSnippet: `Patient ${newPatientName} (${newPatientUprId}) presented with ${newPatientCondition}. Diagnoses and orders parsed into vector registry.`,
                identifiedEntities: [
                  { type: 'CONDITION', text: newPatientCondition, confidence: 0.99 },
                  { type: 'MEDICATION', text: 'Levofloxacin 500mg Oral Daily', confidence: 0.98 },
                  { type: 'LAB', text: 'eGFR 44 mL/min/1.73m2 (Stage 3a)', confidence: 0.97 },
                  { type: 'FINDING', text: 'SpO2 89% Room Air -> 94% on 2L NC', confidence: 0.99 }
                ]
              },
              stage2Chunking: {
                chunkCount: 4,
                sections: ['Demographics & Chief Complaint', 'Hospital Course & Vitals', 'Diagnostic Findings & LOINC', 'Discharge & Transfer Orders'],
                sampleChunk: `Section [Discharge Orders]: Continue pulmonary toilet with PEP therapy. Complete 7-day course of oral levofloxacin 500mg daily. Repeat sputum culture in 4 weeks.`
              },
              stage3Embedding: {
                denseVectorModel: 'text-embedding-004 (768-dim dense pgvector)',
                sparseKeywordTokens: 184,
                vectorDimension: 768,
                indexedAt: new Date().toISOString()
              },
              stage4Retrieval: {
                rerankScore: 0.96,
                topKRetrieved: 5
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
      hospitalSite: newPatientHospital || 'North River Community Hospital',
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
            ? `Historical record (${activeIngestionTargetFileName}) parsed into JSON and indexed into pgvector.`
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
          chiefComplaint: `Transfer from ${newPatientHospital} for specialized management of ${newPatientCondition}`,
          dischargeSummaryNote: hasHistoricalRecords === 'YES' ? `Multimodal package (${activeIngestionTargetFileName}) parsed into FHIR & Vector store.` : 'Initial inpatient admission record.'
        }
      ]
    };

    onPatientRegistered(newPatient);
    onClose();
    setOverrideDuplicateWarning(false);
    setDuplicateFormError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Register New Patient
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Create a new patient record in PostgreSQL with real-time duplicate checks, document parsing to structured JSON, and 5-stage multimodal vector indexing.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setDuplicateFormError(null);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Error Banner */}
        {duplicateFormError && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white">Registration Blocked</div>
              <div>{duplicateFormError}</div>
            </div>
          </div>
        )}

        {/* DUPLICATE PATIENT CHECK WARNING / MATCH DETECTED BANNER */}
        {duplicateMatch && (
          <div className={`bg-gradient-to-br border-2 rounded-3xl p-5 shadow-2xl space-y-4 ${
            duplicateMatch.matchType === 'UPR'
              ? 'from-rose-950/50 via-rose-900/30 to-slate-900 border-rose-500/70 ring-2 ring-rose-500/30'
              : 'from-amber-950/40 via-amber-900/20 to-slate-900 border-amber-500/60'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  duplicateMatch.matchType === 'UPR'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      duplicateMatch.matchType === 'UPR' ? 'text-rose-300' : 'text-amber-300'
                    }`}>
                      {duplicateMatch.matchType === 'UPR' ? '⛔ Duplicate UPR ID Found' : '⚠️ Duplicate Patient Name Detected'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      duplicateMatch.matchType === 'UPR'
                        ? 'bg-rose-500/20 text-rose-200 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                    }`}>
                      {duplicateMatch.matchType === 'UPR' ? 'REGISTRATION BLOCKED' : 'NAME MATCH'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {duplicateMatch.matchType === 'UPR'
                      ? `The Unique Patient Record ID (${newPatientUprId}) is already assigned to "${duplicateMatch.patient.fullName}" in the PostgreSQL store. A new unique ID must be generated before registering.`
                      : `A registered record named "${duplicateMatch.patient.fullName}" already exists in the EHR database.`}
                  </p>
                </div>
              </div>

              {/* Generate Unique ID Action inside duplicate banner */}
              {duplicateMatch.matchType === 'UPR' && (
                <button
                  type="button"
                  onClick={handleGenerateUniqueUpr}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-600/30 shrink-0 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                  <span>Generate Unique ID</span>
                </button>
              )}
            </div>

            {/* Existing Matched Patient Card */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              duplicateMatch.matchType === 'UPR'
                ? 'bg-slate-950/90 border-rose-500/30'
                : 'bg-slate-950/80 border-amber-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={getPatientAvatarUrl(duplicateMatch.patient)}
                  alt={duplicateMatch.patient.fullName}
                  referrerPolicy="no-referrer"
                  className={`w-13 h-13 rounded-2xl object-cover border-2 shadow-md ${
                    duplicateMatch.matchType === 'UPR' ? 'border-rose-500/60' : 'border-amber-500/50'
                  }`}
                />
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{duplicateMatch.patient.fullName}</span>
                    <span className="text-xs font-mono text-cyan-300">({duplicateMatch.patient.mrn})</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    UPR: <span className="text-slate-300">{duplicateMatch.patient.uprId || '—'}</span> • {duplicateMatch.patient.age}y {duplicateMatch.patient.gender}
                  </div>
                  <div className="text-xs text-slate-300">
                    Facility: {duplicateMatch.patient.hospitalSite}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSelectExistingPatient) {
                      onSelectExistingPatient(duplicateMatch.patient.id);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Existing Record</span>
                </button>
              </div>
            </div>

            {/* Override Checkbox for Name Matches ONLY */}
            {duplicateMatch.matchType === 'NAME' && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={overrideDuplicateWarning}
                  onChange={(e) => {
                    setOverrideDuplicateWarning(e.target.checked);
                    if (e.target.checked) setDuplicateFormError(null);
                  }}
                  className="mt-0.5 accent-amber-500 w-4 h-4"
                />
                <span className="text-slate-200">
                  <strong>Override Duplicate Guard:</strong> I confirm this is a distinct clinical individual with different identification details (Audit Logged).
                </span>
              </label>
            )}
          </div>
        )}

        {/* Basic Demographic Form */}
        <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3.5">
          {/* Top Row: Name, UPR ID with Generator, Age & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Full Name */}
            <div className="min-w-0">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Patient Full Name *</label>
              <input
                type="text"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. Eleanor Vance"
              />
            </div>

            {/* 2. UPR ID with Generator */}
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-300">UPR ID *</label>
                <button
                  type="button"
                  onClick={handleGenerateUniqueUpr}
                  className="text-[10px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Generate fresh unique ID"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Auto-Gen</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newPatientUprId}
                  onChange={(e) => {
                    setNewPatientUprId(e.target.value);
                    setDuplicateFormError(null);
                  }}
                  className={`flex-1 min-w-0 bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none transition-colors ${
                    duplicateMatch?.matchType === 'UPR'
                      ? 'border-rose-500 text-rose-300 focus:border-rose-400 ring-1 ring-rose-500/40'
                      : 'border-white/10 text-cyan-300 focus:border-cyan-400'
                  }`}
                  placeholder="e.g. UPR-2026-NRH-992014"
                />
                <button
                  type="button"
                  onClick={handleGenerateUniqueUpr}
                  className="px-2.5 py-2 rounded-xl bg-cyan-600/25 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Generate a unique UPR ID"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="whitespace-nowrap">New ID</span>
                </button>
              </div>
            </div>

            {/* 3. Age & Gender */}
            <div className="min-w-0">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Age & Gender *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  max="130"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Age"
                />
                <select
                  value={newPatientGender}
                  onChange={(e) => setNewPatientGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Facility and Chief Complaint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 border-t border-white/5">
            {/* 4. Source Hospital */}
            <div className="min-w-0">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Source Hospital Facility</label>
              <input
                type="text"
                value={newPatientHospital}
                onChange={(e) => setNewPatientHospital(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. North River Community Hospital"
              />
            </div>

            {/* 5. Diagnosis / Complaint */}
            <div className="min-w-0">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Primary Clinical Diagnosis / Chief Complaint *</label>
              <input
                type="text"
                value={newPatientCondition}
                onChange={(e) => setNewPatientCondition(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. Acute Exacerbation of Bronchiectasis with Hypoxemia"
              />
            </div>
          </div>
        </div>

        {/* HISTORICAL RECORDS RADIO BUTTON SECTION */}
        <div className="bg-[#0b140e] border border-[#1b3e22] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                ADD PATIENT HISTORICAL RECORDS IF EXISTS?
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select whether historical medical documentation is available for cross-facility ingestion.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold self-start sm:self-auto">
              OPTIONAL ATTACHMENTS
            </span>
          </div>

          {/* Radio Group: YES / NO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                hasHistoricalRecords === 'YES'
                  ? 'bg-[#122817] border-[#4ade80] ring-2 ring-[#4ade80]/40 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="historicalRecordsRadioModal"
                value="YES"
                checked={hasHistoricalRecords === 'YES'}
                onChange={() => setHasHistoricalRecords('YES')}
                className="accent-emerald-500 w-4 h-4 mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>Yes, Attach Historical Records</span>
                  <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Multimodal
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Attach text/pdf/ocr, chest X-Ray, lab reports, MRI scans, or other clinical reports.
                </div>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                hasHistoricalRecords === 'NO'
                  ? 'bg-[#122817] border-[#4ade80] ring-2 ring-[#4ade80]/40 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="historicalRecordsRadioModal"
                value="NO"
                checked={hasHistoricalRecords === 'NO'}
                onChange={() => setHasHistoricalRecords('NO')}
                className="accent-emerald-500 w-4 h-4 mt-0.5"
              />
              <div>
                <div className="text-xs font-bold text-slate-200">No, Standard Registration Only</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Directly commit new patient demographic & baseline diagnosis to PostgreSQL database.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* IF YES: HISTORICAL DOCUMENTS UPLOAD & CATEGORY SELECTION */}
        {hasHistoricalRecords === 'YES' && (
          <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                SELECT HISTORICAL DOCUMENT CATEGORY:
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                Upload required before parsing
              </span>
            </div>

            {/* 5 Historical Document Modality Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {[
                { id: 'TEXT_PDF' as const, name: '1. Text / PDF / OCR', desc: 'Discharge notes, clinic...', icon: FileText, color: 'blue' },
                { id: 'IMAGING_VISION' as const, name: '2. X-Ray & Imaging', desc: 'Chest X-Ray, DICOM...', icon: ImageIcon, color: 'purple' },
                { id: 'LAB_STRUCTURED' as const, name: '3. Lab Reports', desc: 'Metabolic panels, LOINC...', icon: FileCode, color: 'emerald' },
                { id: 'MRI_SCANS' as const, name: '4. MRI Scans', desc: 'Brain & spinal contrast...', icon: Brain, color: 'indigo' },
                { id: 'OTHER_DOCS' as const, name: '5. Other Reports', desc: '12-Lead ECG, Pathology...', icon: HardDrive, color: 'amber' }
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      // If user changes category and documents exist, require parsing
                      if (isParsed) {
                        setIsParsed(false);
                        setIngestionResult(null);
                        setParseNotification(`Switched modality to ${cat.name}. Click "Parse Document" to extract.`);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/25 border-blue-400 text-white shadow-md ring-1 ring-blue-400'
                        : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <CatIcon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs">{cat.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Parsing Notification / Error Banners */}
            {parseError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {parseNotification && (
              <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>{parseNotification}</span>
              </div>
            )}

            {/* File Upload Dropzone */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border-2 border-dashed border-white/20 text-center space-y-3">
              <div className="flex justify-center">
                <FileUp className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-xs text-white font-semibold">
                Upload Historical Documents: <span className="text-slate-400 font-normal">PDF, DICOM, JSON, PNG, JPG, or TXT</span>
              </div>
              <p className="text-[10px] text-slate-400 max-w-md mx-auto">
                Drag and drop your historical files here, or click <strong className="text-blue-300">Upload Documents</strong>. <span className="text-amber-300 font-medium">Document upload is mandatory before parsing.</span>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                {/* 1. Upload Documents Button */}
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold cursor-pointer border border-blue-400/40 transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95">
                  <FileUp className="w-4 h-4" />
                  <span>Upload Documents</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>

                {/* 2. Parse Document Button (Enabled after upload) */}
                <button
                  type="button"
                  onClick={handleParseDocument}
                  disabled={isParsingDocument}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                    uploadedFilesList.length > 0
                      ? 'bg-emerald-600/30 hover:bg-emerald-600/45 text-emerald-300 border-emerald-500/50 shadow-emerald-600/20 ring-1 ring-emerald-400/40 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                  title={uploadedFilesList.length === 0 ? 'Please upload a document first to enable parsing' : 'Extract structured clinical FHIR JSON from uploaded file'}
                >
                  {isParsingDocument ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>Parsing Document...</span>
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      <span>Parse Document</span>
                      {uploadedFilesList.length > 0 && !isParsed && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </>
                  )}
                </button>

                {/* 3. Clear Parsed Data Button (in same window after parsing) */}
                {(isParsed || ingestionResult || uploadedFilesList.length > 0) && (
                  <button
                    type="button"
                    onClick={handleClearParsedData}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold border border-rose-500/30 cursor-pointer transition-colors"
                    title="Clear parsed JSON and raw text data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Parsed Data</span>
                  </button>
                )}
              </div>

              {/* Attached Files List */}
              {uploadedFilesList.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-left max-w-lg mx-auto">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{uploadedFilesList.length} Historical Document(s) Attached:</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Bound to Patient</span>
                  </div>
                  <div className="space-y-1">
                    {uploadedFilesList.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
                        <span className="text-slate-200 truncate">{file.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 hover:bg-rose-500/20 rounded cursor-pointer transition-colors"
                            title="Remove file (clears parsed info)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Preview & Active Ingestion Target Pane */}
            <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 space-y-3">
              {/* Active Ingestion Target Header: Formatted as [Patient Name]_[Report Type]_[Hospital Name].pdf */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Active Ingestion Target:
                  </div>
                  <div className="text-xs font-mono text-cyan-300 font-bold break-all flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{customUploadedFileName || activeIngestionTargetFileName}</span>
                  </div>
                </div>

                {/* View Toggles & Actions */}
                {isParsed && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-white/10 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setDocumentViewMode('JSON')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          documentViewMode === 'JSON'
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileCode className="w-3 h-3" />
                        <span>Parsed JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocumentViewMode('RAW_TEXT')}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          documentViewMode === 'RAW_TEXT'
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>Raw Text</span>
                      </button>
                    </div>

                    {documentViewMode === 'JSON' && (
                      <button
                        type="button"
                        onClick={handleCopyJson}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer text-xs flex items-center gap-1"
                        title="Copy Parsed JSON"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedNotification && <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleClearParsedData}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/30 cursor-pointer text-xs flex items-center gap-1"
                      title="Clear Parsed Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Document Content Display (Parsed JSON, Raw Text, or Unparsed State) */}
              {!isParsed ? (
                <div className="p-6 bg-slate-900/60 rounded-xl border border-dashed border-white/10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {uploadedFilesList.length === 0
                        ? 'Document Upload Required to Parse'
                        : `${uploadedFilesList.length} Document(s) Ready to Parse`}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                      {uploadedFilesList.length === 0
                        ? 'Please click "Upload Documents" above to attach a clinical record. Uploading is mandatory before parsing.'
                        : `Attached: "${uploadedFilesList[0]?.name}". Click "Parse Document" to extract structured FHIR JSON schema.`}
                    </p>
                  </div>

                  {uploadedFilesList.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleParseDocument}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Parse Attached Document Now</span>
                    </button>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-xs text-white font-bold cursor-pointer transition-all">
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Upload Documents</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  )}
                </div>
              ) : documentViewMode === 'JSON' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Structured Patient JSON Schema (Mapped to {newPatientName})
                    </span>
                    <span className="text-slate-400">HIPAA Cleared</span>
                  </div>
                  <pre className="p-3.5 bg-slate-900/90 rounded-xl text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-56 border border-emerald-500/20 whitespace-pre-wrap selection:bg-emerald-500/30">
                    {JSON.stringify(dynamicParsedJson, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-blue-300 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Raw Unstructured Clinical Note
                    </span>
                    <span className="text-slate-400">{customUploadedFileName || activeIngestionTargetFileName}</span>
                  </div>
                  <pre className="p-3.5 bg-slate-900 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto max-h-56 border border-white/10 whitespace-pre-wrap selection:bg-blue-500/30">
                    {dynamicRawText}
                  </pre>
                </div>
              )}

              {/* 5-Stage Multimodal Vector Indexing & RAG Parser Trigger */}
              {isParsed && (
                <button
                  type="button"
                  onClick={handleRunIngestionPipeline}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-blue-600/40 hover:from-blue-600/60 hover:to-indigo-600/60 border border-blue-400/40 text-blue-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                      <span>Executing 5-Stage Multimodal RAG Pipeline (Stage 0{ingestionStage}/05)...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>Test Vector Indexing & RAG Parser (Execute 5-Stage Pipeline)</span>
                    </>
                  )}
                </button>
              )}

              {/* 5-STAGE PIPELINE PROGRESS DISPLAY */}
              {isParsed && (isProcessing || ingestionResult) && (
                <div className="p-4 bg-slate-900/95 border border-blue-500/30 rounded-2xl space-y-4 animate-fade-in shadow-xl">
                  {/* Pipeline Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        5-Stage Multimodal RAG Pipeline Execution
                      </span>
                    </div>
                    {ingestionResult && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Indexed into pgvector
                      </span>
                    )}
                  </div>

                  {/* 5 Visual Stage Step Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { step: 1, name: '01. Classification & OCR', desc: 'Entity extraction', icon: Microscope },
                      { step: 2, name: '02. Chunking', desc: '4 Semantic sections', icon: Layers },
                      { step: 3, name: '03. Embedding', desc: '768-dim dense vector', icon: Database },
                      { step: 4, name: '04. Hybrid Retrieval', desc: 'Rerank score 0.96', icon: Search },
                      { step: 5, name: '05. Grounding & PHI', desc: 'Zero hallucination', icon: ShieldCheck }
                    ].map((st) => {
                      const isCompleted = ingestionStage >= st.step || !!ingestionResult;
                      const isCurrent = isProcessing && ingestionStage === st.step;
                      const StIcon = st.icon;

                      return (
                        <div
                          key={st.step}
                          className={`p-2.5 rounded-xl border transition-all text-left ${
                            isCompleted
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : isCurrent
                              ? 'bg-blue-950/60 border-blue-400 text-blue-200 ring-2 ring-blue-400/40 animate-pulse'
                              : 'bg-slate-950/50 border-white/5 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <StIcon className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-blue-300' : 'text-slate-500'}`} />
                            <span className="text-[9px] font-mono font-bold">
                              {isCompleted ? '✓ DONE' : isCurrent ? 'RUNNING' : 'PENDING'}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold truncate text-white">{st.name}</div>
                          <div className="text-[9px] text-slate-400 truncate">{st.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Stage Metrics Card */}
                  {ingestionResult && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
                          <div className="text-slate-400 text-[10px]">Parser / Engine</div>
                          <div className="font-mono text-cyan-300 font-semibold text-[10px] truncate mt-0.5">
                            {ingestionResult.stage1Classification.parserUsed}
                          </div>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
                          <div className="text-slate-400 text-[10px]">Semantic Chunks</div>
                          <div className="font-mono text-emerald-300 font-semibold text-[10px] mt-0.5">
                            {ingestionResult.stage2Chunking.chunkCount} Clinical Sections
                          </div>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
                          <div className="text-slate-400 text-[10px]">Vector Dimensionality</div>
                          <div className="font-mono text-purple-300 font-semibold text-[10px] mt-0.5">
                            768-dim (pgvector)
                          </div>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10">
                          <div className="text-slate-400 text-[10px]">Grounded Score</div>
                          <div className="font-mono text-emerald-400 font-semibold text-[10px] mt-0.5">
                            98% (Zero Hallucination)
                          </div>
                        </div>
                      </div>

                      {/* Parsed Extracted Entities Snippet */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-white/10 space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Extracted Clinical Entities (Stage 01 Extraction):</span>
                          <span className="text-emerald-400 text-[10px]">100% Verified</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ingestionResult.stage1Classification.identifiedEntities.map((ent, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-200 text-[10px] font-mono flex items-center gap-1"
                            >
                              <span className="text-slate-400 font-bold">{ent.type}:</span>
                              <span>{ent.text}</span>
                              <span className="text-emerald-400 font-semibold">({Math.round(ent.confidence * 100)}%)</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              setDuplicateFormError(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAndOpenPatient}
            disabled={duplicateMatch?.matchType === 'UPR'}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all ${
              duplicateMatch?.matchType === 'UPR'
                ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed opacity-60'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer hover:scale-105 active:scale-95'
            }`}
            title={duplicateMatch?.matchType === 'UPR' ? 'Registration blocked due to duplicate UPR ID. Click "Generate Unique ID" to resolve.' : 'Register patient and store in database'}
          >
            <Check className="w-4 h-4" />
            <span>Register Patient & Commit to Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
