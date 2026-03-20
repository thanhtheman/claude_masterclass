---
name: Firestore real-time listener patterns
description: Known patterns and pitfalls in this codebase's Firestore usage with onSnapshot
type: project
---

The codebase uses Firestore real-time listeners (`onSnapshot`) via custom hooks (e.g., `useHeists`). Patterns to watch for in reviews:

- **Multiple simultaneous listeners on one page**: `HeistsPage` opens 3 `onSnapshot` listeners concurrently. Flag if a new page adds more without lazy/conditional loading strategy.
- **Redundant `as Type` casts after `.withConverter()`**: When a Firestore converter is applied, `doc.data()` is already typed — casting with `as Heist` suppresses type safety. Flag these casts.
- **Loading guard gaps**: All sections fed by `onSnapshot` hooks must check the `loading` flag before rendering. Missing guards cause silent empty-state flashes.

**Why:** These patterns have caused bugs (empty-state flicker, type-safety gaps) and resource issues (open connections) in the heists feature.
**How to apply:** When reviewing any file that calls a `use*` hook returning `{ loading }`, verify the loading state is consumed in every render branch that depends on the hook's data.
