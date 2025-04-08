// Immigrant Support App - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }

    // Initialize registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerUser();
        });
    }

    // Initialize navigation highlighting
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Simulate AI features for demo
    initDemoAI();
});

// Language change function
function changeLanguage(lang) {
    console.log(`Language changed to: ${lang}`);
    // In a real app, this would load translated content
    alert(`Language switched to ${getLanguageName(lang)}. This feature will be implemented in the full version.`);
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'zh': 'Chinese',
        'ar': 'Arabic'
    };
    return languages[code] || code;
}

// Registration function
function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const preferredLanguage = document.getElementById('preferred-language').value;
    const userType = document.getElementById('user-type').value;
    
    console.log('User registration data:', { name, email, preferredLanguage, userType });
    
    // In a real app, this would send data to the backend
    alert(`Thank you for registering, ${name}! This is a demo version. The full app would create your account and redirect you to the dashboard.`);
}

// Initialize demo AI features
function initDemoAI() {
    // These would be actual API calls in the real app
    simulateAIFeature('job-matching', 'Finding jobs that match your skills and experience...');
    simulateAIFeature('resume-builder', 'Analyzing your work history to create a professional resume...');
    simulateAIFeature('translator', 'Loading translation models for real-time communication...');
    simulateAIFeature('financial-assistant', 'Setting up personalized financial guidance...');
}

function simulateAIFeature(feature, message) {
    console.log(`AI Feature (${feature}): ${message}`);
}

// Add this code to enable the "scroll to section" functionality for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});
