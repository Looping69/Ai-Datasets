# Landing Page Documentation
**Date:** January 2026
**Version:** 3.0 (Cyberpunk Brutalist Core)
**Component:** `components/LandingPage.tsx`

---

## 1. Overview

The **Landing Page** is the high-impact "Airlock" for the *DataScout AI* platform. It has been redesigned from the ground up to reflect a **Cyberpunk Brutalist** aesthetic, emphasizing raw technical power, high-contrast visual warfare, and "System-First" utility. 

This is not a SaaS page; it's a terminal interface for data liberation.

## 2. Design Philosophy

### 2.1 Aesthetic: "Cyberpunk Brutalist"
The visual language is aggressive, raw, and high-contrast.
*   **Palette:**
    *   **Background:** Deep Void (`#050505`).
    *   **Accents:** Acid Green (`#bfff00`) for primary actions, Cyber Red (`#ff003c`) for warnings/secondary highlights.
    *   **Typography:** Monospace (`Share Tech Mono`) for all system data; Ultra-bold Sans-serif for headlines.
*   **Geometry:** Sharp 4px borders, non-rounded corners (classic brutalism), and skewed background elements.

### 2.2 Layout Strategy
The page utilizes a high-impact grid system:
1.  **Header**: Black-box terminal strip with a glitching logo and system status.
2.  **Hero Section**: 
    *   **Split Layout**: Left side contains "Mission Objectives" and large, raw typography. Right side features a "Data Stream Visualizer" mock-up.
    *   **Buttons**: Blocky, high-contrast buttons with hover "offset" shadows.
3.  **Feature Grid**: A monolithic 3-column block with shared borders, creating a single massive "Technical Unit" feel.

## 3. Component Architecture

### 3.1 Styling
The component uses custom CSS classes defined in `styles.css` under the `/* ===== CYBERPUNK BRUTALIST THEME ===== */` section:
*   `.cyber-root`: Global wrapper for theme variables.
*   `.cyber-grid`: Background grid lines.
*   `.cyber-button`: Brutalist button with offset hover states.
*   `.cyber-glitch-text`: Animated text glitch effect using `::before` and `::after` pseudo-elements.

### 3.2 Icons
Uses standard project icons but wrapped in high-contrast brutalist containers (White/Green/Red blocks).

## 4. User Flow
The flow remains consistent: `onEnter` transitions the state from the landing interface to the core application workspace.

---
*Maintained by the Systems Architecture Team (Autonomous Agent Core)*
