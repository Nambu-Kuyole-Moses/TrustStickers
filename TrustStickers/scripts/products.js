// Advanced product management system
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = ['laptop', 'phone', 'tablet', 'accessories'];
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupSearch();
        this.setupFilters();
    }

    loadProducts() {
        this.products = [
            {
                id: 1,
                name: "Abstract Waves Laptop Skin",
                price: 25.00,
                originalPrice: 30.00,
                category: "laptop",
                subcategory: "abstract",
                tags: ["modern", "artistic", "blue"],
                images: ["abstract-waves-1.jpg", "abstract-waves-2.jpg"],
                description: "Modern abstract wave design with vibrant colors",
                features: ["Matte finish", "Easy application", "Removable"],
                sizes: ["13-inch", "15-inch", "17-inch"],
                colors: ["Blue", "Purple", "Multicolor"],
                inStock: true,
                stockQuantity: 50,
                rating: 4.5,
                reviewCount: 23,
                featured: true,
                createdAt: "2024-01-15"
            },
            {
                id: 2,
                name: "Geometric Pattern Phone Skin",
                price: 18.00,
                originalPrice: 22.00,
                category: "phone",
                subcategory: "geometric",
                tags: ["minimalist", "pattern", "black"],
                images: ["geometric-pattern-1.jpg"],
                description: "Clean geometric patterns for a minimalist look",
                features: ["Glossy finish", "Precision cut", "Protective"],
                sizes: ["iPhone 15", "Samsung S24", "Google Pixel"],
                colors: ["Black", "White", "Gold"],
                inStock: true,
                stockQuantity: 100,
                rating: 4.2,
                reviewCount: 15,
                featured: false,
                createdAt: "2024-01-10"
            },
            {
                id: 3,
                name: "Nature Inspired MacBook Skin",
                price: 30.00,
                originalPrice: 35.00,
                category: "laptop",
                subcategory: "nature",
                tags: ["nature", "forest", "green"],
                images: ["nature-inspired-1.jpg", "nature-inspired-2.jpg"],
                description: "Beautiful nature scenes with forest motifs",
                features: ["Matte finish", "Eco-friendly", "Durable"],
                sizes: ["13-inch", "15-inch", "16-inch"],
                colors: ["Green", "Brown", "Earth Tones"],
                inStock: true,
                stockQuantity: 25,
                rating: 4.8,
                reviewCount: 31,
                featured: true,
                createdAt: "2024-01-20"
            },
            {
                id: 4,
                name: "Gaming Theme Laptop Skin",
                price: 35.00,
                originalPrice: 40.00,
                category: "laptop",
                subcategory: "gaming",
                tags: ["gaming", "cyberpunk", "neon"],
                images: ["gaming-theme-1.jpg"],
                description: "Cool gaming graphics with neon accents",
                features: ["Glossy finish", "Gamer design", "High-quality"],
                sizes: ["13-inch", "15-inch", "17-inch", "Gaming Laptops"],
                colors: ["Neon Pink", "Cyber Blue", "Matrix Green"],
                inStock: true,
                stockQuantity: 30,
                rating: 4.6,
                reviewCount: 18,
                featured: true,
                createdAt: "2024-01-25"
            },
            {
                id: 5,
                name: "Minimalist Black Phone Skin",
                price: 16.00,
                originalPrice: 20.00,
                category: "phone",
                subcategory: "minimalist",
                tags: ["minimalist", "elegant", "sleek"],
                images: ["minimalist-black-1.jpg"],
                description: "Sleek minimalist design for professional look",
                features: ["Matte black", "Slim profile", "Scratch-resistant"],
                sizes: ["iPhone 15", "Samsung S24", "OnePlus"],
                colors: ["Black", "Dark Gray", "Charcoal"],
                inStock: true,
                stockQuantity: 75,
                rating: 4.3,
                reviewCount: 12,
                featured: false,
                createdAt: "2024-01-18"
            },
            {
                id: 6,
                name: "Colorful Abstract Phone Skin",
                price: 20.00,
                originalPrice: 25.00,
                category: "phone",
                subcategory: "abstract",
                tags: ["colorful", "abstract", "vibrant"],
                images: ["colorful-abstract-1.jpg"],
                description: "Vibrant abstract art with colorful patterns",
                features: ["Glossy finish", "Vibrant colors", "Easy to clean"],
                sizes: ["iPhone 15", "Samsung S24", "Google Pixel"],
                colors: ["Multicolor", "Rainbow", "Pastel"],
                inStock: true,
                stockQuantity: 60,
                rating: 4.4,
                reviewCount: 9,
                featured: false,
                createdAt: "2024-01-22"
            }
        ];
    }

    getProducts(filters = {}) {
        let filteredProducts = [...this.products];

        // Category filter
        if (filters.category && filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === filters.category
            );
        }

        // Price filter
        if (filters.minPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= filters.minPrice
            );
        }

        if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price <= filters.maxPrice
            );
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Sort products
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                default:
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            }
        }

        return filteredProducts;
    }

    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    getCategories() {
        return this.categories;
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    setupFilters() {
        // Price range filter
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.handlePriceFilter(e.target.value);
            });
        }

        // Sort filter
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
    }

    handleSearch(searchTerm) {
        const filters = { search: searchTerm };
        this.renderProducts(filters);
    }

    handlePriceFilter(maxPrice) {
        const filters = { maxPrice: parseFloat(maxPrice) };
        this.renderProducts(filters);
    }

    handleSort(sortBy) {
        const filters = { sortBy };
        this.renderProducts(filters);
    }

    renderProducts(filters = {}) {
        const products = this.getProducts(filters);
        const galleryGrid = document.getElementById('galleryGrid');
        
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        if (products.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            galleryGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {

         const isInWishlist = window.wishlistManager?.isInWishlist(product.id) || false;
    
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.originalPrice > product.price ? 
                        `<div class="discount-badge">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</div>` : ''}
                    ${product.featured ? `<div class="featured-badge">Featured</div>` : ''}
                    <div class="product-actions">
                        <button class="wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}" 
                                onclick="toggleWishlist(${product.id})"
                                data-product-id="${product.id}"
                                title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="quick-view-btn" onclick="productManager.quickView(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <img src="/assets/images/${product.images[0]}" alt="${product.name}">
                </div>
                <!-- rest of product card -->
            </div>
        `;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${product.originalPrice > product.price ? 
                    `<div class="discount-badge">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</div>` : ''}
                ${product.featured ? `<div class="featured-badge">Featured</div>` : ''}
                <div class="product-actions">
                    <button class="wishlist-btn" onclick="productManager.toggleWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="quick-view-btn" onclick="productManager.quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <img src="/assets/images/${product.images[0]}" alt="${product.name}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UcnVzdFN0aWNrZXJzPC90ZXh0Pjwvc3ZnPg=='">
            </div>
            <div class="product-info">
                <div class="product-category">${this.formatCategory(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${this.generateStarRating(product.rating)}
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">₵${product.originalPrice}</span>` : ''}
                    <span class="current-price">₵${product.price}</span>
                </div>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                </div>
                <button class="add-to-cart-btn" onclick="cartManager.addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        `;
        return card;
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    generateStarRating(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push('<i class="fas fa-star"></i>');
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push('<i class="fas fa-star-half-alt"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }

        return stars.join('');
    }

    toggleWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('trustStickersWishlist') || '[]');
        const index = wishlist.indexOf(productId);

        if (index > -1) {
            wishlist.splice(index, 1);
            this.showNotification('Removed from wishlist', 'info');
        } else {
            wishlist.push(productId);
            this.showNotification('Added to wishlist', 'success');
        }

        localStorage.setItem('trustStickersWishlist', JSON.stringify(wishlist));
        this.updateWishlistButton(productId);
    }

    updateWishlistButton(productId) {
        const wishlist = JSON.parse(localStorage.getItem('trustStickersWishlist') || '[]');
        const isInWishlist = wishlist.includes(productId);
        
        const button = document.querySelector(`.wishlist-btn[onclick*="${productId}"] i`);
        if (button) {
            button.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        }
    }

    quickView(productId) {
        const product = this.getProductById(productId);
        if (product) {
            this.showQuickViewModal(product);
        }
    }

    showQuickViewModal(product) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="product-detail">
                    <div class="product-images">
                        <img src="/assets/images/${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="product-details">
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            ${this.generateStarRating(product.rating)}
                            <span>${product.rating} (${product.reviewCount} reviews)</span>
                        </div>
                        <div class="product-price">
                            ${product.originalPrice > product.price ? 
                                `<span class="original-price">₵${product.originalPrice}</span>` : ''}
                            <span class="current-price">₵${product.price}</span>
                        </div>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="product-options">
                            <div class="option-group">
                                <label>Size:</label>
                                <select id="productSize">
                                    ${product.sizes.map(size => 
                                        `<option value="${size}">${size}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="option-group">
                                <label>Color:</label>
                                <select id="productColor">
                                    ${product.colors.map(color => 
                                        `<option value="${color}">${color}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="product-features">
                            <h4>Features:</h4>
                            <ul>
                                ${product.features.map(feature => 
                                    `<li>${feature}</li>`
                                ).join('')}
                            </ul>
                        </div>

                        <div class="product-actions">
                            <div class="quantity-selector">
                                <button onclick="cartManager.decreaseQuantity(${product.id})">-</button>
                                <span id="quantity-${product.id}">1</span>
                                <button onclick="cartManager.increaseQuantity(${product.id})">+</button>
                            </div>
                            <button class="add-to-cart-btn large" onclick="cartManager.addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart - ₵${product.price}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize product manager
const productManager = new ProductManager();