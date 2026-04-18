# 🎨 Guía de Estilo: Autoser "Velocity Elite" (v2.1)

Esta guía define los estándares visuales y técnicos adoptados para el rediseño de **Autoser Vallarta**. Todas las páginas deben seguir estas pautas para mantener la integridad de marca.

---

## 1. Identidad Cromática (Tokens)

| Elemento | Color Hex | Uso Principal |
| :--- | :--- | :--- |
| **Rojo Institucional** | `#ED1C24` | Botones primary, bordes de marca, acentos de texto. |
| **Profundo (Black)** | `#1A1A1A` | Fondos de sección hero, footers y elementos premium. |
| **Gris Nieve (Gray)** | `#F4F4F4` | Secciones secundarias y fondos de cards. |
| **Gris Carbón** | `#333333` | Texto de cuerpo principal para legibilidad. |
| **Cristal** | `rgba(255, 255, 255, 0.05)` | Efectos Glassmorphism con `backdrop-blur-md`. |

---

## 2. Tipografía

Utilizamos una jerarquía de tres fuentes para equilibrar autoridad y modernidad:

- **Primary Headline (Montserrat):** 
  - Uso: Títulos principales (h1, h2) y navegación.
  - Estilo: `font-extrabold` (800/900), `uppercase`, `tracking-wide`.
- **Secondary / Buttons (Outfit):**
  - Uso: Etiquetas de botones, mini-badges y calls-to-action técnicos.
  - Estilo: `font-bold`, `tracking-widest`.
- **Body Text (Inter):**
  - Uso: Párrafos, descripciones legales y contenido general.
  - Estilo: `font-normal` o `font-medium`, `line-height-relaxed`.

---

## 3. Escalas de Layout (Layout Grid)

| Componente | Valor (Móvil) | Valor (Escritorio) |
| :--- | :--- | :--- |
| **Hero Height** | `min-h-[70vh]` | `min-h-[85vh]` |
| **Hero Padding Top** | `pt-44` | `pt-24` |
| **Header Height** | `h-auto` (~72px - 80px) | `h-auto` (~72px - 80px) |
| **Section Spacing** | `py-20` | `py-32` |
| **Max Container Width**| `w-full` | `container mx-auto px-8` |

---

## 4. Componentes Premium (UI Patterns)

### 🚀 Animaciones
- **Reveal on Scroll:** Todas las secciones deben aparecer suavemente usando `opacity-0 translate-y-10` pasando a `opacity-100 translate-y-0`.
- **Shimmer Text:** Los textos destacados en rojo deben usar la clase `.shimmer` para una animación de brillo infinito.

### 🍱 Estructura de Header
- **Sticky Behavior:** Siempre visible al hacer scroll.
- **Top Brand Border:** `border-t-4 border-autoser-red`.
- **Glassmorphism:** `bg-white/95 backdrop-blur-sm shadow-sm`.

### 📱 Menú Móvil
- **Diseño:** Overlay completo desde la derecha (`translate-x-full`).
- **Contenido:** Enlaces de gran formato (`text-2xl`), acceso directo a WhatsApp y contacto de agencia.

---

## 🛠️ Tailwind Config Snippet (Copy-Paste)

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                autoser: {
                    red: '#ED1C24',
                    black: '#1A1A1A',
                    gray: '#F4F4F4',
                    charcoal: '#333333'
                }
            },
            fontFamily: {
                headline: ['Montserrat', 'sans-serif'],
                body: ['Inter', 'sans-serif']
            }
        }
    }
}
```

---
*Referencia indispensable para el mantenimiento del sitio web Autoser Vallarta.*
