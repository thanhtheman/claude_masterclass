# Spec for route-protection

branch: claude/feature/route-protection
figma_component (if used): N/A

## Summary
Add route protection to both route groups. The `(public)` group (login, signup, home) should redirect authenticated users to `/heists`. The `(dashboard)` group should redirect unauthenticated users to `/login`. A simple loading indicator should be shown in each group's layout while Firebase resolves the initial auth state, preventing a flash of the wrong page.

## Functional Requirements
- In the `(public)` layout: use `useUser` hook to check auth state; if `loading` is true, render a loader; if user is authenticated, redirect to `/heists`
- In the `(dashboard)` layout: use `useUser` hook to check auth state; if `loading` is true, render a loader; if user is not authenticated, redirect to `/login`
- The loader should be minimal — a centered spinner or simple text like "Loading…" is sufficient
- Redirects should use `next/navigation`'s `useRouter` (push) or `redirect`
- No redirect should occur while `loading` is still true — wait for Firebase to resolve auth state first
- The loader and redirect logic should live in the layout files, not in individual pages

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- User navigates directly to a dashboard URL while not logged in — should redirect to `/login`
- User navigates directly to `/login` or `/signup` while already logged in — should redirect to `/heists`
- Firebase takes a moment to resolve auth state on first load — loader prevents premature redirect or flash of protected content
- User logs out while on a dashboard page — `useUser` reactively updates, triggering redirect to `/login`
- User logs in on the login page — `useUser` reactively updates, triggering redirect to `/heists`

## Acceptance Criteria
- Visiting `/login` or `/signup` while authenticated redirects to `/heists`
- Visiting any `/heists` or dashboard page while unauthenticated redirects to `/login`
- A loader is visible in both layouts while `loading === true`
- No flash of protected content before the redirect fires
- Existing tests continue to pass

## Open Questions
- None.

## Testing Guidelines
Create test files in `./tests/` mirroring the layout file paths:
- `(public)` layout: when `useUser` returns a logged-in user, `useRouter().push` is called with `/heists`; when `loading` is true, the loader is rendered and no redirect fires
- `(dashboard)` layout: when `useUser` returns `null` user, `useRouter().push` is called with `/login`; when `loading` is true, the loader is rendered and no redirect fires
- Mock `useUser` and `next/navigation` in both test files
