# 📓 Registro de Sesiones - Autoser Vallarta

Este archivo es la bitácora exclusiva del desarrollo del sitio web **Autoser Vallarta**. Registra únicamente los cambios técnicos, despliegues y optimizaciones realizados en esta carpeta.

## Sesión 6: Optimización de Formato WhatsApp y Vinculación de Promociones (17 Mayo 2026)

### Objetivos Logrados
1. **Corrección de Formato de Texto en WhatsApp (Completado y Validado):** Diseñado e implementado un método de conversión de Markdown a formato nativo de WhatsApp. Se implementaron expresiones regex en un nodo de código JavaScript en n8n que resuelven las negritas duplicadas (`**texto**` -> `*texto*`) y limpian los enlaces Markdown (`[Texto](URL)` -> `Texto: URL`), eliminando asteriscos huérfanos y garantizando una experiencia de usuario premium e impecable en el chat.
2. **Vinculación de Botones en Promociones (Completado):** Corregidos todos los botones huérfanos en [promociones.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/promociones.html). Se convirtieron de etiquetas estáticas `<button>` a enlaces `<a href>` integrados con los canales reales y preconfigurados de la agencia:
   - **Ver Promociones:** Añadido smooth scroll nativo hacia `#seminuevos`.
   - **Asistencia VIP:** Conectado al WhatsApp principal de Ventas Digitales (`523343462849`) con mensaje prellenado.
   - **Cotizar Crédito:** Conectado al WhatsApp del asesor de Seminuevos (`523343462849`) con mensaje prellenado.
   - **Agendar Cita (Taller):** Conectado al WhatsApp del Taller Multimarca (`523223058056`) con mensaje prellenado.
   - **Cotizar sin Compromiso (Hojalatería):** Conectado al WhatsApp del taller de Hojalatería y Pintura (`523223015540`) con mensaje prellenado.
   - **Solicitar Cotización (Seguros):** Redirigido al cotizador multi-step nativo en [seguros.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/seguros.html).
3. **Auditoría de Seguridad y Erradicación del Número de la Competencia (Completado):** Se identificó que el número `523221960922` (previamente documentado y utilizado en el sitio) pertenece a la competencia directa (*Toyota Puerto Vallarta*). Realizamos una auditoría en caliente en todo el repositorio y reemplazamos el número por el contacto oficial de ventas de Autoser Vallarta (`523343462849`) en los siguientes archivos maestros:
   - [promociones.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/promociones.html) (Enlace de Asistencia VIP)
   - [gracias.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/gracias.html) (Mapeo dinámico de redirección para los formularios de 'Ventas' y 'Vende tu Auto')
   - [README.md](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/README.md) (Guía técnica y de mantenimiento)
4. **Restauración de URLs Originales en Unidades Destacadas (Completado):** Verificamos que las URLs en la base de datos central de destacados [featured_units.js](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/featured_units.js) respetan la ruta original del sitio de WordPress (`/seminuevos/seminuevo/`) en lugar del enmascaramiento anterior `/auto/`. Se incrementó el parámetro de cache-busting en [index.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/index.html) a `?v=1.0.2` para forzar a todos los navegadores de los clientes a descargar el archivo actualizado de inmediato y evitar que sigan viendo las URLs con `/auto/` cacheadas.
5. **Automatización y Precios de Oferta en Unidades Destacadas (Completado):** Eliminamos la necesidad de actualizar o subir manualmente el archivo `featured_units.js` en el futuro mediante una integración dinámica bidireccional:
   - **WordPress Plugin (ACF & REST API):** Agregada una opción en la página de ajustes de `Autoser Sync` para configurar la meta key de destacados (por defecto `destacado`). Creamos el endpoint público `/wp-json/autoser/v1/featured` que consulta en tiempo real los autos destacados. Modificamos el endpoint para retornar el precio de oferta (`price_special`) formateado y corregimos el bug de traducción de transmisiones haciéndolo insensible a mayúsculas/minúsculas (`stripos` en lugar de comparación exacta). También inyectamos headers HTTP para prevenir que la API sea cacheada por servidores o CDNs (`Cache-Control: no-store...`).
   - **Frontend (Integración Dinámica y Diseño de Ofertas Agresivo):** Modificado [index.html](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/index.html) para consumir dinámicamente este REST API inyectando un parámetro de cache-busting `?_t=` en tiempo real. Si una unidad cuenta con precio de oferta, la interfaz la renderiza con un diseño comercial altamente agresivo y premium: se inyecta un **badge rojo parpadeante ("OFERTA" / "SALE")** con animación `animate-pulse` en la esquina superior derecha de la imagen, se expone explícitamente el texto **"Precio de Lista: $XXX,XXX"** (con el valor original tachado en rojo y en un tamaño de letra legible), y se muestra el precio final de oferta de manera gigante y en negrita pura (**"OFERTA: $YYY,YYY"** en un tamaño `text-2xl`) para maximizar la tasa de conversión (CRO).
   - **Empaquetado:** Reconstruido y empaquetado de manera limpia el instalable final [autoser-inventory-sync.zip](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/autoser-inventory-sync.zip) listo para subirse a WordPress.

---

## Sesión 5: Pruebas de Integración y Lanzamiento de Producción (17 Mayo 2026)

