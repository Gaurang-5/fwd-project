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

            // Simulate form submission
            // In a real application, you would send this data to a server
            showMessage('Sending your message...', 'info');

            // Simulate server delay
            setTimeout(() => {
                // Success message
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                contactForm.reset();

                // You can uncomment this to actually send data to a backend
                // sendToBackend(formData);
            }, 1500);
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
