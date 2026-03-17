# Spec for auth-state-management

branch: claude/feature/auth-state-management
figma_component (if used): N/A

## Summary
Implement a global Firebase auth state listener that exposes the current user via a `useUser` hook. Any component or page in the app can call `useUser()` to get the current authenticated user (or `null` if logged out), without prop drilling or manual listener setup.

## Functional Requirements
- Create an `AuthProvider` context that subscribes to Firebase's `onAuthStateChanged` listener when mounted and unsubscribes on unmount
- The provider should hold the current user value (`User | null`) and a loading boolean in state
- Expose the context value via a `useUser` hook that returns `{ user, loading }`
- The `AuthProvider` must wrap the entire application so all pages and components can access it
- The hook should return `loading: true` until the first auth state response is received from Firebase, then `loading: false` thereafter
- No sign-up, login, or logout logic should be included in this spec

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases:
- `onAuthStateChanged` fires asynchronously — components must handle the `loading` state to avoid flash of unauthenticated content
- Hook called outside of `AuthProvider` should throw a clear error rather than silently returning undefined
- Firebase SDK must be initialised before the provider mounts — ensure `lib/firebase.ts` is imported correctly

## Acceptance Criteria
- `useUser()` returns `{ user: null, loading: false }` when no user is signed in
- `useUser()` returns `{ user: <FirebaseUser>, loading: false }` when a user is signed in
- `useUser()` returns `{ user: null, loading: true }` before the initial auth state is resolved
- Calling `useUser()` outside of `AuthProvider` throws a descriptive error
- The `AuthProvider` is mounted at the app root so every page and component can access it
- No existing functionality is broken

## Open Questions:
- Should the `AuthProvider` redirect unauthenticated users away from protected routes, or is that left to a separate guard implementation? just direct users to homepage.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `useUser` returns `{ user: null, loading: true }` before auth state resolves
- `useUser` returns `{ user: null, loading: false }` after auth state resolves with no user
- `useUser` returns the user object after auth state resolves with a signed-in user
- Calling `useUser` outside `AuthProvider` throws an error
