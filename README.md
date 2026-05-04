# 🏎️ Proyecto Web: Autoser Vallarta (Ultra Premium Automotive Experience)

Bienvenido a la documentación técnica maestra de **Autoser Vallarta**. Este repositorio contiene una arquitectura web estática diseñada para ofrecer una experiencia de usuario premium, bilingüe y altamente automatizada.

---

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5 + Vanilla JavaScript.
- **Estilos:** Tailwind CSS (vía CDN) con personalización de marca Velocity Elite.
- **Tipografía:**
  - `Montserrat`: Encabezados y navegación (Autoridad).
  - `Inter`: Cuerpo de texto (Legibilidad).
  - `Outfit`: Botones y acentos técnicos (Modernidad).
- **Iconografía:** Material Symbols Outlined de Google.
- **Hosting:** Optimizado para cPanel o cualquier servidor estático (requiere `.htaccess` para URLs amigables).

---

## 🏛️ Estructura del Proyecto
```text
/
├── assets/
│   ├── js/
│   │   └── i18n.js         <-- Cerebro del sistema bilingüe
│   ├── img/                <-- Assets visuales (Logo, Héroes, Marcas)
│   └── css/                <-- Estilos globales (opcional, la mayoría es Tailwind)
├── index.html              <-- Página Principal
├── refacciones.html        <-- Catálogo multimarca
├── taller-multimarcas.html <-- Taller y mantenimiento (SEO URL)
├── hojalateria-y-pintura.html <-- Hojalatería y Pintura (SEO URL)
├── seguros.html            <-- Cotizador multietapa de seguros
├── compramos-tu-auto.html  <-- Valuación y Adquisición (SEO URL)
├── seminuevos/             <-- Carpeta de WordPress (Inventario dinámico)
├── bolsa-de-trabajo.html   <-- Reclutamiento y Programa de Entrenamiento
├── vacantes.json           <-- Base de datos dinámica de empleos
└── .htaccess               <-- Configuración de servidor (URLs amigables)
```

---

## 🌍 Sistema Bilingüe (i18n.js)
El sitio utiliza un motor de traducción ligero propietario que no requiere recargar la página.
- **Funcionamiento:** Busca elementos con el atributo `data-en`.
- **Implementación:**
  ```html
  <h1 data-en="PARTS">REFACCIONES</h1>
  ```
- **Campos de Formulario:** Usa `data-en-placeholder` para los inputs.
- **Alternar Idioma:** Se controla mediante `i18n.toggle()`. El estado se guarda en `localStorage` (`selectedLanguage`).

---

## 🤖 Automatización y Formularios Pro
### 1. WhatsApp con Contexto
Todos los botones de contacto generan mensajes dinámicos para que el cliente no tenga que escribir desde cero.
- **Seguros:** Captura 8 campos (Nombre, Auto, Año, CP, etc.) y genera una ficha técnica completa al enviar.
- **Vacantes:** Incluye automáticamente el nombre de la posición en el mensaje: `Hola, me interesa la vacante de [Nombre]`.

### 2. Lógica de Valuación (Seminuevos)
- **Restricción 2020+:** El sistema está reforzado visual y técnicamente para priorizar modelos 2020 en adelante.
- **Campos Inteligentes:** El formulario de `compramos-tu-auto.html` utiliza una cuadrícula de 12 columnas para mantener 3 campos (Marca, Modelo, Año) en una sola fila, optimizando el espacio vertical.

### 3. Seguros (Multi-step)
El formulario de seguros es un proceso de 2 pasos con transiciones suaves. Los pasos se controlan mediante clases `.hidden` gestionadas por JavaScript al final de `seguros.html`.

---

## 🎨 Guía de Diseño (Tokens)
- **Rojo:** `#ED1C24` (Logo oficial)
- **Negro Premium:** `#1A1A1A`
- **Gris de Fondo:** `#F4F4F4`
- **Hero Height:** 
  - Desktop: `min-h-[85vh]`
  - Mobile: `min-h-[70vh]`
- **Header:** Sticky con desenfoque de cristal (`backdrop-blur-sm`).

---

## 🔧 Guía de Mantenimiento (Para desarrolladores)

### ¿Cómo agregar una vacante?
1. Abre `vacantes.json`.
2. Añade un nuevo objeto al array siguiendo el formato:
   ```json
   {
     "titulo": "Asesor de Ventas",
     "tituloEn": "Sales Advisor",
     "categoria": "Ventas",
     "categoriaEn": "Sales"
   }
   ```
3. El frontend lo renderizará automáticamente con el botón de WhatsApp pre-configurado.

### ¿Cómo cambiar el número de WhatsApp?
Busca la variable global (o el enlace `wa.me/`) en el script al final de cada página. El número principal de Ventas Digitales es `523221960922`.

### SEO y Rendimiento
- **Imágenes:** Usa formatos web optimizados.
- **Meta Tags:** Cada página tiene su propio bloque de OpenGraph y Twitter Cards. Asegúrate de actualizarlos si cambia la URL o el enfoque de la página.

---
*Documentado con precisión por Antigravity en Abril de 2026. Este proyecto prioriza la autoridad de marca y la conversión inmediata vía WhatsApp.*
