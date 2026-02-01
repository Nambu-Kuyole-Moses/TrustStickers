// Ecommerce initialization
class EcommerceApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeApp();
        this.setupEventListeners();
        this.loadFeaturedProducts();
    }

    initializeApp() {
        console.log('🛒 TrustStickers Ecommerce Initialized');
        
        // Check if user is returning
        this.checkReturningUser();
        
        // Load cart count
        this.updateCartCount();
        
        // Initialize product filters
        this.initializeFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                productManager.handleSearch(e.target.value);
            }, 300));
        }

        // Category filters
        const categoryFilters = document.querySelectorAll('input[name="category"]');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                productManager.renderProducts({ category: e.target.value });
            });
        });

        // Price filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', this.debounce((e) => {
                productManager.handlePriceFilter(e.target.value);
            }, 300));
        }

        // Filter toggle for mobile
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilters();
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleFilters() {
        const filtersSidebar = document.getElementById('filtersSidebar');
        if (filtersSidebar) {
            filtersSidebar.classList.toggle('active');
        }
    }

    loadFeaturedProducts() {
        const featuredProducts = productManager.getFeaturedProducts();
        const featuredContainer = document.getElementById('featuredProducts');
        
        if (featuredContainer) {
            featuredContainer.innerHTML = '';
            featuredProducts.forEach(product => {
                const productCard = productManager.createProductCard(product);
                featuredContainer.appendChild(productCard);
            });
        }
    }

    updateCartCount() {
        cartManager.updateCartUI();
    }

    checkReturningUser() {
        const lastVisit = localStorage.getItem('trustStickersLastVisit');
        const currentVisit = new Date().toISOString();
        
        if (!lastVisit) {
            // First time visitor
            this.showWelcomeMessage();
        }
        
        localStorage.setItem('trustStickersLastVisit', currentVisit);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            productManager.showNotification('Welcome to TrustStickers! 🎉 Get 10% off your first order with code WELCOME10', 'info');
        }, 2000);
    }
}

// Initialize the ecommerce app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ecommerceApp = new EcommerceApp();
});