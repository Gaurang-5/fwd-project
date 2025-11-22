// js/main.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- ACCORDION LOGIC ---
    // This function sets up the click events for the accordion headers
    function initializeAccordion() {
        const accordionHeaders = document.querySelectorAll(".accordion-header");
        accordionHeaders.forEach(header => {
            header.addEventListener("click", function() {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
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
        const API_URL = 'http://localhost:3000/api/chapters';
        try {
            const response = await fetch(API_URL);
            const allChapters = await response.json();

            // Filter chapters for the current class and group them by unit
            const chaptersByUnit = allChapters
                .filter(chapter => chapter.classNumber == classNum)
                .reduce((acc, chapter) => {
                    (acc[chapter.unitName] = acc[chapter.unitName] || []).push(chapter);
                    return acc;
                }, {});

            accordionContainer.innerHTML = ''; // Clear the "Loading..." message

            // Build the HTML for each unit accordion
            for (const unitName in chaptersByUnit) {
                const chapters = chaptersByUnit[unitName];
                
                const tableRows = chapters.map(chapter => `
                    <div class="table-row">
                        <span class="chapter-number">${chapter.chapterNumber}</span>
                        <span class="chapter-name">${chapter.title}</span>
                        <a href="${chapter.notesLink || '#'}" target="_blank" title="Notes" class="chapter-links-item"><i class="fas fa-file-pdf"></i></a>
                        <a href="${chapter.questionsLink || '#'}" target="_blank" title="Questions" class="chapter-links-item"><i class="fas fa-circle-question"></i></a>
                        <a href="${chapter.videoLink || '#'}" title="Video" class="chapter-links-item"><i class="fab fa-youtube"></i></a>
                    </div>
                `).join('');

                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                accordionItem.innerHTML = `
                    <button class="accordion-header"><span>${unitName}</span><span class="arrow">▼</span></button>
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
                accordionContainer.appendChild(accordionItem);
            }

            initializeAccordion(); // Re-initialize accordion functionality for the new elements

        } catch (error) {
            console.error('Failed to load chapters:', error);
            accordionContainer.innerHTML = '<p>Error: Could not load chapters. Please ensure the backend server is running.</p>';
        }
    }
});