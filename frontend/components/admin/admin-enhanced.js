// Enhanced Admin Panel with All Features

const API_URL = 'http://localhost:3000/api/chapters';
const ADMIN_USERNAME = "teacher";
const ADMIN_PASSWORD = "pass123";

// ========== SECURITY & CONFIGURATION ==========
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for API cache

let loginAttempts = 0;
let lockoutUntil = null;
let lastActivityTime = Date.now();
let sessionTimeoutId = null;
let allChapters = [];
let selectedChapters = new Set();
let currentSort = { field: null, order: 'asc' };

// ========== API CACHE ==========
const apiCache = new Map();

function getCachedData(key) {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function setCachedData(key, data) {
    apiCache.set(key, { data, timestamp: Date.now() });
}

function clearCache(key) {
    if (key) {
        apiCache.delete(key);
    } else {
        apiCache.clear();
    }
}

// ========== ENHANCED FETCH WITH RETRY & OFFLINE DETECTION ==========
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
    isOnline = true;
    showNotification('Connection restored! ✓', 'success');
    hideOfflineOverlay();
});

window.addEventListener('offline', () => {
    isOnline = false;
    showNotification('You are offline. Some features may not work.', 'error');
    showOfflineOverlay();
});

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    if (!isOnline) {
        throw new Error('No internet connection. Please check your network.');
    }
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            if (i === retries - 1) {
                // Last attempt failed
                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Cannot connect to server. Please ensure the backend is running.');
                }
                throw error;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

