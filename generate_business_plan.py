from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer,
    HRFlowable, Table, TableStyle, PageBreak, NextPageTemplate, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas as canvasmodule
import datetime

OUTPUT = "/home/user/Black-Immigration-Community-Foundation/Aploy_Business_Plan.pdf"

W, H       = letter
MARGIN     = 0.85 * inch
CW         = W - 2 * MARGIN   # content width

# ── Palette ───────────────────────────────────────────────────────────────────
INK        = HexColor("#0f172a")
NAVY       = HexColor("#1e3a5f")
INDIGO     = HexColor("#4f46e5")
INDIGO_LT  = HexColor("#e0e7ff")
SLATE      = HexColor("#475569")
MUTED      = HexColor("#94a3b8")
SURFACE    = HexColor("#f8fafc")
BORDER     = HexColor("#e2e8f0")
GREEN      = HexColor("#059669")
GREEN_LT   = HexColor("#d1fae5")
AMBER      = HexColor("#d97706")
AMBER_LT   = HexColor("#fef3c7")
RED        = HexColor("#dc2626")


# ── Styles ────────────────────────────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

H1    = S("H1",  fontSize=20, fontName="Helvetica-Bold", textColor=INK,    spaceBefore=10, spaceAfter=6,  leading=26)
H2    = S("H2",  fontSize=13, fontName="Helvetica-Bold", textColor=INK,    spaceBefore=14, spaceAfter=5,  leading=18)
H3    = S("H3",  fontSize=11, fontName="Helvetica-Bold", textColor=INDIGO, spaceBefore=10, spaceAfter=4,  leading=15)
BODY  = S("BD",  fontSize=10.5, fontName="Helvetica",   textColor=HexColor("#1e293b"), spaceAfter=8, leading=18, alignment=TA_JUSTIFY)
BODYL = S("BDL", fontSize=10.5, fontName="Helvetica",   textColor=HexColor("#1e293b"), spaceAfter=8, leading=18)
BUL   = S("BUL", fontSize=10.5, fontName="Helvetica",   textColor=HexColor("#1e293b"), spaceAfter=5, leading=17, leftIndent=16)
CAP   = S("CAP", fontSize=9,   fontName="Helvetica-Oblique", textColor=MUTED, spaceAfter=4, alignment=TA_CENTER)
TOCL  = S("TOC", fontSize=11,  fontName="Helvetica",    textColor=INK,    spaceAfter=2, leading=18)
TOCP  = S("TOCP",fontSize=11,  fontName="Helvetica",    textColor=MUTED,  spaceAfter=2, leading=18, alignment=TA_RIGHT)


def sp(n=1):
    return Spacer(1, n * 6)

def rule(color=BORDER, t=0.75, before=4, after=10):
    return HRFlowable(width="100%", thickness=t, color=color, spaceBefore=before, spaceAfter=after)


# ── Canvas class with header / footer ────────────────────────────────────────
class DocCanvas(canvasmodule.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._pages = []

    def showPage(self):
        self._pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._pages)
        for i, state in enumerate(self._pages):
            self.__dict__.update(state)
            pg = self._pageNumber
            if pg > 2:           # skip cover and TOC
                self._draw_header()
                self._draw_footer(pg - 2, total - 2)
            super().showPage()
        super().save()

    def _draw_header(self):
        self.setFillColor(INK)
        self.rect(0, H - 0.48 * inch, W, 0.48 * inch, fill=1, stroke=0)
        self.setFillColor(white)
        self.setFont("Helvetica-Bold", 9)
        self.drawString(MARGIN, H - 0.29 * inch, "APLOY")
        self.setFont("Helvetica", 9)
        self.setFillColor(MUTED)
        self.drawRightString(W - MARGIN, H - 0.29 * inch,
                             "Confidential Business Plan  •  2026")

    def _draw_footer(self, pg, total):
        self.setFillColor(BORDER)
        self.rect(MARGIN, 0.44 * inch, CW, 0.4, fill=1, stroke=0)
        self.setFillColor(MUTED)
        self.setFont("Helvetica", 8)
        self.drawString(MARGIN, 0.28 * inch,
                        "© 2026 Aploy. All rights reserved. This document is confidential.")
        self.drawRightString(W - MARGIN, 0.28 * inch, f"Page {pg} of {total}")


# ── Page templates ────────────────────────────────────────────────────────────
def cover_background(c, doc):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Indigo circle accents top-right
    c.setFillColor(INDIGO)
    c.setFillAlpha(0.35)
    c.circle(W - 0.6 * inch, H - 0.4 * inch, 3.2 * inch, fill=1, stroke=0)
    c.setFillAlpha(0.15)
    c.circle(W - 0.6 * inch, H - 0.4 * inch, 5.0 * inch, fill=1, stroke=0)
    c.setFillAlpha(1)
    # Bottom accent bar
    c.setFillColor(INDIGO)
    c.rect(0, 0, W, 0.65 * inch, fill=1, stroke=0)
    # Logo mark
    c.setFillColor(INDIGO)
    c.roundRect(MARGIN, H - 1.25 * inch, 0.44 * inch, 0.44 * inch, 4, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MARGIN + 9, H - 1.25 * inch + 13, "A")
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MARGIN + 0.55 * inch, H - 1.25 * inch + 13, "APLOY")
    # Hero text
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 56)
    c.drawString(MARGIN, H - 2.7 * inch, "Business")
    c.drawString(MARGIN, H - 3.45 * inch, "Plan")
    # Tagline
    c.setFillColor(INDIGO_LT)
    c.setFont("Helvetica", 14)
    c.drawString(MARGIN, H - 4.05 * inch,
                 "The Autonomous Job Search Platform for Developers")
    # Accent line
    c.setStrokeColor(INDIGO)
    c.setLineWidth(1.5)
    c.line(MARGIN, H - 4.35 * inch, MARGIN + 4.4 * inch, H - 4.35 * inch)
    # Meta block
    meta = [
        ("Document",  "Confidential Business Plan"),
        ("Version",   "1.0"),
        ("Date",      datetime.date.today().strftime("%B %Y")),
        ("Stage",     "Pre-Seed  /  Self-Funded"),
        ("Contact",   "vortia123@gmail.com"),
    ]
    y = H - 4.75 * inch
    for label, value in meta:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8)
        c.drawString(MARGIN, y, label.upper())
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(MARGIN + 1.3 * inch, y, value)
        y -= 0.27 * inch
    # Bottom bar text
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, 0.22 * inch, "aploy.com")
    c.setFont("Helvetica", 9)
    c.setFillColor(INDIGO_LT)
    c.drawRightString(W - MARGIN, 0.22 * inch,
                      "This document contains proprietary and confidential information.")


