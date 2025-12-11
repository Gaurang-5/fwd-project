# BMSCE Teacher Website

A modern, responsive website for managing and delivering educational content to students at BMSCE.

## Features

- **Student Resources**: Class 9 (Chemistry Cycle) and Class 10 (Physics Cycle) chapters with video lectures, notes, and question banks
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
./start-all.sh
```

That's it! The script will:
- ✅ Automatically install dependencies if needed
- ✅ Start the backend server (port 3000)
- ✅ Start the frontend server (port 8000)
- ✅ Show you all the URLs to access

Press `Ctrl+C` to stop all servers.

### Manual Start (Optional)

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd frontend && python3 -m http.server 8000
```

### 3. Access the Website

- **Homepage**: http://localhost:8000/pages/index.html
- **Admin Panel**: http://localhost:8000/components/admin/admin.html
- **Class 9 (Chemistry)**: http://localhost:8000/pages/class9.html
- **Class 10 (Physics)**: http://localhost:8000/pages/class10.html

## Admin Login

- **Username**: `teacher`
- **Password**: `pass123`

## Project Structure

```
fwd_project_in/
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
│       └── class10.html             # Physics cycle chapters
├── server/
│   ├── index.js                     # Express server
│   ├── package.json                 # Node dependencies
│   ├── models/
│   │   └── Chapter.js               # MongoDB schema
│   └── routes/
│       └── chapters.js              # API endpoints
├── start-all.sh                     # Start both servers
├── start-frontend.sh                # Start frontend only
└── README.md                        # This file
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
- Stored in browser localStorage

### Statistics
- View total chapters by class and subject
- Resource availability tracking
- Unit distribution analysis

## Database Configuration

MongoDB connection string is in `server/index.js`:
```javascript
mongodb+srv://Cluster84736:pmERM8HLwwpp0Lyd@cluster0.nmbmftx.mongodb.net/teacher-website
```

## API Endpoints

- `GET /api/chapters` - Get all chapters
- `POST /api/chapters` - Create new chapter
- `PUT /api/chapters/:id` - Update chapter
- `DELETE /api/chapters/:id` - Delete chapter

## Contributing

1. Make changes in appropriate files
2. Test thoroughly in both student and admin views
3. Ensure responsive design works on mobile
4. Update documentation if adding new features

## License

© 2025 BMSCE. All Rights Reserved.

## Contact

For issues or questions, use the contact form on the website or reach out to support@bmsce.edu
