# Google OAuth Setup Guide for BMSCE Portal

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "BMSCE Portal" (or any name you prefer)
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, select your project
2. Go to "APIs & Services" → "Library"
3. Search for "Google+ API"
4. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: BMSCE Portal
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On "Scopes" page, click "Add or Remove Scopes"
   - Add: `.../auth/userinfo.email`
   - Add: `.../auth/userinfo.profile`
7. Click "Save and Continue"
8. Add test users (your BMSCE email addresses) if in testing mode
9. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: BMSCE Portal Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:8000`
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/google/callback`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**
1067620133192-3ir0n2n11715akeptfgsris93lc5fei3.apps.googleusercontent.com
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
## Step 5: Update .env File

1. In your project, navigate to `server/` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` file and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

## Step 6: Update MongoDB URI

Make sure your MongoDB connection string is also in the `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Step 7: Start the Server

```bash
cd server
npm install
npm start
```

## Step 8: Test the Login

1. Start your frontend server (on port 8000)
2. Go to `http://localhost:8000/pages/login.html`
3. Click "Sign in with Google"
4. You should be redirected to Google's login page
5. Sign in with your BMSCE email (ending with @bmsce.ac.in)
6. You should be redirected back to the homepage

## Important Notes

### Domain Restriction
- Only emails ending with `@bmsce.ac.in` can log in
- This is enforced in the backend code

### Production Setup
For production deployment:

1. Update authorized origins and redirect URIs in Google Console to your production URLs
2. Change `SESSION_SECRET` to a strong random string
3. Set `NODE_ENV=production`
4. Enable HTTPS and set `secure: true` for cookies
5. Update `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` to your production URLs

### Publishing Your App
When ready to make your app public:
1. Go to OAuth consent screen in Google Console
2. Click "Publish App"
3. Submit for verification if required (for more than 100 users)

## Troubleshooting

### "Access denied" error
- Make sure the email address ends with `@bmsce.ac.in`
- Check that the user is added as a test user (if in testing mode)

### Redirect URI mismatch
- Ensure the callback URL in Google Console exactly matches the one in your `.env` file
- No trailing slashes should differ

### Session not persisting
- Make sure cookies are enabled in your browser
- Check that `credentials: 'include'` is set in frontend fetch requests
- Verify CORS settings allow credentials

## Security Best Practices

1. **Never commit** `.env` file to Git
2. Use **strong SESSION_SECRET** (32+ random characters)
3. Enable **HTTPS** in production
4. Set **httpOnly** and **secure** flags for cookies in production
5. Regularly **rotate** your OAuth credentials
6. Monitor **failed login attempts**

## Need Help?

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
