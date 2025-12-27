# 🚀 Running the BMSCE Portal

## One-Command Start

Run the entire project with a single command:

```bash
./dev.sh
```

That's it! The script will:
1. ✅ Check and install dependencies
2. ✅ Create `.env` file if needed
3. ✅ Start the backend server (Node.js)
4. ✅ Start the frontend server (Python)
5. ✅ Display all URLs and credentials

## First Time Setup

### 1. Make the script executable (only once)
```bash
chmod +x dev.sh
```

### 2. Configure Google OAuth (REQUIRED)

Before running, you need to set up Google OAuth:

1. **Follow the guide**: Read [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
2. **Get credentials**: From Google Cloud Console
3. **Update `.env`**: Add your Client ID and Secret

```bash
# Edit server/.env
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
```

### 3. Run the project
```bash
./dev.sh
```

## What Runs

When you run `./dev.sh`:

### Backend Server (Port 3000)
- Node.js + Express
- MongoDB connection
- Authentication APIs
- Chapters & Syllabus APIs

### Frontend Server (Port 8000)
- Static file server
- All HTML/CSS/JS files
- Login page
- Admin panel

## Quick Links (After Starting)

| Service | URL |
|---------|-----|
| 🏠 Homepage | http://localhost:8000/frontend/pages/index.html |
| 🔐 Student Login | http://localhost:8000/frontend/pages/login.html |
| 👨‍💼 Admin Panel | http://localhost:8000/frontend/components/admin/admin.html |
| 📡 Backend API | http://localhost:3000 |

## Stopping the Servers

Press `Ctrl+C` in the terminal where you ran `./dev.sh`

The script will automatically:
- Stop the backend server
- Stop the frontend server
- Clean up processes

## Troubleshooting

### Script won't run
```bash
chmod +x dev.sh
./dev.sh
```

### Backend fails to start

**Check MongoDB connection:**
```bash
# View error logs
cat /tmp/backend.log
```

**Common fixes:**
1. Verify MongoDB URI in `server/.env`
2. Check if your IP is whitelisted in MongoDB Atlas
3. Ensure internet connection is active

### Google OAuth errors

**"Access denied" message:**
- Only @bmsce.ac.in emails are allowed
- Check if user is added as test user in Google Console
- Verify OAuth credentials in `server/.env`

**"Redirect URI mismatch":**
- Ensure callback URL in Google Console matches:
  `http://localhost:3000/auth/google/callback`

### Port already in use

**Backend (Port 3000):**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Frontend (Port 8000):**
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

Then run `./dev.sh` again.

## Manual Start (Alternative)

If you prefer to start servers manually:

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
# From project root
python3 -m http.server 8000
```

## Environment Variables

The `.env` file is automatically created with defaults. Important variables:

```bash
# Server
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Frontend
FRONTEND_URL=http://localhost:8000

# Authentication (REQUIRED)
GOOGLE_CLIENT_ID=get_from_google_console
GOOGLE_CLIENT_SECRET=get_from_google_console
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=random_secret_string

# Admin Panel
ADMIN_USERNAME=teacher
ADMIN_PASSWORD=pass123
```

## Development Workflow

1. **Start the project**
   ```bash
   ./dev.sh
   ```

2. **Make changes**
   - Edit frontend files (HTML/CSS/JS) - changes are immediate
   - Edit backend files - restart the backend (Ctrl+C and run `./dev.sh` again)

3. **Stop servers**
   - Press `Ctrl+C`

4. **View logs**
   ```bash
   # Backend logs
   cat /tmp/backend.log
   
   # Frontend logs
   cat /tmp/frontend.log
   ```

## Production Deployment

For production, you'll need to:

1. Set up environment variables on your hosting platform
2. Use a proper web server (nginx, Apache) instead of Python's SimpleHTTPServer
3. Enable HTTPS
4. Update Google OAuth redirect URLs
5. Set `NODE_ENV=production`

## Documentation

- **Quick Start**: [QUICK_START_AUTH.md](QUICK_START_AUTH.md)
- **Google OAuth Setup**: [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
- **Authentication Guide**: [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
- **Teacher Demo**: [TEACHER_DEMO_GUIDE.md](TEACHER_DEMO_GUIDE.md)

## Support

Having issues? Check:
1. All dependencies are installed (`node_modules` folder exists)
2. MongoDB connection is working
3. Google OAuth credentials are configured
4. Ports 3000 and 8000 are available
5. Internet connection is active

---

**Remember**: After configuring Google OAuth credentials, you can start the entire project with just `./dev.sh`! 🚀
