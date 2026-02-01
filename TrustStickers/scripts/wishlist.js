// Complete Wishlist Management System
class WishlistManager {
    constructor() {
        this.wishlist = [];
        this.init();
    }

    init() {
        console.log('❤️ Initializing Wishlist Manager...');
        this.loadWishlist();
        this.setupEventListeners();
        this.updateWishlistUI();
        console.log('✅ Wishlist Manager initialized');
    }

    setupEventListeners() {
        // Listen for product card clicks
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            if (wishlistBtn) {
                e.preventDefault();
                const productId = this.getProductIdFromElement(wishlistBtn);
                if (productId) {
                    this.toggleWishlist(productId);
                }
            }
        });

        // Listen for quick view wishlist buttons
        document.addEventListener('click', (e) => {
            const quickWishlistBtn = e.target.closest('.quick-wishlist-btn');
            if (quickWishlistBtn) {
                e.preventDefault();
                const productId = quickWishlistBtn.dataset.productId;
                if (productId) {
                    this.toggleWishlist(parseInt(productId));
                }
            }
        });
    }

    getProductIdFromElement(element) {
        // Try different ways to get product ID
        if (element.dataset.productId) {
            return parseInt(element.dataset.productId);
        }
        
        const productCard = element.closest('.product-card, .sticker-card');
        if (productCard && productCard.dataset.productId) {
            return parseInt(productCard.dataset.productId);
        }
        
        // Fallback: parse from onclick attribute
        const onclickAttr = element.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/toggleWishlist\((\d+)\)/);
            if (match) return parseInt(match[1]);
        }
        
        return null;
    }

    toggleWishlist(productId) {
        if (!productId) {
            console.error('❌ No product ID found for wishlist toggle');
            return;
        }

        const product = window.productManager?.getProductById(productId);
        if (!product) {
            console.error('❌ Product not found:', productId);
            return;
        }

        const isInWishlist = this.isInWishlist(productId);
        
        if (isInWishlist) {
            this.removeFromWishlist(productId);
        } else {
            this.addToWishlist(product);
        }
    }

    addToWishlist(product) {
        // Check if user is logged in (for future integration)
        const userLoggedIn = window.authManager?.isAuthenticated() || false;
        
        if (!userLoggedIn) {
            // Show login prompt or add to local wishlist
            this.showLoginPrompt(() => {
                this.addToLocalWishlist(product);
            });
            return;
        }

        this.addToLocalWishlist(product);
    }

    addToLocalWishlist(product) {
        if (this.isInWishlist(product.id)) {
            this.showNotification('Product already in wishlist!', 'info');
            return;
        }

        const wishlistItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0] || 'default-product.jpg',
            category: product.category,
            addedAt: new Date().toISOString()
        };

        this.wishlist.push(wishlistItem);
        this.saveWishlist();
        this.updateWishlistUI();
        
        this.showNotification('❤️ Added to wishlist!', 'success');
        this.updateWishlistButton(product.id, true);
        
        // Track analytics
        if (window.trustStickersAnalytics) {
            window.trustStickersAnalytics.logToConsole('wishlist_added', { productId: product.id });
        }
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistUI();
        
        this.showNotification('Removed from wishlist', 'info');
        this.updateWishlistButton(productId, false);
        
        // If wishlist page is open, refresh it
        if (this.isWishlistPageOpen()) {
            this.showWishlistPage();
        }
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    loadWishlist() {
        try {
            const saved = localStorage.getItem('trustStickersWishlist');
            if (saved) {
                this.wishlist = JSON.parse(saved);
                console.log('❤️ Loaded wishlist:', this.wishlist.length, 'items');
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            this.wishlist = [];
        }
    }

    saveWishlist() {
        try {
            localStorage.setItem('trustStickersWishlist', JSON.stringify(this.wishlist));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }

    updateWishlistUI() {
        // Update wishlist button in navbar
        this.updateNavWishlistCount();
        
        // Update all wishlist buttons on product cards
        this.updateAllWishlistButtons();
        
        // Update wishlist page if open
        if (this.isWishlistPageOpen()) {
            this.showWishlistPage();
        }
    }

    updateNavWishlistCount() {
        const wishlistCount = document.getElementById('wishlistCount');
        const navWishlistBtn = document.getElementById('wishlistBtn');
        
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
        
        // Update nav button title
        if (navWishlistBtn) {
            navWishlistBtn.title = `Wishlist (${this.wishlist.length} items)`;
        }
    }

    updateAllWishlistButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = this.getProductIdFromElement(btn);
            if (productId) {
                const isInWishlist = this.isInWishlist(productId);
                this.updateWishlistButtonState(btn, isInWishlist);
            }
        });
    }

    updateWishlistButton(productId, isInWishlist) {
        const buttons = document.querySelectorAll(`[data-product-id="${productId}"], .wishlist-btn`);
        
        buttons.forEach(btn => {
            if (this.getProductIdFromElement(btn) === productId) {
                this.updateWishlistButtonState(btn, isInWishlist);
            }
        });
    }

    updateWishlistButtonState(button, isInWishlist) {
        const icon = button.querySelector('i');
        if (icon) {
            if (isInWishlist) {
                icon.className = 'fas fa-heart';
                icon.style.color = '#e53e3e';
                button.title = 'Remove from wishlist';
            } else {
                icon.className = 'far fa-heart';
                icon.style.color = '';
                button.title = 'Add to wishlist';
            }
        }
        
        // Add pulse animation
        button.classList.add('wishlist-pulse');
        setTimeout(() => {
            button.classList.remove('wishlist-pulse');
        }, 600);
    }

    showLoginPrompt(callback) {
        // Create a beautiful login prompt modal
        const modal = document.createElement('div');
        modal.className = 'wishlist-login-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="modal-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>Save to Wishlist</h3>
                <p>Create an account to save items to your wishlist and access them from any device!</p>
                <div class="modal-actions">
                    <button class="btn-primary" id="wishlistLoginBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        Login / Register
                    </button>
                    <button class="btn-secondary" id="wishlistContinueBtn">
                        Continue without saving
                    </button>
                </div>
                <p class="modal-note">You can always create an account later</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Add styles if not exists
        if (!document.querySelector('#wishlist-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'wishlist-modal-styles';
            styles.textContent = `
                .wishlist-login-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 4000;
                }
                .wishlist-login-modal .modal-content {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                    position: relative;
                }
                [data-theme="dark"] .wishlist-login-modal .modal-content {
                    background: var(--card-bg);
                    color: var(--text-dark);
                }
                .wishlist-login-modal .close-modal {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-light);
                }
                .wishlist-login-modal .modal-icon {
                    font-size: 4rem;
                    color: #e53e3e;
                    margin-bottom: 1rem;
                }
                .wishlist-login-modal h3 {
                    margin-bottom: 1rem;
                    color: var(--text-dark);
                }
                .wishlist-login-modal p {
                    margin-bottom: 2rem;
                    color: var(--text-light);
                    line-height: 1.5;
                }
                .wishlist-login-modal .modal-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .wishlist-login-modal .btn-primary,
                .wishlist-login-modal .btn-secondary {
                    padding: 1rem;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .wishlist-login-modal .btn-primary {
                    background: var(--gradient);
                    color: white;
                }
                .wishlist-login-modal .btn-secondary {
                    background: var(--card-bg);
                    color: var(--text-dark);
                    border: 2px solid var(--border-color);
                }
                .wishlist-login-modal .modal-note {
                    font-size: 0.875rem;
                    color: var(--text-light);
                }
            `;
            document.head.appendChild(styles);
        }

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#wishlistLoginBtn').addEventListener('click', () => {
            modal.remove();
            if (window.authManager) {
                window.authManager.showAuthModal('login');
            }
        });

        modal.querySelector('#wishlistContinueBtn').addEventListener('click', () => {
            modal.remove();
            if (callback) callback();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showWishlistPage() {
        // Create wishlist page/modal
        const existingPage = document.getElementById('wishlistPage');
        if (existingPage) {
            existingPage.remove();
        }

        const wishlistPage = document.createElement('div');
        wishlistPage.id = 'wishlistPage';
        wishlistPage.className = 'wishlist-page';
        wishlistPage.innerHTML = this.generateWishlistHTML();
        
        document.body.appendChild(wishlistPage);

        // Add event listeners for wishlist page
        this.setupWishlistPageEvents();
    }

    generateWishlistHTML() {
        if (this.wishlist.length === 0) {
            return `
                <div class="wishlist-empty">
                    <div class="empty-icon">
                        <i class="far fa-heart"></i>
                    </div>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Start adding products you love to your wishlist and save them for later!</p>
                    <button class="btn-primary" onclick="window.wishlistManager.closeWishlist()">
                        <i class="fas fa-shopping-bag"></i>
                        Continue Shopping
                    </button>
                </div>
            `;
        }

        return `
            <div class="wishlist-container">
                <div class="wishlist-header">
                    <h2>My Wishlist</h2>
                    <button class="close-wishlist" onclick="window.wishlistManager.closeWishlist()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-stats">
                    <span>${this.wishlist.length} ${this.wishlist.length === 1 ? 'item' : 'items'}</span>
                </div>
                <div class="wishlist-items">
                    ${this.wishlist.map(item => `
                        <div class="wishlist-item" data-product-id="${item.id}">
                            <div class="wishlist-item-image">
                                <img src="/assets/images/${item.image}" alt="${item.name}" 
                                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UcnVzdFN0aWNrZXJzPC90ZXh0Pjwvc3ZnPg=='">
                            </div>
                            <div class="wishlist-item-info">
                                <h4 class="wishlist-item-name">${item.name}</h4>
                                <span class="wishlist-item-category">${item.category}</span>
                                <div class="wishlist-item-price">
                                    ${item.originalPrice > item.price ? 
                                        `<span class="original-price">₵${item.originalPrice}</span>` : ''}
                                    <span class="current-price">₵${item.price}</span>
                                </div>
                            </div>
                            <div class="wishlist-item-actions">
                                <button class="btn-primary add-to-cart-wishlist" 
                                        onclick="window.wishlistManager.addToCartFromWishlist(${item.id})">
                                    <i class="fas fa-shopping-cart"></i>
                                    Add to Cart
                                </button>
                                <button class="btn-secondary remove-wishlist" 
                                        onclick="window.wishlistManager.removeFromWishlist(${item.id})">
                                    <i class="fas fa-trash"></i>
                                    Remove
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="wishlist-footer">
                    <button class="btn-primary" onclick="window.wishlistManager.addAllToCart()">
                        <i class="fas fa-shopping-cart"></i>
                        Add All to Cart (₵${this.getWishlistTotal()})
                    </button>
                </div>
            </div>
        `;
    }

    setupWishlistPageEvents() {
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeWishlist();
            }
        });

        // Close on backdrop click
        const wishlistPage = document.getElementById('wishlistPage');
        if (wishlistPage) {
            wishlistPage.addEventListener('click', (e) => {
                if (e.target === wishlistPage) {
                    this.closeWishlist();
                }
            });
        }
    }

    closeWishlist() {
        const wishlistPage = document.getElementById('wishlistPage');
        if (wishlistPage) {
            wishlistPage.remove();
        }
    }

    isWishlistPageOpen() {
        return !!document.getElementById('wishlistPage');
    }

    getWishlistTotal() {
        return this.wishlist.reduce((total, item) => total + item.price, 0).toFixed(2);
    }

    addToCartFromWishlist(productId) {
        if (window.cartManager) {
            window.cartManager.addToCart(productId);
            this.showNotification('Added to cart!', 'success');
        } else {
            this.showNotification('Cart feature not available', 'error');
        }
    }

    addAllToCart() {
        if (!window.cartManager) {
            this.showNotification('Cart feature not available', 'error');
            return;
        }

        let addedCount = 0;
        this.wishlist.forEach(item => {
            window.cartManager.addToCart(item.id);
            addedCount++;
        });

        this.showNotification(`Added ${addedCount} items to cart!`, 'success');
    }

    showNotification(message, type = 'info') {
        if (window.productManager) {
            window.productManager.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }

    // Public methods
    getWishlist() {
        return this.wishlist;
    }

    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.updateWishlistUI();
        this.showNotification('Wishlist cleared', 'info');
    }
}

// Initialize wishlist manager
document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
});

// Global function for HTML onclick
function toggleWishlist(productId) {
    if (window.wishlistManager) {
        window.wishlistManager.toggleWishlist(productId);
    }
}

function showWishlist() {
    if (window.wishlistManager) {
        window.wishlistManager.showWishlistPage();
    }
}