function showOfflineOverlay() {
    let overlay = document.getElementById('offline-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'offline-overlay';
        overlay.innerHTML = `
            <div class="offline-content">
                <i class="fas fa-wifi" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                <h3>You're Offline</h3>
                <p>Please check your internet connection</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideOfflineOverlay() {
    const overlay = document.getElementById('offline-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    initializeApp();
});

function checkExistingSession() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const sessionStart = sessionStorage.getItem('sessionStart');
    
    // Check if session has expired
    if (isLoggedIn === 'true' && sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart);
        if (elapsed > SESSION_TIMEOUT) {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('sessionStart');
            showNotification('Session expired. Please login again.', 'error');
            return;
        }
    }
    
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
}

function initializeApp() {
    setupLoginHandlers();
    setupModalHandlers();
    setupFormHandlers();
    setupSearchAndFilter();
    setupBulkActions();
    setupExportImport();
    setupSorting();
    setupActivityMonitor();
    setupMobileMenu();
}

// ========== MOBILE MENU ==========
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (!toggle || !nav) return;
    
    // Create overlay
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);
    }
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== ACTIVITY MONITOR FOR SESSION TIMEOUT ==========
function setupActivityMonitor() {
    const resetActivity = () => {
        lastActivityTime = Date.now();
        resetSessionTimeout();
    };
    
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetActivity, { passive: true });
    });
}

function resetSessionTimeout() {
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
    }
    
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        sessionTimeoutId = setTimeout(() => {
            handleLogout();
            showNotification('Session expired due to inactivity.', 'error');
        }, SESSION_TIMEOUT);
    }
}

// ========== LOGIN ==========
function setupLoginHandlers() {
    const loginBtn = document.getElementById('login-btn');
    const password = document.getElementById('password');
    
    loginBtn?.addEventListener('click', handleLogin);
    password?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
}

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Check for lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000);
        showNotification(`Too many failed attempts. Try again in ${remainingTime} seconds.`, 'error');
        return;
    }
    
    if (!username || !password) {
        showNotification('Please enter both username and password', 'error');
        return;
    }
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Reset login attempts on success
        loginAttempts = 0;
        lockoutUntil = null;
        
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('sessionStart', Date.now().toString());
        showAdminPanel();
        showNotification('Welcome to Admin Panel!', 'success');
    } else {
        // Increment failed attempts
        loginAttempts++;
        const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts;
        
        if (remaining <= 0) {
            lockoutUntil = Date.now() + LOCKOUT_TIME;
            loginAttempts = 0;
            showNotification(`Account locked for 5 minutes due to too many failed attempts.`, 'error');
        } else if (remaining <= 2) {
            showNotification(`Incorrect credentials! ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`, 'error');
        } else {
            showNotification('Incorrect username or password!', 'error');
        }
    }
}

function showAdminPanel() {
    document.getElementById('password-prompt').style.display = 'none';
    document.querySelector('#particles-js').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.body.className = 'admin-dashboard-page';
    
    // Start session timeout
    resetSessionTimeout();
    
    loadChapters();
    loadSyllabusLinks();
    setupTabSwitching();
    setupLogoutHandler();
}

function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    // Clear session timeout
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
    }
    
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('sessionStart');
    clearCache(); // Clear API cache on logout
    
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('password-prompt').style.display = 'flex';
    document.querySelector('#particles-js').style.display = 'block';
    document.body.className = 'admin-login-page';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showNotification('Logged out successfully', 'success');
}

// ========== LOAD & RENDER CHAPTERS ==========
async function loadChapters(useCache = false) {
    try {
        // Check cache first
        if (useCache) {
            const cached = getCachedData('chapters');
            if (cached) {
                allChapters = cached;
                renderChapters(allChapters);
                updateStats(allChapters);
                return;
            }
        }
        
        console.log('Loading chapters from:', API_URL);
        showLoading(true);
        
        const response = await fetchWithRetry(API_URL);
        const data = await response.json();
        console.log('Data received:', data);
        
        allChapters = data.data || data || [];
        setCachedData('chapters', allChapters); // Cache the data
        
        console.log('All chapters:', allChapters.length);
        renderChapters(allChapters);
        updateStats(allChapters);
        showLoading(false);
    } catch (error) {
        console.error('Error loading chapters:', error);
        showNotification(error.message || 'Failed to load chapters. Make sure backend server is running.', 'error');
        showLoading(false);
    }
}

function renderChapters(chapters) {
    console.log('Rendering chapters:', chapters.length);
    const container10 = document.getElementById('units-container-10');
    const container9 = document.getElementById('units-container-9');
    
    if (!container10 || !container9) {
        console.error('Unit containers not found!');
        return;
    }
    
    container10.innerHTML = '';
    container9.innerHTML = '';
    
    // Group chapters by class and unit
    const grouped10 = groupChaptersByUnit(chapters.filter(c => c.classNumber === 10));
    const grouped9 = groupChaptersByUnit(chapters.filter(c => c.classNumber === 9));
    
    const count10 = chapters.filter(c => c.classNumber === 10).length;
    const count9 = chapters.filter(c => c.classNumber === 9).length;
    
    // Render Physics Cycle
    if (count10 === 0) {
        container10.innerHTML = '<div class="empty-state-full">No chapters found</div>';
    } else {
        Object.keys(grouped10).sort().forEach(unit => {
            container10.appendChild(createUnitSection(unit, grouped10[unit], 10));
        });
    }
    
    // Render Chemistry Cycle
    if (count9 === 0) {
        container9.innerHTML = '<div class="empty-state-full">No chapters found</div>';
    } else {
        Object.keys(grouped9).sort().forEach(unit => {
            container9.appendChild(createUnitSection(unit, grouped9[unit], 9));
        });
    }
    
    document.getElementById('count-10').textContent = `${count10} chapter${count10 !== 1 ? 's' : ''}`;
    document.getElementById('count-9').textContent = `${count9} chapter${count9 !== 1 ? 's' : ''}`;
}

function groupChaptersByUnit(chapters) {
    return chapters.reduce((acc, chapter) => {
        if (!acc[chapter.unitName]) {
            acc[chapter.unitName] = [];
        }
        acc[chapter.unitName].push(chapter);
        return acc;
    }, {});
}

function createUnitSection(unitName, chapters, classNumber) {
    const section = document.createElement('div');
    section.className = 'unit-section';
    
    const header = document.createElement('div');
    header.className = 'unit-header';
    header.innerHTML = `
        <div class="unit-title-wrapper">
            <i class="fas fa-chevron-down unit-toggle"></i>
            <h3>${escapeHtml(unitName)}</h3>
            <span class="unit-chapter-count">${chapters.length} chapter${chapters.length !== 1 ? 's' : ''}</span>
        </div>
    `;
    
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container unit-table-container';
    
    const table = document.createElement('table');
    table.className = 'chapters-table';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th><input type="checkbox" class="unit-select-all" title="Select All"></th>
            <th class="sortable" data-sort="chapterNumber">Ch # <i class="fas fa-sort"></i></th>
            <th class="sortable" data-sort="title">Title <i class="fas fa-sort"></i></th>
            <th>Resources</th>
            <th>Actions</th>
        </tr>
    `;
    
    const tbody = document.createElement('tbody');
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber).forEach(chapter => {
        tbody.appendChild(createChapterRow(chapter));
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    section.appendChild(header);
    section.appendChild(tableContainer);
    
    // Toggle functionality (avoid triggering on checkbox clicks)
    header.addEventListener('click', (e) => {
        if (!e.target.closest('input[type="checkbox"]')) {
            section.classList.toggle('collapsed');
            const toggle = header.querySelector('.unit-toggle');
            toggle.style.transform = section.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
        }
    });
    
    // Select all checkboxes in this unit - must be done after elements are in DOM
    setTimeout(() => {
        const selectAllCheckbox = thead.querySelector('.unit-select-all');
        const checkboxes = tbody.querySelectorAll('.chapter-checkbox');
        
        if (selectAllCheckbox && checkboxes.length > 0) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                checkboxes.forEach(cb => {
                    cb.checked = isChecked;
                    const id = cb.dataset.id;
                    if (isChecked) {
                        selectedChapters.add(id);
                    } else {
                        selectedChapters.delete(id);
                    }
                });
                updateBulkActionsVisibility();
            });
            
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const id = cb.dataset.id;
                    if (cb.checked) {
                        selectedChapters.add(id);
                    } else {
                        selectedChapters.delete(id);
                    }
                    
                    const allChecked = Array.from(checkboxes).every(c => c.checked);
                    const someChecked = Array.from(checkboxes).some(c => c.checked);
                    selectAllCheckbox.checked = allChecked;
                    selectAllCheckbox.indeterminate = someChecked && !allChecked;
                    
                    updateBulkActionsVisibility();
                });
            });
        }
    }, 0);
    
    return section;
}

