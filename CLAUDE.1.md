# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000 (also generates .next/dev/types/ for TypeScript)
npm run build    # Production build
npm run lint     # ESLint
npm test         # Run all tests with Vitest
npx vitest tests/components/Navbar.test.tsx  # Run a single test file
```

> **Note:** Run `npm run dev` at least once after cloning — it generates `.next/dev/types/routes.d.ts`, which `next-env.d.ts` depends on for CSS and route type declarations. Without it, TypeScript will show false-positive errors on CSS imports.

## Architecture

**Next.js App Router with route groups:**
- `app/(public)/` — Unauthenticated pages (`/`, `/login`, `/signup`, `/preview`). Wrapped in a layout with `.public` class.
- `app/(dashboard)/` — Authenticated pages. Wrapped in a layout that renders `<Navbar>`.
- Route groups use parentheses and do not affect the URL.

**Component convention:** Each component lives in its own directory under `components/` with three files: the component (`Navbar.tsx`), a CSS Module (`Navbar.module.css`), and a barrel export (`index.ts`). Import via `@/components/ComponentName`.

**Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`. Theme tokens (colors, font) are defined with `@theme` in `globals.css` — use `bg-primary`, `text-secondary`, etc. Utility classes `.center-content`, `.page-content`, and `.form-title` are global layout helpers defined there.

**Path alias:** `@/*` resolves to the project root (e.g., `@/components/Navbar`, `@/app/globals.css`). CSS imports inside `app/` can use relative paths (e.g., `./globals.css`).

**Tests:** Test files live in `tests/` mirroring the source structure. Vitest runs in jsdom with React Testing Library. `vitest/globals` are enabled so `describe`/`it`/`expect` don't need imports (though explicit imports are fine too).

## Aditional Coding Preferences
- Do not use semicolons for Javascript or Typescript code.
- Do not apply tailwind classes diretly in component templates unless essential or just 1 at most. If an element needs more than 1 single tailwind class, combine them into a custo class using the `@apply` directive.
- Use minimal project dependencies where possible.
- Use the `git switch -c` command to switch to new branches, not `git checkout`.
