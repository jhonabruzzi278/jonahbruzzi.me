# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run all commands from this directory (`jonahbruzzi.me/`, the Next.js app — the parent folder also contains an unrelated `documentation/` static export from the purchased template).

```bash
npm run dev      # start dev server (webpack, not Turbopack) on :3000
npm run build    # production build (webpack)
npm run start    # serve a production build
npm run lint     # eslint . (flat config, eslint.config.js)
```

```bash
npm test              # run tests once (Vitest)
npm run test:watch    # watch mode
npm run test:coverage # run with coverage (src/lib/** and src/services/** only)
```

Tests live next to the code they cover (`*.test.ts`). Coverage today: `src/lib/woocommerce/mappers.ts`, the cart session logic in `cart.ts` (`buildHeaders`, `ensureSession`, `getCart`, `writeCart`), `checkout.ts` (`submitCheckout`), and `src/lib/wordpress/auth.ts` (all of it) — everything else in `src/lib/`, `src/services/`, and all UI components are still untested (see `aidlc-docs/testing/TEST_STRATEGY.md` for the prioritized gap list).

- When testing a module that calls `storeApiFetch`/`restApiFetch`/`storeApiFetchWithHeaders`, mock `"./client"` with `vi.mock` rather than mocking global `fetch` — see `cart.test.ts`/`checkout.test.ts` for the pattern. This also lets tests for modules that depend on `cart.ts` (like `checkout.ts`) exercise the real session logic instead of re-stubbing it.
- `auth.ts` imports `"server-only"` directly, which throws by default outside the `react-server` condition Vitest doesn't set — neutralize it with `vi.mock("server-only", () => ({}))` at the top of any test file that imports a module doing this (only `client.ts` and `auth.ts` do).
- `WOOCOMMERCE_URL`/`WOOCOMMERCE_CONSUMER_KEY/SECRET`/`SIMPLE_JWT_LOGIN_AUTH_CODE` are read into module-scope consts at import time in `client.ts`/`auth.ts`. To test a scenario with a different env value, set `process.env` and then `vi.resetModules()` + dynamic `await import(...)` — mutating `process.env` after the module is already loaded has no effect. See `auth.test.ts`'s `importAuth()` helper.
- On Windows, `vitest run --coverage`'s terminal table silently drops rows for some files (seen with `checkout.ts` and `auth.ts`) even though they're fully covered — verify real numbers via `coverage/coverage-final.json` if a file you just tested doesn't show up.

## Architecture

This is a **headless WooCommerce storefront**: Next.js App Router frontend, WordPress + WooCommerce as the backend at `admin.jonahbruzzi.me`. All WordPress/WooCommerce communication is proxied through Next.js Route Handlers so store credentials never reach the browser.

### Request flow (client → WooCommerce)

```
Component → Redux (RTK Query, src/redux/) → same-origin /api/* route handler (src/app/api/)
          → service (src/services/) → lib client (src/lib/woocommerce | src/lib/wordpress)
          → admin.jonahbruzzi.me (WordPress/WooCommerce REST)
```

- `src/lib/woocommerce/client.ts` — the only place `WOOCOMMERCE_URL`/consumer key/secret are read. Two fetch helpers:
  - `storeApiFetch` / `storeApiFetchWithHeaders` hit the public **Store API** (`/wp-json/wc/store/v1`, no credentials) — used for products, categories, and the cart.
  - `restApiFetch` hits the authenticated **REST API** (`/wp-json/wc/v3`, Basic auth from consumer key/secret) — used for admin/write operations like checkout and coupons.
  - Every file in `src/lib/` and `src/services/` imports `"server-only"` at the top — this is what actually enforces that secrets can't leak into a client bundle (a build fails if a client component imports one transitively).
  - Public, non-personalized reads use `next: { revalidate }` instead of `cache: "no-store"` — the WordPress host was intermittently dropping connections under load, so per-request no-store fetches are avoided where the data is safe to cache briefly.
- `src/lib/wordpress/auth.ts` — talks to the **Simple JWT Login** WordPress plugin (`/wp-json/simple-jwt-login/v1`) for headless login/register/password-reset, since WordPress core has no auth mechanism for external apps. `validateToken` re-verifies a JWT server-side against WordPress on every use — never trust a client-supplied token's payload directly.
- `src/services/*Service.ts` — one file per domain (product, cart, checkout, coupon, order, auth, category). These call the `lib/` clients and shape responses. Response envelopes intentionally mirror a previous backend's shapes (e.g. `{ products: [...] }`, `{ product: [...] }`) so the Redux layer didn't need UI-facing changes when this backend was swapped in.
- `src/app/api/**/route.ts` — thin Route Handlers that call a service and return `NextResponse.json(...)`. This is the boundary the browser actually talks to.
- WooCommerce cart sessions are stateless per-request and tracked via `Cart-Token`/`Nonce` response headers plus a `wp_woocommerce_session_*` cookie. Since `Cookie` is a forbidden header for browser `fetch()`, the cookie value is relayed as `X-Cart-Cookie` from client → route handler → real `Cookie` header from route handler → WooCommerce.

### Client-side state

- `src/redux/store.js` wires: `apiSlice` (RTK Query) + slices for `auth`, `cart`, `wishlist`, `coupon`, `order`, `product`.
- `src/redux/api/apiSlice.js` defines a single RTK Query `apiSlice` with a **dynamic base query**: endpoints named in `AUTH_ENDPOINTS` (login, register, profile, orders, password reset) hit `/api/auth` and attach `Authorization: Bearer <token>` from `state.auth.accessToken`; everything else hits `/api/woocommerce`. When adding a new RTK Query endpoint that needs auth, add its name to `AUTH_ENDPOINTS`.
- Domain-specific RTK Query endpoints live under `src/redux/features/**` (e.g. `productApi.js`, `categoryApi.js`, `auth/authApi.js`), injected into the shared `apiSlice`.

### Path aliases

Defined in `tsconfig.json`: `@components/*`, `@lib/*`, `@services/*`, `@config/*`, `@hooks/*`, `@ui/*`, `@utils/*`, `@svg/*`, `@layout/*`, `@styles/*`, `@assets/*` (→ `public/assets/*`), `@data/*`, `@elements/*`. Use these instead of relative paths crossing directories.

### Config and formatting

- `src/config/site.js` holds site-wide constants (`SITE_LOCALE`, `SITE_CURRENCY = "CLP"`, `SITE_URL`) and `formatPrice()` — the canonical CLP formatter (`$19.990` — no decimals, `.` thousands separator). Use it rather than re-implementing price formatting.
- `next.config.js` allowlists remote image hosts (`i.ibb.co`, `res.cloudinary.com`, `admin.jonahbruzzi.me`) via `images.remotePatterns` — add new hosts here before using `next/image` with them.

### Environment variables

Server-only, set in `.env.local` (never prefix with `NEXT_PUBLIC_`): `WOOCOMMERCE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`, `SIMPLE_JWT_LOGIN_AUTH_CODE`.
