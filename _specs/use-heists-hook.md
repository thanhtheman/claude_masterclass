# Spec for use-heists-hook

branch: claude/feature/use-heists-hook

## Summary

A `useHeists` hook that subscribes to real-time Firestore data from the `heists` collection and returns a filtered array of `Heist` objects. The hook accepts a single `mode` argument that determines the query: heists actively assigned to the current user, heists the current user has assigned to others, or all expired heists with a resolved final status. The heists dashboard page will consume the hook three times to display each result set's titles.

## Functional Requirements

- The hook is named `useHeists` and lives in `hooks/useHeists.ts`
- It accepts a single `mode` argument of type `'active' | 'assigned' | 'expired'`
- It returns an array of `Heist` objects (from `types/firestore`)
- It uses Firestore's `onSnapshot` for real-time updates (not a one-time fetch)
- The hook unsubscribes from the listener when the component unmounts
- Query behaviour by mode:
  - `'active'`: heists where `assignedTo === currentUser.uid` AND `deadline > now`
  - `'assigned'`: heists where `createdBy === currentUser.uid` AND `deadline > now`
  - `'expired'`: heists where `deadline <= now` AND `finalStatus !== null`
- Uses `heistConverter` so returned docs are typed as `Heist`
- Uses `useUser()` to get the current user's uid
- `app/(dashboard)/heists/page.tsx` calls `useHeists` three times (once per mode) and renders only the titles of each result set under their existing section headings

## Possible Edge Cases

- Current user is null or still loading — hook should return an empty array and not attempt a query
- A result set is empty — page should render the section heading with no items beneath it
- `onSnapshot` errors — should be handled gracefully (log or silently return empty array)
- Deadline comparison uses a `Date` — Firestore queries must compare against a Firestore `Timestamp` or JS `Date` consistently

## Acceptance Criteria

- `useHeists('active')` returns only heists assigned to the current user with a future deadline
- `useHeists('assigned')` returns only heists created by the current user with a future deadline
- `useHeists('expired')` returns heists with a past deadline and a non-null `finalStatus`, regardless of user
- Updates appear in real time when Firestore data changes
- The hook cleans up its `onSnapshot` listener on unmount
- The heists page displays titles under the correct section for each mode
- An empty result set renders its section heading with no list items

## Open Questions

- None

## Testing Guidelines

Create a test file at `tests/hooks/useHeists.test.tsx`. Focus on the following cases without going too heavy:

- Returns an empty array when the user is null
- Calls `onSnapshot` with the correct Firestore query for `'active'` mode
- Calls `onSnapshot` with the correct Firestore query for `'assigned'` mode
- Calls `onSnapshot` with the correct Firestore query for `'expired'` mode
- Returns the mapped heist objects when the snapshot resolves
- Unsubscribes from `onSnapshot` on unmount
