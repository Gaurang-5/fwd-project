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

    // --- API FUNCTIONS ---
    async function loadChapters() {
        try {
            const response = await fetch(API_URL);
            const chapters = await response.json();
            
            chaptersTbody10.innerHTML = '';
            chaptersTbody9.innerHTML = '';

            chapters.forEach(chapter => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${chapter.chapterNumber}</td>
                    <td>${chapter.title}</td>
                    <td>${chapter.unitName}</td>
                    <td>
                        <i class="fas fa-edit btn-edit" data-id="${chapter._id}"></i>
                        <i class="fas fa-trash btn-delete" data-id="${chapter._id}"></i>
                    </td>
                `;
                if (chapter.classNumber === 10) {
                    chaptersTbody10.appendChild(row);
                } else if (chapter.classNumber === 9) {
                    chaptersTbody9.appendChild(row);
                }
            });
        } catch (error) {
            console.error('Error loading chapters:', error);
        }
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
                alert(`Chapter ${isEditing ? 'updated' : 'added'} successfully!`);
                closeModal();
                loadChapters();
            } else {
                alert('Failed to save chapter.');
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

        if (e.target.classList.contains('btn-delete')) {
            if (confirm('Are you sure you want to delete this chapter?')) {
                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        alert('Chapter deleted successfully!');
                        loadChapters();
                    } else {
                        alert('Failed to delete chapter.');
                    }
                } catch (error) {
                    console.error('Error deleting chapter:', error);
                }
            }
        }
    });
});