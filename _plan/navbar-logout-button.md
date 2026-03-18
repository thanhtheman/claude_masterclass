# Plan: Navbar Logout Button

## Context
The Navbar currently has no auth awareness — it renders the same for all users. This plan adds a logout button that conditionally renders based on the auth state from `useUser`, and calls Firebase `signOut` on click. The button style matches the Figma design: ghost/outlined with a white border on a transparent background.

Spec: `_specs/navbar-logout-button.md`
Figma: https://www.figma.com/design/m5lrfTScRCfrSWTGO8lYxz/Claude-Code-Tutorial?node-id=3003-23&m=dev

---

## Critical Notes

**Navbar is currently a server component.** Adding `useUser` (which uses `useContext`) requires adding `"use client"` to `Navbar.tsx`.

**Existing Navbar tests render `<Navbar />` without a provider.** Once `useUser` is added, those tests will throw unless `@/hooks/useUser` is mocked. The existing tests must be updated to mock `useUser` returning `{ user: null, loading: false }` as the default, so their assertions continue to pass unchanged.

---

## Files to Modify

### `components/Navbar/Navbar.tsx`
- Add `"use client"` directive at the top
- Import `useUser` from `@/hooks/useUser`
- Import `signOut` from `firebase/auth`
- Import `auth` from `@/lib/firebase`
- Call `const { user, loading } = useUser()` inside the component
- When `!loading && user`: render a logout `<button>` with `className={styles.logoutBtn}` and an `onClick` that calls `signOut(auth)`
- The button sits alongside the existing "Create Heist" link inside `<ul>`

### `components/Navbar/Navbar.module.css`
- Add `.logoutBtn` class matching the Figma design:
  - Transparent background
  - 1px solid white border
  - `border-radius: 10px`
  - White text, `font-size: 16px`
  - `width: 127px`, `height: 38px`
  - Use `@apply` for Tailwind utilities; use raw CSS for values not in the theme

### `tests/components/Navbar.test.tsx`
- Add `vi.mock('@/hooks/useUser', ...)` at the top, returning `{ user: null, loading: false }` by default
- Add `vi.mock('@/lib/firebase', () => ({ auth: {} }))`
- Add `vi.mock('firebase/auth', () => ({ signOut: vi.fn() }))`
- Existing 2 tests require no changes — they pass with the default mock
- Add new tests:
  - Logout button is **not** rendered when `user` is null
  - Logout button is **not** rendered while `loading` is true
  - Logout button **is** rendered when user is signed in
  - Clicking the logout button calls `signOut`

---

## Key Decisions
- **`"use client"` on Navbar** — unavoidable since `useUser` uses `useContext`; Next.js handles the client boundary correctly when the server layout imports a client Navbar
- **Mock `useUser` in tests rather than wrap with `AuthProvider`** — simpler, faster tests; avoids pulling in Firebase internals
- **`signOut` error is swallowed silently** — per spec, no user-visible error is required on logout failure
- **Button not shown during `loading`** — prevents a flash of the logout button before auth state is known

---

## Verification
1. Run `npm test` — all existing + new tests pass
2. Run `npm run dev`, visit `/heists` while signed out → no logout button visible
3. Sign in → logout button appears in the Navbar
4. Click logout → user is signed out, button disappears
5. Run `npm run build` — no TypeScript errors
