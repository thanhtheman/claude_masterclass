# Plan: Create Heist Form

## Context

The `/heists/create` page is a bare placeholder. This plan implements the full form that lets an authenticated user author a heist, assign it to a colleague, and write it to Firestore. On success the user is redirected to `/heists`. `createdAt` and `deadline` are set programmatically; all other fields come from the form or the current user session.

---

## Files to create

### `types/firestore/user.ts`
New interface matching documents in the Firestore `users` collection:
`{ id: string, codename: string }`
Export a `userConverter` following the same pattern as `heistConverter`.

### `types/firestore/index.ts` (modify)
- Export `* from './user'`
- Add `USERS: 'users'` to `COLLECTIONS`

### `components/CreateHeistForm/CreateHeistForm.tsx`
Client component (`"use client"`). Responsibilities:
- On mount: call `getDocs` on the `users` collection, filter out the current user's uid, store as `assignableUsers` state
- Form state: `title` (string), `description` (string), `assignedTo` (selected User object), `submitting` (bool), `error` (string)
- On submit:
  - Build `CreateHeistInput`:
    - `title`, `description` from form
    - `createdBy`: `user.uid`
    - `createdByCodename`: `user.displayName` (set as codename during signup)
    - `assignedTo`: selected user's `id`
    - `assignedToCodename`: selected user's `codename`
    - `createdAt`: `serverTimestamp()`
    - `deadline`: `new Date(Date.now() + 48 * 60 * 60 * 1000)`
    - `finalStatus`: `null`
  - Call `addDoc(collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter), input)`
  - On success: `router.push('/heists')`
  - On failure: set `error` message, re-enable form
- Disable all inputs and submit button while `submitting === true`
- Render error message when `error` is set

Reuse patterns from `AuthForm.tsx`:
- `useUser()` for current user
- `useRouter()` for redirect
- CSS Module for styling

### `components/CreateHeistForm/CreateHeistForm.module.css`
Follow `AuthForm.module.css` conventions (`@reference "../../app/globals.css"`). Style: form, field, label, input, textarea, select, error, submitBtn.

### `components/CreateHeistForm/index.ts`
Barrel: `export { default } from './CreateHeistForm'`

### `app/(dashboard)/heists/create/page.tsx` (modify)
Import and render `<CreateHeistForm />`. Keep the `<div className="center-content">` wrapper.

---

## Files to modify (summary)

| File | Change |
|---|---|
| `types/firestore/user.ts` | Create — User interface + userConverter |
| `types/firestore/index.ts` | Add User export + USERS collection key |
| `components/CreateHeistForm/CreateHeistForm.tsx` | Create — form component |
| `components/CreateHeistForm/CreateHeistForm.module.css` | Create — CSS module |
| `components/CreateHeistForm/index.ts` | Create — barrel export |
| `app/(dashboard)/heists/create/page.tsx` | Update — render CreateHeistForm |

---

## Key utilities to reuse

- `useUser()` → `hooks/useUser.ts` — get current Firebase user
- `useRouter()` → `next/navigation` — redirect after submit
- `heistConverter` → `types/firestore/heist.ts` — used with `addDoc`
- `COLLECTIONS` → `types/firestore/index.ts` — collection name constants
- `db` → `lib/firebase.ts` — Firestore instance
- Firebase: `addDoc`, `getDocs`, `collection`, `serverTimestamp` from `firebase/firestore`

---

## Test file

**`tests/app/(dashboard)/heists/create/create-heist.test.tsx`**

Mock strategy (inline `vi.mock()` — project convention):
- `@/lib/firebase` → mock `db`
- `firebase/firestore` → mock `getDocs`, `addDoc`, `collection`, `serverTimestamp`
- `next/navigation` → mock `useRouter` returning `{ push: vi.fn() }`
- `@/hooks/useUser` → mock returning `{ user: { uid: 'user-1', displayName: 'SwiftFoxAgent' } }`

Test cases:
1. Renders title input, description textarea, and assignee select
2. Assignee dropdown is populated from mocked `getDocs` and excludes the current user
3. Submitting calls `addDoc` with correct `CreateHeistInput` shape (including `finalStatus: null`, `deadline`, `createdAt`)
4. Redirects to `/heists` after successful `addDoc`
5. Displays an error message when `addDoc` rejects
6. Submit button is disabled while submission is in progress

---

## Verification

1. Run `npm run dev` and visit `/heists/create` — form renders with title, description, assignee dropdown
2. Assignee dropdown excludes the logged-in user and shows other users' codenames
3. Submit a valid form — new doc appears in Firestore `heists` collection and browser redirects to `/heists`
4. Kill the network and submit — error message renders and form re-enables
5. Run `npx vitest tests/app/(dashboard)/heists/create/create-heist.test.tsx` — all tests pass
