# Tinyadds — AGENTS.md

> **Engineering constitution for AI coding agents.**
> Read this file before touching any code. It reflects the *actual* project, not a generic Next.js template.

---

## 1. Project Snapshot (verified from repo)

| Item | Value |
|---|---|
| Framework | **Next.js `^15.1.0` (App Router only)** |
| React | `^19.0.0` |
| Language | **TypeScript `^5.6.0`, `strict: true`** |
| Package manager | npm (`package-lock` implied by `package.json`) |
| Styling | **Bootstrap 5.3 (CSS + utility classes)** + `bootstrap-icons` + a thin `globals.css` layer |
| State | React local state + `AuthContext` (localStorage demo) + URL-free |
| Data layer | `src/lib/api.ts` — static data now, swappable to HTTP later |
| Forms | **Custom `useForm` hook** (`src/hooks/useForm.ts`) + custom validators (`src/lib/validators.ts`) — *not* React Hook Form / Zod |
| Auth | Demo only: `AuthProvider` stores `USER` in localStorage under `tinyadds:user` |
| Validation | `src/lib/validators.ts` (`required`, `email`, `phone`, `minLength`, `compose`) |
| Lint | `eslint` + `eslint-config-next` (`next/core-web-vitals`) |
| Scripts | `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`) |
| Path alias | `@/*` → `./src/*` |
| Testing | **None installed** — do not invent test files or add test runners without approval |

**Screenshot of the layout:** root `layout.tsx` imports Bootstrap CSS + icons + `globals.css` and wraps everything in `<AuthProvider>`. Route groups are `(auth)` (login/register, split layout with cover image) and `(site)` (Header/Footer + BackToTop, with a nested `(account)` group under `/profile`, `/my-listings`, `/add-listing` that renders `AccountSidebar`).

**Existing architectural decisions — PRESERVE THEM:**
- Bootstrap utility-first markup (`row`, `col-*`, `card`, `btn`, `ratio`, `nav`, `badge`, etc.). Do **not** introduce Tailwind, CSS-in-JS, or a component library.
- `CoverImage` for all ratio-boxed images; `next/image` everywhere else.
- `EventCard` / `BlogCard` are the canonical listing cards — reuse before creating new ones.
- `useListingFilters` + `usePagination` drive all filter/paginate UIs (`ChooseEvent`, `ListingBrowser`).
- `FormField` is the only form field primitive; `useForm` is the only form state manager.
- Route groups control layout, not the URL. New public pages go under `src/app/(site)/`; new auth pages under `src/app/(auth)/`.
- All copy, categories, testimonial text, and image paths live in `src/data/site.ts`. **Never hardcode copy in components.**

---

## 2. Folder Structure & Placement Rules

```
src/
  app/
    layout.tsx                # root: html/body + AuthProvider + global CSS imports
    globals.css               # thin theme layer on top of Bootstrap
    not-found.tsx
    (auth)/                   # no Header/Footer
      layout.tsx
      login/page.tsx
      register/page.tsx
    (site)/                   # Header + Footer + BackToTop
      layout.tsx
      page.tsx
      (account)/              # AccountSidebar layout
        layout.tsx
        profile/{page.tsx,edit/page.tsx}
        my-listings/page.tsx
        add-listing/page.tsx
      category/[slug]/page.tsx
      emotion/[slug]/page.tsx
      listing/[id]/page.tsx
      blogs/{page.tsx,[slug]/page.tsx}
      vendor/[id]/page.tsx
      advertise-with-us/page.tsx
  components/
    layout/   Header, Footer
    home/     HeroSearch, HeroSlider, EmotionRow, UpcomingEvents, CategoryGrid, ChooseEvent
    listing/  EventCard, BlogCard, ListingBrowser
    account/  AccountSidebar, MyListingsList
    forms/    FormField, LoginForm, RegisterForm, AddListingForm, EditProfileForms
    ui/       Logo, CoverImage, Breadcrumb, Pagination, SelectField, BackToTop
  context/    AuthContext.tsx
  data/       site.ts (all static content)
  hooks/      useClickOutside, useDisclosure, useForm, useImagePreview, useInterval,
              useListingFilters, useLocalStorage, usePagination, useScrollPosition
  lib/        api.ts (data access), validators.ts
  types/      index.ts (shared interfaces)
```

