# Plan: Route Protection

## Context
Both route group layouts are currently minimal with no auth checks. Users can freely visit `/login` or `/signup` while logged in, and dashboard pages while logged out. This plan adds route guards to both layouts using the existing `useUser` hook, and shows a simple loader while Firebase resolves the initial auth state to prevent flashing wrong content.

Spec: `_specs/route-protection.md`

---

## Files to Modify

### `app/(public)/layout.tsx`
- Add `"use client"` directive (required for hooks)
- Import `useUser` from `@/hooks/useUser`, `useEffect` from react, `useRouter` from `next/navigation`
- While `loading === true`, render a minimal centered loader (use existing `.center-content` global class)
- In a `useEffect` watching `[user, loading]`: once `loading` is false and `user` is set, call `router.push('/heists')`
- When `loading` is false and no user, render children normally

### `app/(dashboard)/layout.tsx`
- Add `"use client"` directive (required for hooks)
- Import `useUser` from `@/hooks/useUser`, `useEffect` from react, `useRouter` from `next/navigation`
- While `loading === true`, render the same minimal centered loader
- In a `useEffect` watching `[user, loading]`: once `loading` is false and `user` is null, call `router.push('/login')`
- When `loading` is false and user exists, render children (with `<Navbar />`) normally

---

## Files to Create

### `tests/app/(public)/layout.test.tsx`
- Mocks: `@/hooks/useUser`, `next/navigation` (`useRouter` → `{ push: mockPush }`)
- When `loading === true`: loader element is rendered, `push` is NOT called
- When `loading === false` and `user` is set: `push` called with `'/heists'`
- When `loading === false` and `user` is null: children rendered, `push` NOT called

### `tests/app/(dashboard)/layout.test.tsx`
- Mocks: `@/hooks/useUser`, `next/navigation`, `@/components/Navbar` (stub)
- When `loading === true`: loader element is rendered, `push` is NOT called
- When `loading === false` and `user` is null: `push` called with `'/login'`
- When `loading === false` and `user` is set: children rendered, `push` NOT called

---

## Key Decisions
- **`useEffect` for redirects** — avoids render-time side effects; dependency array `[user, loading]` ensures reactivity on logout/login
- **Loader shown during `loading`** — prevents both a flash of protected content and a premature redirect before Firebase resolves
- **Same loader markup in both layouts** — reuse `.center-content` global class with a plain `<p>Loading…</p>`, no new component needed
- **`router.push` not `redirect`** — we're in a client component with conditional state logic; `redirect()` is for server components

---

## Verification
1. Run `npm test` — all existing + new tests pass
2. Run `npm run dev`, visit `/login` while logged in → redirects to `/heists`
3. Visit `/heists` while logged out → redirects to `/login`
4. Refresh any page — loader briefly visible, then correct page or redirect
5. Run `npm run build` — no TypeScript errors
