// Complete Theme Manager - Works on entire site
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('trustStickersTheme') || 'light';
        this.init();
    }

    init() {
        console.log('🎨 Initializing Theme Manager...');
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupThemeStyles();
        console.log('✅ Theme Manager initialized');
    }

    applyTheme(theme) {
        console.log('🎨 Applying theme:', theme);
        
        // Remove any existing theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        
        // Add the new theme class
        document.documentElement.classList.add(`theme-${theme}`);
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('trustStickersTheme', theme);
        
        // Update toggle button
        this.updateToggleButton(theme);
        
        // Update meta theme color
        this.updateMetaTheme(theme);
        
        // Apply theme to all dynamically created elements
        this.applyThemeToDynamicElements(theme);
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        } else {
            console.error('❌ Theme toggle button not found');
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('trustStickersTheme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setupThemeStyles() {
        // Add global theme transition
        const style = document.createElement('style');
        style.id = 'theme-transitions';
        style.textContent = `
            * {
                transition: background-color 0.3s ease, 
                          color 0.3s ease, 
                          border-color 0.3s ease,
                          box-shadow 0.3s ease !important;
            }
            
            /* Quick transitions for these elements */
            img, 
            video, 
            iframe,
            .no-transition {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('🔄 Toggling theme from', this.currentTheme, 'to', newTheme);
        
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        
        // Add animation to toggle button
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        }
        
        this.showThemeNotification(newTheme);
    }

    updateToggleButton(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                icon.title = 'Switch to light mode';
            } else {
                icon.className = 'fas fa-moon';
                icon.title = 'Switch to dark mode';
            }
        }
    }

    updateMetaTheme(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#667eea');
    }

    applyThemeToDynamicElements(theme) {
        // This will be called whenever new elements are added to the page
        // You can add specific element selectors here if needed
        console.log('🎨 Applying theme to dynamic elements');
    }

    showThemeNotification(theme) {
        const message = theme === 'dark' ? 
            'Dark mode activated 🌙' : 'Light mode activated ☀️';
        
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.theme-notification').forEach(note => note.remove());
        
        const notification = document.createElement('div');
        notification.className = `theme-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-dark);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#48bb78' : '#4299e1'};
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});