**Where new code belongs**

| Code | Location |
|---|---|
| Page / route | `src/app/(site)/<segment>/page.tsx` (or `(account)` / `(auth)` for those layouts) |
| Route-specific nested component | `src/components/<feature>/Name.tsx` |
| Reusable primitive (uses no page data) | `src/components/ui/` |
| Header/Footer-only pieces | `src/components/layout/` |
| Form-related | `src/components/forms/` |
| Data-fetching helper | extend `src/lib/api.ts` |
| Shared type | `src/types/index.ts` |
| Static content | `src/data/site.ts` |
| Pure helper | `src/lib/` (e.g. `validators.ts`) |
| Generic behavior hook | `src/hooks/useSomething.ts` |

**Forbidden:** new top-level folders, `components/common`, `components/shared`, `utils/` at root, files named `index.tsx` inside components.

---

## 3. Next.js App Router Rules

1. **Server Components by default.** Only add `'use client'` when the file uses `useState`, `useEffect`, refs, browser APIs, or event handlers.
2. **Current client components (do not convert without reason):** `Header`, `AccountSidebar`, `MyListingsList`, `LoginForm`, `RegisterForm`, `AddListingForm`, `EditProfileForms`, `FormField`, `HeroSearch`, `HeroSlider`, `ChooseEvent`, `ListingBrowser`, `Pagination`, `SelectField`, `BackToTop`, `AuthContext`, and every hook.
3. **Page params are Promises** in Next 15:
   ```ts
   export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
   }
   ```
4. `generateStaticParams` + `generateMetadata` for dynamic routes (`category/[slug]`, `emotion/[slug]`, `blogs/[slug]`) — follow the existing pattern.
5. `notFound()` from `next/navigation` for 404 in dynamic routes.
6. **`next/image` only.** No `<img>`. `CoverImage` for ratio boxes, direct `<Image fill>` / fixed sizes elsewhere. Always supply `alt` (empty string `""` for decorative), and `sizes` when `fill` is used.
7. **`next/link` only.** No `<a href="/...">` for internal navigation.
8. **Metadata** via `export const metadata` / `generateMetadata`. Titles use the root template `%s | Tinyadds`.
9. **Data fetching** goes through `src/lib/api.ts` (async functions). Do not fetch in components directly.
10. **No new API route handlers, Server Actions, middleware, or `caching`/`revalidate` config** without an explicit request — this project currently renders statically with mock data. If the task genuinely requires it, add it in the same style and document the decision in the PR description.
11. **Avoid unnecessary `'use client'`.** Do not convert a Server Component to Client just to pass children or render a link.

---

## 4. Component Standards

- One component per file; default export; file name matches component name (`EventCard.tsx`).
- Props typed via a local `interface Props` / `type Props` above the component; exported when consumers need it.
- Prefer **composition** over boolean-props explosions. If a component has more than ~5 boolean props, split it.
- Do **not** prop-drill more than 2 levels; use `useAuth`-style context only for cross-cutting concerns. `useListingFilters` / `usePagination` cover all listing state.
- Feature-specific components (`home/`, `listing/`, `account/`, `forms/`) may import from `ui/`, `hooks/`, `lib/`, `data/`, `types/`. `ui/` must **not** import from feature folders.
- Respect the existing markup idiom: Bootstrap class strings, no inline styles except for one-off dynamic values that cannot be expressed with classes (e.g. the `style={{ height: 260 }}` in `vendor/[id]`).

---

## 5. TypeScript Rules

- `strict: true` is non-negotiable. `noEmit` is set — never run `tsc` expecting files.
- **No `any`.** The only existing `any` is a deliberate escape hatch in `src/lib/validators.ts` (`all?: any`) — **do not copy that pattern**; prefer `unknown` or a generic.
- Prefer `interface` for object shapes, `type` for unions/aliases — matches `src/types/index.ts`.
- All API responses typed through `src/types/index.ts`. Adding a new domain type means adding it there, not in the consumer.
- Generic utilities use constrained generics (`useListingFilters<T extends FilterableItem>`).
- Use optional chaining and nullish coalescing; narrow before render (`if (!category) notFound()`).
- Never silence errors with `// @ts-ignore` or `as any` to make the build pass.
- Component prop arrays/maps use `as const` where the existing code does (e.g. tab tuples in `EditProfileForms`).

