# Plan: Authentication Forms (Login & Signup)

## Context
The `/login` and `/signup` pages currently have stub components with just a heading. We need to add functional authentication forms that capture email and password, support a show/hide password toggle, do light client-side validation, and log submitted values to the console. A single reusable `AuthForm` component will serve both pages, accepting a `mode` prop to vary its labels and routing link.

---

## Files to Create

### 1. `components/AuthForm/AuthForm.tsx`
- Client component (`"use client"`)
- Props: `mode: "login" | "signup"`
- Local state: `email`, `password`, `showPassword` (boolean)
- Uses `Eye` / `EyeOff` icons from `lucide-react` for the toggle button
- Light validation on submit: both fields must be non-empty; show inline error text if not
- On valid submit: `console.log({ email, password })`, then clear the form
- Renders a link to switch modes:
  - login mode → "Don't have an account? Sign up" → `/signup`
  - signup mode → "Already have an account? Log in" → `/login`
- Submit button label: "Log In" (login) / "Sign Up" (signup)

### 2. `components/AuthForm/AuthForm.module.css`
- Uses `@reference "../../app/globals.css"`
- Styles: `.form`, `.field`, `.label`, `.input`, `.passwordWrapper`, `.toggleBtn`, `.error`, `.submitBtn`, `.switchLink`
- `.submitBtn` reuses the global `.btn` via `@apply btn`

### 3. `components/AuthForm/index.ts`
```
export { default } from './AuthForm'
```

---

## Files to Modify

### 4. `app/(public)/login/page.tsx`
Replace stub with:
```tsx
import AuthForm from '@/components/AuthForm'
export default function LoginPage() {
  return <AuthForm mode="login" />
}
```

### 5. `app/(public)/signup/page.tsx`
Replace stub with:
```tsx
import AuthForm from '@/components/AuthForm'
export default function SignupPage() {
  return <AuthForm mode="signup" />
}
```

---

## Files to Create (Tests)

### 6. `tests/components/AuthForm.test.tsx`
Test cases (using React Testing Library + Vitest globals):
- Renders email field, password field, and "Log In" button in login mode
- Renders email field, password field, and "Sign Up" button in signup mode
- Password field defaults to `type="password"`
- Clicking the toggle icon switches password to `type="text"`, clicking again reverts
- Submitting with empty fields does NOT call `console.log` and shows validation error
- Submitting the login form with valid data calls `console.log` with `{ email, password }`
- Submitting the signup form with valid data calls `console.log` with `{ email, password }`
- Login page contains a link to `/signup`
- Signup page contains a link to `/login`

---

## Verification
1. `npm run dev` → visit `/login` and `/signup`, confirm forms render
2. Toggle the password visibility icon on both pages
3. Submit with empty fields → confirm error message appears, no console output
4. Submit with valid data → confirm `{ email, password }` logged in browser console
5. Click the switch link on each page to confirm navigation between forms
6. `npx vitest tests/components/AuthForm.test.tsx` → all tests pass
7. `npm run lint` → no lint errors