### Objetivos Logrados
1. **Depuración del Payload de Embeddings:** Solucionado el error de serialización JSON en el nodo de OpenAI Embeddings en n8n mediante la transición al modo de cuerpo "Raw" (application/json) y la inyección robusta del texto de la ficha técnica.
2. **Upsert Semántico a Pinecone Sincronizado:** Corregido el envío de payloads vacíos a Pinecone. El nodo ahora inyecta dinámicamente el vector y todos los metadatos ACF relevantes (precio, precio especial, kilometraje, año, marca, modelo, color, transmisión, ficha técnica) en el namespace `inventory` de forma 100% exitosa.
3. **Optimización de UX en WhatsApp:** Blindado el Asesor de Seminuevos contra fugas de enlaces crudos de archivos `.jpeg` en chats de WhatsApp, garantizando que el bot solo responda con enlaces estéticos al `permalink` del auto en el sitio web.
4. **Empaquetado de Producción:** Regenerado y empaquetado el instalable final [autoser-inventory-sync.zip](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/autoser-inventory-sync.zip) listo para instalación inmediata en el sitio de producción.
5. **Pruebas de Sincronización en Tiempo Real:** Validación exitosa de los eventos automáticos de creación, actualización y despublicación (borrado/borrador), operando en menos de 2 segundos y manteniendo a Pinecone 100% sincronizado con WordPress sin intervención humana.

---

### 🛠️ 16 de Mayo, 2026
## Sesión 4: Arquitectura de Sincronización de Inventario en Tiempo Real (16 Mayo 2026)

### Objetivos Logrados
1. **Solución a Alucinaciones del Bot:** Diseñada una arquitectura basada en eventos (Event-Driven) para erradicar el Web Scraping en tiempo real del bot de n8n, el cual causaba latencia, datos sucios y alucinaciones.
2. **Plugin WordPress a Medida:** Desarrollado el plugin `Autoser Inventory Sync` que se activa en tiempo real al publicar, actualizar o eliminar unidades de inventario, enviando un payload JSON estructurado a n8n.
3. **Plan de Integración Convex/Pinecone:** Elaborada una guía técnica paso a paso para guardar los datos estructurados en Convex (para búsquedas por filtros rápidos <10ms) y en Pinecone (para búsqueda semántica mediante embeddings con OpenAI).

### Detalles Técnicos
- **Plugin de WordPress:** Creado [autoser-inventory-sync.php](file:///Users/noeortiz/Dev/Github/Autoser-Vallarta_new/assets/wp-plugin-autoser-sync/autoser-inventory-sync.php) con soporte para Custom Post Types personalizados, mapeo de Meta Keys (`precio`, `kilometraje`, `anio`, `marca`, `modelo`, `transmision`), headers de seguridad Bearer Token y funcionalidad de sincronización masiva inicial (Bulk Sync) en 1 clic.
- **Documentación Técnica:** Creado el artefacto de arquitectura y flujo en n8n: [solucion_sincronizacion_inventario.md](file:///Users/noeortiz/.gemini/antigravity/brain/dfc8da71-9520-411e-a450-f4e1f5d2b59e/artifacts/solucion_sincronizacion_inventario.md).

---

### 🛠️ 14 de Mayo, 2026
## Sesión 3: Integración de Carga Multiobjeto y Ficha de Solicitud Premium (14 Mayo 2026)

### Objetivos Logrados
1.  **Ficha de Solicitud Premium:** Creado `detalle-solicitud.html`, una página que centraliza los datos del cliente, vehículo y multimedia en una vista elegante.
2.  **Lógica Centralizada:** Actualizado `assets/js/forms-handler.js` (v1.1.0) para:
    *   Soportar múltiples subidas secuenciales a Cloudinary.
    *   Detectar automáticamente tipos de archivo (Imagen/Video).
    *   Generar una URL única con parámetros codificados hacia la nueva ficha de detalle.
    *   Enviar esta URL única a n8n en el campo `foto_url`, manteniendo compatibilidad con flujos existentes.
3.  **Interfaz de Formularios:**
    *   **HyP (`hojalateria-y-pintura.html`):** Habilitado `multiple` y soporte para video. Actualizado feedback visual.
    *   **Seminuevos (`compramos-tu-auto.html`):** Habilitado `multiple` y soporte para video. Sincronizado con Cloudinary.

### Detalles Técnicos
- **Cloudinary:** Uso del endpoint `/auto/upload` para manejar formatos mixtos.
- **Portabilidad:** Los datos se pasan vía Query Params (URL), evitando bases de datos intermedias y facilitando el acceso inmediato desde Google Sheets y Gmail.
- **UX:** Implementado feedback de "Subiendo X/Y..." para mejorar la percepción del tiempo de espera en archivos pesados.

---

**Sesión 2: Implementación de Bitácora Local**
- Creación de `SESSIONS.md` para seguimiento exclusivo de este repositorio.
- Limpieza de historial para asegurar que solo se registren acciones sobre `Autoser-Vallarta_new`.

**Sesión 1: Auditoría de SEO y Analytics**
- **SEO:** Revisión y actualización de etiquetas `<title>`, meta descripciones y URLs canónicas en los archivos HTML (index, nosotros, promociones, etc.).
- **Microsoft Clarity:** Verificación de la correcta implementación del código de seguimiento en las páginas del sitio.
- **Promociones:** Ajustes de contenido y optimización en `promociones.html`.

---

## 📋 Guía para Colaboradores
Para mantener esta bitácora organizada:
1. **Foco en el Sitio:** Registrar solo cambios que afecten a la estructura o contenido de `Autoser-Vallarta_new`.
2. **Formato:** Usar el encabezado de fecha `### 🛠️ DD de Mes, YYYY`.
3. **Detalle Técnico:** Mencionar archivos específicos afectados (ej. `index.html`, `assets/js/...`).