def blank_bg(c, doc):
    pass


cover_frame  = Frame(MARGIN, MARGIN, CW, H - 2 * MARGIN, id="cover")
normal_frame = Frame(MARGIN, 0.75 * inch, CW, H - 0.75 * inch - MARGIN - 0.3 * inch, id="normal")

cover_tpl  = PageTemplate(id="Cover",  frames=[cover_frame],  onPage=cover_background)
toc_tpl    = PageTemplate(id="TOC",    frames=[normal_frame],  onPage=blank_bg)
normal_tpl = PageTemplate(id="Normal", frames=[normal_frame],  onPage=blank_bg)


# ── Section header helper (table-based, no custom Flowable) ──────────────────
def section_header(number, title):
    t = Table(
        [[
            Paragraph(f"<font color='#e0e7ff'><b>{number}</b></font>",
                      S("sn", fontSize=9, fontName="Helvetica-Bold",
                        textColor=INDIGO_LT, leading=13, alignment=TA_CENTER)),
            Paragraph(f"<b>{title}</b>",
                      S("st", fontSize=18, fontName="Helvetica-Bold",
                        textColor=white, leading=22)),
        ]],
        colWidths=[0.55 * inch, CW - 0.55 * inch]
    )
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), INK),
        ("BACKGROUND",    (0, 0), (0, 0),   INDIGO),
        ("TOPPADDING",    (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LEFTPADDING",   (0, 0), (0, 0),   8),
        ("LEFTPADDING",   (1, 0), (1, 0),   14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return [sp(2), t, sp(2)]


def stat_row(stats):
    cells = []
    for val, lbl in stats:
        cells.append(
            Paragraph(
                f"<font color='#4f46e5'><b>{val}</b></font><br/>"
                f"<font color='#475569' size='8'>{lbl}</font>",
                S("sr", fontSize=22, fontName="Helvetica-Bold",
                  textColor=INDIGO, alignment=TA_CENTER, leading=28)
            )
        )
    col_w = CW / len(stats)
    t = Table([cells], colWidths=[col_w] * len(stats))
    bgs = [INDIGO_LT if i % 2 == 0 else SURFACE for i in range(len(stats))]
    style = [
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("LINEAFTER",     (0, 0), (-2, -1), 0.5, BORDER),
    ]
    for i, bg in enumerate(bgs):
        style.append(("BACKGROUND", (i, 0), (i, 0), bg))
    t.setStyle(TableStyle(style))
    return [t, sp(2)]


def callout(text, bg=INDIGO_LT, accent=INDIGO):
    t = Table(
        [[Paragraph(text, S("cb", fontSize=10.5, fontName="Helvetica-Bold",
                             textColor=INK, leading=18))]],
        colWidths=[CW]
    )
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), bg),
        ("LINEBEFORE",    (0, 0), (0, -1),  4, accent),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING",   (0, 0), (-1, -1), 16),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 16),
    ]))
    return [t, sp(2)]


def grid_table(data, col_widths, header_bg=INK, zebra=True):
    t = Table(data, colWidths=col_widths)
    style = [
        ("BACKGROUND",    (0, 0), (-1, 0),  header_bg),
        ("TEXTCOLOR",     (0, 0), (-1, 0),  white),
        ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9.5),
        ("GRID",          (0, 0), (-1, -1), 0.4, BORDER),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]
    if zebra:
        style.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [SURFACE, white]))
    t.setStyle(TableStyle(style))
    return [t, sp(2)]


# ══════════════════════════════════════════════════════════════════════════════
#  BUILD STORY
# ══════════════════════════════════════════════════════════════════════════════
story = []

# ── Cover ─────────────────────────────────────────────────────────────────────
story.append(NextPageTemplate("TOC"))
story.append(PageBreak())

# ── Table of Contents ─────────────────────────────────────────────────────────
story.append(NextPageTemplate("Normal"))
story.append(sp(2))
story.append(Paragraph("Table of Contents", H1))
story.append(rule(INDIGO, 1.5, 2, 16))

