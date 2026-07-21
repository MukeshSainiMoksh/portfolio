## 🚀 Complete Setup Guide

Your portfolio has been completely reorganized with proper folder structure and SQLite database!

---

## 📁 New Folder Structure

```
portfolio/
├── public/                      # Frontend files
│   ├── index.html              # Main portfolio page
│   ├── blogs.html              # All blogs page
│   ├── css/
│   │   ├── styles.css          # Main styles
│   │   └── blog.css            # Blog-specific styles
│   ├── js/
│   │   ├── main.js             # Main JavaScript
│   │   └── blog.js             # Blog page JavaScript
│   └── assets/
│       └── images/
│           └── profile.jpg     # Your profile photo (add this)
│
├── server/                      # Backend files
│   ├── app.js                  # Main API server
│   └── database/
│       ├── db.js               # Database configuration
│       ├── seed.js             # Sample data seeder
│       └── portfolio.db        # SQLite database (auto-created)
│
├── package.json                # Dependencies
└── README.md                   # Documentation
```

---

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin requests
- `sqlite3` - SQLite database
- `nodemon` - Auto-reload (dev)

### Step 2: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will:
- ✅ Create SQLite database automatically
- ✅ Create tables (blogs, comments, contacts)
- ✅ Seed with sample blog posts
- ✅ Start on http://localhost:3000

### Step 3: Add Your Profile Photo

1. Save your photo as `profile.jpg`
2. Place it in `public/assets/images/`
3. Refresh browser

---

## 🌐 Accessing Your Portfolio

Once the server is running:

- **Portfolio**: http://localhost:3000/index.html
- **All Blogs**: http://localhost:3000/blogs.html
- **API Docs**: See endpoints below

---

## 📊 Database (SQLite)

### Why SQLite?

- ✅ No separate database server needed
- ✅ Single file database
- ✅ Perfect for portfolios
- ✅ Easy to backup
- ✅ Fast and reliable

### Database Location

`server/database/portfolio.db`

### Tables Created

**1. blogs**
- id (PRIMARY KEY)
- title
- content (HTML)
- excerpt
- tags (comma-separated)
- image (URL)
- author
- views
- created_at
- updated_at

**2. comments**
- id (PRIMARY KEY)
- blog_id (FOREIGN KEY)
- name
- email
- comment
- created_at

**3. contacts**
- id (PRIMARY KEY)
- name
- email
- subject
- message
- created_at

### Viewing Database

**Option 1: DB Browser for SQLite**
1. Download from https://sqlitebrowser.org/
2. Open `server/database/portfolio.db`
3. View/edit data visually

**Option 2: Command Line**
```bash
sqlite3 server/database/portfolio.db
.tables
SELECT * FROM blogs;
.quit
```

---

## 🔌 API Endpoints

### Blogs

**Get all blogs** (with pagination & filters)
```
GET /api/blogs?page=1&limit=10&tag=Python&search=django
```

**Get single blog**
```
GET /api/blogs/:id
```

**Create blog**
```
POST /api/blogs
Body: {
  "title": "Blog Title",
  "content": "<p>HTML content</p>",
  "excerpt": "Short description",
  "tags": ["Python", "Django"],
  "image": "https://example.com/image.jpg"
}
```

**Update blog**
```
PUT /api/blogs/:id
Body: { same as create }
```

**Delete blog**
```
DELETE /api/blogs/:id
```

### Comments

**Get comments for blog**
```
GET /api/comments/:blogId
```

**Add comment**
```
POST /api/comments
Body: {
  "blogId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "text": "Great post!"
}
```

**Delete comment**
```
DELETE /api/comments/:id
```

### Contact

**Submit contact form**
```
POST /api/contact
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "I'd like to discuss..."
}
```

**Get all contacts** (admin)
```
GET /api/contacts
```

### Statistics

**Get blog stats**
```
GET /api/stats
```

Returns:
- Total blogs
- Total comments
- Total views
- Popular blogs

---

## ✍️ Managing Content

### Adding Blog Posts

**Method 1: Using API (Postman/curl)**

