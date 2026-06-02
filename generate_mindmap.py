import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

OUTPUT = "/home/user/Black-Immigration-Community-Foundation/Aploy_MindMap.pdf"

# ── Palette ───────────────────────────────────────────────────────────────────
INK        = "#0f172a"
INDIGO     = "#4f46e5"
INDIGO_LT  = "#e0e7ff"
WHITE      = "#ffffff"
SLATE      = "#475569"
SURFACE    = "#f8fafc"
BORDER     = "#e2e8f0"

BRANCH_COLORS = [
    "#4f46e5",  # indigo    — Problem
    "#0891b2",  # cyan      — Solution
    "#7c3aed",  # violet    — Technology
    "#059669",  # green     — Business Model
    "#d97706",  # amber     — Market
    "#db2777",  # pink      — Go-to-Market
    "#ea580c",  # orange    — Roadmap
    "#0f766e",  # teal      — Mobile App
]

fig, ax = plt.subplots(figsize=(24, 18))
ax.set_xlim(-12, 12)
ax.set_ylim(-9.5, 9.5)
ax.set_aspect("equal")
ax.axis("off")
fig.patch.set_facecolor(INK)
ax.set_facecolor(INK)


# ── Drawing helpers ───────────────────────────────────────────────────────────
def draw_node(ax, x, y, text, width, height, facecolor, textcolor=WHITE,
              fontsize=9, bold=False, radius=0.35, alpha=1.0, zorder=3):
    box = FancyBboxPatch(
        (x - width / 2, y - height / 2), width, height,
        boxstyle=f"round,pad=0.05,rounding_size={radius}",
        facecolor=facecolor, edgecolor="none", alpha=alpha, zorder=zorder
    )
    ax.add_patch(box)
    weight = "bold" if bold else "normal"
    ax.text(x, y, text, ha="center", va="center",
            fontsize=fontsize, color=textcolor, fontweight=weight,
            zorder=zorder + 1, wrap=True,
            multialignment="center")


def draw_curve(ax, x0, y0, x1, y1, color, lw=2.0, alpha=0.7, zorder=1):
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    mid_x = cx + (y1 - y0) * 0.15
    mid_y = cy - (x1 - x0) * 0.15
    from matplotlib.path import Path
    import matplotlib.patches as mpatches
    verts = [(x0, y0), (mid_x, mid_y), (x1, y1)]
    codes = [Path.MOVETO, Path.CURVE3, Path.LINETO]
    path = Path(verts, codes)
    patch = mpatches.PathPatch(path, facecolor="none",
                                edgecolor=color, lw=lw, alpha=alpha, zorder=zorder)
    ax.add_patch(patch)


def draw_line(ax, x0, y0, x1, y1, color, lw=1.5, alpha=0.6, zorder=1):
    ax.plot([x0, x1], [y0, y1], color=color, lw=lw, alpha=alpha,
            zorder=zorder, solid_capstyle="round")


# ── CENTRE NODE ───────────────────────────────────────────────────────────────
cx, cy = 0, 0
# Outer glow
circle_glow = plt.Circle((cx, cy), 1.6, color=INDIGO, alpha=0.18, zorder=1)
ax.add_patch(circle_glow)
circle_glow2 = plt.Circle((cx, cy), 1.25, color=INDIGO, alpha=0.3, zorder=2)
ax.add_patch(circle_glow2)
circle_main = plt.Circle((cx, cy), 1.0, color=INDIGO, zorder=3)
ax.add_patch(circle_main)
ax.text(cx, cy + 0.18, "APLOY", ha="center", va="center",
        fontsize=22, color=WHITE, fontweight="bold", zorder=4)
ax.text(cx, cy - 0.28, "Autonomous Job\nSearch Platform",
        ha="center", va="center", fontsize=8, color=INDIGO_LT, zorder=4,
        multialignment="center")