toc = [
    ("01", "Executive Summary",              "3"),
    ("02", "Company Overview",               "3"),
    ("03", "Problem Statement",              "4"),
    ("04", "Solution",                       "5"),
    ("05", "Market Opportunity",             "6"),
    ("06", "Product and Technology",         "7"),
    ("07", "Business Model and Revenue",     "8"),
    ("08", "Competitive Analysis",           "9"),
    ("09", "Go-to-Market Strategy",          "10"),
    ("10", "Development Roadmap",            "11"),
    ("11", "Financial Projections",          "12"),
    ("12", "Risks and Mitigation",           "13"),
    ("13", "The Vision",                     "14"),
]
for num, title, pg in toc:
    row = Table(
        [[
            Paragraph(f"<font color='#4f46e5'><b>{num}</b></font>   {title}", TOCL),
            Paragraph(pg, TOCP),
        ]],
        colWidths=[CW - 0.5 * inch, 0.5 * inch]
    )
    row.setStyle(TableStyle([
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(row)

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 01  EXECUTIVE SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("01", "Executive Summary")

story.append(Paragraph(
    "Aploy is an autonomous job search and application intelligence platform built for software "
    "developers and technology professionals. Where every existing tool waits for the job seeker "
    "to find opportunities manually and then helps organize them, Aploy reverses the dynamic "
    "entirely. It discovers jobs, scores them against the user's unique skill profile using "
    "artificial intelligence, tailors their resume, generates a cover letter, and pre-fills "
    "the application form. It does all of this continuously, around the clock, without being asked.",
    BODY))

story.append(Paragraph(
    "The platform operates in the background and interrupts the user only when a genuinely strong "
    "opportunity has appeared. A companion iOS application ensures that high-score alerts reach "
    "the user instantly, wherever they are. Every final decision remains with the human. "
    "Aploy prepares everything and asks for approval before a single application is submitted.",
    BODY))

story += stat_row([
    ("3 to 6 mo", "Average job search"),
    ("15+ hrs",   "Weekly time lost hunting"),
    ("150+",      "Applications per offer"),
    ("$12/mo",    "Pro tier price"),
    ("$720K",     "Year 3 ARR target"),
])

story.append(Paragraph(
    "Aploy is currently in active development. The founding builder is a web developer with "
    "hands-on experience in React, Next.js, TypeScript, and Supabase. The initial target market "
    "is software developers at all experience levels, with a clear roadmap to expand into all "
    "technology and knowledge-worker roles. The business operates on a freemium SaaS model with "
    "a twelve-dollar-per-month Pro tier and a seventy-nine-dollar lifetime access option.",
    BODY))

story += callout(
    "Aploy is not a job tracker. It is an always-on career agent that finds opportunities "
    "you would have missed, prepares your application automatically, and only asks for your "
    "attention when something genuinely worth your time has appeared."
)

# ══════════════════════════════════════════════════════════════════════════════
# 02  COMPANY OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("02", "Company Overview")

ov = [
    ["Company Name",    "Aploy"],
    ["Product Type",    "SaaS — Autonomous Job Search Platform"],
    ["Founded",         "2026"],
    ["Stage",           "Pre-Seed / Self-Funded"],
    ["Primary Market",  "Software Developers and Technology Professionals"],
    ["Geography",       "Global (English-speaking markets first)"],
    ["Revenue Model",   "Freemium SaaS — Monthly Subscription and Lifetime Access"],
    ["Website",         "aploy.com (domain secured)"],
    ["Mobile App",      "iOS — Phase 8 of development roadmap"],
]
ov_t = Table(ov, colWidths=[1.9 * inch, CW - 1.9 * inch])
ov_t.setStyle(TableStyle([
    ("FONTNAME",      (0, 0), (0, -1), "Helvetica-Bold"),
    ("FONTNAME",      (1, 0), (1, -1), "Helvetica"),
    ("FONTSIZE",      (0, 0), (-1, -1), 10.5),
    ("TEXTCOLOR",     (0, 0), (0, -1), SLATE),
    ("TEXTCOLOR",     (1, 0), (1, -1), INK),
    ("ROWBACKGROUNDS",(0, 0), (-1, -1), [SURFACE, white]),
    ("TOPPADDING",    (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING",   (0, 0), (-1, -1), 14),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
    ("LINEBELOW",     (0, 0), (-1, -1), 0.4, BORDER),
]))
story.append(ov_t)
story.append(sp(2))

story.append(Paragraph("Mission", H2))
story.append(Paragraph(
    "To remove every preventable barrier between a skilled developer and the job they deserve, "
    "by replacing manual job hunting with an intelligent, automated system that works "
    "tirelessly on their behalf.",
    BODY))

story.append(Paragraph("Vision", H2))
story.append(Paragraph(
    "A world where the quality of your skills determines your career trajectory, not the hours "
    "you can afford to spend searching or the size of your professional network. Aploy makes "
    "the job market more meritocratic by giving every developer access to a systematic "
    "advantage that was previously unavailable to anyone.",
    BODY))

story.append(Paragraph("Core Values", H2))
for title, desc in [
    ("Autonomy",     "The system works so the user does not have to."),
    ("Precision",    "Every output is specific to the role, not generic."),
    ("Transparency", "The user sees exactly why a job scored the way it did and approves every action."),
    ("Equity",       "Powerful career tools should not be reserved for candidates with elite networks."),
]:
    story.append(Paragraph(f"<b>{title}.</b>   {desc}", BODYL))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 03  PROBLEM STATEMENT
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("03", "Problem Statement")

story.append(Paragraph("The Current Reality", H2))
story.append(Paragraph(
    "Finding a job as a software developer in 2026 is a full-time job in itself. Despite living "
    "in an era of powerful automation and machine learning, the job search process has not "
    "fundamentally changed in two decades. Developers still open the same websites manually, "
    "read listings one at a time, rewrite their resume for each application, compose cover "
    "letters that sound nearly identical to the last, and submit into silence.",
    BODY))

story.append(Paragraph("The Daily Workflow of a Job Seeker", H2))

steps = [
    ("01", "Open LinkedIn, Wellfound, Indeed, and company career pages in separate browser tabs."),
    ("02", "Scroll through dozens of listings. The majority are irrelevant within the first sentence."),
    ("03", "Read each description to assess fit. Repeat this across every source, every day."),
    ("04", "Adjust a resume, hoping the keywords align with what the ATS system is scanning for."),
    ("05", "Write a cover letter that still reads as generic despite the effort put into it."),
    ("06", "Fill out an application form, manually re-entering information already on the resume."),
    ("07", "Update a tracking spreadsheet that will be outdated within twenty-four hours."),
    ("08", "Repeat every single day for weeks or months, with diminishing emotional energy."),
]

for num, desc in steps:
    row = Table(
        [[
            Paragraph(f"<b>{num}</b>",
                      S("stp", fontSize=10, fontName="Helvetica-Bold",
                        textColor=white, alignment=TA_CENTER, leading=14)),
            Paragraph(desc, S("stpd", fontSize=10.5, fontName="Helvetica",
                               textColor=INK, leading=17)),
        ]],
        colWidths=[0.55 * inch, CW - 0.55 * inch]
    )
    row.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, 0), INDIGO),
        ("BACKGROUND",    (1, 0), (1, 0), SURFACE),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING",   (0, 0), (0, 0),  8),
        ("LEFTPADDING",   (1, 0), (1, 0),  14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("LINEABOVE",     (0, 0), (-1, 0), 0.4, BORDER),
    ]))
    story.append(row)
    story.append(sp(0.5))

story.append(sp(2))
story.append(Paragraph("Quantifying the Problem", H2))

pain = [
    ["Metric",                              "Data Point",               "Source"],
    ["Average job search duration",          "3 to 6 months",           "LinkedIn Workforce Report"],
    ["Hours spent per week on search tasks", "10 to 20 hours",          "Indeed Job Seeker Survey"],
    ["Applications submitted per offer",     "100 to 200 or more",      "Jobscan Research"],
    ["Generic resume callback rate",         "Below 25 percent",        "The Ladders Resume Study"],
    ["Time spent on non-interview tasks",    "Over 80 percent of total", "Aploy Internal Analysis"],
    ["Job seekers reporting burnout",        "Over 70 percent",         "Mental Health at Work 2025"],
]
story += grid_table(pain, [2.2*inch, 2.0*inch, 2.1*inch])

story.append(Paragraph("Why Existing Tools Have Not Solved This", H2))
story.append(Paragraph(
    "Every tool in the current landscape has digitized the problem rather than solved it. "
    "Huntr, Teal, and Simplify are application trackers. They require the user to find jobs "
    "first. JobScan analyzes resumes only after the user has already identified a role. "
    "MyJobFlow reads inbox confirmations, meaning you must apply before it tracks anything. "
    "Not one of these tools is active. Not one works while the user is offline. Not one reduces "
    "the hours spent searching by a single minute.",
    BODY))

story += callout(
    "The gap in the market is not an organizational tool. "
    "It is an active agent that finds, qualifies, and prepares opportunities without being asked.",
    bg=AMBER_LT, accent=AMBER
)

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 04  SOLUTION
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("04", "Solution")

story.append(Paragraph(
    "Aploy replaces the entire manual job search workflow with an intelligent, automated pipeline "
    "that operates continuously in the background. The platform moves each job listing through "
    "seven sequential phases, from raw discovery through to a prepared, reviewed application.",
    BODY))

phases = [
    ("01", "Discovery",             HexColor("#4f46e5"),
     "Automated workflows scan developer-focused job boards and company career pages multiple "
     "times per day. Every new listing is captured and stored before the user is ever aware of it."),
    ("02", "Filtering",             HexColor("#0891b2"),
     "Raw listings pass through rules-based filters that remove roles which do not match the "
     "user's defined criteria, including seniority level, industry, location, and technology stack."),
    ("03", "AI Scoring",            HexColor("#7c3aed"),
     "Each filtered listing is analyzed by an AI model that compares the job description to the "
     "user's skill profile. The model returns a score from 1 to 10 with a clear explanation of "
     "exactly why the role ranked where it did."),
    ("04", "Notification",          GREEN,
     "When a listing exceeds the user's defined score threshold, an instant alert is dispatched "
     "via Discord, email, or push notification. The alert includes the company name, role title, "
     "score, and a direct application link."),
    ("05", "Resume Tailoring",      AMBER,
     "For approved listings, the AI extracts key requirements from the job description and "
     "generates a version of the user's master resume that emphasizes the most relevant "
     "experience. The result is exported as a polished, formatted PDF."),
    ("06", "Cover Letter",          HexColor("#db2777"),
     "A targeted cover letter is generated using the job description and the user's background. "
     "The letter is specific enough to read as genuinely human-written and is available for "
     "review and editing before use."),
    ("07", "Application",           HexColor("#ea580c"),
     "Browser automation opens the application page, fills in standard form fields, uploads the "
     "tailored resume, and pauses for final review. Nothing is submitted without the user's "
     "explicit approval."),
]

for num, title, color, desc in phases:
    row = Table(
        [[
            Paragraph(f"<b>{num}</b>",
                      S("pn", fontSize=11, fontName="Helvetica-Bold",
                        textColor=white, alignment=TA_CENTER, leading=15)),
            Paragraph(f"<b>{title}</b>",
                      S("pt", fontSize=11, fontName="Helvetica-Bold",
                        textColor=white, leading=15)),
            Paragraph(desc,
                      S("pd", fontSize=10, fontName="Helvetica",
                        textColor=INK, leading=16)),
        ]],
        colWidths=[0.55*inch, 1.2*inch, CW - 1.75*inch]
    )
    row.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (1, 0), color),
        ("BACKGROUND",    (2, 0), (2, 0), SURFACE),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
        ("LEFTPADDING",   (0, 0), (0, 0),  8),
        ("LEFTPADDING",   (1, 0), (1, 0),  10),
        ("LEFTPADDING",   (2, 0), (2, 0),  14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("LINEABOVE",     (0, 0), (-1, 0), 0.5, BORDER),
    ]))
    story.append(row)
    story.append(sp(0.5))

