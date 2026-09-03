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

def generate_local_architecture_diagram():
    WIDTH, HEIGHT = 2400, 1850
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Load system font or default
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 48, index=1)
        font_subtitle = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 22, index=0)
        font_box_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 30, index=1)
        font_body = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 22, index=0)
        font_small = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 18, index=0)
    except Exception:
        font_title = ImageFont.load_default()
        font_subtitle = font_title
        font_box_title = font_title
        font_body = font_title
        font_small = font_title

    # Header Title
    title_text = "LOCAL DEVELOPMENT ARCHITECTURE"
    draw.text((WIDTH // 2, 60), title_text, fill="#1E3A8A", font=font_title, anchor="mm")
    
    sub_text = "HEALTHNET CLINICAL AI PLATFORM — LOCAL TECH STACK ARCHITECTURE"
    draw.text((WIDTH // 2, 110), sub_text, fill="#64748B", font=font_subtitle, anchor="mm")

    # Helper Arrow Drawing Function
    def draw_down_arrow(start_y, end_y, text="", color="#475569"):
        x = WIDTH // 2
        draw.line([(x, start_y), (x, end_y)], fill=color, width=4)
        # Arrowhead
        draw.polygon([(x - 12, end_y - 18), (x + 12, end_y - 18), (x, end_y)], fill=color)
        if text:
            draw.rectangle([x - 140, start_y + (end_y - start_y) // 2 - 14, x + 140, start_y + (end_y - start_y) // 2 + 14], fill="#FFFFFF", outline="#CBD5E1")
            draw.text((x, start_y + (end_y - start_y) // 2), text, fill="#334155", font=font_small, anchor="mm")

    current_y = 150

    # 1. React + TypeScript UI Box
    box_w, box_h = 1700, 110
    x1 = (WIDTH - box_w) // 2
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#EFF6FF", outline="#2563EB", width=4)
    draw.text((WIDTH // 2, current_y + 40), "React 18 + TypeScript UI (Vite)", fill="#1E40AF", font=font_box_title, anchor="mm")
    draw.text((WIDTH // 2, current_y + 80), "localhost:3000 • Glassmorphism UI Engine • Multi-Hospital Context Router", fill="#3B82F6", font=font_body, anchor="mm")

    current_y += box_h
    draw_down_arrow(current_y, current_y + 60, "REST / JSON API Calls", "#2563EB")
    current_y += 60

    # 2. FastAPI / Node.js Clinical AI Gateway Box
    box_h = 160
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#F0FDF4", outline="#16A34A", width=4)
    draw.text((WIDTH // 2, current_y + 35), "Clinical AI Gateway & Pipeline Orchestrator", fill="#15803D", font=font_box_title, anchor="mm")
    draw.text((WIDTH // 2, current_y + 65), "Node.js / Express Gateway (localhost:3000) • Zero-Trust TLS Ingress", fill="#166534", font=font_small, anchor="mm")

    # Badges inside Gateway
    badges = ["Authentication", "RBAC", "PHI Validation", "Intent Routing", "Agent Orchestration", "Guardrails"]
    bw, bh = 220, 42
    total_bw = len(badges) * bw + (len(badges) - 1) * 30
    bx_start = (WIDTH - total_bw) // 2
    by = current_y + 98
    for i, b in enumerate(badges):
        bx = bx_start + i * (bw + 30)
        draw_rounded_rectangle(draw, (bx, by, bx + bw, by + bh), corner_radius=12, fill="#FFFFFF", outline="#22C55E", width=2)
        draw.text((bx + bw // 2, by + bh // 2), b, fill="#14532D", font=font_small, anchor="mm")
        if i < len(badges) - 1:
            # Arrow between badges
            ax = bx + bw + 15
            draw.line([(ax - 8, by + bh // 2), (ax + 8, by + bh // 2)], fill="#16A34A", width=3)
            draw.polygon([(ax + 4, by + bh // 2 - 6), (ax + 4, by + bh // 2 + 6), (ax + 12, by + bh // 2)], fill="#16A34A")

    current_y += box_h
    draw_down_arrow(current_y, current_y + 65, "Orchestrate Agent Dispatch", "#16A34A")
    current_y += 65

    # 3. 3 Specialist Agents Grid
    agent_w = 540
    agent_h = 220
    spacing = 40
    total_aw = 3 * agent_w + 2 * spacing
    ax_start = (WIDTH - total_aw) // 2

    # Agent 1: Patient Data Agent
    ax1 = ax_start
    draw_rounded_rectangle(draw, (ax1, current_y, ax1 + agent_w, current_y + agent_h), corner_radius=20, fill="#FAF5FF", outline="#9333EA", width=4)
    draw.text((ax1 + agent_w // 2, current_y + 35), "Patient EHR Agent", fill="#6B21A8", font=font_box_title, anchor="mm")
    draw.text((ax1 + 40, current_y + 80), "• Synthetic FHIR R4 JSON Records", fill="#581C87", font=font_body)
    draw.text((ax1 + 40, current_y + 120), "• Patient 360 Timeline Context", fill="#581C87", font=font_body)
    draw.text((ax1 + 40, current_y + 160), "• Observations, Vitals, & Labs", fill="#581C87", font=font_body)

    # Agent 2: Clinical Knowledge Agent
    ax2 = ax1 + agent_w + spacing
    draw_rounded_rectangle(draw, (ax2, current_y, ax2 + agent_w, current_y + agent_h), corner_radius=20, fill="#EFF6FF", outline="#2563EB", width=4)
    draw.text((ax2 + agent_w // 2, current_y + 35), "Clinical Knowledge Agent", fill="#1E40AF", font=font_box_title, anchor="mm")
    draw.text((ax2 + 40, current_y + 80), "• Hybrid RAG Guidelines Retrieval", fill="#1E3A8A", font=font_body)
    draw.text((ax2 + 40, current_y + 120), "• KDIGO / GOLD / AHA Knowledge Base", fill="#1E3A8A", font=font_body)
    draw.text((ax2 + 40, current_y + 160), "• Medical Evidence & Citations Search", fill="#1E3A8A", font=font_body)

    # Agent 3: Workflow Agent
    ax3 = ax2 + agent_w + spacing
    draw_rounded_rectangle(draw, (ax3, current_y, ax3 + agent_w, current_y + agent_h), corner_radius=20, fill="#FFFBEB", outline="#D97706", width=4)
    draw.text((ax3 + agent_w // 2, current_y + 35), "Workflow & Orders Agent", fill="#92400E", font=font_box_title, anchor="mm")
    draw.text((ax3 + 40, current_y + 80), "• Encounter Booking & Rescheduling", fill="#78350F", font=font_body)
    draw.text((ax3 + 40, current_y + 120), "• SMS & Email Alert Dispatch", fill="#78350F", font=font_body)
    draw.text((ax3 + 40, current_y + 160), "• Specialist Referral & Order Drafting", fill="#78350F", font=font_body)

    current_y += agent_h

    # Converging Lines to Context Fusion
    mid_x = WIDTH // 2
    fuse_top_y = current_y + 60
    draw.line([(ax1 + agent_w // 2, current_y), (ax1 + agent_w // 2, current_y + 30), (mid_x, current_y + 30), (mid_x, fuse_top_y)], fill="#9333EA", width=3)
    draw.line([(ax2 + agent_w // 2, current_y), (mid_x, fuse_top_y)], fill="#2563EB", width=3)
    draw.line([(ax3 + agent_w // 2, current_y), (ax3 + agent_w // 2, current_y + 30), (mid_x, current_y + 30), (mid_x, fuse_top_y)], fill="#D97706", width=3)
    draw.polygon([(mid_x - 10, fuse_top_y - 4), (mid_x + 10, fuse_top_y - 4), (mid_x, fuse_top_y + 10)], fill="#2563EB")

    current_y = fuse_top_y + 10

    # 4. Context Fusion & Prompt Manager Box
    box_h = 130
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#FEF3C7", outline="#D97706", width=4)
    draw.text((WIDTH // 2, current_y + 35), "Context Fusion & System Prompt Assembly", fill="#92400E", font=font_box_title, anchor="mm")
    
    col_w = box_w // 3
    draw.text((x1 + col_w * 0.5, current_y + 85), "• Merge Patient EHR + Knowledge", fill="#78350F", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 1.5, current_y + 85), "• Build Zero-Shot System Instructions", fill="#78350F", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 2.5, current_y + 85), "• Apply Clinical Safety Templates", fill="#78350F", font=font_body, anchor="mm")

    current_y += box_h
    draw_down_arrow(current_y, current_y + 55, "Prompt Payload", "#D97706")
    current_y += 55

    # 5. Clinical LLM Inference Engine Box
    box_h = 130
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#F0FDFA", outline="#0D9488", width=4)
    draw.text((WIDTH // 2, current_y + 35), "Clinical LLM Inference Engine (Gemini / Local Model)", fill="#115E59", font=font_box_title, anchor="mm")
    
    draw.text((x1 + col_w * 0.5, current_y + 85), "• Local Model Clinical Reasoning", fill="#134E4A", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 1.5, current_y + 85), "• Zero-Speculation Medical Rules", fill="#134E4A", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 2.5, current_y + 85), "• Multi-Modal Payload Inference", fill="#134E4A", font=font_body, anchor="mm")

    current_y += box_h
    draw_down_arrow(current_y, current_y + 55, "Unvalidated LLM Output", "#0D9488")
    current_y += 55

    # 6. Response Validator & Guardrails Box
    box_h = 130
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#FFF1F2", outline="#E11D48", width=4)
    draw.text((WIDTH // 2, current_y + 35), "Response Validation & Safety Guardrails", fill="#9F1239", font=font_box_title, anchor="mm")
    
    col4_w = box_w // 4
    draw.text((x1 + col4_w * 0.5, current_y + 85), "• DLP PHI Redaction Check", fill="#881337", font=font_small, anchor="mm")
    draw.text((x1 + col4_w * 1.5, current_y + 85), "• Zero-Hallucination Token Check", fill="#881337", font=font_small, anchor="mm")
    draw.text((x1 + col4_w * 2.5, current_y + 85), "• Medical Citation Validation", fill="#881337", font=font_small, anchor="mm")
    draw.text((x1 + col4_w * 3.5, current_y + 85), "• LOINC / ICD-10 Code Verification", fill="#881337", font=font_small, anchor="mm")

    current_y += box_h
    draw_down_arrow(current_y, current_y + 55, "Validated Clinical Output", "#E11D48")
    current_y += 55

    # 7. Final Clinical Response Output Box
    box_h = 120
    draw_rounded_rectangle(draw, (x1, current_y, x1 + box_w, current_y + box_h), corner_radius=20, fill="#DCFCE7", outline="#15803D", width=4)
    draw.text((WIDTH // 2, current_y + 35), "Final Clinician-Ready Response & Action Delivery", fill="#14532D", font=font_box_title, anchor="mm")
    
    draw.text((x1 + col_w * 0.5, current_y + 80), "• Clinician-Ready Chart Summary", fill="#166534", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 1.5, current_y + 80), "• Supporting Guideline Citations", fill="#166534", font=font_body, anchor="mm")
    draw.text((x1 + col_w * 2.5, current_y + 80), "• Safety-Validated Clinical Output", fill="#166534", font=font_body, anchor="mm")

    # Save to public directory
    out_dir = "/Users/rk/Antigravity/demo/demo-clinical-ai/public"
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, "local_development_architecture.png")
    img.save(file_path, "PNG", quality=100)
    print(f"High-resolution diagram successfully saved to: {file_path}")

if __name__ == "__main__":
    generate_local_architecture_diagram()
