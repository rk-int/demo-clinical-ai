import { PostgresTableMeta } from '../types';

export const POSTGRES_TABLE_SCHEMAS: PostgresTableMeta[] = [
  {
    tableName: 'patients',
    category: 'CLINICAL',
    rowCount: 14,
    sizeKb: 48,
    description: 'Core FHIR Patient resource table with Unique Patient Record ID (UPR) and consent status.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'mrn', type: 'VARCHAR(32)', nullable: false },
      { name: 'upr_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'full_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'birth_date', type: 'DATE', nullable: false },
      { name: 'age', type: 'INTEGER', nullable: false },
      { name: 'gender', type: 'VARCHAR(16)', nullable: false },
      { name: 'assigned_physician_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'hospital_site', type: 'VARCHAR(128)', nullable: false },
      { name: 'consent_status', type: 'VARCHAR(32)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMPTZ DEFAULT NOW()', nullable: false }
    ]
  },
  {
    tableName: 'clinical_conditions',
    category: 'CLINICAL',
    rowCount: 42,
    sizeKb: 32,
    description: 'Active, chronic, and acute ICD-10 diagnostic problem list linked to patients.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'patient_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'code', type: 'VARCHAR(32)', nullable: false },
      { name: 'name', type: 'VARCHAR(256)', nullable: false },
      { name: 'category', type: 'VARCHAR(32)', nullable: false },
      { name: 'onset_date', type: 'DATE', nullable: false },
      { name: 'clinical_status', type: 'VARCHAR(32)', nullable: false },
      { name: 'severity', type: 'VARCHAR(32)', nullable: false }
    ]
  },
  {
    tableName: 'medications',
    category: 'CLINICAL',
    rowCount: 38,
    sizeKb: 28,
    description: 'Patient active medication regimen, dosage, frequency, and prescribing provider.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'patient_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'code', type: 'VARCHAR(32)', nullable: false },
      { name: 'name', type: 'VARCHAR(128)', nullable: false },
      { name: 'dosage', type: 'VARCHAR(64)', nullable: false },
      { name: 'route', type: 'VARCHAR(32)', nullable: false },
      { name: 'frequency', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'VARCHAR(32)', nullable: false },
      { name: 'prescribed_date', type: 'DATE', nullable: false }
    ]
  },
  {
    tableName: 'lab_observations',
    category: 'CLINICAL',
    rowCount: 64,
    sizeKb: 40,
    description: 'Longitudinal lab panels, LOINC codes, reference ranges, and trend values.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'patient_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'code', type: 'VARCHAR(32)', nullable: false },
      { name: 'name', type: 'VARCHAR(128)', nullable: false },
      { name: 'value', type: 'VARCHAR(32)', nullable: false },
      { name: 'unit', type: 'VARCHAR(32)', nullable: false },
      { name: 'reference_range', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'VARCHAR(32)', nullable: false },
      { name: 'effective_date_time', type: 'TIMESTAMPTZ', nullable: false }
    ]
  },
  {
    tableName: 'rag_guidelines',
    category: 'KNOWLEDGE',
    rowCount: 10,
    sizeKb: 96,
    description: 'Approved clinical guidelines with institutional metadata and approval status.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'title', type: 'VARCHAR(256)', nullable: false },
      { name: 'version', type: 'VARCHAR(16)', nullable: false },
      { name: 'specialty', type: 'VARCHAR(64)', nullable: false },
      { name: 'hospital_site', type: 'VARCHAR(128)', nullable: false },
      { name: 'approval_status', type: 'VARCHAR(32)', nullable: false },
      { name: 'published_date', type: 'DATE', nullable: false },
      { name: 'effective_date', type: 'DATE', nullable: false },
      { name: 'summary', type: 'TEXT', nullable: false }
    ]
  },
  {
    tableName: 'rag_document_chunks',
    category: 'KNOWLEDGE',
    rowCount: 85,
    sizeKb: 320,
    description: 'Schema-aware text chunks, dense 768-dim embeddings, and sparse BM25 lexical tokens.',
    columns: [
      { name: 'chunk_id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'document_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'section', type: 'VARCHAR(128)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'embedding_dense', type: 'VECTOR(768)', nullable: false },
      { name: 'lexical_tokens', type: 'TEXT[]', nullable: false },
      { name: 'checksum', type: 'VARCHAR(64)', nullable: false }
    ]
  },
  {
    tableName: 'workflow_actions',
    category: 'GOVERNANCE',
    rowCount: 24,
    sizeKb: 64,
    description: 'Human-in-the-loop clinical workflow drafts, digital signatures, and rollback states.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'idempotency_key', type: 'VARCHAR(128)', nullable: false },
      { name: 'workflow_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'patient_id', type: 'VARCHAR(64)', isForeign: true, nullable: false },
      { name: 'created_by', type: 'VARCHAR(128)', nullable: false },
      { name: 'state', type: 'VARCHAR(32)', nullable: false },
      { name: 'draft_content', type: 'JSONB', nullable: false },
      { name: 'approver_signature', type: 'VARCHAR(256)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', nullable: false }
    ]
  },
  {
    tableName: 'agent_traces_and_evaluations',
    category: 'TELEMETRY',
    rowCount: 142,
    sizeKb: 512,
    description: 'Immutable 14-stage execution traces, AI Judge scores, latency, and guardrail intercepts.',
    columns: [
      { name: 'trace_id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'request_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'actor_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'purpose_of_use', type: 'VARCHAR(32)', nullable: false },
      { name: 'query_sanitized', type: 'TEXT', nullable: false },
      { name: 'guardrail_status', type: 'VARCHAR(32)', nullable: false },
      { name: 'confidence_score', type: 'NUMERIC(5,4)', nullable: false },
      { name: 'groundedness_score', type: 'NUMERIC(5,4)', nullable: false },
      { name: 'faithfulness_score', type: 'NUMERIC(5,4)', nullable: false },
      { name: 'latency_ms', type: 'INTEGER', nullable: false },
      { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', nullable: false }
    ]
  },
  {
    tableName: 'self_improving_proposals',
    category: 'GOVERNANCE',
    rowCount: 5,
    sizeKb: 18,
    description: 'Automated failure cluster proposals, before/after evaluation deltas, and admin approval logs.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', isPrimary: true, nullable: false },
      { name: 'title', type: 'VARCHAR(256)', nullable: false },
      { name: 'affected_component', type: 'VARCHAR(128)', nullable: false },
      { name: 'risk_level', type: 'VARCHAR(16)', nullable: false },
      { name: 'recommended_fix', type: 'TEXT', nullable: false },
      { name: 'before_score', type: 'NUMERIC(5,2)', nullable: false },
      { name: 'after_score', type: 'NUMERIC(5,2)', nullable: false },
      { name: 'status', type: 'VARCHAR(32)', nullable: false },
      { name: 'approved_by', type: 'VARCHAR(128)', nullable: true }
    ]
  }
];