---

## 6. Data & API Layer

`src/lib/api.ts` is the **single boundary** between UI and data.

- Add new accessors here: `export async function getX(...): Promise<X>`.
- Return `null` for not-found lookups so pages can call `notFound()`.
- Fetch through these functions from Server Components (`await getBlogs()`); do not import `src/data/site.ts` directly inside pages for data that could later come from HTTP. Static config (`SITE`, `HERO_CITIES`, `FILTER_CITIES`, `SORT_OPTIONS`, `LANGUAGES`, `DEVICES`) is the exception — it's fine to import anywhere.
- When replacing mock data with real HTTP, keep signatures identical so pages don't change.
- Never add `axios`, `swr`, or `react-query` without approval.

---

## 7. State Management

| Kind of state | Rule |
|---|---|
| UI toggles (dropdown, navbar, modal) | `useDisclosure` |
| Click-outside | `useClickOutside` |
| Persisted client state | `useLocalStorage` (SSR-safe, returns `ready`) |
| Listing filter/sort/pagination | `useListingFilters` + `usePagination` — do not reimplement |
| Auth user | `AuthContext` (`useAuth`) — do not add a second auth store |
| Server data | React Server Components `await` in the page; pass down as props |

- No Redux/Zustand/Jotai. No global state for things that are route-scoped.
- `AuthProvider` is demo-only — the `login`/`logout` functions currently write `USER` to localStorage. If real auth is requested, add it *inside* `AuthContext` and keep the `useAuth` API stable.

---

## 8. Forms & Validation

- **Always** use `useForm` from `src/hooks/useForm.ts` + `FormField` from `src/components/forms/FormField.tsx`.
- Validators come from `src/lib/validators.ts` and compose with `compose(...)`. Add new validators there (e.g. `url`, `zip`) — do **not** inline regex in forms.
- Field errors are strings (`''` = valid) — `Validators<T>` types enforce this.
- `handleChange` already covers checkbox, file, and text inputs. Do not hand-roll event handlers per-field.
- File inputs use `useImagePreview` for the preview URL and must be cleaned up (the hook already revokes URLs on change/unmount).
- Submit handlers are `handleSubmit(async (values) => { ... })`; do server-side work via `src/lib/api.ts` in a real implementation.
- **Do not add** React Hook Form, Zod, Yup, Formik. The existing stack is the standard.

---

## 9. Styling

- Bootstrap 5 utility + component classes are the only styling vocabulary. Additions go in `src/app/globals.css` **only** for theme tokens (`--bs-*` overrides) or reusable custom classes (`card-hover`, `btn-scroll-top`, `hero`, `auth-cover`) that match existing precedent.
- Theme color is `--ta-primary` (currently `#6a34e8`) — set via the overrides in `globals.css`. Update that variable (or the Bootstrap `--bs-btn-*` overrides) rather than hardcoding a color in components.
- `card-hover` is the canonical hover-lift utility. Use it on any card grid.
- Radii come from Bootstrap (`rounded-3`, `rounded-4`, `rounded-pill`, `rounded-5`). Do not invent new pixel radii.
- Respect the `DESIGN.md` component spec (Tinyadds* components) when building new sections: pill-label headers, image-overlay cards, numbered testimonial cards, stat counters, newsletter input groups.
- Responsive: use Bootstrap breakpoints (`col-*`, `row-cols-*`, `d-none d-lg-block`, `flex-md-row`). Never use custom media queries unless `globals.css` already has one for the same reason.
- **No Tailwind, no CSS modules, no styled-components, no inline `<style>` blocks.**

---

## 10. Performance

