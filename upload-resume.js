// Resume Upload functionality for Immigrant Support App

document.addEventListener('DOMContentLoaded', function() {
    // Get form and UI elements
    const resumeUploadForm = document.getElementById('resume-upload-form');
    const resumeFile = document.getElementById('resume-file');
    const jobTarget = document.getElementById('job-target');
    const industry = document.getElementById('industry');
    const uploadButton = document.getElementById('upload-button');
    const uploadSuccess = document.getElementById('upload-success');
    const uploadError = document.getElementById('upload-error');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const resumePreview = document.getElementById('resume-preview');
    const resumeName = document.getElementById('resume-name');
    const resumeSize = document.getElementById('resume-size');
    const resumeDate = document.getElementById('resume-date');
    const resumeIcon = document.getElementById('resume-icon');
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const deleteResumeBtn = document.getElementById('delete-resume-btn');
    
    // Check if user has a resume already and show it
    checkExistingResume();
    
    // Handle form submission
    if (resumeUploadForm) {
        resumeUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            uploadResume();
        });
    }
    
    // Handle resume deletion
    if (deleteResumeBtn) {
        deleteResumeBtn.addEventListener('click', function() {
            deleteResume();
        });
    }
    
    // Handle resume viewing
    if (viewResumeBtn) {
        viewResumeBtn.addEventListener('click', function() {
            viewResume();
        });
    }
    
    // Check for existing resume
    function checkExistingResume() {
        const currentUser = getCurrentUser();
        
        if (currentUser && currentUser.resume) {
            // Update UI to show existing resume
            updateResumePreview(currentUser.resume);
        }
    }
    
    // Function to upload resume
    function uploadResume() {
        // Check if a file is selected
        if (!resumeFile.files || resumeFile.files.length === 0) {
            showError('Please select a file to upload.');
            return;
        }
        
        const file = resumeFile.files[0];
        
        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showError('Please upload a PDF or Word document (.pdf, .doc, .docx).');
            return;
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showError('File size exceeds the limit of 5MB.');
            return;
        }
        
        // Show loading state
        uploadButton.disabled = true;
        uploadButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';
        
        // Get the current user
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            showError('You must be logged in to upload a resume. Please <a href="login.html">login</a> or <a href="register.html">register</a>.');
            uploadButton.disabled = false;
            uploadButton.innerHTML = '<i class="fas fa-upload me-2"></i>Upload Resume';
            return;
        }
        
        // Read the file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Create resume object
                const resumeData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: e.target.result, // Base64 encoded file content
                    lastModified: new Date(file.lastModified).toISOString(),
                    uploadDate: new Date().toISOString(),
                    jobTarget: jobTarget.value || null,
                    industry: industry.value || null
                };
                
                // Save to local storage
                saveResume(resumeData);
                
                // Update UI
                updateResumePreview(resumeData);
                
                // Show success message
                showSuccess('Resume uploaded successfully!');
                
                // Reset form
                resumeUploadForm.reset();
            } catch (error) {
                console.error('Error processing resume:', error);
                showError('There was an error processing your resume. Please try again.');
            } finally {
                // Reset upload button
                uploadButton.disabled = false;
                uploadButton.innerHTML = '<i class="fas fa-upload me-2"></i>Upload Resume';
            }
        };
        
        reader.onerror = function() {
            showError('There was an error reading the file. Please try again.');
            uploadButton.disabled = false;
            uploadButton.innerHTML = '<i class="fas fa-upload me-2"></i>Upload Resume';
        };
        
        // Read the file as data URL
        reader.readAsDataURL(file);
    }
    
    // Function to save resume to current user
    function saveResume(resumeData) {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            throw new Error('User not logged in');
        }
        
        // Update user's resume
        currentUser.resume = resumeData;
        
        // Save updated user to storage
        updateUserInStorage(currentUser);
    }
    
    // Function to delete resume
    function deleteResume() {
        const currentUser = getCurrentUser();
        
        if (!currentUser || !currentUser.resume) {
            showError('No resume found to delete.');
            return;
        }
        
        // Confirm deletion
        if (!confirm('Are you sure you want to delete your resume?')) {
            return;
        }
        
        // Remove resume from user
        currentUser.resume = null;
        
        // Save updated user to storage
        updateUserInStorage(currentUser);
        
        // Update UI
        hideResumePreview();
        
        // Show success message
        showSuccess('Resume deleted successfully!');
    }
    
    // Function to view resume
    function viewResume() {
        const currentUser = getCurrentUser();
        
        if (!currentUser || !currentUser.resume) {
            showError('No resume found to view.');
            return;
        }
        
        // For PDF and Word files, we can open them in a new tab/window
        // if we have the content stored
        if (currentUser.resume.content) {
            const contentType = currentUser.resume.type;
            const blob = dataURLtoBlob(currentUser.resume.content, contentType);
            const blobUrl = URL.createObjectURL(blob);
            
            // Open in new window
            window.open(blobUrl, '_blank');
            
            // Clean up by revoking the URL after a short delay
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } else {
            // If we don't have the content, show an error
            showError('Resume content not available for viewing.');
        }
    }
    
    // Function to update resume preview UI
    function updateResumePreview(resumeData) {
        if (!resumeData) return;
        
        // Update resume preview elements
        resumeName.textContent = resumeData.name || 'resume.pdf';
        resumeSize.textContent = formatFileSize(resumeData.size || 0);
        
        const uploadDate = resumeData.uploadDate ? new Date(resumeData.uploadDate) : new Date();
        resumeDate.textContent = formatDate(uploadDate);
        
        // Update icon based on file type
        if (resumeData.type && resumeData.type.includes('pdf')) {
            resumeIcon.className = 'fas fa-file-pdf fa-3x text-danger me-3';
        } else if (resumeData.type && resumeData.type.includes('word')) {
            resumeIcon.className = 'fas fa-file-word fa-3x text-primary me-3';
        } else {
            resumeIcon.className = 'fas fa-file fa-3x text-secondary me-3';
        }
        
        // Show resume preview
        resumePreview.classList.remove('d-none');
        
        // Hide form if needed
        // resumeUploadForm.classList.add('d-none');
    }
    
    // Function to hide resume preview UI
    function hideResumePreview() {
        // Hide resume preview
        resumePreview.classList.add('d-none');
        
        // Show form again
        // resumeUploadForm.classList.remove('d-none');
    }
    
    // Function to show success message
    function showSuccess(message) {
        // Hide error alert if visible
        uploadError.classList.add('d-none');
        
        // Update and show success alert
        successMessage.textContent = message;
        uploadSuccess.classList.remove('d-none');
        
        // Hide success alert after 5 seconds
        setTimeout(() => {
            uploadSuccess.classList.add('d-none');
        }, 5000);
    }
    
    // Function to show error message
    function showError(message) {
        // Hide success alert if visible
        uploadSuccess.classList.add('d-none');
        
        // Update and show error alert
        errorMessage.innerHTML = message;
        uploadError.classList.remove('d-none');
        
        // Hide error alert after 5 seconds
        setTimeout(() => {
            uploadError.classList.add('d-none');
        }, 5000);
    }
    
    // Helper function to get the current user
    function getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser')) || 
               JSON.parse(localStorage.getItem('rememberedUser'));
    }
    
    // Helper function to update user in storage
    function updateUserInStorage(updatedUser) {
        // Update in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Check if user is remembered and update in localStorage
        if (localStorage.getItem('rememberedUser')) {
            localStorage.setItem('rememberedUser', JSON.stringify(updatedUser));
        }
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.id === updatedUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
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
    
    // Helper function to convert data URL to Blob
    function dataURLtoBlob(dataURL, contentType) {
        // Convert base64 to raw binary data held in a string
        const byteString = atob(dataURL.split(',')[1]);
        
        // Create an ArrayBuffer with the same length as the string
        const arrayBuffer = new ArrayBuffer(byteString.length);
        
        // Create a view into the buffer
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Set each byte to the corresponding character code
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        
        // Create a blob with the arrayBuffer and the content type
        return new Blob([arrayBuffer], { type: contentType });
    }
});
