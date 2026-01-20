/**
 * HR Document Processing App Logic
 * Handles state management and view rendering for the wizard flow.
 */

// --- State Management ---
const AppState = {
    steps: [
        { id: 'start', label: 'Start' },
        { id: 'upload', label: 'Upload' },
        { id: 'processing', label: 'Processing' },
        { id: 'review', label: 'Review' },
        { id: 'complete', label: 'Complete' }
    ],
    currentStepIndex: 0,
    uploadedFile: null,
    extractedData: null,
};

// --- Mock Data ---
const MOCK_EXTRACTED_DATA = {
    fullName: "Alex Rivera",
    position: "Senior Systems Engineer",
    startDate: "2024-03-15",
    salary: "$120,000",
    idNumber: "E-48291",
    department: "Engineering"
};

// --- DOM Elements ---
const elements = {
    stepper: document.getElementById('stepper'),
    appRoot: document.getElementById('app-root'),
    pageTitle: document.getElementById('page-title'),
};

// --- Core Functions ---
function init() {
    renderStepper();
    renderStep();
}

function setStep(index) {
    if (index < 0 || index >= AppState.steps.length) return;
    AppState.currentStepIndex = index;
    renderStepper();
    renderStep();
}

function renderStepper() {
    elements.stepper.innerHTML = '';
    AppState.steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        const statusClass = index === AppState.currentStepIndex ? 'active' : 
                          index < AppState.currentStepIndex ? 'completed' : '';
        
        stepEl.className = `step-item ${statusClass}`;
        stepEl.innerHTML = `
            <div class="step-indicator">
                ${index < AppState.currentStepIndex ? '✓' : index + 1}
            </div>
            <div class="step-label">${step.label}</div>
        `;
        elements.stepper.appendChild(stepEl);
    });
}

// --- View Renderers ---

function renderStep() {
    elements.appRoot.innerHTML = ''; // Clear current content
    const stepId = AppState.steps[AppState.currentStepIndex].id;

    switch (stepId) {
        case 'start': renderStartScreen(); break;
        case 'upload': renderUploadScreen(); break;
        case 'processing': renderProcessingScreen(); break;
        case 'review': renderReviewScreen(); break;
        case 'complete': renderCompletionScreen(); break;
    }
}

