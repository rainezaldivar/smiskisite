import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Product, Series } from "../src/lib/types";

const products = JSON.parse(
  readFileSync(new URL("../src/data/products.json", import.meta.url), "utf8"),
) as Product[];
const collections = JSON.parse(
  readFileSync(new URL("../src/data/series.json", import.meta.url), "utf8"),
) as Series[];

const availableProduct = products.find((product) => product.stock >= 3);
const soldOutProduct = products.find((product) => product.stock === 0);
const birthday = collections.find((collection) => collection.id === "birthday");

if (!availableProduct || !soldOutProduct || !birthday?.variations.length) {
  throw new Error(
    "Public QA needs the existing in-stock, sold-out, and Birthday Series records.",
  );
}

async function addExistingProduct(page: Page, quantity = 2) {
  await page.goto(`/shop/${availableProduct!.id}`);
  await expect(
    page.getByRole("heading", { name: availableProduct!.name, exact: true }),
  ).toBeVisible();
  await page.getByLabel("Quantity", { exact: true }).fill(String(quantity));
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Added to your bag", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: `Shopping bag, ${quantity} items`,
      exact: true,
    }),
  ).toBeVisible();
}

test("home leads to a searchable collector’s dictionary and real character details", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Small creatures.",
  );
  await page
    .getByRole("link", { name: "The collector’s dictionary", exact: true })
    .click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByLabel("Search collections and characters").fill("Birthday");
  await expect(page.getByRole("status")).toHaveText("1 collection to discover");
  await page.locator('a[href="/catalog/birthday"]').click();
  await expect(
    page.getByRole("heading", { level: 1, name: birthday!.name, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: birthday!.variations[0].name,
      exact: true,
    }),
  ).toBeVisible();
  const collectionImage = page.getByRole("img", {
    name: birthday!.name,
    exact: true,
  });
  await expect
    .poll(() =>
      collectionImage.evaluate(
        (image) => (image as HTMLImageElement).naturalWidth,
      ),
    )
    .toBeGreaterThan(0);

  await page
    .getByRole("link", { name: "Back to the dictionary", exact: true })
    .click();
  await page.getByRole("button", { name: "Accessories", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Accessories", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const accessoryCount = collections.filter(
    (entry) => entry.group === "accessories",
  ).length;
  await expect(page.getByRole("status")).toHaveText(
    `${accessoryCount} collections to discover`,
  );
});

test("shop category and price filters show the actual matching products", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: "Figurines", exact: true }).click();
  await expect(page).toHaveURL(/category=Figurines/);
  await page.getByLabel("Sort products").selectOption("price_asc");
  await expect(page).toHaveURL(/sort=price_asc/);
  const expectedNames = products
    .filter((product) => product.category === "Figurines")
    .sort((a, b) => a.price - b.price || b.id - a.id)
    .slice(0, 12)
    .map((product) => product.name);
  await expect(page.locator("main article h3")).toHaveText(expectedNames);

  await page.getByLabel("Search products").fill("no-smiski-match-qa");
  await expect(
    page.getByRole("heading", { name: "No companions found.", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator("main article")).toHaveCount(
    Math.min(12, products.length),
  );
});

