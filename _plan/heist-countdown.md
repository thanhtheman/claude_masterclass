# Plan: Heist Countdown

## Context

The `HeistCard` component currently shows a static formatted deadline date (e.g. "Apr 1, 2026") with no indication of how much time remains. This plan adds a live countdown to the card's date row that shows the time remaining in a compact format (e.g. `2d 4h`, `4h 42m`, `Overdue`), updating automatically every minute. Scope is limited to `HeistCard` only — not the details page.

---

## Key Findings

- **`HeistCard`** (`components/HeistCard/HeistCard.tsx`): currently renders a static `deadline` string via `toLocaleDateString()` in a `.metaRow` with a `Calendar` icon. This row needs to show `{formattedDeadline} • {timeRemaining}`.
- **`HeistCard.module.css`**: `.deadline` class already applies `text-primary` (purple). Need a `.deadlineOverdue` variant using `text-body` (grey).
- **No existing date utilities** in `lib/` or `utils/` — a new `lib/countdown.ts` utility must be created.
- **`deadline` field** (`types/firestore/heist.ts`): already a JS `Date` object (converted from Firestore Timestamp by `heistConverter`).
- **Test file** (`tests/components/HeistCard.test.tsx`): no deadline tests yet — needs new cases for countdown display.

---

## Implementation Steps

### 1. Create `lib/countdown.ts`
Pure utility function: `getTimeRemaining(deadline: Date): string`
- Returns `Xd Yh` when ≥ 24 hours remain (e.g. `2d 4h`)
- Returns `Xh Ym` when < 24 hours but ≥ 1 minute remain (e.g. `4h 42m`)
- Returns `< 1m` when less than 1 minute remains
- Returns `Overdue` when deadline has passed

### 2. Update `components/HeistCard/HeistCard.tsx`
- Import `getTimeRemaining` from `@/lib/countdown`
- Add `useState<string>` for `timeRemaining`, initialised by calling `getTimeRemaining(heist.deadline)`
- Add `useEffect` that sets up a `setInterval` every 60 000ms to refresh `timeRemaining`; clears the interval on unmount
- Replace the static `{deadline}` span with two spans: the formatted date label (grey) and the time-remaining string — use `.deadlineOverdue` class when value is `'Overdue'`, `.deadline` otherwise

### 3. Update `components/HeistCard/HeistCard.module.css`
- Add `.deadlineLabel` class: 14px, `var(--color-body)` grey — for the date + bullet text
- Add `.deadlineOverdue` class: 14px, `var(--color-body)` grey — for "Overdue" state
- Rename existing `.deadline` to make its purple color apply only to the time-remaining span when active (can keep the name, just clarify usage)

### 4. Create `tests/lib/countdown.test.ts`
Test `getTimeRemaining` in isolation:
- Returns `Xd Yh` format for multi-day deadlines
- Returns `Xh Ym` format for same-day deadlines
- Returns `< 1m` when under 1 minute
- Returns `Overdue` when deadline is in the past

### 5. Update `tests/components/HeistCard.test.tsx`
- Mock `@/lib/countdown` so time-dependent tests are deterministic
- Test that the formatted deadline date is rendered
- Test that the time-remaining string from `getTimeRemaining` is rendered
- Test that `Overdue` applies the overdue style class
- Test that the interval is cleared on unmount (use `vi.useFakeTimers`)

---

## Files to Create
- `lib/countdown.ts`
- `tests/lib/countdown.test.ts`

## Files to Modify
- `components/HeistCard/HeistCard.tsx`
- `components/HeistCard/HeistCard.module.css`
- `tests/components/HeistCard.test.tsx`

---

## Verification
1. `npm test` — all tests pass including new countdown unit tests and updated card tests
2. `npm run dev` — HeistCard date row shows e.g. `Apr 1, 2026 • 2d 4h` in purple, or `Apr 1, 2026 • Overdue` in grey
3. Waiting ~1 minute in the browser confirms the countdown updates live without a page reload
