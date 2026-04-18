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
            // Store original Spanish state and its type (text vs html)
            if (!el.hasAttribute('data-i18n-es')) {
                const hasTags = el.children.length > 0;
                el.setAttribute('data-i18n-es', hasTags ? el.innerHTML : el.innerText.trim());
                el.setAttribute('data-i18n-type', hasTags ? 'html' : 'text');
            }

            const original = el.getAttribute('data-i18n-es');
            const type = el.getAttribute('data-i18n-type');

            if (isEn) {
                const translation = el.getAttribute('data-en');
                const icon = el.querySelector('.material-symbols-outlined');
                
                if (icon) {
                    // Preserve icon while translating
                    const iconHTML = icon.outerHTML;
                    const isIconAtStart = el.innerHTML.trim().startsWith('<span');
                    el.innerHTML = isIconAtStart ? `${iconHTML} ${translation}` : `${translation} ${iconHTML}`;
                } else {
                    // Respect HTML in translations (allows <br> in data-en)
                    if (translation.includes('<')) {
                        el.innerHTML = translation;
                    } else {
                        el.innerText = translation;
                    }
                }
            } else {
                // Restore original Spanish state perfectly
                if (type === 'html') {
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
