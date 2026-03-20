# Plan: Heist Card Component

## Context

The heists page currently renders bare `<li>` elements for active, assigned, and expired heists. This plan implements a `HeistCard` component (based on the Figma design) to display active and assigned heists in a styled 3-column responsive grid, with a skeleton loading state. Expired heists stay as a plain list.

The `useHeists` hook currently returns `Heist[]` with no loading state — it must be updated to expose `loading: boolean` so skeletons can be shown until data arrives.

---

## Key Findings

- **`useHeists` hook** (`hooks/useHeists.ts`): returns `Heist[]` only. Needs to return `{ heists: Heist[], loading: boolean }`.
- **`Heist` type** (`types/firestore/heist.ts`): fields include `id`, `title`, `assignedToCodename`, `createdByCodename`, `deadline`, `finalStatus`, `createdAt`.
- **Existing grid class**: `.preview-grid` in `globals.css` already provides `grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3` — reuse this.
- **Theme tokens** from `globals.css` match Figma exactly: `--color-primary: #C27AFF` (purple, target), `--color-secondary: #FB64B6` (pink, agent), `--color-lighter: #101828` (card bg), `--color-body: #99A1AF` (label text).
- **Component convention**: 3 files per `components/<Name>/` directory — `Name.tsx`, `Name.module.css`, `index.ts`.

---

## Implementation Steps

### 1. Update `hooks/useHeists.ts`
- Change return type from `Heist[]` to `{ heists: Heist[], loading: boolean }`
- Add `loading` state: starts `true`, set to `false` after first snapshot fires (or immediately if no user)
- Update `tests/hooks/useHeists.test.tsx` to cover the new `loading` field

### 2. Create `components/HeistCard/HeistCard.tsx`
Export two components from this file:

**`HeistCard`** (props: `heist: Heist`, `status: 'active' | 'assigned'`):
- Card container with dark background, border, border-radius per Figma
- Title row: heist title as a `<Link href="/heists/[id]">` + clock icon top-right
- Status badge pill below title: `Active` in `--color-success` (green) or `Assigned` in `--color-primary` (purple)
- Three metadata rows (12px icons + label + value):
  - `To:` → `@{heist.assignedToCodename}` in `--color-primary` (purple)
  - `By:` → `@{heist.createdByCodename}` in `--color-secondary` (pink)
  - Date row → `heist.deadline` formatted as date string in `--color-primary`
- Handle empty `assignedToCodename` gracefully (show `—` fallback)

**`HeistCardSkeleton`**:
- Same card container dimensions as `HeistCard`
- Placeholder blocks using `#1e2939` fill (on-palette, matches card border color)
- One tall block for title row, three shorter blocks for metadata rows

### 3. Create `components/HeistCard/HeistCard.module.css`
Styles using `@apply` and `@reference` for theme tokens:
- `.card`: background `var(--color-lighter)`, border `1px solid #1e2939`, `border-radius: 10px`, `padding: 21px`, flex column, gap
- `.titleRow`: flex, space-between, position relative
- `.title`: Inter 16px, white, hover underline
- `.metaRow`: flex, align-center, gap 8px, height 20px
- `.label`: 14px, `var(--color-body)` (grey)
- `.target`: 14px, `var(--color-primary)` (purple)
- `.agent`: 14px, `var(--color-secondary)` (pink)
- `.skeletonBlock`: background `#1e2939`, border-radius, animated pulse

### 4. Create `components/HeistCard/index.ts`
Barrel export for `HeistCard` and `HeistCardSkeleton`.

### 5. Update `app/(dashboard)/heists/page.tsx`
- Destructure `{ heists, loading }` from updated `useHeists` calls
- Active and assigned sections: render a `.preview-grid` div
  - If `loading`: show 3 `<HeistCardSkeleton />` placeholders
  - If heists exist: map to `<HeistCard />` components
  - If empty: show a short "No heists yet" message
- Expired section: keep as a simple `<ul>/<li>` plain list (no cards, no skeleton)

### 6. Create `tests/components/HeistCard.test.tsx`
Mock `next/link`. Test:
- `HeistCard` renders title as a link to `/heists/[id]`
- Renders `assignedToCodename` and `createdByCodename` with `@` prefix
- Shows `—` fallback when `assignedToCodename` is empty
- `HeistCardSkeleton` renders without errors

---

## Files to Create
- `components/HeistCard/HeistCard.tsx`
- `components/HeistCard/HeistCard.module.css`
- `components/HeistCard/index.ts`
- `tests/components/HeistCard.test.tsx`

## Files to Modify
- `hooks/useHeists.ts` — expose `loading` state
- `tests/hooks/useHeists.test.tsx` — cover `loading` state
- `app/(dashboard)/heists/page.tsx` — use cards + grid + skeleton

---

## Verification
1. `npm test` — all tests pass including updated hook tests and new card tests
2. `npm run dev` — heists page shows 3-column grid for active/assigned sections with skeletons on initial load, and a plain list for expired heists
3. Clicking a heist title navigates to `/heists/[id]`
