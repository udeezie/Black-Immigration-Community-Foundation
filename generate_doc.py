from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Flowable
import datetime

OUTPUT = "/home/user/Black-Immigration-Community-Foundation/JobFlow_Documentation.pdf"

# Colors
PRIMARY = HexColor("#1a1a2e")
ACCENT = HexColor("#4f46e5")
LIGHT_ACCENT = HexColor("#e0e7ff")
MUTED = HexColor("#6b7280")
LIGHT_BG = HexColor("#f9fafb")
BORDER = HexColor("#e5e7eb")
SUCCESS = HexColor("#059669")
WARNING = HexColor("#d97706")

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    rightMargin=0.85*inch,
    leftMargin=0.85*inch,
    topMargin=0.85*inch,
    bottomMargin=0.85*inch,
)

styles = getSampleStyleSheet()

def style(name, **kwargs):
    return ParagraphStyle(name, **kwargs)

title_style = style("DocTitle",
    fontSize=28, fontName="Helvetica-Bold",
    textColor=PRIMARY, spaceAfter=6, alignment=TA_LEFT, leading=34)

subtitle_style = style("DocSubtitle",
    fontSize=13, fontName="Helvetica",
    textColor=MUTED, spaceAfter=4, alignment=TA_LEFT)

date_style = style("DocDate",
    fontSize=10, fontName="Helvetica",
    textColor=MUTED, spaceAfter=20, alignment=TA_LEFT)

h1_style = style("H1",
    fontSize=18, fontName="Helvetica-Bold",
    textColor=PRIMARY, spaceBefore=20, spaceAfter=8, leading=24)

h2_style = style("H2",
    fontSize=13, fontName="Helvetica-Bold",
    textColor=ACCENT, spaceBefore=14, spaceAfter=6, leading=18)

h3_style = style("H3",
    fontSize=11, fontName="Helvetica-Bold",
    textColor=PRIMARY, spaceBefore=10, spaceAfter=4, leading=15)

body_style = style("Body",
    fontSize=10.5, fontName="Helvetica",
    textColor=HexColor("#1f2937"), spaceAfter=8, leading=17, alignment=TA_JUSTIFY)

bullet_style = style("Bullet",
    fontSize=10.5, fontName="Helvetica",
    textColor=HexColor("#1f2937"), spaceAfter=5, leading=16,
    leftIndent=20, bulletIndent=8)

caption_style = style("Caption",
    fontSize=9, fontName="Helvetica-Oblique",
    textColor=MUTED, spaceAfter=4, alignment=TA_CENTER)

highlight_style = style("Highlight",
    fontSize=10.5, fontName="Helvetica-Bold",
    textColor=ACCENT, spaceAfter=6, leading=16)

class ColorBlock(Flowable):
    def __init__(self, text, bg=LIGHT_ACCENT, text_color=ACCENT, width=None, height=36, padding=10):
        super().__init__()
        self.text = text
        self.bg = bg
        self.text_color = text_color
        self.block_width = width
        self.block_height = height
        self.padding = padding

    def wrap(self, availW, availH):
        self.width = self.block_width or availW
        self.height = self.block_height
        return self.width, self.height

    def draw(self):
        self.canv.setFillColor(self.bg)
        self.canv.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        self.canv.setFillColor(self.text_color)
        self.canv.setFont("Helvetica-Bold", 10)
        self.canv.drawString(self.padding, self.height/2 - 4, self.text)

def divider(color=BORDER):
    return HRFlowable(width="100%", thickness=1, color=color, spaceAfter=10, spaceBefore=4)

def sp(n=1):
    return Spacer(1, n * 6)

story = []

# ─── COVER ────────────────────────────────────────────────────────────────────
cover_data = [[
    Paragraph("JobFlow", style("CoverTitle", fontSize=42, fontName="Helvetica-Bold",
        textColor=white, leading=50)),
    ""
]]
cover_table = Table(cover_data, colWidths=[6.8*inch])
cover_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), PRIMARY),
    ("TOPPADDING", (0,0), (-1,-1), 48),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 36),
    ("RIGHTPADDING", (0,0), (-1,-1), 36),
    ("ROUNDEDCORNERS", (0,0), (-1,-1), [8,8,8,8]),
]))
story.append(cover_table)
story.append(sp(2))

story.append(Paragraph("Automated Job Discovery & Application Intelligence Platform", subtitle_style))
story.append(Paragraph("Product Documentation — Version 1.0", date_style))
story.append(Paragraph(f"Date: {datetime.date.today().strftime('%B %d, %Y')}", date_style))
story.append(divider(ACCENT))
story.append(sp(3))

