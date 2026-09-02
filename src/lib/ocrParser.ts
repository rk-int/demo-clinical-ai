import { IngestionModality, MultimodalIngestionResult } from '../types';

export interface ParsedDocumentData {
  text: string;
  entities: {
    type: 'CONDITION' | 'MEDICATION' | 'LAB' | 'FINDING' | 'PROCEDURE';
    text: string;
    confidence: number;
  }[];
  chunkCount: number;
  phiDetected: boolean;
  cleanText: string;
}

export function parseClinicalDocument(fileName: string, fileContent: string, modality: IngestionModality = 'TEXT_PDF'): ParsedDocumentData {
  const words = fileContent.split(/\s+/);
  
  // Extract mock clinical entities
  const entities: ParsedDocumentData['entities'] = [];
  if (/hypertension|htn/i.test(fileContent)) {
    entities.push({ type: 'CONDITION', text: 'Essential Hypertension', confidence: 0.98 });
  }
  if (/diabetes|t2dm|glucose/i.test(fileContent)) {
    entities.push({ type: 'CONDITION', text: 'Type 2 Diabetes Mellitus', confidence: 0.96 });
  }
  if (/metformin|lisinopril|atorvastatin/i.test(fileContent)) {
    const medMatch = fileContent.match(/metformin|lisinopril|atorvastatin/i);
    if (medMatch) {
      entities.push({ type: 'MEDICATION', text: medMatch[0], confidence: 0.95 });
    }
  }
  if (/hba1c|egfr|creatinine|troponin/i.test(fileContent)) {
    const labMatch = fileContent.match(/hba1c|egfr|creatinine|troponin/i);
    if (labMatch) {
      entities.push({ type: 'LAB', text: labMatch[0].toUpperCase(), confidence: 0.97 });
    }
  }

  // Calculate chunks (approx 200 words per chunk)
  const chunkCount = Math.max(1, Math.ceil(words.length / 80));

  return {
    text: fileContent,
    entities,
    chunkCount,
    phiDetected: /ssn|social security|\d{3}-\d{2}-\d{4}/i.test(fileContent),
    cleanText: fileContent.replace(/\d{3}-\d{2}-\d{4}/g, '[REDACTED_SSN]'),
  };
}
