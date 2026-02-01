// SIMPLE WORKING NAVIGATION - No dependencies
console.log('🚀 Loading Simple Navigation...');

class SimpleNavigation {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎯 Initializing Simple Navigation...');
        this.setupMobileMenu();
        this.setupActionButtons();
        this.testAllElements();
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            console.log('📱 Setting up mobile menu...');
            
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Mobile menu clicked!');
                
                // Toggle classes
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Update ARIA attributes
                const isExpanded = navMenu.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
                
                // Toggle body scroll
                document.body.style.overflow = isExpanded ? 'hidden' : '';
                
                this.showNotification('📱 Mobile menu ' + (isExpanded ? 'opened' : 'closed'), 'info');
            });

            // Close menu when clicking links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        } else {
            console.error('❌ Mobile menu elements not found');
        }
    }

    setupActionButtons() {
        console.log('🔧 Setting up action buttons...');

        // Search Button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔍 Search clicked!');
                this.showNotification('🔍 Search feature coming soon!', 'info');
            });
        }

        // Wishlist Button
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('❤️ Wishlist clicked!');
                this.showNotification('❤️ Wishlist feature coming soon!', 'info');
            });
        }

        // Cart Button
        const cartBtn = document.getElementById('cartToggle');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🛒 Cart clicked!');
                this.showNotification('🛒 Cart feature coming soon!', 'info');
            });
        }

        // Login Button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('👤 Login clicked!');
                this.showNotification('👤 Login feature coming soon!', 'info');
            });
        }

        // User Dropdown
        const userToggle = document.getElementById('userToggle');
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (userToggle && dropdownMenu) {
            userToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('👤 User dropdown clicked!');
                dropdownMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('active');
            });
        }

        // Admin Button
        const adminBtn = document.querySelector('a[href="/admin.html"]');
        if (adminBtn) {
            adminBtn.addEventListener('click', (e) => {
                console.log('⚙️ Admin button clicked!');
                // Let the link work normally
            });
        }
    }

    showNotification(message, type = 'info') {
        console.log('💬 Showing notification:', message);
        
        // Remove any existing notifications
        document.querySelectorAll('.simple-notification').forEach(note => note.remove());
        
        const notification = document.createElement('div');
        notification.className = `simple-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        // Add inline styles to ensure it works
        notification.style.cssText = `
            position: fixed !important;
            top: 100px !important;
            right: 20px !important;
            background: white !important;
            padding: 1rem 1.5rem !important;
            border-radius: 10px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.75rem !important;
            z-index: 10000 !important;
            border-left: 4px solid ${type === 'success' ? '#48bb78' : '#4299e1'} !important;
            color: #2d3748 !important;
            font-weight: 500 !important;
            animation: slideInRight 0.3s ease !important;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    testAllElements() {
        console.log('🧪 Testing all navigation elements...');
        
        const testElements = {
            'Mobile Toggle': document.getElementById('navToggle'),
            'Nav Menu': document.getElementById('navMenu'),
            'Search Button': document.getElementById('searchBtn'),
            'Wishlist Button': document.getElementById('wishlistBtn'),
            'Cart Button': document.getElementById('cartToggle'),
            'Login Button': document.getElementById('loginBtn'),
            'User Toggle': document.getElementById('userToggle'),
            'Dropdown Menu': document.getElementById('dropdownMenu')
        };

        let allWorking = true;
        
        for (const [name, element] of Object.entries(testElements)) {
            if (element) {
                console.log(`✅ ${name}: FOUND -`, element);
                
                // Test if element is clickable
                if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    console.log(`   ↳ Clickable: YES`);
                } else {
                    console.log(`   ↳ Clickable: NO (but that's OK)`);
                }
            } else {
                console.error(`❌ ${name}: NOT FOUND`);
                allWorking = false;
            }
        }

        if (allWorking) {
            console.log('🎉 ALL NAVIGATION ELEMENTS ARE WORKING!');
            this.showNotification('🎉 Navigation is working!', 'success');
        } else {
            console.error('💥 Some navigation elements are missing!');
        }
    }
}

// Initialize immediately when script loads
console.log('🚀 Creating SimpleNavigation instance...');
window.simpleNav = new SimpleNavigation();

// Also initialize when DOM is ready as backup
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Ready - Navigation should already be working');
    
    // Test if navigation is working
    setTimeout(() => {
        if (window.simpleNav) {
            console.log('✅ SimpleNavigation is active and ready!');
        } else {
            console.error('❌ SimpleNavigation failed to initialize');
        }
    }, 100);
});

// Global function for testing
function testNavigation() {
    console.log('🔧 Manual navigation test...');
    if (window.simpleNav) {
        window.simpleNav.testAllElements();
    } else {
        console.error('❌ SimpleNavigation not available');
    }
}

// Make it globally available
window.testNavigation = testNavigation;