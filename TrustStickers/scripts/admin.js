// Admin Dashboard functionality
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupCharts();
        this.loadRecentOrders();
    }

    setupNavigation() {
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('href').substring(1);
                this.showSection(section);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Sidebar toggle for mobile
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.admin-sidebar').classList.toggle('active');
            });
        }
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(section).classList.add('active');
        
        // Update page title
        document.getElementById('pageTitle').textContent = this.getSectionTitle(section);
        
        // Load section-specific data
        this.loadSectionData(section);
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            orders: 'Order Management',
            products: 'Product Management',
            customers: 'Customer Management',
            analytics: 'Business Analytics',
            settings: 'Store Settings'
        };
        return titles[section] || 'Dashboard';
    }

    async loadDashboardData() {
        try {
            // Load stats
            const stats = await this.fetchStats();
            this.updateStats(stats);
            
            // Load recent orders
            this.loadRecentOrders();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async fetchStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalRevenue: 12540.75,
                    totalOrders: 89,
                    totalCustomers: 156,
                    totalProducts: 24,
                    pendingOrders: 12
                });
            }, 1000);
        });
    }

    updateStats(stats) {
        document.getElementById('totalRevenue').textContent = `₵${stats.totalRevenue.toLocaleString()}`;
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
        document.getElementById('totalProducts').textContent = stats.totalProducts;
        document.getElementById('pendingOrders').textContent = stats.pendingOrders;
    }

    setupCharts() {
        this.setupRevenueChart();
        this.setupProductsChart();
        this.setupSalesChart();
        this.setupCustomersChart();
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 1500, 2200, 1800, 2500],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupProductsChart() {
        const ctx = document.getElementById('productsChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Laptop Skins', 'Phone Skins', 'Tablet Skins', 'Accessories'],
                datasets: [{
                    data: [40, 35, 15, 10],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#4fd1c7'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    setupSalesChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Sales',
                    data: [4500, 5200, 4800, 6100],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    setupCustomersChart() {
        const ctx = document.getElementById('customersChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Customers',
                    data: [25, 32, 28, 41, 36, 48],
                    borderColor: '#48bb78',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async loadRecentOrders() {
        try {
            const orders = await this.fetchRecentOrders();
            this.displayRecentOrders(orders);
        } catch (error) {
            console.error('Error loading recent orders:', error);
        }
    }

    async fetchRecentOrders() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'TS12345',
                        customer: 'John Doe',
                        amount: 75.00,
                        status: 'completed',
                        date: '2024-01-15'
                    },
                    {
                        id: 'TS12346',
                        customer: 'Jane Smith',
                        amount: 45.00,
                        status: 'processing',
                        date: '2024-01-15'
                    },
                    {
                        id: 'TS12347',
                        customer: 'Mike Johnson',
                        amount: 120.00,
                        status: 'pending',
                        date: '2024-01-14'
                    }
                ]);
            }, 500);
        });
    }

    displayRecentOrders(orders) {
        const container = document.getElementById('recentOrders');
        if (!container) return;

        container.innerHTML = orders.map(order => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>Order ${order.id}</h4>
                    <p>${order.customer} • ₵${order.amount} • ${order.date}</p>
                </div>
                <span class="status-badge status-${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
        `).join('');
    }

    loadSectionData(section) {
        switch (section) {
            case 'orders':
                this.loadOrders();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    async loadOrders() {
        // Implementation for loading orders
        console.log('Loading orders...');
    }

    async loadProducts() {
        // Implementation for loading products
        console.log('Loading products...');
    }

    async loadCustomers() {
        // Implementation for loading customers
        console.log('Loading customers...');
    }

    async loadAnalytics() {
        // Implementation for loading analytics
        console.log('Loading analytics...');
    }
}

// Global admin functions
function exportOrders() {
    // Implementation for exporting orders
    console.log('Exporting orders...');
}

function showAddProductModal() {
    // Implementation for add product modal
    console.log('Showing add product modal...');
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});