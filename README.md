# Portfolio — Full Stack (Next.js + FastAPI)

A production-ready portfolio with a separate **public website** and **admin dashboard**, powered by a **FastAPI** backend and **PostgreSQL** database.

---

## Project Structure

```
Portfolio/
├── backend/                  # FastAPI backend (Python)
│   ├── main.py               # App entry point
│   ├── requirements.txt
│   ├── seed_admin.py         # Create initial admin user
│   ├── .env.example
│   ├── core/                 # Config, DB, Security
│   ├── models/               # SQLAlchemy models
│   ├── admin/                # Admin APIs
│   │   ├── routes/           # auth, content, media
│   │   ├── schemas/
│   │   └── services/
│   └── website/              # Public APIs
│       ├── routes/           # content, contact
│       ├── schemas/
│       └── services/
│
└── frontend/
    ├── admin/                # Next.js 15 — Admin Dashboard (port 3001)
    │   ├── app/
    │   │   ├── login/
    │   │   └── dashboard/    # content, projects, experience, education, media
    │   ├── components/
    │   ├── services/
    │   └── lib/
    └── website/              # Next.js 15 — Public Website (port 3000)
        ├── app/
        ├── components/
        │   ├── sections/     # Hero, About, Skills, Experience, Projects, Education, Contact
        │   └── layout/       # Navbar, Footer
        └── services/
```

---

## Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

---

## 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD

# Create the initial admin user
python seed_admin.py

# Start the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API runs at: http://localhost:8000
Swagger docs: http://localhost:8000/docs

---

## 2. Frontend — Admin Dashboard

```bash
cd frontend/admin

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Admin dashboard: http://localhost:3001

---

## 3. Frontend — Public Website

```bash
cd frontend/website

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Public website: http://localhost:3000

---

## API Endpoints

### Public (no auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/website/content/portfolio` | All portfolio data |
| GET | `/api/website/content/projects` | Projects |
| GET | `/api/website/content/skills` | Skills |
| GET | `/api/website/content/experience` | Experience |
| GET | `/api/website/content/education` | Education |
| POST | `/api/website/contact/submit` | Submit contact form |

### Admin (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Login |
| GET | `/api/admin/auth/me` | Current user |
| CRUD | `/api/admin/content/profile` | Profile content |
| CRUD | `/api/admin/content/skills` | Skills |
| CRUD | `/api/admin/content/projects` | Projects |
| CRUD | `/api/admin/content/experience` | Experience |
| CRUD | `/api/admin/content/education` | Education |
| CRUD | `/api/admin/media/` | Media files |

---

## Production Build

```bash
# Backend — run with gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend Admin
cd frontend/admin && npm run build && npm start

# Frontend Website
cd frontend/website && npm run build && npm start
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Public Frontend | Next.js 15, React 19, Tailwind CSS |
| Admin Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy (async) |
| Database | PostgreSQL |
| Auth | JWT (python-jose) |
| File Storage | Local filesystem (`/uploads`) |
