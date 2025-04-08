// AI Resume Builder - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const resumeUploadForm = document.getElementById('resume-upload-form');
    const resumeFileInput = document.getElementById('resume-file');
    const analyzeResumeBtn = document.getElementById('analyze-resume-btn');
    const downloadReportBtn = document.getElementById('download-report-btn');
    const applyChangesBtn = document.getElementById('apply-changes-btn');
    
    // Resume analysis result containers
    const resumeAnalysisPlaceholder = document.getElementById('resume-analysis-placeholder');
    const resumeAnalysisResults = document.getElementById('resume-analysis-results');
    const resumeScore = document.getElementById('resume-score');
    const resumeScoreBar = document.getElementById('resume-score-bar');
    const resumeStrengths = document.getElementById('resume-strengths');
    const resumeImprovements = document.getElementById('resume-improvements');
    const aiSuggestions = document.getElementById('ai-suggestions');
    
    // Section analysis containers
    const contactAnalysis = document.getElementById('contact-analysis');
    const summaryAnalysis = document.getElementById('summary-analysis');
    const experienceAnalysis = document.getElementById('experience-analysis');
    const skillsAnalysis = document.getElementById('skills-analysis');
    
    // Add event listeners
    if (analyzeResumeBtn) {
        analyzeResumeBtn.addEventListener('click', analyzeResume);
    }
    
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', downloadReport);
    }
    
    if (applyChangesBtn) {
        applyChangesBtn.addEventListener('click', applyAIChanges);
    }
    
    // Resume file change handler
    if (resumeFileInput) {
        resumeFileInput.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            if (fileName) {
                console.log(`File selected: ${fileName}`);
            }
        });
    }
    
    // Function to analyze resume
    function analyzeResume() {
        const file = resumeFileInput.files[0];
        
        if (!file) {
            alert('Please select a resume file to analyze.');
            return;
        }
        
        // Show loading state
        analyzeResumeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
        analyzeResumeBtn.disabled = true;
        
        // Simulate file upload and AI analysis (would be an actual API call in production)
        setTimeout(() => {
            // Reset button state
            analyzeResumeBtn.innerHTML = 'Analyze My Resume';
            analyzeResumeBtn.disabled = false;
            
            // Show analysis results
            resumeAnalysisPlaceholder.classList.add('d-none');
            resumeAnalysisResults.classList.remove('d-none');
            
            // Update with demo analysis data
            updateAnalysisResults(getDemoAnalysisData());
        }, 3000);
    }
    
    // Function to download analysis report
    function downloadReport() {
        alert('The report would be downloaded as a PDF in the production version.');
    }
    
    // Function to apply AI changes
    function applyAIChanges() {
        alert('AI improvements would be applied to create a new version of your resume in the production version.');
    }
    
    // Function to update the UI with analysis results
    function updateAnalysisResults(data) {
        // Update score
        resumeScore.textContent = `${data.score}/100`;
        resumeScoreBar.style.width = `${data.score}%`;
        resumeScoreBar.setAttribute('aria-valuenow', data.score);
        
        // Update score color based on value
        if (data.score < 50) {
            resumeScoreBar.className = 'progress-bar bg-danger';
        } else if (data.score < 75) {
            resumeScoreBar.className = 'progress-bar bg-warning';
        } else {
            resumeScoreBar.className = 'progress-bar bg-success';
        }
        
        // Update strengths
        resumeStrengths.innerHTML = '';
        data.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${strength}`;
            resumeStrengths.appendChild(li);
        });
        
        // Update improvements
        resumeImprovements.innerHTML = '';
        data.improvements.forEach(improvement => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<i class="fas fa-exclamation-circle text-warning me-2"></i>${improvement}`;
            resumeImprovements.appendChild(li);
        });
        
        // Update section analyses
        contactAnalysis.innerHTML = data.sections.contact;
        summaryAnalysis.innerHTML = data.sections.summary;
        experienceAnalysis.innerHTML = data.sections.experience;
        skillsAnalysis.innerHTML = data.sections.skills;
        
        // Update AI suggestions
        aiSuggestions.value = data.aiSuggestions;
    }
    
    // Function to get demo analysis data
    function getDemoAnalysisData() {
        const fileName = resumeFileInput.files[0]?.name || 'your resume';
        const targetJob = document.getElementById('target-job').value || 'the job';
        const targetIndustry = document.getElementById('target-industry').value;
        
        let industryText = '';
        if (targetIndustry) {
            const industrySelect = document.getElementById('target-industry');
            const selectedOption = industrySelect.options[industrySelect.selectedIndex];
            industryText = selectedOption.text;
        }
        
        return {
            score: 68,
            strengths: [
                'Good organization of work experience in reverse chronological order',
                'Clear contact information with professional email',
                'Appropriate length (one page)',
                'Includes relevant technical skills'
            ],
            improvements: [
                'Professional summary needs more impact statements',
                'Work experiences lack quantifiable achievements',
                'Skills section could be more tailored to the target job',
                'Education section missing relevant coursework'
            ],
            sections: {
                contact: `
                    <p><span class="badge bg-success me-2">✓</span> Contact information is well-formatted and complete.</p>
                    <p><span class="badge bg-warning me-2">⚠</span> Consider adding your LinkedIn profile URL.</p>
                    <p><span class="badge bg-info me-2">i</span> Your email is professional, which is good for job applications.</p>
                `,
                summary: `
                    <p><span class="badge bg-warning me-2">⚠</span> Your professional summary is too generic and doesn't highlight your unique value.</p>
                    <p><span class="badge bg-info me-2">i</span> A strong summary should include your years of experience, key skills, and professional achievements.</p>
                    <div class="card mt-3 bg-light">
                        <div class="card-body">
                            <h6>AI Recommendation:</h6>
                            <p>"Dedicated [profession] with [X] years of experience in ${industryText || 'the industry'}. Proven track record of [specific achievement] resulting in [quantifiable result]. Skilled in [key skills relevant to ${targetJob}]."</p>
                        </div>
                    </div>
                `,
                experience: `
                    <p><span class="badge bg-success me-2">✓</span> Good job listing experiences in reverse chronological order.</p>
                    <p><span class="badge bg-warning me-2">⚠</span> Your bullet points describe responsibilities, but lack accomplishments and results.</p>
                    <p><span class="badge bg-info me-2">i</span> Use the STAR method (Situation, Task, Action, Result) to describe your achievements.</p>
                    <div class="card mt-3 bg-light">
                        <div class="card-body">
                            <h6>Example Improvement:</h6>
                            <p>Instead of: "Responsible for managing client relationships"</p>
                            <p>Try: "Cultivated relationships with 15+ key clients, increasing retention by 35% and generating $120K in additional annual revenue."</p>
                        </div>
                    </div>
                `,
                skills: `
                    <p><span class="badge bg-warning me-2">⚠</span> Your skills section is a generic list without organization or relevance indicators.</p>
                    <p><span class="badge bg-info me-2">i</span> Group skills by category (Technical, Soft, Languages) and highlight those most relevant to ${targetJob}.</p>
                    <p><span class="badge bg-success me-2">✓</span> Good inclusion of technical skills, but consider adding proficiency levels.</p>
                    <div class="card mt-3 bg-light">
                        <div class="card-body">
                            <h6>Skill Section Restructure:</h6>
                            <p><strong>Technical Skills:</strong> [most relevant to ${targetJob} first]</p>
                            <p><strong>Soft Skills:</strong> Communication, Leadership, Problem-solving</p>
                            <p><strong>Languages:</strong> English (Fluent), [Others with proficiency levels]</p>
                        </div>
                    </div>
                `
            },
            aiSuggestions: `SUGGESTED IMPROVEMENTS FOR ${fileName.toUpperCase()}:

1. Professional Summary:
   Current: "[Your current summary]"
   Improved: "Results-driven professional with [X] years of experience in ${industryText || 'your industry'}. Demonstrated success in [key achievement] that resulted in [measurable outcome]. Expertise in [3-4 key skills relevant to ${targetJob}]."

2. Work Experience:
   • Convert responsibility statements to achievement statements using metrics and results
   • Add 1-2 quantifiable achievements for each position
   • Use strong action verbs (Achieved, Delivered, Implemented, etc.)
   • Focus on achievements most relevant to ${targetJob}

3. Skills Section:
   • Reorganize into categories: Technical, Soft Skills, Languages
   • Add proficiency levels where appropriate
   • Move most relevant skills to ${targetJob} to the top of each category
   • Add 2-3 industry-specific keywords for better ATS matching

4. Education:
   • Add relevant coursework or certifications
   • Include GPA if above 3.5
   • Mention academic achievements if relevant to ${targetJob}

5. Design & Formatting:
   • Ensure consistent spacing and bullet points
   • Use a clean, ATS-friendly format
   • Limit to 1-2 pages maximum
`
        };
    }
});
