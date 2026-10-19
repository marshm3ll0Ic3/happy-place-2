# Favicon, mobile polish, and the four phone-tab pages

## 1. New favicon
- Generate a square DiSTRUB "D" mark in the brand purple on the dark background.
- Use it as the site icon and remove the old Lovable icon.

## 2. Mobile friendly and responsive
- Check every page (Home, Markets, Portfolio, Deal Room, Community, School, Wallet, Profile, Sign in) at phone width (about 390px) and fix anything cramped, overflowing, or cut off: header rows, stat grids, tables, filters, buttons.
- Phone bottom tabs stay as Markets, Value, Reach, Wallet, Profile; add a small menu on phones so Portfolio, Deal Room, Community and School are still reachable.
- Make sure page content never hides behind the bottom tab bar.

## 3. Replace the "Coming soon" pages (same look as the homepage, all 4 languages)
- **Value** — "What is your audience worth?" calculator: pick platform, enter followers, engagement and niche; shows an estimated value range, price per post, and a breakdown. Sample formula, clearly labelled as an estimate.
- **Reach** — Book reach from creators: browse sample creator offers (platform, audience, price per post in DSC), filters, and a booking panel that shows an early-access notice (no credits move).
- **Wallet** — Keep the real balance, top-up and history; redesign to match the homepage and fit phones well.
- **Profile** — Real account info: email, join date, wallet summary, open orders count, language dropdown, sign-out; designed to match.
- Management stays as is (not in the phone tabs).

## Technical notes
- Favicon: generated PNG resized to 64x64 in `public/favicon.png`, linked from `__root.tsx`, delete `public/favicon.ico`.
- Value/Reach use sample data only; no new database tables. Wallet/Profile read existing account data.
- Verify with Playwright at 390px and 1280px.
