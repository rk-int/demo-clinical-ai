import { SYNTHETIC_PATIENTS, DEMO_USERS } from './syntheticFhirData';
import { SyntheticPatient, KpiMetrics } from '../types';

export { SYNTHETIC_PATIENTS, DEMO_USERS };

export const INITIAL_KPI_METRICS: KpiMetrics = {
  totalRequests: 1420,
  p50LatencyMs: 380,
  p95LatencyMs: 840,
  groundednessScore: 98.6,
  citationValidityScore: 99.2,
  contextRelevanceScore: 97.4,
  unauthorizedAccessBlocks: 42,
  promptInjectionBlocks: 18,
  phiMaskingPassRate: 100.0,
  workflowApprovalGateCompliance: 100.0,
  safeFallbackRate: 100.0,
};

export const SAMPLE_INGESTION_RESULTS = [
  {
    documentId: 'DOC-FHIR-001',
    fileName: 'Clinical_Cardiology_Summary_PT1002.pdf',
    fileSize: '2.4 MB',
    status: 'COMPLETED' as const,
    extractedEntities: 48,
    provenanceHash: 'sha256-8f3e2b9c7a1d5e6f',
    indexedChunks: 14,
    timestamp: '2026-08-30T14:22:00Z',
  }
];

export const getPatientById = (id: string): SyntheticPatient | undefined => {
  return SYNTHETIC_PATIENTS.find(p => p.id === id);
};

export const getPatientsByPhysician = (physicianId: string): SyntheticPatient[] => {
  return SYNTHETIC_PATIENTS.filter(p => p.assignedPhysicianId === physicianId);
};

export const getPatientsByHospital = (hospitalSite: string): SyntheticPatient[] => {
  return SYNTHETIC_PATIENTS.filter(p => p.hospitalSite.toLowerCase().includes(hospitalSite.toLowerCase()));
};