function createChapterRow(chapter) {
    const row = document.createElement('tr');
    row.dataset.chapterId = chapter._id;
    
    const hasVideo = chapter.videoLink && chapter.videoLink.trim();
    const hasNotes = chapter.notesLink && chapter.notesLink.trim();
    const hasQuestions = chapter.questionsLink && chapter.questionsLink.trim();
    
    const isSelected = selectedChapters.has(chapter._id);
    
    row.innerHTML = `
        <td><input type="checkbox" class="chapter-checkbox" data-id="${chapter._id}" ${isSelected ? 'checked' : ''}></td>
        <td><span class="chapter-number">${chapter.chapterNumber}</span></td>
        <td><strong>${escapeHtml(chapter.title)}</strong></td>
        <td class="resources-cell">
            <span class="resource-badge ${hasVideo ? 'video' : 'empty'}"><i class="fas fa-video"></i></span>
            <span class="resource-badge ${hasNotes ? 'notes' : 'empty'}"><i class="fas fa-file-pdf"></i></span>
            <span class="resource-badge ${hasQuestions ? 'questions' : 'empty'}"><i class="fas fa-question-circle"></i></span>
        </td>
        <td class="actions-cell">
            <button class="icon-btn preview-btn" onclick="previewChapter('${chapter._id}')" title="Preview">
                <i class="fas fa-eye"></i>
            </button>
            <button class="icon-btn edit-btn" onclick="editChapter('${chapter._id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn delete-btn" onclick="deleteChapter('${chapter._id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

function updateStats(chapters) {
    const total = chapters.length;
    const physics = chapters.filter(c => c.classNumber === 10).length;
    const chemistry = chapters.filter(c => c.classNumber === 9).length;
    
    // Calculate resource completion
    const withResources = chapters.filter(c => 
        (c.videoLink && c.videoLink.trim()) || 
        (c.notesLink && c.notesLink.trim()) || 
        (c.questionsLink && c.questionsLink.trim())
    ).length;
    const resourcePercentage = total > 0 ? Math.round((withResources / total) * 100) : 0;
    
    // Count unique units
    const uniqueUnits = new Set(chapters.map(c => c.unitName)).size;
    
    document.getElementById('total-chapters').textContent = total;
    document.getElementById('physics-count').textContent = physics;
    document.getElementById('chemistry-count').textContent = chemistry;
    document.getElementById('resources-count').textContent = resourcePercentage + '%';
    document.getElementById('units-count').textContent = uniqueUnits;
}

// ========== MODAL HANDLERS ==========
function setupModalHandlers() {
    document.getElementById('create-new-btn')?.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Create New Chapter';
        document.getElementById('chapterId').value = '';
        document.getElementById('chapter-form').reset();
        openModal();
    });
    
    document.querySelector('.close-btn')?.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target.id === 'chapter-modal') closeModal();
        if (e.target.id === 'preview-modal') closePreviewModal();
    });
}

function openModal() {
    document.getElementById('chapter-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('chapter-modal').style.display = 'none';
}

window.closePreviewModal = function() {
    document.getElementById('preview-modal').style.display = 'none';
}

// ========== FORM HANDLERS ==========
function setupFormHandlers() {
    document.getElementById('chapter-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('chapterId').value;
        const isEditing = id !== '';
        
        // Validate form
        if (!validateForm()) return;
        
        const chapterData = {
            title: document.getElementById('title').value.trim(),
            chapterNumber: parseInt(document.getElementById('chapterNumber').value),
            classNumber: parseInt(document.getElementById('classNumber').value),
            unitName: document.getElementById('unitName').value.trim(),
            videoLink: document.getElementById('videoLink').value.trim() || '',
            notesLink: document.getElementById('notesLink').value.trim() || '',
            questionsLink: document.getElementById('questionsLink').value.trim() || ''
        };
        
        try {
            showButtonLoading(true);
            const response = await fetch(isEditing ? `${API_URL}/${id}` : API_URL, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(chapterData)
            });
            
            if (response.ok) {
                closeModal();
                await showSuccessAnimation(
                    `Chapter ${isEditing ? 'Updated' : 'Created'}!`,
                    `The chapter has been successfully ${isEditing ? 'updated' : 'created'}.`
                );
                loadChapters();
            } else {
                const error = await response.json();
                showNotification(error.message || 'Failed to save chapter', 'error');
            }
        } catch (error) {
            console.error('Error saving:', error);
            showNotification('Error saving chapter. Please try again.', 'error');
        } finally {
            showButtonLoading(false);
        }
    });
}

function validateForm() {
    const title = document.getElementById('title').value.trim();
    const chapterNumber = document.getElementById('chapterNumber').value;
    const unitName = document.getElementById('unitName').value.trim();
    
    if (!title) {
        showNotification('Chapter title is required', 'error');
        return false;
    }
    
    if (!chapterNumber || chapterNumber < 1) {
        showNotification('Please enter a valid chapter number', 'error');
        return false;
    }
    
    if (!unitName) {
        showNotification('Unit name is required', 'error');
        return false;
    }
    
    return true;
}

// ========== CRUD OPERATIONS ==========
window.editChapter = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            credentials: 'include'
        });
        const result = await response.json();
        const chapter = result.data || result;
        
        document.getElementById('modal-title').textContent = 'Edit Chapter';
        document.getElementById('chapterId').value = chapter._id;
        document.getElementById('title').value = chapter.title;
        document.getElementById('chapterNumber').value = chapter.chapterNumber;
        document.getElementById('classNumber').value = chapter.classNumber;
        document.getElementById('unitName').value = chapter.unitName;
        document.getElementById('videoLink').value = chapter.videoLink || '';
        document.getElementById('notesLink').value = chapter.notesLink || '';
        document.getElementById('questionsLink').value = chapter.questionsLink || '';
        
        openModal();
    } catch (error) {
        console.error('Error loading chapter:', error);
        showNotification('Failed to load chapter data', 'error');
    }
};

window.deleteChapter = async function(id) {
    const chapter = allChapters.find(c => c._id === id);
    const confirmed = await showConfirmDialog(
        'Delete Chapter?',
        `Are you sure you want to delete "${chapter?.title || 'this chapter'}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
        await fetchWithRetry(`${API_URL}/${id}`, { method: 'DELETE' });
        
        clearCache('chapters'); // Clear chapters cache
        await showSuccessAnimation('Chapter Deleted', 'The chapter has been successfully removed.');
        selectedChapters.delete(id);
        loadChapters();
    } catch (error) {
        console.error('Error deleting:', error);
        showNotification(error.message || 'Error deleting chapter', 'error');
    }
};