story.append(sp(2))
story.append(Paragraph("The iOS Mobile App", H2))
story.append(Paragraph(
    "A companion iOS application written in Swift connects directly to the Supabase backend. "
    "The app allows users to browse scored listings, approve or reject opportunities, read "
    "generated resumes and cover letters, and receive push notifications for high-scoring matches "
    "from anywhere. The app does not require the user to visit any job board. Everything it "
    "displays has already been collected, filtered, scored, and prepared automatically.",
    BODY))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 05  MARKET OPPORTUNITY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("05", "Market Opportunity")

story.append(Paragraph("Total Addressable Market", H2))
story.append(Paragraph(
    "The global online recruitment software market was valued at approximately 3.1 billion dollars "
    "in 2025 and is projected to reach 5.4 billion dollars by 2030 at a compound annual growth "
    "rate of 11.8 percent. Aploy operates on the job-seeker side of this market, a segment "
    "historically underserved and undermonetized relative to recruiter-facing tools.",
    BODY))

story.append(Paragraph("Serviceable Addressable Market", H2))
story.append(Paragraph(
    "There are approximately 27 million professional software developers globally as of 2026, "
    "with an estimated 4 to 5 million actively seeking new roles at any given time. If 10 percent "
    "of active seekers adopt a paid tool at 12 dollars per month, the serviceable market "
    "represents 60 million dollars in annual recurring revenue. Developer tools are among the "
    "highest-converting software categories because the audience understands the value of "
    "automation and will pay measurably for tools that save them time.",
    BODY))

story.append(Paragraph("Serviceable Obtainable Market", H2))
story.append(Paragraph(
    "In the first three years, Aploy targets 5,000 paying users. This is less than 0.02 percent "
    "of the global active developer job-seeker pool — a target that requires no viral growth, "
    "no enterprise sales, and no paid advertising beyond organic community engagement. At 5,000 "
    "users on the 12-dollar Pro tier, Aploy generates 720,000 dollars in annual recurring revenue.",
    BODY))

