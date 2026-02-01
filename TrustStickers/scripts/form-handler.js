// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    const loadingSpinner = document.getElementById('loading');

    // Form submission
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading
        loadingSpinner.classList.remove('hidden');
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            contact: document.getElementById('contact').value,
            deviceType: document.getElementById('deviceType').value,
            brand: document.getElementById('brand').value,
            sticker: document.getElementById('sticker').value,
            location: document.getElementById('location').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Send to backend
            const response = await submitOrder(formData);
            
            if (response.success) {
                // Show success modal
                showSuccessModal();
                // Reset form
                orderForm.reset();
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Sorry, there was an error submitting your order. Please try again or contact us directly.');
        } finally {
            // Hide loading
            loadingSpinner.classList.add('hidden');
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.add('hidden');
        }
    });
});

// Submit order to backend
// Submit order to backend
async function submitOrder(orderData) {
    const backendUrl = 'http://localhost:3000/api/orders';
    
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Order submitted successfully:', result);
        return result;
    } catch (error) {
        console.error('❌ Error submitting order to backend:', error);
        // Fallback: Save to localStorage if backend is unavailable
        console.warn('Backend unavailable, saving to localStorage');
        return saveOrderToLocalStorage(orderData);
    }
}

// Fallback: Save order to localStorage
function saveOrderToLocalStorage(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('trustStickersOrders') || '[]');
        orders.push({
            ...orderData,
            id: Date.now().toString()
        });
        localStorage.setItem('trustStickersOrders', JSON.stringify(orders));
        
        return { success: true, message: 'Order saved locally' };
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return { success: false, error: 'Failed to save order' };
    }
}

// Show success modal
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('hidden');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        successModal.classList.add('hidden');
    }, 5000);
}

// Form validation
function validateForm(formData) {
    const errors = [];

    if (!formData.name.trim()) {
        errors.push('Name is required');
    }

    if (!formData.contact.trim()) {
        errors.push('Contact information is required');
    }

    if (!formData.deviceType) {
        errors.push('Device type is required');
    }

    if (!formData.brand.trim()) {
        errors.push('Brand and model is required');
    }

    if (!formData.sticker) {
        errors.push('Please select a sticker design');
    }

    if (!formData.location.trim()) {
        errors.push('Delivery location is required');
    }

    return errors;
}

// Real-time form validation
document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea').forEach(element => {
    element.addEventListener('blur', () => {
        validateField(element);
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
        case 'name':
            isValid = value.length >= 2;
            errorMessage = 'Name must be at least 2 characters long';
            break;
        case 'contact':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10,}$/.test(value.replace(/\D/g, ''));
            errorMessage = 'Please enter a valid email or phone number';
            break;
        case 'brand':
            isValid = value.length >= 2;
            errorMessage = 'Please enter your device brand and model';
            break;
        case 'location':
            isValid = value.length >= 10;
            errorMessage = 'Please provide a detailed delivery location';
            break;
    }

    if (!isValid && value) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#e53e3e';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}