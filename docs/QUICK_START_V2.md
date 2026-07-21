# 🚀 Quick Start Guide v2.0

Get your portfolio running in 3 minutes!

---

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

This installs Express, CORS, and SQLite3.

---

## Step 2: Start the Server (10 seconds)

```bash
npm start
```

You'll see:
```
✓ Connected to SQLite database
✓ Blogs table ready
✓ Comments table ready
✓ Contacts table ready
✓ Inserted 4 blog posts
✓ Inserted 4 comments
🚀 Portfolio API Server running on port 3000
```

---

## Step 3: Add Your Profile Photo (1 minute)

1. Save your photo as `profile.jpg`
2. Place it in: `public/assets/images/profile.jpg`
3. Done!

---

## Step 4: Open Your Portfolio (5 seconds)

Open in browser:
- **Portfolio**: http://localhost:3000/index.html
- **All Blogs**: http://localhost:3000/blogs.html

---

## ✅ That's It!

Your portfolio is now running with:
- ✅ SQLite database
- ✅ 4 sample blog posts
- ✅ Comments system
- ✅ Contact form
- ✅ Proper folder structure

---

## 📁 Where Everything Is

```
portfolio/
├── public/                  # Your website files
│   ├── index.html          # Main page
│   ├── blogs.html          # All blogs page
│   ├── css/                # Styles
│   ├── js/                 # JavaScript
│   └── assets/images/      # Put profile.jpg here!
│
└── server/                  # Backend
    ├── app.js              # API server
    └── database/
        ├── portfolio.db    # SQLite database
        ├── db.js           # Database config
        └── seed.js         # Sample data
```

---

## 🎯 Common Tasks

### Write a Blog Post

**Using Postman or curl:**
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "<p>Hello World!</p>",
    "tags": ["Python", "AI"]
  }'
```

**Or use DB Browser:**
1. Download from https://sqlitebrowser.org/
2. Open `server/database/portfolio.db`
3. Add blog in "blogs" table

### View Database

```bash
sqlite3 server/database/portfolio.db
.tables
SELECT * FROM blogs;
.quit
```

### Reset Database

```bash
rm server/database/portfolio.db
npm start
```

Database will be recreated with sample data.

---

## 🐛 Troubleshooting

### Server won't start?
```bash
npm install
npm start
```

### Profile photo not showing?
- Check file is at: `public/assets/images/profile.jpg`
- Exact filename (lowercase)
- Clear browser cache (Ctrl+Shift+R)

### Blogs not loading?
- Server must be running (`npm start`)
- Check browser console (F12)
- Verify API URL in `public/js/blog.js`

---

## 📖 Full Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **BLOG_SETUP_GUIDE.md** - Blog management
- **PROFILE_PHOTO_GUIDE.md** - Photo requirements

---

## 🚀 Deploy to Production

### Backend (Choose one):
- Heroku: `heroku create && git push heroku main`
- Railway: Connect GitHub repo
- Render: Deploy from GitHub

### Frontend (Choose one):
- GitHub Pages: Push `public/` folder
- Netlify: Drag `public/` folder
- Vercel: Import repo, set root to `public`

**Don't forget to update API URL in JS files after deployment!**

---

## 💡 Pro Tips

1. **Backup database regularly:**
   ```bash
   cp server/database/portfolio.db backup.db
   ```

2. **View API responses:**
   - Install Postman
   - Test all endpoints
   - Check data format

3. **Monitor logs:**
   ```bash
   npm start
   # Watch console for errors
   ```

4. **Use nodemon for development:**
   ```bash
   npm run dev
   # Auto-reloads on file changes
   ```

---

## 🎉 You're Done!

Your portfolio is now:
- ✅ Running locally
- ✅ Using SQLite database
- ✅ Ready for blog posts
- ✅ Ready to deploy

**Next:** Write your first blog post and deploy to production!

---

## 📞 Need Help?

- Read SETUP_GUIDE.md
- Check browser console (F12)
- Test API with Postman
- Email: codermsaini@gmail.com

---

**Happy coding! 🚀**
