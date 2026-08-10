"""
Seed script — Mukesh Kumar portfolio data
Run: python seed_data.py
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from core.database import engine, create_tables
from models.content import ProfileContent, Skill, Experience, Project, Education
from models.certification import Certification
from sqlalchemy import text


async def clear_existing_data(session: AsyncSession):
    await session.execute(text("DELETE FROM certifications"))
    await session.execute(text("DELETE FROM education"))
    await session.execute(text("DELETE FROM projects"))
    await session.execute(text("DELETE FROM experience"))
    await session.execute(text("DELETE FROM skills"))
    await session.execute(text("DELETE FROM profile_content"))
    await session.commit()
    print("Cleared existing data")


async def seed_profile(session: AsyncSession):
    fields = [
        # Hero
        ("hero", "name",       "Mukesh Kumar Saini", "text"),
        ("hero", "tagline",    "Software Engineer | AI/ML & Full-Stack Developer", "text"),
        ("hero", "subtitle",   "Building intelligent, production-ready AI systems and scalable full-stack applications.", "text"),
        ("hero", "cta_primary",   "View My Work",    "text"),
        ("hero", "cta_secondary", "Get In Touch",    "text"),

        # About
        ("about", "bio", (
            "I'm a Software Engineer from India with 3+ years of experience, specializing in AI/ML, "
            "backend development and scalable systems. I have hands-on expertise in Python "
            "(Django, Flask, FastAPI), .NET Core, React, and modern AI/ML stacks including LLMs, BERT, "
            "RAG pipelines, NLP and computer vision. Across my roles I've improved system performance "
            "by 30%, reduced query load by 30% and increased user engagement by 25%, working in "
            "cross-functional teams alongside colleagues in the USA."
        ), "textarea"),
        ("about", "location",     "Mohali, Punjab, India",      "text"),
        ("about", "email",        "codermsaini@gmail.com",       "text"),
        ("about", "phone",        "+91 8219005065",              "text"),
        ("about", "availability", "Open to Opportunities",       "text"),

        # Stats — drive the hero and About counters, and the chat assistant's
        # QUICK FACTS block. Keep in sync with the CV.
        ("about", "stat_years",    "3",  "text"),
        ("about", "stat_projects", "11", "text"),
        ("about", "stat_certs",    "1",  "text"),
        ("about", "github_url",   "https://github.com/mukeshkumar",                              "url"),
        ("about", "linkedin_url", "https://linkedin.com/in/mukesh-saini-01360b17b",              "url"),
        ("about", "resume_url",   "/uploads/Mukesh_Kumar_CV.pdf",                                "url"),

        # Contact
        ("contact", "heading",    "Let's Work Together",                               "text"),
        ("contact", "subheading", "Have a project or opportunity? I'd love to hear from you.", "text"),
        ("contact", "email",      "codermsaini@gmail.com",       "text"),
        ("contact", "phone",      "+91 8219005065",              "text"),
        ("contact", "location",   "Mohali, Punjab, India",       "text"),

        # Meta
        ("meta", "site_title",       "Mukesh Kumar | Software Engineer & AI Developer", "text"),
        ("meta", "site_description", "Portfolio of Mukesh Kumar — AI/ML Engineer & Full-Stack Developer", "text"),
    ]

    for section, field_name, field_value, field_type in fields:
        session.add(ProfileContent(
            section=section, field_name=field_name,
            field_value=field_value, field_type=field_type, is_active=True
        ))
    await session.commit()
    print(f"Seeded {len(fields)} profile fields")


async def seed_skills(session: AsyncSession):
    skills = [
        # Languages
        ("Languages", "Python",        95, "fab fa-python",    1),
        ("Languages", "JavaScript",    88, "fab fa-js",         2),
        ("Languages", "TypeScript",    85, "fab fa-js-square",  3),
        ("Languages", "C#",            80, "fas fa-code",       4),
        ("Languages", "HTML / CSS",    88, "fab fa-html5",      5),
        ("Languages", "SQL",           82, "fas fa-database",   6),

        # Frameworks & Libraries
        ("Frameworks & Libraries", "FastAPI",      90, "fas fa-bolt",       1),
        ("Frameworks & Libraries", "Django",       85, "fas fa-layer-group",2),
        ("Frameworks & Libraries", "Flask",        82, "fas fa-flask",      3),
        ("Frameworks & Libraries", "React",        80, "fab fa-react",      4),
        ("Frameworks & Libraries", ".NET Core",    78, "fas fa-cogs",       5),
        ("Frameworks & Libraries", "React Native", 72, "fab fa-react",     6),

        # AI & Machine Learning
        ("AI & Machine Learning", "LLMs / GPT-4",         88, "fas fa-robot",      1),
        ("AI & Machine Learning", "BERT / Transformers",  85, "fas fa-brain",      2),
        ("AI & Machine Learning", "RAG Pipelines",        85, "fas fa-search",     3),
        ("AI & Machine Learning", "NLP",                  82, "fas fa-comments",   4),
        ("AI & Machine Learning", "PyTorch / LoRA",       80, "fas fa-fire",       5),
        ("AI & Machine Learning", "Computer Vision",      75, "fas fa-eye",        6),

        # Databases
        ("Databases", "PostgreSQL",   88, "fas fa-database",  1),
        ("Databases", "MySQL",        82, "fas fa-database",  2),
        ("Databases", "MongoDB",      80, "fas fa-leaf",      3),
        ("Databases", "QDRANT / FAISS", 78, "fas fa-vector-square", 4),
        ("Databases", "SQLite",       80, "fas fa-table",     5),
        ("Databases", "SQLAlchemy",   85, "fas fa-layer-group", 6),

        # Cloud & DevOps
        ("Cloud & DevOps", "Azure",   85, "fab fa-microsoft", 1),
        ("Cloud & DevOps", "Git",     92, "fab fa-git-alt",   2),
        ("Cloud & DevOps", "Docker",  80, "fab fa-docker",    3),
        ("Cloud & DevOps", "CI/CD",   75, "fas fa-infinity",  4),

        # Tools
        ("Tools", "VS Code",    95, "fas fa-code",       1),
        ("Tools", "Postman",    88, "fas fa-paper-plane",2),
        ("Tools", "Jupyter",    82, "fas fa-book",       3),
        ("Tools", "Socket.io",  75, "fas fa-plug",       4),
    ]

    for category, skill_name, skill_level, icon_class, display_order in skills:
        session.add(Skill(
            category=category, skill_name=skill_name,
            skill_level=skill_level, icon_class=icon_class,
            display_order=display_order, is_active=True
        ))
    await session.commit()
    print(f"Seeded {len(skills)} skills")


async def seed_experience(session: AsyncSession):
    experiences = [
        {
            "job_title":   "Software Engineer",
            "company":     "Signity Software Solutions Pvt. Ltd.",
            "location":    "Mohali, Punjab",
            "start_date":  "Jan 2025",
            "end_date":    None,
            "is_current":  True,
            "description": (
                "AI/ML Engineer building scalable, production-ready AI systems using NLP, computer vision, "
                "and multimodal models. Specialized in model fine-tuning, inference optimization, and "
                "retrieval-based pipelines. Developed high-performance FastAPI backends with secure "
                "authentication, async processing, and efficient data handling."
            ),
            "responsibilities": [
                "Designed end-to-end AI workflows including document processing, semantic search, and LLM-powered responses",
                "Built Wiztra AI — a multi-tenant AI chatbot SaaS that crawls a customer's website into a hybrid RAG "
                "knowledge base (pgvector, Postgres full-text search, Apache AGE knowledge graph) and serves it through "
                "an embeddable widget with lead capture and booking",
                "Fine-tuned Qwen2.5-VL multimodal models using PyTorch and LoRA adapters for compliance analysis",
                "Built RAG pipelines with PGVector and SentenceTransformers for enterprise document intelligence",
                "Developed FastAPI backends with JWT authentication, async processing, and role-based access control",
                "Led development of Dashworks Search — a macOS app connecting third-party platforms using Python & React",
                "Developed Activue App — a multi-platform entertainment app for elderly residents using React Native & Python",
                "Collaborated cross-functionally to deliver enterprise-grade AI solutions",
            ],
            "achievements": [
                "Built Plan and Proof — automated NCC compliance checker for Australian building plans using Qwen2.5-VL",
                "Delivered Wisdom-AI — RAG-powered BI platform with multi-source data ingestion and custom chatbots",
                "Developed SDTM Issue Tracker — clinical trial quality management system with full audit trail",
            ],
            "technologies": "Python, FastAPI, PyTorch, Qwen2.5-VL, BERT, LangChain, PGVector, React, PostgreSQL, Docker, Azure, Next.js, TypeScript, Redis, BullMQ",
            "display_order": 1,
        },
        {
            "job_title":   "Jr. Software Engineer",
            "company":     "C.S. Soft Solutions (India) Private Limited",
            "location":    "Mohali, Punjab",
            "start_date":  "July 2023",
            "end_date":    "December 2024",
            "is_current":  False,
            "description": (
                "Developed and deployed custom web applications using Python, AI/ML, and .NET technologies, "
                "optimizing user interactions and increasing engagement by 25%. Enhanced system performance "
                "by streamlining API interactions and working on enterprise projects like Solstice Health, "
                "SNiP Nutrigenomics, MOA WebApp, and Mill Data Admin."
            ),
            "responsibilities": [
                "Developed full-stack applications using Python (Flask/Django), ReactJS, and .NET Core",
                "Built and integrated RESTful APIs for seamless frontend-backend communication",
                "Developed interactive dashboards and user management for Solstice Health and SNiP Nutrigenomics",
                "Implemented role-based access control and authentication for admin modules",
                "Created and optimized stored procedures and SQL queries to enhance database efficiency",
                "Integrated GPT-4 & LLM-based AI solutions for Solstice Health content evaluation and generation",
                "Coordinated with cross-cultural teams in the USA ensuring timely project delivery",
            ],
            "achievements": [
                "Increased user engagement by 25% through optimized user interactions",
                "Reduced query load by 30% using stored procedures and database indexing",
                "Enhanced web application performance by 20% through ReactJS and AJAX optimizations",
                "Improved backend efficiency by 30% through API optimization and data flow enhancement",
            ],
            "technologies": "Python, Flask, Django, .NET Core, React, JavaScript, PostgreSQL, MySQL, MongoDB, GPT-4, LLMs",
            "display_order": 2,
        },
        {
            "job_title":   "Software Engineering Intern",
            "company":     "CS Infotech",
            "location":    "Sector 22 C, Chandigarh",
            "start_date":  "December 2022",
            "end_date":    "June 2023",
            "is_current":  False,
            "description": (
                "Developed an eCommerce web application using ASP.NET Core MVC, implementing "
                "authentication with Identity Framework and OAUTH, and integrating Stripe for secure "
                "payment transactions. Contributed to Web API development in ASP.NET Core."
            ),
            "responsibilities": [
                "Built eCommerce web application using ASP.NET Core MVC",
                "Implemented authentication with Identity Framework and OAUTH 2.0",
                "Integrated Stripe payment gateway for secure transaction processing",
                "Contributed to Web API development in ASP.NET Core",
                "Enhanced communication between frontend and backend applications",
            ],
            "achievements": [
                "Successfully delivered fully functional eCommerce platform with payment integration",
                "Enhanced API functionality improving frontend-backend communication efficiency",
            ],
            "technologies": "ASP.NET Core MVC, C#, Identity Framework, OAUTH, Stripe API, Web API",
            "display_order": 3,
        },
    ]

    for exp in experiences:
        session.add(Experience(**exp))
    await session.commit()
    print(f"Seeded {len(experiences)} experiences")


async def seed_projects(session: AsyncSession):
    projects = [
        {
            "title":       "Wiztra AI — Enterprise AI Chatbot Platform",
            "tagline":     "No-code SaaS that turns any website into a brand-aware AI support agent",
            "description": (
                "Multi-tenant SaaS platform that crawls a company's website, builds a hybrid-retrieval "
                "knowledge base from it, and deploys an embeddable chat widget. Works like a support agent "
                "that already knows the product — answers customers 24/7, captures leads, and takes bookings "
                "without a human in the loop. Built as a Turborepo monorepo with a Next.js frontend, BullMQ "
                "background workers, a Hono-based MCP microservice, and a standalone Python crawler run as a "
                "managed subprocess."
            ),
            "role": "Full-Stack / AI Engineer",
            "technologies": [
                "Next.js", "TypeScript", "React", "PostgreSQL", "pgvector",
                "Apache AGE", "Prisma", "Redis", "BullMQ", "Python",
            ],
            "features": [
                "Hybrid RAG pipeline combining pgvector semantic search, Postgres full-text search and an "
                "Apache AGE knowledge graph, with reranking, confidence scoring and faithfulness evaluation",
                "Website-crawl onboarding that ingests a customer's site and auto-generates an editable AI "
                "Site Persona — brand tone, colours and suggested starter questions",
                "Multi-LLM router with automatic fallback (OpenAI → Cloudflare Workers AI → local Ollama) for "
                "chat and embeddings, plus a guardrail engine for input/output safety filtering",
                "Document ingestion pipeline: upload → S3/MinIO → Redis/BullMQ jobs → chunking, bge-m3 "
                "embeddings and GLiNER entity extraction feeding the knowledge graph",
                "Embeddable chat widget with in-widget Google Calendar booking, plus Slack OAuth, Shopify "
                "sync and Gmail integrations",
                "Agentic layer on top of RAG: multi-agent crew orchestration, a React Flow visual workflow "
                "builder, and MCP server APIs exposing the knowledge base to external AI tools",
            ],
            "live_url":    None,
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-comments",
            "project_tag": "AI / Chatbot",
            "is_featured": True,
            "display_order": 1,
        },
        {
            "title":       "Envisify — BERT Text Analysis",
            "tagline":     "Enterprise text analysis using fine-tuned BERT classification",
            "description": (
                "Advanced text analysis application designed to enhance enterprise capabilities by fine-tuning "
                "on diverse text datasets. Leverages BERT Base Classification to analyze ethnicity, age groups, "
                "and sentiment. Incorporates GPT prompt functionality and a Next.js frontend for dynamic text analysis."
            ),
            "role": "ML Engineer",
            "technologies": ["Python", "BERT", "HuggingFace", "GPT", "Next.js", "FastAPI"],
            "features": [
                "Fine-tuned BERT models for ethnicity, age group, and sentiment analysis",
                "GPT prompt integration for enhanced text generation",
                "Dynamic Next.js frontend for real-time text analysis",
                "Third-party platform integrations",
            ],
            "live_url":    None,
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-brain",
            "project_tag": "AI / NLP",
            "is_featured": True,
            "display_order": 1,
        },
        {
            "title":       "Plan and Proof — NCC Compliance AI",
            "tagline":     "Fine-tuned Qwen2.5-VL for Australian building code compliance",
            "description": (
                "AI-powered system that analyzes building plans and architectural drawings to determine "
                "compliance with the National Construction Code (NCC) of Australia. Functions like an "
                "automated building inspector — reads PDF drawings, extracts technical details, and identifies "
                "compliance issues based on Australian building standards."
            ),
            "role": "AI Engineer",
            "technologies": ["Python", "FastAPI", "Qwen2.5-VL", "PyTorch", "LoRA", "PEFT", "HuggingFace", "pdf2image", "aiofiles"],
            "features": [
                "Fine-tuned Qwen2.5-VL multimodal model with LoRA adapters on NCC datasets",
                "FastAPI backend for PDF upload, processing, and model inference endpoints",
                "PDF to high-resolution image conversion for AI interpretation",
                "Asynchronous file operations for concurrent large file uploads",
                "JSON-repair for stable LLM output processing",
            ],
            "live_url":    None,
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-file-code",
            "project_tag": "AI / NLP",
            "is_featured": True,
            "display_order": 2,
        },
        {
            "title":       "Wisdom-AI — RAG Business Intelligence",
            "tagline":     "RAG-powered platform to interact with enterprise data using natural language",
            "description": (
                "RAG-powered business intelligence platform enabling users to interact with their data using "
                "natural language. Works like a personal data analyst — ask questions, generate insights, "
                "visualize results, and receive proactive recommendations. Supports enterprise-grade security, "
                "seamless data integration (Google Drive, HubSpot, CSV, cloud storage), and customizable "
                "knowledge bases."
            ),
            "role": "AI Engineer",
            "technologies": ["Python", "FastAPI", "PGVector", "SentenceTransformers", "HuggingFace", "PostgreSQL", "LLMs"],
            "features": [
                "Full RAG pipeline: document chunking, embedding, vector storage, semantic search, LLM response",
                "Multi-source data ingestion: Google Drive, HubSpot, CSV/Excel, cloud storage",
                "Custom knowledge-base chatbots for domain-specific AI assistants",
                "Enterprise-grade security with authentication and role-based access",
                "PGVector integration for efficient vector similarity search",
            ],
            "live_url":    None,
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-robot",
            "project_tag": "AI / Chatbot",
            "is_featured": True,
            "display_order": 3,
        },
        {
            "title":       "SDTM Issue Tracker",
            "tagline":     "Clinical trial data quality management system",
            "description": (
                "Clinical trial data quality management system designed to identify, track, and resolve issues "
                "across multiple medical studies. Helps research teams maintain SDTM compliance with a "
                "workflow: New → In Progress → Review → Approved → Resolved. Includes dashboards, filters, "
                "analytics, and complete audit trails."
            ),
            "role": "Backend Developer",
            "technologies": ["FastAPI", "SQLAlchemy", "MySQL", "JWT", "Docker", "Python"],
            "features": [
                "Issue lifecycle workflow: New → In Progress → Review → Approved → Resolved",
                "JWT authentication with role-based access control",
                "Dashboard analytics for priority counts, user assignments, study summaries",
                "Complete activity timeline and audit trail for regulatory compliance",
                "Docker-based deployment with async API performance optimization",
            ],
            "live_url":    None,
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-clipboard-check",
            "project_tag": "Backend / API",
            "is_featured": True,
            "display_order": 4,
        },
        {
            "title":       "Solstice Health",
            "tagline":     "AI-driven content creation engine for life sciences marketing",
            "description": (
                "AI-driven engine designed to assist life sciences marketing teams in accelerating the "
                "creation and evaluation of compliant content. Developed backend architecture, robust APIs, "
                "and user management features using Python, Flask, and GPT-4."
            ),
            "role": "Backend Developer",
            "technologies": ["Python", "Flask", "GPT-4", "LLMs", "ReactJS", "REST API"],
            "features": [
                "GPT-4 & LLM-based AI for compliant content evaluation and generation",
                "User management and role-based access control",
                "Robust API layer with optimized data flow",
                "Annotation management and database record operations",
            ],
            "live_url":    "https://www.solsticehealth.co/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-heartbeat",
            "project_tag": "AI / NLP",
            "is_featured": False,
            "display_order": 5,
        },
        {
            "title":       "SNiP Nutrigenomics",
            "tagline":     "DNA-based personalized health product platform",
            "description": (
                "DNA-based custom health product application where products are personalized based on "
                "customers' DNA reports in an MLM-based business model. Developed backend functionalities "
                "including White Labeling, Admin Panel, and commission management."
            ),
            "role": "Backend Developer",
            "technologies": ["Python", "Django", "REST API", "JavaScript", "PostgreSQL"],
            "features": [
                "DNA report integration for personalized product recommendations",
                "White Labeling system for multi-brand support",
                "Admin Panel for commission and report distribution management",
                "Wellness Pro Adviser management system",
            ],
            "live_url":    "https://snipnutrition.com/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-dna",
            "project_tag": "Full Stack",
            "is_featured": False,
            "display_order": 6,
        },
        {
            "title":       "Music Recommendation System",
            "tagline":     "ML/NLP-powered personalized music suggestions",
            "description": (
                "Music recommendation system using Machine Learning and Natural Language Processing for "
                "personalized music suggestions. Built using CountVectorization and cosine similarity, "
                "processed 100,000 entries, integrated Saavn API, and deployed with a Streamlit interface."
            ),
            "role": "ML Engineer",
            "technologies": ["Python", "NLP", "Cosine Similarity", "Saavn API", "Streamlit"],
            "features": [
                "CountVectorization and cosine similarity for content-based recommendations",
                "Processed 100,000 entry dataset for optimized model performance",
                "Saavn API integration for music metadata and details",
                "Streamlit user interface for interactive music discovery",
            ],
            "live_url":    "https://mamusic.streamlit.app/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-music",
            "project_tag": "AI / NLP",
            "is_featured": False,
            "display_order": 7,
        },
        {
            "title":       "Cuisine Predictor",
            "tagline":     "ML-powered cuisine preference prediction using logistic regression",
            "description": (
                "Cuisine Predictor system that predicts a user's preferred cuisine using logistic regression. "
                "Built user interfaces with Flask and Streamlit, deployed on OnRender for scalability."
            ),
            "role": "ML Engineer",
            "technologies": ["Python", "Logistic Regression", "Flask", "Streamlit", "Scikit-learn"],
            "features": [
                "Logistic regression model trained for cuisine classification",
                "Dual UI: Flask web app and Streamlit interface",
                "Deployed on OnRender for cloud-native scalability",
            ],
            "live_url":    "https://predicterofcuisine.onrender.com/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-utensils",
            "project_tag": "AI / NLP",
            "is_featured": False,
            "display_order": 8,
        },
        {
            "title":       "MOA — MyOutdoor Agent",
            "tagline":     "Comprehensive outdoor activity management web application",
            "description": (
                "Developed and maintained web features for the MOA WebApp, focusing on user experience and "
                "functionality. Managed the Admin Module including user sign-in, sign-up, and subscription "
                "management. Created stored procedures and database views for performance optimization."
            ),
            "role": "Full Stack Developer",
            "technologies": ["C#", "ASP.NET Core", "Web API", "Azure", "React", "jQuery", "SQL"],
            "features": [
                "Admin Module with user authentication and subscription management",
                "Stored procedures optimizing application functionality",
                "Database views reducing query load by 20%",
                "Overall application performance enhancement",
            ],
            "live_url":    "https://myoutdooragent.com/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-map-marked-alt",
            "project_tag": "Full Stack",
            "is_featured": False,
            "display_order": 9,
        },
        {
            "title":       "Mill Data Admin",
            "tagline":     "Real-time mill capacity insights platform for North America",
            "description": (
                "Real-time platform providing insights into mill capacities across North America, offering "
                "industry professionals critical decision-making data. Developed user authentication pages, "
                "CRUD operations via stored procedures, and optimized database views."
            ),
            "role": "Backend Developer",
            "technologies": ["C#", ".NET Core", "jQuery", "Ajax", "SQL Server", "Stored Procedures"],
            "features": [
                "User authentication: login, password recovery, client profiles",
                "Stored procedures for efficient CRUD operations",
                "Database views reducing query load by 30%",
                "Admin Module for user authentication and subscription management",
            ],
            "live_url":    "https://admin-forisk.orbisprojects.com/",
            "github_url":  None,
            "image_url":   None,
            "icon_class":  "fas fa-industry",
            "project_tag": "Backend / API",
            "is_featured": False,
            "display_order": 10,
        },
    ]

    # display_order follows list position, so reordering this list is enough —
    # the per-entry values below are ignored rather than renumbered by hand.
    for index, project in enumerate(projects, start=1):
        session.add(Project(**{**project, "display_order": index}))
    await session.commit()
    print(f"Seeded {len(projects)} projects")


async def seed_education(session: AsyncSession):
    education = [
        {
            "degree":      "Master of Computer Applications (MCA)",
            "institution": "Himachal Pradesh University (HPU)",
            "location":    "Shimla, Himachal Pradesh",
            "year":        "2020 – 2022",
            "grade":       "CGPA 7.79",
            "description": (
                "Relevant coursework: Advanced Algorithms & Data Structures, Machine Learning & AI, "
                "Database Management Systems, Software Engineering, Web Technologies."
            ),
            "type":          "degree",
            "icon_class":    "fas fa-graduation-cap",
            "display_order": 1,
        },
        {
            "degree":      "Bachelor of Computer Applications (BCA)",
            "institution": "Himachal Pradesh University",
            "location":    "India",
            "year":        "2017 – 2020",
            "grade":       None,
            "description": (
                "Relevant coursework: Programming Fundamentals, Object-Oriented Programming, "
                "Database Systems, Web Development, Computer Networks."
            ),
            "type":          "degree",
            "icon_class":    "fas fa-graduation-cap",
            "display_order": 2,
        },
    ]

    for edu in education:
        session.add(Education(**edu))
    await session.commit()
    print(f"Seeded {len(education)} education records")


async def seed_certifications(session: AsyncSession):
    certifications = [
        {
            "name":           "Microsoft Certified: Azure AI Engineer Associate",
            "issuer":         "Microsoft",
            "credential_id":  "A76EDCB4BBE3F103",
            "credential_url": "https://learn.microsoft.com/en-us/users/mukeshkumar-5845/credentials/certification/azure-ai-engineer?tab=credentials-tab",
            "issue_date":     "February 7, 2026",
            "expiry_date":    "February 8, 2027",
            "description": (
                "Validates expertise in designing and implementing AI solutions using Azure AI Services, "
                "Azure OpenAI Service, and Azure Cognitive Search. Demonstrates proficiency in NLP, "
                "computer vision, and conversational AI on the Microsoft Azure platform. "
                "Certification number: Q95F6F-2CCC74."
            ),
            "badge_url":      "/images/azure-cert.png",
            "display_order":  1,
            "is_active":      True,
        },
    ]

    for cert in certifications:
        session.add(Certification(**cert))
    await session.commit()
    print(f"Seeded {len(certifications)} certifications")


async def main():
    print("Starting data seeding...")
    await create_tables()

    async with AsyncSession(engine) as session:
        await clear_existing_data(session)
        await seed_profile(session)
        await seed_skills(session)
        await seed_experience(session)
        await seed_projects(session)
        await seed_education(session)
        await seed_certifications(session)

    print("\nData seeding completed successfully!")
    print("Profile, Skills, Experience (3), Projects (10), Education (2), Certifications (1)")


if __name__ == "__main__":
    asyncio.run(main())
