# Admin Control Panel Documentation

## Overview

The Admin Control Panel is a comprehensive content management system that allows administrators to fully manage and customize the website UI content without modifying the source code. All changes are made through a user-friendly dashboard interface and are immediately reflected on the frontend website.

## Features

### 🔐 Authentication System
- Secure admin login with session management
- Password hashing using bcrypt
- Session tokens with expiration
- HTTP-only cookies for security
- Automatic session cleanup

### 👤 Profile Content Management
- **Hero Section**: Name, title, subtitle, location, description, stats
- **About Section**: Professional summary, additional information
- **Contact Information**: Email, phone, social media links, availability status

### 💼 Experience Management
- Add, edit, delete work experience
- Job title, company, location, dates
- Responsibilities and achievements
- Technologies used
- Current job indicator

### 🛠️ Skills Management
- Organize skills by categories
- Add/remove skills dynamically
- Skill levels and icons
- Custom categories support

### 🚀 Projects Management
- Project title, description, tagline
- Technologies used
- Live demo and GitHub links
- Project images and icons
- Featured projects
- Role and duration information

### 🎓 Education Management
- Degrees and certifications
- Institution details
- Grades and years
- Custom icons and descriptions

### 📁 Media Management
- File upload with drag & drop
- Image preview
- File size and type validation
- Automatic file organization
- Delete functionality

### 📝 Blog Integration
- View existing blogs
- Edit/delete blogs
- Integration with existing blog system

## Access Information

### Admin Panel URL
```
http://localhost:3000/admin.html
```

### Default Credentials
```
Username: admin
Password: admin123
```

**⚠️ Important**: Change the default password after first login for security.

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout  
- `GET /api/admin/verify` - Verify session

### Profile Content
- `GET /api/admin/profile` - Get all profile content
- `PUT /api/admin/profile/:section/:field` - Update specific field

### Skills Management
- `GET /api/admin/skills` - Get all skills
- `POST /api/admin/skills` - Add new skill
- `PUT /api/admin/skills/:id` - Update skill
- `DELETE /api/admin/skills/:id` - Delete skill

### Experience Management
- `GET /api/admin/experience` - Get all experience
- `POST /api/admin/experience` - Add new experience
- `PUT /api/admin/experience/:id` - Update experience
- `DELETE /api/admin/experience/:id` - Delete experience

### Projects Management
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Add new project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

### Education Management
- `GET /api/admin/education` - Get all education
- `POST /api/admin/education` - Add new education
- `PUT /api/admin/education/:id` - Update education
- `DELETE /api/admin/education/:id` - Delete education

### Media Management
- `POST /api/admin/upload` - Upload files
- `GET /api/admin/media` - Get all media files
- `DELETE /api/admin/media/:id` - Delete media file

## Public Content API

The system also provides public APIs for the frontend to fetch dynamic content:

- `GET /api/content/profile` - Get profile content
- `GET /api/content/skills` - Get skills by category
- `GET /api/content/experience` - Get experience timeline
- `GET /api/content/projects` - Get projects list
- `GET /api/content/education` - Get education details
- `GET /api/content/stats` - Get website statistics

## Database Schema

### Admin Tables
- `admin_users` - Admin user accounts
- `admin_sessions` - Session management
- `profile_content` - Dynamic profile content
- `skills` - Skills with categories
- `experience` - Work experience
- `projects` - Project portfolio
- `education` - Education and certifications
- `media_files` - Uploaded media files

## Security Features

### Authentication
- Bcrypt password hashing
- Session-based authentication
- HTTP-only cookies
- CSRF protection ready
- Session expiration (24 hours)

### File Upload Security
- File type validation
- File size limits (10MB)
- Secure file storage
- Path traversal protection

### API Security
- Authentication middleware
- Input validation
- SQL injection prevention
- XSS protection

## Usage Instructions

### 1. Initial Setup
1. Start the server: `npm start`
2. Navigate to `http://localhost:3000/admin.html`
3. Login with default credentials
4. Change default password (recommended)

### 2. Managing Profile Content
1. Go to "Profile Content" section
2. Use tabs to switch between Hero, About, and Contact sections
3. Edit fields directly in the form
4. Click "Save All Changes" to apply updates

### 3. Managing Skills
1. Navigate to "Skills" section
2. Click "Add Skill" to create new skills
3. Organize by categories
4. Edit or delete existing skills

### 4. Managing Experience
1. Go to "Experience" section
2. Click "Add Experience" for new entries
3. Fill in job details, responsibilities, achievements
4. Mark current job if applicable

### 5. Managing Projects
1. Navigate to "Projects" section
2. Click "Add Project" to create new projects
3. Add technologies, links, and descriptions
4. Mark as featured if desired

### 6. Managing Education
1. Go to "Education" section
2. Add degrees, certifications, courses
3. Include institution details and grades

### 7. Media Management
1. Navigate to "Media" section
2. Drag & drop files or click to browse
3. Supported formats: Images, PDFs, Documents
4. Files are automatically organized

## Live Updates

The frontend automatically loads content from the database, so changes made in the admin panel are immediately visible on the website. The system includes:

- Dynamic content loading
- Automatic UI updates
- Fallback to static content if API fails
- Caching for performance

## Customization

### Adding New Content Types
1. Create database table in `admin-schema.js`
2. Add API routes in `routes/admin.js`
3. Add public API in `routes/content.js`
4. Update admin dashboard UI
5. Update content loader

### Styling Customization
- Edit `public/css/admin.css` for admin panel styling
- Modify `public/css/styles.css` for frontend styling
- All styles are responsive and mobile-friendly

## Troubleshooting

### Common Issues

1. **Login Failed**
   - Check username/password
   - Verify database connection
   - Check server logs

2. **Content Not Updating**
   - Check API endpoints
   - Verify authentication
   - Clear browser cache

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file type is supported
   - Check upload directory permissions

4. **Database Errors**
   - Verify SQLite database exists
   - Check table initialization
   - Review server logs

### Logs and Debugging
- Server logs show API requests and errors
- Browser console shows frontend errors
- Database operations are logged

## Backup and Recovery

### Database Backup
```bash
# Backup database
cp server/database/portfolio.db backup/portfolio_backup_$(date +%Y%m%d).db

# Restore database
cp backup/portfolio_backup_YYYYMMDD.db server/database/portfolio.db
```

### Media Files Backup
```bash
# Backup uploaded files
cp -r public/uploads backup/uploads_backup_$(date +%Y%m%d)
```

## Performance Considerations

- Database queries are optimized with indexes
- Media files are served statically
- Content is cached on frontend
- Pagination for large datasets
- Lazy loading for images

## Future Enhancements

Potential improvements for the admin system:

1. **Advanced Features**
   - Bulk operations
   - Content versioning
   - Audit logs
   - Multi-language support

2. **UI Improvements**
   - Rich text editor
   - Image cropping
   - Drag & drop reordering
   - Preview mode

3. **Security Enhancements**
   - Two-factor authentication
   - Role-based permissions
   - IP whitelisting
   - Advanced session management

4. **Integration Features**
   - Social media integration
   - Analytics dashboard
   - SEO optimization tools
   - Email notifications

## Support

For issues or questions:
1. Check server logs for errors
2. Review API responses in browser dev tools
3. Verify database schema and data
4. Check file permissions and paths

The admin system is designed to be intuitive and powerful, allowing complete control over website content without technical knowledge.