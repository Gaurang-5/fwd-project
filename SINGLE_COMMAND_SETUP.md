# 🎯 Single Command Setup - Complete!

## ✅ What's Done

Your project now runs with **ONE COMMAND**:

```bash
./dev.sh
```

## 🚀 How to Use

### Step 1: Configure Google OAuth (First Time Only)

1. Follow the guide: [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
2. Get your Google OAuth credentials
3. Update `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Step 2: Run the Project

```bash
./dev.sh
```

### Step 3: Access Your Portal

The script displays everything:
- 🏠 Homepage
- 🔐 Login page
- 👨‍💼 Admin panel
- 📡 API endpoints
- 🔑 Credentials

### Step 4: Stop Everything

Press `Ctrl+C` - all servers stop automatically!

## 🎨 What the Script Does

When you run `./dev.sh`:

1. **Checks Dependencies** ✓
   - Installs npm packages if needed
   - Creates `.env` file if missing

2. **Starts Backend** 🚀
   - Node.js + Express server
   - MongoDB connection
   - Authentication APIs
   - Chapter & Syllabus APIs

3. **Starts Frontend** 🌐
   - Python HTTP server
   - Serves all HTML/CSS/JS

4. **Shows Information** 📋
   - All URLs
   - Credentials
   - Documentation links

5. **Manages Cleanup** 🧹
   - Stops both servers on Ctrl+C
   - Clean process termination

## 📝 Updated Files

### dev.sh (Enhanced)
- ✅ Auto-installs dependencies
- ✅ Creates `.env` with OAuth variables
- ✅ Starts both servers
- ✅ Shows authentication info
- ✅ Clean shutdown on Ctrl+C

### New Documentation
- ✅ [RUN_PROJECT.md](RUN_PROJECT.md) - Complete running guide
- ✅ Updated [README.md](README.md) - Main project docs

## 🎓 For Your Teacher

**Demo Flow:**

1. Open terminal
2. Run: `./dev.sh`
3. Show the beautiful startup screen
4. Open browser to login page
5. Demonstrate authentication
6. Press Ctrl+C to stop

**Key Points:**
- "The entire project starts with one command"
- "Automatic dependency management"
- "Clean shutdown - no zombie processes"
- "Professional development workflow"

## 🔧 Troubleshooting

### Permission denied
```bash
chmod +x dev.sh
```

### Port already in use
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### MongoDB connection error
- Check `server/.env` has correct MONGODB_URI
- Verify IP is whitelisted in MongoDB Atlas
- Check internet connection

### Google OAuth errors
- Verify credentials in `server/.env`
- Check redirect URI in Google Console
- Ensure using @bmsce.ac.in email

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| [RUN_PROJECT.md](RUN_PROJECT.md) | How to run the project |
| [QUICK_START_AUTH.md](QUICK_START_AUTH.md) | 5-minute authentication setup |
| [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md) | Detailed OAuth guide |
| [TEACHER_DEMO_GUIDE.md](TEACHER_DEMO_GUIDE.md) | Perfect demo presentation |
| [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) | Technical auth docs |

## 🎉 Summary

**Before**: Multiple terminals, manual steps, easy to miss something

**Now**: 
```bash
./dev.sh  # That's it!
```

Everything runs, everything's configured, everything's clean! 🚀

---

**Your project is now production-ready with professional DevOps practices!**
