# Landing Page Documentation
**Date:** January 2026
**Version:** 2.0 (Tactical Lab Iteration)
**Component:** `components/LandingPage.tsx`

---

## 1. Overview

The **Landing Page** serves as the primary entry point for the *DataScout AI* platform (formerly AI Dataset Discovery Pipeline). It establishes the brand identity, communicates the core value proposition, and acts as the "airlock" before users enter the specialized "Tactical Data Interface."

Unlike the internal application, which features a dense, high-utility "HUD" aesthetic, the Landing Page utilizes a **Full-Width Modern SaaS** layout. This separation is intentional: it lowers the cognitive load for new users, presenting a clean, welcoming facade that transitions into the more complex, tool-heavy internal workspace.

## 2. Design Philosophy

### 2.1 Aesthetic: "Tactical Lab Clean"
The visual language bridges the gap between modern marketing design and the app's internal technical look.
*   **Palette:**
    *   **Backgrounds:** `Slate 50/100` (`#F8FAFC`, `#F1F5F9`) for a clean, expansive feel.
    *   **Typography:** Dark Slate (`#0F172A`) for high readability contrast.
    *   **Accent:** Technical Cyan/Teal (`#0891B2`) is used sparingly for the "Start Discovery" CTA and key icons, establishing continuity with the internal app's accent color.
*   **Typography:** The font stack prioritizes readability (`Inter` / `System Sans`) over the internal app's sci-fi fonts (`Orbitron`), reserving the latter only for specific brand elements if needed.

### 2.2 Layout Strategy
The page adheres to a standard **Hero + Features** hierarchy:
1.  **Navbar**: Minimal brand reinforcement and version tracking.
2.  **Hero Section**:
    *   **Headline**: Large, commanding text (5xl+) focusing on the "Intelligence Layer" value prop.
    *   **Subhead**: Clear explanation of the *agentic* nature of the tool (Autonomous vs Manual).
    *   **Primary CTA**: High-contrast, shadowed button to effectively funnel users into the app.
3.  **Feature Grid**: Three-column layout breaking down the complex multi-agent system into understandable pillars:
    *   *Deep Web Scanning* (Discovery Agent)
    *   *Strategy Generation* (Strategy Agent)
    *   *Schema Inference* (Analysis Agent)

## 3. Component Architecture

The `LandingPage.tsx` is a self-contained React functional component. It allows for strict separation of concerns—marketing assets do not pollute the core application logic.

### 3.1 Props Interface
```typescript
interface LandingPageProps {
  onEnter: () => void; // Callback trigger to transition state in App.tsx
}
```

### 3.2 Key Sub-Components
*   **Header**: Sticky navigation bar containing the "DataScout" logo and version badge. Uses `backdrop-blur` in future iterations if needed.
*   **Hero Container**: Flex-column layout centered with `max-w-7xl` to prevent stretching on ultra-wide monitors.
*   **Interactive CTA**: The "Start Discovery" button triggers the `onEnter` prop. It features distinct `:hover` and `:active` states to provide tactile feedback before the app transition.
*   **Feature Cards**: `div` containers with `rounded-2xl`, white backgrounds, and subtle `border-slate-200`. They use `shadow-sm` transitioning to `shadow-md` on hover to encourage exploration.

### 3.3 Icons
The page utilizes the shared icon library (`components/icons/`) to ensure visual consistency between the marketing page and the app.
*   `MagnifyingGlassIcon`: Discovery/Search.
*   `ApiIcon`: Strategy/Connectivity.
*   `RefineIcon`: Processing/Inference.

## 4. User Flow Integration

The application root (`App.tsx`) manages the visibility of the Landing Page via the `showLanding` state.

1.  **Initial Load**: `App` initializes with `showLanding = true`.
2.  **Render**: `LandingPage` is mounted, overlaying the entire application.
3.  **Action**: User clicks "Start Discovery".
4.  **Transition**: `onEnter()` is fired. `App` sets `showLanding = false`.
5.  **Workspace Reveal**: The Landing Page unmounts, revealing the **Tactical Data Interface** (Header + Sidebar + Empty State).

This flow ensures that the heavy "Tactical" logic (WebGL backgrounds, complex state) can be initialized or kept lightweight until the user explicitly commits to entering the workspace.

## 5. Maintenance & Extension

### Modifying Content
All text content (Headlines, Feature descriptions) is hardcoded within the JSX for simplicity and SEO (if exported). To update copy, edit the text strings directly in the `Hero Section` block.

### Styling Updates
The component relies on **Tailwind CSS** utility classes.
*   **Global Theme Variables**: It respects `:root` variables (`--cyan-primary`, `--text-bright`) defined in `styles.css`. Changing the theme in `styles.css` will automatically ripple through to the Landing Page's color accents.

### Responsiveness
The layout is mobile-first:
*   **Mobile**: Single column, vertical stack.
*   **Tablet/Desktop (`md:`, `lg:`)**: Transitions to horizontal flex layouts and 3-column grids.

---
*Maintained by the Frontend Architecture Team (Gemini-2.0-Flash-Exp)*
