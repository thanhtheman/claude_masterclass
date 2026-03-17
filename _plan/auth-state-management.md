# Plan: Auth State Management (`useUser` hook)

## Context
The app has Firebase Auth configured but no global state for the current user. Every component that needs the user has no way to access it. This plan introduces an `AuthProvider` context that listens to Firebase's `onAuthStateChanged` in real-time and exposes the current user through a `useUser()` hook callable from any page or component.

Spec: `_specs/auth-state-management.md`

---

## Files to Create

### `contexts/AuthContext.tsx`
- `"use client"` component
- Imports `onAuthStateChanged`, `User` from `firebase/auth` and `auth` from `@/lib/firebase`
- Creates `AuthContext` with `createContext(null)` — `null` sentinel lets the hook detect out-of-provider usage
- `AuthProvider` holds `user: User | null` (init `null`) and `loading: boolean` (init `true`) in state
- `useEffect` subscribes to `onAuthStateChanged(auth, callback)` — callback sets user + sets `loading: false`; returns unsubscribe for cleanup
- Renders `<AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>`

### `hooks/useUser.ts`
- `"use client"` — uses `useContext`
- Imports `AuthContext` from `@/contexts/AuthContext`
- Calls `useContext(AuthContext)` — throws descriptive `Error` if result is `null` (outside provider)
- Returns `{ user, loading }`

### `tests/contexts/AuthContext.test.tsx`
- Mocks `@/lib/firebase` (returns `{ auth: {} }`) and `firebase/auth` (mocks `onAuthStateChanged`)
- Tests: initial state is `loading: true, user: null`; after callback fires with user → `loading: false, user` set; after callback fires with `null` → `loading: false, user: null`; unsubscribe called on unmount

### `tests/hooks/useUser.test.tsx`
- Tests: throws when called outside `AuthProvider`; returns `{ user, loading }` when inside

---

## Files to Modify

### `app/layout.tsx`
- Import `AuthProvider` from `@/contexts/AuthContext`
- Wrap `{children}` with `<AuthProvider>` inside `<body>`

---

## Key Decisions
- **`null` initial context value** — lets `useUser` throw on misuse rather than silently returning stale defaults
- **`loading: true` initially** — prevents premature redirect before Firebase resolves auth state on page refresh

---

## Verification
1. Run `npm test` — all new and existing tests pass
2. Run `npm run build` — no TypeScript errors
