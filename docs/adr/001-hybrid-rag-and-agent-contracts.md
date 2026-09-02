# ADR 001: Typed Agent Contracts and Multi-Stage Hybrid RAG Architecture

## Status
Accepted

## Context
The Enterprise AI Clinical Assistant requires modular orchestration among 4 distinct agent domains (Knowledge, Patient Data, Workflow, Self-Improving) while maintaining verifiable auditability, zero hallucination, and HIPAA/GDPR compliance.

## Decision
1. **Typed Agent Contracts**: Every agent input and output must conform to strict JSON schemas with metadata: `agent_name`, `agent_version`, `trace_id`, `actor`, `purpose_of_use`, `patient_scope`, `authorization_decision`, `tools_invoked`, `evidence_items`, `confidence`, `guardrail_events`, `human_approval_required`, `latency_ms`, and `status`.
2. **Hybrid RAG Pipeline**: Combining BM25 lexical token matching with dense vector cosine similarity, followed by metadata filtering (hospital site, specialty, version, approval state) and claim-to-chunk citation verification.
3. **Calibrated Confidence**: Confidence is calculated from evidence coverage percentage and retrieval relevance, not model probability distribution.

## Consequences
- **Positive**: 100% auditable traces, verifiable evidence lineage, deterministic safe fallbacks.
- **Negative**: Slight overhead in parsing and validating JSON contracts between orchestrator and agent boundaries.
