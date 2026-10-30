# Smiskisite

Smiski storefront built with **Next.js, React, TypeScript, Tailwind CSS, and Supabase**, deployed on Vercel.

The application is in **[modern/](modern/README.md)**. The retired CodeIgniter runtime, PHP templates, Composer/PHPUnit setup, old styles, and duplicate uploads have been removed.

## Run locally

Use Node.js 24 LTS:

```powershell
cd modern
npm ci
npm run dev
```

Open **http://localhost:3000**. On this Windows workspace, the portable-runtime launcher also works from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File modern/dev.ps1
```

Without Supabase configuration, public pages use the bundled product and collection snapshots. Accounts, profiles, uploads, saved orders, and demo checkout require the setup in [the application README](modern/README.md) and [the migration guide](modern/docs/MIGRATION.md).

## Project structure

```text
modern/src/          Application pages, components, styles, and data
modern/public/       Website assets, including the verified image library
modern/supabase/     Database schema, policies, and checkout transaction
modern/scripts/      SQL/JSON import, asset upload, and database checks
modern/tests/        Unit tests
modern/e2e/          Browser tests
modern/docs/         Setup, data migration, and QA guides
```

In Vercel, keep **Root Directory** set to `modern`.

The old database dump and configuration were preserved locally under `modern/private-exports/codeigniter-20261030/`. This folder is ignored by Git and excluded from deployment; it is not included in fresh clones. The importer requires an explicit `--input` path and does not automatically read a backup. Historical PHP source remains recoverable from Git history.

Existing artwork and product/catalog data are preserved. The root `LICENSE` retains the original attribution; it does not grant rights to third-party SMISKI artwork.
