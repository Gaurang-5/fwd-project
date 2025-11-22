# BMSCE Studies Simplified

A full-stack web application for BMSCE students to access study materials, lecture notes, and resources.

## Project Structure

```
fwd_project_in/
├── frontend/                    # Frontend application
│   ├── pages/                   # HTML pages
│   │   ├── index.html          # Homepage
│   │   ├── about.html          # About page
│   │   ├── contact.html        # Contact page
│   │   ├── resources.html      # Resources listing
│   │   ├── class9.html         # Chemistry Cycle
│   │   ├── class10.html        # Physics Cycle
│   │   └── chapter-detail.html # Chapter details
│   ├── assets/                  # Static assets
│   │   ├── css/                # Stylesheets
│   │   │   └── style.css
│   │   ├── js/                 # JavaScript files
│   │   │   ├── main.js
│   │   │   ├── contact.js
│   │   │   └── particles-app.js
│   │   └── images/             # Images and icons
│   └── components/             # Reusable components
│       └── admin/              # Admin panel
│           ├── admin.html
│           └── admin.js
├── server/                     # Backend application
│   ├── models/                 # MongoDB models
│   │   └── Chapter.js
│   ├── routes/                 # API routes
│   │   └── chapters.js
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Express middleware
│   ├── index.js               # Server entry point
│   ├── .env                   # Environment variables
│   ├── package.json           # Node dependencies
│   └── node_modules/          # Installed packages
├── .gitignore
└── README.md
```

## Features

- 📚 Browse study materials by cycle (Chemistry/Physics)
- 📖 Chapter-wise organized content
- 🎥 Integrated YouTube video tutorials
- 📄 Downloadable PDF resources
- 👤 Admin panel for content management
- 📱 Responsive design for all devices

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Font Awesome icons
- Particles.js for animations
- Responsive grid layouts

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- RESTful API architecture
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaurang-5/fwd-project.git
   cd fwd_project_in
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `server/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

5. **Open the frontend**
   Open `frontend/pages/index.html` in your browser or use a local server:
   ```bash
   # Using Python
   cd frontend/pages
   python -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server frontend/pages -p 8000
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chapters` | Get all chapters |
| GET | `/api/chapters/:id` | Get chapter by ID |
| POST | `/api/chapters` | Create new chapter |
| PUT | `/api/chapters/:id` | Update chapter |
| DELETE | `/api/chapters/:id` | Delete chapter |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please use the contact page on the website.
