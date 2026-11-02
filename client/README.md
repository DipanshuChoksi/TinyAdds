# Tinyadds – Next.js + TypeScript (App Router)

## Setup
```bash
npm install
npm run typecheck   # optional: tsc --noEmit
# copy original images -> public/assets/img   (see public/assets/README.txt)
npm run dev
```

## Routes (old HTML -> Next route)
| Old file | Route |
|---|---|
| index.html | `/` |
| Category1.html | `/category/[slug]` |
| EmotionListing.html | `/emotion/[slug]` |
| CategoryDetail.html | `/listing/[id]` |
| Blogs.html / BlogDetail.html | `/blogs`, `/blogs/[slug]` |
| AdvertiseWithUs.html | `/advertise-with-us` |
| Login.html / Registration.html | `/login`, `/register` |
| Profile.html / EditProfile.html | `/profile`, `/profile/edit` |
| MyListings.html / AddListing.html | `/my-listings`, `/add-listing` |
| VendorProfile.html | `/vendor/[id]` |

## Structure
- `src/app/(site)` – pages with Header/Footer, `(auth)` – login/register layout, `(account)` – sidebar layout
- `src/components` – layout, ui, home, listing, forms, account
- `src/hooks` – useDisclosure, useClickOutside, useScrolledPast, useLocalStorage, usePagination, useListingFilters, useForm, useImagePreview, useInterval
- `src/context/AuthContext.tsx` – demo auth (localStorage)
- `src/lib/api.ts` – data layer; replace with real API calls
- `src/types/index.ts` – shared interfaces (Listing, User, BlogPost…)
- `src/data/site.ts` – all static content

## TODO for production
- Real auth + route protection (middleware) for `(account)` routes
- Connect forms to backend; connect HeroSearch city to listing query