market = [
    ["Tier",       "Definition",                            "Size",      "Aploy Position"],
    ["TAM",        "Global recruitment software market",    "$3.1B",     "Industry benchmark"],
    ["SAM",        "Developer-focused job seeker tools",    "$600M",     "Direct market"],
    ["SOM Year 1", "Early adopters via organic channels",   "$43K ARR",  "Launch milestone"],
    ["SOM Year 2", "Community and word-of-mouth growth",    "$288K ARR", "Growth milestone"],
    ["SOM Year 3", "Established platform at 5,000 users",   "$720K ARR", "Three-year target"],
]
story += grid_table(market, [1.2*inch, 2.4*inch, 1.1*inch, 1.6*inch])

story.append(Paragraph("Market Tailwinds", H2))
for item in [
    "Remote work normalization has expanded the pool of eligible roles for every developer, raising competition per posting and making smart filtering significantly more valuable.",
    "AI-assisted professional tools have created strong consumer familiarity with automation in career-related tasks, reducing adoption friction for a product like Aploy.",
    "Technology sector layoffs from 2023 through 2026 have meaningfully increased the number of skilled developers in active job searches at any given time.",
    "Applicant tracking systems have made generic applications even less effective, driving strong demand for tailored resume tooling at scale.",
    "The developer community spreads software tools rapidly through GitHub, Hacker News, Reddit, and Twitter, enabling organic growth without paid acquisition.",
]:
    story.append(Paragraph(f"<font color='#4f46e5'><b>+</b></font>   {item}", BUL))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 06  PRODUCT AND TECHNOLOGY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("06", "Product and Technology")

story.append(Paragraph("Technology Stack", H2))
tech = [
    ["Layer",               "Technology",              "Purpose"],
    ["Automation Engine",   "n8n",                     "Orchestrates all scheduled workflows, triggers, and data pipelines"],
    ["Database",            "Supabase (PostgreSQL)",   "Stores all jobs, user profiles, scores, resumes, and status records"],
    ["AI Intelligence",     "OpenAI GPT-4o",           "Job scoring, resume tailoring, cover letter generation"],
    ["Web Dashboard",       "Next.js + Tailwind CSS",  "Primary interface for job review and application management"],
    ["PDF Generation",      "React PDF",               "Produces formatted, downloadable tailored resume documents"],
    ["Browser Automation",  "Playwright",              "Pre-fills and stages application form submissions"],
    ["Mobile App",          "Swift (iOS)",             "Companion app for on-the-go review and push notifications"],
    ["Authentication",      "Supabase Auth",           "Secure accounts, sessions, and row-level access control"],
    ["Notifications",       "Discord / Email / APNs",  "Real-time high-score match alerts across all platforms"],
]
story += grid_table(tech, [1.5*inch, 1.8*inch, CW - 3.3*inch], header_bg=NAVY)

story.append(Paragraph("Security and Privacy", H2))
story.append(Paragraph(
    "All user data is stored in isolated Supabase instances with row-level security enabled, "
    "ensuring no user's data is ever accessible to another. Credentials for external services "
    "are stored as encrypted environment variables and never exposed in application code. "
    "Aploy does not sell, share, or analyze user data for any purpose other than operating "
    "the user's own pipeline. Authentication uses industry-standard OAuth 2.0 and JWT tokens.",
    BODY))

story.append(Paragraph("Scalability", H2))
story.append(Paragraph(
    "The system is architected for horizontal scaling from day one. Workflows are stateless "
    "and replicable. Supabase scales automatically on managed infrastructure. The OpenAI API "
    "has no rate-limit concerns at early user volumes. When self-hosting n8n becomes cost "
    "effective at scale, the migration path is clean with no architectural changes required.",
    BODY))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 07  BUSINESS MODEL AND REVENUE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("07", "Business Model and Revenue")

story.append(Paragraph(
    "Aploy operates on a freemium SaaS model with three tiers designed to support a wide "
    "acquisition funnel while capturing strong revenue from power users.",
    BODY))

tier_data = [
    ["FREE",     "$0",   "per month",  SLATE,  white,  [
        "Job discovery and collection",
        "Basic role filtering",
        "Web dashboard access",
        "Up to 50 active job listings",
        "Direct application links",
    ]],
    ["PRO",      "$12",  "per month",  INDIGO, white,  [
        "Everything in Free",
        "AI relevance scoring",
        "Resume tailoring per role",
        "AI cover letter generation",
        "Real-time alerts via Discord and email",
        "iOS mobile app access",
        "Application pre-fill automation",
        "Up to 500 active listings",
        "Priority support",
    ]],
    ["LIFETIME", "$79",  "one-time",   NAVY,   white,  [
        "Everything in Pro",
        "No recurring payments ever",
        "All future features included",
        "Earliest access to new releases",
        "Direct founder support channel",
    ]],
]

tier_cells = []
for name, price, freq, hbg, hfg, features in tier_data:
    header_p = Paragraph(name, S("tn", fontSize=10, fontName="Helvetica-Bold",
                                  textColor=hfg, alignment=TA_CENTER))
    price_p  = Paragraph(price, S("tp", fontSize=26, fontName="Helvetica-Bold",
                                   textColor=INDIGO_LT if hbg != SLATE else MUTED,
                                   alignment=TA_CENTER, leading=30))
    freq_p   = Paragraph(freq, S("tf", fontSize=9, fontName="Helvetica",
                                  textColor=INDIGO_LT if hbg != SLATE else MUTED,
                                  alignment=TA_CENTER))
    feat_rows = [[header_p], [price_p], [freq_p]]
    for f in features:
        feat_rows.append([Paragraph(
            f"<font color='#059669'><b>+</b></font>   {f}",
            S("ff", fontSize=9, fontName="Helvetica", textColor=INK, leading=14)
        )])
    t = Table(feat_rows, colWidths=[2.0 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, 2),  hbg),
        ("BACKGROUND",    (0, 3), (0, -1), INDIGO_LT if hbg == INDIGO else SURFACE),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("BOX",           (0, 0), (-1, -1), 1, BORDER),
        ("LINEBELOW",     (0, 2), (0, 2),  1, BORDER),
    ]))
    tier_cells.append(t)

