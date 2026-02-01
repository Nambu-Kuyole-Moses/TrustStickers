// Analytics tracking - Simplified version without backend API calls
class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserBehavior();
        this.setupPerformanceTracking();
    }

    trackPageView() {
        const pageData = {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
        };

        this.logToConsole('page_view', pageData);
        this.saveToLocalStorage('page_view', pageData);
    }

    trackUserBehavior() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('a, button, .sticker-card, .nav-link')) {
                this.logToConsole('click', {
                    element: target.tagName,
                    text: target.textContent?.trim().substring(0, 50),
                    href: target.href,
                    className: target.className
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.logToConsole('form_submit', {
                formId: e.target.id,
                timestamp: new Date().toISOString()
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
                if (maxScroll % 0.25 < 0.05) { // Log every 25%
                    this.logToConsole('scroll_depth', { 
                        depth: Math.round(maxScroll * 100) 
                    });
                }
            }
        });
    }

    setupPerformanceTracking() {
        // Track page load performance
        if (window.performance) {
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                this.logToConsole('performance', {
                    loadTime: Math.round(loadTime),
                    domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                    readyStart: perfData.fetchStart - perfData.navigationStart
                });
            });
        }
    }

    logToConsole(event, data) {
        // Only log in development
        if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
            console.log('📊 Analytics Event:', event, data);
        }
    }

    saveToLocalStorage(event, data) {
        try {
            const analyticsData = JSON.parse(localStorage.getItem('trustStickersAnalytics') || '[]');
            analyticsData.push({
                event,
                data,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 100 events
            if (analyticsData.length > 100) {
                analyticsData.splice(0, analyticsData.length - 100);
            }
            
            localStorage.setItem('trustStickersAnalytics', JSON.stringify(analyticsData));
        } catch (error) {
            console.warn('Could not save analytics to localStorage');
        }
    }

    getAnalytics() {
        try {
            return JSON.parse(localStorage.getItem('trustStickersAnalytics') || '[]');
        } catch (error) {
            return [];
        }
    }

    clearAnalytics() {
        localStorage.removeItem('trustStickersAnalytics');
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    window.trustStickersAnalytics = new Analytics();
});