- Keep Server Components server-side; `'use client'` only where required.
- `next/image` with correct `sizes` on every `fill`. `priority` only on above-the-fold images (hero, auth cover, vendor cover — already done).
- `next/font` is **not** currently used. If fonts are added, use `next/font` — do not add `<link>` tags.
- Guard against unnecessary re-renders: `useMemo` for derived arrays (`cities` in `ListingBrowser`), `useCallback` for stable handlers. Do not blanket memoize.
- Avoid effects for derived state; compute during render.
- No bundle-size bloat: don't add a package when a Bootstrap class or a 20-line hook will do.

---

## 11. Security

- **Never** import server-only env vars into client components. Env vars are not currently in use; when added, use `NEXT_PUBLIC_*` only for genuinely public values and document them in `README.md`.
- No `dangerouslySetInnerHTML` without an explicit review and sanitization.
- Auth is a demo — if real auth is added, permission checks belong on the **server** (route handlers or `middleware.ts`), never only in the client.
- Validate and sanitize all user input on the server before persisting/rendering.
- Never commit `.env*` files. `.gitignore` already covers `.env*.local`.
- Do not log secrets or full user objects.

---

## 12. Errors, Loading, and Boundaries

- Keep `src/app/not-found.tsx` (root) and call `notFound()` in dynamic pages when `getX()` returns `null`.
- When introducing async data from a real backend, add `loading.tsx` and `error.tsx` **at the segment** that fetches — do not add them globally as a placeholder.
- Never swallow errors. If an existing `catch { /* ignore */ }` exists (only in `useLocalStorage` for corrupt storage), preserve it; do not add new silent catches.
- Show user-friendly messages; log structural errors where a logger exists.

---

## 13. Accessibility

- Every `next/image` needs an `alt` (empty for decorative).
- Every icon-only button needs `aria-label` (see `BackToTop`, `Pagination` prev/next, social links in `Footer`).
- `FormField` already wires `htmlFor`, `aria-invalid`, and `aria-describedby`. Do not bypass it for a raw `<input>`.
- Keyboard support: Bootstrap components handle the dropdown/modal/tab behavior — do not reimplement with `div` + `onClick`.
- `HeroSlider` dot buttons must keep `aria-label` and `aria-current`.
- Maintain visible focus states — no `outline: none` without a replacement.
- Contrast: use `text-body-secondary` (Bootstrap token) for secondary copy, not arbitrary grays.

---

## 14. Code Quality & Verification

- **No test suite exists.** Do not add Jest/Vitest/Playwright or `*.test.*` files unless the task explicitly requests it.
- Before claiming a change is complete, run at least:
  ```bash
  npm run typecheck
  npm run lint
  ```
- Only claim `npm run build` passed if it was actually run.
- Follow `.eslintrc.json` (`next/core-web-vitals`). Fix warnings, don't disable rules.
- Match existing formatting: single quotes, semicolons, 2-space indent, trailing commas in multiline objects/arrays.
- Small, focused diffs. No drive-by reformatting.

---

## 15. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component file | `PascalCase.tsx` | `EventCard.tsx` |
| Component | `PascalCase` | `ListingBrowser` |
| Hook file | `useThing.ts` | `usePagination.ts` |
| Hook | `useThing` | `useListingFilters` |
| Utility file | `camelCase.ts` | `validators.ts` |
| Types / interfaces | `PascalCase` | `BlogSummary`, `Filters` |
| Constants | `SCREAMING_SNAKE` | `HERO_CITIES`, `SITE` |
| Route segment | `kebab-case` | `my-listings`, `add-listing` |
| Dynamic segment | `[param]` | `[slug]`, `[id]` |
| CSS custom class | `kebab-case` | `card-hover`, `btn-scroll-top` |
| localStorage key | `tinyadds:key` | `tinyadds:user` |

Prefer full words. Avoid `tmp`, `data2`, `handleStuff`, single-letter identifiers (except loop indices and `e` for events).

---

## 16. Dependencies

- Current runtime deps: `bootstrap`, `bootstrap-icons`, `next`, `react`, `react-dom`. Dev deps: TypeScript, types, ESLint, `eslint-config-next`.
- **Do not add** a UI kit (MUI, Chakra, shadcn), a CSS framework, a form library, a schema validator, a state library, an HTTP client, or a test runner without explicit approval and an entry in the PR description explaining why the existing stack cannot serve the need.
- Any new package must be compatible with Next 15 + React 19 and actively maintained.

