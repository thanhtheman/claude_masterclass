# Spec for signup-firebase-auth

branch: claude/feature/signup-firebase-auth
figma_component (if used): N/A

## Summary
Hook the existing signup form (`app/(public)/signup`) to Firebase Authentication using `createUserWithEmailAndPassword` from the Firebase web SDK. On successful signup, generate a random codename in PascalCase by combining one word from each of three distinct word sets, set it as the user's Firebase `displayName`, and create a document in the `users` Firestore collection storing only the user's `id` and `codename` (never their email).

## Functional Requirements
- On signup form submission, call `createUserWithEmailAndPassword(auth, email, password)` using the `auth` export from `lib/firebase.ts`
- Generate a random codename by selecting one word at random from each of three separate word sets (e.g. adjective + noun + role), joined together in PascalCase (e.g. `SwiftSilentAgent`)
- After account creation, call `updateProfile(user, { displayName: codename })` to set the generated codename as the user's Firebase display name
- Create a document in the `users` Firestore collection using the `db` export from `lib/firebase.ts`, containing only: `id` (Firebase `uid`) and `codename` (the generated display name) — email must NOT be stored
- If any step fails, show a user-friendly error message in the form
- The word sets must each contain unique words and be defined in a separate utility file (not inline in the component)
- Only the Firebase web SDK (`firebase/auth`, `firebase/firestore`) may be used — no third-party libraries

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- Email already in use — Firebase returns `auth/email-already-in-use`, should display a friendly message
- Weak password — Firebase returns `auth/weak-password`, should display a friendly message
- Network failure during any of the three steps (signup, updateProfile, Firestore write) — each should be handled gracefully
- Codename collision in Firestore is acceptable for now (word sets are large enough to make it unlikely)
- The `AuthForm` component currently only calls `console.log` on submit — the Firebase logic should replace that behaviour without breaking the component's existing UI or test coverage

## Acceptance Criteria
- Submitting the signup form with valid credentials creates a new Firebase Auth user
- The new user's `displayName` is set to a randomly generated PascalCase codename
- A document exists in the `users` collection with the correct `id` and `codename`, and no `email` field
- Submitting with an already-registered email shows a friendly error in the form
- Submitting with a password that is too short shows a friendly error in the form
- The codename generator utility is independently testable and always returns a non-empty PascalCase string
- All existing tests continue to pass

## Open Questions
- Should a successful signup immediately redirect the user to the dashboard (`/heists`), or land on a confirmation screen? dashboard heist
- Should the generated codename be shown to the user after signup so they know their identity? no.

## Testing Guidelines
Create test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases:
- Codename generator always returns a non-empty string in PascalCase
- Codename generator returns different values across multiple calls (not always the same)
- Each word in the generated codename comes from the correct word set
- Signup form calls `createUserWithEmailAndPassword` with the correct email and password on valid submit
- On success, `updateProfile` is called with the generated codename
- On success, a Firestore document is written with `id` and `codename` but no `email`
- On `auth/email-already-in-use` error, an appropriate error message is shown
