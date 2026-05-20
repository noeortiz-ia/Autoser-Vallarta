/**
 * Autoser Vallarta - Forms Handler
 * Centralized script to handle all form submissions and send them to n8n
 * Version: 1.1.0 - Multi-object Support & Detail Page Integration
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
    },
    DETAIL_PAGE_URL: 'detalle-solicitud.html'
};

const initForms = () => {
    const forms = document.querySelectorAll('form');
    console.log('Detectados formularios:', forms.length);
    
    forms.forEach(form => {
        if (form.dataset.handlerAttached) return;
        form.dataset.handlerAttached = 'true';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const isEnglish = document.documentElement.lang === 'en' || (typeof i18n !== 'undefined' && i18n.currentLang === 'en');
            
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
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const fileInput = form.querySelector('input[type="file"]');
                let mediaIds = [];

                if (fileInput && fileInput.files.length > 0) {
                    const totalFiles = fileInput.files.length;
                    
                    for (let i = 0; i < totalFiles; i++) {
                        const file = fileInput.files[i];
                        
                        // Limit individual file size to 15MB for videos/images
                        if (file.size > 15 * 1024 * 1024) {
                            alert(isEnglish ? `File "${file.name}" is too large (max 15MB)` : `El archivo "${file.name}" es muy pesado (máximo 15MB)`);
                            continue;
                        }

                        submitBtn.innerHTML = `
                            <div class="flex items-center justify-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>${isEnglish ? `UPLOADING ${i+1}/${totalFiles}...` : `SUBIENDO ${i+1}/${totalFiles}...`}</span>
                            </div>
                        `;

                        try {
                            const cloudRes = await uploadToCloudinary(file);
                            mediaIds.push(`${cloudRes.public_id}:${cloudRes.resource_type}`);
                        } catch (uploadError) {
                            console.error('Error subiendo archivo:', uploadError);
                        }
                    }
                }

                // --- CONSTRUCCIÓN DE URL ÚNICA DE DETALLE ---
                const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/';
                const formType = form.getAttribute('data-form-type') || data.form_type || 'General';
                
                // Elegir la plantilla correcta
                let detailPage = 'detalle-solicitud.html'; 
                if (formType.toLowerCase().includes('hojalatería') || formType.toLowerCase().includes('hyp')) {
                    detailPage = 'detalle-hyp.html';
                } else if (formType.toLowerCase().includes('compramos') || formType.toLowerCase().includes('vende') || formType.toLowerCase().includes('seminuevos')) {
                    detailPage = 'detalle-seminuevos.html';
                }

                // Codificar todos los datos en la URL
                const params = new URLSearchParams();
                params.append('name', data.nombre_completo || '');
                params.append('email', data.email || '');
                params.append('phone', data.telefono || '');
                params.append('model', data.modelo_auto || `${data.marca || ''} ${data.modelo || ''}`.trim());
                params.append('year', data.anio || '');
                params.append('km', data.kilometraje || '');
                params.append('msg', data.mensaje || data.mensaje_adicional || '');
                params.append('type', formType);
                if (mediaIds.length > 0) params.append('ids', mediaIds.join(','));
                
                // Esta es la URL única que n8n recibirá en el campo "foto_url"
                data.foto_url = `${baseUrl}${detailPage}?${params.toString()}`;
                data.media_ids_raw = mediaIds.map(m => m.split(':')[0]).join(','); // Solo IDs para facilitar borrado en n8n

                console.log("URL de detalle generada:", data.foto_url);

                data.submitted_at = new Date().toLocaleString();
                data.page_url = window.location.href;
                data.language = isEnglish ? 'en' : 'es';

                const response = await fetch(FORMS_CONFIG.WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok || response.status === 200) {
                    const userName = data.nombre_completo || 'Cliente';
                    const formType = form.getAttribute('data-form-type') || 'General';
                    showNotification(true, isEnglish);
                    
                    // --- META PIXEL LEAD TRACKING ---
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead', {
                            content_name: formType,
                            content_category: 'Website Form'
                        });
                        console.log('Analytics: Lead Event Tracked (' + formType + ')');
                    }
                    // --------------------------------

                    // Redirection
                    const tyUrl = `gracias.html?name=${encodeURIComponent(userName)}&type=${encodeURIComponent(formType)}`;
                    setTimeout(() => { window.location.href = tyUrl; }, 500);
                } else {
                    showNotification(false, isEnglish);
                }
            } catch (error) {
                console.error('Submission error:', error);
                showNotification(false, isEnglish);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    });
};

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', FORMS_CONFIG.CLOUDINARY.UPLOAD_PRESET);

    // Use 'auto' to handle images and videos in the same endpoint
    const response = await fetch(`https://api.cloudinary.com/v1_1/${FORMS_CONFIG.CLOUDINARY.CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Cloudinary upload failed');
    return await response.json();
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
} else {
    initForms();
}

function showNotification(isSuccess, isEnglish) {
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

    notification.innerHTML = `
        <div class="${bgColor} ${textColor} p-6 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-l-4 ${borderColor} flex items-start gap-4 max-w-md backdrop-blur-md">
            <span class="material-symbols-outlined ${isSuccess ? 'text-green-500' : 'text-white'} text-3xl notranslate select-none">${icon}</span>
            <div class="flex-grow">
                <h4 class="font-headline font-black text-xs uppercase tracking-widest mb-1">${title}</h4>
                <p class="text-[11px] opacity-70 leading-relaxed font-body font-medium">${text}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.remove('translate-y-20', 'opacity-0'); }, 10);
    setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => notification.remove(), 500);
    }, 6000);
}
