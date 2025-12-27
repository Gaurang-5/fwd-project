# BMSCE Teacher Website

A modern, responsive educational platform for BMSCE students with Google OAuth authentication.

## ✨ Features

### 🔐 Student Authentication
- **Google OAuth Integration**: Students log in with their BMSCE Gmail (@bmsce.ac.in)
- **Domain Restriction**: Only verified BMSCE students can access
- **Secure Sessions**: Industry-standard session management

### 📚 Educational Content
- **Student Resources**: Chemistry Cycle and Physics Cycle chapters
- **Video Lectures**: Curated YouTube tutorials
- **Study Materials**: Notes and question banks
- **Unit Organization**: Chapters organized by syllabus units

### 👨‍💼 Admin Panel
- **Complete CRUD Operations**: Manage chapters and resources
- **Bulk Operations**: Select and delete multiple chapters
- **Import/Export**: JSON-based chapter management
- **Syllabus Management**: Upload and manage syllabus PDFs

### 🎨 Modern UI
- **Responsive Design**: Mobile-friendly interface
- **Beautiful Animations**: Smooth transitions and effects
- **Contact Form**: Direct email integration

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Particles.js
- **Backend**: Node.js, Express.js, Passport.js
- **Database**: MongoDB Atlas
- **Authentication**: Google OAuth 2.0
- **Session**: Express-session with secure cookies

## ⚡ Quick Start

### Start Everything with One Command

```bash
./dev.sh
```

**That's it!** The script will:
- ✅ Check and install dependencies
- ✅ Create `.env` file if missing
- ✅ Start backend server (port 3000)
- ✅ Start frontend server (port 8000)
- ✅ Display all URLs and credentials

Press `Ctrl+C` to stop all servers.

### First Time Setup

1. **Get Google OAuth credentials** (required for login):
   - See [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
   - Update `server/.env` with your credentials

2. **Run the project**:
   ```bash
   ./dev.sh
   ```

3. **Access the portal**:
   - Homepage: http://localhost:8000/frontend/pages/index.html
   - Student Login: http://localhost:8000/frontend/pages/login.html
   - Admin Panel: http://localhost:8000/frontend/components/admin/admin.html

### Access the Website

#### Student Pages
- **Homepage**: http://localhost:8000/pages/index.html
- **Class 9 (Chemistry)**: http://localhost:8000/pages/class9.html
- **Class 10 (Physics)**: http://localhost:8000/pages/class10.html
- **About**: http://localhost:8000/pages/about.html
- **Contact**: http://localhost:8000/pages/contact.html
- **Resources**: http://localhost:8000/pages/resources.html

#### Admin Access
- **Admin Panel**: http://localhost:8000/frontend/components/admin/admin.html

#### API Endpoints
- **Backend API**: http://localhost:3000
- **Chapters API**: http://localhost:3000/api/chapters
- **Syllabus API**: http://localhost:3000/api/syllabus

## Admin Login

- **Username**: `teacher`
- **Password**: `pass123`

## Project Structure

```
fwd_project/
├── dev.sh                           # Unified startup script with UI
├── README.md                        # Project documentation
├── PROJECT_PRESENTATION.md          # Complete project presentation
├── docs/
│   ├── IMPORT_GUIDE.md              # Chapter import documentation
│   └── chapters-import-template.json # Sample JSON format
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css            # All styles
│   │   ├── images/                  # Images and logo
│   │   └── js/
│   │       ├── main.js              # Chapter loading logic
│   │       ├── contact.js           # Contact form handler
│   │       └── particles-app.js     # Particle effects
│   ├── components/
│   │   └── admin/
│   │       ├── admin.html           # Admin panel UI
│   │       └── admin-enhanced.js    # Admin panel logic
│   └── pages/
│       ├── index.html               # Homepage
│       ├── about.html               # About page
│       ├── contact.html             # Contact page
│       ├── resources.html           # Resources overview
│       ├── class9.html              # Chemistry cycle chapters
│       ├── class10.html             # Physics cycle chapters
│       └── chapter-detail.html      # Individual chapter view
└── server/
    ├── index.js                     # Express server
    ├── package.json                 # Node dependencies
    ├── .env                         # Environment variables (not in repo)
    ├── models/
    │   ├── Chapter.js               # Chapter MongoDB schema
    │   └── Syllabus.js              # Syllabus MongoDB schema
    └── routes/
        ├── chapters.js              # Chapter API endpoints
        └── syllabus.js              # Syllabus API endpoints
```

## Admin Panel Features

### Chapter Management
- Create, edit, and delete chapters
- Preview chapter details before editing
- Bulk delete multiple chapters

### Unit Organization
- Chapters grouped by syllabus units
- Collapsible unit sections
- Select all chapters within a unit

### Import/Export
- Export all chapters as JSON
- Import chapters from JSON file
- See `docs/IMPORT_GUIDE.md` for detailed instructions

### Syllabus Management
- Upload PDF links for Chemistry and Physics cycle syllabi
- Links automatically appear on student resource pages
- Stored in MongoDB database with class number, link, and academic year
- Last updated timestamp tracking

### Statistics
- View total chapters by class and subject
- Resource availability tracking
- Unit distribution analysis

## Database Configuration

1. Create a `server/.env` file based on `server/.env.example`
2. Add your MongoDB connection string:
```bash
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=development
ADMIN_USERNAME=teacher
ADMIN_PASSWORD=pass123
FRONTEND_URL=http://localhost:8000
```

## API Endpoints

### Chapter API
- `GET /api/chapters` - Get all chapters (with optional filters)
- `GET /api/chapters/:id` - Get specific chapter by ID
- `POST /api/chapters` - Create new chapter
- `PUT /api/chapters/:id` - Update chapter by ID
- `DELETE /api/chapters/:id` - Delete chapter by ID

### Syllabus API
- `GET /api/syllabus` - Get all syllabus records
- `GET /api/syllabus/:classNumber` - Get syllabus for specific class (9 or 10)
- `POST /api/syllabus` - Create or update syllabus
- `PUT /api/syllabus/:classNumber` - Update syllabus for class
- `DELETE /api/syllabus/:classNumber` - Delete syllabus for class

## Contributing

1. Make changes in appropriate files
2. Test thoroughly in both student and admin views
3. Ensure responsive design works on mobile
4. Update documentation if adding new features

## License

© 2025 BMSCE. All Rights Reserved.

## Contact

For issues or questions, use the contact form on the website or reach out to support@bmsce.edu
