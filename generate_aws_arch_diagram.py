from PIL import Image, ImageDraw, ImageFont
import os

def draw_rounded_rectangle(draw, xy, corner_radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rectangle([x1 + corner_radius, y1, x2 - corner_radius, y2], fill=fill)
    draw.rectangle([x1, y1 + corner_radius, x2, y2 - corner_radius], fill=fill)
    draw.pieslice([x1, y1, x1 + corner_radius * 2, y1 + corner_radius * 2], 180, 270, fill=fill)
    draw.pieslice([x2 - corner_radius * 2, y1, x2, y1 + corner_radius * 2], 270, 360, fill=fill)
    draw.pieslice([x1, y2 - corner_radius * 2, x1 + corner_radius * 2, y2], 90, 180, fill=fill)
    draw.pieslice([x2 - corner_radius * 2, y2 - corner_radius * 2, x2, y2], 0, 90, fill=fill)
    
    if outline and width > 0:
        draw.arc([x1, y1, x1 + corner_radius * 2, y1 + corner_radius * 2], 180, 270, fill=outline, width=width)
        draw.arc([x2 - corner_radius * 2, y1, x2, y1 + corner_radius * 2], 270, 360, fill=outline, width=width)
        draw.arc([x1, y2 - corner_radius * 2, x1 + corner_radius * 2, y2], 90, 180, fill=outline, width=width)
        draw.arc([x2 - corner_radius * 2, y2 - corner_radius * 2, x2, y2], 0, 90, fill=outline, width=width)
        
        draw.line([x1 + corner_radius, y1, x2 - corner_radius, y1], fill=outline, width=width)
        draw.line([x1 + corner_radius, y2, x2 - corner_radius, y2], fill=outline, width=width)
        draw.line([x1, y1 + corner_radius, x1, y2 - corner_radius], fill=outline, width=width)
        draw.line([x2, y1 + corner_radius, x2, y2 - corner_radius], fill=outline, width=width)

def generate_aws_enterprise_architecture_diagram():
    WIDTH, HEIGHT = 2500, 1750
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0F172A') # Dark Slate background
    draw = ImageDraw.Draw(img)

    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 44, index=1)
        font_subtitle = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 22, index=0)
        font_box_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 24, index=1)
        font_body = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 18, index=0)
        font_small = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 15, index=0)
    except Exception:
        font_title = ImageFont.load_default()
        font_subtitle = font_title
        font_box_title = font_title
        font_body = font_title
        font_small = font_title

    # Header Title
    title_text = "ENTERPRISE HEALTHCARE AI PLATFORM ON AWS"
    draw.text((WIDTH // 2, 50), title_text, fill="#38BDF8", font=font_title, anchor="mm")
    
    sub_text = "HIPAA-ALIGNED AGENTIC RAG REFERENCE ARCHITECTURE — MULTI-AZ / MULTI-REGION"
    draw.text((WIDTH // 2, 95), sub_text, fill="#94A3B8", font=font_subtitle, anchor="mm")

    # Grid Box 1: User Channels & Edge Ingress (Top Left)
    draw_rounded_rectangle(draw, (50, 140, 1220, 480), corner_radius=16, fill="#1E293B", outline="#0284C7", width=3)
    draw.text((70, 170), "1. USER CHANNELS & SECURE EDGE INGRESS", fill="#38BDF8", font=font_box_title)
    
    # Sub-badges inside User Channels
    channels = [
        ("Clinician Portal", "AWS Amplify + CloudFront"),
        ("Voice Dictation", "Amazon Transcribe Medical"),
        ("Partner APIs", "Amazon API Gateway"),
        ("Identity SSO", "Amazon Cognito + SAML"),
        ("DDoS Defense", "AWS WAF + Route 53")
    ]
    for idx, (ch_title, ch_desc) in enumerate(channels):
        x = 70 + (idx % 3) * 370
        y = 210 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#38BDF8", width=2)
        draw.text((x + 15, y + 25), ch_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), ch_desc, fill="#7DD3FC", font=font_small)

    # Grid Box 2: Agentic Orchestration & Amazon Agent Core (Top Right)
    draw_rounded_rectangle(draw, (1260, 140, 2450, 480), corner_radius=16, fill="#1E293B", outline="#A855F7", width=3)
    draw.text((1280, 170), "2. AGENTIC ORCHESTRATION & AMAZON AGENT CORE", fill="#C084FC", font=font_box_title)
    
    agent_units = [
        ("Amazon Agent Core", "Multi-Agent Collaboration Engine"),
        ("Orchestrator Agent", "Task Decomposition & Routing"),
        ("Specialist Knowledge Agent", "Guideline QA & Citations"),
        ("Patient EHR Agent", "FHIR Patient 360 Records"),
        ("Workflow & Orders Agent", "Encounter Booking & SMS Alerts"),
        ("Agent Core Memory", "Long-Term Session State Fusion")
    ]
    for idx, (ag_title, ag_desc) in enumerate(agent_units):
        x = 1280 + (idx % 3) * 370
        y = 210 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#A855F7", width=2)
        draw.text((x + 15, y + 25), ag_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), ag_desc, fill="#E9D5FF", font=font_small)

    # Grid Box 3: Advanced RAG & Health Knowledge Graph (Middle Left)
    draw_rounded_rectangle(draw, (50, 510, 1220, 850), corner_radius=16, fill="#1E293B", outline="#F59E0B", width=3)
    draw.text((70, 540), "3. ADVANCED RAG & HEALTH KNOWLEDGE GRAPH", fill="#FBBF24", font=font_box_title)
    
    rag_units = [
        ("Bedrock Knowledge Bases", "Vector Embeddings & Chunking"),
        ("Amazon OpenSearch", "Hybrid BM25 + Vector Search"),
        ("Amazon Neptune", "Health Knowledge Graph & Ontologies"),
        ("Amazon Textract", "OCR Medical Chart Processing"),
        ("Comprehend Medical", "ICD-10 & RxNorm Entity Detection")
    ]
    for idx, (r_title, r_desc) in enumerate(rag_units):
        x = 70 + (idx % 3) * 370
        y = 580 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#F59E0B", width=2)
        draw.text((x + 15, y + 25), r_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), r_desc, fill="#FDE68A", font=font_small)

    # Grid Box 4: Foundation Models & Guardrails (Middle Right)
    draw_rounded_rectangle(draw, (1260, 510, 2450, 850), corner_radius=16, fill="#1E293B", outline="#10B981", width=3)
    draw.text((1280, 540), "4. FOUNDATION MODELS & BEDROCK GUARDRAILS", fill="#34D399", font=font_box_title)
    
    fm_units = [
        ("Amazon Bedrock", "Claude 3.5 Sonnet Foundation LLM"),
        ("Bedrock Guardrails", "DLP PHI & Prompt Injection Defense"),
        ("SageMaker Endpoints", "Fine-Tuned Clinical Safety Models"),
        ("Semantic Cache", "ElastiCache Redis Response Cache"),
        ("Human-in-the-Loop", "Clinician Sign-off Approval Gate")
    ]
    for idx, (fm_title, fm_desc) in enumerate(fm_units):
        x = 1280 + (idx % 3) * 370
        y = 580 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#10B981", width=2)
        draw.text((x + 15, y + 25), fm_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), fm_desc, fill="#A7F3D0", font=font_small)

    # Grid Box 5: Governed Data Platform & Integration (Bottom Left)
    draw_rounded_rectangle(draw, (50, 880, 1220, 1220), corner_radius=16, fill="#1E293B", outline="#EC4899", width=3)
    draw.text((70, 910), "5. GOVERNED DATA PLATFORM & EHR INTEGRATION", fill="#F472B6", font=font_box_title)
    
    data_units = [
        ("AWS HealthLake", "HIPAA Managed FHIR R4 Datastore"),
        ("Amazon S3 Data Lake", "Parquet/Iceberg Analytical Storage"),
        ("AWS Lake Formation", "Fine-Grained Access Control (FGAC)"),
        ("Amazon Aurora PostgreSQL", "Row-Level Security Operational DB"),
        ("Amazon Redshift", "Enterprise Clinical Data Warehouse"),
        ("Integration Fabric", "AppFlow, MSK, MQ (HL7v2 / DICOM)")
    ]
    for idx, (d_title, d_desc) in enumerate(data_units):
        x = 70 + (idx % 3) * 370
        y = 950 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#EC4899", width=2)
        draw.text((x + 15, y + 25), d_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), d_desc, fill="#FBCFE8", font=font_small)

    # Grid Box 6: Security, Compliance & Observability (Bottom Right)
    draw_rounded_rectangle(draw, (1260, 880, 2450, 1220), corner_radius=16, fill="#1E293B", outline="#EAB308", width=3)
    draw.text((1280, 910), "6. SECURITY, COMPLIANCE & OBSERVABILITY OVERLAY", fill="#FACC15", font=font_box_title)
    
    sec_units = [
        ("AWS KMS & Secrets Manager", "Envelope Encryption & Key Rotation"),
        ("Amazon Macie & GuardDuty", "PHI Discovery & Threat Detection"),
        ("AWS CloudTrail & Security Hub", "Immutable Audit Logs & HIPAA Score"),
        ("AWS X-Ray & CloudWatch", "Multi-Agent Distributed Tracing"),
        ("Agent Core Evaluation", "RAG Groundedness & Recall Harness"),
        ("Multi-Region Resilience", "Aurora Global DB (RPO: 5m | RTO: 15m)")
    ]
    for idx, (s_title, s_desc) in enumerate(sec_units):
        x = 1280 + (idx % 3) * 370
        y = 950 + (idx // 3) * 120
        draw_rounded_rectangle(draw, (x, y, x + 350, y + 100), corner_radius=12, fill="#0F172A", outline="#EAB308", width=2)
        draw.text((x + 15, y + 25), s_title, fill="#FFFFFF", font=font_body)
        draw.text((x + 15, y + 60), s_desc, fill="#FEF08A", font=font_small)

    # Bottom Banner: Implementation Roadmap & Non-Functional Resilience
    draw_rounded_rectangle(draw, (50, 1250, 2450, 1680), corner_radius=16, fill="#0284C7", outline="#38BDF8", width=3)
    draw.text((WIDTH // 2, 1290), "ENTERPRISE ROADMAP & MULTI-REGION RESILIENCE FOUNDATION", fill="#FFFFFF", font=font_box_title, anchor="mm")
    
    phases = [
        ("Phase 1: Pilot (1-2 Hospitals)", "Core RAG, Summary QA, Limited Users"),
        ("Phase 2: Department Rollout", "Expand Workflows, EHR Integration"),
        ("Phase 3: Multi-Hospital Expansion", "Scale Across 25 Hospitals & 200 Clinics"),
        ("Phase 4: Enterprise Adoption", "Autonomous Agents & Continuous Innovation")
    ]
    for idx, (p_title, p_desc) in enumerate(phases):
        x = 80 + idx * 580
        y = 1330
        draw_rounded_rectangle(draw, (x, y, x + 550, y + 120), corner_radius=12, fill="#0F172A", outline="#38BDF8", width=2)
        draw.text((x + 20, y + 35), p_title, fill="#38BDF8", font=font_body)
        draw.text((x + 20, y + 75), p_desc, fill="#E0F2FE", font=font_small)

    # Save to public directory
    out_dir = "/Users/rk/Antigravity/demo/demo-clinical-ai/public"
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, "aws_enterprise_architecture.png")
    img.save(file_path, "PNG", quality=100)
    print(f"High-resolution AWS Architecture diagram successfully saved to: {file_path}")

if __name__ == "__main__":
    generate_aws_enterprise_architecture_diagram()
