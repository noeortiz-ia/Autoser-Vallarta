/**
 * Autoser Vallarta Analytics Events
 * Handles GA4 and Meta Pixel tracking for common interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Track WhatsApp Clicks
    document.addEventListener('click', function(e) {
        const waLink = e.target.closest('a[href*="wa.me"]');
        if (waLink) {
            const url = waLink.href;
            const page = window.location.pathname;
            
            // GA4
            if (typeof gtag === 'function') {
                gtag('event', 'contact', {
                    'method': 'WhatsApp',
                    'event_category': 'Engagement',
                    'event_label': url,
                    'page_location': page
                });
            }
            
            // Meta Pixel
            if (typeof fbq === 'function') {
                fbq('track', 'Contact', {
                    content_category: 'WhatsApp',
                    content_name: page
                });
            }
            
            console.log('Analytics: WhatsApp Click Tracked');
        }
        
        // Track Phone Clicks
        const telLink = e.target.closest('a[href^="tel:"]');
        if (telLink) {
            const phone = telLink.href;
            
            // GA4
            if (typeof gtag === 'function') {
                gtag('event', 'contact', {
                    'method': 'Phone',
                    'event_category': 'Engagement',
                    'event_label': phone
                });
            }
            
            // Meta Pixel
            if (typeof fbq === 'function') {
                fbq('track', 'Contact', {
                    content_category: 'Phone'
                });
            }
            
            console.log('Analytics: Phone Click Tracked');
        }
    });

    // Track Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'navigation', {
                    'menu_item': link.innerText.trim()
                });
            }
        });
    });
});