window.previewChapter = function(id) {
    const chapter = allChapters.find(c => c._id === id);
    if (!chapter) return;
    
    const previewContent = document.getElementById('preview-content');
    
    const hasVideo = chapter.videoLink && chapter.videoLink.trim();
    const hasNotes = chapter.notesLink && chapter.notesLink.trim();
    const hasQuestions = chapter.questionsLink && chapter.questionsLink.trim();
    
    previewContent.innerHTML = `
        <div class="preview-details">
            <div class="preview-row">
                <strong>Chapter Number:</strong>
                <span>${chapter.chapterNumber}</span>
            </div>
            <div class="preview-row">
                <strong>Title:</strong>
                <span>${escapeHtml(chapter.title)}</span>
            </div>
            <div class="preview-row">
                <strong>Cycle:</strong>
                <span>${chapter.classNumber === 10 ? 'Physics Cycle' : 'Chemistry Cycle'}</span>
            </div>
            <div class="preview-row">
                <strong>Unit Name:</strong>
                <span>${escapeHtml(chapter.unitName)}</span>
            </div>
            <div class="preview-row">
                <strong>Video Link:</strong>
                <span>${hasVideo ? `<a href="${chapter.videoLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Open Video</a>` : '<em>Not available</em>'}</span>
            </div>
            <div class="preview-row">
                <strong>Notes PDF:</strong>
                <span>${hasNotes ? `<a href="${chapter.notesLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Open Notes</a>` : '<em>Not available</em>'}</span>
            </div>
            <div class="preview-row">
                <strong>Questions PDF:</strong>
                <span>${hasQuestions ? `<a href="${chapter.questionsLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Open Questions</a>` : '<em>Not available</em>'}</span>
            </div>
        </div>
    `;
    
    document.getElementById('preview-modal').style.display = 'block';
};

// ========== SEARCH & FILTER ==========
let searchDebounceTimer = null;

function setupSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const classFilter = document.getElementById('class-filter');
    
    // Debounced search for better performance
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(filterChapters, 300);
    });
    
    classFilter?.addEventListener('change', filterChapters);
}

function filterChapters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const classValue = document.getElementById('class-filter').value;
    
    const filtered = allChapters.filter(chapter => {
        const matchesSearch = chapter.title.toLowerCase().includes(searchTerm) || 
                              chapter.unitName.toLowerCase().includes(searchTerm);
        const matchesClass = classValue === 'all' || chapter.classNumber === parseInt(classValue);
        return matchesSearch && matchesClass;
    });
    
    renderChapters(filtered);
    updateSectionVisibility(classValue);
}

function updateSectionVisibility(classValue) {
    const section10 = document.getElementById('class-10-section');
    const section9 = document.getElementById('class-9-section');
    
    if (classValue === '10') {
        section10.style.display = 'block';
        section9.style.display = 'none';
    } else if (classValue === '9') {
        section10.style.display = 'none';
        section9.style.display = 'block';
    } else {
        section10.style.display = 'block';
        section9.style.display = 'block';
    }
}

// ========== BULK ACTIONS ==========
function setupBulkActions() {
    // Bulk actions are now handled at the unit level in createUnitSection
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('chapter-checkbox')) {
            handleCheckboxChange(e.target);
        }
    });
    
    document.getElementById('bulk-delete-btn')?.addEventListener('click', bulkDelete);
}

function selectAllInTable(tbodyId, checked) {
    const tbody = document.getElementById(tbodyId);
    const checkboxes = tbody.querySelectorAll('.chapter-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
        const id = checkbox.dataset.id;
        if (checked) {
            selectedChapters.add(id);
        } else {
            selectedChapters.delete(id);
        }
    });
    
    updateBulkActionsVisibility();
}

function handleCheckboxChange(checkbox) {
    const id = checkbox.dataset.id;
    
    if (checkbox.checked) {
        selectedChapters.add(id);
    } else {
        selectedChapters.delete(id);
    }
    
    updateBulkActionsVisibility();
}

function updateBulkActionsVisibility() {
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    
    if (selectedChapters.size > 0) {
        bulkActions.style.display = 'block';
        selectedCount.textContent = selectedChapters.size;
    } else {
        bulkActions.style.display = 'none';
    }
}

async function bulkDelete() {
    if (selectedChapters.size === 0) return;
    
    const count = selectedChapters.size;
    const confirmed = await showConfirmDialog(
        'Delete Multiple Chapters?',
        `Are you sure you want to delete ${count} chapter${count > 1 ? 's' : ''}? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
        const chapterIds = Array.from(selectedChapters);
        let completed = 0;
        let failed = 0;
        
        // Show progress overlay
        showProgressOverlay('Deleting Chapters...', 0, count);
        
        for (const id of chapterIds) {
            try {
                await fetchWithRetry(`${API_URL}/${id}`, { method: 'DELETE' });
                completed++;
            } catch (error) {
                failed++;
                console.error(`Failed to delete chapter ${id}:`, error);
            }
            updateProgressOverlay(completed + failed, count);
        }
        
        hideProgressOverlay();
        selectedChapters.clear();
        clearCache('chapters'); // Clear chapters cache
        
        if (failed > 0) {
            showNotification(`Deleted ${completed} chapter(s). ${failed} failed.`, 'warning');
        } else {
            await showSuccessAnimation(
                'Chapters Deleted!',
                `${count} chapter${count > 1 ? 's have' : ' has'} been successfully removed.`
            );
        }
        loadChapters();
    } catch (error) {
        console.error('Error bulk deleting:', error);
        hideProgressOverlay();
        showNotification(error.message || 'Error deleting chapters', 'error');
    }
}

