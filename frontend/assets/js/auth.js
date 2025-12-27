// frontend/assets/js/auth.js

const AUTH_API = 'http://localhost:3000/auth';

// Global auth state
let currentUser = null;

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch(`${AUTH_API}/check`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            updateUIForAuthenticatedUser();
            return true;
        } else {
            currentUser = null;
            updateUIForUnauthenticatedUser();
            return false;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
    // Update nav bar
    const navAuth = document.getElementById('navAuth');
    if (navAuth && currentUser) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <img src="${currentUser.picture || 'https://via.placeholder.com/32'}" 
                     alt="${currentUser.name}" 
                     class="user-avatar">
                <span class="user-name">${currentUser.name}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        `;
    }

    // Show protected content
    const protectedElements = document.querySelectorAll('.protected-content');
    protectedElements.forEach(el => el.style.display = 'block');
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    const navAuth = document.getElementById('navAuth');
    if (navAuth) {
        navAuth.innerHTML = `
            <a href="login.html" class="btn-highlight">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Login
            </a>
        `;
    }

    // Hide protected content
    const protectedElements = document.querySelectorAll('.protected-content');
    protectedElements.forEach(el => el.style.display = 'none');
}

// Logout function
async function logout() {
    try {
        const response = await fetch(`${AUTH_API}/logout`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = null;
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to logout. Please try again.');
    }
}

// Require authentication for a page
async function requireAuth() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is a public page or requires auth
    const requiresAuth = document.body.getAttribute('data-requires-auth') === 'true';
    
    if (requiresAuth) {
        requireAuth();
    } else {
        checkAuth();
    }
});

// Export functions for use in other scripts
window.authHelper = {
    checkAuth,
    requireAuth,
    logout,
    getCurrentUser: () => currentUser
};
