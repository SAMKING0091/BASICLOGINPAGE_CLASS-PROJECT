// Application State
let currentUser = null;
let userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Experienced administrator with a passion for technology and innovation.',
    memberSince: '2024',
    status: 'Active',
    notifications: true
};

let activityLog = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Show login section by default
    showLogin();
}

function setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Demo login button
    const demoLoginBtn = document.getElementById('demo-login');
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', handleDemoLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // User data form submission
    const userDataForm = document.getElementById('user-data-form');
    if (userDataForm) {
        userDataForm.addEventListener('submit', handleSaveUserData);
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetForm);
    }
}

// Login Logic
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (admin/admin)
    if (username === 'admin' && password === 'admin') {
        currentUser = username;
        addActivity('Logged in successfully');
        showDashboard();
        showNotification('Welcome back!', 'success');
    } else {
        showNotification('Invalid credentials. Try admin/admin', 'error');
    }
}

function handleDemoLogin() {
    currentUser = 'demo';
    addActivity('Logged in via Quick Demo');
    showDashboard();
    showNotification('Demo access granted!', 'success');
}

function handleLogout() {
    addActivity('Logged out');
    currentUser = null;
    showLogin();
    showNotification('Successfully logged out', 'success');
}

// View Management
function showLogin() {
    document.getElementById('login-section').classList.add('active');
    document.getElementById('dashboard-section').classList.remove('active');
}

function showDashboard() {
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('dashboard-section').classList.add('active');
    
    // Update dashboard with current user
    updateDashboardUI();
    renderActivityLog();
}

// Dashboard UI Updates
function updateDashboardUI() {
    // Update current user display
    const currentUserElement = document.getElementById('current-user');
    if (currentUserElement) {
        currentUserElement.textContent = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
    }
    
    // Update profile card
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-role').textContent = userData.role;
    document.getElementById('profile-since').textContent = userData.memberSince;
    document.getElementById('profile-status').textContent = userData.status;
    
    // Populate form with current data
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-email').value = userData.email;
    document.getElementById('edit-phone').value = userData.phone;
    document.getElementById('edit-role').value = userData.role;
    document.getElementById('edit-department').value = userData.department;
    document.getElementById('edit-location').value = userData.location;
    document.getElementById('edit-bio').value = userData.bio;
    document.getElementById('edit-notifications').checked = userData.notifications;
}

// CRUD Operations
function handleSaveUserData(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        role: document.getElementById('edit-role').value,
        department: document.getElementById('edit-department').value,
        location: document.getElementById('edit-location').value,
        bio: document.getElementById('edit-bio').value,
        notifications: document.getElementById('edit-notifications').checked
    };
    
    // Update userData object
    userData = {
        ...userData,
        ...formData
    };
    
    // Update UI
    updateDashboardUI();
    
    // Add activity
    addActivity('Updated profile information');
    renderActivityLog();
    
    // Show success notification
    showNotification('Your changes have been saved successfully!', 'success');
}

function handleResetForm() {
    updateDashboardUI();
    showNotification('Form reset to saved values', 'info');
}

function getUserData() {
    return userData;
}

function saveUserData(data) {
    userData = {
        ...userData,
        ...data
    };
    updateDashboardUI();
}

// Activity Log
function addActivity(description) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    activityLog.unshift({
        time: `${dateString} at ${timeString}`,
        description: description
    });
    
    // Keep only last 10 activities
    if (activityLog.length > 10) {
        activityLog = activityLog.slice(0, 10);
    }
}

function renderActivityLog() {
    const activityLogElement = document.getElementById('activity-log');
    
    if (activityLog.length === 0) {
        activityLogElement.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                <p class="mt-2">No recent activity</p>
            </div>
        `;
        return;
    }
    
    activityLogElement.innerHTML = activityLog.map(activity => `
        <div class="activity-item">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-description">${activity.description}</div>
        </div>
    `).join('');
}

// Notification System
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const toastBody = toast.querySelector('.toast-body');
    const toastHeader = toast.querySelector('.toast-header');
    const icon = toastHeader.querySelector('i');
    const title = toastHeader.querySelector('strong');
    
    // Update content
    toastBody.textContent = message;
    
    // Update styling based on type
    if (type === 'success') {
        icon.className = 'bi bi-check-circle-fill text-success me-2';
        title.textContent = 'Success';
    } else if (type === 'error') {
        icon.className = 'bi bi-exclamation-circle-fill text-danger me-2';
        title.textContent = 'Error';
    } else if (type === 'info') {
        icon.className = 'bi bi-info-circle-fill text-primary me-2';
        title.textContent = 'Info';
    }
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Add initial activity on load
setTimeout(() => {
    addActivity('Application initialized');
}, 100);
