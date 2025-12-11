// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value
            };

            // Simple validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Create mailto link with pre-filled data
            const recipient = 'support@bmsce.edu';
            const categoryText = formData.category ? ` (${formData.category})` : '';
            const emailSubject = encodeURIComponent(`${formData.subject}${categoryText}`);
            const emailBody = encodeURIComponent(
                `Name: ${formData.name}\n` +
                `Email: ${formData.email}\n` +
                `Category: ${formData.category || 'Not specified'}\n\n` +
                `Message:\n${formData.message}`
            );
            
            // Open user's email client with pre-filled data
            window.location.href = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;
            
            // Show success message
            showMessage('Opening your email client with the pre-filled message...', 'success');
            
            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Uncomment and modify this function to send data to your backend
    /*
    async function sendToBackend(formData) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
            console.error('Error:', error);
        }
    }
    */
});