# ─── SECTION 1: EXECUTIVE SUMMARY ─────────────────────────────────────────────
story.append(Paragraph("1. Executive Summary", h1_style))
story.append(divider())
story.append(Paragraph(
    "JobFlow is an intelligent, fully automated job search and application platform designed for software "
    "developers and tech professionals. It removes the manual, repetitive burden of searching job boards, "
    "filtering irrelevant listings, tailoring resumes, and tracking applications by replacing all of it with "
    "a smart, always-on system that works in the background — so the job seeker can focus on preparing for "
    "interviews, not hunting for opportunities.",
    body_style))
story.append(Paragraph(
    "The platform combines workflow automation, artificial intelligence, real-time notifications, and a "
    "clean web dashboard to create an end-to-end job search engine. At its core, JobFlow treats job hunting "
    "as a data problem — one that can be solved systematically, efficiently, and at scale.",
    body_style))
story.append(sp(2))

# ─── SECTION 2: THE PROBLEM ───────────────────────────────────────────────────
story.append(Paragraph("2. The Problem", h1_style))
story.append(divider())

story.append(Paragraph("2.1 The Hidden Cost of Job Searching", h2_style))
story.append(Paragraph(
    "Job searching is one of the most emotionally and mentally exhausting experiences a professional faces. "
    "For software developers specifically, the process is riddled with inefficiencies that consume hours "
    "every day without any guarantee of return. The standard job search workflow looks like this:",
    body_style))

steps = [
    "Open LinkedIn, Wellfound, Indeed, and company career pages separately",
    "Scroll through dozens of listings — most of which are irrelevant",
    "Read each job description manually to assess fit",
    "Copy and paste your resume into a new document and adjust it for the role",
    "Write a cover letter that feels different from the last ten",
    "Fill out a long application form with information already on your resume",
    "Track everything in a spreadsheet that quickly becomes outdated",
    "Repeat this process every single day for weeks or months",
]
for s in steps:
    story.append(Paragraph(f"• {s}", bullet_style))

story.append(sp(2))
story.append(Paragraph("2.2 The Scale of the Problem", h2_style))

stats_data = [
    ["Metric", "Reality"],
    ["Average job search duration", "3 to 6 months"],
    ["Hours spent per week searching", "10 to 20 hours"],
    ["Applications needed for one offer", "100 to 200+"],
    ["Rejection rate with generic resume", "Over 75%"],
    ["Time spent on non-interview tasks", "Over 80% of total search time"],
]
stats_table = Table(stats_data, colWidths=[3.2*inch, 3.4*inch])
stats_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PRIMARY),
    ("TEXTCOLOR", (0,0), (-1,0), white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [LIGHT_BG, white]),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 12),
    ("RIGHTPADDING", (0,0), (-1,-1), 12),
    ("ROUNDEDCORNERS", (0,0), (-1,-1), [4,4,4,4]),
]))
story.append(stats_table)
story.append(sp(2))

story.append(Paragraph("2.3 Why Existing Tools Fall Short", h2_style))
story.append(Paragraph(
    "Several tools exist to help job seekers — Huntr, Teal, Simplify, and JobScan among them. "
    "However, all of these tools are passive. They help you organize applications you find yourself. "
    "None of them actively find jobs for you, score them against your profile, tailor your resume "
    "automatically, or prepare your application. They digitize the problem instead of solving it.",
    body_style))

gap_data = [
    ["Capability", "Existing Tools", "JobFlow"],
    ["Auto-discover new listings", "No", "Yes"],
    ["AI-powered relevance scoring", "No", "Yes"],
    ["Resume tailored per role", "No", "Yes"],
    ["Real-time alerts for top matches", "No", "Yes"],
    ["Centralized review dashboard", "Partial", "Yes"],
    ["Mobile access (iOS)", "No", "Yes"],
    ["Application pre-fill automation", "No", "Yes"],
]
gap_table = Table(gap_data, colWidths=[2.8*inch, 1.8*inch, 1.8*inch])
gap_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), ACCENT),
    ("TEXTCOLOR", (0,0), (-1,0), white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [LIGHT_BG, white]),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 12),
    ("RIGHTPADDING", (0,0), (-1,-1), 12),
    ("TEXTCOLOR", (2,1), (2,-1), SUCCESS),
    ("FONTNAME", (2,1), (2,-1), "Helvetica-Bold"),
]))
story.append(gap_table)
story.append(sp(3))

