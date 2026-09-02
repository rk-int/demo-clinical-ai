export const ENV_CONFIG = {
  APP_NAME: 'HealthNet Clinical AI Platform',
  APP_VERSION: '1.4.0-enterprise',
  BUILD_ENV: process.env.NODE_ENV || 'production',
  GEMINI_MODEL_PRIMARY: 'gemini-3.7-flash',
  GEMINI_MODEL_FALLBACK: 'gemini-3.1-flash-lite',
  DEFAULT_HOSPITAL_SITE: 'St. Jude Metropolitan Medical Center',
  HIPAA_COMPLIANCE_MODE: 'STRICT_ENFORCED',
  SESSION_TIMEOUT_MINUTES: 30,
  ENABLE_SYNTHETIC_DATA_MUTATIONS: true,
  AUDIT_LOG_ENDPOINT: '/api/audit/logs',
  PATIENTS_ENDPOINT: '/api/patients',
  EXPORT_ZIP_ENDPOINT: '/api/export/zip',
};
