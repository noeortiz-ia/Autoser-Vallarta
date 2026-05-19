# ⚠️ n8n Development Pitfalls & Antipatrones

Este documento registra los errores técnicos, "gotchas" y comportamientos inesperados descubiertos al desarrollar flujos avanzados en n8n, LangChain y WhatsApp API. El objetivo es servir como memoria institucional para evitar repetirlos en el futuro.

## 1. El Falso "Modo Expresión" y los Saltos de Línea (JSON a Texto)
**El Error:**
Al intentar enviar un objeto JSON estructurado a una base de datos (ej. Supabase) desde un parámetro de n8n, usar los corchetes `{{ }}` dentro del modo "Fixed" (caja con fondo gris oscuro) y dejar saltos de línea (`\n`) ocultos al final de la expresión.

**La Consecuencia:**
n8n evalúa el objeto, pero al detectar el salto de línea al final, lo concatena. Esto fuerza a JavaScript a convertir el objeto a texto mediante `.toString()`, insertando literalmente la cadena string `"[object Object]\n"` en la base de datos (en lugar del JSON válido). Cuando el nodo de *Postgres Chat Memory* intenta leer el historial y deserializarlo, se topa con un texto plano y rompe la ejecución del agente con el error crítico: `Got unexpected type: undefined`.

**La Prevención Estricta:**
- Para enviar objetos puros a JSONB: **SIEMPRE** activar el "Expression Mode" (icono `JS` / engranaje, para que el fondo se ponga verde/azul).
- Escribir la estructura directamente empezando con `({` y terminando con `})` (sin los `{{ }}` externos).
- **Regla de Oro:** **Eliminar con Backspace** cualquier salto de línea, "Enter" oculto o espacio vacío después de la última llave de cierre. La vista previa debe mostrar exactamente `[Object: { "type": "human"... }]` y nunca `[object Object]\n\n`.

---

## 2. El Agente "Sordo" ante Eventos No Textuales (Carritos de Compra)
**El Error:**
Asumir que el nodo disparador (WhatsApp Trigger) siempre entregará la intención del usuario en la propiedad `text.body`.

**La Consecuencia:**
Cuando un usuario envía un carrito de compras desde el catálogo de WhatsApp, el webhook cambia el `type` a `order` y la propiedad `text.body` desaparece. Si el nodo que alimenta el prompt del Agente (`Edit Fields`) solo busca ciegamente `text.body`, retornará `undefined`. El Agente LLM recibe un prompt vacío, perdiendo totalmente el contexto de lo que el cliente acaba de hacer.

**La Prevención Estricta:**
- Siempre interceptar y "traducir" los eventos no textuales (`order`, `interactive`, `image`) a frases en lenguaje natural (texto plano) antes de inyectarlos como el mensaje del usuario hacia el LLM.
- **Patrón de Intercepción:**
  ```javascript
  {{ $json.messages[0].text?.body || ($json.messages[0].type === 'order' ? '🛒 Acabo de añadir a mi carrito la unidad: ' + $json.messages[0].order.product_items[0].product_retailer_id : 'Mensaje tipo: ' + $json.messages[0].type) }}
  ```

---

## 3. Tool Parameters vs. System Prompts (El "Código Pelón")
**El Error:**
Incrustar variables de n8n (ej. `{{ $json.telefono }}`) directamente dentro del gran bloque de texto del *System Message* del nodo Agente estando en modo "Fixed" (fondo gris).

**La Consecuencia:**
En el modo "Fixed" nativo, n8n no evalúa las expresiones internas. Le pasa el bloque de reglas a la IA literalmente como texto. La IA, que no procesa código de n8n, asume que `{{ $json.telefono }}` es el texto que debe usar. Al ejecutar una herramienta (ej. Enviar un Email), la IA escupe literalmente esos corchetes al equipo de ventas en lugar del número telefónico.

**La Prevención Estricta:**
- Si necesitas inyectar contexto dinámico en las reglas de la IA (números, nombres, fechas), **todo el campo del System Message debe cambiarse a modo Expresión (fondo verde)**.
- Solo así, n8n pre-procesará e inyectará los datos reales (ej. `521322...`) en el string gigante ANTES de pasárselo al LLM, garantizando que la IA lea la información correcta.

---

## 4. Markdown en Herramientas de Salida Plana (Emails sucios)
**El Error:**
Pedirle a la IA que use una herramienta como Email sin darle reglas estrictas de formato, permitiendo que utilice su formato predeterminado basado en Markdown (`**negritas**`).

**La Consecuencia:**
El correo llega sucio y lleno de asteriscos (`**Nombre:** Juan`), lo que se ve muy poco profesional para los CRM o los asesores que reciben el lead en texto plano.

**La Prevención Estricta:**
- Siempre incluir una "Plantilla Obligatoria" en el System Prompt para estandarizar la salida de datos a través de herramientas de texto.
- Prohibir explícitamente el uso de Markdown con una instrucción fuerte:
  > `"PROHIBIDO USAR MARKDOWN: No uses asteriscos (**), almohadillas (#), ni negritas en el cuerpo del correo. Redacta en TEXTO PLANO ESTRICTO."`
