// Enhanced Chat Widget
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.setupAutoResponses();
        this.setupChatAnimations();
    }

    setupEventListeners() {
        // Toggle chat window
        const chatToggle = document.querySelector('.chat-toggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                this.toggleChat();
            });
        }

        // Close chat
        const chatClose = document.querySelector('.chat-close');
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                this.closeChat();
            });
        }

        // Send message
        const sendButton = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');

        if (sendButton && chatInput) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Auto-resize input
            chatInput.addEventListener('input', (e) => {
                this.autoResizeInput(e.target);
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    setupChatAnimations() {
        // Add pulse animation to chat toggle
        const chatToggle = document.querySelector('.chat-toggle');
        if (chatToggle) {
            setInterval(() => {
                chatToggle.classList.add('pulse');
                setTimeout(() => {
                    chatToggle.classList.remove('pulse');
                }, 1000);
            }, 5000);
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.querySelector('.chat-window');
        
        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            this.animateChatOpen();
            document.getElementById('chatInput').focus();
            
            // Track chat opened
            if (window.trustStickersAnalytics) {
                window.trustStickersAnalytics.logToConsole('chat_opened', {});
            }
        } else {
            this.closeChat();
        }
    }

    animateChatOpen() {
        const chatWindow = document.querySelector('.chat-window');
        if (chatWindow && window.gsap) {
            gsap.fromTo(chatWindow, 
                { 
                    scale: 0.8, 
                    opacity: 0,
                    y: 20
                },
                { 
                    scale: 1, 
                    opacity: 1,
                    y: 0,
                    duration: 0.3, 
                    ease: "back.out(1.7)" 
                }
            );
        }
    }

    closeChat() {
        this.isOpen = false;
        const chatWindow = document.querySelector('.chat-window');
        if (chatWindow && window.gsap) {
            gsap.to(chatWindow, {
                scale: 0.8,
                opacity: 0,
                y: 20,
                duration: 0.2,
                onComplete: () => {
                    chatWindow.classList.add('hidden');
                }
            });
        } else if (chatWindow) {
            chatWindow.classList.add('hidden');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        this.autoResizeInput(input);

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot response delay (1-3 seconds)
        const delay = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, delay);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        // Add timestamp
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(text)}</div>
            <div class="message-time">${timestamp}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        this.messages.push({ 
            text, 
            sender, 
            timestamp: new Date().toISOString() 
        });
        this.saveChatHistory();

        // Add animation to new message
        if (window.gsap) {
            gsap.fromTo(messageDiv, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3 }
            );
        }
    }

    formatMessage(text) {
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            if (window.gsap) {
                gsap.to(typingIndicator, {
                    opacity: 0,
                    height: 0,
                    margin: 0,
                    duration: 0.2,
                    onComplete: () => typingIndicator.remove()
                });
            } else {
                typingIndicator.remove();
            }
        }
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    generateBotResponse(userMessage) {
        const responses = this.getBotResponses(userMessage);
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Simulate typing speed
        const typingSpeed = 30; // ms per character
        const totalTime = response.length * typingSpeed;
        
        let displayedText = '';
        let index = 0;

        const typeInterval = setInterval(() => {
            displayedText += response[index];
            this.updateLastBotMessage(displayedText);
            index++;

            if (index >= response.length) {
                clearInterval(typeInterval);
            }
        }, typingSpeed);
    }

    updateLastBotMessage(text) {
        const messages = document.querySelectorAll('.bot-message');
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && !lastMessage.classList.contains('typing-indicator')) {
            lastMessage.querySelector('.message-content').innerHTML = this.formatMessage(text);
            
            // Auto-scroll
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } else {
            this.addMessage(text, 'bot');
        }
    }

    getBotResponses(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (/(hello|hi|hey|good morning|good afternoon)/.test(message)) {
            return [
                "Hello! 👋 How can I help you with your sticker order today?",
                "Hi there! Ready to customize your device with awesome stickers?",
                "Welcome to TrustStickers! How can I assist you today?"
            ];
        } else if (/(price|cost|how much|₵)/.test(message)) {
            return [
                "Our laptop skins start at ₵25 and phone skins at ₵18. Premium designs go up to ₵35!",
                "Prices range from ₵18 to ₵35 depending on the design and device type.",
                "We have affordable options! Laptop skins: ₵25-₵35, Phone skins: ₵18-₵25"
            ];
        } else if (/(delivery|shipping|when will|how long)/.test(message)) {
            return [
                "We deliver nationwide in Ghana! Delivery takes 2-5 business days. 🚚",
                "Free delivery in Accra for orders over ₵50. Nationwide delivery available!",
                "We use trusted delivery partners across Ghana. Delivery time: 2-5 days."
            ];
        } else if (/(order|buy|purchase|get)/.test(message)) {
            return [
                "You can place your order directly through our website. Just add items to cart and checkout! 🛒",
                "Simply browse our collection, add your favorites to cart, and complete checkout!",
                "Ready to order? Use our shopping cart system - it's easy and secure!"
            ];
        } else if (/(contact|call|phone|whatsapp|number)/.test(message)) {
            return [
                "You can reach NK Moses at 📞 0247299303 or 0206825757",
                "Contact us via WhatsApp: https://wa.me/233247299303",
                "Call, WhatsApp, or message us on any social media platform! We're here to help."
            ];
        } else if (/(design|custom|personalize)/.test(message)) {
            return [
                "We offer custom designs! Contact us with your idea and we'll create something unique for you. 🎨",
                "Want a custom design? We can create personalized stickers just for you!",
                "Custom designs are available! Share your concept and we'll bring it to life."
            ];
        } else {
            return [
                "I'd love to help! You can browse our collection, place an order, or contact us directly. 😊",
                "For specific questions about orders, delivery, or pricing, feel free to ask!",
                "Need help choosing a design? Check out our featured collection or contact NK Moses directly."
            ];
        }
    }

    setupAutoResponses() {
        // Pre-defined quick responses that users can click
        const quickResponses = [
            "What's the price range?",
            "How long for delivery?",
            "How do I order?",
            "Contact details?",
            "Custom designs?"
        ];

        // You could add these as quick reply buttons in the chat
    }

    saveChatHistory() {
        try {
            localStorage.setItem('trustStickersChat', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('trustStickersChat');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Optionally display recent messages (last 10)
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    // Don't reload messages on init to keep chat clean
                });
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }

    // Utility method to clear chat history
    clearChatHistory() {
        this.messages = [];
        localStorage.removeItem('trustStickersChat');
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '<div class="chat-message bot-message"><div class="message-content">Hi! 👋 How can we help you with your sticker order?</div></div>';
        }
    }
}

// Initialize chat widget
document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
});