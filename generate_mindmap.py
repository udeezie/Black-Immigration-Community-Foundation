import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
from matplotlib.path import Path
import numpy as np

OUTPUT = "/home/user/Black-Immigration-Community-Foundation/Aploy_MindMap.pdf"

INK       = "#0f172a"
WHITE     = "#ffffff"
MUTED     = "#94a3b8"
SURFACE   = "#1e293b"

COLORS = {
    "problem":   "#ef4444",
    "market":    "#f97316",
    "business":  "#eab308",
    "gtm":       "#22c55e",
    "solution":  "#4f46e5",
    "tech":      "#0891b2",
    "roadmap":   "#a855f7",
    "mobile":    "#ec4899",
}

fig, ax = plt.subplots(figsize=(26, 18))
ax.set_xlim(-13, 13)
ax.set_ylim(-9, 9)
ax.set_aspect("equal")
ax.axis("off")
fig.patch.set_facecolor(INK)
ax.set_facecolor(INK)


# ── Bezier curve helper ────────────────────────────────────────────────────────
def bezier(ax, x0, y0, x1, y1, color, lw=2.5, alpha=0.9):
    """Smooth S-curve from (x0,y0) to (x1,y1)."""
    cp1x = x0 + (x1 - x0) * 0.5
    cp1y = y0
    cp2x = x0 + (x1 - x0) * 0.5
    cp2y = y1
    verts = [(x0, y0), (cp1x, cp1y), (cp2x, cp2y), (x1, y1)]
    codes = [Path.MOVETO, Path.CURVE4, Path.CURVE4, Path.CURVE4]
    path = Path(verts, codes)
    patch = mpatches.PathPatch(path, facecolor="none",
                                edgecolor=color, lw=lw, alpha=alpha, zorder=2)
    ax.add_patch(patch)


def branch_line(ax, x0, y0, x1, y1, color, lw=1.5, alpha=0.7):
    """Curved line from branch to leaf."""
    cp1x = x0 + (x1 - x0) * 0.6
    cp1y = y0
    cp2x = x1 - (x1 - x0) * 0.2
    cp2y = y1
    verts = [(x0, y0), (cp1x, cp1y), (cp2x, cp2y), (x1, y1)]
    codes = [Path.MOVETO, Path.CURVE4, Path.CURVE4, Path.CURVE4]
    path = Path(verts, codes)
    patch = mpatches.PathPatch(path, facecolor="none",
                                edgecolor=color, lw=lw, alpha=alpha, zorder=2)
    ax.add_patch(patch)


def draw_pill(ax, x, y, text, color, w=2.2, h=0.55,
              fontsize=9.5, bold=True, text_color=WHITE, zorder=4):
    box = FancyBboxPatch(
        (x - w / 2, y - h / 2), w, h,
        boxstyle="round,pad=0.04,rounding_size=0.22",
        facecolor=color, edgecolor="none", zorder=zorder
    )
    ax.add_patch(box)
    ax.text(x, y, text, ha="center", va="center",
            fontsize=fontsize, color=text_color,
            fontweight="bold" if bold else "normal", zorder=zorder + 1)


def draw_leaf(ax, x, y, text, color, w=2.05, zorder=5):
    lines = text.count("\n") + 1
    h = 0.44 + (lines - 1) * 0.22
    # Subtle fill
    box = FancyBboxPatch(
        (x - w / 2, y - h / 2), w, h,
        boxstyle="round,pad=0.03,rounding_size=0.18",
        facecolor=color + "30", edgecolor=color + "80",
        linewidth=0.8, zorder=zorder
    )
    ax.add_patch(box)
    ax.text(x, y, text, ha="center", va="center",
            fontsize=8, color=WHITE, fontweight="normal",
            zorder=zorder + 1, multialignment="center")


# ══════════════════════════════════════════════════════════════════════════════
#  CENTRE NODE
# ══════════════════════════════════════════════════════════════════════════════
glow = plt.Circle((0, 0), 1.55, color="#4f46e5", alpha=0.15, zorder=1)
ax.add_patch(glow)
glow2 = plt.Circle((0, 0), 1.2, color="#4f46e5", alpha=0.25, zorder=2)
ax.add_patch(glow2)
core = plt.Circle((0, 0), 0.95, color="#4f46e5", zorder=3)
ax.add_patch(core)
ax.text(0,  0.2, "APLOY", ha="center", va="center",
        fontsize=20, color=WHITE, fontweight="bold", zorder=4)
ax.text(0, -0.28, "Job Search Platform",
        ha="center", va="center", fontsize=7.5, color="#c7d2fe", zorder=4)


# ══════════════════════════════════════════════════════════════════════════════
#  RIGHT SIDE  (branches go RIGHT from center)
# ══════════════════════════════════════════════════════════════════════════════
# Branch x = 4.2,  leaves x = 7.8 to 9.8
# 4 branches spread vertically: y = +6, +2, -2, -6

