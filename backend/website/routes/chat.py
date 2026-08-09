"""
AI Chatbot — answers visitor questions about the portfolio owner.
Powered by OpenAI (gpt-4o-mini) with live portfolio data as context.
"""

import logging
from time import monotonic
from typing import List, Literal, Optional

import openai
from fastapi import APIRouter, Depends, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db
from core.ratelimit import rate_limit
from models.certification import Certification
from website.services.content_service import WebsiteContentService

logger = logging.getLogger("portfolio.chat")

router = APIRouter()

_client: Optional[AsyncOpenAI] = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


# ── Schemas ──────────────────────────────────────────────────────────

class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: List[ChatTurn] = Field(default_factory=list, max_length=10)


class ChatResponse(BaseModel):
    reply: str


# ── Portfolio context (cached 5 min, same TTL as the portfolio endpoint) ──

_ctx_cache: dict = {}
CTX_TTL = 300


async def build_portfolio_context(db: AsyncSession) -> str:
    """Everything the assistant is allowed to know, as plain text.

    Recruiters ask a narrow set of things — how long has he worked, where is
    he now, what has he shipped, is he certified, how do I reach him — so the
    context leads with a QUICK FACTS block answering those directly rather
    than making the model infer them from the sections below.
    """
    now = monotonic()
    if _ctx_cache and now - _ctx_cache["at"] < CTX_TTL:
        return _ctx_cache["text"]

    svc = WebsiteContentService(db)
    profile = await svc.get_profile_content()
    skills = await svc.get_skills()
    experience = await svc.get_experience()
    projects = await svc.get_projects()
    education = await svc.get_education()

    # Certifications live outside WebsiteContentService. They were missing
    # from this context entirely, so "is he certified?" — a question every
    # recruiter asks — was answered with "I don't have that information"
    # while the data sat in the database.
    certs = (
        (
            await db.execute(
                select(Certification)
                .where(Certification.is_active == True)  # noqa: E712
                .order_by(Certification.display_order)
            )
        )
        .scalars()
        .all()
    )

    sections: dict = {}
    for item in profile:
        if item.field_value:
            sections.setdefault(item.section, {})[item.field_name] = item.field_value

    about = sections.get("about", {})
    hero = sections.get("hero", {})
    contact = sections.get("contact", {})

    lines: List[str] = []

    # ── Quick facts ──────────────────────────────────────────────────
    current = next((e for e in experience if e.is_current), None)
    years = about.get("stat_years")

    lines.append("[QUICK FACTS]")
    lines.append(f"Name: {hero.get('name', 'Mukesh Kumar Saini')}")
    if hero.get("tagline"):
        lines.append(f"Title: {hero['tagline']}")
    if years:
        lines.append(f"Total professional experience: {years}+ years")
    if current:
        lines.append(
            f"Currently: {current.job_title} at {current.company} (since {current.start_date})"
        )
    if about.get("location"):
        lines.append(f"Based in: {about['location']}")
    if about.get("availability"):
        lines.append(f"Availability: {about['availability']}")
    for key, label in (("email", "Email"), ("phone", "Phone")):
        value = about.get(key) or contact.get(key)
        if value:
            lines.append(f"{label}: {value}")
    if about.get("linkedin_url"):
        lines.append(f"LinkedIn: {about['linkedin_url']}")
    if about.get("github_url"):
        lines.append(f"GitHub: {about['github_url']}")
    lines.append(
        f"Portfolio contains: {len(experience)} roles, {len(projects)} projects, "
        f"{len(skills)} skills, {len(certs)} certification(s)"
    )

    # ── Profile prose ────────────────────────────────────────────────
    if about.get("bio"):
        lines.append("\n[BIO]")
        lines.append(about["bio"])

    # ── Skills ───────────────────────────────────────────────────────
    lines.append("\n[SKILLS]")
    by_cat: dict = {}
    for s in skills:
        # The level is a self-assessment. It is given as a coarse band so the
        # model can say "strong in" without quoting a fake-precise percentage.
        band = "core" if s.skill_level >= 85 else "working"
        by_cat.setdefault(s.category, []).append(f"{s.skill_name} ({band})")
    for cat, items in by_cat.items():
        lines.append(f"{cat}: {', '.join(items)}")

    # ── Experience ───────────────────────────────────────────────────
    lines.append("\n[EXPERIENCE]")
    for e in experience:
        period = f"{e.start_date} – {'Present' if e.is_current else (e.end_date or 'n/a')}"
        lines.append(f"- {e.job_title} at {e.company} ({period})")
        if e.location:
            lines.append(f"  Location: {e.location}")
        if e.description:
            lines.append(f"  {e.description}")
        for r in e.responsibilities or []:
            lines.append(f"  • {r}")
        if e.technologies:
            lines.append(f"  Tech: {e.technologies}")

    # ── Projects ─────────────────────────────────────────────────────
    lines.append("\n[PROJECTS]")
    for p in projects:
        flag = " [FEATURED]" if p.is_featured else ""
        lines.append(f"- {p.title}{flag}")
        if p.tagline:
            lines.append(f"  {p.tagline}")
        if p.description:
            lines.append(f"  {p.description}")
        if p.technologies:
            lines.append(f"  Tech: {', '.join(p.technologies)}")
        for f in (p.features or [])[:4]:
            lines.append(f"  • {f}")
        links = []
        if p.live_url:
            links.append(f"live: {p.live_url}")
        if p.github_url:
            links.append(f"source: {p.github_url}")
        if links:
            lines.append(f"  Links — {', '.join(links)}")

    # ── Certifications ───────────────────────────────────────────────
    lines.append("\n[CERTIFICATIONS]")
    if certs:
        for c in certs:
            span = " – ".join(x for x in (c.issue_date, c.expiry_date) if x)
            lines.append(f"- {c.name} — issued by {c.issuer}" + (f" ({span})" if span else ""))
            if c.credential_id:
                lines.append(f"  Credential ID: {c.credential_id}")
            if c.credential_url:
                lines.append(f"  Verify at: {c.credential_url}")
            if c.description:
                lines.append(f"  {c.description}")
    else:
        lines.append("None listed.")

    # ── Education ────────────────────────────────────────────────────
    lines.append("\n[EDUCATION]")
    for ed in education:
        lines.append(f"- {ed.degree}, {ed.institution} ({ed.year or 'n/a'})")
        if ed.grade:
            lines.append(f"  Grade: {ed.grade}")

    text = "\n".join(lines)
    _ctx_cache.update(text=text, at=now)
    return text