// ========== PROGRESS OVERLAY ==========
function showProgressOverlay(title, current, total) {
    let overlay = document.getElementById('progress-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'progress-overlay';
        overlay.innerHTML = `
            <div class="progress-content">
                <h3 id="progress-title">${title}</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <p id="progress-text">${current} / ${total}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.querySelector('#progress-title').textContent = title;
        overlay.querySelector('#progress-text').textContent = `${current} / ${total}`;
        overlay.querySelector('#progress-bar').style.width = `${(current / total) * 100}%`;
    }
    overlay.style.display = 'flex';
}

function updateProgressOverlay(current, total) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${(current / total) * 100}%`;
    }
    if (progressText) {
        progressText.textContent = `${current} / ${total}`;
    }
}

function hideProgressOverlay() {
    const overlay = document.getElementById('progress-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ========== EXPORT / IMPORT ==========
function setupExportImport() {
    document.getElementById('export-btn')?.addEventListener('click', exportChapters);
    document.getElementById('import-btn')?.addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file')?.addEventListener('change', importChapters);
}

function exportChapters() {
    if (allChapters.length === 0) {
        showNotification('No chapters to export', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(allChapters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chapters_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification(`${allChapters.length} chapters exported successfully!`, 'success');
}

async function importChapters(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const chapters = JSON.parse(text);
        
        if (!Array.isArray(chapters)) {
            showNotification('Invalid file format. Expected an array of chapters.', 'error');
            return;
        }
        
        if (!confirm(`Import ${chapters.length} chapters? This will add them to your existing chapters.`)) {
            e.target.value = '';
            return;
        }
        
        showLoading(true);
        let imported = 0;
        
        for (const chapter of chapters) {
            delete chapter._id; // Remove old ID
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(chapter)
                });
                if (response.ok) imported++;
            } catch (err) {
                console.error('Error importing chapter:', err);
            }
        }
        
        showNotification(`Successfully imported ${imported} out of ${chapters.length} chapters!`, 'success');
        loadChapters();
    } catch (error) {
        console.error('Error importing:', error);
        showNotification('Error reading file. Make sure it\'s a valid JSON file.', 'error');
    } finally {
        showLoading(false);
        e.target.value = '';
    }
}

// ========== SORTING ==========
function setupSorting() {
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.sort;
            sortChapters(field);
        });
    });
}

function sortChapters(field) {
    if (currentSort.field === field) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.order = 'asc';
    }
    
    const sorted = [...allChapters].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (currentSort.order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    renderChapters(sorted);
    updateSortIcons();
}

function updateSortIcons() {
    document.querySelectorAll('.sortable i').forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    if (currentSort.field) {
        const header = document.querySelector(`[data-sort="${currentSort.field}"] i`);
        if (header) {
            header.className = currentSort.order === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }
    }
}

// ========== UTILITY FUNCTIONS ==========
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    // You can add a loading overlay here if needed
}

