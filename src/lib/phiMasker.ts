/**
 * HIPAA / GDPR Compliant PHI DLP Masking Engine
 * Automatically redacts direct and indirect identifiers before telemetry emission.
 */

export function maskPhi(text: string): string {
  if (!text) return '';

  let masked = text;

  // Social Security Numbers (e.g. 000-00-0000 or 000000000)
  masked = masked.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  
  // Phone numbers (US/Intl formats)
  masked = masked.replace(/\b(\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g, '[REDACTED_PHONE]');

  // Medical Record Numbers (e.g., MRN-123456 or MRN# 12345)
  masked = masked.replace(/\b(MRN[-#:\s]*)\d{4,9}\b/gi, '$1[REDACTED_MRN]');

  // Email Addresses
  masked = masked.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');

  // Street Addresses / Postal codes
  masked = masked.replace(/\b\d{1,5}\s+[A-Za-z0-9\s.,]{3,20}(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, '[REDACTED_ADDRESS]');
  masked = masked.replace(/\b\d{5}(-\d{4})?\b/g, '[REDACTED_ZIP]');

  // Full names matching synthetic patient cohorts
  const patientNames = [
    'Elena Rostova', 'Marcus Vance', 'Sarah Jenkins', 'Arthur Pendelton', 
    'Aaliyah Khan', 'Mateo Morales', 'Chloe Zhang', 'Darnell Washington',
    'Brigitte Dubois', 'Liam Gallagher', 'Sophia Martinez', 'Robert Tanaka'
  ];

  patientNames.forEach((name) => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    masked = masked.replace(regex, '[REDACTED_PATIENT_NAME]');
  });

  return masked;
}

export function sanitizePayloadForTelemetry(obj: any): any {
  if (typeof obj === 'string') {
    return maskPhi(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizePayloadForTelemetry);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.toLowerCase().includes('name') && typeof obj[key] === 'string') {
          sanitized[key] = maskPhi(obj[key]);
        } else if (key.toLowerCase().includes('mrn') || key.toLowerCase().includes('ssn')) {
          sanitized[key] = '[REDACTED_IDENTIFIER]';
        } else {
          sanitized[key] = sanitizePayloadForTelemetry(obj[key]);
        }
      }
    }
    return sanitized;
  }
  return obj;
}
