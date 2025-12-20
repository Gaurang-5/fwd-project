# BMSCE Teacher Website

A modern, responsive website for managing and delivering educational content to students at BMSCE.

## Features

- **Student Resources**: (Chemistry Cycle) and (Physics Cycle) chapters with video lectures, notes, and question banks
- **Admin Panel**: Complete CRUD operations for managing chapters and resources
- **Unit Organization**: Chapters organized by syllabus units with collapsible sections
- **Bulk Operations**: Select and delete multiple chapters at once
- **Import/Export**: JSON-based chapter import/export functionality
- **Syllabus Management**: Upload and manage syllabus PDF links for each cycle
- **Contact Form**: Direct email integration for student inquiries
- **Responsive Design**: Mobile-friendly interface with modern UI

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Particles.js
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Server**: Python HTTP Server (Frontend), Node.js (Backend API)

## Quick Start

### Start Everything with One Command

```bash
./dev.sh
```

That's it! The script will:
- ✅ Automatically check and install dependencies
- ✅ Create .env file if missing
- ✅ Start the backend server (port 3000)
- ✅ Start the frontend server (port 8000)
- ✅ Display beautiful UI with all URLs
- ✅ Show admin credentials and API endpoints

Press `Ctrl+C` to stop all servers.

### Manual Start (Optional)

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend (from project root)
python3 -m http.server 8000
```

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
