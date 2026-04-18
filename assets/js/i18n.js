/**
 * i18n.js - Autoser Vallarta Multilingual Engine
 * Handles language switching between Spanish (default) and English.
 */

const i18n = {
    currentLang: localStorage.getItem('autoser_lang') || 'es',

    init() {
        this.applyLanguage(this.currentLang);
        this.updateButtonsUI();
        
        // Listen for internal language changes
        window.addEventListener('languageChanged', (e) => {
            this.applyLanguage(e.detail.lang);
        });
    },

    toggle() {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('autoser_lang', this.currentLang);
        this.applyLanguage(this.currentLang);
        this.updateButtonsUI();
        
        // Dispatch event for other scripts (like AI assistant or dynamic inventory)
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    },

    applyLanguage(lang) {
        document.documentElement.lang = lang;
        const isEn = lang === 'en';

        // 1. Handle standard text content
        document.querySelectorAll('[data-en]').forEach(el => {
            // Heuristic for complex elements (with icons, line breaks, etc.)
            const hasTags = el.children.length > 0;

            // Store original Spanish if not already stored
            if (!el.hasAttribute('data-i18n-es')) {
                if (hasTags) {
                    el.setAttribute('data-i18n-es', el.innerHTML);
                } else {
                    el.setAttribute('data-i18n-es', el.innerText.trim());
                }
            }

            if (isEn) {
                const translation = el.getAttribute('data-en');
                const icon = el.querySelector('.material-symbols-outlined');
                
                if (icon) {
                    // Preserve icon while translating
                    const iconHTML = icon.outerHTML;
                    const isIconAtStart = el.innerHTML.trim().startsWith('<span');
                    el.innerHTML = isIconAtStart ? `${iconHTML} ${translation}` : `${translation} ${iconHTML}`;
                } else {
                    // Simple replacement (can use innerHTML to allow <br> in data-en)
                    el.innerHTML = translation;
                }
            } else {
                // Restore original Spanish state perfectly
                const original = el.getAttribute('data-i18n-es');
                if (hasTags) {
                    el.innerHTML = original;
                } else {
                    el.innerText = original;
                }
            }
        });

        // 2. Handle attributes (placeholders, titles, alt)
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            if (!el.hasAttribute('data-i18n-es-placeholder')) { el.setAttribute('data-i18n-es-placeholder', el.placeholder); }
            el.placeholder = isEn ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-i18n-es-placeholder');
        });

        document.querySelectorAll('[data-en-alt]').forEach(el => {
            if (!el.hasAttribute('data-i18n-es-alt')) { el.setAttribute('data-i18n-es-alt', el.alt); }
            el.alt = isEn ? el.getAttribute('data-en-alt') : el.getAttribute('data-i18n-es-alt');
        });
    },

    updateButtonsUI() {
        document.querySelectorAll('.lang-toggle-text').forEach(el => {
            el.innerText = this.currentLang === 'es' ? 'EN' : 'ES';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => i18n.init());
