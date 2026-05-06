/**
 * Autoser Vallarta - Forms Handler
 * Centralized script to handle all form submissions and send them to n8n
 * Version: 1.0.7
 */

const FORMS_CONFIG = {
    WEBHOOK_URL: 'https://n8n.orbys.one/webhook/bc567c7b-b05d-4723-a977-84d8b0666ee6',
    SUCCESS_TITLE: '¡MENSAJE ENVIADO!',
    SUCCESS_TEXT: 'Gracias por contactarnos. Un asesor se comunicará contigo a la brevedad.',
    SUCCESS_TEXT_EN: 'Thank you for contacting us. An advisor will get back to you shortly.',
    ERROR_TITLE: 'UPS, ALGO SALIÓ MAL',
    ERROR_TEXT: 'No pudimos enviar tu solicitud. Por favor, intenta de nuevo o contáctanos por WhatsApp.',
    ERROR_TEXT_EN: 'We could not send your request. Please try again or contact us via WhatsApp.',
    CLOUDINARY: {
        CLOUD_NAME: 'dfxs1bn3o',
        UPLOAD_PRESET: 'autoser'
    }
};

const initForms = () => {
    const forms = document.querySelectorAll('form');
    console.log('Detectados formularios:', forms.length);
    
    forms.forEach(form => {
        // Prevent multiple listeners
        if (form.dataset.handlerAttached) return;
        form.dataset.handlerAttached = 'true';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const isEnglish = document.documentElement.lang === 'en' || (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
            
            // UI State: Loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>${isEnglish ? 'SENDING...' : 'ENVIANDO...'}</span>
                </div>
            `;

            try {
                console.log('Iniciando envío de formulario:', form.id);
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Handle file attachments (Base64 for JSON webhooks)
                const fileInput = form.querySelector('input[type="file"]');
                if (fileInput && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    // Check size (limit to 4MB for safe webhook transit)
                    if (file.size > 4 * 1024 * 1024) {
                        alert(isEnglish ? "File is too large (max 4MB)" : "El archivo es muy pesado (máximo 4MB)");
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                    data.archivo_nombre = file.name;
                    // data.archivo_base64 = await convertFileToBase64(file); // Legacy Base64
                    
                    // New: Cloudinary Upload
                    try {
                        submitBtn.innerHTML = `
                            <div class="flex items-center justify-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>${isEnglish ? 'UPLOADING PHOTO...' : 'SUBIENDO FOTO...'}</span>
                            </div>
                        `;
                        const cloudinaryUrl = await uploadToCloudinary(file);
                        data.foto_url = cloudinaryUrl;
                        console.log('Imagen subida a Cloudinary:', cloudinaryUrl);
                    } catch (uploadError) {
                        console.error('Error subiendo a Cloudinary:', uploadError);
                        alert(isEnglish ? "Error uploading image. Please try again." : "Error al subir la imagen. Intenta de nuevo.");
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                }
                
                // Meta info
                data.submitted_at = new Date().toLocaleString();
                data.page_url = window.location.href;
                data.language = isEnglish ? 'en' : 'es';

                console.log('Datos a enviar:', data);

                const response = await fetch(FORMS_CONFIG.WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                console.log('Respuesta recibida:', response.status);

                // n8n usually returns 200/201 if handled correctly
                if (response.ok || response.status === 200) {
                    const userName = data.nombre_completo || data.nombre || data.name || 'Cliente';
                    const formType = form.getAttribute('data-form-type') || data.form_type || 'General';
                    
                    console.log('Éxito! Preparando redirección:', { userName, formType });
                    
                    showNotification(true, isEnglish);
                    
                    // --- ANALYTICS EVENTS ---
                    // Google Analytics 4 Event
                    if (typeof gtag === 'function') {
                        gtag('event', 'generate_lead', {
                            'form_type': formType,
                            'user_name': userName
                        });
                        // Google Ads Conversion (Optional but recommended if you have a conversion ID/label)
                        // gtag('event', 'conversion', {'send_to': 'AW-17485718013/CONVERSION_LABEL'});
                    }

                    // Meta Pixel Lead Event
                    if (typeof fbq === 'function') {
                        fbq('track', 'Lead', {
                            content_category: formType,
                            content_name: 'Form Submission'
                        });
                    }
                    // ------------------------
                    
                    // Construct URL for redirection
                    const tyUrl = `gracias.html?name=${encodeURIComponent(userName)}&type=${encodeURIComponent(formType)}`;
                    
                    // Redirect to Thank You page after a small delay
                    setTimeout(() => {
                        window.location.href = tyUrl;
                    }, 500);
                } else {
                    const errorText = await response.text();
                    console.error(`Submission failed: ${response.status}`, errorText);
                    showNotification(false, isEnglish);
                }
            } catch (error) {
                console.error('Detailed submission error:', error);
                showNotification(false, isEnglish);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    });
};

/**
 * Upload file to Cloudinary (Unsigned)
 */
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', FORMS_CONFIG.CLOUDINARY.UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${FORMS_CONFIG.CLOUDINARY.CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
}

/**
 * Helper to convert file to Base64
 */
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the prefix (e.g., "data:image/jpeg;base64,") if you want just the raw base64
            // but keeping it makes it easier for many systems to detect type.
            // For n8n, keeping it is usually fine or even helpful.
            resolve(reader.result);
        };
        reader.onerror = error => reject(error);
    });
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
} else {
    initForms();
}

/**
 * Show a premium notification
 */
function showNotification(isSuccess, isEnglish) {
    // Remove existing if any
    const existing = document.querySelector('.autoser-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `autoser-notification fixed bottom-8 right-8 z-[9999] transform translate-y-20 opacity-0 transition-all duration-500 ease-out`;
    
    const bgColor = isSuccess ? 'bg-white' : 'bg-[#ED1C24]';
    const textColor = isSuccess ? 'text-[#1A1A1A]' : 'text-white';
    const borderColor = isSuccess ? 'border-green-500' : 'border-white/20';
    
    const title = isSuccess ? FORMS_CONFIG.SUCCESS_TITLE : FORMS_CONFIG.ERROR_TITLE;
    const text = isSuccess 
        ? (isEnglish ? FORMS_CONFIG.SUCCESS_TEXT_EN : FORMS_CONFIG.SUCCESS_TEXT)
        : (isEnglish ? FORMS_CONFIG.ERROR_TEXT_EN : FORMS_CONFIG.ERROR_TEXT);
    
    const icon = isSuccess ? 'check_circle' : 'error';
    const iconColor = isSuccess ? 'text-green-500' : 'text-white';

    notification.innerHTML = `
        <div class="${bgColor} ${textColor} p-6 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-l-4 ${borderColor} flex items-start gap-4 max-w-md backdrop-blur-md">
            <span class="material-symbols-outlined ${iconColor} text-3xl notranslate select-none">${icon}</span>
            <div class="flex-grow">
                <h4 class="font-headline font-black text-xs uppercase tracking-widest mb-1">${title}</h4>
                <p class="text-[11px] opacity-70 leading-relaxed font-body font-medium">${text}</p>
            </div>
            <button onclick="this.parentElement.parentElement.classList.add('opacity-0', 'translate-y-20'); setTimeout(() => this.parentElement.parentElement.remove(), 500)" class="ml-2 opacity-30 hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined text-sm notranslate select-none">close</span>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        setTimeout(() => {
            notification.classList.remove('translate-y-20', 'opacity-0');
        }, 10);
    });

    // Auto remove after 6s
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => notification.remove(), 500);
        }
    }, 6000);
}