# ─── SECTION 3: THE SOLUTION ──────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("3. The Solution", h1_style))
story.append(divider())
story.append(Paragraph(
    "JobFlow is built on a simple but powerful principle: a developer's time is too valuable to spend "
    "on repetitive search tasks. The platform automates every stage of the job search pipeline — from "
    "discovery to application — while keeping the human in control of every final decision.",
    body_style))

story.append(Paragraph("3.1 System Overview", h2_style))

phases = [
    ("Phase 1", "Discovery", "Automated workflows scan job boards multiple times per day and collect new listings matching your target role and technology stack."),
    ("Phase 2", "Filtering", "Raw listings are filtered against your criteria — removing senior roles, irrelevant industries, or technologies outside your focus."),
    ("Phase 3", "AI Scoring", "Each filtered job is analyzed by AI against your skill profile and scored from 1 to 10 based on fit, requirements match, and opportunity quality."),
    ("Phase 4", "Notification", "When a high-scoring job appears, you receive an instant alert with the company name, role, score, and direct link — no daily manual checking required."),
    ("Phase 5", "Resume Tailoring", "For approved opportunities, AI extracts key requirements from the job description and generates a tailored version of your resume highlighting the most relevant experience."),
    ("Phase 6", "Dashboard Review", "A clean web dashboard lets you review all collected jobs, scores, tailored resumes, and generated cover letters before deciding to apply."),
    ("Phase 7", "Application", "For approved applications, browser automation pre-fills standard form fields, uploads your tailored resume, and pauses before final submission for your review."),
]

for code, name, desc in phases:
    phase_data = [[
        Paragraph(code, style("PhCode", fontSize=9, fontName="Helvetica-Bold", textColor=white)),
        Paragraph(f"<b>{name}</b><br/>{desc}",
            style("PhDesc", fontSize=10, fontName="Helvetica", textColor=HexColor("#1f2937"), leading=15)),
    ]]
    t = Table(phase_data, colWidths=[0.8*inch, 5.8*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), ACCENT),
        ("BACKGROUND", (1,0), (1,0), LIGHT_BG),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING", (0,0), (0,0), 8),
        ("LEFTPADDING", (1,0), (1,0), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("LINEABOVE", (0,0), (-1,0), 0.5, BORDER),
    ]))
    story.append(t)
    story.append(sp(1))

story.append(sp(2))
story.append(Paragraph("3.2 Technology Stack", h2_style))

tech_data = [
    ["Layer", "Technology", "Purpose"],
    ["Automation Engine", "n8n", "Orchestrates all workflows and scheduling"],
    ["Database", "Supabase (PostgreSQL)", "Stores all jobs, scores, and application data"],
    ["AI Intelligence", "OpenAI GPT-4", "Job scoring and resume tailoring"],
    ["Web Dashboard", "Next.js + Tailwind CSS", "Job review and management interface"],
    ["PDF Generation", "React PDF", "Produces tailored resume documents"],
    ["Browser Automation", "Playwright", "Pre-fills and submits job applications"],
    ["Mobile App", "Swift (iOS)", "On-the-go job review and notifications"],
    ["Authentication", "Supabase Auth", "Secure user accounts and sessions"],
    ["Notifications", "Discord / Email / Push", "Real-time alerts for high-score matches"],
]
tech_table = Table(tech_data, colWidths=[1.8*inch, 2.1*inch, 2.7*inch])
tech_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PRIMARY),
    ("TEXTCOLOR", (0,0), (-1,0), white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 10),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [LIGHT_BG, white]),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 12),
    ("RIGHTPADDING", (0,0), (-1,-1), 12),
]))
story.append(tech_table)
story.append(sp(3))

# ─── SECTION 4: WHO IT HELPS ──────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("4. Who This Helps & Long-Term Impact", h1_style))
story.append(divider())

story.append(Paragraph("4.1 Primary Users", h2_style))
story.append(Paragraph(
    "JobFlow is built for software developers and tech professionals at any stage of their career "
    "who are actively searching for new opportunities. This includes:",
    body_style))

users = [
    ("Junior Developers", "Entering the workforce for the first time, competing against hundreds of applicants per role. The AI scoring system helps them target only the roles they can realistically win."),
    ("Mid-Level Developers", "Exploring better opportunities while currently employed. The automation runs quietly in the background, alerting them only to strong matches without requiring daily attention."),
    ("Bootcamp Graduates", "Navigating an overwhelming market with limited network connections. The platform levels the playing field by applying volume and precision simultaneously."),
    ("Developers Between Jobs", "Under time and financial pressure. Every hour saved on search is an hour that can go toward interview preparation, portfolio work, or freelance income."),
    ("Career Changers", "Transitioning into tech from another field. The AI helps identify which roles are realistic given their current skill set and flags the skill gaps holding them back."),
]
for title, desc in users:
    story.append(Paragraph(f"<b>{title}</b>", h3_style))
    story.append(Paragraph(desc, body_style))