right_branches = [
    {
        "key": "solution",
        "label": "SOLUTION",
        "by": 6.2,
        "leaves": [
            "01  Discovery",
            "02  Filtering",
            "03  AI Scoring",
            "04  Notifications",
            "05  Resume Tailoring",
            "06  Cover Letter",
            "07  Application",
        ],
    },
    {
        "key": "tech",
        "label": "TECHNOLOGY",
        "by": 2.1,
        "leaves": [
            "n8n  Automation",
            "Supabase  Database",
            "OpenAI  GPT-4o",
            "Next.js  Dashboard",
            "Playwright  Browser",
            "React PDF",
            "Swift  iOS",
        ],
    },
    {
        "key": "roadmap",
        "label": "ROADMAP",
        "by": -2.1,
        "leaves": [
            "Stage 1  Foundation",
            "Stage 2  Collection",
            "Stage 3  AI Scoring",
            "Stage 4  Alerts",
            "Stage 5  Dashboard",
            "Stage 6  Resumes",
            "Stage 7  Applications",
            "Stage 8  iOS App",
            "Stage 9  Launch",
        ],
    },
    {
        "key": "mobile",
        "label": "MOBILE APP",
        "by": -6.2,
        "leaves": [
            "Swift  iOS  Native",
            "Browse  Scored  Jobs",
            "Approve  or  Reject",
            "Push  Notifications",
            "Review  AI  Resumes",
        ],
    },
]

# ══════════════════════════════════════════════════════════════════════════════
#  LEFT SIDE  (branches go LEFT from center)
# ══════════════════════════════════════════════════════════════════════════════
left_branches = [
    {
        "key": "problem",
        "label": "THE PROBLEM",
        "by": 6.2,
        "leaves": [
            "3 to 6 month avg search",
            "15+ hours/week wasted",
            "150+ apps per offer",
            "Generic resumes ignored",
            "70% report burnout",
        ],
    },
    {
        "key": "market",
        "label": "MARKET",
        "by": 2.1,
        "leaves": [
            "TAM  $3.1B  Global",
            "SAM  $600M  Dev Tools",
            "27M  Developers",
            "5,000 Users  Year 3",
            "$720K  ARR  Year 3",
        ],
    },
    {
        "key": "business",
        "label": "BUSINESS MODEL",
        "by": -2.1,
        "leaves": [
            "Free  Tier  $0/mo",
            "Pro  Tier  $12/mo",
            "Lifetime  $79",
            "Referral  Program",
            "Enterprise  (Future)",
        ],
    },
    {
        "key": "gtm",
        "label": "GO-TO-MARKET",
        "by": -6.2,
        "leaves": [
            "Build  in  Public",
            "Closed  Beta  100 devs",
            "ProductHunt  Launch",
            "Dev  Communities",
            "Referral  Incentives",
        ],
    },
]


def draw_right_branch(branch):
    color = COLORS[branch["key"]]
    bx, by = 4.3, branch["by"]

    # Center to branch
    bezier(ax, 0.95, 0, bx - 1.1, by, color, lw=3.0, alpha=0.85)

    # Branch pill
    draw_pill(ax, bx, by, branch["label"], color, w=2.3, h=0.58, fontsize=10)

    # Leaves
    leaves = branch["leaves"]
    n = len(leaves)
    spread = (n - 1) * 0.72
    ys = [by + spread / 2 - i * 0.72 for i in range(n)]
    lx = bx + 2.95

    for i, (leaf, ly) in enumerate(zip(leaves, ys)):
        branch_line(ax, bx + 1.15, by, lx - 1.02, ly, color, lw=1.4)
        draw_leaf(ax, lx, ly, leaf, color, w=2.1)


def draw_left_branch(branch):
    color = COLORS[branch["key"]]
    bx, by = -4.3, branch["by"]

    # Center to branch
    bezier(ax, -0.95, 0, bx + 1.1, by, color, lw=3.0, alpha=0.85)

    # Branch pill
    draw_pill(ax, bx, by, branch["label"], color, w=2.3, h=0.58, fontsize=10)

    # Leaves
    leaves = branch["leaves"]
    n = len(leaves)
    spread = (n - 1) * 0.72
    ys = [by + spread / 2 - i * 0.72 for i in range(n)]
    lx = bx - 2.95

    for i, (leaf, ly) in enumerate(zip(leaves, ys)):
        branch_line(ax, bx - 1.15, by, lx + 1.02, ly, color, lw=1.4)
        draw_leaf(ax, lx, ly, leaf, color, w=2.1)


for b in right_branches:
    draw_right_branch(b)

for b in left_branches:
    draw_left_branch(b)


# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(0, 8.55, "APLOY  —  Mind Map",
        ha="center", fontsize=17, color=WHITE,
        fontweight="bold", zorder=6)
ax.text(0, 8.05, "Autonomous Job Search Platform  •  2026",
        ha="center", fontsize=9.5, color=MUTED, zorder=6)

# ── Legend ─────────────────────────────────────────────────────────────────────
legend = [
    ("The Problem",   "problem"),
    ("Market",        "market"),
    ("Business Model","business"),
    ("Go-to-Market",  "gtm"),
    ("Solution",      "solution"),
    ("Technology",    "tech"),
    ("Roadmap",       "roadmap"),
    ("Mobile App",    "mobile"),
]
lx0 = -8.8
for i, (lbl, key) in enumerate(legend):
    lx = lx0 + i * 2.2
    ly = -8.55
    dot = plt.Circle((lx, ly), 0.13, color=COLORS[key], zorder=6)
    ax.add_patch(dot)
    ax.text(lx + 0.25, ly, lbl, ha="left", va="center",
            fontsize=7.5, color=MUTED, zorder=6)

plt.tight_layout(pad=0.2)
plt.savefig(OUTPUT, format="pdf", dpi=300,
            facecolor=INK, bbox_inches="tight")
plt.close()
print(f"Done: {OUTPUT}")
