# Spec for navbar-logout-button

branch: claude/feature/navbar-logout-button
figma_component: LogoutButton — https://www.figma.com/design/m5lrfTScRCfrSWTGO8lYxz/Claude-Code-Tutorial?node-id=3003-23&m=dev

## Summary
Add a logout button to the Navbar that is only visible when a user is logged in. Clicking it signs the user out via Firebase Auth. No redirect is needed after logout — the auth state listener (`useUser`) will handle UI updates reactively.

## Figma Design Reference
- Figma link: https://www.figma.com/design/m5lrfTScRCfrSWTGO8lYxz/Claude-Code-Tutorial?node-id=3003-23&m=dev
- Outlined ghost button — transparent background, 1px solid white border, border-radius 10px
- Dimensions: ~127px wide × 38px tall
- Text: "Logout", white, Inter Regular 16px, centred, letter-spacing -0.3px
- No icon — text only

## Functional Requirements
- The Navbar must use the `useUser` hook to read the current auth state
- The logout button is rendered only when `user` is not null (i.e. a user is logged in)
- Clicking the button calls `signOut(auth)` from `firebase/auth`
- No redirect occurs after logout — the reactive auth listener updates the UI automatically
- The button must match the Figma design: outlined ghost style with white border and white text on transparent background
- The Navbar currently uses a CSS Module — the button styles must follow the same pattern (no direct Tailwind classes if more than one utility is needed; use `@apply` in the CSS Module instead)

## Possible Edge Cases
- `signOut` may fail due to a network error — the error can be silently ignored or logged; no user-visible error message is required
- The `loading` state from `useUser` should be respected — do not show or hide the button until `loading` is false, to avoid a flash

## Acceptance Criteria
- Logout button is not visible when no user is logged in
- Logout button is visible when a user is logged in
- Clicking the button signs the user out (Firebase `signOut` is called)
- The button matches the Figma design: transparent background, white 1px border, rounded-[10px], white text
- No redirect happens after logout
- All existing Navbar tests continue to pass

## Open Questions
- None — all questions resolved in spec.

## Testing Guidelines
Create a test file in `./tests/components/` for the updated Navbar:
- Logout button is not rendered when `useUser` returns `{ user: null, loading: false }`
- Logout button is rendered when `useUser` returns a signed-in user
- Clicking the logout button calls `signOut`
- Logout button is not rendered while `loading` is true
