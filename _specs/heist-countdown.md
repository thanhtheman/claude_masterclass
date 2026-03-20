# Spec for Heist Countdown

branch: claude/feature/heist-countdown
figma_component: HeistCard time-remaining row — node-id=14-197

## Summary

Add a live countdown display to the `HeistCard` component showing how much time is left to complete a heist. The countdown is an inline row inside the card (not a standalone component) that displays the due date alongside a compact time-remaining string. The time remaining updates in real time and shows an "Overdue" state for past-deadline heists.

## Functional Requirements

- Replace the static deadline date in `HeistCard` with a live countdown row
- Display the formatted due date (e.g. `Dec 8, 10:00 AM •`) followed by the time remaining
- Time remaining format:
  - Multi-day: `Xd Yh` (e.g. `2d 4h`)
  - Same-day: `Xh Ym` (e.g. `4h 42m`)
  - Past deadline: `Overdue`
- The countdown must update every minute (or every second if feasible) without requiring a page reload
- The time remaining text is purple (`--color-primary`) for upcoming heists and muted grey (`--color-body`) for overdue
- The row uses a calendar icon (12px) on the left, matching the existing `By:` and `To:` metadata rows in style

## Figma Design Reference

- File: Claude-Code-Tutorial
- Component: HeistCard time-remaining row
- Figma link: https://www.figma.com/design/m5lrfTScRCfrSWTGO8lYxz/Claude-Code-Tutorial?node-id=14-197&m=dev
- Key visual constraints:
  - Single horizontal flex row: `gap: 8px`, `height: 20px`, `align-items: center`
  - Calendar icon: 12×12px SVG in muted grey (`#99a1af`)
  - Due date label: Inter Regular 14px, `#99a1af` (muted grey), includes bullet separator `•`
  - Time remaining: Inter Regular 14px, `#c27aff` (purple) for active, `#99a1af` (grey) for overdue
  - No separate digit blocks — compact inline text only

## Possible Edge Cases

- Heist deadline has already passed — show "Overdue" in muted grey
- Heist is due in less than 1 hour — show minutes only (e.g. `42m`)
- Heist is due in less than 1 minute — show `< 1m` or `Overdue`
- Component unmounts before the interval fires — interval must be cleared to prevent memory leaks
- `deadline` value is null or invalid — handle gracefully without crashing

## Acceptance Criteria

- `HeistCard` date row shows the formatted deadline and live time-remaining string
- Time-remaining text is purple for upcoming heists and grey for overdue
- The countdown updates automatically (at least every minute)
- "Overdue" is shown when the deadline has passed
- Interval is properly cleaned up on component unmount
- The visual style matches the existing metadata rows (icon + label pattern)

## Open Questions

- Should the countdown also appear on the Heist Details page (`/heists/[id]`), or only on the card?
- Should the time remaining turn red (`--color-error`) when under a certain threshold (e.g. < 1 hour)?

## Testing Guidelines

Create a test file in `tests/components/HeistCard.test.tsx` (or a dedicated `tests/lib/countdown.test.ts` if a utility function is extracted) covering:

- Formats multi-day remaining correctly (`2d 4h`)
- Formats same-day remaining correctly (`4h 42m`)
- Shows `Overdue` when deadline is in the past
- Countdown interval is cleared on unmount (no memory leak)
- Handles an invalid or null deadline without throwing
