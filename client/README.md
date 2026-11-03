# TinyAdds (Next.js + TypeScript)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

- `app/globals.css` – all site styles (same design as the HTML version)
- `components/` – one component per section; `CategoryMarquee` is the scrolling category pills
- `BootstrapClient` loads Bootstrap JS so dropdowns, tabs and the mobile menu work

## Notes
- `PopularCategories.tsx` holds the carousel data. For photo cards, put images in `public/categories/` and set `image: "/categories/x.jpg"` on an item.
- Mobile menu is a Bootstrap offcanvas drawer (`offcanvas-end`); use `offcanvas-start` in `Header.tsx` for a left drawer.
- `ScrollToTop.tsx` is the pill-shaped back-to-top button (right edge, vertically centred).

## Routes
- `/blog` – News Feeds list with 2 cards per row, search (`?q=`), pagination (`?page=`) and a sticky sidebar (Search + Recent Post).
- `/blog/[slug]` – News Details (article, prev/next, share/tags, comments). Add a post in `BLOGS` (`src/data/site.ts`); its page is generated automatically.
- Navbar: Home, About Us, Blog, Contact + Sign In / Post Your Ad.
- `next.config.ts` allows images from `html.aqlova.com` (template blog images) for `next/image`.
