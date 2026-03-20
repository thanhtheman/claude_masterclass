---
name: Recurring style violations
description: Style violations that appear repeatedly in this codebase across reviews
type: feedback
---

The following style violations appear in multiple files and should be flagged on every review:

- **Semicolons in TypeScript/JavaScript**: Project prohibits semicolons (CLAUDE.md). `lib/countdown.ts` has been flagged in two consecutive reviews — every statement ends with a semicolon. Flag all occurrences.
- **Double-quoted `'use client'` directive**: Should be single-quoted `'use client'`. Seen in `app/(dashboard)/heists/page.tsx:1` in this review.
- **Tailwind classes applied inline**: Classes beyond a single utility must use `@apply` in a CSS Module. Page files (e.g., `heists/page.tsx`) use bare class names like `active-heists`, `assigned-heists`, `preview-grid` as JSX `className` strings — verify these are either global utilities or flag them.

**Why:** CLAUDE.md explicitly prohibits semicolons and direct multi-class Tailwind application in templates.
**How to apply:** Flag every instance as a Nit-level style violation with a direct reference to CLAUDE.md.