function showButtonLoading(show) {
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const submitBtn = document.getElementById('submit-btn');
    
    if (show) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
    } else {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== ENHANCED FEATURES ==========

// Resource Statistics Modal
window.showResourceStats = function() {
    const withVideo = allChapters.filter(c => c.videoLink && c.videoLink.trim()).length;
    const withNotes = allChapters.filter(c => c.notesLink && c.notesLink.trim()).length;
    const withQuestions = allChapters.filter(c => c.questionsLink && c.questionsLink.trim()).length;
    const complete = allChapters.filter(c => 
        c.videoLink?.trim() && c.notesLink?.trim() && c.questionsLink?.trim()
    ).length;
    
    const content = `
        <div class="stats-breakdown">
            <h3>Resource Statistics</h3>
            <div class="stat-item">
                <span class="stat-label"><i class="fas fa-video"></i> Chapters with Video:</span>
                <span class="stat-value">${withVideo} / ${allChapters.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label"><i class="fas fa-file-pdf"></i> Chapters with Notes:</span>
                <span class="stat-value">${withNotes} / ${allChapters.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label"><i class="fas fa-question-circle"></i> Chapters with Questions:</span>
                <span class="stat-value">${withQuestions} / ${allChapters.length}</span>
            </div>
            <div class="stat-item highlight">
                <span class="stat-label"><i class="fas fa-check-circle"></i> Fully Complete:</span>
                <span class="stat-value">${complete} / ${allChapters.length}</span>
            </div>
        </div>
    `;
    
    showCustomModal('Resource Statistics', content);
};

// Unit Breakdown Modal
window.showUnitBreakdown = function() {
    const unitMap = {};
    allChapters.forEach(c => {
        if (!unitMap[c.unitName]) {
            unitMap[c.unitName] = { total: 0, physics: 0, chemistry: 0 };
        }
        unitMap[c.unitName].total++;
        if (c.classNumber === 10) unitMap[c.unitName].physics++;
        else unitMap[c.unitName].chemistry++;
    });
    
    let content = '<div class="unit-breakdown"><h3>Chapters by Unit</h3><table class="breakdown-table">';
    content += '<tr><th>Unit Name</th><th>Total</th><th>Physics</th><th>Chemistry</th></tr>';
    
    Object.entries(unitMap).forEach(([unit, counts]) => {
        content += `<tr>
            <td><strong>${unit}</strong></td>
            <td>${counts.total}</td>
            <td>${counts.physics}</td>
            <td>${counts.chemistry}</td>
        </tr>`;
    });
    
    content += '</table></div>';
    showCustomModal('Unit Breakdown', content);
};

// Show Incomplete Chapters
window.showIncompleteChapters = function() {
    const incomplete = allChapters.filter(c => 
        !c.videoLink?.trim() || !c.notesLink?.trim() || !c.questionsLink?.trim()
    );
    
    if (incomplete.length === 0) {
        showNotification('All chapters have complete resources! 🎉', 'success');
        return;
    }
    
    let content = `<div class="incomplete-list"><h3>Incomplete Chapters (${incomplete.length})</h3><ul>`;
    incomplete.forEach(c => {
        const missing = [];
        if (!c.videoLink?.trim()) missing.push('Video');
        if (!c.notesLink?.trim()) missing.push('Notes');
        if (!c.questionsLink?.trim()) missing.push('Questions');
        
        content += `<li>
            <strong>${c.title}</strong> (${c.classNumber === 10 ? 'Physics' : 'Chemistry'})
            <br><small style="color: #dc3545;">Missing: ${missing.join(', ')}</small>
        </li>`;
    });
    content += '</ul></div>';
    
    showCustomModal('Incomplete Chapters', content);
};

// Bulk Add Videos
window.addAllVideos = async function() {
    const baseUrl = prompt('Enter base YouTube URL (chapters will be appended):\nExample: https://youtube.com/playlist?list=');
    if (!baseUrl) return;
    
    const confirmed = await showConfirmDialog(
        'Bulk Add Videos?',
        `Add "${baseUrl}" to all chapters without videos?`
    );
    
    if (!confirmed) return;
    
    const promises = [];
    let count = 0;
    
    allChapters.forEach((chapter) => {
        if (!chapter.videoLink?.trim()) {
            chapter.videoLink = baseUrl;
            count++;
            promises.push(
                fetch(`${API_URL}/${chapter._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(chapter)
                })
            );
        }
    });
    
    await Promise.all(promises);
    await showSuccessAnimation(
        'Videos Added!',
        `Updated ${count} chapter${count > 1 ? 's' : ''} with video links.`
    );
    loadChapters();
};

// Bulk Add Notes
window.addAllNotes = async function() {
    const baseUrl = prompt('Enter base Notes URL:\nExample: https://drive.google.com/drive/folders/');
    if (!baseUrl) return;
    
    const confirmed = await showConfirmDialog(
        'Bulk Add Notes?',
        `Add "${baseUrl}" to all chapters without notes?`
    );
    
    if (!confirmed) return;
    
    const promises = [];
    let count = 0;
    
    allChapters.forEach((chapter) => {
        if (!chapter.notesLink?.trim()) {
            chapter.notesLink = baseUrl;
            count++;
            promises.push(
                fetch(`${API_URL}/${chapter._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(chapter)
                })
            );
        }
    });
    
    await Promise.all(promises);
    await showSuccessAnimation(
        'Notes Added!',
        `Updated ${count} chapter${count > 1 ? 's' : ''} with notes links.`
    );
    loadChapters();
};

// Duplicate Chapter
window.duplicateChapter = function() {
    if (selectedChapters.size !== 1) {
        showNotification('Please select exactly one chapter to duplicate', 'error');
        return;
    }
    
    const id = Array.from(selectedChapters)[0];
    const chapter = allChapters.find(c => c._id === id);
    
    if (chapter) {
        const newChapter = { ...chapter };
        delete newChapter._id;
        newChapter.title = chapter.title + ' (Copy)';
        newChapter.chapterNumber = chapter.chapterNumber + 0.5;
        
        document.getElementById('modal-title').textContent = 'Duplicate Chapter';
        document.getElementById('chapterId').value = '';
        document.getElementById('title').value = newChapter.title;
        document.getElementById('chapterNumber').value = newChapter.chapterNumber;
        document.getElementById('classNumber').value = newChapter.classNumber;
        document.getElementById('unitName').value = newChapter.unitName;
        document.getElementById('videoLink').value = newChapter.videoLink || '';
        document.getElementById('notesLink').value = newChapter.notesLink || '';
        document.getElementById('questionsLink').value = newChapter.questionsLink || '';
        openModal();
    }
};

// Reorder Chapters
window.reorderChapters = function() {
    const cycle = prompt('Which cycle to reorder? Enter "9" for Chemistry or "10" for Physics:');
    if (cycle !== '9' && cycle !== '10') return;
    
    const chapters = allChapters.filter(c => c.classNumber === parseInt(cycle))
        .sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    let content = '<div class="reorder-list"><h3>Drag to Reorder</h3><ul id="sortable-list">';
    chapters.forEach((c, idx) => {
        content += `<li draggable="true" data-id="${c._id}">
            <i class="fas fa-grip-vertical"></i> ${idx + 1}. ${c.title}
        </li>`;
    });
    content += '</ul><button onclick="saveNewOrder()" class="admin-btn">Save New Order</button></div>';
    
    showCustomModal('Reorder Chapters', content);
    initDragAndDrop();
};

// Activity Log
window.showActivityLog = function() {
    const recentActivity = [
        { action: 'Created', chapter: 'Last created chapter', time: 'Just now' },
        { action: 'Updated', chapter: 'Last updated chapter', time: '5 mins ago' },
        { action: 'Deleted', chapter: 'Deleted chapter', time: '1 hour ago' }
    ];
    
    let content = '<div class="activity-log"><h3>Recent Activity</h3>';
    content += '<p><em>Activity logging will track all chapter modifications</em></p>';
    content += '<ul>';
    recentActivity.forEach(activity => {
        content += `<li>
            <strong>${activity.action}</strong>: ${activity.chapter}
            <br><small>${activity.time}</small>
        </li>`;
    });
    content += '</ul></div>';
    
    showCustomModal('Activity Log', content);
};

// Custom Modal
function showCustomModal(title, content) {
    const modal = document.getElementById('preview-modal');
    const modalContent = document.getElementById('preview-content');
    
    modalContent.innerHTML = `<h2>${title}</h2>${content}`;
    modal.style.display = 'block';
}

// Drag and Drop for Reordering
function initDragAndDrop() {
    const list = document.getElementById('sortable-list');
    if (!list) return;
    
    let draggedElement = null;
    
    list.querySelectorAll('li').forEach(item => {
        item.addEventListener('dragstart', function() {
            draggedElement = this;
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedElement !== this) {
                const allItems = Array.from(list.querySelectorAll('li'));
                const draggedIndex = allItems.indexOf(draggedElement);
                const targetIndex = allItems.indexOf(this);
                
                if (draggedIndex < targetIndex) {
                    this.parentNode.insertBefore(draggedElement, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedElement, this);
                }
            }
        });
    });
}