test("bag quantities and selection persist after reload, and removing an item empties the bag", async ({
  page,
}) => {
  await addExistingProduct(page);
  await page
    .getByRole("link", { name: "Shopping bag, 2 items", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cart$/);
  const row = page.getByRole("article").filter({
    has: page.getByRole("heading", {
      name: availableProduct!.name,
      exact: true,
    }),
  });
  await expect(row.getByLabel("Quantity", { exact: true })).toHaveText("2");

  await page.reload();
  await expect(row.getByLabel("Quantity", { exact: true })).toHaveText("2");
  await row
    .getByRole("checkbox", {
      name: `Select ${availableProduct!.name}`,
      exact: true,
    })
    .uncheck();
  await expect(
    page.getByRole("button", { name: "Select items to continue", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    row.getByRole("checkbox", {
      name: `Select ${availableProduct!.name}`,
      exact: true,
    }),
  ).not.toBeChecked();

  await page
    .getByRole("checkbox", { name: "Select all available items", exact: true })
    .check();
  await expect(
    row.getByRole("checkbox", {
      name: `Select ${availableProduct!.name}`,
      exact: true,
    }),
  ).toBeChecked();
  await row
    .getByRole("button", {
      name: `Increase ${availableProduct!.name} quantity`,
      exact: true,
    })
    .click();
  await expect(row.getByLabel("Quantity", { exact: true })).toHaveText("3");
  await row
    .getByRole("button", {
      name: `Decrease ${availableProduct!.name} quantity`,
      exact: true,
    })
    .click();
  await expect(row.getByLabel("Quantity", { exact: true })).toHaveText("2");
  await expect(
    page.getByRole("link", { name: "Continue to checkout", exact: true }),
  ).toBeVisible();

  await row
    .getByRole("button", {
      name: `Remove ${availableProduct!.name}`,
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Every collection starts somewhere.",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Every collection starts somewhere.",
      exact: true,
    }),
  ).toBeVisible();
});

test("a restored sold-out bag item can be deselected while available items continue to checkout", async ({
  page,
}) => {
  await page.goto("/cart");
  // Reproduce stock changing after a customer saved their bag, using real products.
  await page.evaluate(
    (lines) => {
      localStorage.setItem("smiskisite:cart:guest", JSON.stringify(lines));
    },
    [
      { productId: availableProduct!.id, quantity: 1, selected: true },
      { productId: soldOutProduct!.id, quantity: 1, selected: true },
    ],
  );
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Update quantities to continue",
      exact: true,
    }),
  ).toBeDisabled();
  const soldOutCheckbox = page.getByRole("checkbox", {
    name: `Select ${soldOutProduct!.name}`,
    exact: true,
  });
  await expect(soldOutCheckbox).toBeEnabled();
  await soldOutCheckbox.uncheck();
  await expect(
    page.getByRole("link", { name: "Continue to checkout", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(soldOutCheckbox).not.toBeChecked();
  await page
    .getByRole("link", { name: "Continue to checkout", exact: true })
    .click();
  await expect(
    page.getByText(availableProduct!.name, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(soldOutProduct!.name, { exact: true }),
  ).toHaveCount(0);
});

test("unconnected checkout displays the bag but prevents placing an order", async ({
  page,
}) => {
  await addExistingProduct(page);
  await page.goto("/cart");
  await page
    .getByRole("link", { name: "Continue to checkout", exact: true })
    .click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/Checkout isn.t available yet\./)).toBeVisible();
  await expect(
    page.getByText(availableProduct!.name, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Place demo order", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Place demo order", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("link", { name: "Back to your bag", exact: true })
    .click();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByLabel("Quantity", { exact: true })).toHaveText("2");
});

test("sold-out products cannot be added or bought", async ({ page }) => {
  await page.goto(`/shop/${soldOutProduct!.id}`);
  await expect(
    page.getByRole("heading", { name: soldOutProduct!.name, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sold out", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Buy now", exact: true }),
  ).toBeDisabled();
});

test("legacy URLs keep their destination and product/category context", async ({
  page,
}) => {
  const redirects = [
    { from: "/customer/home", to: "/" },
    {
      from: "/customer/shop?category=Figurines",
      to: "/shop",
      category: "Figurines",
    },
    {
      from: `/shop/product/${availableProduct!.id}`,
      to: `/shop/${availableProduct!.id}`,
    },
    {
      from: `/customer/product_details/${availableProduct!.id}`,
      to: `/shop/${availableProduct!.id}`,
    },
    { from: "/details?item=birthday", to: "/catalog/birthday" },
    { from: "/details?item=zipper", to: "/catalog/zipper-1" },
  ];
  for (const entry of redirects) {
    await page.goto(entry.from);
    await expect.poll(() => new URL(page.url()).pathname).toBe(entry.to);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (entry.category)
      expect(new URL(page.url()).searchParams.get("category")).toBe(
        entry.category,
      );
  }
});

for (const protectedPath of ["/profile", "/admin", "/reset-password"]) {
  test(`unauthenticated ${protectedPath} redirects to sign-in without exposing account content`, async ({
    page,
  }) => {
    await page.goto(protectedPath);
    await expect.poll(() => new URL(page.url()).pathname).toBe("/login");
    expect(new URL(page.url()).searchParams.get("next")).toBe(protectedPath);
    await expect(
      page.getByRole("heading", {
        name: "Accounts are taking a little rest",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
  });
}

test("unconnected password recovery stays unavailable and rejects incomplete recovery links", async ({
  page,
}) => {
  await page.goto("/forgot-password");
  await expect(
    page.getByRole("heading", {
      name: "Password recovery is unavailable",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  for (const recoveryLink of [
    "/auth/callback?next=/reset-password",
    "/auth/confirm?type=recovery",
  ]) {
    await page.goto(recoveryLink);
    await expect
      .poll(() => new URL(page.url()).pathname)
      .toBe("/forgot-password");
    expect(new URL(page.url()).searchParams.get("error")).toBe("expired");
    await expect(
      page.getByRole("heading", {
        name: "Password recovery is unavailable",
        exact: true,
      }),
    ).toBeVisible();
  }
});

test.describe("mobile browsing", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("mobile menu navigates and public pages fit the viewport", async ({
    page,
  }) => {
    await page.goto("/");
    const openMenu = page.getByRole("button", {
      name: "Open menu",
      exact: true,
    });
    await openMenu.click();
    await expect(
      page.getByRole("button", { name: "Close menu", exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("navigation", { name: "Mobile navigation", exact: true })
      .getByRole("link", { name: "Shop", exact: true })
      .click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation", exact: true }),
    ).toHaveCount(0);

    for (const route of [
      "/",
      "/shop",
      `/shop/${availableProduct!.id}`,
      "/catalog",
      "/catalog/birthday",
      "/about",
      "/cart",
      "/checkout",
      "/login",
      "/forgot-password",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const widths = await page.evaluate(() => ({
        page: Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        ),
        viewport: document.documentElement.clientWidth,
      }));
      expect(
        widths.page,
        `${route} must fit the mobile viewport`,
      ).toBeLessThanOrEqual(widths.viewport + 1);
    }
  });
});
