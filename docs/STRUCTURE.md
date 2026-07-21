# 📁 Portfolio Structure

Clean and organized structure for easy maintenance.

```
portfolio/
│
├── public/                          # Frontend (Website Files)
│   ├── index.html                  # Main portfolio page
│   ├── blogs.html                  # All blogs page
│   │
│   ├── css/                        # Stylesheets
│   │   ├── styles.css              # Main styles
│   │   └── blog.css                # Blog-specific styles
│   │
│   ├── js/                         # JavaScript
│   │   ├── main.js                 # Main functionality
│   │   └── blog.js                 # Blog page logic
│   │
│   └── assets/                     # Static assets
│       └── images/
│           └── profile.jpg         # Your profile photo
│
├── server/                          # Backend (API Server)
│   ├── app.js                      # Express API server
│   │
│   └── database/                   # Database files
│       ├── db.js                   # SQLite configuration
│       ├── seed.js                 # Sample data seeder
│       └── portfolio.db            # SQLite database (auto-created)
│
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── migrate.js                      # Migration helper script
│
└── docs/                           # Documentation
    ├── README.md                   # Main documentation
    ├── SETUP_GUIDE.md              # Complete setup guide
    ├── QUICK_START_V2.md           # Quick start (3 min)
    ├── CHANGES_V2.md               # Version 2.0 changes
    ├── CV_Mukesh_Kumar.md          # Downloadable CV
    └── STRUCTURE.md                # This file
```

---

## 📂 Folder Purposes

### `public/` - Frontend
All website files that users see. Can be deployed to static hosting (GitHub Pages, Netlify, Vercel).

### `server/` - Backend
API server and database. Deploy to Node.js hosting (Heroku, Railway, Render).

### `docs/` - Documentation
All guides and documentation files.

---

## 🎯 Key Files

### Frontend
- `public/index.html` - Main portfolio page
- `public/blogs.html` - Blog listing page
- `public/css/styles.css` - Main styles
- `public/js/main.js` - Main JavaScript

### Backend
- `server/app.js` - API server (Express)
- `server/database/db.js` - Database config
- `server/database/portfolio.db` - SQLite database

### Configuration
- `package.json` - Node.js dependencies
- `.gitignore` - Files to ignore in Git

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start server (creates database)
npm start

# Development mode (auto-reload)
npm run dev

# Seed database with sample data
npm run seed
```

---

## 📝 Adding Content

### Add Profile Photo
Place your photo at: `public/assets/images/profile.jpg`

### Add Blog Post
Use API or DB Browser to add to `portfolio.db`

### Modify Styles
Edit files in `public/css/`

### Update Content
Edit HTML files in `public/`

---

## 🌐 Deployment

### Frontend (Static)
Deploy `public/` folder to:
- GitHub Pages
- Netlify
- Vercel

### Backend (Node.js)
Deploy entire project to:
- Heroku
- Railway
- Render

---

**Clean, organized, and production-ready! 🎉**