story.append(Paragraph("4.2 The Long-Term Impact on Job Seekers", h2_style))
story.append(Paragraph(
    "The impact of JobFlow extends beyond saving time. When a developer is freed from the mechanical "
    "work of searching, filtering, and rewriting resumes, several things happen:",
    body_style))

impacts = [
    ("Better Applications", "When time is not spent hunting, it can be spent perfecting. Each application submitted through JobFlow is tailored, specific, and stronger than a generic submission."),
    ("Reduced Burnout", "Job searching is one of the leading causes of mental health strain for professionals. Removing the repetitive, demoralizing parts of the process dramatically reduces emotional exhaustion."),
    ("Higher Response Rates", "Research consistently shows that tailored resumes and personalized cover letters receive significantly higher callback rates than generic applications. JobFlow makes personalization automatic."),
    ("Faster Placement", "By running continuously and applying volume intelligently, the platform shortens the average time from search start to first offer — potentially by weeks or months."),
    ("Data-Driven Decisions", "Over time, the system accumulates data about which types of roles respond, which companies view applications, and what language in job descriptions predicts a good fit. This turns gut feeling into informed strategy."),
    ("Equal Access", "Not every developer has a strong professional network, a prestigious university name, or a recruiter in their corner. JobFlow gives every developer access to the same systematic advantage previously reserved for those with connections."),
]
for title, desc in impacts:
    impact_data = [[
        Paragraph(f"<b>{title}</b><br/>{desc}",
            style("ImpDesc", fontSize=10.5, fontName="Helvetica", textColor=HexColor("#1f2937"), leading=16)),
    ]]
    t = Table(impact_data, colWidths=[6.4*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
        ("LEFTPADDING", (0,0), (-1,-1), 14),
        ("RIGHTPADDING", (0,0), (-1,-1), 14),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LINEBEFORE", (0,0), (0,-1), 3, ACCENT),
        ("LINEABOVE", (0,0), (-1,0), 0.3, BORDER),
    ]))
    story.append(t)
    story.append(sp(1))

story.append(sp(3))

# ─── SECTION 5: DEVELOPMENT ROADMAP ──────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("5. Development Roadmap", h1_style))
story.append(divider())

roadmap = [
    ("Stage 1", "Foundation", "Days 1–2",
     "Set up Supabase database schema. Configure n8n automation platform. Establish project structure and repository."),
    ("Stage 2", "Job Collection", "Days 3–4",
     "Connect job board sources. Build first automated workflow. Implement filtering logic for relevant roles."),
    ("Stage 3", "AI Intelligence", "Days 5–6",
     "Integrate OpenAI API. Build job scoring system. Test and tune scoring prompts against real listings."),
    ("Stage 4", "Notifications", "Day 7",
     "Set up real-time alerts via Discord and email. Define score threshold for notifications."),
    ("Stage 5", "Dashboard", "Days 8–10",
     "Build Next.js dashboard. Connect to Supabase. Implement job review, status management, and cover letter generation."),
    ("Stage 6", "Resume Tailoring", "Days 11–12",
     "Build AI resume customization workflow. Integrate React PDF for document generation. Test output quality."),
    ("Stage 7", "Application Automation", "Days 13–15",
     "Implement Playwright browser automation. Build form pre-fill logic. Add manual review checkpoint before submission."),
    ("Stage 8", "Mobile App", "Days 16–21",
     "Build iOS app in Swift. Connect to Supabase backend. Implement push notifications, job browser, and approval flow."),
    ("Stage 9", "Launch & Iterate", "Day 22+",
     "Internal testing. Bug fixes. Public launch on ProductHunt. Gather user feedback and iterate."),
]

road_data = [["Stage", "Name", "Timeline", "Description"]]
for code, name, timeline, desc in roadmap:
    road_data.append([code, name, timeline, desc])

