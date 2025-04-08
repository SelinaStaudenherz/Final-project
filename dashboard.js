// Dashboard functionality for Immigrant Support App

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Populate user data in dashboard
    populateUserData(currentUser);
    
    // Handle profile form submissions
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUserProfile();
        });
    }
    
    // Handle resume upload
    const resumeUploadForm = document.getElementById('resume-upload-form');
    if (resumeUploadForm) {
        resumeUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            uploadResume();
        });
    }
    
    // Handle resume deletion
    const deleteResumeBtn = document.getElementById('delete-resume-btn');
    if (deleteResumeBtn) {
        deleteResumeBtn.addEventListener('click', function() {
            deleteResume();
        });
    }
    
    // Handle settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePassword();
        });
    }
    
    // Handle account deletion
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            deleteAccount();
        });
    }
    
    // Initialize tabs behavior
    initTabs();
});

// Function to populate user data in the dashboard
function populateUserData(user) {
    // Update welcome message
    const userFirstNameElement = document.getElementById('user-first-name');
    if (userFirstNameElement) {
        userFirstNameElement.textContent = user.firstName;
    }
    
    // Update subscription plan
    const subscriptionPlanElement = document.getElementById('subscription-plan');
    if (subscriptionPlanElement) {
        subscriptionPlanElement.textContent = capitalizeFirstLetter(user.subscription?.type || 'Free');
        
        // Update badge color based on plan
        if (user.subscription?.type === 'premium') {
            subscriptionPlanElement.className = 'badge bg-success';
        } else if (user.subscription?.type === 'business') {
            subscriptionPlanElement.className = 'badge bg-primary';
        }
    }
    
    // Update profile form
    const profileFirstName = document.getElementById('profile-first-name');
    const profileLastName = document.getElementById('profile-last-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profileLanguage = document.getElementById('profile-language');
    const profileCity = document.getElementById('profile-city');
    const profileState = document.getElementById('profile-state');
    const profileZip = document.getElementById('profile-zip');
    
    if (profileFirstName) profileFirstName.value = user.firstName || '';
    if (profileLastName) profileLastName.value = user.lastName || '';
    if (profileEmail) profileEmail.value = user.email || '';
    if (profilePhone) profilePhone.value = user.phone || '';
    if (profileLanguage) profileLanguage.value = user.preferredLanguage || 'en';
    if (profileCity) profileCity.value = user.location?.city || '';
    if (profileState) profileState.value = user.location?.state || '';
    if (profileZip) profileZip.value = user.location?.zipCode || '';
    
    // Update resume status
    updateResumeStatus(user);
}

// Function to update resume status UI
function updateResumeStatus(user) {
    const resumeStatusElement = document.getElementById('resume-status');
    const noResumeElement = document.getElementById('no-resume');
    const hasResumeElement = document.getElementById('has-resume');
    const resumeNameElement = document.getElementById('resume-name');
    const resumeSizeElement = document.getElementById('resume-size');
    const resumeDateElement = document.getElementById('resume-date');
    
    if (user.resume) {
        // User has a resume
        if (resumeStatusElement) {
            resumeStatusElement.textContent = "You have uploaded a resume.";
        }
        
        if (noResumeElement && hasResumeElement) {
            noResumeElement.classList.add('d-none');
            hasResumeElement.classList.remove('d-none');
        }
        
        if (resumeNameElement) {
            resumeNameElement.textContent = user.resume.name || 'resume.pdf';
        }
        
        if (resumeSizeElement) {
            resumeSizeElement.textContent = formatFileSize(user.resume.size || 0);
        }
        
        if (resumeDateElement) {
            const uploadDate = user.resume.uploadDate ? new Date(user.resume.uploadDate) : new Date();
            resumeDateElement.textContent = formatDate(uploadDate);
        }
    } else {
        // User does not have a resume
        if (resumeStatusElement) {
            resumeStatusElement.textContent = "You have not uploaded a resume.";
        }
        
        if (noResumeElement && hasResumeElement) {
            noResumeElement.classList.remove('d-none');
            hasResumeElement.classList.add('d-none');
        }
    }
}

// Function to update user profile
function updateUserProfile() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        alert('You must be logged in to update your profile.');
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('profile-first-name').value;
    const lastName = document.getElementById('profile-last-name').value;
    const phone = document.getElementById('profile-phone').value;
    const preferredLanguage = document.getElementById('profile-language').value;
    const city = document.getElementById('profile-city').value;
    const state = document.getElementById('profile-state').value;
    const zipCode = document.getElementById('profile-zip').value;
    const bio = document.getElementById('profile-bio').value;
    
    // Update user object
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.phone = phone;
    currentUser.preferredLanguage = preferredLanguage;
    currentUser.location = {
        city,
        state,
        zipCode
    };
    currentUser.bio = bio;
    
    // Update localStorage and sessionStorage
    updateUserInStorage(currentUser);
    
    // Show success message
    alert('Profile updated successfully!');
}

