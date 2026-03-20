# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component: HeistCard — node-id=14-137

## Summary

Build a `HeistCard` component to display heist details in a card layout, and a `HeistCardSkeleton` for the loading state. The heist cards are shown on the heists page in a 3-column grid for active and assigned heists only. The heist title links to the individual heist details page. Expired heists are not shown as cards.

## Functional Requirements

- Create a `HeistCard` component that displays a single heist's key details: title, target, assigned agent, and scheduled datetime/duration
- The heist title must be a link to `/heists/[id]` (the details page — no content needed there yet)
- Create a `HeistCardSkeleton` component with the same card dimensions for use during loading
- Render active and assigned heists in a 3-column grid layout on the heists page
- Expired heists should not be shown in a card grid — their section can be omitted or kept as a plain list
- Both `HeistCard` and `HeistCardSkeleton` should be displayed in the same grid layout

## Figma Design Reference

- File: Claude-Code-Tutorial
- Component name: HeistCard
- Figma link: https://www.figma.com/design/m5lrfTScRCfrSWTGO8lYxz/Claude-Code-Tutorial?node-id=14-137&m=dev
- Key visual constraints:
  - Card container: `background: #101828`, `border: 1px solid #1e2939`, `border-radius: 10px`, `padding: ~21px`
  - Title: Inter Regular, 16px, white (`#ffffff`), with a small clock icon top-right of the title row
  - Three metadata rows (Target, Agent, Date/Duration): 14px Inter, muted grey labels (`#99a1af`); target username in purple (`#c27aff`), agent username in pink (`#fb64b6`)
  - All row icons are 12px SVGs; the clock icon on the title row is ~16px
  - Skeleton fill colour: `#1e2939` (on-palette placeholder blocks)

## Possible Edge Cases

- Heist has no assigned agent yet — the agent row should handle a missing/null value gracefully
- Title is very long — should truncate or wrap within the card without breaking the layout
- No active or assigned heists — grid should not render, or render an empty state message
- Loading state — skeleton cards should match the card dimensions so the layout does not shift on load

## Acceptance Criteria

- `HeistCard` renders title (as a link to `/heists/[id]`), target, assigned agent, and scheduled datetime
- `HeistCardSkeleton` renders a placeholder card matching the visual footprint of `HeistCard`
- Active and assigned heist sections each display cards in a 3-column responsive grid
- Expired heists are not shown as cards
- Skeleton cards are shown while heists are loading (loading state from `useHeists` hook)
- Components live in `components/HeistCard/` following the project's component convention (component file, CSS module, barrel export)

## Open Questions

- Should the expired heists section be completely removed from the page, or retained as a simple list? simple list for now.
- Is there a status badge/pill on the card to distinguish active vs. assigned heists visually?
- Should the 3-column grid collapse to fewer columns on smaller viewports? yes

## Testing Guidelines

Create a test file in `tests/components/HeistCard.test.tsx` covering:

- Renders heist title as a link to the correct `/heists/[id]` path
- Renders target and assigned agent values when present
- Handles missing assigned agent without crashing
- `HeistCardSkeleton` renders without errors
- Snapshot or structural test to catch regressions in card layout
