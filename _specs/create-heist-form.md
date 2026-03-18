# Spec for create-heist-form

branch: claude/feature/create-heist-form

## Summary

A form on the Create Heist page that allows an authenticated user to fill in heist details, select another registered user to assign the heist to, and submit the form to create a new document in the Firestore `heists` collection. On successful submission, the user is redirected to the Heists dashboard page.

## Functional Requirements

- The form renders on `app/(dashboard)/heists/create/page.tsx`
- Fields match the `CreateHeistInput` interface: `title`, `description`, `createdBy`, `createdByCodename`, `assignedTo`, `assignedToCodename`
- `createdAt` is set programmatically using `serverTimestamp()` — not a user-facing field
- `deadline` is set programmatically to 48 hours from the time of creation — not a user-facing field
- `finalStatus` is always initialised to `null` on creation
- The `assignedTo` field is a dropdown/select populated by fetching all users from the Firestore `users` collection, displaying their codename
- On selection of a user, both `assignedTo` (uid) and `assignedToCodename` are captured
- `createdBy` and `createdByCodename` are populated from the currently authenticated user — not editable
- On form submission, a new document is written to the `heists` Firestore collection using `addDoc` with the `heistConverter`
- On successful write, the user is redirected to `/heists`
- The form should show a loading/disabled state while submitting
- On write failure, an error message is shown to the user

## Possible Edge Cases

- The users collection is empty or returns no results (no one to assign to)
- The currently authenticated user is the only registered user (self-assignment scenario)
- Firestore write fails due to network or permissions error
- User navigates away mid-form (no special handling required)
- User submits the form with missing required fields (rely on HTML5 validation)

## Acceptance Criteria

- Submitting valid form data creates a document in the `heists` Firestore collection
- The created document contains all fields from `CreateHeistInput` including programmatically set `createdAt`, `deadline`, and `finalStatus: null`
- After successful submission, the user lands on `/heists`
- The assignee dropdown lists all users fetched from Firestore with their codenames
- The form is non-interactive while the submission is in progress
- A visible error message appears if the Firestore write fails

## Open Questions

- Should a user be able to assign a heist to themselves, or should the current user be excluded from the assignee dropdown? The current user should be excluded.
- Should the assignee list be fetched once on mount, or refreshed on each render? on mount
- Is there a maximum length for `title` or `description` fields? no.

## Testing Guidelines

Create a test file in `tests/` mirroring the source structure. Focus on the following cases without going too heavy:

- Renders all expected form fields
- Assignee dropdown is populated from a mocked Firestore users response
- Submitting the form calls `addDoc` with the correct shape (including `finalStatus: null` and presence of `createdAt`/`deadline`)
- Redirects to `/heists` after a successful submission
- Displays an error message when the Firestore write rejects
- Submit button is disabled while submission is in progress