SYSTEM_PROMPT = """You are the assistant on Mukesh Kumar Saini's portfolio site. Visitors \
are usually recruiters, hiring managers or potential collaborators sizing him up quickly.

## Grounding — this is absolute
- Answer ONLY from the PORTFOLIO DATA below. It is the complete set of what you know.
- If the answer is not in the data, say so plainly in one sentence and point to the \
[contact form](#contact). Never guess, never hedge into an invented answer.
- Never invent or inflate a skill, project, employer, date, metric or credential.
- QUICK FACTS is the authority for years of experience, current role, location, \
availability and contact details. Use it verbatim rather than recalculating from dates.
- Skills are tagged "core" or "working" — that is a self-assessment, so say \
"strong in" or "has worked with" rather than implying a measured ranking.

## Questions you will get most
Recruiters and hiring managers ask a narrow set of things. Answer these crisply:
- **How much experience?** — QUICK FACTS has the total; name the current role and employer.
- **Is he a fit for [role]?** — map their stack onto his. Name the specific projects or \
employers where he used each overlapping technology. Be honest about what is missing.
- **What has he built?** — lead with FEATURED projects, say what each one does and the \
stack, and link it if a live or source URL exists.
- **Is he certified?** — CERTIFICATIONS has the full list with issuer and credential ID.
- **Is he available / how do I reach him?** — QUICK FACTS has availability and email; \
also offer the [contact form](#contact).
- **Notice period, salary, visa status** — not in the data. Say so and point to contact.

## How to answer
- Lead with the answer. No preamble, no "Great question!", no restating the question.
- 2–4 sentences for most questions. Use a short bullet list only when genuinely \
enumerating things (projects, technologies, responsibilities) — never for prose.
- Be specific. Name the actual project, company or technology instead of saying \
"several projects" or "various technologies". Specifics are what earn trust here.
- Speak about Mukesh in the third person, warm and matter-of-fact. You are informed \
and helpful, not a salesperson — no hype adjectives, no emoji, no exclamation marks.
- When a natural next question exists, end with one short offer, e.g. \
"Want the technical detail on that one?" Only when it genuinely helps.

## Formatting
The interface renders a small subset of Markdown. You may use:
- **bold** for names of projects, companies and technologies — use it sparingly
- `inline code` for tool, library and language names
- `- ` bullet lists
- [link text](#section-id) to point at a section of this page. Valid ids: \
#about, #skills, #experience, #projects, #certifications, #education, #contact
Do not use headings, tables, code blocks or images — they will not render.

## Scope
If asked something unrelated to Mukesh or his work, decline in one line and offer \
something you can help with instead. Answer in whatever language the visitor writes in.

PORTFOLIO DATA:
{context}"""


# ── Route ────────────────────────────────────────────────────────────

@router.post(
    "/",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limit("chat", max_requests=20, window_seconds=3600))],
)
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Ask the portfolio AI assistant a question"""
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="AI assistant is not configured")

    context = await build_portfolio_context(db)

    messages = [{"role": "system", "content": SYSTEM_PROMPT.format(context=context)}]
    for turn in req.history:
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": req.message})

    try:
        completion = await get_client().chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=500,
            temperature=0.6,
        )
        reply = (completion.choices[0].message.content or "").strip()
        if not reply:
            raise HTTPException(status_code=502, detail="Empty response from AI")
        return ChatResponse(reply=reply)

    except openai.AuthenticationError:
        logger.error("OpenAI authentication failed — check OPENAI_API_KEY")
        raise HTTPException(status_code=503, detail="AI assistant is not configured")
    except openai.RateLimitError:
        raise HTTPException(status_code=429, detail="AI assistant is busy. Try again in a moment.")
    except openai.APIError:
        logger.exception("OpenAI API error")
        raise HTTPException(status_code=502, detail="AI assistant is temporarily unavailable")