tier_grid = Table([tier_cells], colWidths=[2.1*inch, 2.1*inch, 2.1*inch])
tier_grid.setStyle(TableStyle([
    ("LEFTPADDING",  (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("VALIGN",       (0, 0), (-1, -1), "TOP"),
]))
story.append(tier_grid)
story.append(sp(2))

story.append(Paragraph("Revenue Drivers", H2))
for title, desc in [
    ("Free to Pro Conversion",
     "The Free tier demonstrates enough value to earn trust but limits enough to drive upgrades. "
     "AI scoring is the primary conversion trigger. Once users see scored results, manual filtering becomes unacceptable."),
    ("Lifetime Tier as Launch Fuel",
     "The 79-dollar lifetime option generates strong upfront cash at launch and creates vocal advocates with financial "
     "stake in the platform's success."),
    ("Referral Growth",
     "Existing users who refer a paying subscriber receive extended Pro access at no cost. "
     "Developer communities spread tools through direct recommendation, and a referral loop "
     "accelerates growth without paid advertising."),
]:
    story.append(Paragraph(f"<b>{title}.</b>   {desc}", BODYL))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 08  COMPETITIVE ANALYSIS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("08", "Competitive Analysis")

comp = [
    ["Capability",                     "Aploy", "Huntr",  "Teal",   "Simplify", "ViserLab"],
    ["Automatic job discovery",         "Yes",   "No",     "No",     "No",       "Partial"],
    ["AI relevance scoring",            "Yes",   "No",     "No",     "No",       "Yes"],
    ["Resume tailoring per role",       "Yes",   "No",     "Partial","No",       "Yes"],
    ["AI cover letter generation",      "Yes",   "No",     "Partial","No",       "No"],
    ["Real-time job alerts",            "Yes",   "No",     "No",     "No",       "No"],
    ["Application pre-fill automation", "Yes",   "No",     "No",     "Partial",  "No"],
    ["iOS mobile app",                  "Yes",   "No",     "No",     "No",       "No"],
    ["Works while user is offline",     "Yes",   "No",     "No",     "No",       "No"],
    ["Managed SaaS (no self-hosting)",  "Yes",   "Yes",    "Yes",    "Yes",      "No"],
]
col_w2 = [2.0*inch] + [(CW - 2.0*inch) / 5] * 5
comp_t = Table(comp, colWidths=col_w2)
cstyle = [
    ("BACKGROUND",    (0, 0), (-1, 0), INK),
    ("TEXTCOLOR",     (0, 0), (-1, 0), white),
    ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1), [SURFACE, white]),
    ("GRID",          (0, 0), (-1, -1), 0.4, BORDER),
    ("TOPPADDING",    (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
    ("ALIGN",         (1, 0), (-1, -1), "CENTER"),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("BACKGROUND",    (1, 0), (1, 0), INDIGO),
    ("FONTNAME",      (1, 1), (1, -1), "Helvetica-Bold"),
]
for r in range(1, len(comp)):
    for c in range(1, len(comp[0])):
        val = comp[r][c]
        if val == "Yes":
            cstyle += [("BACKGROUND", (c, r), (c, r), GREEN),
                       ("TEXTCOLOR",  (c, r), (c, r), white)]
        elif val == "No":
            cstyle += [("BACKGROUND", (c, r), (c, r), RED),
                       ("TEXTCOLOR",  (c, r), (c, r), white)]
        elif val == "Partial":
            cstyle += [("BACKGROUND", (c, r), (c, r), AMBER),
                       ("TEXTCOLOR",  (c, r), (c, r), white)]
comp_t.setStyle(TableStyle(cstyle))
story.append(comp_t)
story.append(sp(1))
story.append(Paragraph(
    "Aploy is the only platform in this landscape that operates autonomously, works while the "
    "user is offline, and ships a native iOS application. The closest competitor by feature "
    "set, ViserLab's platform, is a self-hosted script sold as a one-time purchase. "
    "It is not a managed product, not a mobile application, and not accessible to non-technical users.",
    BODY))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 09  GO-TO-MARKET STRATEGY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("09", "Go-to-Market Strategy")

for phase, desc in [
    ("Phase 1 — Build in Public (Months 1 to 3)",
     "From day one, progress updates, technical decisions, screenshots, and lessons learned are "
     "shared publicly on Twitter, Reddit, and Hacker News. This creates an audience before the "
     "product exists and generates organic interest at zero cost. Developer communities rally "
     "around builders who show their work."),
    ("Phase 2 — Closed Beta (Month 3 to 4)",
     "The first version is offered free to 50 to 100 developers who followed the build-in-public "
     "journey. Their feedback directly shapes the first production release. Beta users who convert "
     "to lifetime access at a 49-dollar founder rate provide early revenue and long-term advocacy."),
    ("Phase 3 — ProductHunt Launch (Month 4 to 5)",
     "A ProductHunt listing targets the developer and SaaS community on the same day the product "
     "becomes publicly available. A polished listing with a strong demo video consistently drives "
     "thousands of unique visitors to developer tools in the first 48 hours at no cost."),
    ("Phase 4 — Community and Content Growth (Month 5 Onward)",
     "Ongoing engagement in developer communities including r/cscareerquestions, r/webdev, and "
     "r/reactjs, combined with GitHub discussions and a lightweight content strategy around job "
     "search automation, drives sustained organic growth. Referral incentives allow users to earn "
     "extended Pro access by sharing the platform with colleagues."),
]:
    story.append(Paragraph(phase, H2))
    story.append(Paragraph(desc, BODY))

gtm = [
    ["Channel",            "Cost",      "Expected Reach",          "Est. Conversion"],
    ["Build in Public",    "Time only", "1,000 to 5,000 followers", "3 to 5 percent"],
    ["ProductHunt Launch", "Time only", "2,000 to 10,000 visitors", "2 to 4 percent"],
    ["Reddit Communities", "Time only", "Sustained organic",        "1 to 3 percent"],
    ["Referral Program",   "Low",       "User-driven",              "5 to 8 percent"],
    ["SEO and Content",    "Low",       "Grows over 12 months",     "1 to 2 percent"],
]
story += grid_table(gtm, [1.6*inch, 1.0*inch, 2.1*inch, 1.6*inch])

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 10  DEVELOPMENT ROADMAP
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("10", "Development Roadmap")

roadmap = [
    ("Stage 1",  "Foundation",             "Days 1 to 2",    HexColor("#4f46e5"),
     "Configure Supabase schema and n8n automation environment. Establish project repository."),
    ("Stage 2",  "Job Collection",         "Days 3 to 4",    HexColor("#0891b2"),
     "Connect job board sources. Build first automated collection workflow. Implement filtering."),
    ("Stage 3",  "AI Scoring",             "Days 5 to 6",    HexColor("#7c3aed"),
     "Integrate OpenAI API. Build scoring pipeline. Tune prompts against real job listings."),
    ("Stage 4",  "Notifications",          "Day 7",          GREEN,
     "Set up Discord and email alerts. Define score threshold triggers for notifications."),
    ("Stage 5",  "Dashboard",              "Days 8 to 10",   HexColor("#db2777"),
     "Build Next.js review interface connected to Supabase. Job browsing, filtering, and status management."),
    ("Stage 6",  "Resume Tailoring",       "Days 11 to 12",  AMBER,
     "AI resume customization workflow. React PDF integration for polished document export."),
    ("Stage 7",  "Application Automation", "Days 13 to 15",  HexColor("#ea580c"),
     "Playwright browser automation for form pre-fill. Manual review checkpoint before submission."),
    ("Stage 8",  "iOS App",               "Days 16 to 21",   NAVY,
     "Swift iOS app connected to Supabase. Push notifications, job browser, and approval workflow."),
    ("Stage 9",  "Public Launch",          "Day 22 onward",   SLATE,
     "Internal testing, ProductHunt launch, community outreach, and continuous iteration."),
]

for code, name, timeline, color, desc in roadmap:
    header = Table(
        [[
            Paragraph(f"<b>{code}</b>",
                      S("rc", fontSize=9, fontName="Helvetica-Bold",
                        textColor=white, alignment=TA_CENTER, leading=13)),
            Paragraph(f"<b>{name}</b>",
                      S("rn", fontSize=10, fontName="Helvetica-Bold",
                        textColor=white, leading=14)),
            Paragraph(timeline,
                      S("rt", fontSize=9, fontName="Helvetica",
                        textColor=INDIGO_LT, leading=13, alignment=TA_RIGHT)),
        ]],
        colWidths=[0.65*inch, CW - 0.65*inch - 1.4*inch, 1.4*inch]
    )
    header.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), color),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (0, 0),  8),
        ("LEFTPADDING",   (1, 0), (1, 0),  12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    body = Table(
        [[Paragraph(desc, S("rd", fontSize=10, fontName="Helvetica", textColor=INK, leading=16))]],
        colWidths=[CW]
    )
    body.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), SURFACE),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.5, BORDER),
    ]))
    story.append(header)
    story.append(body)
    story.append(sp(0.5))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 11  FINANCIAL PROJECTIONS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("11", "Financial Projections")

