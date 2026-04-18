# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Precision"

This design system is engineered to transcend the standard automotive dealership template. Moving away from static, boxy layouts, we embrace **"The Kinetic Precision."** This Creative North Star dictates an experience that feels as fast, engineered, and premium as the vehicles being showcased. 

We break the "template" look by utilizing intentional asymmetry—inspired by the aerodynamic lines of a performance car—and high-contrast typography scales that command attention. By layering sophisticated surfaces and using "breathing room" (negative space) as a luxury asset, the system creates a digital showroom that feels editorial, high-tech, and authoritative.

---

## 2. Colors: Tonal Engineering

Our palette is not just about brand recognition; it’s about depth and focus. We use the contrast between the Vibrant Red and Deep Slate Gray to simulate the high-performance environment of a modern garage or a luxury cockpit.

### The Palette
- **Primary / Action:** `primary` (#ae0012) and `primary_container` (#d71921). Use these sparingly for critical paths and calls to action.
- **Deep Slate Base:** `on_surface` (#1b1b1c) and `inverse_surface` (#303031) provide the "heavy" premium feel.
- **Surface Tiers:** We utilize `surface_container_lowest` (#ffffff) through `surface_dim` (#dcd9da) to create structural depth.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Traditional dividers feel "cheap." Instead, boundaries must be defined solely through background color shifts. A `surface_container_low` section sitting against a `surface` background creates a clean, sophisticated break without the visual clutter of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to "nest" importance:
1. **Base Layer:** `surface` (#fcf8f9).
2. **Structural Sections:** `surface_container_low`.
3. **Interactive Components (Cards/Modals):** `surface_container_lowest` (Pure White) to create a natural, soft lift.

### The "Glass & Gradient" Rule
For floating elements, such as the AI Chat Agent or navigation overlays, use **Glassmorphism**. Apply a semi-transparent surface color with a `backdrop-blur` (12px-20px) to allow background colors to bleed through. For primary CTAs, use a subtle linear gradient from `primary` (#ae0012) to `primary_container` (#d71921) at a 135-degree angle to add "soul" and a sense of metallic sheen.

---

## 3. Typography: Bold Authority

We use typography to convey precision engineering and speed.

- **Display & Headlines:** `plusJakartaSans` (Bold/ExtraBold). These are our "hero" fonts. Use the `display-lg` (3.5rem) for massive, asymmetrical headlines that overlap imagery to create a sense of depth and motion.
- **Body & Labels:** `inter`. A clean, highly legible sans-serif for technical details.
- **Hierarchy Role:** Large headlines should feel like an editorial magazine spread. Use tight letter-spacing (-0.02em) on headlines to suggest speed and high-end density.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are often too "muddy." In this system, depth is achieved through **Tonal Layering**.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` section. The minute shift in brightness creates a sophisticated "lift."
- **Ambient Shadows:** When a floating effect is necessary (e.g., a car comparison modal), use extra-diffused shadows. 
    - *Example:* `0px 20px 40px rgba(27, 27, 28, 0.06)`. The shadow color must be a tinted version of `on_surface`, never a neutral gray.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, it must be a **Ghost Border**: use the `outline_variant` token at 15% opacity. Never use 100% opaque borders.
- **Glassmorphism:** Use semi-transparent layers for the AI Chat Agent to make it feel like a "heads-up display" (HUD) integrated into the car’s windshield.

---

## 5. Components: Precision Primitives

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundedness (1.5rem), and `title-sm` typography. 
- **Secondary:** Surface-container-lowest with a "Ghost Border" and `on_surface` text.
- **Tertiary:** Text-only with an arrow icon that shifts 4px on hover, suggesting forward motion.

### The AI Chat Agent (Automotive Specialist)
- **Container:** Glassmorphic pane using `surface_container_highest` at 80% opacity with a 20px backdrop blur.
- **User Bubbles:** `primary` color with `on_primary` text.
- **Agent Bubbles:** `surface_container_low` to feel grounded and helpful.
- **Visual Cue:** Incorporate a subtle red "pulse" glow in the header to indicate the AI is "listening" or "processing" with technical precision.

### Cards & Lists
**Forbid the use of divider lines.** 
- Separate list items using the spacing scale (e.g., `spacing.4` or 1rem of vertical gap).
- Use `surface_container_low` background blocks to group related car specs instead of borders.

### Input Fields
- **Style:** Underlined or "Soft Box." Use `surface_container_high` for the field background with an `md` (0.75rem) corner radius. 
- **Active State:** The bottom border transforms into a 2px `primary` line, indicating "Ignition."

---

## 6. Do's and Don'ts

### Do:
- **Use Asymmetry:** Place images of cars slightly off-center or overlapping the edge of a container to suggest movement.
- **Embrace White Space:** High-end brands aren't crowded. Use `spacing.20` and `spacing.24` to let premium inventory "breathe."
- **Use High-Contrast Scales:** Pair a `display-lg` headline with a `body-sm` detail for a sophisticated, modern contrast.

### Don't:
- **No Heavy Outlines:** Avoid 100% opaque borders. They make the UI look like a legacy spreadsheet.
- **No Standard Shadows:** Never use the default "Drop Shadow" preset in design tools. Always customize for low opacity and high blur.
- **No Centered-Only Layouts:** Centering everything feels safe and generic. Use left-aligned editorial layouts to maintain the "Kinetic" brand identity.
- **No Harsh Corners:** Avoid `none` (0px) roundedness unless for very specific technical dividers. Use `lg` and `xl` to keep the experience feeling contemporary and approachable.