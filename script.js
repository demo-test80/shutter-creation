// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.portfolio-item, .service-item, .program-card, .testimonial, .style-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Portfolio hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Service cards hover effects
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
    });
});

// Program cards hover effects
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });
});

// Contact button interactions
document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-3px)';
        }, 100);
    });
});

// Form validation (if contact form is added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Testimonial slider functionality (if needed)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

// Auto-rotate testimonials (if in slider format)
function rotateTestimonials() {
    if (testimonials.length > 1) {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
}

// Initialize testimonial rotation (uncomment if slider is needed)
// setInterval(rotateTestimonials, 5000);

// Scroll to top functionality
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #f4d03f, #f39c12);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px)';
        scrollBtn.style.boxShadow = '0 6px 20px rgba(243, 156, 18, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 15px rgba(243, 156, 18, 0.3)';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTop);

// Preloader (optional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading states for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.href && this.href.includes('wa.me')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        }
    });
});

// Enhanced mobile menu experience
function enhanceMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize enhanced mobile menu
document.addEventListener('DOMContentLoaded', enhanceMobileMenu);

// Dynamic Image Management System
class WebsiteImageManager {
    constructor() {
        this.loadSavedImages();
        this.setupImageUpdateListener();
    }

    loadSavedImages() {
        const savedImages = localStorage.getItem('shutterCreationImages');
        if (savedImages) {
            const images = JSON.parse(savedImages);
            this.updatePageImages(images);
        }

        // Also check sessionStorage for real-time updates
        const sessionImages = sessionStorage.getItem('imageUpdates');
        if (sessionImages) {
            const images = JSON.parse(sessionImages);
            this.updatePageImages(images);
        }
    }

    updatePageImages(images) {
        // Update profile photo
        const profileImages = document.querySelectorAll('img[alt*="Mansur Khan"], img[alt*="Professional Photographer"]');
        profileImages.forEach(img => {
            if (images.profilePhoto) {
                img.src = images.profilePhoto;
            }
        });

        // Update logo
        const logoImages = document.querySelectorAll('.logo-img');
        logoImages.forEach(img => {
            if (images.logo) {
                img.src = images.logo;
                img.style.display = 'block';
            }
        });

        // Update portfolio images
        if (images.portfolio) {
            const portfolioImages = document.querySelectorAll('.portfolio-item img');
            portfolioImages.forEach((img, index) => {
                if (images.portfolio[index]) {
                    img.src = images.portfolio[index];
                }
            });
        }
    }

    setupImageUpdateListener() {
        // Listen for image updates from admin panel
        window.addEventListener('imagesUpdated', (event) => {
            this.updatePageImages(event.detail);
        });

        // Listen for storage changes (cross-tab updates)
        window.addEventListener('storage', (event) => {
            if (event.key === 'shutterCreationImages') {
                const images = JSON.parse(event.newValue);
                this.updatePageImages(images);
            }
        });
    }
}

// Initialize dynamic image management
const websiteImageManager = new WebsiteImageManager();

// Function to change any image dynamically
function changeImage(selector, newImageUrl) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        if (element.tagName === 'IMG') {
            element.src = newImageUrl;
        } else {
            element.style.backgroundImage = `url(${newImageUrl})`;
        }
    });
    
    // Save to localStorage for persistence
    const currentImages = JSON.parse(localStorage.getItem('shutterCreationImages') || '{}');
    
    // Determine which image type based on selector
    if (selector.includes('profile') || selector.includes('Mansur')) {
        currentImages.profilePhoto = newImageUrl;
    } else if (selector.includes('logo')) {
        currentImages.logo = newImageUrl;
    }
    
    localStorage.setItem('shutterCreationImages', JSON.stringify(currentImages));
}

// Quick image change functions for console use
window.changeProfilePhoto = (url) => changeImage('img[alt*="Mansur Khan"]', url);
window.changeLogo = (url) => changeImage('.logo-img', url);
window.changePortfolioImage = (index, url) => changeImage(`.portfolio-item:nth-child(${index}) img`, url);

// Add admin panel access button (hidden by default)
function addAdminAccess() {
    const adminBtn = document.createElement('button');
    adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
    adminBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        transition: all 0.3s ease;
    `;
    
    adminBtn.title = 'Image Manager';
    adminBtn.onclick = () => window.open('admin.html', '_blank');
    
    // Show admin button on triple click
    let clickCount = 0;
    document.addEventListener('click', () => {
        clickCount++;
        setTimeout(() => clickCount = 0, 1000);
        if (clickCount === 3) {
            adminBtn.style.display = 'block';
        }
    });
    
    document.body.appendChild(adminBtn);
}

// Initialize admin access
document.addEventListener('DOMContentLoaded', addAdminAccess);

// Add subtle parallax effect to hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Initialize parallax effect (uncomment if desired)
// document.addEventListener('DOMContentLoaded', addParallaxEffect);
