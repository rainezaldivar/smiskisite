# QA handoff

## Public preview — no Supabase project required

- Open the home, About, shop, catalog, and collection/product detail pages on desktop and mobile.
- Check navigation, mobile menu, keyboard focus, back links, and the old `/customer/...` redirects.
- Filter shop categories, sort prices, search products, test no-results, and switch result pages.
- Search the collector's dictionary and open collection variations. Missing legacy artwork has an existing collection-image fallback.
- Add an in-stock product in different quantities, refresh the page, and confirm the bag persists.
- Increase/decrease quantity, remove items, select/deselect items, and check the displayed subtotal.
- Confirm sold-out products cannot be purchased. A stale unavailable bag item can be deselected or removed.
- Proceed to checkout and use Buy Now. Without account services connected, order placement is disabled and explains why.
- Confirm sign-in/registration show the unavailable state and profile/admin/order routes lead to sign-in.

## After Supabase setup and reviewed data import

- Compare source and destination record counts and all preserved profile/address/image fields. Test imported customer and admin credentials privately.
- Register a fresh customer and follow email confirmation. Test wrong-password, unconfirmed-email, sign-out, and recovery links.
- Open recovery email in the same browser and in a different browser where applicable; confirm the configured token-hash confirmation template works.
- Edit a profile, refresh, upload a valid JPG/PNG/WebP, and test invalid and oversized files.
- Confirm guest bag items transfer on sign-in; signing out or switching accounts does not expose another account's bag.
- Complete delivery details; place a demo order using selected bag items. Confirm totals use stored prices plus PHP 100 demo shipping.
- Confirm only selected items leave the bag, order history is visible, and stock decreases exactly once.
- Test double submission and retry after a simulated lost response/reload. One request key must produce one order.
- Test insufficient stock and missing delivery fields. No partial order or stock changes should remain.
- Confirm another customer cannot read/edit another profile, order, avatar folder, or admin page, including direct API attempts.
- As admin, search/page customer records. Delete an unused customer with explicit confirmation; admins, self, and accounts with orders cannot be deleted.
- Confirm errors stay understandable during a Supabase outage and no private environment values appear in browser source/network responses.

## Current boundaries

Existing login sessions and PHP session carts are not part of the database import. Fresh login is required. Live data must be exported from the actual source database; the checked-in backup lacks some profile fields. This build contains no real payment processing, delivery integration, or product-editing dashboard. Live authentication/email/storage integration requires your Supabase project and cannot be verified from the public-only local preview.
