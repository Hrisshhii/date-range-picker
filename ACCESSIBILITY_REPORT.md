# Accessibility Report

## Keyboard Navigation
- Arrow keys move focus within calendar grid
- Enter selects date
- Space selects date
- Escape resets selection
- PageUp / PageDown change month
- Home / End move within week

## ARIA Semantics
- role="grid" used for calendar
- role="row" and role="gridcell" implemented
- aria-selected reflects range state
- aria-current="date" marks today
- aria-disabled for blackout / invalid dates
- aria-live regions for month and selection changes
- role="alert" for validation errors

## Screen Reader Behavior
- Month change announced via aria-live
- Selection range announced
- Validation errors announced assertively

## Automated Testing
- axe-core (vitest-axe) used
- No accessibility violations detected

## Manual Testing
- Keyboard-only interaction tested
- Focus management verified
- Error states verified