# Spec for auth-forms

branch: claude/feature/auth-forms
figma_component (if used): N/A

## Summary
Add authentication forms to the `/login` and `/signup` pages. Each page renders a form with email and password fields, a toggle to show/hide the password, and a submit button. On submission, form data is logged to the console (no real auth yet). Users can navigate between the two forms via a link.

## Functional Requirements
- `/login` page renders a login form with:
  - Email input field
  - Password input field with a show/hide toggle icon
  - A "Login" submit button
  - A link to switch to the `/signup` page
- `/signup` page renders a signup form with:
  - Email input field
  - Password input field with a show/hide toggle icon
  - A "Sign Up" submit button
  - A link to switch to the `/login` page
- Clicking the password toggle icon switches the input between `type="password"` and `type="text"`
- On form submission, `console.log` the submitted email and password values
- Form submission must prevent the default browser navigation behavior

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- User submits the form with empty fields — log whatever is in the fields (no validation required at this stage)
- User toggles the password visibility multiple times before submitting
- User navigates between login and signup and back — each form should be independent

## Acceptance Criteria
- Visiting `/login` shows a form with email, password, show/hide toggle, and a "Login" button
- Visiting `/signup` shows a form with email, password, show/hide toggle, and a "Sign Up" button
- Clicking the show/hide icon on either form toggles password visibility
- Submitting either form logs `{ email, password }` to the console
- Each form contains a visible link to the other form (login ↔ signup)
- No page reload occurs on submission

## Open Questions
- Should both pages share a single reusable `AuthForm` component, or remain separate? single.
- Is there a preferred icon library for the show/hide toggle (project already uses `lucide-react`)? lucide-react.
- Will there be any client-side validation added before real auth is wired up? light validation.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Renders the login form with email field, password field, and submit button
- Renders the signup form with email field, password field, and submit button
- Password field starts as hidden (`type="password"`) and toggles to visible on icon click
- Submitting the login form calls `console.log` with the entered email and password
- Submitting the signup form calls `console.log` with the entered email and password
- Each form contains a link to the other form