// Function to upload resume
function uploadResume() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        alert('You must be logged in to upload a resume.');
        return;
    }
    
    const resumeFile = document.getElementById('dashboard-resume-file').files[0];
    
    if (!resumeFile) {
        alert('Please select a file to upload.');
        return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.type)) {
        alert('Please upload a PDF or Word document (.pdf, .doc, .docx).');
        return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (resumeFile.size > maxSize) {
        alert('File size exceeds the limit of 5MB.');
        return;
    }
    
    // In a real app, this would upload to a server
    // For the demo, we'll simulate storing file info
    
    // Simulate file reading and processing
    const reader = new FileReader();
    reader.onload = function() {
        // Update user with resume info
        currentUser.resume = {
            name: resumeFile.name,
            size: resumeFile.size,
            type: resumeFile.type,
            lastModified: new Date(resumeFile.lastModified).toISOString(),
            uploadDate: new Date().toISOString()
        };
        
        // Update user in storage
        updateUserInStorage(currentUser);
        
        // Update UI
        updateResumeStatus(currentUser);
        
        // Show success message
        alert('Resume uploaded successfully!');
        
        // Reset form
        document.getElementById('dashboard-resume-file').value = '';
    };
    
    // Start reading the file
    reader.readAsDataURL(resumeFile);
}

// Function to delete resume
function deleteResume() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        alert('You must be logged in to delete a resume.');
        return;
    }
    
    if (!currentUser.resume) {
        alert('No resume found to delete.');
        return;
    }
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete your resume?')) {
        return;
    }
    
    // Remove resume from user object
    currentUser.resume = null;
    
    // Update user in storage
    updateUserInStorage(currentUser);
    
    // Update UI
    updateResumeStatus(currentUser);
    
    // Show success message
    alert('Resume deleted successfully!');
}

// Function to update password
function updatePassword() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        alert('You must be logged in to update your password.');
        return;
    }
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    // Check if current password is correct
    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect.');
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match.');
        return;
    }
    
    // Check if new password meets requirements
    if (newPassword.length < 8) {
        alert('New password must be at least 8 characters long.');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    
    // Update user in storage
    updateUserInStorage(currentUser);
    
    // Reset form
    document.getElementById('settings-form').reset();
    
    // Show success message
    alert('Password updated successfully!');
}

// Function to delete account
function deleteAccount() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                        JSON.parse(localStorage.getItem('rememberedUser'));
    
    if (!currentUser) {
        alert('You must be logged in to delete your account.');
        return;
    }
    
    // Confirm deletion with a serious warning
    if (!confirm('WARNING: This action cannot be undone. All your data will be permanently deleted. Are you sure you want to delete your account?')) {
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Remove user from the array
    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Clear session and remembered user
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    
    // Show success message and redirect to home
    alert('Your account has been deleted successfully.');
    window.location.href = 'index.html';
}

// Helper function to update user in storage
function updateUserInStorage(updatedUser) {
    // Update in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Check if user is remembered and update in localStorage
    if (localStorage.getItem('rememberedUser')) {
        localStorage.setItem('rememberedUser', JSON.stringify(updatedUser));
    }
    
    // Update in users array in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id === updatedUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Helper function to initialize tabs
function initTabs() {
    // This adds behavior to ensure tabs switch content correctly
    const tabLinks = document.querySelectorAll('.list-group-item[data-bs-toggle="list"]');
    
    if (tabLinks.length > 0) {
        // Get tab from URL if present
        const url = new URL(window.location.href);
        const tab = url.hash.replace('#', '');
        
        if (tab && document.getElementById(tab)) {
            // Find the tab link and activate it
            const tabLink = document.querySelector(`.list-group-item[href="#${tab}"]`);
            if (tabLink) {
                // Remove active class from all tabs
                tabLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to the target tab
                tabLink.classList.add('active');
                
                // Show the target tab content
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                document.getElementById(tab).classList.add('show', 'active');
            }
        }
        
        // Add click event to all tab links
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Get the target tab content id
                const targetId = this.getAttribute('href').replace('#', '');
                
                // Update URL hash
                window.location.hash = targetId;
            });
        });
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