window.saveNewOrder = async function() {
    const items = document.querySelectorAll('#sortable-list li');
    const promises = [];
    
    items.forEach((item, index) => {
        const id = item.dataset.id;
        const chapter = allChapters.find(c => c._id === id);
        if (chapter) {
            chapter.chapterNumber = index + 1;
            promises.push(
                fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(chapter)
                })
            );
        }
    });
    
    await Promise.all(promises);
    closePreviewModal();
    await showSuccessAnimation('Order Updated!', 'Chapter order has been successfully saved.');
    loadChapters();
};

// Custom Success Animation
function showSuccessAnimation(title, message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <div class="success-message">${title}</div>
                <div class="success-description">${message}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                document.body.removeChild(modal);
                resolve();
            }, 300);
        }, 2000);
    });
}

// Custom Confirm Dialog
function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'confirm-dialog';
        modal.innerHTML = `
            <div class="confirm-dialog-content">
                <div class="confirm-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="confirm-title">${title}</div>
                <div class="confirm-message">${message}</div>
                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-btn-no">Cancel</button>
                    <button class="confirm-btn confirm-btn-yes">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const yesBtn = modal.querySelector('.confirm-btn-yes');
        const noBtn = modal.querySelector('.confirm-btn-no');
        
        yesBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
        
        noBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        });
    });
}

// ========== SYLLABUS LINK MANAGEMENT ==========
function loadSyllabusLinks() {
    const chemistryLink = localStorage.getItem('syllabusLink-chemistry');
    const physicsLink = localStorage.getItem('syllabusLink-physics');
    
    if (chemistryLink) {
        document.getElementById('chemistry-syllabus-link').value = chemistryLink;
        updateSyllabusPreview('chemistry', chemistryLink);
    }
    
    if (physicsLink) {
        document.getElementById('physics-syllabus-link').value = physicsLink;
        updateSyllabusPreview('physics', physicsLink);
    }
}

window.saveSyllabusLink = function(cycle) {
    const inputId = `${cycle}-syllabus-link`;
    const input = document.getElementById(inputId);
    const url = input.value.trim();
    
    if (!url) {
        showNotification('Please enter a URL', 'error');
        return;
    }
    
    // Basic URL validation
    try {
        new URL(url);
    } catch (e) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem(`syllabusLink-${cycle}`, url);
    updateSyllabusPreview(cycle, url);
    showNotification(`${cycle.charAt(0).toUpperCase() + cycle.slice(1)} syllabus link saved successfully!`, 'success');
}

function updateSyllabusPreview(cycle, url) {
    const previewId = `${cycle}-preview`;
    const preview = document.getElementById(previewId);
    
    if (url) {
        preview.innerHTML = `<strong>Current Link:</strong> <a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> ${url}</a>`;
        preview.style.display = 'block';
    } else {
        preview.innerHTML = '';
        preview.style.display = 'none';
    }
}

// ========== ANALYTICS TAB FUNCTIONALITY ==========

const ANALYTICS_API_URL = 'http://localhost:3000/api/analytics';
let currentPageAnalytics = 1;
let currentSortAnalytics = 'lastLogin-desc';

// Tab Switching - Setup function called after login
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Load analytics data when analytics tab is opened
            if (targetTab === 'analytics') {
                loadAnalyticsData();
            }
        });
    });
    
    // Setup analytics controls
    setupAnalyticsControls();
}

function setupAnalyticsControls() {
    const searchInput = document.getElementById('user-search-input');
    const sortFilter = document.getElementById('user-sort-filter');
    const refreshBtn = document.getElementById('refresh-analytics-btn');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPageAnalytics = 1;
                loadUsersList(1, e.target.value, currentSortAnalytics);
            }, 500);
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentSortAnalytics = e.target.value;
            currentPageAnalytics = 1;
            const searchValue = document.getElementById('user-search-input').value;
            loadUsersList(1, searchValue, currentSortAnalytics);
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadAnalyticsData();
            showNotification('Analytics data refreshed', 'success');
        });
    }
}

// Load Analytics Overview
async function loadAnalyticsData() {
    try {
        const response = await fetch(`${ANALYTICS_API_URL}/overview`);
        const data = await response.json();
        
        if (data.success) {
            updateAnalyticsStats(data.data);
        }
        
        // Load users list
        loadUsersList();
    } catch (error) {
        console.error('Error loading analytics:', error);
        showNotification('Failed to load analytics data', 'error');
    }
}

function updateAnalyticsStats(data) {
    document.getElementById('total-users-count').textContent = data.totalUsers;
    document.getElementById('new-users-week').textContent = data.newUsersThisWeek;
    document.getElementById('active-today').textContent = data.activeToday;
    document.getElementById('active-week').textContent = data.activeThisWeek;
}

// Load Users List
async function loadUsersList(page = 1, search = '', sort = currentSortAnalytics) {
    try {
        const [sortBy, order] = sort.split('-');
        const response = await fetch(
            `${ANALYTICS_API_URL}/users?page=${page}&limit=20&sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
        );
        const data = await response.json();
        
        if (data.success) {
            renderUsersTable(data.data.users);
            renderPagination(data.data.pagination);
            document.getElementById('users-count-display').textContent = 
                `${data.data.pagination.totalUsers} user${data.data.pagination.totalUsers !== 1 ? 's' : ''}`;
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Failed to load users list', 'error');
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="5">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const registeredDate = new Date(user.createdAt);
        const lastLoginDate = new Date(user.lastLogin);
        const now = new Date();
        const daysSinceLogin = Math.floor((now - lastLoginDate) / (1000 * 60 * 60 * 24));
        
        let loginBadgeClass = 'time-badge';
        if (daysSinceLogin === 0) loginBadgeClass += ' recent';
        else if (daysSinceLogin > 7) loginBadgeClass += ' old';
        
        // Optimize Google profile images - use smaller size
        const optimizedPicture = user.picture ? 
            user.picture.replace('=s96-c', '=s48-c').replace('s96-c', 's48-c') : 
            '../../assets/images/my_logo.png';
        
        return `
            <tr>
                <td style="text-align: center;">
                    <img src="${optimizedPicture}" 
                         alt="${escapeHtml(user.name)}" 
                         class="user-profile-img"
                         loading="lazy"
                         onerror="this.src='../../assets/images/my_logo.png'">
                </td>
                <td><strong>${escapeHtml(user.name)}</strong></td>
                <td><span class="user-email-badge">${escapeHtml(user.email)}</span></td>
                <td>${registeredDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td><span class="${loginBadgeClass}">${formatTimeSince(lastLoginDate)}</span></td>
            </tr>
        `;
    }).join('');
}

function renderPagination(pagination) {
    const container = document.getElementById('user-pagination');
    
    container.innerHTML = `
        <button onclick="changePage(${pagination.currentPage - 1})" 
                ${pagination.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
        <span class="page-info">
            Page ${pagination.currentPage} of ${pagination.totalPages}
        </span>
        <button onclick="changePage(${pagination.currentPage + 1})" 
                ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    currentPageAnalytics = pagination.currentPage;
}

function changePage(page) {
    if (page < 1) return;
    const searchValue = document.getElementById('user-search-input').value;
    loadUsersList(page, searchValue, currentSortAnalytics);
}

function formatTimeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
