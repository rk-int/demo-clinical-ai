# ADR 002: Multi-Layer AI Guardrails, PHI DLP Masking, and Workflow Approval Gates

## Status
Accepted

## Context
Generative AI in clinical environments introduces risks of prompt injection attacks, accidental PHI exposure in logs/telemetry, unapproved medication ordering, and ungrounded diagnostic speculation.

## Decision
1. **Multi-Layer NeMo Guardrail Engine**: Both input prompts and model outputs are filtered for injection vectors, jailbreak tokens, offensive content, and out-of-scope clinical speculation.
2. **Deterministic PHI DLP Scrubbing**: All logs, operations streams, and telemetry events pass through regular-expression and named-entity masking before emission.
3. **Mandatory Human-in-the-Loop Approval Gates**: Any workflow action (note finalization, referral creation, appointment scheduling) produces a pending draft requiring explicit clinician sign-off with simulated rollback capabilities.
4. **Governed Self-Improvement**: The Self-Improving Agent is restricted to observational evaluation and can only generate recommendations into an administrator queue.

## Consequences
- Guaranteed compliance with HIPAA Privacy & Security Rules.
- Absolute prevention of unauthorized clinical mutation.
