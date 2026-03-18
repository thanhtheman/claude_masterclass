# Spec for login-firebase-auth

branch: claude/feature/login-firebase-auth
figma_component (if used): N/A

## Summary
Wire the existing login form (`app/(public)/login`) to Firebase Authentication using `signInWithEmailAndPassword`. On successful login, show a success message in the form. No redirect is needed — the `useUser` auth state listener will reactively update the rest of the app.

## Functional Requirements
- On login form submission with valid credentials, call `signInWithEmailAndPassword(auth, email, password)` using the `auth` export from `lib/firebase.ts`
- On success, display a success message in the form (e.g. "You are now logged in.")
- On failure, display a user-friendly error message in the form
- No redirect should occur after login
- Only the Firebase web SDK (`firebase/auth`) may be used — no third-party libraries
- The login logic should live in the login page, not in the `AuthForm` component, following the same pattern as the signup page

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- Wrong password — Firebase returns `auth/invalid-credential`, should show a friendly message
- User not found — Firebase returns `auth/user-not-found` or `auth/invalid-credential`, should show a friendly message
- Too many failed attempts — Firebase returns `auth/too-many-requests`, should show a friendly message
- Network failure — should show a generic fallback error message

## Acceptance Criteria
- Submitting correct credentials logs the user in and shows a success message
- Submitting incorrect credentials shows a friendly error message in the form
- No redirect occurs after successful login
- The `AuthForm` component and its existing tests are not broken
- All existing tests continue to pass

## Open Questions
- None.

## Testing Guidelines
Create a test file in `./tests/app/` for the login page:
- Calls `signInWithEmailAndPassword` with the correct email and password on valid submit
- Shows a success message after successful login
- Shows a friendly error for invalid credentials (`auth/invalid-credential`)
- Shows a friendly error for too many attempts (`auth/too-many-requests`)
