# Plan: Signup Firebase Auth Integration

## Context
The `AuthForm` component currently only logs credentials to console on submit. This plan wires the signup flow to Firebase Authentication, generates a random PascalCase codename for each new user, sets it as their Firebase `displayName`, and creates a Firestore document in the `users` collection storing only `id` and `codename`. On success, the user is redirected to `/heists`.

Spec: `_specs/signup-firebase-auth.md`

---

## Architecture Decision
Firebase logic lives in the **signup page** (not the `AuthForm` component) to keep the form generic and reusable. `AuthForm` gets an optional `onSubmit` prop — when absent, existing `console.log` behaviour is preserved, keeping all current tests passing.

---

## Files to Create

### `lib/codename.ts`
- Define three separate word arrays: adjectives, nouns, roles — each with unique words, stored lowercase
- Export `generateCodename()` that picks one word at random from each array and capitalises the first letter of each, returning them concatenated (e.g. `SwiftSilentAgent`)

### `tests/lib/codename.test.ts`
- `generateCodename()` returns a non-empty string
- Result matches PascalCase pattern (each segment starts with uppercase)
- Calling it 20 times produces at least 2 distinct values (randomness check)
- Each segment of the result belongs to its respective word set

### `tests/app/signup.test.tsx`
- Mocks: `@/lib/firebase` (`auth: {}`, `db: {}`), `firebase/auth` (`createUserWithEmailAndPassword`, `updateProfile`), `firebase/firestore` (`doc`, `setDoc`), `next/navigation` (`useRouter`), `@/lib/codename` (`generateCodename`)
- On valid submit: `createUserWithEmailAndPassword` called with correct email + password
- On valid submit: `updateProfile` called with the mocked codename
- On valid submit: `setDoc` called with `{ id, codename }` and no `email` field
- On valid submit: `router.push("/heists")` called
- On `auth/email-already-in-use`: friendly error shown in the form
- On `auth/weak-password`: friendly error shown in the form

---

## Files to Modify

### `components/AuthForm/AuthForm.tsx`
- Add optional prop: `onSubmit?: (email: string, password: string) => Promise<void>`
- Make `handleSubmit` async
- After validation passes: if `onSubmit` is provided, `await onSubmit(email, password)` inside a `try/catch` that calls `setError(err.message)`; if not provided, keep existing `console.log` path
- Clear fields only on success (move `setEmail("")` / `setPassword("")` inside the success path)

### `app/(public)/signup/page.tsx`
- Add `"use client"` directive
- Import `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`
- Import `doc`, `setDoc` from `firebase/firestore`
- Import `auth`, `db` from `@/lib/firebase`
- Import `generateCodename` from `@/lib/codename`
- Import `useRouter` from `next/navigation`
- Define `handleSignup(email, password)`:
  1. `generateCodename()` → `codename`
  2. `createUserWithEmailAndPassword(auth, email, password)` → `{ user }`
  3. `updateProfile(user, { displayName: codename })`
  4. `setDoc(doc(db, "users", user.uid), { id: user.uid, codename })`
  5. `router.push("/heists")`
  - Wrap in try/catch; map Firebase error codes to friendly messages and re-throw as plain `Error`:
    - `auth/email-already-in-use` → `"An account with this email already exists."`
    - `auth/weak-password` → `"Password must be at least 6 characters."`
    - default → `"Something went wrong. Please try again."`
- Pass `handleSignup` as `onSubmit` prop to `<AuthForm mode="signup" />`

---

## Key Decisions
- **`onSubmit` prop pattern** — keeps `AuthForm` generic; existing tests pass unchanged since they don't provide `onSubmit`
- **Firebase logic in the page, not the component** — form stays reusable for login without Firebase coupling
- **Error mapping in `handleSignup`** — friendly messages are re-thrown as plain `Error`, `AuthForm` uses `err.message` to set the error state, avoiding Firebase-specific code in the UI component
- **`setDoc` with explicit `user.uid` as document ID** — makes user lookups O(1) by uid later
- **Email never stored** — only `id` and `codename` written to Firestore

---

## Verification
1. Run `npm test` — all existing + new tests pass
2. Run `npm run dev`, go to `/signup`, submit with a new email → redirected to `/heists`
3. Check Firebase Console → Auth: new user exists with `displayName` set
4. Check Firebase Console → Firestore → `users` collection: document with `id` + `codename`, no `email`
5. Try signing up with the same email again → friendly error shown in form
6. Try signing up with a short password → friendly error shown in form
7. Run `npm run build` — no TypeScript errors
