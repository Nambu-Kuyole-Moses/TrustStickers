// Advanced shopping cart system
class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.updateCartUI();
        this.setupCartEvents();
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('trustStickersCart') || '[]');
    }

    saveCart() {
        localStorage.setItem('trustStickersCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    addToCart(productId, quantity = 1) {
        const product = productManager.getProductById(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                size: '13-inch', // Default size
                color: product.colors[0] // Default color
            });
        }

        this.saveCart();
        productManager.showNotification('Product added to cart', 'success');
        this.showCartSidebar();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        productManager.showNotification('Product removed from cart', 'info');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) {
            cartCount.textContent = this.getCartCount();
            cartCount.style.display = this.getCartCount() > 0 ? 'flex' : 'none';
        }

        if (cartTotal) {
            cartTotal.textContent = `₵${this.getCartTotal().toFixed(2)}`;
        }

        this.updateCartItems();
    }

    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button onclick="hideCart()">Continue Shopping</button>
                </div>
            `;
            return;
        }

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="/assets/images/${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-options">
                        <span>Size: ${item.size}</span>
                        <span>Color: ${item.color}</span>
                    </div>
                    <div class="cart-item-price">₵${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="cartManager.decreaseQuantity(${item.id})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cartManager.increaseQuantity(${item.id})">+</button>
                    </div>
                    <button class="remove-item" onclick="cartManager.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    setupCartEvents() {
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                this.showCartSidebar();
            });
        }

        // Close cart
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.hideCartSidebar();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    showCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            productManager.showNotification('Your cart is empty', 'info');
            return;
        }

        this.hideCartSidebar();
        // Redirect to checkout page or show checkout modal
        this.showCheckoutModal();
    }

    showCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2>Checkout</h2>
                <div class="checkout-summary">
                    <h3>Order Summary</h3>
                    ${this.cart.map(item => `
                        <div class="checkout-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₵${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <div class="checkout-total">
                        <strong>Total: ₵${this.getCartTotal().toFixed(2)}</strong>
                    </div>
                </div>
                <form id="checkoutForm" class="checkout-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Delivery Address</label>
                        <textarea name="address" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <select name="paymentMethod" required>
                            <option value="">Select payment method</option>
                            <option value="mobile_money">Mobile Money</option>
                            <option value="cash">Cash on Delivery</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                    <button type="submit" class="submit-order-btn">
                        Place Order - ₵${this.getCartTotal().toFixed(2)}
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#checkoutForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder(new FormData(form));
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

    async processOrder(formData) {
        const orderData = {
            items: this.cart,
            total: this.getCartTotal(),
            customer: Object.fromEntries(formData),
            orderNumber: `TS${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                this.cart = [];
                this.saveCart();
                this.showOrderConfirmation(orderData);
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Order error:', error);
            productManager.showNotification('Failed to place order. Please try again.', 'error');
        }
    }

    showOrderConfirmation(orderData) {
        const modal = document.querySelector('.checkout-modal');
        if (modal) modal.remove();

        const confirmation = document.createElement('div');
        confirmation.className = 'order-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. Your order number is <strong>${orderData.orderNumber}</strong></p>
                <div class="order-details">
                    <p>We'll contact you at ${orderData.customer.phone} for delivery details.</p>
                    <p>Total: <strong>₵${orderData.total.toFixed(2)}</strong></p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Continue Shopping</button>
            </div>
        `;

        document.body.appendChild(confirmation);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Global functions for HTML onclick
function showCart() {
    cartManager.showCartSidebar();
}

function hideCart() {
    cartManager.hideCartSidebar();
}