# 📄 Reporte de Estandarización: Autoser Vallarta (Actualizado v2.1)

Este documento resume el sistema de diseño actual de **Autoser Vallarta** para garantizar la coherencia visual en todos los desarrollos futuros.

## 🚀 Arquitectura Técnica
- **Framework:** HTML5 + JavaScript (Vainilla).
- **Estilos:** Tailwind CSS (vía CDN con plugins de forms y container-queries).
- **Tipografía (Actualizado):** 
  - **Encabezados:** *Montserrat* (800/900 weighting) para un estilo audaz y premium.
  - **Cuerpo:** *Inter* para máxima legibilidad.
  - **Botones:** *Outfit* (vía `@import` o clases locales) para un toque moderno.
- **Iconografía:** Material Symbols Outlined (Variaciones FILL: 1/0).
- **Dimensiones Estándar:**
  - **Header (Sticky):** Altura máxima ~80px, `backdrop-blur-sm shadow-sm`. Borde superior de marca: `border-t-4 border-autoser-red`.
  - **Hero (Nivel Global - Standard v2.1):**
    - **Altura:** `min-h-[70vh]` (móvil) y **`min-h-[85vh]`** (desktop).
    - **Alineación:** Padding top `pt-44` (móvil) y `pt-24` (desktop) para evitar solapamiento con el header.
    - **Tipografía:** Títulos en `6xl` (`lg:text-6xl`) con `font-extrabold` y `tracking-wide`.

## 🎨 Tokens de Diseño (Branding)
- **Rojo Autoser (Rediseño):** `#ED1C24` (Color institucional del logo).
- **Negro Autoser:** `#1A1A1A` (Rich Black para fondos premium).
- **Gris de Marca:** `#F4F4F4` (Para secciones de contraste suave).
- **Charcoal Text:** `#333333` (Para texto de cuerpo legible).

## 📐 Componentes Core
### 1. Botones (Utility Classes)
- **`.btn-agency`:** Fondo `#ED1C24`, texto blanco, tipografía `Outfit`, `uppercase`, `tracking-widest`. Efecto hover: `translate-y-[-2px]` y sombra suave.
- **`.btn-outline`:** Borde negro o blanco (según fondo), fondo transparente, `hover:bg-active`.

### 2. Secciones Premium
- **Glassmorphism:** Uso de `backdrop-blur` en menús móviles, headers y paneles de IA.
- **Shimmer Effect:** Animación de brillo sutil en encabezados importantes (`.shimmer`).
- **Scroll Reveals:** Animaciones integradas con Intersection Observer (`reveal-on-scroll`, `reveal-from-left`, `reveal-from-right`).

## 📂 Directorio de Páginas y Estado
| Sección | Directorio | Estado | Notas |
| :--- | :--- | :--- | :--- |
| **Inicio** | `home_redise_o_moderno` | ✅ | Guía base del sistema. |
| **Refacciones**| `refacciones_multimarca_moderno` | ✅ | **Update:** Hero ajustado a `85vh` para consistencia. |
| **Taller** | `taller_y_mec_nica_moderno` | ✅ | |
| **Hojalatería**| `hojalater_a_y_pintura_moderno` | ✅ | |
| **Seguros** | `seguros_multimarca_autoser_vallarta`| ✅ | |
| **Promociones**| `promociones_velocity_elite` | ✅ | Integrando sistema "Velocity Elite". |
| **Venta (S)** | `vende_tu_auto_redise_o_corregido` | ✅ | |

## 🔮 Roadmap de Calidad
1. **Unificación de Navegación:** Mantener el header con el borde superior rojo en todas las páginas.
2. **SEO:** Implementación de `meta tags` y `OpenGraph` faltantes (Prioridad alta).
3. **Optimización:** Revisión de rutas de imágenes en `../assets/`.

---
*Documentación actualizada por Antigravity el 5 de abril de 2026 para reflejar el cambio de tipografía (Montserrat) y estandarización de alturas hero.*