# ══════════════════════════════════════════════════════════════════════════════
#  BRANCH DEFINITIONS
#  Each branch: (label, angle_deg, color, children)
#  children: list of (label, sub_children_or_None)
# ══════════════════════════════════════════════════════════════════════════════
branches = [
    # ── 1. THE PROBLEM ────────────────────────────────────────
    {
        "label":  "THE PROBLEM",
        "angle":  130,
        "color":  BRANCH_COLORS[0],
        "r":      3.2,
        "children": [
            ("3 to 6 month\naverage search",    []),
            ("15+ hours/week\nwasted hunting",  []),
            ("150+ applications\nper job offer", []),
            ("Generic resumes\nignored by ATS",  []),
            ("Emotional burnout\nin 70% of seekers", []),
        ],
    },
    # ── 2. THE SOLUTION ───────────────────────────────────────
    {
        "label":  "SOLUTION",
        "angle":  72,
        "color":  BRANCH_COLORS[1],
        "r":      3.2,
        "children": [
            ("01 Discovery\n(auto job scan)",    []),
            ("02 Filtering\n(remove bad fits)",  []),
            ("03 AI Scoring\n(1 to 10 rating)",  []),
            ("04 Notifications\n(instant alerts)", []),
            ("05 Resume\nTailoring",             []),
            ("06 Cover Letter\nGeneration",      []),
            ("07 Application\nPre-fill",         []),
        ],
    },
    # ── 3. TECHNOLOGY ─────────────────────────────────────────
    {
        "label":  "TECHNOLOGY",
        "angle":  18,
        "color":  BRANCH_COLORS[2],
        "r":      3.2,
        "children": [
            ("n8n\nAutomation",   []),
            ("Supabase\nDatabase", []),
            ("OpenAI\nGPT-4o",    []),
            ("Next.js\nDashboard", []),
            ("Playwright\nBrowser", []),
            ("React PDF\nResumes", []),
            ("Swift\niOS App",    []),
        ],
    },
    # ── 4. BUSINESS MODEL ─────────────────────────────────────
    {
        "label":  "BUSINESS MODEL",
        "angle":  -35,
        "color":  BRANCH_COLORS[3],
        "r":      3.2,
        "children": [
            ("Free Tier\n$0/month",           []),
            ("Pro Tier\n$12/month",           []),
            ("Lifetime\n$79 one-time",        []),
            ("Referral\nProgram",             []),
            ("Future Enterprise\nTier",       []),
        ],
    },
    # ── 5. MARKET ─────────────────────────────────────────────
    {
        "label":  "MARKET",
        "angle":  -85,
        "color":  BRANCH_COLORS[4],
        "r":      3.2,
        "children": [
            ("TAM $3.1B\nRecruit Software",   []),
            ("SAM $600M\nDev Job Tools",      []),
            ("27M Global\nDevelopers",        []),
            ("Year 3 Target\n5,000 Users",    []),
            ("$720K ARR\nYear 3",             []),
        ],
    },
    # ── 6. GO-TO-MARKET ───────────────────────────────────────
    {
        "label":  "GO-TO-MARKET",
        "angle":  -130,
        "color":  BRANCH_COLORS[5],
        "r":      3.2,
        "children": [
            ("Build in Public\nTwitter + Reddit", []),
            ("Closed Beta\n50 to 100 Devs",     []),
            ("ProductHunt\nLaunch",              []),
            ("Dev Communities\nHacker News",     []),
            ("Referral\nIncentives",             []),
        ],
    },
    # ── 7. ROADMAP ────────────────────────────────────────────
    {
        "label":  "ROADMAP",
        "angle":  -170,
        "color":  BRANCH_COLORS[6],
        "r":      3.2,
        "children": [
            ("Stage 1\nFoundation",     []),
            ("Stage 2\nJob Collection", []),
            ("Stage 3\nAI Scoring",     []),
            ("Stage 4\nAlerts",         []),
            ("Stage 5\nDashboard",      []),
            ("Stage 6\nResumes",        []),
            ("Stage 7\nApplications",   []),
            ("Stage 8\niOS App",        []),
            ("Stage 9\nLaunch",         []),
        ],
    },
    # ── 8. MOBILE APP ─────────────────────────────────────────
    {
        "label":  "MOBILE APP",
        "angle":  165,
        "color":  BRANCH_COLORS[7],
        "r":      3.2,
        "children": [
            ("Swift iOS\nNative App",      []),
            ("Browse Scored\nListings",    []),
            ("Approve or\nReject Jobs",    []),
            ("Push Alerts\nfor Matches",   []),
            ("Review AI\nResumes",         []),
        ],
    },
]


