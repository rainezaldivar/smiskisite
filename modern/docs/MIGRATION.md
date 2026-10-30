# Preserve and migrate the legacy data

The Next.js application lives in `modern/`; the retired PHP runtime and duplicate assets have been removed. Run commands in this document from `modern/`. The bundled public browsing snapshot contains **42 products, 36 collection entries, and 126 variation descriptions** from the original project. It contains no user records or password hashes. The SQL/JSON importer remains available for existing accounts and product data.

Without Supabase environment variables, only public browsing uses that snapshot. Authentication, profile writes, uploads, order history, and checkout require Supabase. A configured database failure is shown as an error rather than silently returning the old snapshot.

## 1. Back up the actual source

If the old site is still running elsewhere, export its MySQL/MariaDB database and copy its complete uploads directory before doing any import. Keep both private. The old local SQL dump and configuration were moved to `private-exports/codeigniter-20261030/` during cleanup. That folder is ignored by Git, excluded from deployment, and absent from fresh clones. The SQL dump is an older backup whose users table lacks several profile fields; importing it cannot recover fields absent from it. The importer always requires an explicit `--input=PATH`; it does not automatically select this backup.

Supported input is a phpMyAdmin-style SQL dump with backtick-quoted `INSERT INTO products/users` statements, or a private JSON export:

```json
{
  "products": [{ "id": 1, "name": "Example", "price": "650.00", "description": "", "image": "example.png", "category": "Figurines", "stock": 3 }],
  "users": [{ "id": 1, "name": "Example", "email": "example@example.test", "password": "EXISTING_HASH", "role": "customer", "phone": null, "gender": null, "dob": null, "address": null, "city": null, "province": null, "profile_picture": null }]
}
```

Export optional `created_at`/`updated_at` values too. Export timestamps in UTC; SQL timestamps without an offset are interpreted as UTC. JSON input must contain both arrays. Use an empty users array for a deliberate products-only import. Do not put a user export in `src/data`, `public`, or any browser component. Private exports and `.migration/` reports must stay ignored by Git.

## 2. Create the destination

1. Create a Supabase project in your own account. The project can use the free plan; review the current quotas in its dashboard before enabling public use.
2. Apply `supabase/migrations/202610280001_initial.sql` to that **new** project through the Supabase SQL editor, or link the Supabase CLI and run `supabase db push`. This is a versioned one-time migration, not a rerunnable seed script.
3. Copy `.env.example` to `.env.local` and fill the project URL, publishable key (or legacy anon key), and server-only service role key. Never put the service role key in a `NEXT_PUBLIC_` variable.
4. Under Authentication → URL Configuration, set Site URL to `http://localhost:3000` while testing, then your deployed HTTPS URL for the portfolio release. Allow `http://localhost:3000/**` and your deployed `/auth/callback` URL, including callback query strings, in Redirect URLs. Configure an email provider for reliable signup confirmation and password recovery. Email delivery limits are separate from database hosting.
5. In Vercel, set the project Root Directory to `modern`. Add the same environment values and set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS URL. Use a personal noncommercial portfolio within the hosting plan's current terms.

The SQL creates products, protected profiles, orders/items, the atomic checkout RPC, and a public-read `avatars` bucket. Only authenticated users can write images in their own UUID folder. The bucket accepts JPEG/PNG/WebP files up to 5 MiB.

The application provides `/forgot-password` and `/reset-password`. The default PKCE confirmation callback uses `/auth/callback` and requires the browser that started the flow. To support confirmation/recovery opened in a different browser, set the relevant Supabase Authentication email templates to token-hash links handled by this app:

```html
<!-- Confirm signup template -->
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=email">Confirm your email</a>

<!-- Reset password template -->
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&amp;type=recovery&amp;next=/reset-password">Reset your password</a>
```

Use the correct Site URL for the environment being tested. Request a fresh link after changing templates; expired/used links show the recovery error state. The reset page requires a verified authenticated session, matching passwords, and a maximum of 72 UTF-8 bytes. Recovery requests give a generic response without disclosing which email addresses exist.

## 3. Review credentials before importing

The importer recognizes PHP bcrypt (`$2a$`, `$2b$`, `$2y$`) and Argon2i/Argon2id PHC hashes. It checks their syntax locally; the destination authentication service still validates its supported hash parameters. `$2y$` bcrypt is normalized to `$2b$` for import. Existing passwords are not printed or copied into the public product snapshot.

The PHP login also accepted plaintext passwords. Import defaults to rejecting plaintext/missing credentials. Pick an explicit policy:

- `--plaintext=hash`: hash legacy plaintext with bcrypt cost 12 before sending it to the auth service. Existing bcrypt/Argon2 hashes remain hashes. This preserves those users' passwords. Missing passwords are still rejected.
- `--plaintext=reset`: for plaintext/missing credentials, set a random undisclosed password and require recovery through Supabase before the user signs in. Existing recognized hashes remain usable. Configure recovery email first; this script does not send email.