// 1. Start Screen
function renderStartScreen() {
    elements.pageTitle.innerText = "New Processing Request";
    const container = document.createElement('div');
    container.className = 'step-content card';
    container.style.maxWidth = '600px';
    
    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <div class="icon-placeholder" style="background: var(--color-primary-light);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--color-primary)">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                </svg>
            </div>
            <h2>Process New Employee Document</h2>
            <p class="subtitle">Extract data automatically from offer letters, contracts, or ID cards.</p>
        </div>
        <button class="btn-primary" id="btn-start">Start New Session</button>
    `;
    
    elements.appRoot.appendChild(container);
    
    document.getElementById('btn-start').addEventListener('click', () => {
        setStep(1); // Go to Upload
    });
}

// 2. Upload Screen
function renderUploadScreen() {
    elements.pageTitle.innerText = "Upload Document";
    const container = document.createElement('div');
    container.className = 'step-content';
    
    container.innerHTML = `
        <div class="drop-zone" id="drop-zone">
            <div class="icon-placeholder" style="color: var(--color-text-tertiary);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
            </div>
            <h3>Drag & Drop your file here</h3>
            <p class="subtitle" style="margin-bottom: 1.5rem; font-size: 0.85rem;">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
            <button class="btn-secondary">Browse Files</button>
        </div>
        
        <div style="margin-top: 2rem; display:flex; align-items:center; justify-content:center; gap:0.5rem; color: var(--color-text-secondary); font-size: 0.85rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Need help? Ask our AI Assistant in the sidebar.
        </div>
    `;
    
    elements.appRoot.appendChild(container);
    
    const dropZone = document.getElementById('drop-zone');
    
    // Drag & Drop visual feedback
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        // Simulating file upload - in real app, check e.dataTransfer.files
        AppState.uploadedFile = { name: "offer_letter_alex_rivera.pdf" };
        setStep(2); // Go to Processing
    });
    
    // Manual click interactions
    dropZone.addEventListener('click', () => {
        AppState.uploadedFile = { name: "offer_letter_alex_rivera.pdf" };
        setStep(2);
    });
}

// 3. Processing Screen
function renderProcessingScreen() {
    elements.pageTitle.innerText = "Analyzing Document";
    const container = document.createElement('div');
    container.className = 'step-content card';
    container.style.maxWidth = '500px';
    
    container.innerHTML = `
        <div style="padding: 2rem 0;">
            <div class="loader-circle" style="
                width: 60px; height: 60px; 
                border: 4px solid var(--color-border); 
                border-top-color: var(--color-primary); 
                border-radius: 50%; 
                margin: 0 auto 2rem;
                animation: spin 1s linear infinite;">
            </div>
            <h3 id="process-status">Scanning Document...</h3>
            <p class="subtitle" id="process-detail">OCR Engine Initialized</p>
            
            <div class="processing-steps" style="text-align: left; margin-top: 2rem; padding: 1rem; background: var(--color-bg); border-radius: var(--radius-md);">
                <div class="proc-step" id="step-ocr" style="margin-bottom: 0.5rem; display:flex; gap:0.5rem; align-items:center; opacity: 0.5;">
                    <span style="font-size:1.2rem">📄</span> Text Extraction
                </div>
                <div class="proc-step" id="step-ner" style="margin-bottom: 0.5rem; display:flex; gap:0.5rem; align-items:center; opacity: 0.5;">
                    <span style="font-size:1.2rem">🔍</span> Entity Recognition
                </div>
                <div class="proc-step" id="step-profile" style="display:flex; gap:0.5rem; align-items:center; opacity: 0.5;">
                    <span style="font-size:1.2rem">👤</span> Profile Building
                </div>
            </div>
        </div>
        <style>
            @keyframes spin { 100% { transform: rotate(360deg); } }
        </style>
    `;
    
    elements.appRoot.appendChild(container);
    
    // Simulate process sequence
    const statusEl = document.getElementById('process-status');
    const detailEl = document.getElementById('process-detail');
    const steps = [
        { id: 'step-ocr', text: "Extracting Text Layer..." },
        { id: 'step-ner', text: "Identifying Named Entities..." },
        { id: 'step-profile', text: "Constructing Candidate Profile..." }
    ];
    
    let current = 0;
    
    const interval = setInterval(() => {
        if (current >= steps.length) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 800); // Go to Review
            return;
        }
        
        statusEl.innerText = steps[current].text;
        detailEl.innerText = "AI Confidence: " + (95 + Math.floor(Math.random() * 4)) + "%";
        
        const stepRow = document.getElementById(steps[current].id);
        stepRow.style.opacity = '1';
        stepRow.style.color = 'var(--color-primary)';
        stepRow.innerHTML += ' <span style="color:var(--color-success); margin-left:auto;">✓</span>';
        
        current++;
    }, 1500);
}

// 4. Review / Data Extraction Screen
function renderReviewScreen() {
    elements.pageTitle.innerText = "Review Extracted Data";
    const container = document.createElement('div');
    container.className = 'step-content';
    container.style.maxWidth = '1000px'; // Wider for split view
    
    // Pre-fill inputs with mock data
    const d = MOCK_EXTRACTED_DATA;
    
    container.innerHTML = `
        <div class="validation-grid">
            <!-- Left: Document Preview (Mock) -->
            <div class="doc-preview">
                <div style="text-align:center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color:var(--color-text-tertiary); margin-bottom:1rem;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    </svg>
                    <p>Document Preview</p>
                    <p style="font-size:0.75rem; color:var(--color-text-tertiary);">${AppState.uploadedFile ? AppState.uploadedFile.name : 'Document.pdf'}</p>
                </div>
            </div>
            
            <!-- Right: Form -->
            <div class="review-form">
                <div class="card" style="text-align:left; padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
                        <h3>Extracted Entities</h3>
                        <span class="badge" style="background:var(--color-success-bg); color:var(--color-success); padding:0.25rem 0.75rem; border-radius:1rem; font-size:0.75rem; font-weight:600;">High Confidence</span>
                    </div>

                    <div class="form-group">
                        <label>Candidate Name <span style="color:var(--color-success);">●</span></label>
                        <input type="text" class="form-input" value="${d.fullName}">
                    </div>
                    
                    <div class="form-group">
                        <label>Position / Title <span style="color:var(--color-success);">●</span></label>
                        <input type="text" class="form-input" value="${d.position}">
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" class="form-input" value="${d.startDate}">
                        </div>
                        <div class="form-group">
                            <label>Salary (Annual)</label>
                            <input type="text" class="form-input" value="${d.salary}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Department <span style="color:var(--color-warning);">●</span> <span style="font-size:0.75rem; color:var(--color-text-tertiary); font-weight:400;">(Low confidence, please verify)</span></label>
                        <input type="text" class="form-input" value="${d.department}" style="border-color:var(--color-warning);">
                    </div>

                    <div class="status-actions">
                        <button class="btn-secondary" id="btn-back">Reject / Back</button>
                        <button class="btn-primary" id="btn-approve">Approve Data</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    elements.appRoot.appendChild(container);
    
    document.getElementById('btn-approve').addEventListener('click', () => {
        setStep(4); // Go to Complete
    });
    
    document.getElementById('btn-back').addEventListener('click', () => {
        setStep(1); // Back to Upload
    });
}

// 5. Completion Screen
function renderCompletionScreen() {
    elements.pageTitle.innerText = "Processing Complete";
    const container = document.createElement('div');
    container.className = 'step-content card';
    container.style.maxWidth = '600px';
    
    const d = MOCK_EXTRACTED_DATA;
    
    container.innerHTML = `
        <div style="padding: 2rem 0;">
            <div style="width: 64px; height: 64px; background: var(--color-success-bg); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2>Profile Created Successfully</h2>
            <p class="subtitle">The candidate profile has been generated and queued for final HR verification.</p>
            
            <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
                <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="avatar" style="width:48px; height:48px; font-size:1.2rem;">AR</div>
                    <div>
                        <div style="font-weight:600; font-size:1.1rem;">${d.fullName}</div>
                        <div style="font-size:0.9rem; color:var(--color-text-secondary);">${d.position}</div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--color-border);">
                    <span style="color:var(--color-text-tertiary);">Employee ID</span>
                    <span style="font-weight:500;">${d.idNumber}</span>
                </div>
            </div>
            
            <div style="display:flex; gap: 1rem; justify-content: center;">
                <button class="btn-secondary" id="btn-home">Return to Dashboard</button>
                <button class="btn-primary" id="btn-next">Process Next Document</button>
            </div>
        </div>
    `;
    
    elements.appRoot.appendChild(container);
    
    const reset = () => {
        AppState.uploadedFile = null;
        setStep(0);
    };
    
    document.getElementById('btn-home').addEventListener('click', reset);
    document.getElementById('btn-next').addEventListener('click', reset);
}

// Start App
init();