export const POSTGRES_DDL_MIGRATION = `-- Enterprise AI Clinical Assistant PostgreSQL Schema Migration
-- Designed for Local Development and AWS RDS PostgreSQL (pgvector compatible)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Patients Master Table
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    mrn VARCHAR(32) UNIQUE NOT NULL,
    upr_id VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(16) NOT NULL,
    assigned_physician_id VARCHAR(64) NOT NULL,
    hospital_site VARCHAR(128) NOT NULL,
    consent_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_CONSENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Clinical Conditions (ICD-10)
CREATE TABLE IF NOT EXISTS clinical_conditions (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(256) NOT NULL,
    category VARCHAR(32) NOT NULL,
    onset_date DATE NOT NULL,
    clinical_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    severity VARCHAR(32) NOT NULL DEFAULT 'MODERATE'
);

-- 3. Medications
CREATE TABLE IF NOT EXISTS medications (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    dosage VARCHAR(64) NOT NULL,
    route VARCHAR(32) NOT NULL,
    frequency VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    prescribed_date DATE NOT NULL
);

-- 4. Lab Observations (LOINC)
CREATE TABLE IF NOT EXISTS lab_observations (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    value VARCHAR(32) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    reference_range VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    effective_date_time TIMESTAMPTZ NOT NULL
);

-- 5. RAG Document Chunks & Vector Index
CREATE TABLE IF NOT EXISTS rag_document_chunks (
    chunk_id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL,
    section VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    embedding_dense VECTOR(768),
    lexical_tokens TEXT[] NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON rag_document_chunks USING ivfflat (embedding_dense vector_cosine_ops) WITH (lists = 100);

-- 6. Workflow Actions (Human-in-the-Loop)
CREATE TABLE IF NOT EXISTS workflow_actions (
    id VARCHAR(64) PRIMARY KEY,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    workflow_type VARCHAR(64) NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_by VARCHAR(128) NOT NULL,
    state VARCHAR(32) NOT NULL,
    draft_content JSONB NOT NULL,
    approver_signature VARCHAR(256),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Agent Evaluation Traces & AI Judge Verdicts
CREATE TABLE IF NOT EXISTS agent_traces_and_evaluations (
    trace_id VARCHAR(64) PRIMARY KEY,
    request_id VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    purpose_of_use VARCHAR(32) NOT NULL,
    query_sanitized TEXT NOT NULL,
    guardrail_status VARCHAR(32) NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL,
    groundedness_score NUMERIC(5,4) NOT NULL,
    faithfulness_score NUMERIC(5,4) NOT NULL,
    latency_ms INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