---

## 17. AI Agent Workflow (mandatory)

### Before writing code
1. **Read the relevant existing files.** Never assume a component, hook, validator, or API function is missing — check `components/ui`, `hooks/`, `lib/`, `types/`, `data/site.ts` first.
2. Identify where the change belongs using §2.
3. Decide Server vs Client (§3).
4. Decide whether existing data comes from `src/lib/api.ts` or `src/data/site.ts`.
5. If the request conflicts with an existing decision (§1), stop and flag it rather than silently rewriting.

### While writing code
6. Reuse `EventCard`, `BlogCard`, `CoverImage`, `FormField`, `useForm`, `useListingFilters`, `usePagination`, `useDisclosure`, `useClickOutside` before introducing a new abstraction.
7. Keep diffs minimal. No unrelated refactors, no renaming files, no reformatting untouched files.
8. No new files unless a route, component, hook, or type genuinely needs one.
9. Update `src/types/index.ts` and `src/data/site.ts` when adding new domain concepts — do not inline them in components.
10. Preserve backward compatibility of exported components, hooks, and API functions.
11. After edits, verify imports (no broken paths, no circular imports) and confirm `@/` alias use matches the repo.

### Before claiming completion
12. Run `npm run typecheck` and `npm run lint`. Report actual output.
13. Do **not** claim build/tests passed unless run.
14. State any architectural decision in one or two sentences (what you added, why, and what you reused).
15. If you had to touch `globals.css` or `src/lib/api.ts` signatures, note it explicitly.

---

## 18. Documentation

- `README.md` is the source of truth for setup, routes, and TODO list. Update it when routes change.
- `DESIGN.md` documents the Tinyadds component design system. Update it when adding new reusable primitives.
- Do not duplicate source code in docs. Keep additions short and factual.
- If a dependency or env var is added, add it to `README.md` in the same PR.

---

## 19. Known Gaps (do not silently fix)

These are intentional demo-state decisions. Address only when explicitly requested:

- `AuthContext` stores a hardcoded `USER` in localStorage; `(account)` routes are **not protected** (no middleware). README already lists this as a TODO.
- `lib/api.ts` returns static mock data; there is no backend.
- `AddListingForm`, `LoginForm`, `RegisterForm`, `EditProfileForms` all have `// TODO` submit stubs.
- `src/app/(site)/emotion/[slug]/page.tsx` filters `getListings('automotive')` for the emotion — a mock shortcut.
- `listing/[id]` renders `BLOG_POST` copy rather than per-listing content — mock.
- `vendor/[id]` ignores the `id` param and calls `getVendor()` — mock.
- `tsconfig.tsbuildinfo` is committed; it's a build artifact and may be removed in a dedicated cleanup PR, not opportunistically.

**Do not "fix" any of the above as a side effect of another task.**

---

## 20. Definition of Done

A change is done when:

- [ ] It reuses existing components/hooks/validators where applicable.
- [ ] It places files per §2 and respects route-group layout boundaries.
- [ ] It is Server-Component-first with `'use client'` only where required.
- [ ] It types everything (no `any`, no `@ts-ignore`).
- [ ] It validates forms through `useForm` + `FormField` + `src/lib/validators.ts`.
- [ ] It styles with Bootstrap utilities + existing `globals.css` classes only.
- [ ] It has accessible labels/alts/keyboard behavior.
- [ ] It loads data through `src/lib/api.ts` (or static config from `src/data/site.ts`).
- [ ] `npm run typecheck` and `npm run lint` pass locally.
- [ ] `README.md` / `DESIGN.md` updated if routes, setup, or primitives changed.
- [ ] No unrelated refactors, no new dependencies without approval, no mock TODO gaps "fixed" incidentally.

---

**Priority order:** maintainability → consistency with existing patterns → type safety → performance → security → simplicity. When in doubt, match the surrounding code, not a generic best-practice checklist.