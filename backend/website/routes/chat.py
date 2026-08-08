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
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db
from core.ratelimit import rate_limit
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
    now = monotonic()
    if _ctx_cache and now - _ctx_cache["at"] < CTX_TTL:
        return _ctx_cache["text"]

    svc = WebsiteContentService(db)
    profile = await svc.get_profile_content()
    skills = await svc.get_skills()
    experience = await svc.get_experience()
    projects = await svc.get_projects()
    education = await svc.get_education()

    lines: List[str] = []

    sections: dict = {}
    for item in profile:
        sections.setdefault(item.section, {})[item.field_name] = item.field_value
    for section, fields in sections.items():
        lines.append(f"[{section.upper()}]")
        for k, v in fields.items():
            if v:
                lines.append(f"{k}: {v}")

    lines.append("\n[SKILLS]")
    by_cat: dict = {}
    for s in skills:
        by_cat.setdefault(s.category, []).append(f"{s.skill_name} ({s.skill_level}%)")
    for cat, items in by_cat.items():
        lines.append(f"{cat}: {', '.join(items)}")

    lines.append("\n[EXPERIENCE]")
    for e in experience:
        period = f"{e.start_date} – {e.end_date or 'Present'}"
        lines.append(f"- {e.job_title} at {e.company} ({period})")
        if e.description:
            lines.append(f"  {e.description}")
        for r in (e.responsibilities or [])[:5]:
            lines.append(f"  • {r}")

    lines.append("\n[PROJECTS]")
    for p in projects:
        tech = ", ".join(p.technologies or [])
        lines.append(f"- {p.title}: {p.tagline or p.description or ''}" + (f" [Tech: {tech}]" if tech else ""))

    lines.append("\n[EDUCATION]")
    for ed in education:
        lines.append(f"- {ed.degree}, {ed.institution} ({ed.year or 'n/a'})")

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
- Skill percentages are self-assessments. Describe strength in words ("strong in", \
"working knowledge of") rather than quoting the number back.

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
