# Smiskisite

A simple Smiski collector storefront rebuilt with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase. The original CodeIgniter application is preserved in the parent directory. Existing public images and the checked-in product/catalog content are included.

## Run locally

Use Node.js 24 LTS. From this directory:

```powershell
npm ci
npm run dev
```

Open **http://localhost:3000**. On this Windows workspace, `powershell -ExecutionPolicy Bypass -File modern/dev.ps1` from the repository root also uses the portable Node runtime prepared under `.tools/` when a global Node installation is unavailable. The portable runtime and installed packages are ignored by Git.

Without Supabase settings, the home, shop, product pages, collector's catalog, About page, and browser shopping bag work using a public-only snapshot of the existing project. Sign-in, profile editing, uploads, user administration, and placing/viewing orders require the Supabase setup below. Account pages explain their availability; they never create simulated authenticated users.

## Connect the database and preserve existing accounts

Follow **[docs/MIGRATION.md](docs/MIGRATION.md)**. It covers:

1. Backing up the actual live MySQL database and uploaded files. The old committed dump cannot supply missing live profile fields.
2. Creating a free Supabase project and applying `supabase/migrations/202610280001_initial.sql`.
3. Copying `.env.example` to `.env.local`, adding the project settings, and configuring confirmation/recovery email redirects.
4. Previewing the importer locally, reviewing its report, then deliberately applying it to the new destination.
5. Verifying migrated accounts, products, image references, roles, and profile details before changing the live site.

Existing product IDs are preserved. Existing user IDs are retained as `profiles.legacy_id`, linked to Supabase authentication UUIDs. The importer skips completed records on reruns and stops on collisions. Passwords and user exports never enter the public product snapshot. No live database migration is performed merely by starting the app or deploying it.

## Modules and routes

| Module                         | Routes                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| Home and About                 | `/`, `/about`                                                |
| Collector's dictionary         | `/catalog`, `/catalog/[slug]`                                |
| Shop and product details       | `/shop`, `/shop/[id]`                                        |
| Accounts and recovery          | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| Profile and avatar             | `/profile`                                                   |
| Shopping bag                   | `/cart`                                                      |
| Demo checkout and saved orders | `/checkout`, `/checkout/success/[id]`, `/orders`             |
| Admin user management          | `/admin`                                                     |

Old customer/shop/catalog URLs redirect to their new equivalents. The shopping bag stores product IDs, quantities, and selection in the browser, separately for each account. Guest items transfer into the signed-in account's bag. A server action and database transaction always recalculate totals from stored product prices, verify stock and delivery details, and save orders atomically. Only the checked-out items leave the bag. Repeated submission of the same checkout attempt returns the existing order; the request key survives a tab refresh.

**Checkout is a portfolio demonstration.** It does not charge money, contact payment providers, or arrange deliveries. It saves order history and updates demo inventory. Product/inventory editing and fulfillment administration are outside the original implemented scope.

Supabase authenticates users. Profile fields are allowlisted, roles/identity are protected by database grants and triggers, and row-level security limits customers to their own records. Admin actions check admin permissions on the server. A customer with order history cannot be deleted. New avatars are validated and stored in the owner's storage folder.

## Verify changes

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The unit/data tests use local fixtures. SQL tests execute the migration in embedded PostgreSQL with mocked Supabase auth/storage schemas to exercise permissions, totals, rollback, stock, and retries. They do not prove a live Supabase connection or email delivery.

Browser tests use installed Microsoft Edge on Windows. On other systems, run `npx playwright install chromium` first; set `PLAYWRIGHT_CHANNEL` if selecting another supported installed browser. The public browser suite expects no Supabase credentials and starts a local development server if needed. A running server with real credentials should not be reused for this fixture suite.

See **[docs/QA.md](docs/QA.md)** for the manual QA checklist and connection-dependent checks.

## Deploy on Vercel

Import this repository and set **Root Directory: `modern`** and framework **Next.js**. Use the default `npm run build` build command. Add the environment values from `.env.example` in Vercel; never prefix the service role key with `NEXT_PUBLIC_`. Set `NEXT_PUBLIC_SITE_URL` and Supabase's Site URL/redirect allowlist to your deployment URL. Apply the database schema and run the reviewed import separately. Deployment does not touch the PHP database.

Use a personal, non-commercial portfolio within the free plan's quotas. Supabase's free project may pause during inactivity; email delivery needs its own configured SMTP service. Preserve your private database and upload backups.

## Source map

The home news carousel reads `src/data/news.json`, sorts entries by publication date, and links to the specific official announcement. Its bundled SMISKI logo works without external image requests; `sourceImage` records the original announcement artwork for future replacement. Adding new announcements requires updating this file; the feed is not automatically synchronized with the official site.

Product and collection cards share the same styles in `src/app/globals.css`. The home collections carousel is server-rendered and uses native CSS markers, buttons, anchor positioning, scroll snapping, and scroll-state queries. Browsers without marker support show a warning and retain horizontal scrolling. Current build tooling reports warnings for these experimental selectors; the production controls have been checked in Edge with JavaScript disabled.

Character artwork is preserved, including any backgrounds embedded in the images. Secret characters use a centered silhouette placeholder. When the secret artwork is supplied, add its path as `secretImage` on the corresponding series in `src/data/series.json`; the page applies the silhouette effect and question mark.

```text
src/app/                Pages, server actions, auth callbacks
src/components/         Shared UI, bag, checkout and account forms
src/lib/                Typed data access, validation and Supabase clients
src/data/               Public-only legacy product and collection snapshots
supabase/migrations/    PostgreSQL tables, policies, storage and checkout transaction
scripts/                Extraction, reviewed import, asset copy and SQL tests
tests/                  Bag and authentication helper tests
e2e/                    Public desktop/mobile browser checks
public/uploads/         Existing project artwork and images
```

Smiski names and artwork belong to their respective owners. This is an unofficial student portfolio project, not an affiliated retail service. No new license is granted over third-party artwork.
