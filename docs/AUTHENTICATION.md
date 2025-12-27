# Authentication System Documentation

## Overview
The BMSCE Portal now includes Google OAuth authentication with domain restriction to only allow students with `@bmsce.ac.in` email addresses.

## Features
- ✅ Google OAuth 2.0 integration
- ✅ Domain restriction (@bmsce.ac.in only)
- ✅ Session management
- ✅ Protected routes/pages
- ✅ User profile display
- ✅ Secure logout

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Google OAuth
Follow the detailed guide in `docs/GOOGLE_OAUTH_SETUP.md` to:
- Create a Google Cloud project
- Set up OAuth credentials
- Configure your `.env` file

### 3. Start the Server
```bash
cd server
npm start
```

### 4. Access the Login Page
Navigate to: `http://localhost:8000/pages/login.html`

## Using Authentication in Your Pages

### Making a Page Require Login

To make a page require authentication, add the `data-requires-auth` attribute to the `<body>` tag:

```html
<body data-requires-auth="true">
```

Users will be automatically redirected to the login page if they're not authenticated.

### Adding Auth Script to Pages

Include the auth.js script in all your HTML pages:

```html
<script src="../assets/js/auth.js"></script>
```

### Displaying User Info

Add an element with `id="navAuth"` in your navigation where you want the user menu to appear:

```html
<nav>
    <ul>
        <li><a href="index.html">Home</a></li>
        <!-- ... other menu items ... -->
        <li id="navAuth">
            <!-- User info will be inserted here -->
        </li>
    </ul>
</nav>
```

### Protected Content

You can hide content from non-authenticated users using the `.protected-content` class:

```html
<div class="protected-content">
    <h2>Welcome, Student!</h2>
    <p>This content is only visible to logged-in students.</p>
</div>
```

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/google` | GET | Initiate Google OAuth login |
| `/auth/google/callback` | GET | OAuth callback handler |
| `/auth/user` | GET | Get current user info |
| `/auth/check` | GET | Check authentication status |
| `/auth/logout` | GET | Logout current user |

### Example: Check Auth Status
```javascript
fetch('http://localhost:3000/auth/check', {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    if (data.authenticated) {
        console.log('User:', data.user);
    } else {
        console.log('Not authenticated');
    }
});
```

### Example: Logout
```javascript
fetch('http://localhost:3000/auth/logout', {
    credentials: 'include'
})
.then(res => res.json())
.then(data => {
    console.log(data.message); // "Logged out successfully"
    window.location.href = 'login.html';
});
```

## Protecting API Routes

To protect your API routes (like chapters or syllabus), import the auth middleware:

```javascript
const { isAuthenticated, isBMSCEEmail } = require('../middleware/auth');

// Protect a route
router.get('/chapters', isAuthenticated, async (req, res) => {
    // Only authenticated users can access
    // req.user contains the user information
});

// Protect with BMSCE email check
router.post('/chapters', isBMSCEEmail, async (req, res) => {
    // Only BMSCE students can access
});
```

## Frontend JavaScript Utilities

The `auth.js` file provides global utilities:

### Check Current User
```javascript
const user = window.authHelper.getCurrentUser();
if (user) {
    console.log(`Logged in as: ${user.name}`);
    console.log(`Email: ${user.email}`);
}
```

### Manually Check Auth
```javascript
await window.authHelper.checkAuth();
```

### Require Auth Programmatically
```javascript
await window.authHelper.requireAuth();
```

### Logout
```javascript
await window.authHelper.logout();
```

## Security Features

### Backend Security
- ✅ Email domain validation (@bmsce.ac.in)
- ✅ Session-based authentication
- ✅ HttpOnly cookies (prevents XSS attacks)
- ✅ CSRF protection via SameSite cookies
- ✅ Secure cookies in production (HTTPS only)

### Database Security
- User model validates email domain
- Google ID stored for user identification
- Minimal personal data storage

### Session Security
- 24-hour session expiration
- Secure session secret
- Session regeneration on login

## User Model

The User schema stores:
```javascript
{
    googleId: String,      // Unique Google ID
    email: String,         // Must end with @bmsce.ac.in
    name: String,          // User's display name
    picture: String,       // Profile picture URL
    lastLogin: Date,       // Last login timestamp
    createdAt: Date        // Account creation date
}
```

## Example: Complete Protected Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Protected Page</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-requires-auth="true">
    <header>
        <div class="container">
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li id="navAuth"></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <div class="protected-content">
            <h1>Protected Content</h1>
            <p>Only BMSCE students can see this!</p>
        </div>
    </main>

    <script src="../assets/js/auth.js"></script>
</body>
</html>
```

## Troubleshooting

### Users can't log in
1. Check Google Console credentials are correct
2. Verify OAuth redirect URIs match exactly
3. Ensure user's email ends with @bmsce.ac.in
4. Check if app is published (or user is a test user)

### Session not persisting
1. Verify `credentials: 'include'` in fetch requests
2. Check CORS allows credentials
3. Ensure cookies are enabled in browser
4. Verify SESSION_SECRET is set in .env

### "Access denied" error
- User's email must end with @bmsce.ac.in
- Check user is added as test user (if in testing mode)

## Production Checklist

Before deploying to production:

- [ ] Update Google OAuth URIs to production URLs
- [ ] Set strong SESSION_SECRET (32+ random characters)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Update FRONTEND_URL and GOOGLE_CALLBACK_URL
- [ ] Set secure: true for cookies
- [ ] Publish OAuth app in Google Console
- [ ] Test with multiple users
- [ ] Set up error logging and monitoring

## Support

For detailed OAuth setup instructions, see:
- `docs/GOOGLE_OAUTH_SETUP.md`

For general project help:
- Check the main `README.md`
- Contact project administrator
