# Plan: Login Firebase Auth

## Context
The login form currently only logs to console. This plan wires it to Firebase `signInWithEmailAndPassword` and shows a success message on the form after login. No redirect needed — `useUser` reactively updates the rest of the app. Follows the same pattern established by the signup page.

Spec: `_specs/login-firebase-auth.md`

---

## Files to Modify

### `components/AuthForm/AuthForm.tsx`
- Add optional prop: `successMessage?: string`
- After `await onSubmit(email, password)` resolves without throwing, if `successMessage` is provided, set a new `success` state string to display it
- Add a `success` state (`useState("")`) alongside the existing `error` state
- Render the success message in the form (styled similarly to the error, but as a success indicator)
- Clear `success` state at the start of `handleSubmit` alongside `setError("")`

### `app/(public)/login/page.tsx`
- Add `"use client"` directive
- Import `signInWithEmailAndPassword` from `firebase/auth`
- Import `auth` from `@/lib/firebase`
- Define error message map:
  - `auth/invalid-credential` → `"Incorrect email or password."`
  - `auth/user-not-found` → `"Incorrect email or password."`
  - `auth/too-many-requests` → `"Too many failed attempts. Please try again later."`
  - default → `"Something went wrong. Please try again."`
- Define `handleLogin(email, password)`: calls `signInWithEmailAndPassword(auth, email, password)` in a try/catch; maps error codes to friendly messages and re-throws as plain `Error`
- Pass `onSubmit={handleLogin}` and `successMessage="You are now logged in."` to `<AuthForm mode="login" />`

---

## Files to Create

### `tests/app/login.test.tsx`
- Mocks: `@/lib/firebase` (`auth: {}`), `firebase/auth` (`signInWithEmailAndPassword`)
- On valid submit: `signInWithEmailAndPassword` called with correct email + password
- On success: success message "You are now logged in." appears in the form
- On `auth/invalid-credential`: friendly error shown
- On `auth/too-many-requests`: friendly error shown

---

## Key Decisions
- **`successMessage` prop on `AuthForm`** — keeps the form generic; the page decides the message; signup doesn't pass it (redirects instead), so no behaviour change there
- **Firebase logic stays in the page** — consistent with the signup pattern in `app/(public)/signup/page.tsx`
- **No redirect** — per spec; `useUser` handles reactive state updates across the app
- **Error mapping in `handleLogin`** — same pattern as `handleSignup`: map codes → re-throw as plain `Error`; `AuthForm` uses `err.message`

---

## Verification
1. Run `npm test` — all existing + new tests pass
2. Run `npm run dev`, go to `/login`, submit valid credentials → success message appears
3. Submit wrong credentials → friendly error shown
4. Run `npm run build` — no TypeScript errors
