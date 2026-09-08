import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def create_element(name):
    return OxmlElement(name)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = create_element('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def generate_verbatim_docx():
    doc = docx.Document()
    
    # Page Setup
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Title Header
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run("EXECUTIVE DEMO VERBATIM TELEPROMPTER SCRIPT")
    title_run.font.name = "Arial"
    title_run.font.size = Pt(20)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(14, 116, 144) # Cyan-700
    
    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub_p.add_run("Enterprise AI Clinical Assistant — Complete Word-for-Word Read-Out-Loud Script (12 Minutes Max)")
    sub_run.font.name = "Arial"
    sub_run.font.size = Pt(11)
    sub_run.font.italic = True
    sub_run.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph() # Spacer

    # Callout Box
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "F0F9FF")
    cell.width = Inches(6.9)
    
    cp = cell.paragraphs[0]
    cp.paragraph_format.space_before = Pt(6)
    cp.paragraph_format.space_after = Pt(6)
    c_run1 = cp.add_run("📌 TELEPROMPTER INSTRUCTIONS FOR PRESENTER:\n")
    c_run1.font.bold = True
    c_run1.font.size = Pt(10.5)
    c_run1.font.color.rgb = RGBColor(3, 105, 161)
    
    c_run2 = cp.add_run(
        "Open this document on Laptop B (Teleprompter) and read the green spoken text WORD-FOR-WORD out loud. "
        "Perform the blue [ON SCREEN ACTION] instructions on Laptop A (Presentation Laptop) before reading each section. "
        "The script covers all major features and weaves in executive AI terminology to impress management."
    )
    c_run2.font.size = Pt(9.5)
    c_run2.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph() # Spacer

    sections_data = [
        {
            "time": "0:00 - 1:30 (90 Seconds)",
            "title": "SECTION 1: LANDING PAGE & PRESENTATION PANE",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Open Landing Page at http://localhost:3000. Point mouse to top-right toolbar.]"
            ],
            "paragraphs": [
                "Good morning members of executive leadership, Chief Medical Officer, Chief Information Officer, and distinguished colleagues. Today, I am proud to present our Enterprise AI Clinical Assistant—a governed, multi-agent artificial intelligence platform engineered specifically for modern multi-hospital healthcare networks.",
                "Notice that our platform is built around AI Harness Engineering and System-Level Context Orchestration, moving far beyond basic prompt engineering. On the top right of the landing page, we have our built-in Presentation Pane."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Click 'Presentation Pane' button in top-right. Click 'Intro' tab.]",
            "paragraphs2": [
                "Under the Intro tab, you can see our Clinical Intelligence Ecosystem Blueprint, showing how unstructured PDFs, lab feeds, and diagnostic imaging are unified into a single clinical intelligence pipeline while maintaining strict HIPAA and GDPR compliance."
            ],
            "action3": "[ACTION ON PRESENTATION LAPTOP: Click 'Architecture' tab in Presentation Pane.]",
            "paragraphs3": [
                "Under the Architecture tab, we display our full-screen 4K Reference Architecture Blueprint. Using our interactive zoom controls, we can zoom into any layer—from our Edge Load Balancing tier down to our Multi-Agent State Graph Engine, Hybrid RAG Vector Stores, NeMo Safety Guardrails, and Real-Time LLM Telemetry Observability."
            ],
            "action4": "[ACTION ON PRESENTATION LAPTOP: Click 'Scope (In/Out)' tab in Presentation Pane.]",
            "paragraphs4": [
                "Here under our Scope Matrix, we establish clear operational boundaries for management. Our In-Scope architecture provides real-time clinical decision support, FHIR R4 integration, DLP PHI masking, and multi-agent workflow orchestration. Conversely, our Out-of-Scope safeguards guarantee that our AI operates as a non-autonomous Clinical Decision Support System—meaning it cannot write back to production EHR databases or prescribe medications without explicit physician sign-off."
            ],
            "action5": "[ACTION ON PRESENTATION LAPTOP: Click 'Tech Stack' tab in Presentation Pane.]",
            "paragraphs5": [
                "Finally, our Tech Stack matrix outlines our 15-layer developer architecture—from React 19 and Vite 6 on the frontend, to Node.js and Express APIs, Google GenAI SDK, Gemini 3.6 Flash LLMs, and dual vector indexing across PostgreSQL pgvector and Chroma DB."
            ]
        },
        {
            "time": "1:30 - 3:00 (90 Seconds)",
            "title": "SECTION 2: IDENTITY GATEWAY & PURPOSE-BASED AUTHORIZATION",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Click 'Close Overview' button. Click 'Sign In' button in top right.]"
            ],
            "paragraphs": [
                "Now, let us log into the platform through our Enterprise Single Sign-On Identity Gateway. Security and compliance are foundational to our design. Our system supports six distinct clinical personas: Attending Physician, Surgeon Specialist, Clinical Staff Nurse, Care Coordinator, Portal Administrator, and Compliance Auditor."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Click on 'Dr. Sarah Chen, MD (Attending Physician)'. Select Purpose of Use as 'TREATMENT'. Click 'Authorize & Enter Workspace'.]",
            "paragraphs2": [
                "Notice that we enforce Attribute-Based Access Control (ABAC) with mandatory Purpose-of-Use Authorization under HIPAA §164. By selecting 'TREATMENT', the system verifies Dr. Chen's patient cohort assignments before unlocking clinical data.",
                "Furthermore, before any clinical query leaves the browser, our inline Data Leakage Prevention (DLP) engine intercepts the payload, automatically tokenizing and masking Protected Health Information. This prevents cross-user context contamination and ensures multi-tenant cache safety before prompts enter the cloud inference pipeline."
            ]
        },
        {
            "time": "3:00 - 4:15 (75 Seconds)",
            "title": "SECTION 3: PATIENT DIRECTORY & MULTI-HOSPITAL SEARCH",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Clinician Portal opens to Patient Search Directory. Hover over hospital filter buttons.]"
            ],
            "paragraphs": [
                "We are now inside the Clinician Portal. Here in our Multi-Hospital Patient Search Directory, clinicians can seamlessly filter patient records across our regional healthcare facilities—including St. Jude Children's Research Hospital, Metropolitan General Hospital, and City Heart & Vascular Institute."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Type 'Rajesh' into the search bar. Click on patient 'Rajesh Sharma (PT-1000)'.]",
            "paragraphs2": [
                "Let us search for patient Rajesh Sharma, a 58-year-old male with Type 2 Diabetes, Chronic Kidney Disease Stage 3b, and Heart Failure with Reduced Ejection Fraction. We click on his profile to open his comprehensive Patient 360 Workspace."
            ]
        },
        {
            "time": "4:15 - 5:45 (90 Seconds)",
            "title": "SECTION 4: PATIENT 360 WORKSPACE & CONTEXT ENGINEERING",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Patient 360 View opens. Scroll down to show Active Diagnoses, Lab Biomarkers (eGFR 42, HbA1c 8.4%), Vitals, and Medications.]"
            ],
            "paragraphs": [
                "In this Patient 360 Workspace, all medical data is structured according to synthetic HL7 FHIR R4 standards. We see his real-time vital sign trends, active problem lists, laboratory biomarkers such as eGFR of 42 mL/min and HbA1c of 8.4%, and active medication reconciliation.",
                "Here, we practice Context Engineering over naive long-prompting."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Click 'Attach Patient to AI Assistant' button at top right of patient workspace.]",
            "paragraphs2": [
                "By clicking 'Attach Patient to AI Assistant', our backend dynamically serializes Rajesh Sharma's active FHIR parameters into structured JSON tokens and injects them into our active context window.",
                "To manage memory pressure at scale, our inference engine optimizes Prefill vs. Decode Latency using KV Cache Reuse and Semantic Cache Lookup, reducing prefill compute overhead by over 60% while remaining strictly within model context boundaries."
            ]
        },
        {
            "time": "5:45 - 7:45 (120 Seconds)",
            "title": "SECTION 5: CLINICAL KNOWLEDGE AI Q&A & GOVERNED HYBRID RAG",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Click 'AI Assistant' in left navigation bar. Patient badge 'Rajesh Sharma Attached' is visible.]"
            ],
            "paragraphs": [
                "We navigate to the AI Assistant & Clinical Knowledge Q&A Workspace. Notice the active patient context badge confirming that Rajesh Sharma's FHIR profile is securely attached."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Type query in prompt box: 'What are the SGLT2 inhibitor initiation guidelines for Heart Failure with reduced eGFR?' Click 'Submit Query'.]",
            "paragraphs2": [
                "Let us submit a complex clinical query: 'What are the SGLT2 inhibitor initiation guidelines for Heart Failure with reduced eGFR?'",
                "Watch as our Governed Clinical RAG Pipeline executes across 5 pipeline stages: Ingestion, Schema-Aware Chunking, Dual Vector (pgvector/Chroma) plus Lexical BM25 Hybrid Retrieval, Knowledge Graph Reranking, and Grounding Audit."
            ],
            "action3": "[ACTION ON PRESENTATION LAPTOP: AI Response finishes streaming. Scroll down to show Citations, Evidence Confidence (e.g. 92.5%), Token Telemetry Card, and NeMo Audit Summary.]",
            "paragraphs3": [
                "The AI returns a precise, evidence-graded answer citing recent ACC/AHA Heart Failure Guidelines. Notice that every claim is tied directly to source document citations.",
                "Regarding Retrieval Evals: our system measures precision, recall, and attribution in real time using an automated LLM-as-a-Judge evaluating against golden clinical datasets.",
                "Furthermore, our NeMo Guardrails check output safety. If RAG confidence ever drops below 85%, our Model Fallback Ladder automatically triggers a degraded-mode UX, withholding ungrounded claims and escalating directly to physician review."
            ]
        },
        {
            "time": "7:45 - 9:30 (105 Seconds)",
            "title": "SECTION 6: AGENT OPERATIONS & TOPOLOGY CANVAS",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Click 'Agent Operations' in top navigation bar (or Admin workspace).]"
            ],
            "paragraphs": [
                "Now, let us look under the hood at our Agent Operations & Governance Dashboard."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Multi-Agent Topology Canvas is displayed on screen, showing active glowing nodes for Triage, Patient Data, Knowledge, and Workflow Agents.]",
            "paragraphs2": [
                "This is our core Agentic AI Architecture powered by a custom Multi-Agent State Graph Engine.",
                "Rather than relying on a single brittle prompt, we orchestrate four specialized autonomous sub-agents bound by strict Tool Contracts, Idempotency Guarantees, and Loop and Tool Budgets to prevent runaway execution.",
                "Our Triage Agent classifies clinical intent; the Patient Data Agent executes validated tool calls against FHIR endpoints; the Knowledge Agent queries RAG vector stores; and the Workflow Agent enforces schema validation for structured outputs.",
                "If an agent generates malformed JSON, our automated Schema Repair Loop intercepts the payload, repairs syntax errors, and resumes execution seamlessly."
            ]
        },
        {
            "time": "9:30 - 10:45 (75 Seconds)",
            "title": "SECTION 7: CLINICAL WORKFLOW & HUMAN-IN-THE-LOOP ORDERS",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Click 'Workflow Workspace' in left menu. Select 'Discharge Summary & Order Drafting'. Click 'Generate AI Clinical Draft'.]"
            ],
            "paragraphs": [
                "Next, we move to the Workflow & Order Generation Workspace. Here, clinicians can generate AI-drafted discharge summaries, specialist referrals, and medication orders."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Draft order generates in amber box with state 'PENDING_HUMAN_APPROVAL'. Point to digital signature input box.]",
            "paragraphs2": [
                "Observe our Human-in-the-Loop Sign-Off Gate. To satisfy FDA and HIPAA Software as a Medical Device requirements, AI-generated orders remain strictly in a PENDING_HUMAN_APPROVAL state. The order cannot be transmitted or executed until an attending physician enters their digital signature and clicks 'Sign & Execute'."
            ],
            "action3": "[ACTION ON PRESENTATION LAPTOP: Type 'Dr. Sarah Chen, MD' in digital signature field. Click 'Sign & Execute Order'. Status changes to green 'EXECUTED_SIMULATION'.]",
            "paragraphs3": [
                "Dr. Chen signs the order, transitioning the status to executed while maintaining a complete legal audit trail."
            ]
        },
        {
            "time": "10:45 - 12:00 (75 Seconds)",
            "title": "SECTION 8: AUDIT COMPLIANCE CENTER & EXECUTIVE WRAP-UP",
            "actions": [
                "[ACTION ON PRESENTATION LAPTOP: Click 'Audit & Compliance' in left menu.]"
            ],
            "paragraphs": [
                "Finally, we open our Audit & Compliance Governance Center. Every query, agent trace, user role, purpose of use, PHI masking event, and model response is logged to an immutable audit ledger secured with SHA-256 cryptographic checksums."
            ],
            "action2": "[ACTION ON PRESENTATION LAPTOP: Point to Token Usage Telemetry & Cost Card.]",
            "paragraphs2": [
                "We treat LLM Observability as a First-Class Discipline. Our telemetry dashboard tracks prompt tokens, completion tokens, latency spans, and dollar cost attribution per clinician journey. Our resilient LLM Gateway manages dynamic model routing, seamlessly falling back from Gemini 3.6 Flash to Gemini 3.1 Flash-Lite during API quota spikes.",
                "To conclude: by combining Agentic Orchestration, Governed Hybrid RAG, Zero-Trust PHI Protection, and Human-in-the-Loop Safety, we deliver an enterprise-grade AI system that management can trust completely.",
                "Thank you, and I am now ready for your questions."
            ]
        }
    ]

    for sec in sections_data:
        # Title
        h_p = doc.add_paragraph()
        h_p.paragraph_format.space_before = Pt(16)
        h_p.paragraph_format.space_after = Pt(2)
        h_run = h_p.add_run(f"⏱️ [{sec['time']}] — {sec['title']}")
        h_run.font.name = "Arial"
        h_run.font.size = Pt(13)
        h_run.font.bold = True
        h_run.font.color.rgb = RGBColor(14, 116, 144)

        # Loop through actions and paragraphs
        keys = ["actions", "action2", "action3", "action4", "action5"]
        p_keys = ["paragraphs", "paragraphs2", "paragraphs3", "paragraphs4", "paragraphs5"]
        
        for idx in range(len(keys)):
            act_k = keys[idx]
            pk = p_keys[idx]
            
            if act_k in sec:
                for act_text in sec[act_k]:
                    ac_p = doc.add_paragraph()
                    ac_p.paragraph_format.space_before = Pt(4)
                    ac_p.paragraph_format.space_after = Pt(2)
                    a_run = ac_p.add_run(act_text)
                    a_run.font.name = "Arial"
                    a_run.font.size = Pt(9.5)
                    a_run.font.bold = True
                    a_run.font.color.rgb = RGBColor(30, 64, 175) # Blue-800
            
            if pk in sec:
                for speech_text in sec[pk]:
                    sp_p = doc.add_paragraph()
                    sp_p.paragraph_format.left_indent = Inches(0.2)
                    sp_p.paragraph_format.space_before = Pt(2)
                    sp_p.paragraph_format.space_after = Pt(4)
                    s_run = sp_p.add_run(f'"{speech_text}"')
                    s_run.font.name = "Calibri"
                    s_run.font.size = Pt(11)
                    s_run.font.color.rgb = RGBColor(15, 23, 42)

    # Footer note
    foot_p = doc.add_paragraph()
    foot_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    foot_p.paragraph_format.space_before = Pt(20)
    f_run = foot_p.add_run("— END OF VERBATIM TELEPROMPTER SCRIPT —")
    f_run.font.size = Pt(10)
    f_run.font.bold = True
    f_run.font.color.rgb = RGBColor(148, 163, 184)

    # Save Word Document
    doc_path_public = "/Users/rk/Antigravity/demo/demo-clinical-ai/public/Executive_Demo_Presentation_Script_12Min.docx"
    doc_path_root = "/Users/rk/Antigravity/demo/demo-clinical-ai/Executive_Demo_Presentation_Script_12Min.docx"
    doc.save(doc_path_public)
    doc.save(doc_path_root)
    print("Verbatim Docx generated successfully.")

generate_verbatim_docx()
