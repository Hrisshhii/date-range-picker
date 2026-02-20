### Timezone-Safe Date & Time Range Picker

A fully accessible, DST-safe, timezone-aware Date & Time Range Picker built with:
React 18
TypeScript (strict mode)
Tailwind CSS
Storybook
Chromatic
Testing Library
axe-core accessibility validation

---

### Objective

Build a deterministic date and time range picker that:
- Handles timezone switching without shifting selected instants
- Correctly manages DST transitions
- Enforces explicit constraints (min/max, blackout dates, duration)
- Supports full keyboard-only workflows
- Provides screen-reader parity via ARIA grid semantics

---

### Architecture Overview

This project separates concerns into two major layers:

1) Core Logic Layer

- Zoned date-time modeling
- Instant-safe state representation
- Constraint validation engine
- Preset resolution logic
- Deterministic rounding rules
- DST-aware conversions using native Intl

---

2) UI Layer

- Custom-built calendar grid
- Keyboard navigation system
- Focus management
- ARIA-compliant grid semantics
- Edge-case-driven Storybook stories

---

### Strict Engineering Constraints

No external date-picker libraries
No component libraries
No imported picker logic
TypeScript strict mode enabled
No silent coercion of invalid inputs
Accessibility treated as first-class concern

---

### Testing Strategy

- Interaction tests using React Testing Library
- Accessibility assertions using axe-core
- Constraint validation coverage
- DST edge-case tests
- No snapshot-only testing

---

### Accessibility Commitment

- Keyboard-first navigation
- Proper ARIA grid roles
- Focus-visible management
- Screen reader announcements
- High-contrast mode support

---

#### Timezone & DST Handling

- Selections are stored as absolute UTC instants with explicit IANA timezone metadata.
- Timezone switching updates wall-time display only, never the underlying instant.
This prevents DST-induced shifts and ambiguous transitions.

---

### Deliverables

- Public Storybook (Chromatic published)
- Fully documented component API
- Constraint & DST test coverage
- Accessibility audit documentation

---

### Development
npm install
npm run dev
npm run storybook

---

### Storybook Chromatic

Link: https://6998a90229102f443d6b1cb3-ylzyekmhqk.chromatic.com/