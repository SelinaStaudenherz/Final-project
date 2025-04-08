// Authentication Module for Immigrant Support App

document.addEventListener('DOMContentLoaded', function() {
    // Initialize local storage for demo user management
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Find forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            const loginAlert = document.getElementById('login-alert');
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Find user by email
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Successful login
                loginAlert.classList.add('d-none');
                
                // Set current user in session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                // If remember me is checked, store in localStorage as well
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', JSON.stringify(user));
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Redirect to dashboard or home
                window.location.href = 'dashboard.html';
            } else {
                // Failed login
                loginAlert.classList.remove('d-none');
            }
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const preferredLanguage = document.getElementById('preferred-language').value;
            const userType = document.getElementById('user-type').value;
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zipCode = document.getElementById('zip-code').value;
            const agreeTerms = document.getElementById('agree-terms').checked;
            
            const registerAlert = document.getElementById('register-alert');
            const registerSuccess = document.getElementById('register-success');
            
            // Basic validation
            if (password !== confirmPassword) {
                registerAlert.textContent = 'Passwords do not match.';
                registerAlert.classList.remove('d-none');
                registerSuccess.classList.add('d-none');
                return;
            }
            
            if (password.length < 8) {
                registerAlert.textContent = 'Password must be at least 8 characters long.';
                registerAlert.classList.remove('d-none');
                registerSuccess.classList.add('d-none');
                return;
            }
            
            if (!agreeTerms) {
                registerAlert.textContent = 'You must agree to the Terms of Service and Privacy Policy.';
                registerAlert.classList.remove('d-none');
                registerSuccess.classList.add('d-none');
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                registerAlert.textContent = 'Email is already registered.';
                registerAlert.classList.remove('d-none');
                registerSuccess.classList.add('d-none');
                return;
            }
            
            // Create new user object
            const newUser = {
                id: Date.now().toString(), // Simple ID for demo
                firstName,
                lastName,
                email,
                password, // Note: In a real app, this should be encrypted
                preferredLanguage,
                userType,
                phone,
                location: {
                    city,
                    state,
                    zipCode
                },
                created: new Date().toISOString(),
                resume: null, // Will be updated if resume is uploaded
                onboardingCompleted: false,
                subscription: {
                    type: 'free',
                    startDate: new Date().toISOString(),
                    active: true
                }
            };
            
            // Add user to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Handle resume upload if provided
            const resumeFile = document.getElementById('resume-file').files[0];
            if (resumeFile) {
                // In a real app, this would upload to a server
                // For demo, we'll simulate storing the file name
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Update user with resume info
                    const updatedUsers = JSON.parse(localStorage.getItem('users'));
                    const userIndex = updatedUsers.findIndex(u => u.id === newUser.id);
                    
                    if (userIndex !== -1) {
                        updatedUsers[userIndex].resume = {
                            name: resumeFile.name,
                            size: resumeFile.size,
                            type: resumeFile.type,
                            lastModified: new Date(resumeFile.lastModified).toISOString(),
                            uploadDate: new Date().toISOString()
                        };
                        
                        localStorage.setItem('users', JSON.stringify(updatedUsers));
                    }
                };
                
                // Start reading the file as data URL (this triggers onload)
                reader.readAsDataURL(resumeFile);
            }
            
            // Show success message
            registerAlert.classList.add('d-none');
            registerSuccess.classList.remove('d-none');
            
            // Reset form
            registerForm.reset();
            
            // After 3 seconds, redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        });
    }
    
    // Check if user is already logged in
    function checkLoggedInStatus() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        
        if (currentUser || rememberedUser) {
            // User is already logged in
            // If on login or register page, redirect to dashboard
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                window.location.href = 'dashboard.html';
            }
            
            // Update nav with user info
            updateNavForLoggedInUser(currentUser || rememberedUser);
        } else {
            // User is not logged in
            // If on protected pages, redirect to login
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
        }
    }
    
    // Update navigation for logged in users
    function updateNavForLoggedInUser(user) {
        const navbarNav = document.querySelector('.navbar-nav.ms-auto');
        if (navbarNav) {
            navbarNav.innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle me-1"></i> ${user.firstName}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="dashboard.html">Dashboard</a></li>
                        <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="logout-link">Logout</a></li>
                    </ul>
                </li>
            `;
            
            // Add logout handler
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
        }
    }
    
    // Logout function
    function logout() {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        window.location.href = 'index.html';
    }
    
    // Initialize auth state
    checkLoggedInStatus();
    
    // Create a demo admin user if none exists
    function createDemoUser() {
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Check if we already have a demo user
        if (!users.some(u => u.email === 'demo@example.com')) {
            const demoUser = {
                id: 'demo-user-123',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@example.com',
                password: 'password123',
                preferredLanguage: 'en',
                userType: 'worker',
                phone: '123-456-7890',
                location: {
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001'
                },
                created: new Date().toISOString(),
                resume: {
                    name: 'demo-resume.pdf',
                    size: 125000,
                    type: 'application/pdf',
                    lastModified: new Date().toISOString(),
                    uploadDate: new Date().toISOString()
                },
                onboardingCompleted: true,
                subscription: {
                    type: 'premium',
                    startDate: new Date().toISOString(),
                    active: true
                }
            };
            
            users.push(demoUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Demo user created:', demoUser.email);
        }
    }
    
    // Create demo user for testing
    createDemoUser();
});
