import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../public'));
app.use('/utilities', express.static(path.join(__dirname, '../utilities')));

// Data file paths
const ordersFile = path.join(__dirname, 'orders.json');
const productsFile = path.join(__dirname, 'products.json');
const customersFile = path.join(__dirname, 'customers.json');

// Initialize data files
const initializeDataFiles = () => {
    // Orders file
    if (!fs.existsSync(ordersFile)) {
        const initialOrders = {
            orders: [],
            analytics: {
                totalOrders: 0,
                completedOrders: 0,
                revenue: 0,
                averageOrderValue: 0,
                popularProducts: []
            }
        };
        fs.writeFileSync(ordersFile, JSON.stringify(initialOrders, null, 2));
    }

    // Products file
    if (!fs.existsSync(productsFile)) {
        const initialProducts = {
            products: [
                {
                    id: 1,
                    name: "Abstract Waves Laptop Skin",
                    price: 25.00,
                    originalPrice: 30.00,
                    category: "laptop",
                    description: "Modern abstract wave design with vibrant colors",
                    features: ["Matte finish", "Easy application", "Removable"],
                    sizes: ["13-inch", "15-inch", "17-inch"],
                    colors: ["Blue", "Purple", "Multicolor"],
                    inStock: true,
                    stockQuantity: 50,
                    rating: 4.5,
                    reviewCount: 23,
                    featured: true,
                    images: ["abstract-waves-1.jpg"],
                    tags: ["modern", "artistic", "blue"]
                },
                // Add more sample products...
            ],
            categories: ["laptop", "phone", "tablet", "accessories"]
        };
        fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2));
    }

    // Customers file
    if (!fs.existsSync(customersFile)) {
        const initialCustomers = {
            customers: [],
            analytics: {
                totalCustomers: 0,
                activeCustomers: 0
            }
        };
        fs.writeFileSync(customersFile, JSON.stringify(initialCustomers, null, 2));
    }
};

initializeDataFiles();

// Helper functions
const readJSONFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Enhanced Products API
app.get('/api/products', (req, res) => {
    try {
        const { category, featured, search, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = req.query;
        const data = readJSONFile(productsFile);
        let products = [...data.products];

        // Apply filters
        if (category && category !== 'all') {
            products = products.filter(product => product.category === category);
        }

        if (featured === 'true') {
            products = products.filter(product => product.featured);
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        if (minPrice) {
            products = products.filter(product => product.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            products = products.filter(product => product.price <= parseFloat(maxPrice));
        }

        // Apply sorting
        if (sortBy) {
            switch (sortBy) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    products.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                default:
                    products.sort((a, b) => a.name.localeCompare(b.name));
            }
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            total: products.length,
            page: parseInt(page),
            totalPages: Math.ceil(products.length / limit),
            categories: data.categories
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const data = readJSONFile(productsFile);
        const product = data.products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

app.get('/api/categories', (req, res) => {
    try {
        const data = readJSONFile(productsFile);
        res.json(data.categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Enhanced Orders API
app.post('/api/orders', (req, res) => {
    try {
        const orderData = {
            ...req.body,
            id: uuidv4(),
            orderNumber: `TS${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const data = readJSONFile(ordersFile);
        data.orders.push(orderData);

        // Update analytics
        data.analytics.totalOrders++;
        data.analytics.revenue += orderData.total;
        data.analytics.averageOrderValue = data.analytics.revenue / data.analytics.totalOrders;

        // Update popular products
        orderData.items.forEach(item => {
            const popularProduct = data.analytics.popularProducts.find(p => p.id === item.id);
            if (popularProduct) {
                popularProduct.orders++;
            } else {
                data.analytics.popularProducts.push({
                    id: item.id,
                    name: item.name,
                    orders: 1
                });
            }
        });

        writeJSONFile(ordersFile, data);

        console.log('🛒 New order received:', orderData.orderNumber);

        res.json({
            success: true,
            message: 'Order received successfully',
            orderId: orderData.id,
            orderNumber: orderData.orderNumber
        });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save order'
        });
    }
});

app.get('/api/orders/:id', (req, res) => {
    try {
        const data = readJSONFile(ordersFile);
        const order = data.orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

app.patch('/api/orders/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const data = readJSONFile(ordersFile);
        const order = data.orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        if (status === 'completed') {
            data.analytics.completedOrders++;
        }
        
        writeJSONFile(ordersFile, data);
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Analytics API
app.post('/api/analytics/event', (req, res) => {
    try {
        const { event, data, timestamp } = req.body;
        
        console.log('📊 Analytics Event:', event, data);
        
        res.json({
            success: true,
            message: 'Analytics event recorded',
            eventId: Date.now().toString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to record analytics event'
        });
    }
});

app.get('/api/analytics/summary', (req, res) => {
    try {
        const ordersData = readJSONFile(ordersFile);
        const productsData = readJSONFile(productsFile);
        const customersData = readJSONFile(customersFile);

        const summary = {
            ...ordersData.analytics,
            totalProducts: productsData.products.length,
            totalCustomers: customersData.analytics.totalCustomers,
            outOfStock: productsData.products.filter(p => !p.inStock).length
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
});

// Customers API
app.post('/api/customers', (req, res) => {
    try {
        const customerData = {
            ...req.body,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: []
        };

        const data = readJSONFile(customersFile);
        data.customers.push(customerData);
        data.analytics.totalCustomers++;

        writeJSONFile(customersFile, data);

        res.json({
            success: true,
            message: 'Customer registered successfully',
            customerId: customerData.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to register customer'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'TrustStickers Ecommerce API is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🛒 TrustStickers Ecommerce Server running on port ${PORT}`);
    console.log(`📍 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin`);
    console.log('\n🛍️  Ecommerce Features:');
    console.log('   GET  /api/products - Get all products with filters');
    console.log('   GET  /api/products/:id - Get product details');
    console.log('   GET  /api/categories - Get all categories');
    console.log('   POST /api/orders - Create new order');
    console.log('   POST /api/customers - Register customer');
    console.log('   GET  /api/analytics/summary - Get business analytics');
});