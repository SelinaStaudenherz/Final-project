// AI Job Matching - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const jobSearchForm = document.getElementById('job-search-form');
    const searchJobsBtn = document.getElementById('search-jobs-btn');
    const aiMatchBtn = document.getElementById('ai-match-btn');
    const sortJobsSelect = document.getElementById('sort-jobs');
    
    // Add event listeners
    if (searchJobsBtn) {
        searchJobsBtn.addEventListener('click', searchJobs);
    }
    
    if (aiMatchBtn) {
        aiMatchBtn.addEventListener('click', findAIMatches);
    }
    
    if (sortJobsSelect) {
        sortJobsSelect.addEventListener('change', sortJobs);
    }
    
    // Initialize job cards
    initializeJobCards();
    
    // Function to search jobs
    function searchJobs() {
        const jobTitle = document.getElementById('job-title').value;
        const jobLocation = document.getElementById('job-location').value;
        const jobDistance = document.getElementById('job-distance').value;
        
        console.log('Searching jobs with criteria:', { jobTitle, jobLocation, jobDistance });
        
        // Show loading state
        searchJobsBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...';
        searchJobsBtn.disabled = true;
        
        // Simulate job search (would be an actual API call in production)
        setTimeout(() => {
            // Reset button state
            searchJobsBtn.innerHTML = 'Search Jobs';
            searchJobsBtn.disabled = false;
            
            // Update job count (demo)
            document.getElementById('job-count').textContent = getRandomInt(5, 30);
            
            // Refresh job listings with "new" results
            refreshJobListings();
            
            // Alert for demo
            if (jobTitle || jobLocation) {
                alert(`Search completed for "${jobTitle || 'all jobs'}" in "${jobLocation || 'all locations'}". The full version would display real job listings from job boards.`);
            }
        }, 1500);
    }
    
    // Function to find AI matches
    function findAIMatches() {
        console.log('Finding AI job matches');
        
        // Show loading state
        aiMatchBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Finding Matches...';
        aiMatchBtn.disabled = true;
        
        // Simulate AI matching (would be an actual API call in production)
        setTimeout(() => {
            // Reset button state
            aiMatchBtn.innerHTML = '<i class="fas fa-robot me-2"></i>Find My Best Matches';
            aiMatchBtn.disabled = false;
            
            // Update job count (demo)
            document.getElementById('job-count').textContent = "8";
            
            // Refresh job listings with "new" results
            refreshJobListings(true);
            
            // Alert for demo
            alert("AI has found 8 jobs that match your skills and experience. In the full version, these would be personalized based on your profile, resume, and language skills.");
        }, 2000);
    }
    
    // Function to sort jobs
    function sortJobs() {
        const sortBy = sortJobsSelect.value;
        console.log('Sorting jobs by:', sortBy);
        
        // Simulate sorting (would actually sort in production)
        setTimeout(() => {
            refreshJobListings();
        }, 500);
    }
    
    // Function to initialize job cards
    function initializeJobCards() {
        // This would dynamically create cards in production
        console.log('Initializing job cards');
        
        // In the demo, cards are hard-coded in HTML
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.classList.add('shadow-sm');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('shadow-sm');
            });
        });
    }
    
    // Function to refresh job listings
    function refreshJobListings(aiMatched = false) {
        // This would fetch new jobs from the API in production
        console.log('Refreshing job listings, AI matched:', aiMatched);
        
        // For demo, just add a little animation
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = 0;
                setTimeout(() => {
                    // If AI matched, update the match percentages
                    if (aiMatched) {
                        const progressBar = card.querySelector('.progress-bar');
                        const matchText = card.querySelector('[class^="text-"]');
                        
                        if (progressBar && matchText) {
                            const newMatch = getRandomInt(60, 98);
                            progressBar.style.width = `${newMatch}%`;
                            progressBar.setAttribute('title', `${newMatch}% Match`);
                            
                            matchText.textContent = `${newMatch}% Match`;
                            
                            // Update color based on match percentage
                            if (newMatch >= 85) {
                                progressBar.className = 'progress-bar bg-success';
                                matchText.className = 'text-success small';
                            } else if (newMatch >= 70) {
                                progressBar.className = 'progress-bar bg-warning';
                                matchText.className = 'text-warning small';
                            } else {
                                progressBar.className = 'progress-bar bg-info';
                                matchText.className = 'text-info small';
                            }
                        }
                    }
                    
                    card.style.opacity = 1;
                }, 300);
            }, index * 100);
        });
    }
    
    // Helper function to get random integer
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
