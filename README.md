# BMSCE Teacher Website - Educational Resource Platform

A modern, full-stack web application for managing and delivering educational content to BMSCE first-year students with secure Google OAuth authentication.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Google OAuth Setup](#-google-oauth-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-endpoints)
- [Admin Panel](#-admin-panel-features)
- [Troubleshooting](#-troubleshooting)
- [Teacher Demo Guide](#-teacher-demo-guide)

## ✨ Features

### 🔐 Student Authentication
- **Google OAuth 2.0 Integration**: One-click login with BMSCE Gmail accounts
- **Domain Restriction**: Only @bmsce.ac.in email addresses can access
- **Secure Session Management**: HTTP-only cookies with 24-hour expiry
- **User Profile Display**: Name and picture synced from Google account

### 📚 Educational Content
- **Chapter Management**: Chemistry Cycle (Class 9) and Physics Cycle (Class 10)
- **Video Lectures**: Curated YouTube tutorial links
- **Study Materials**: Downloadable notes and question banks
- **Unit Organization**: Chapters grouped by syllabus units
- **Syllabus Access**: PDF downloads for complete semester syllabus

### 👨‍💼 Admin Panel
- **Complete CRUD Operations**: Create, read, update, delete chapters
- **Bulk Operations**: Multi-select and delete multiple chapters
- **Import/Export**: JSON-based backup and migration
- **Syllabus Management**: Upload and manage PDF links
- **Statistics Dashboard**: Real-time chapter and resource counts
- **Preview Mode**: Review chapter details before editing

### 🎨 Modern UI
- **Responsive Design**: Mobile-first approach for all devices
- **Particle Effects**: Interactive background animations
- **Clean Interface**: Professional, easy-to-navigate design
- **Contact Form**: Direct communication channel

## 🚀 Tech Stack

**Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Particles.js  
**Backend**: Node.js, Express.js, Passport.js  
**Database**: MongoDB Atlas (Cloud NoSQL)  
**Authentication**: Google OAuth 2.0, Express-session  
**Security**: Helmet.js, CORS, HTTP-only cookies

## ⚡ Quick Start

### One-Command Setup

```bash
./dev.sh
```

**The script automatically:**
- ✅ Installs all dependencies
- ✅ Creates `.env` file with OAuth variables
- ✅ Starts backend server (port 3000)
- ✅ Starts frontend server (port 8000)
- ✅ Displays all URLs and credentials

**Stop servers:** Press `Ctrl+C`

### First Time Setup (5 Minutes)

**Step 1: Google OAuth Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project: "BMSCE Portal"
3. Enable "Google+ API"
4. Create OAuth credentials (Web application)
5. Add redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret

📖 **Detailed guide:** [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)

**Step 2: Configure Environment**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=change-this-to-random-string
NODE_ENV=development
ADMIN_USERNAME=teacher
ADMIN_PASSWORD=pass123
FRONTEND_URL=http://localhost:8000
```

**Step 3: Run the Project**
```bash
./dev.sh
```

**Step 4: Access the Portal**

### Student Pages
- 🏠 **Homepage**: http://localhost:8000/frontend/pages/index.html
- 🔐 **Login**: http://localhost:8000/frontend/pages/login.html
- 📚 **Class 9 (Chemistry)**: http://localhost:8000/pages/class9.html
- 🔬 **Class 10 (Physics)**: http://localhost:8000/pages/class10.html
- 📖 **Resources**: http://localhost:8000/pages/resources.html
- 📧 **Contact**: http://localhost:8000/pages/contact.html

### Admin Panel
- 👨‍💼 **Admin Dashboard**: http://localhost:8000/frontend/components/admin/admin.html
- **Username**: `teacher` | **Password**: `pass123`

### API Endpoints
- 📡 **Backend API**: http://localhost:3000
- 📝 **Chapters API**: http://localhost:3000/api/chapters
- 📄 **Syllabus API**: http://localhost:3000/api/syllabus
- 🔐 **Auth API**: http://localhost:3000/auth

## 🔐 Google OAuth Setup

### Prerequisites
- Google account with access to Google Cloud Console
- MongoDB Atlas account and cluster

### Detailed Setup Steps

1. **Create Google Cloud Project**
   ```
   → Go to https://console.cloud.google.com/
   → Click "Select a project" → "New Project"
   → Name: "BMSCE Portal"
   → Click "Create"
   ```

2. **Enable Google+ API**
   ```
   → APIs & Services → Library
   → Search "Google+ API"
   → Click "Enable"
   ```

3. **Create OAuth Credentials**
   ```
   → APIs & Services → Credentials
   → Create Credentials → OAuth client ID
   → Application type: Web application
   → Name: "BMSCE Portal Auth"
   ```

4. **Configure Authorized Redirect URIs**
   ```
   Authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:8000
   
   Authorized redirect URIs:
   - http://localhost:3000/auth/google/callback
   ```

5. **Copy Credentials**
   - Save your **Client ID** and **Client Secret**
   - Paste them in `server/.env`

6. **Configure OAuth Consent Screen**
   ```
   → User Type: Internal (for testing) or External
   → Add test users: your @bmsce.ac.in email
   → Scopes: email, profile
   ```

📖 **Complete guide with screenshots:** [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)

## 📁 Project Structure

```
fwd_project/
├── 📄 dev.sh                          # One-command startup script
├── 📄 README.md                       # This file
├── 📄 PROJECT_PRESENTATION.md         # Complete project documentation
│
├── 📂 docs/
│   ├── AUTHENTICATION.md              # Auth system documentation
│   ├── AUTHENTICATION_IMPLEMENTATION.md
│   ├── GOOGLE_OAUTH_SETUP.md          # OAuth setup guide
│   ├── IMPORT_GUIDE.md                # Chapter import instructions
│   └── chapters-import-template.json  # JSON template
│
├── 📂 frontend/
│   ├── 📂 assets/
│   │   ├── 📂 css/
│   │   │   └── style.css              # All styles (2000+ lines)
│   │   ├── 📂 images/                 # Logos and images
│   │   └── 📂 js/
│   │       ├── main.js                # Chapter loading
│   │       ├── auth.js                # Authentication utilities
│   │       ├── contact.js             # Contact form handler
│   │       └── particles-app.js       # Particle effects
│   │
│   ├── 📂 components/
│   │   └── 📂 admin/
│   │       ├── admin.html             # Admin panel UI
│   │       └── admin-enhanced.js      # Admin logic (1000+ lines)
│   │
│   └── 📂 pages/
│       ├── index.html                 # Homepage
│       ├── login.html                 # Login page (Google OAuth)
│       ├── about.html                 # About page
│       ├── contact.html               # Contact form
│       ├── resources.html             # Resources overview
│       ├── class9.html                # Chemistry cycle
│       ├── class10.html               # Physics cycle
│       └── chapter-detail.html        # Chapter view
│
└── 📂 server/
    ├── index.js                       # Express server setup
    ├── package.json                   # Dependencies
    ├── .env                           # Environment variables (not in repo)
    ├── .env.example                   # Template
    │
    ├── 📂 config/
    │   └── passport.js                # Google OAuth strategy
    │
    ├── 📂 middleware/
    │   └── auth.js                    # Authentication middleware
    │
    ├── 📂 models/
    │   ├── User.js                    # User schema (MongoDB)
    │   ├── Chapter.js                 # Chapter schema
    │   └── Syllabus.js                # Syllabus schema
    │
    └── 📂 routes/
        ├── auth.js                    # Authentication routes
        ├── chapters.js                # Chapter CRUD API
        ├── syllabus.js                # Syllabus API
        └── analytics.js               # Analytics endpoints
```

## 📊 Database Schema

### User Model
```javascript
{
  googleId: String (required, unique),
  email: String (required, unique, @bmsce.ac.in only),
  name: String (required),
  picture: String (Google profile photo URL),
  lastLogin: Date,
  createdAt: Date
}
```

### Chapter Model
```javascript
{
  title: String (required),
  chapterNumber: Number (required),
  classNumber: Number (required, enum: [9, 10]),
  unitName: String (required),
  videoLink: String (optional),
  notesLink: String (optional),
  questionsLink: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Syllabus Model
```javascript
{
  classNumber: Number (required, unique, enum: [9, 10]),
  syllabusLink: String (required),
  academicYear: String (optional),
  lastUpdated: Date
}
```

## 👨‍💼 Admin Panel Features

### Chapter Management
- ✅ **Create**: Add new chapters with video/notes/questions links
- ✅ **Edit**: Update chapter information and resources
- ✅ **Delete**: Remove individual or multiple chapters
- ✅ **Preview**: View chapter details before editing
- ✅ **Bulk Operations**: Select all/unit and delete multiple chapters

### Unit Organization
- Chapters automatically grouped by syllabus units
- Collapsible unit sections for clean interface
- Select all chapters within a specific unit
- Statistics per unit (chapter count, resource availability)

### Import/Export
- **Export**: Download all chapters as JSON backup
- **Import**: Upload JSON file to restore/migrate chapters
- **Format**: See `docs/IMPORT_GUIDE.md` and `chapters-import-template.json`

### Syllabus Management
- Upload PDF links for Class 9 and Class 10 syllabi
- Automatic display on student resource pages
- Track academic year and last updated timestamp
- One syllabus per class (unique constraint)

### Analytics Dashboard
- Total chapters by class (Chemistry/Physics)
- Resource availability statistics
- Unit distribution analysis
- Quick overview of platform content

## 📡 API Endpoints

### Authentication API
```
POST   /auth/google                    # Initiate Google OAuth
GET    /auth/google/callback           # OAuth callback
GET    /auth/logout                    # Logout user
GET    /auth/user                      # Get current user info
GET    /auth/check                     # Check authentication status
```

### Chapter API
```
GET    /api/chapters                   # Get all chapters (filters: class, unit)
GET    /api/chapters/:id               # Get specific chapter
POST   /api/chapters                   # Create new chapter (auth required)
PUT    /api/chapters/:id               # Update chapter (auth required)
DELETE /api/chapters/:id               # Delete chapter (auth required)
```

### Syllabus API
```
GET    /api/syllabus                   # Get all syllabus records
GET    /api/syllabus/:classNumber      # Get syllabus for class (9 or 10)
POST   /api/syllabus                   # Create or update syllabus (auth required)
PUT    /api/syllabus/:classNumber      # Update specific syllabus (auth required)
DELETE /api/syllabus/:classNumber      # Delete syllabus (auth required)
```

### Request Examples

**Get Chemistry Cycle Chapters:**
```bash
curl http://localhost:3000/api/chapters?classNumber=9
```

**Create New Chapter (Auth Required):**
```bash
curl -X POST http://localhost:3000/api/chapters \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Atomic Structure",
    "chapterNumber": 1,
    "classNumber": 9,
    "unitName": "Unit 1",
    "videoLink": "https://youtube.com/watch?v=...",
    "notesLink": "https://drive.google.com/...",
    "questionsLink": "https://drive.google.com/..."
  }'
```

## 🛠️ Troubleshooting

### Server Won't Start

**MongoDB Connection Failed:**
```bash
# Check MongoDB URI in server/.env
# Verify IP whitelist in MongoDB Atlas
# Ensure internet connection
```

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Google OAuth Issues

**Login Doesn't Work:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Check redirect URI in Google Console: `http://localhost:3000/auth/google/callback`
- Ensure Google+ API is enabled

**"Access Denied" Error:**
- Confirm you're using @bmsce.ac.in email
- Add yourself as test user in Google Console (if app not published)
- Check browser console for specific error messages

**"Redirect URI Mismatch":**
- Must match exactly in Google Console and `.env`
- Include protocol (`http://`), hostname, port, and path
- No trailing slashes

### Frontend Issues

**Can't See User Info:**
```javascript
// Open browser console (F12) and check:
console.log(await fetch('http://localhost:3000/auth/user').then(r => r.json()))
```

**Chapters Not Loading:**
- Verify backend is running on port 3000
- Check browser network tab for API call errors
- Ensure CORS is properly configured

**Authentication Not Persisting:**
- Check if cookies are enabled in browser
- Verify `SESSION_SECRET` is set in `.env`
- Clear browser cookies and try again

### Development Tips

**View Server Logs:**
```bash
# Backend logs (if running via dev.sh)
tail -f /tmp/backend.log

# Frontend server output visible in terminal
```

**Reset Database:**
```javascript
// Connect to MongoDB and drop collections
use bmsce_teacher_portal
db.chapters.deleteMany({})
db.users.deleteMany({})
db.syllabi.deleteMany({})
```

**Clear Session:**
```bash
# Stop server and restart
# Or clear cookies in browser
```

## 🎤 Teacher Demo Guide

### 5-Minute Presentation Flow

**1. Introduction (30 seconds)**
> "I've built a secure educational platform with Google OAuth authentication. Only BMSCE students with @bmsce.ac.in emails can access our resources."

**2. Start the Application (30 seconds)**
```bash
./dev.sh
```
> "The entire platform starts with one command. Both frontend and backend servers launch automatically."

**3. Show Login (1 minute)**
- Navigate to login page
- Click "Sign in with Google"
- Log in with BMSCE email
> "Notice the seamless Google integration. Students use their existing BMSCE accounts—no new passwords to remember."

**4. Demonstrate Access Control (1 minute)**
- Show user menu with name and photo
- Browse to Class 9 or Class 10 chapters
> "All resources are now protected. Only authenticated BMSCE students can access study materials."

**5. Admin Panel Tour (1.5 minutes)**
- Show chapter management (create/edit/delete)
- Demonstrate bulk operations
- Display statistics dashboard
> "Teachers have complete control through this admin panel—full CRUD operations, bulk management, and analytics."

**6. Security Emphasis (30 seconds)**
> "The system uses industry-standard OAuth 2.0, the same technology used by Google, Facebook, and Microsoft. Email domain validation ensures only @bmsce.ac.in addresses are allowed."

**7. Logout & Closing (30 seconds)**
- Click logout button
- Redirected to login page
> "Sessions are secure and manageable. This platform is ready for production use by all BMSCE students."

### Key Points to Emphasize

**Security:**
- OAuth 2.0 industry standard
- Domain-restricted (@bmsce.ac.in only)
- No password storage on our servers
- Secure session management

**User Experience:**
- One-click Google login
- No account creation needed
- Profile auto-synced from Google
- Clean, modern interface

**Technical Excellence:**
- Full-stack implementation
- RESTful API architecture
- MongoDB database
- Scalable for hundreds of users
- Professional development workflow

**Future Potential:**
- Student dashboards
- Progress tracking
- Bookmarking system
- Discussion forums
- Role-based access control

### Anticipated Questions & Answers

**Q: What if a student doesn't have BMSCE Gmail?**  
A: Every BMSCE student receives a @bmsce.ac.in account from the college. They can use that to access the portal.

**Q: Is this secure enough for real deployment?**  
A: Yes! We use OAuth 2.0 (industry standard), HTTP-only cookies, session management, and domain validation. For production, we'd add HTTPS and additional monitoring.

**Q: Can you add role-based access?**  
A: Absolutely! The architecture supports it. We can add student/teacher/admin roles with different permission levels.

**Q: How do you handle privacy?**  
A: We only store essential data: name, email, and profile picture from Google. No sensitive information is collected, and we don't share data with third parties.

**Q: Is it difficult to maintain?**  
A: Not at all! Google handles authentication security and updates. We only maintain our application code. The one-command startup makes deployment simple.

## 📚 Documentation

- 📖 **Complete Project Presentation**: [PROJECT_PRESENTATION.md](PROJECT_PRESENTATION.md)
- 🔐 **Authentication Guide**: [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
- 🔑 **Google OAuth Setup**: [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
- 📥 **Chapter Import Guide**: [docs/IMPORT_GUIDE.md](docs/IMPORT_GUIDE.md)
- 🛠️ **Implementation Details**: [docs/AUTHENTICATION_IMPLEMENTATION.md](docs/AUTHENTICATION_IMPLEMENTATION.md)

## 🚀 Deployment (Production)

### Prerequisites
- Domain name with SSL certificate
- MongoDB Atlas production cluster
- Google OAuth credentials for production domain

### Steps
1. Update Google OAuth redirect URIs for production domain
2. Configure production environment variables
3. Enable HTTPS
4. Set `NODE_ENV=production`
5. Configure CORS for production domain
6. Deploy backend to cloud service (Heroku, AWS, Azure)
7. Deploy frontend to static hosting (Netlify, Vercel)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

© 2025 BMSCE. All Rights Reserved.

## 📧 Contact

For issues, questions, or feature requests:
- Use the contact form on the website
- Email: support@bmsce.edu
- GitHub Issues: [Create an issue](https://github.com/Gaurang-5/fwd-project/issues)

---

**Built with ❤️ by Gaurang Bhatia for BMSCE**
