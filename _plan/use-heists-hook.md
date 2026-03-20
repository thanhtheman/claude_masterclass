# Plan: useHeists Hook

## Context

The heists dashboard page (`app/(dashboard)/heists/page.tsx`) is a shell with three empty sections. This plan adds a `useHeists` hook that subscribes to real-time Firestore data and returns filtered `Heist` arrays based on a `mode` argument, then wires it into the page to render titles under each section.

---

## Files to create

### `hooks/useHeists.ts`
Client hook (`'use client'`). Responsibilities:
- Accepts `mode: 'active' | 'assigned' | 'expired'`
- Returns `Heist[]` (state, initialised to `[]`)
- Uses `useUser()` to get the current user; if `user` is null, returns `[]` immediately without subscribing
- In a `useEffect` (re-runs when `user` or `mode` changes), builds a Firestore `query` and subscribes with `onSnapshot`:
  - `'active'`: `where('assignedTo', '==', user.uid)` + `where('deadline', '>', new Date())`
  - `'assigned'`: `where('createdBy', '==', user.uid)` + `where('deadline', '>', new Date())`
  - `'expired'`: `where('deadline', '<=', new Date())` + `where('finalStatus', '!=', null)`
- Applies `heistConverter` on the collection ref so snapshot docs are typed as `Heist`
- Maps snapshot docs via `doc.data()` into state
- Returns the `onSnapshot` unsubscribe function from `useEffect` for cleanup
- On `onSnapshot` error: silently set state to `[]` (no crash)

---

## Files to modify

### `app/(dashboard)/heists/page.tsx`
- Add `'use client'` directive (hooks required)
- Call `useHeists` three times: `active`, `assigned`, `expired`
- Under each existing section heading, render a `<ul>` with `<li>` items showing `heist.title` for each result
- Empty result sets render just the heading with no list

---

## Files to modify (summary)

| File | Change |
|---|---|
| `hooks/useHeists.ts` | Create — real-time Firestore hook with mode-based queries |
| `app/(dashboard)/heists/page.tsx` | Update — add `'use client'`, call hook 3×, render titles |

---

## Key utilities to reuse

- `useUser()` → `hooks/useUser.ts` — get current Firebase Auth user
- `heistConverter` → `types/firestore/heist.ts` — typed snapshot conversion
- `COLLECTIONS.HEISTS` → `types/firestore/index.ts` — collection name
- `Heist` type → `types/firestore/heist.ts`
- `db` → `lib/firebase.ts` — Firestore instance
- Firebase: `collection`, `query`, `where`, `onSnapshot` from `firebase/firestore`

---

## Test file

**`tests/hooks/useHeists.test.tsx`**

Mock strategy (inline `vi.mock()` — project convention):
- `@/lib/firebase` → `{ db: {} }`
- `@/hooks/useUser` → `{ useUser: () => ({ user: { uid: 'user-1' } }) }`
- `firebase/firestore` → mock `collection`, `query`, `where`, `onSnapshot`

`onSnapshot` mock pattern (mirrors `onAuthStateChanged` in existing tests):
- Accept a query arg and a callback; immediately call callback with a mock snapshot
- Return a `vi.fn()` as the unsubscribe function

Test cases:
1. Returns `[]` when `user` is null
2. Calls `onSnapshot` with a query containing the correct `where` clauses for `'active'` mode
3. Calls `onSnapshot` with the correct query for `'assigned'` mode
4. Calls `onSnapshot` with the correct query for `'expired'` mode
5. Returns mapped heist objects when snapshot resolves
6. Calls the unsubscribe function returned by `onSnapshot` on unmount

---

## Verification

1. Run `npm run dev`, log in, visit `/heists` — three sections render (empty until Firestore has data)
2. Create a heist via `/heists/create` assigned to another user — it appears under "Heists You've Assigned" in real time
3. Log in as the assignee — the heist appears under "Your Active Heists"
4. Run `npx vitest tests/hooks/useHeists.test.tsx` — all tests pass
