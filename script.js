/* ==========================================================================
   Surya's Portfolio Javascript
   Functional Interactivity & Dynamic Aesthetics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Menu Toggle ---
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navLinksContainer) {
        mobileNavToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            
            // Toggle menu icon
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                const currentIconName = icon.getAttribute('data-lucide');
                if (currentIconName === 'menu') {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // --- Dynamic Typing Text Animation ---
    const typingTextElement = document.getElementById('typing-text');
    const roles = ["Software Developer", "AI & ML Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing
        }

        // Handle word completions
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextElement) {
        setTimeout(type, 1000);
    }

    // --- Scroll-Based Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold to match navbar height
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Toast Notification Utility ---
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message, duration = 3000) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('i');
            
            // Set loading state
            submitBtn.disabled = true;
            submitText.textContent = "Sending...";
            if (submitIcon) {
                submitIcon.setAttribute('data-lucide', 'loader-2');
                submitIcon.classList.add('spin-animation'); // Custom spin class if needed
                lucide.createIcons();
            }

            // Simulate server response delay (1.5 seconds)
            setTimeout(() => {
                // Restore submit button state
                submitBtn.disabled = false;
                submitText.textContent = "Send Message";
                if (submitIcon) {
                    submitIcon.setAttribute('data-lucide', 'send');
                    submitIcon.classList.remove('spin-animation');
                    lucide.createIcons();
                }
                
                // Show success feedback
                showToast("Thank you, Surya will receive your message soon!");
                contactForm.reset();
            }, 1500);
        });
    }

    // --- Copy to Clipboard Feature (Generic for all elements with .copyable) ---
    const copyableCards = document.querySelectorAll('.copyable');
    
    copyableCards.forEach(card => {
        card.addEventListener('click', () => {
            const textToCopy = card.getAttribute('data-copy');
            const labelText = card.querySelector('.label') ? card.querySelector('.label').textContent : "Value";
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showToast(`${labelText} copied to clipboard!`);
                        
                        // Temporarily update tooltip text
                        const tooltip = card.querySelector('.tooltip-text');
                        if (tooltip) {
                            const originalText = tooltip.textContent;
                            tooltip.textContent = "Copied!";
                            setTimeout(() => {
                                tooltip.textContent = originalText;
                            }, 2000);
                        }
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        showToast(`Could not copy ${labelText.toLowerCase()} automatically.`);
                    });
            } else {
                // Fallback copy logic
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast(`${labelText} copied to clipboard!`);
                } catch (err) {
                    showToast(`Could not copy ${labelText.toLowerCase()} automatically.`);
                }
                document.body.removeChild(textArea);
            }
        });
    });

    // --- Mock Resume Download Helper ---
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            showToast("Generating and downloading CV...");
            
            // Create a fake/mock PDF data block
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9Db250ZW50cyA0IDAgUgogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+CiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDY1ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNTAgNzAwIFRkCihTdXJ5YSdzIFJlc3VtZSAtIFBsYWNlaG9sZGVyKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDgwIDAwMDAwIG4gCjAwMDAwMDAxNDUgMA==';
                link.download = 'Surya_Prasath_S_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast("Resume downloaded successfully!");
            }, 1000);
        });
    }
});
