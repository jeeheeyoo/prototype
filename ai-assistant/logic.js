/**
 * Advanced AI Assistant Logic
 */

const AppState = {
    mode: null, // 'agent_driven' | 'review_driven'
    views: {
        selection: document.getElementById('view-mode-selection'),
        dashboard: document.getElementById('view-dashboard')
    },
    mockApprovals: [
        { id: 1, title: 'Contract Renewal: Acme Corp', summary: 'Updated terms for 2026. Rate adjustment +5%.', date: '2h ago' },
        { id: 2, title: 'New Hire: Sarah Jones', summary: 'Offer letter generated. Standard Senior Dev package.', date: '3h ago' },
        { id: 3, title: 'Expense Report: Q4 Team Offsite', summary: 'Total: $4,200. Exceeds budget by 5%.', date: '5h ago' },
        { id: 4, title: 'Policy Update: Remote Work', summary: 'Tier 2 grammatical corrections applied.', date: '1d ago' },
        { id: 5, title: 'Vendor Agreement: CloudSaaS', summary: 'Annual license renewal. No price change.', date: '1d ago' },
        { id: 6, title: 'Time Off Request: Michael Scott', summary: '3 days PTO for family event.', date: '2d ago' },
        { id: 7, title: 'Access Request: JIRA Admin', summary: 'Granted temporary admin rights for migration.', date: '2d ago' },
        { id: 8, title: 'Invoice Approval: AWS Feb', summary: 'Usage within aligned forecast.', date: '3d ago' },
        { id: 9, title: 'Compliance Training: Q1', summary: 'Assigning mandatory training to all employees.', date: '3d ago' },
        { id: 10, title: 'Equipment Request: Monitor', summary: 'Replacement 4K monitor for Design team.', date: '4d ago' }
    ]
};

// --- Initialization ---

function init() {
    // Always show selection on load as requested
    // const savedMode = localStorage.getItem('assistantDriveMode');
    // if (savedMode) {
    //     AppState.mode = savedMode;
    //     showDashboard();
    // } else {
    showModeSelection();
    // }

    renderApprovals();
    setupEventListeners();
}

// --- View Switching ---

function showModeSelection() {
    state.views.selection = document.getElementById('view-mode-selection');
    state.views.dashboard = document.getElementById('view-dashboard');

    if (state.views.selection) state.views.selection.style.display = 'flex';
    if (state.views.dashboard) state.views.dashboard.style.display = 'none';
}

function showDashboard() {
    state.views.selection = document.getElementById('view-mode-selection');
    state.views.dashboard = document.getElementById('view-dashboard');

    if (state.views.selection) state.views.selection.style.display = 'none';
    if (state.views.dashboard) state.views.dashboard.style.display = 'block';

    // Render approvals with mode-specific limit
    renderApprovals();

    // Animate Progress Bar on load
    setTimeout(() => {
        document.getElementById('prog-ai').style.width = '65%';
        document.getElementById('prog-user').style.width = '20%';
    }, 300);
}

// --- Mode Selection Logic ---
let selectedModeTemp = null;

function selectMode(mode) {
    selectedModeTemp = mode;

    // UI Feedback
    document.querySelectorAll('.selection-card').forEach(el => el.classList.remove('selected'));
    document.getElementById(`card-${mode}`).classList.add('selected');

    // Enable Next Button
    const btn = document.getElementById('btn-mode-next');
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function confirmMode() {
    if (!selectedModeTemp) return;

    AppState.mode = selectedModeTemp;
    localStorage.setItem('assistantDriveMode', selectedModeTemp);

    showToast("Setting saved: " + (selectedModeTemp === 'agent_driven' ? "Agent Driven" : "Review Driven"));
    showDashboard();
}

// --- Dashboard Logic ---

function renderApprovals() {
    const list = document.getElementById('approval-list');
    list.innerHTML = '';

    // Determine limit based on mode
    let limit;
    if (AppState.mode === 'agent_driven') {
        limit = 2;
    } else if (AppState.mode === 'review_driven') {
        limit = 10;
    }
    const itemsToShow = AppState.mockApprovals.slice(0, limit);

    // Update header count based on displayed items
    const title = document.getElementById('header-approvals');
    if (title) {
        title.innerText = `Approve (${itemsToShow.length})`;
    }

    itemsToShow.forEach(item => {
        const el = document.createElement('div');
        el.className = 'approval-item card';
        el.id = `approval-${item.id}`;
        el.style.marginBottom = '1rem';
        el.style.padding = '1rem';
        el.style.display = 'flex';
        el.style.justifyContent = 'space-between';
        el.style.alignItems = 'center';
        el.style.textAlign = 'left';

        el.innerHTML = `
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.title}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary);">${item.summary}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-tertiary); margin-top: 0.5rem;">${item.date}</div>
            </div>
            <button class="btn-secondary small" onclick="openReviewModal(${item.id})">Open</button>
        `;
        list.appendChild(el);
    });
}

// --- Modal Logic ---

let currentReviewId = null;

function openReviewModal(id) {
    currentReviewId = id;
    const item = AppState.mockApprovals.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('modal-desc').innerText = item.summary;

    const overlay = document.getElementById('review-modal');
    overlay.classList.add('open');
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.remove('open');
    currentReviewId = null;
}

function handleApprove() {
    if (!currentReviewId) return;

    // Remove from UI
    removeApprovalItem(currentReviewId);
    closeReviewModal();
    showToast("Item approved");
}

function handleReject() {
    if (!currentReviewId) return;

    // Remove -> AI Reprocess
    removeApprovalItem(currentReviewId);
    closeReviewModal();

    showToast("Item rejected. Reprocessing...", 3000);

    // Stimulate Reprocessed item appearing
    setTimeout(() => {
        addNewApproval({
            id: 999,
            title: "Reprocessed: " + AppState.mockApprovals.find(i => i.id === currentReviewId)?.title || "Item",
            summary: "AI corrections applied based on feedback.",
            date: "Just now"
        });
        showToast("Reprocessing complete. New item added.");
    }, 2000);
}

function removeApprovalItem(id) {
    const el = document.getElementById(`approval-${id}`);
    if (el) {
        el.classList.add('removing');
        setTimeout(() => el.remove(), 300);
    }
}

function addNewApproval(item) {
    AppState.mockApprovals.unshift(item); // Add to top
    renderApprovals();
}

// --- Chat Side Panel ---

function toggleChat() {
    const panel = document.getElementById('chat-panel');
    panel.classList.toggle('open');
}

// --- Utilities ---

function showToast(msg, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Event Listeners helper
function setupEventListeners() {
    // Chat input trigger
    const chatInput = document.getElementById('dashboard-chat-trigger');
    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            toggleChat();
            document.getElementById('panel-chat-input').focus();
        });
    }
}

// State shim because I extracted inline code
const state = AppState;

// Run
window.addEventListener('DOMContentLoaded', init);
