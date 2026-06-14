# Aesthetic & Neobrutalism Design Guide
## Young Internet Explorers Style Guide

This system uses **Neobrutalism UI**, an eye-catching, high-contrast, structural design philosophy that separates itself from sterile modern styling with distinct thick outlines, rigid drop-shadows, and bright pastel color blocking.

---

## 🎨 Color Palette & Tailwinds
Our style architecture maps onto specific Tailwind utility colors to guarantee high accessibility and reading comfort:

| Design Token | CSS Selector/Variable | Visual Purpose |
| :--- | :--- | :--- |
| **Theme Base Canvas** | `bg-slate-50` / `text-slate-950` | Primary application canvas, high contrast and soft on electronic eyes. |
| **Command Primary** | `bg-indigo-600` / `text-white` | Sticky headers, primary button triggers, and focused elements. |
| **Highlight Pop** | `bg-yellow-400` / `text-indigo-950` | Focus states, helper hint boxes, and active tab indicators. |
| **Achievement Glow** | `bg-emerald-400` / `text-indigo-950` | Correct answers, scores greater than 80%, and certified completion badges. |
| **Warning Red** | `bg-rose-400` / `text-indigo-950` | Incomplete forms, deleted questions, or failing grades. |

---

## 📐 Structural Outlines & Offset Shadows
In Neobrutalism, elements have distinct "weight" and do not hover in soft clouds. Every card, button, and popup rests on solid, retro borders.

### 1. Solid Cards
Use the following Tailwind structure for primary elements:
```html
<div class="bg-white border-4 border-indigo-950 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]">
  <!-- Content goes here -->
</div>
```

### 2. Interactive Buttons
Interactive items must push down on click, simulating tactile pushbuttons:
```html
<button class="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black px-6 py-3 border-2 border-indigo-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
  Tactile Trigger
</button>
```

---

## 🎭 Staggered Motion Layouts
To guide student focus step-by-step through the exam questions and portal views, we use modular state triggers from `motion/react`:

1. **Card Transitions**: Soft slide-ups representing stage entry:
   ```typescript
   initial={{ opacity: 0, y: 15 }}
   animate={{ opacity: 1, y: 0 }}
   exit={{ opacity: 0, y: -15 }}
   transition={{ duration: 0.25, ease: "easeOut" }}
   ```

2. **Choice Button Selectors**: Scale hops reinforcing click confirmation:
   ```typescript
   whileTap={{ scale: 0.98 }}
   ```

---

## 🔗 Related Resources
- Go back to the [Main Design Specification & Prompts](DESIGN.md).
- Learn about curriculum composition under the [Syllabus & Question Formulation Guide](SYLLABUS_GUIDE.md).
