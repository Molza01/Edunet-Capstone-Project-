# UI Design & Development Plan: Teen Digital Wellness Dashboard

## 1. Project Overview
**Goal:** Transform the existing functional form into an engaging, non-judgmental "Digital Health Checkup" for teenagers.
**Core Philosophy:** "Smart Defaults, Low Friction." Users shouldn't need to know their blood pressure to get a useful result, but the UI should educate them on how these factors connect.

## 2. Design System

### Target Audience
*   **Users:** Students/Teenagers (13-20 years).
*   **Tone:** Modern, Tech-forward, Empathetic, Clear.

### Color Palette (Tailwind CSS)
| State | Color/Shade | Meaning |
| :--- | :--- | :--- |
| **Primary** | `teal-600` / `cyan-500` | Calm, Trust, Technology. |
| **Background** | `slate-50` / `white` | Clean, Medical but not sterile. |
| **Healthy** | `emerald-500` | Balanced lifestyle. |
| **Warning** | `amber-500` | Mild/Moderate risk (Action needed). |
| **Critical** | `rose-600` | Severe risk (Professional help advised). |

## 3. User Experience (UX) Flow

### A. The "Persona" Hook (Top of Form)
Instead of asking for dry medical data immediately, we start with relatable *Personas*. This pre-fills the complex biological fields (BP, HR, Sleep) which users commonly don't know.

*   **🏃 The Athlete:** Active, Good Sleep, Low BP.
*   **📚 The Student:** Average Activity, Okay Sleep.
*   **🎮 The Gamer/Stressed:** High Screen Time, Poor Sleep, Higher BP.
*   **⚡ The Anxious:** High HR, Poor Functioning.

### B. The "Smart" Input Section
Inputs are grouped logically to reduce cognitive load:
1.  **Basics:** Age, Gender.
2.  **Digital Life:** Hours per day (Slider), Internet Impact.
3.  **Well-being:** Sleep Quality (Icons), Social Connection.

### C. The Results Dashboard
A distinct results view that replaces the form upon submission.
*   **Hero Gauge:** A semi-circle gauge showing the Risk Score (0-3).
*   **The "Why":** A section explaining *which* factors drove the score (e.g., "Your high screen time combined with poor sleep is raising your stress levels").
*   **Action Plan:** 3 bullet points specific to their Risk Level.

## 4. Component Architecture (Next.js)

Recommended structure for `app/components/`:

```
/app
  /components
    Navbar.tsx            # Simple header
    PersonaSelector.tsx   # Grid of 4 cards to quick-set vitals
    AssessmentForm.tsx    # The main input groups
    ResultsDashboard.tsx  # The post-submission view
    RiskGauge.tsx         # Visual representation of the score
```

## 5. Development Roadmap

### Phase 1: Component Refactor
*   Extract the current form logic from `page.tsx` into `AssessmentForm.tsx`.
*   Create `PersonaSelector.tsx` to handle the logic currently done by the small helper buttons.

### Phase 2: Visual Enhancements
*   **Sliders:** Replace numeric dropdowns for "Hours" and "Sleep" with `input type="range"` for better interactivity.
*   **Icons:** Use a library like `lucide-react` to add visual cues to the inputs (e.g., a Moon icon for sleep, WiFi icon for internet).

### Phase 3: The Dashboard View
*   Implement the Conditional Rendering in `page.tsx`:
    *   `if (!result) return <AssessmentForm />`
    *   `if (result) return <ResultsDashboard data={result} />`
*   Style the "Severe" state with a soft red background (`bg-rose-50`) and "Healthy" with soft green (`bg-emerald-50`).

## 6. Implementation Snippets

### Persona Card Logic
```tsx
const personas = [
  { id: 'athlete', label: 'Active / Athlete', bpm: 65, bp_sys: 110, sleep: 35 },
  { id: 'average', label: 'Average Student', bpm: 80, bp_sys: 120, sleep: 45 },
  { id: 'gamer',   label: 'Heavy Gamer',    bpm: 90, bp_sys: 130, sleep: 60 },
];
```

### Digital Habits Slider
```tsx
<input 
  type="range" 
  min="0" max="18" 
  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
/>
```
