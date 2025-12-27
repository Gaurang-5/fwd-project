// main.js - Optimized version

(function() {
    'use strict';
    
    const CONFIG = {
        API_URL: 'http://localhost:3000/api/chapters',
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    };
    
    let chaptersCache = null;
    let cacheTimestamp = null;
    
    // --- MOBILE MENU ---
    function initializeMobileMenu() {
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
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize (if going to desktop)
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 100));
    }
    
    // --- UTILITY FUNCTIONS ---
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
    const showError = (container, message) => {
        container.innerHTML = `
            <div class="error-message" style="padding: 20px; text-align: center; color: #721c24; background: #f8d7da; border-radius: 8px; margin: 20px 0;">
                <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
        `;
    };
    
    const showLoading = (container) => {
        container.innerHTML = '<div class="loading" style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i><p>Loading chapters...</p></div>';
    };

    // --- ACCORDION LOGIC ---
    function initializeAccordion() {
        const accordionHeaders = document.querySelectorAll(".accordion-header");
        
        accordionHeaders.forEach(header => {
            header.addEventListener("click", function() {
                const isActive = this.classList.contains("active");
                
                // Close all other accordions (optional: remove for multi-open)
                document.querySelectorAll(".accordion-header.active").forEach(h => {
                    if (h !== this) {
                        h.classList.remove("active");
                        h.nextElementSibling.style.maxHeight = null;
                    }
                });
                
                // Toggle current
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                
                if (isActive) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }
    
    // --- DYNAMIC CHAPTER LOADING ---
    const accordionContainer = document.getElementById('chapter-accordion');
    const scriptTag = document.querySelector('script[data-class]');
    
    if (accordionContainer && scriptTag) {
        const classNumber = scriptTag.getAttribute('data-class');
        loadChaptersForClass(classNumber);
    }

    async function loadChaptersForClass(classNum) {
        if (!classNum || !accordionContainer) return;
        
        showLoading(accordionContainer);
        
        try {
            // Check cache first
            const now = Date.now();
            if (chaptersCache && cacheTimestamp && (now - cacheTimestamp) < CONFIG.CACHE_DURATION) {
                renderChapters(chaptersCache, classNum);
                return;
            }
            
            const response = await fetch(`${CONFIG.API_URL}?classNumber=${classNum}`, {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                // User is not authenticated
                accordionContainer.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #e03669 0%, #3d5a80 100%); border-radius: 12px; color: white; margin: 40px 0;">
                        <i class="fas fa-lock" style="font-size: 64px; margin-bottom: 20px; opacity: 0.9;"></i>
                        <h2 style="margin-bottom: 15px; font-size: 28px;">Login Required</h2>
                        <p style="margin-bottom: 30px; font-size: 18px; opacity: 0.95;">Please login with your BMSCE email (@bmsce.ac.in) to access the course materials.</p>
                        <a href="login.html" style="display: inline-block; padding: 15px 40px; background: white; color: #e03669; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: transform 0.2s;">Login Now</a>
                    </div>
                `;
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const allChapters = data.data || data; // Handle both response formats
            
            // Cache the results
            chaptersCache = allChapters;
            cacheTimestamp = now;
            
            renderChapters(allChapters, classNum);
            
        } catch (error) {
            console.error('Failed to load chapters:', error);
            showError(accordionContainer, 'Could not load chapters. Please ensure the backend server is running and try again.');
        }
    }
    
    function renderChapters(allChapters, classNum) {
        // Filter and group chapters by unit
        const chaptersByUnit = allChapters
            .filter(chapter => chapter.classNumber == classNum)
            .reduce((acc, chapter) => {
                (acc[chapter.unitName] = acc[chapter.unitName] || []).push(chapter);
                return acc;
            }, {});
        
        if (Object.keys(chaptersByUnit).length === 0) {
            showError(accordionContainer, `No chapters found for class ${classNum}.`);
            return;
        }
        
        // Create DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Build the HTML for each unit accordion
        Object.entries(chaptersByUnit).forEach(([unitName, chapters]) => {
            const tableRows = chapters
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map(chapter => `
                    <div class="table-row">
                        <span class="chapter-number">${escapeHtml(chapter.chapterNumber.toString())}</span>
                        <span class="chapter-name">${escapeHtml(chapter.title)}</span>
                        <a href="${escapeHtml(chapter.notesLink || '#')}" 
                           ${chapter.notesLink ? 'target="_blank" rel="noopener noreferrer"' : 'onclick="return false;"'} 
                           title="${chapter.notesLink ? 'View Notes' : 'Notes not available'}" 
                           class="chapter-links-item ${!chapter.notesLink ? 'disabled' : ''}">
                            <i class="fas fa-file-pdf"></i>
                        </a>
                        <a href="${escapeHtml(chapter.questionsLink || '#')}" 
                           ${chapter.questionsLink ? 'target="_blank" rel="noopener noreferrer"' : 'onclick="return false;"'} 
                           title="${chapter.questionsLink ? 'View Questions' : 'Questions not available'}" 
                           class="chapter-links-item ${!chapter.questionsLink ? 'disabled' : ''}">
                            <i class="fas fa-circle-question"></i>
                        </a>
                        <a href="${escapeHtml(chapter.videoLink || '#')}" 
                           ${chapter.videoLink ? 'target="_blank" rel="noopener noreferrer"' : 'onclick="return false;"'} 
                           title="${chapter.videoLink ? 'Watch Video' : 'Video not available'}" 
                           class="chapter-links-item ${!chapter.videoLink ? 'disabled' : ''}">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                `).join('');
            
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.innerHTML = `
                <button class="accordion-header" aria-expanded="false">
                    <span>${escapeHtml(unitName)}</span>
                    <span class="arrow" aria-hidden="true">▼</span>
                </button>
                <div class="accordion-content">
                    <div class="chapter-table">
                        <div class="table-header">
                            <span>#</span>
                            <span>Module Name</span>
                            <span>Notes</span>
                            <span>Questions</span>
                            <span>Video</span>
                        </div>
                        ${tableRows}
                    </div>
                </div>
            `;
            fragment.appendChild(accordionItem);
        });
        
        accordionContainer.innerHTML = '';
        accordionContainer.appendChild(fragment);
        initializeAccordion();
    }
    
    // Security: Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // --- SYLLABUS LINK LOADING ---
    function loadSyllabusLink() {
        const syllabusBar = document.querySelector('.syllabus-bar');
        if (!syllabusBar) {
            console.log('Syllabus bar not found');
            return;
        }
        
        const scriptTag = document.querySelector('script[data-class]');
        if (!scriptTag) {
            console.log('Script tag with data-class not found');
            return;
        }
        
        const classNumber = scriptTag.getAttribute('data-class');
        const cycle = classNumber === '9' ? 'chemistry' : 'physics';
        const syllabusLink = localStorage.getItem(`syllabusLink-${cycle}`);
        
        console.log(`Class ${classNumber}, Cycle: ${cycle}, Link: ${syllabusLink}`);
        
        if (syllabusLink && syllabusLink.trim() !== '') {
            syllabusBar.href = syllabusLink;
            syllabusBar.target = '_blank';
            syllabusBar.rel = 'noopener noreferrer';
            syllabusBar.style.opacity = '1';
            syllabusBar.style.cursor = 'pointer';
            console.log('Syllabus link set to:', syllabusLink);
        } else {
            // If no link is set, disable or hide the button
            syllabusBar.href = '#';
            syllabusBar.style.opacity = '0.5';
            syllabusBar.style.cursor = 'not-allowed';
            syllabusBar.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Syllabus PDF link has not been configured yet. Please contact the administrator.');
            });
            console.log('No syllabus link configured');
        }
    }
    
    // Initialize everything on page load
    function init() {
        initializeMobileMenu();
        loadSyllabusLink();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();