document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Enhanced Smooth scroll for anchor links with offset
    const navHeight = document.querySelector('.navbar').offsetHeight;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                navMenu?.classList.remove('active');
                
                // Calculate scroll position with offset for fixed header
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll spy for navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + navHeight + 100; // Add some offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    // Update active nav link on page load
    updateActiveNavLink();

    // Promotional Slider
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;

    // Initialize slider
    function initSlider() {
        if (!sliderWrapper) return;
        
        updateSlider();
        startAutoSlide();

        // Event listeners for navigation
        prevBtn?.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
            resetAutoSlide();
        });

        nextBtn?.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
            resetAutoSlide();
        });

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                resetAutoSlide();
            });
        });

        // Pause auto-slide on hover
        sliderWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left
                    currentSlide = (currentSlide + 1) % slides.length;
                } else {
                    // Swipe right
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                }
                updateSlider();
                resetAutoSlide();
            }
        }
    }

    function updateSlider() {
        const offset = -currentSlide * 100;
        sliderWrapper.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000); // Change slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Initialize slider if it exists
    initSlider();

    // Promotion Navigation
    const promoButtons = document.querySelectorAll('.nav-btn');
    promoButtons.forEach(button => {
        button.addEventListener('click', () => {
            promoButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Here you would typically handle loading different content
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !email.includes('@')) {
                showError('Please enter a valid email address.');
                return;
            }

            try {
                const response = await fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    showError('Thank you for subscribing!', 2000); // Using error popup as success message
                    newsletterForm.reset();
                } else {
                    showError('Failed to subscribe. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Something went wrong. Please try again.');
            }
        });
    }

    // Close dropdown menu when clicking a link
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.textContent.toLowerCase();
                let hasVisibleCards = false;

                projectCards.forEach(card => {
                    const cardCategories = card.dataset.category?.split(',') || [];
                    
                    if (category === 'all' || cardCategories.includes(category)) {
                        card.classList.remove('hidden');
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        hasVisibleCards = true;
                    } else {
                        card.classList.add('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                    }
                });

                if (!hasVisibleCards) {
                    showError('No projects found in this category.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Error filtering projects. Please try again.');
            }
        });
    });

    // Contact Form Popup Functionality
    const contactPopup = document.getElementById('contactPopup');
    const successPopup = document.getElementById('successPopup');
    const contactForm = document.getElementById('contactForm');
    const closeButtons = document.querySelectorAll('.close-popup');
    
    // Function to reset form state completely
    function resetFormState() {
        if (contactForm) {
            // Reset the form fields
            contactForm.reset();
            
            // Reset validation styles and error messages
            const errorDivs = contactForm.querySelectorAll('.field-error');
            errorDivs.forEach(div => {
                div.style.display = 'none';
            });

            // Reset input border colors
            const formInputs = contactForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.style.borderColor = '#ddd';
            });
        }
    }
    
    // Open contact popup when clicking Contact Us in nav
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            resetFormState(); // Reset form when opening
            openPopup(contactPopup);
        });
    });

    // Close popup when clicking the close button or outside the popup
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup-overlay');
            if (popup) {
                if (popup === contactPopup) {
                    resetFormState(); // Reset form when closing
                }
                closePopup(popup);
            }
        });
    });

    [contactPopup, successPopup].forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                if (popup === contactPopup) {
                    resetFormState(); // Reset form when clicking outside
                }
                closePopup(popup);
            }
        });
    });

    // Contact Form Validation
    if (contactForm) {
        const formFields = {
            firstName: {
                element: document.getElementById('firstName'),
                validate: (value) => {
                    if (!value) return 'First name is required';
                    if (value.length < 2) return 'First name must be at least 2 characters';
                    if (!/^[a-zA-Z\s-']+$/.test(value)) return 'First name can only contain letters, spaces, hyphens and apostrophes';
                    return '';
                }
            },
            lastName: {
                element: document.getElementById('lastName'),
                validate: (value) => {
                    if (!value) return 'Last name is required';
                    if (value.length < 2) return 'Last name must be at least 2 characters';
                    if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens and apostrophes';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                validate: (value) => {
                    if (!value) return 'Email is required';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                    return '';
                }
            },
            phone: {
                element: document.getElementById('phone'),
                validate: (value) => {
                    if (!value) return 'Phone number is required';
                    // Allow +, spaces, (), and numbers
                    if (!/^[\d\s()+]+$/.test(value)) return 'Please enter a valid phone number';
                    // Remove all non-digits and check length
                    const digits = value.replace(/\D/g, '');
                    if (digits.length < 8 || digits.length > 15) return 'Phone number must be between 8 and 15 digits';
                    return '';
                }
            },
            location: {
                element: document.getElementById('location'),
                validate: (value) => {
                    if (!value) return 'Location is required';
                    if (value.length < 3) return 'Please enter a valid location';
                    return '';
                }
            },
            ownLand: {
                element: document.getElementById('ownLand'),
                validate: (value) => {
                    if (!value) return 'Please select your land ownership status';
                    return '';
                }
            }
        };

        // Add error display elements for each field
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            const parent = field.element.closest('.form-group');
            
            // Create error message element
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#e41e31';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.style.display = 'none';
            parent.appendChild(errorDiv);

            // Add real-time validation
            field.element.addEventListener('input', () => {
                validateField(fieldName);
            });

            field.element.addEventListener('blur', () => {
                validateField(fieldName);
            });
        });

        function validateField(fieldName) {
            const field = formFields[fieldName];
            const errorDiv = field.element.closest('.form-group').querySelector('.field-error');
            const error = field.validate(field.element.value.trim());

            if (error) {
                errorDiv.textContent = error;
                errorDiv.style.display = 'block';
                field.element.style.borderColor = '#e41e31';
                return false;
            } else {
                errorDiv.style.display = 'none';
                field.element.style.borderColor = '#ddd';
                return true;
            }
        }

        function validateForm() {
            let isValid = true;
            Object.keys(formFields).forEach(fieldName => {
                if (!validateField(fieldName)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        // Handle form submission with validations
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showError('Please correct the errors in the form.');
                return;
            }

            // Collect form data
            const formData = {
                firstName: formFields.firstName.element.value.trim(),
                lastName: formFields.lastName.element.value.trim(),
                email: formFields.email.element.value.trim(),
                phone: formFields.phone.element.value.trim(),
                location: formFields.location.element.value.trim(),
                ownLand: formFields.ownLand.element.value,
                additionalInfo: document.getElementById('additionalInfo').value.trim()
            };

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    closePopup(contactPopup);
                    resetFormState(); // Reset form after successful submission
                    openPopup(successPopup);
                    setTimeout(() => {
                        closePopup(successPopup);
                    }, 3000);
                } else {
                    showError(result.message || 'Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('An error occurred. Please try again later.');
            }
        });
    }

    // Error handling functions
    const errorPopup = document.getElementById('errorPopup');
    
    function showError(message, duration = 3000) {
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        openPopup(errorPopup);
        
        // Auto close after duration
        setTimeout(() => {
            closePopup(errorPopup);
        }, duration);
    }

    // Add error popup to close buttons
    document.querySelectorAll('.close-popup').forEach(button => {
        button.addEventListener('click', function() {
            const popup = this.closest('.popup-overlay');
            if (popup) {
                closePopup(popup);
            }
        });
    });

    // Handle unimplemented features
    const unimplementedFeatures = {
        '.social-links a': 'Social media integration coming soon!',
        '.nav-btn': 'This feature is currently under development.',
        '.project-link': 'Project details page coming soon!',
        '.service-card': 'Detailed service information coming soon!',
        '[href="#projects"]': 'Project gallery is under construction.',
        '[href="#testimonials"]': 'Testimonials section is being updated.',
        '.scroll-top': 'Smooth scrolling enhancement coming soon!'
    };

    // Add error handlers for unimplemented features
    Object.entries(unimplementedFeatures).forEach(([selector, message]) => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                showError(message);
            });
        });
    });
});

// Helper functions
function openPopup(popup) {
    if (!popup) return;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
}

function closePopup(popup) {
    if (!popup) return;
    popup.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
} 