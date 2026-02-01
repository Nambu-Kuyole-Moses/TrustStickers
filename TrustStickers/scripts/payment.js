// Payment integration system
class PaymentManager {
    constructor() {
        this.paymentMethods = {
            mobile_money: {
                name: 'Mobile Money',
                providers: ['MTN', 'Vodafone', 'AirtelTigo'],
                icon: 'fas fa-mobile-alt',
                currencies: ['GHS']
            },
            cash: {
                name: 'Cash on Delivery',
                icon: 'fas fa-money-bill-wave',
                description: 'Pay when you receive your order'
            },
            bank_transfer: {
                name: 'Bank Transfer',
                icon: 'fas fa-university',
                banks: ['GCB Bank', 'Absa Bank', 'Standard Chartered', 'Ecobank']
            },
            card: {
                name: 'Credit/Debit Card',
                icon: 'fas fa-credit-card',
                processors: ['Paystack', 'Flutterwave']
            }
        };
        this.init();
    }

    init() {
        this.setupPaymentUI();
    }

    setupPaymentUI() {
        // This would integrate with payment gateways in a real implementation
        console.log('💳 Payment system initialized');
    }

    async processPayment(orderData, paymentMethod, paymentDetails) {
        try {
            this.showPaymentProcessing();

            // Simulate payment processing
            const paymentResult = await this.simulatePayment(orderData, paymentMethod, paymentDetails);

            if (paymentResult.success) {
                this.showPaymentSuccess(paymentResult);
                return paymentResult;
            } else {
                this.showPaymentError(paymentResult.error);
                throw new Error(paymentResult.error);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showPaymentError(error.message);
            throw error;
        }
    }

    async simulatePayment(orderData, paymentMethod, paymentDetails) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different payment method processing
                switch (paymentMethod) {
                    case 'mobile_money':
                        resolve(this.processMobileMoney(orderData, paymentDetails));
                        break;
                    case 'cash':
                        resolve(this.processCashOnDelivery(orderData));
                        break;
                    case 'bank_transfer':
                        resolve(this.processBankTransfer(orderData, paymentDetails));
                        break;
                    case 'card':
                        resolve(this.processCardPayment(orderData, paymentDetails));
                        break;
                    default:
                        resolve({ success: false, error: 'Invalid payment method' });
                }
            }, 2000); // Simulate 2 second processing time
        });
    }

    processMobileMoney(orderData, details) {
        // Simulate mobile money payment
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
            return {
                success: true,
                transactionId: `MM${Date.now()}`,
                method: 'mobile_money',
                amount: orderData.total,
                message: `Payment of ₵${orderData.total} processed via ${details.provider} Mobile Money`
            };
        } else {
            return {
                success: false,
                error: 'Mobile Money payment failed. Please check your balance and try again.'
            };
        }
    }

    processCashOnDelivery(orderData) {
        return {
            success: true,
            method: 'cash',
            amount: orderData.total,
            message: 'Cash on Delivery selected. Please have exact amount ready.'
        };
    }

    processBankTransfer(orderData, details) {
        return {
            success: true,
            method: 'bank_transfer',
            bank: details.bank,
            accountNumber: '1234567890', // This would be your business account
            amount: orderData.total,
            message: `Please transfer ₵${orderData.total} to ${details.bank} account`
        };
    }

    processCardPayment(orderData, details) {
        const success = Math.random() > 0.15; // 85% success rate for demo
        
        if (success) {
            return {
                success: true,
                transactionId: `CARD${Date.now()}`,
                method: 'card',
                amount: orderData.total,
                message: 'Card payment processed successfully'
            };
        } else {
            return {
                success: false,
                error: 'Card payment declined. Please check your card details.'
            };
        }
    }

    showPaymentProcessing() {
        const processingModal = document.createElement('div');
        processingModal.className = 'payment-processing-modal';
        processingModal.innerHTML = `
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <h3>Processing Payment</h3>
                <p>Please wait while we process your payment...</p>
            </div>
        `;
        document.body.appendChild(processingModal);
    }

    hidePaymentProcessing() {
        const modal = document.querySelector('.payment-processing-modal');
        if (modal) modal.remove();
    }

    showPaymentSuccess(paymentResult) {
        this.hidePaymentProcessing();
        
        const successModal = document.createElement('div');
        successModal.className = 'payment-success-modal';
        successModal.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Payment Successful!</h3>
                <p>${paymentResult.message}</p>
                <div class="payment-details">
                    <p><strong>Transaction ID:</strong> ${paymentResult.transactionId}</p>
                    <p><strong>Amount:</strong> ₵${paymentResult.amount}</p>
                    <p><strong>Method:</strong> ${this.paymentMethods[paymentResult.method].name}</p>
                </div>
                <button onclick="this.closest('.payment-success-modal').remove()">Continue</button>
            </div>
        `;
        document.body.appendChild(successModal);
    }

    showPaymentError(errorMessage) {
        this.hidePaymentProcessing();
        
        const errorModal = document.createElement('div');
        errorModal.className = 'payment-error-modal';
        errorModal.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Payment Failed</h3>
                <p>${errorMessage}</p>
                <button onclick="this.closest('.payment-error-modal').remove()">Try Again</button>
            </div>
        `;
        document.body.appendChild(errorModal);
    }

    getPaymentMethods() {
        return this.paymentMethods;
    }

    generatePaymentForm(method) {
        const paymentMethod = this.paymentMethods[method];
        
        switch (method) {
            case 'mobile_money':
                return this.generateMobileMoneyForm();
            case 'bank_transfer':
                return this.generateBankTransferForm();
            case 'card':
                return this.generateCardForm();
            case 'cash':
                return this.generateCashForm();
            default:
                return '<p>Payment method not supported.</p>';
        }
    }

    generateMobileMoneyForm() {
        return `
            <div class="payment-form-group">
                <label>Mobile Money Provider</label>
                <select name="mobileProvider" required>
                    <option value="">Select Provider</option>
                    <option value="MTN">MTN Mobile Money</option>
                    <option value="Vodafone">Vodafone Cash</option>
                    <option value="AirtelTigo">AirtelTigo Money</option>
                </select>
            </div>
            <div class="payment-form-group">
                <label>Phone Number</label>
                <input type="tel" name="phoneNumber" placeholder="e.g., 0241234567" required>
            </div>
            <div class="payment-info">
                <p><i class="fas fa-info-circle"></i> You will receive a prompt to approve the payment</p>
            </div>
        `;
    }

    generateBankTransferForm() {
        return `
            <div class="payment-form-group">
                <label>Bank Name</label>
                <select name="bankName" required>
                    <option value="">Select Bank</option>
                    <option value="GCB">GCB Bank</option>
                    <option value="Absa">Absa Bank</option>
                    <option value="Standard Chartered">Standard Chartered</option>
                    <option value="Ecobank">Ecobank</option>
                </select>
            </div>
            <div class="payment-instructions">
                <h4>Transfer Instructions:</h4>
                <p><strong>Account Name:</strong> TrustStickers Ltd</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Branch:</strong> Accra Main</p>
                <p><strong>Reference:</strong> Your Order Number</p>
            </div>
        `;
    }

    generateCardForm() {
        return `
            <div class="payment-form-group">
                <label>Card Number</label>
                <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-row">
                <div class="payment-form-group">
                    <label>Expiry Date</label>
                    <input type="text" name="expiryDate" placeholder="MM/YY" required>
                </div>
                <div class="payment-form-group">
                    <label>CVV</label>
                    <input type="text" name="cvv" placeholder="123" required>
                </div>
            </div>
            <div class="payment-form-group">
                <label>Cardholder Name</label>
                <input type="text" name="cardholderName" placeholder="John Doe" required>
            </div>
        `;
    }

    generateCashForm() {
        return `
            <div class="payment-info">
                <i class="fas fa-info-circle"></i>
                <p>You will pay when you receive your order. Please have exact amount ready.</p>
                <p><strong>Delivery personnel will not carry change.</strong></p>
            </div>
        `;
    }
}

// Initialize payment manager
const paymentManager = new PaymentManager();