```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "<p>Content here</p>",
    "tags": ["Python", "AI"]
  }'
```

**Method 2: Direct Database**

1. Open DB Browser for SQLite
2. Open `portfolio.db`
3. Go to "Browse Data" tab
4. Select "blogs" table
5. Click "New Record"
6. Fill in fields
7. Click "Write Changes"

### Moderating Comments

**View comments:**
```bash
sqlite3 server/database/portfolio.db
SELECT * FROM comments ORDER BY created_at DESC;
```

**Delete inappropriate comment:**
```bash
DELETE FROM comments WHERE id = 5;
```

Or use API:
```bash
curl -X DELETE http://localhost:3000/api/comments/5
```

### Viewing Contact Submissions

**Via API:**
```bash
curl http://localhost:3000/api/contacts
```

**Via Database:**
```bash
sqlite3 server/database/portfolio.db
SELECT * FROM contacts ORDER BY created_at DESC;
```

---

## 🎨 Customization

### Changing API URL

In `public/js/blog.js` and `public/js/main.js`:
```javascript
const API_URL = 'http://localhost:3000/api';
// Change to your deployed URL
```

### Styling

- Main styles: `public/css/styles.css`
- Blog styles: `public/css/blog.css`

### Adding More Pages

1. Create HTML file in `public/`
2. Link CSS and JS files
3. Update navigation

---

## 🚀 Deployment

### Backend (API Server)

**Option 1: Heroku**
```bash
heroku create your-portfolio-api
git push heroku main
```

**Option 2: Railway**
1. Go to railway.app
2. Connect GitHub repo
3. Deploy automatically

**Option 3: Render**
1. Go to render.com
2. New Web Service
3. Connect repo
4. Deploy

### Frontend (Static Files)

**Option 1: GitHub Pages**
1. Push `public/` folder to GitHub
2. Enable GitHub Pages
3. Select `public` folder

**Option 2: Netlify**
1. Drag `public/` folder to Netlify
2. Deploy instantly

**Option 3: Vercel**
1. Import GitHub repo
2. Set root directory to `public`
3. Deploy

### Update API URL After Deployment

In `public/js/blog.js` and `public/js/main.js`:
```javascript
const API_URL = 'https://your-api-url.com/api';
```

---

## 🔒 Security (Production)

### Add Rate Limiting

```bash
npm install express-rate-limit
```

In `server/app.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Add Input Validation

```bash
npm install express-validator
```

### Environment Variables

```bash
npm install dotenv
```

Create `.env`:
```
PORT=3000
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Server won't start

**Error: Cannot find module 'sqlite3'**
```bash
npm install
```

**Error: Port 3000 already in use**
```bash
# Change port in server/app.js
const PORT = process.env.PORT || 3001;
```

### Database issues

**Error: SQLITE_CANTOPEN**
- Check file permissions
- Ensure `server/database/` folder exists

**Reset database:**
```bash
rm server/database/portfolio.db
npm start
# Database will be recreated with sample data
```

### Profile photo not showing

**Check:**
1. File is named exactly `profile.jpg`
2. Located in `public/assets/images/`
3. Path in HTML is correct
4. Clear browser cache (Ctrl+Shift+R)

### Blogs not loading

**Check:**
1. Server is running (`npm start`)
2. API URL is correct in JS files
3. Browser console for errors (F12)
4. Database has data (`npm run seed`)

---

## 📝 Sample Data

The database is automatically seeded with:
- 4 blog posts
- 4 comments
- 0 contacts (empty)

To re-seed:
```bash
rm server/database/portfolio.db
npm start
```

---

## 🎯 Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Start server (`npm start`)
3. ✅ Add your profile photo
4. ✅ Test locally
5. ✅ Write your first blog post
6. ✅ Deploy to production
7. ✅ Update API URLs
8. ✅ Share your portfolio!

---

## 📞 Support

**Issues?**
- Check this guide
- Review error messages
- Test API with Postman
- Check browser console

**Contact:**
codermsaini@gmail.com

---

**Your portfolio is now production-ready with proper structure and SQLite database! 🎉**