story.append(Paragraph(
    "The following projections assume no paid advertising, no external fundraising, and no viral "
    "growth events. All growth is attributed entirely to organic channels including build-in-public "
    "content, a ProductHunt launch, and developer community word of mouth.",
    BODY))


def fin_table(data):
    t = Table(data, colWidths=[1.3*inch]*5)
    style = [
        ("BACKGROUND",    (0, 0), (-1, 0),  NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0),  white),
        ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
        ("FONTNAME",      (0, -1),(-1, -1), "Helvetica-Bold"),
        ("BACKGROUND",    (0, -1),(-1, -1), INDIGO_LT),
        ("FONTSIZE",      (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS",(0, 1), (-1, -2), [SURFACE, white]),
        ("GRID",          (0, 0), (-1, -1), 0.4, BORDER),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("ALIGN",         (1, 0), (-1, -1), "RIGHT"),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]
    for r in range(1, len(data)):
        net = data[r][-1]
        if isinstance(net, str) and net.startswith("+"):
            style.append(("TEXTCOLOR", (-1, r), (-1, r), GREEN))
        elif isinstance(net, str) and net.startswith("-"):
            style.append(("TEXTCOLOR", (-1, r), (-1, r), RED))
    t.setStyle(TableStyle(style))
    return [t, sp(2)]


story.append(Paragraph("Year 1 — Build and Launch", H2))
story += fin_table([
    ["Quarter", "Paid Users", "MRR",     "Costs",  "Net"],
    ["Q1",      "0",          "$0",       "$80",    "-$80"],
    ["Q2",      "80",         "$960",     "$350",   "+$610"],
    ["Q3",      "220",        "$2,640",   "$600",   "+$2,040"],
    ["Q4",      "300",        "$3,600",   "$750",   "+$2,850"],
    ["Full Year","",          "$43,200",  "$10,560","+$32,640"],
])

story.append(Paragraph("Year 2 — Growth", H2))
story += fin_table([
    ["Quarter", "Paid Users", "MRR",     "Costs",   "Net"],
    ["Q1",      "500",        "$6,000",   "$1,200",  "+$4,800"],
    ["Q2",      "900",        "$10,800",  "$1,800",  "+$9,000"],
    ["Q3",      "1,400",      "$16,800",  "$2,600",  "+$14,200"],
    ["Q4",      "2,000",      "$24,000",  "$3,500",  "+$20,500"],
    ["Full Year","",          "$288,000", "$54,840", "+$233,160"],
])

story.append(Paragraph("Year 3 — Scale", H2))
story += fin_table([
    ["Quarter", "Paid Users", "MRR",     "Costs",    "Net"],
    ["Q1",      "2,800",      "$33,600",  "$5,000",   "+$28,600"],
    ["Q2",      "3,500",      "$42,000",  "$6,200",   "+$35,800"],
    ["Q3",      "4,200",      "$50,400",  "$7,400",   "+$43,000"],
    ["Q4",      "5,000",      "$60,000",  "$9,000",   "+$51,000"],
    ["Full Year","",          "$720,000", "$103,200", "+$616,800"],
])

story.append(Paragraph("Operating Cost Structure", H2))
costs = [
    ["Cost Item",                  "Early Stage",       "At 5,000 Users"],
    ["Supabase (managed database)", "$25/mo",           "$400/mo"],
    ["n8n (cloud or self-hosted)",  "$50/mo",           "$300/mo"],
    ["OpenAI API usage",            "$100/mo",          "$5,000/mo"],
    ["Domain and SSL certificates", "$2/mo",            "$2/mo"],
    ["Vercel hosting",              "$20/mo",           "$200/mo"],
    ["Apple Developer Account",     "$8/mo amortized",  "$8/mo amortized"],
    ["Miscellaneous",               "$25/mo",           "$300/mo"],
    ["Total Monthly",               "~$230/mo",         "~$6,210/mo"],
]
story += grid_table(costs, [2.5*inch, 2.0*inch, 1.8*inch])

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 12  RISKS AND MITIGATION
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("12", "Risks and Mitigation")

risks = [
    ("Job Board Access",
     "Major platforms including LinkedIn actively block automated scraping and prohibit it in their terms of service.",
     "Aploy uses official APIs, aggregator services such as Apify and the Arbeitnow API, and RSS feeds where available. LinkedIn is not a primary dependency."),
    ("OpenAI API Cost at Scale",
     "At high user volumes, per-request AI costs could compress margins if left unmanaged.",
     "Prompt caching, batched processing during off-peak hours, and routing simpler scoring tasks to smaller models keeps costs proportional to revenue."),
    ("Browser Automation Fragility",
     "Application pages change frequently. Automation that works today can break after a site update.",
     "Aploy targets ATS platforms with stable structures including Greenhouse, Lever, and Workday. A breakage monitoring system alerts when automation fails so it can be repaired quickly."),
    ("Large Competitor Entry",
     "LinkedIn, Indeed, or a well-funded startup could build a similar feature set with far greater resources.",
     "Aploy's advantage is speed and community. A large platform building autonomy takes years of internal bureaucracy. Aploy is already building. A devoted developer community is the most defensible moat."),
    ("AI Output Quality",
     "Poorly tuned prompts can produce generic or inaccurate resume tailoring that damages the user's applications.",
     "Every AI output is reviewed by the user before use. Prompt engineering is treated as a core product discipline with ongoing testing and iteration cycles."),
    ("Regulatory Changes",
     "Changes to GDPR, CCPA, or job board terms of service could limit data collection practices.",
     "Aploy stores only data the user explicitly authorizes. Legal review of data handling practices is planned before any public launch involving user data."),
]

for title, risk_text, mitigation_text in risks:
    name_row = Table(
        [[Paragraph(f"<b>{title}</b>",
                    S("rh", fontSize=11, fontName="Helvetica-Bold",
                      textColor=white, leading=16))]],
        colWidths=[CW]
    )
    name_row.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), SLATE),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
    ]))
    detail = Table(
        [[
            Paragraph(f"<b>Risk</b><br/>{risk_text}",
                      S("rr", fontSize=10, fontName="Helvetica",
                        textColor=HexColor("#7f1d1d"), leading=16)),
            Paragraph(f"<b>Mitigation</b><br/>{mitigation_text}",
                      S("rm", fontSize=10, fontName="Helvetica",
                        textColor=HexColor("#14532d"), leading=16)),
        ]],
        colWidths=[CW / 2, CW / 2]
    )
    detail.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, 0), HexColor("#fef2f2")),
        ("BACKGROUND",    (1, 0), (1, 0), HexColor("#f0fdf4")),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LINEABOVE",     (0, 0), (-1, 0), 2, RED),
    ]))
    story.append(name_row)
    story.append(detail)
    story.append(sp(1))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 13  THE VISION
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("13", "The Vision")