road_table = Table(road_data, colWidths=[0.7*inch, 1.3*inch, 1.1*inch, 3.5*inch])
road_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PRIMARY),
    ("TEXTCOLOR", (0,0), (-1,0), white),
    ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
    ("FONTSIZE", (0,0), (-1,-1), 9.5),
    ("FONTNAME", (0,1), (-1,-1), "Helvetica"),
    ("FONTNAME", (0,1), (1,-1), "Helvetica-Bold"),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [LIGHT_BG, white]),
    ("GRID", (0,0), (-1,-1), 0.5, BORDER),
    ("TOPPADDING", (0,0), (-1,-1), 8),
    ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ("LEFTPADDING", (0,0), (-1,-1), 10),
    ("RIGHTPADDING", (0,0), (-1,-1), 10),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("TEXTCOLOR", (0,1), (0,-1), ACCENT),
]))
story.append(road_table)
story.append(sp(3))

# ─── SECTION 6: MONETIZATION ──────────────────────────────────────────────────
story.append(Paragraph("6. Monetization Strategy", h1_style))
story.append(divider())
story.append(Paragraph(
    "While the initial build is personal, JobFlow is architected from the start to support a "
    "multi-user SaaS model. The monetization strategy is straightforward:",
    body_style))

tiers = [
    ("Free Tier", "$0 / month", ["Job discovery and collection", "Basic filtering", "Dashboard access", "Up to 50 jobs stored", "Community support"]),
    ("Pro Tier", "$12 / month", ["Everything in Free", "AI job scoring", "Resume tailoring per role", "Cover letter generation", "Real-time notifications", "iOS mobile app", "Up to 500 jobs stored"]),
    ("Lifetime Access", "$79 one-time", ["Everything in Pro", "No recurring billing", "Priority support", "Early access to new features"]),
]

tier_tables = []
for tier_name, price, features in tiers:
    rows = [
        [Paragraph(tier_name, style("TN", fontSize=12, fontName="Helvetica-Bold", textColor=white))],
        [Paragraph(price, style("TP", fontSize=18, fontName="Helvetica-Bold", textColor=ACCENT))],
    ]
    for f in features:
        rows.append([Paragraph(f"✓  {f}", style("TF", fontSize=9.5, fontName="Helvetica", textColor=HexColor("#374151"), leading=14))])

    t = Table(rows, colWidths=[2.0*inch])
    bg = PRIMARY if tier_name == "Pro Tier" else LIGHT_BG
    header_bg = ACCENT if tier_name == "Pro Tier" else PRIMARY
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), header_bg),
        ("BACKGROUND", (0,1), (-1,-1), bg),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("BOX", (0,0), (-1,-1), 1, BORDER),
    ]))
    tier_tables.append(t)

combined = Table([tier_tables], colWidths=[2.1*inch, 2.1*inch, 2.1*inch])
combined.setStyle(TableStyle([
    ("LEFTPADDING", (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ("VALIGN", (0,0), (-1,-1), "TOP"),
]))
story.append(combined)
story.append(sp(2))
story.append(Paragraph(
    "At just 200 paying users on the Pro tier, the platform generates $2,400/month in recurring revenue. "
    "The developer tools market is proven to convert at above-average rates because the target audience "
    "understands software value and pays for tools that save them time.",
    body_style))
story.append(sp(3))

# ─── SECTION 7: CLOSING ───────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("7. Closing Statement", h1_style))
story.append(divider())
story.append(Paragraph(
    "Job searching has not fundamentally changed in twenty years. Developers still open the same websites, "
    "read the same listings manually, write the same cover letters, and wait in the same silence. "
    "The tools that exist today organize the problem. JobFlow eliminates it.",
    body_style))
story.append(Paragraph(
    "This is not a job tracker. It is an always-on, intelligent career agent that works while you sleep, "
    "finds opportunities you would have missed, prepares applications tailored specifically to each role, "
    "and only asks for your attention when something genuinely worth your time appears.",
    body_style))
story.append(Paragraph(
    "For the individual developer, it means less time searching and more time preparing. "
    "For the broader ecosystem, it means a more equitable job market where the quality of your skills "
    "matters more than the size of your network or the hours you can afford to spend searching.",
    body_style))
story.append(Paragraph(
    "This is a problem worth solving. JobFlow is how we solve it.",
    style("Closing", fontSize=12, fontName="Helvetica-Bold", textColor=PRIMARY,
          spaceAfter=8, leading=18, alignment=TA_CENTER)))

story.append(sp(4))
story.append(divider(ACCENT))
story.append(Paragraph(
    f"JobFlow — Product Documentation v1.0 — {datetime.date.today().strftime('%B %Y')}",
    caption_style))

doc.build(story)
print(f"PDF generated: {OUTPUT}")
