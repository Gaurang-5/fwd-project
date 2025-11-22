// admin/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const passwordPrompt = document.getElementById('password-prompt');
    const mainContent = document.getElementById('main-content');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const chaptersTbody10 = document.getElementById('chapters-tbody-10');
    const chaptersTbody9 = document.getElementById('chapters-tbody-9');
    const createNewBtn = document.getElementById('create-new-btn');
    const loginHeader = document.getElementById('login-header'); // Get the login header
    
    // Modal elements
    const modal = document.getElementById('chapter-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const chapterForm = document.getElementById('chapter-form');
    
    // --- CREDENTIALS ---
    const ADMIN_USERNAME = "teacher"; // Set your desired username
    const ADMIN_PASSWORD = "pass123"; // CHANGE THIS

    const API_URL = 'http://localhost:3000/api/chapters';

    // --- LOGIN ---
    loginBtn.addEventListener('click', () => {
        if (usernameInput.value === ADMIN_USERNAME && passwordInput.value === ADMIN_PASSWORD) {
            // Hide login elements
            passwordPrompt.style.display = 'none';
            if (loginHeader) loginHeader.style.display = 'none';
            document.querySelector('#particles-js').style.display = 'none';

            // Show main content and change body class for proper styling
            mainContent.style.display = 'block';
            document.body.className = 'admin-dashboard-page';
            loadChapters();
        } else {
            alert('Incorrect username or password!');
        }
    });

    // --- MODAL HANDLING ---
    const openModal = () => modal.style.display = 'block';
    const closeModal = () => modal.style.display = 'none';

    createNewBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Create New Chapter';
        chapterForm.reset();
        document.getElementById('chapterId').value = '';
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    // --- SEARCH AND FILTER ---
    const searchInput = document.getElementById('search-input');
    const classFilter = document.getElementById('class-filter');
    let allChapters = [];

    searchInput?.addEventListener('input', filterChapters);
    classFilter?.addEventListener('change', filterChapters);

    function filterChapters() {
        const searchTerm = searchInput.value.toLowerCase();
        const classValue = classFilter.value;
        
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
        const class10Section = document.getElementById('class-10-section');
        const class9Section = document.getElementById('class-9-section');
        
        if (classValue === '10') {
            class10Section.style.display = 'block';
            class9Section.style.display = 'none';
        } else if (classValue === '9') {
            class10Section.style.display = 'none';
            class9Section.style.display = 'block';
        } else {
            class10Section.style.display = 'block';
            class9Section.style.display = 'block';
        }
    }

    // --- API FUNCTIONS ---
    async function loadChapters() {
        try {
            const response = await fetch(API_URL);
            allChapters = await response.json();
            renderChapters(allChapters);
            updateStats(allChapters);
        } catch (error) {
            console.error('Error loading chapters:', error);
            showNotification('Failed to load chapters', 'error');
        }
    }

    function renderChapters(chapters) {
        chaptersTbody10.innerHTML = '';
        chaptersTbody9.innerHTML = '';
        
        let count10 = 0;
        let count9 = 0;

        chapters.forEach(chapter => {
            const hasVideo = chapter.videoLink && chapter.videoLink.trim() !== '';
            const hasNotes = chapter.notesLink && chapter.notesLink.trim() !== '';
            const hasQuestions = chapter.questionsLink && chapter.questionsLink.trim() !== '';
            
            const resourceBadges = `
                ${hasVideo ? '<span class="resource-badge video"><i class="fas fa-video"></i></span>' : '<span class="resource-badge empty"><i class="fas fa-video"></i></span>'}
                ${hasNotes ? '<span class="resource-badge notes"><i class="fas fa-file-pdf"></i></span>' : '<span class="resource-badge empty"><i class="fas fa-file-pdf"></i></span>'}
                ${hasQuestions ? '<span class="resource-badge questions"><i class="fas fa-question-circle"></i></span>' : '<span class="resource-badge empty"><i class="fas fa-question-circle"></i></span>'}
            `;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="chapter-number">${chapter.chapterNumber}</span></td>
                <td><strong>${chapter.title}</strong></td>
                <td><span class="unit-badge">${chapter.unitName}</span></td>
                <td class="resources-cell">${resourceBadges}</td>
                <td class="actions-cell">
                    <button class="icon-btn edit-btn btn-edit" data-id="${chapter._id}" title="Edit Chapter">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn delete-btn btn-delete" data-id="${chapter._id}" title="Delete Chapter">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            if (chapter.classNumber === 10) {
                chaptersTbody10.appendChild(row);
                count10++;
            } else if (chapter.classNumber === 9) {
                chaptersTbody9.appendChild(row);
                count9++;
            }
        });

        // Update chapter counts
        document.getElementById('count-10').textContent = `${count10} chapter${count10 !== 1 ? 's' : ''}`;
        document.getElementById('count-9').textContent = `${count9} chapter${count9 !== 1 ? 's' : ''}`;
        
        // Show empty state if no chapters
        if (count10 === 0) {
            chaptersTbody10.innerHTML = '<tr><td colspan="5" class="empty-state">No chapters found</td></tr>';
        }
        if (count9 === 0) {
            chaptersTbody9.innerHTML = '<tr><td colspan="5" class="empty-state">No chapters found</td></tr>';
        }
    }

    function updateStats(chapters) {
        const total = chapters.length;
        const physics = chapters.filter(c => c.classNumber === 10).length;
        const chemistry = chapters.filter(c => c.classNumber === 9).length;
        
        document.getElementById('total-chapters').textContent = total;
        document.getElementById('physics-count').textContent = physics;
        document.getElementById('chemistry-count').textContent = chemistry;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Handle form submission (Create or Update)
    chapterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('chapterId').value;
        const isEditing = id !== '';
        
        const chapterData = {
            title: document.getElementById('title').value,
            chapterNumber: document.getElementById('chapterNumber').value,
            classNumber: document.getElementById('classNumber').value,
            unitName: document.getElementById('unitName').value,
            videoLink: document.getElementById('videoLink').value,
            notesLink: document.getElementById('notesLink').value,
            questionsLink: document.getElementById('questionsLink').value,
        };

        try {
            const response = await fetch(isEditing ? `${API_URL}/${id}` : API_URL, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chapterData),
            });

            if (response.ok) {
                showNotification(`Chapter ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
                closeModal();
                loadChapters();
            } else {
                showNotification('Failed to save chapter', 'error');
            }
        } catch (error) {
            console.error('Error saving chapter:', error);
        }
    });

    // Event delegation for Edit and Delete buttons
    document.body.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('btn-edit')) {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const chapter = await response.json();
                
                modalTitle.textContent = 'Edit Chapter';
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
                console.error('Error fetching chapter for edit:', error);
            }
        }

        if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
            const button = e.target.classList.contains('btn-delete') ? e.target : e.target.closest('.btn-delete');
            const deleteId = button.dataset.id;
            
            if (confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
                try {
                    const response = await fetch(`${API_URL}/${deleteId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        showNotification('Chapter deleted successfully!', 'success');
                        loadChapters();
                    } else {
                        showNotification('Failed to delete chapter', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting chapter:', error);
                    showNotification('Error deleting chapter', 'error');
                }
            }
        }
    });
});