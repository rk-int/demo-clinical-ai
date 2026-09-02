# AWS Cloud Production Mapping

This document details the exact mapping from local zero-friction demo technologies to production-scale AWS Cloud Healthcare infrastructure.

| Architectural Component | Local Demo Stack | Production AWS Service | Enterprise Target Architecture Details |
|---|---|---|---|
| **Experience Layer** | React 19 + Vite SPA + Tailwind | AWS CloudFront + Amazon S3 | Geo-distributed CDN, WAF protection, Origin Access Control (OAC), TLS 1.3 termination. |
| **Identity & SSO** | Local Auth Provider + RBAC/ABAC | AWS Cognito + AWS IAM Identity Center | SAML 2.0 / OIDC federation with Epic/Cerner Hospital Active Directory, MFA enforcement. |
| **API Gateway & Routing** | Express.js Gateway Layer | Amazon API Gateway / AWS AppSync | REST/GraphQL endpoints, VPC private links, rate-limiting, WAF managed rule sets. |
| **Agent Orchestration** | LangGraph Node Flow Engine | AWS Step Functions + AWS Lambda / Amazon ECS | Stateful workflow orchestration, distributed task coordination, dead-letter queues. |
| **AI Foundation Models** | Gemini 3.7 Flash / Pro Adapter | Amazon Bedrock (Claude 3.5 Sonnet / Llama 3) | Private VPC endpoints, zero data retention for HIPAA compliance, provisioned throughput. |
| **Knowledge Vector Search** | Hybrid BM25 + Vector SQLite Store | Amazon OpenSearch Serverless (Vector Engine) | k-NN vector search, lexical BM25 indexing, automated index sharding, AES-256 encryption. |
| **Clinical FHIR Store** | Synthetic FHIR R4 In-Memory / SQLite | AWS HealthLake | Fully managed HIPAA-eligible FHIR R4 repository, integrated clinical search, audit trail. |
| **Guardrails & Content Safety** | Local NeMo Rule Engine | Amazon Bedrock Guardrails + NeMo | Automated PII masking, custom blocked topic filters, prompt attack detection. |
| **Audit & Observability** | In-App Telemetry & Immutable Logs | Amazon CloudWatch + AWS CloudTrail + OpenSearch | Write-once-read-many (WORM) S3 Glacier Vault Lock for immutable HIPAA audit logs. |
| **Secrets & Keys** | Local `.env` | AWS Secrets Manager + AWS KMS | Customer managed keys (CMK) with automated key rotation and envelope encryption. |