story.append(sp(2))
story.append(Paragraph(
    "Job searching has not fundamentally improved in twenty years. Developers still open the same "
    "websites, read the same listings manually, write the same cover letters, and wait in the same "
    "silence. The tools that exist today organize the problem. Aploy eliminates it.",
    BODY))

story.append(Paragraph(
    "The long-term vision for Aploy is not simply a better job board or a smarter application "
    "tracker. It is an intelligent career agent — one that understands a developer's goals, "
    "tracks the market on their behalf, prepares them for every opportunity, and advocates for "
    "their value in every interaction with a prospective employer.",
    BODY))

story.append(Paragraph(
    "For the individual developer, this means less time searching and more time preparing. "
    "For a bootcamp graduate competing against hundreds of applicants, it means access to the "
    "same systematic advantage previously reserved for candidates with elite networks. "
    "For a senior engineer quietly exploring better opportunities while currently employed, "
    "it means a system that monitors the market continuously without requiring daily attention.",
    BODY))

story.append(sp(3))

quote = Table(
    [[Paragraph(
        "We are not building a feature.\nWe are building an agent.\n\n"
        "One that works without being asked, alerts without noise,\n"
        "and prepares without hesitation.\n\nThe job search ends here.",
        S("vq", fontSize=13, fontName="Helvetica-Bold", textColor=INK,
          alignment=TA_CENTER, leading=22)
    )]],
    colWidths=[CW]
)
quote.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, -1), INDIGO_LT),
    ("TOPPADDING",    (0, 0), (-1, -1), 30),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 30),
    ("LEFTPADDING",   (0, 0), (-1, -1), 30),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 30),
    ("LINEBEFORE",    (0, 0), (0, -1),  4, INDIGO),
    ("LINEAFTER",     (-1, 0),(-1, -1), 4, INDIGO),
]))
story.append(quote)
story.append(sp(4))

story.append(rule(INDIGO, 1.5, 8, 16))
story.append(Paragraph(
    "This document is prepared for informational purposes. All financial projections are estimates "
    "based on conservative assumptions and are subject to change as the business develops.",
    CAP))
story.append(Paragraph(
    f"Aploy   |   aploy.com   |   vortia123@gmail.com   |   {datetime.date.today().strftime('%B %Y')}",
    S("fc", fontSize=10, fontName="Helvetica-Bold", textColor=INK,
      alignment=TA_CENTER, spaceAfter=4)
))

# ══════════════════════════════════════════════════════════════════════════════
# BUILD
# ══════════════════════════════════════════════════════════════════════════════
doc = BaseDocTemplate(
    OUTPUT,
    pagesize=letter,
    rightMargin=MARGIN,
    leftMargin=MARGIN,
    topMargin=MARGIN,
    bottomMargin=MARGIN,
    title="Aploy Business Plan 2026",
    author="Aploy",
)
doc.addPageTemplates([cover_tpl, toc_tpl, normal_tpl])
doc.build(story, canvasmaker=DocCanvas)
print(f"Done: {OUTPUT}")