# ── Draw all branches ─────────────────────────────────────────────────────────
for branch in branches:
    angle_rad = np.radians(branch["angle"])
    bx = branch["r"] * np.cos(angle_rad)
    by = branch["r"] * np.sin(angle_rad)
    color = branch["color"]

    # Main branch connector
    draw_curve(ax, cx, cy, bx, by, color, lw=3.0, alpha=0.85)

    # Branch node
    draw_node(ax, bx, by, branch["label"],
              width=2.0, height=0.6, facecolor=color,
              textcolor=WHITE, fontsize=10, bold=True, radius=0.25, zorder=4)

    # Children
    children = branch["children"]
    n = len(children)
    if n == 0:
        continue

    spread = 38 if n <= 5 else 52
    base_angle = branch["angle"]
    angles = np.linspace(base_angle - spread, base_angle + spread, n)

    child_r = branch["r"] + 2.4

    for i, (child_label, grandchildren) in enumerate(children):
        ca_rad = np.radians(angles[i])
        child_r_actual = child_r + (0.2 if i % 2 == 0 else 0)
        chx = child_r_actual * np.cos(ca_rad)
        chy = child_r_actual * np.sin(ca_rad)

        # Connector from branch to child
        draw_line(ax, bx, by, chx, chy, color, lw=1.5, alpha=0.55)

        # Child node
        lines = child_label.count("\n") + 1
        ch = 0.52 + (lines - 1) * 0.18
        draw_node(ax, chx, chy, child_label,
                  width=1.65, height=ch,
                  facecolor=color + "28",
                  textcolor=WHITE,
                  fontsize=7.5, bold=False, radius=0.2,
                  alpha=1.0, zorder=4)

        # Dot accent on branch node
        ax.plot(bx, by, "o", color=WHITE, markersize=3, zorder=5, alpha=0.6)


# ── Title and legend strip ─────────────────────────────────────────────────────
ax.text(0, 9.1, "APLOY  —  Comprehensive Mind Map",
        ha="center", va="center", fontsize=16,
        color=WHITE, fontweight="bold", zorder=6)
ax.text(0, 8.65, "Autonomous Job Search Platform  •  2026",
        ha="center", va="center", fontsize=9,
        color="#94a3b8", zorder=6)

# Bottom legend
legend_items = [
    ("Problem",      BRANCH_COLORS[0]),
    ("Solution",     BRANCH_COLORS[1]),
    ("Technology",   BRANCH_COLORS[2]),
    ("Business",     BRANCH_COLORS[3]),
    ("Market",       BRANCH_COLORS[4]),
    ("GTM",          BRANCH_COLORS[5]),
    ("Roadmap",      BRANCH_COLORS[6]),
    ("Mobile",       BRANCH_COLORS[7]),
]
lx_start = -8.5
for i, (lbl, col) in enumerate(legend_items):
    lx = lx_start + i * 2.15
    ly = -9.1
    dot = plt.Circle((lx, ly), 0.15, color=col, zorder=6)
    ax.add_patch(dot)
    ax.text(lx + 0.28, ly, lbl, ha="left", va="center",
            fontsize=8, color="#94a3b8", zorder=6)

# Subtle grid rings for depth
for r in [2.2, 4.6, 7.0]:
    circle = plt.Circle((0, 0), r, color=WHITE, fill=False,
                         lw=0.4, alpha=0.06, zorder=0)
    ax.add_patch(circle)

plt.tight_layout(pad=0.3)
plt.savefig(OUTPUT, format="pdf", dpi=300,
            facecolor=INK, bbox_inches="tight")
plt.close()
print(f"Done: {OUTPUT}")
