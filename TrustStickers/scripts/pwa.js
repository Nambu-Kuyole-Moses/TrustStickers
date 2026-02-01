// PWA functionality
class PWAHandler {
    constructor() {
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerSW();
                this.setupInstallPrompt();
            } catch (error) {
                console.log('SW registration failed, continuing without PWA:', error);
            }
        }
    }

    async registerSW() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered: ', registration);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Service Worker update found!');
                
                newWorker.addEventListener('statechange', () => {
                    console.log('🔄 New Service Worker state:', newWorker.state);
                });
            });
            
            return registration;
        } catch (error) {
            console.log('❌ Service Worker registration failed:', error);
            throw error;
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA was installed successfully!');
            this.hideInstallPrompt();
            // Track installation in analytics
            if (window.trustStickersAnalytics) {
                window.trustStickersAnalytics.logToConsole('pwa_installed', {});
            }
        });
    }

    showInstallPrompt() {
        // Only show prompt if not already shown recently
        const lastPrompt = localStorage.getItem('trustStickersInstallPrompt');
        if (lastPrompt && Date.now() - parseInt(lastPrompt) < 7 * 24 * 60 * 60 * 1000) {
            return; // Don't show again for 7 days
        }

        // Create install prompt UI
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
            <div class="install-content">
                <div class="install-icon">🟦</div>
                <div class="install-text">
                    <strong>Install TrustStickers</strong>
                    <p>Get quick access to our sticker collection</p>
                </div>
                <div class="install-buttons">
                    <button id="installBtn" class="install-btn-primary">Install</button>
                    <button id="dismissBtn" class="install-btn-secondary">Not Now</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);

        // Add styles if not already added
        if (!document.querySelector('#install-prompt-styles')) {
            const styles = document.createElement('style');
            styles.id = 'install-prompt-styles';
            styles.textContent = `
                .install-prompt {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    padding: 1rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    max-width: 400px;
                    width: 90%;
                    animation: slideUpInstall 0.3s ease;
                    border: 1px solid #e2e8f0;
                }
                
                .install-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .install-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }
                
                .install-text {
                    flex: 1;
                }
                
                .install-text strong {
                    display: block;
                    margin-bottom: 0.25rem;
                }
                
                .install-text p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .install-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }
                
                .install-btn-primary, .install-btn-secondary {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }
                
                .install-btn-primary {
                    background: var(--gradient);
                    color: white;
                }
                
                .install-btn-secondary {
                    background: #f1f5f9;
                    color: #475569;
                }
                
                @keyframes slideUpInstall {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                
                [data-theme="dark"] .install-prompt {
                    background: var(--card-bg);
                    border-color: #374151;
                }
                
                [data-theme="dark"] .install-btn-secondary {
                    background: #374151;
                    color: #d1d5db;
                }
            `;
            document.head.appendChild(styles);
        }

        document.getElementById('installBtn').addEventListener('click', () => {
            this.installApp(deferredPrompt);
            prompt.remove();
        });
        
        document.getElementById('dismissBtn').addEventListener('click', () => {
            localStorage.setItem('trustStickersInstallPrompt', Date.now().toString());
            prompt.remove();
        });

        // Auto-dismiss after 15 seconds
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                prompt.remove();
            }
        }, 15000);
    }

    hideInstallPrompt() {
        const prompt = document.querySelector('.install-prompt');
        if (prompt) prompt.remove();
    }

    async installApp(deferredPrompt) {
        if (deferredPrompt) {
            try {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                
                if (outcome === 'accepted') {
                    localStorage.setItem('trustStickersInstallPrompt', Date.now().toString());
                }
                
                deferredPrompt = null;
            } catch (error) {
                console.log('Error during install:', error);
            }
        }
    }
}

// Initialize PWA
document.addEventListener('DOMContentLoaded', () => {
    window.trustStickersPWA = new PWAHandler();
});