import { ProvenanceRecord } from './agent.types';

export type ConsentStatus = 'ACTIVE_CONSENT' | 'RESTRICTED_RESEARCH' | 'EXPIRED_CONSENT' | 'REVOKED';

export interface LabObservation {
  id: string;
  code: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW' | 'CRITICAL';
  effectiveDateTime: string;
  trend?: number[];
  provenance: ProvenanceRecord;
}

export interface Medication {
  id: string;
  code: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'HELD';
  prescribedDate: string;
  prescribingProvider: string;
  indications: string;
}

export interface AllergyIntolerance {
  id: string;
  substance: string;
  category: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL';
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  status: 'ACTIVE' | 'RESOLVED';
  recordedDate: string;
}

export interface ClinicalCondition {
  id: string;
  code: string;
  name: string;
  category: 'CHRONIC' | 'ACUTE' | 'RESOLVED';
  onsetDate: string;
  clinicalStatus: 'ACTIVE' | 'INACTIVE' | 'REMISSION';
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
}

export interface ClinicalEncounter {
  id: string;
  type: 'INPATIENT' | 'OUTPATIENT' | 'EMERGENCY' | 'TELEHEALTH';
  admissionDate: string;
  dischargeDate?: string;
  department: string;
  attendingPhysician: string;
  chiefComplaint: string;
  dischargeSummaryNote?: string;
}

export interface DataCompletenessAlert {
  id: string;
  field: string;
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  detectedAt: string;
}

export interface SyntheticPatient {
  id: string;
  mrn: string;
  uprId?: string;
  fullName: string;
  avatarUrl?: string;
  birthDate: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  assignedPhysicianId: string;
  hospitalSite: string;
  roomBed?: string;
  consentStatus: ConsentStatus;
  conditions: ClinicalCondition[];
  medications: Medication[];
  allergies: AllergyIntolerance[];
  observations: LabObservation[];
  encounters: ClinicalEncounter[];
  completenessAlerts: DataCompletenessAlert[];
  provenance: ProvenanceRecord;
}

export type IngestionModality = 'TEXT_PDF' | 'LAB_STRUCTURED' | 'IMAGING_VISION';

export interface MultimodalIngestionResult {
  documentId: string;
  fileName: string;
  modality: IngestionModality;
  rawSizeKb: number;
  uploadedAt: string;
  patientId: string;
  patientUprId: string;
  stage1Classification: {
    parserUsed: 'OCR_CLINICAL_PARSER' | 'STRUCTURED_JSON_PARSER' | 'VISION_MODEL_EXTRACTOR';
    extractedTextSnippet: string;
    identifiedEntities: {
      type: 'CONDITION' | 'MEDICATION' | 'LAB' | 'FINDING' | 'PROCEDURE';
      text: string;
      confidence: number;
    }[];
  };
  stage2Chunking: {
    chunkCount: number;
    sections: string[];
    sampleChunk: string;
  };
  stage3Embedding: {
    denseVectorModel: string;
    sparseKeywordTokens: number;
    vectorDimension: number;
    indexedAt: string;
  };
  stage4Retrieval: {
    rerankScore: number;
    topKRetrieved: number;
  };
  stage5Grounding: {
    groundednessScore: number;
    hallucinationRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    phiMaskingVerified: boolean;
  };
}
