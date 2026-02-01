// User authentication and account management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.setupAuthUI();
        this.setupEventListeners();
    }

    setupAuthUI() {
        this.updateAuthUI();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(new FormData(registerForm));
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    async handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            this.showLoading('Logging in...');
            
            // Simulate API call
            const user = await this.authenticateUser(email, password);
            
            this.currentUser = user;
            this.saveUser(user);
            this.updateAuthUI();
            this.showNotification('Login successful!', 'success');
            this.hideAuthModal();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(formData) {
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            address: formData.get('address')
        };

        try {
            this.showLoading('Creating account...');
            
            // Simulate API call
            const user = await this.registerUser(userData);
            
            this.currentUser = user;
            this.saveUser(user);
            this.updateAuthUI();
            this.showNotification('Account created successfully!', 'success');
            this.hideAuthModal();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('trustStickersUser');
        this.updateAuthUI();
        this.showNotification('Logged out successfully', 'info');
    }

    async authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('trustStickersUsers') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('trustStickersUsers') || '[]');
                
                // Check if user already exists
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('User already exists with this email'));
                    return;
                }

                const newUser = {
                    id: 'user_' + Date.now(),
                    ...userData,
                    createdAt: new Date().toISOString(),
                    orders: [],
                    wishlist: [],
                    addresses: [{
                        type: 'home',
                        address: userData.address,
                        isDefault: true
                    }]
                };

                users.push(newUser);
                localStorage.setItem('trustStickersUsers', JSON.stringify(users));
                
                resolve(newUser);
            }, 1000);
        });
    }

    loadUser() {
        try {
            const userData = localStorage.getItem('trustStickersUser');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            this.currentUser = null;
        }
    }

    saveUser(user) {
        localStorage.setItem('trustStickersUser', JSON.stringify(user));
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            // User is logged in
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            // User is logged out
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    showAuthModal(type = 'login') {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="auth-tabs">
                    <button class="auth-tab ${type === 'login' ? 'active' : ''}" data-tab="login">Login</button>
                    <button class="auth-tab ${type === 'register' ? 'active' : ''}" data-tab="register">Register</button>
                </div>
                
                <div class="auth-content">
                    <form id="loginForm" class="auth-form ${type === 'login' ? 'active' : ''}">
                        <h3>Welcome Back</h3>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit" class="auth-btn">Login</button>
                        <p class="auth-switch">Don't have an account? <a href="#" onclick="showRegister()">Register</a></p>
                    </form>
                    
                    <form id="registerForm" class="auth-form ${type === 'register' ? 'active' : ''}">
                        <h3>Create Account</h3>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea name="address" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required minlength="6">
                        </div>
                        <button type="submit" class="auth-btn">Create Account</button>
                        <p class="auth-switch">Already have an account? <a href="#" onclick="showLogin()">Login</a></p>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Tab switching
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchAuthTab(tabName);
            });
        });

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    switchAuthTab(tabName) {
        const forms = document.querySelectorAll('.auth-form');
        const tabs = document.querySelectorAll('.auth-tab');

        forms.forEach(form => form.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));

        document.getElementById(tabName + 'Form').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    hideAuthModal() {
        const modal = document.querySelector('.auth-modal');
        if (modal) modal.remove();
    }

    showLoading(message) {
        // Implementation for loading indicator
        console.log('Loading:', message);
    }

    hideLoading() {
        // Implementation to hide loading indicator
    }

    showNotification(message, type) {
        productManager.showNotification(message, type);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    addToWishlist(productId) {
        if (!this.isAuthenticated()) {
            this.showAuthModal();
            return false;
        }

        const wishlist = this.currentUser.wishlist || [];
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            this.currentUser.wishlist = wishlist;
            this.saveUser(this.currentUser);
            this.showNotification('Added to wishlist', 'success');
            return true;
        }
        return false;
    }

    removeFromWishlist(productId) {
        if (this.isAuthenticated()) {
            const wishlist = this.currentUser.wishlist || [];
            const index = wishlist.indexOf(productId);
            if (index > -1) {
                wishlist.splice(index, 1);
                this.currentUser.wishlist = wishlist;
                this.saveUser(this.currentUser);
                this.showNotification('Removed from wishlist', 'info');
            }
        }
    }

    getWishlist() {
        return this.isAuthenticated() ? this.currentUser.wishlist || [] : [];
    }

    getOrderHistory() {
        return this.isAuthenticated() ? this.currentUser.orders || [] : [];
    }
}

// Global functions for HTML
function showLogin() {
    authManager.showAuthModal('login');
}

function showRegister() {
    authManager.showAuthModal('register');
}

function showUserProfile() {
    // Implementation for user profile modal
    console.log('Show user profile');
}

// Initialize auth manager
const authManager = new AuthManager();