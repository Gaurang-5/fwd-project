# 🎓 Quick Start Guide - BMSCE Portal with Authentication

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Google OAuth

#### Get Google Credentials (2 minutes)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "BMSCE Portal"
3. Enable "Google+ API"
4. Create OAuth credentials:
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3000/auth/google/callback`
5. Copy **Client ID** and **Client Secret**

**Need detailed steps?** See `docs/GOOGLE_OAUTH_SETUP.md`

### 3. Configure Environment
```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=change-this-to-random-string
```

### 4. Start the Server
```bash
npm start
```

### 5. Test It!
1. Open browser: `http://localhost:8000/pages/login.html`
2. Click "Sign in with Google"
3. Log in with your BMSCE email (@bmsce.ac.in)
4. 🎉 You're in!

## 🔑 Key Features

- ✅ Only **@bmsce.ac.in** emails can access
- ✅ Google OAuth sign-in
- ✅ Protected resources and chapters
- ✅ User profile display
- ✅ Secure session management

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Your secret credentials |
| `docs/GOOGLE_OAUTH_SETUP.md` | Detailed OAuth setup |
| `docs/AUTHENTICATION.md` | Complete auth documentation |
| `frontend/pages/login.html` | Login page |

## 🛡️ Security Note

**Only BMSCE students** with **@bmsce.ac.in** email addresses can log in. This is enforced both in the frontend and backend.

## 🐛 Issues?

### Login doesn't work
- Check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env`
- Verify redirect URI in Google Console: `http://localhost:3000/auth/google/callback`

### "Access denied" error
- Make sure you're using an email that ends with @bmsce.ac.in
- Add yourself as a test user in Google Console (if app not published)

### Can't see user info
- Open browser console (F12) and check for errors
- Make sure server is running on port 3000

## 📖 Full Documentation

- **Google OAuth Setup**: `docs/GOOGLE_OAUTH_SETUP.md`
- **Authentication Guide**: `docs/AUTHENTICATION.md`
- **Implementation Details**: `docs/AUTHENTICATION_IMPLEMENTATION.md`

## 💡 Tips for Your Teacher

1. **Demonstrate login**: Show only BMSCE emails work
2. **Show security**: Try non-BMSCE email (it will be rejected)
3. **User experience**: Show how user info appears in navigation
4. **Protected routes**: Demonstrate protected vs public pages

---

**Questions?** Check the documentation in the `docs/` folder!