Unknown hash formats are always rejected, including with either option. User IDs and emails must be unique. Imported auth emails are marked confirmed to retain the legacy login behavior; use a trusted export and review that choice before applying.

## 4. Preview, apply, and verify

The default command performs a local dry run and makes no remote writes:

```powershell
node scripts/migrate-legacy.mjs --input="C:/private/smiski-live.sql" --plaintext=hash
```

Read the summary and `.migration/last-report.json`. Resolve invalid data and missing images first. Then apply to the new destination using Node's environment-file support:

```powershell
node --env-file=.env.local scripts/migrate-legacy.mjs --input="C:/private/smiski-live.sql" --plaintext=hash --apply
```

This is an additive import. Product IDs remain unchanged. Legacy integer user IDs become `profiles.legacy_id`; Supabase auth UUIDs become the profile primary keys. Names, roles, supported profile fields, address, picture paths, and available timestamps are preserved. The product identity sequence is advanced after the import.

Reruns skip existing product records and completed user/profile imports: they do not reset stock, passwords, roles, or edited profile fields. Different product names on an occupied ID, unrelated accounts using a legacy email, and mismatched legacy IDs stop the import for manual reconciliation. Email alone never links an existing account. If an auth account is created but its profile import fails, the script stops and requires manual reconciliation before a rerun. It never deletes destination records to recover.

The auth API is not a transaction with the product database import. A remote failure can leave an incomplete additive import. Preserve the error and counts, inspect the destination, then rerun after resolving the cause. Errors omit password values. Only a completely successful run writes a complete report; counts in an earlier report are not proof that a later failed run made no writes.

Verify source/destination product and user counts, primary/legacy ID mappings, prices, stock, roles, all profile/address fields, and every image reference. Test representative imported logins privately. Check that one customer cannot read another profile/order, change their role, or directly write stock. Do not replace the running PHP app until those checks pass. Existing PHP login sessions and session carts do not migrate; users sign in again.

## 5. Images and catalog content

All 225 files from the original uploads directory were verified byte-for-byte against `modern/public/uploads` before the duplicate root directory was removed. Those assets deploy with the site and retain `/uploads/...` URLs. Copy any additional live uploads to the same relative paths before deployment. New profile uploads go to the `avatars` storage bucket because a serverless deployment's filesystem is not durable storage.

The one-time PHP extraction script and its `data:extract` command were retired with the old templates. Maintain the bundled public content directly in `src/data/products.json` and `src/data/series.json`; do not add private account records to either file. `src/data/extraction-report.json` is retained as a historical record of missing source images and duplicate dictionary IDs. Missing images use an existing catalog cover, and duplicate collection IDs have distinct `-1`/`-2` slugs. Original names/descriptions and all 126 variation descriptions are retained. Details missing in the source remain empty rather than borrowing another series' information.

Object storage migration is optional for existing assets. `node scripts/upload-assets.mjs --bucket=legacy-assets` previews a mapping; add `--apply` with server environment variables to copy into an existing public bucket. It does not overwrite objects or change database paths. Update paths only after reviewing that mapping; the current site already works with the included assets.

## Checkout behavior and access controls

`place_demo_order(p_items jsonb, p_idempotency_key uuid)` accepts an array such as `[{"product_id":1,"quantity":2}]` and returns an order UUID. It requires the caller's authenticated session and nonblank profile name, phone number, street address, city, and province. The database rejects missing or whitespace-only delivery fields even if called directly without the UI. Only demo payment is supported; it does not charge money or contact a payment provider.

The function validates up to 50 distinct products and quantities 1–99, loads prices from the database, locks stock rows in a stable order, writes an immutable price/name/image/address snapshot, charges the existing fixed PHP 100 demo shipping fee, and reduces stock in one transaction. Repeating the same UUID and cart returns the original order without another stock deduction. Reusing that UUID with different items fails. Any unavailable item rolls the whole request back. The UI must preserve its UUID through a retry until it receives a confirmed order ID.

Products are public-read. Customers can read their own profiles and orders and update only explicitly allowed profile columns. They cannot edit role, identity, price, stock, or order records directly. Signup metadata cannot grant admin status; initial migrated admin roles are assigned only by the server-side import. Later role changes require a trusted service-side operation or SQL in the project dashboard. The schema prevents deleting an auth account with order history to preserve those records; admin deletion displays an error in that case.

Run parser/data checks with `node --test scripts/legacy-data.test.mjs`. SQL integration checks run with `node --test scripts/checkout.test.mjs` after development dependencies are installed. Neither command needs a real Supabase project or reads secret environment files.
