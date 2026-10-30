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
      name: `Cart, ${quantity} items`,
      exact: true,
    }),
  ).toBeVisible();
}

test("home leads to a searchable collector’s dictionary and real character details", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Latest News",
  );
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Collections", exact: true })
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
    .getByRole("link", { name: "Collections", exact: true })
    .first()
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
  await page.getByRole("checkbox", { name: "Figurines", exact: true }).check();
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
  await page.getByRole("link", { name: "Cart, 2 items", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?next=%2Fcart$/);
  await page.goto("/cart");
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

test("news is newest first, links to official articles, and About follows it", async ({
  page,
}) => {
  await page.goto("/");
  const announcements = JSON.parse(
    readFileSync(new URL("../src/data/news.json", import.meta.url), "utf8"),
  ) as { title: string; publishedAt: string; href: string }[];
  announcements.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  await expect(page.locator(".news-slide h2")).toHaveText(
    announcements.map((item) => item.title),
  );
  await expect(page.locator(".news-slide a").first()).toHaveAttribute(
    "href",
    announcements[0].href,
  );
  expect(
    await page
      .locator("main > div > section")
      .evaluateAll((sections) =>
        sections
          .slice(0, 2)
          .map((section) => section.getAttribute("aria-labelledby")),
      ),
  ).toEqual(["news-title", "about-preview-title"]);
  await expect(
    page.getByText("LITTLE CREATURES. EVERYDAY JOY.", { exact: true }),
  ).toHaveCount(0);
  const header = page.getByRole("banner");
  await expect(
    header.getByRole("link", { name: "Sign Up", exact: true }),
  ).toHaveAttribute("href", "/register");
  await expect(
    header.getByRole("link", { name: "Log In", exact: true }),
  ).toHaveAttribute("href", "/login");
  await header
    .getByRole("link", { name: "Cart, 0 items", exact: true })
    .click();
  await expect(page).toHaveURL(/\/login\?next=%2Fcart$/);
});

test("category checkboxes combine, survive reload, and reset pagination", async ({
  page,
}) => {
  await page.goto("/shop?page=4");
  await page.getByRole("checkbox", { name: "Sticker", exact: true }).check();
  await expect
    .poll(() => new URL(page.url()).searchParams.has("page"))
    .toBe(false);
  await expect(page.locator("main article h3")).toHaveCount(6);
  await expect(page.locator("main article h3")).toHaveText(
    products
      .filter((product) => product.name.includes("Sticker"))
      .sort((a, b) => b.id - a.id)
      .map((product) => product.name),
  );
  await page.getByRole("checkbox", { name: "Hippers", exact: true }).check();
  await expect(page.locator("main article h3")).toHaveCount(7);
  await expect
    .poll(() => new URL(page.url()).searchParams.getAll("category"))
    .toEqual(["Sticker", "Hippers"]);
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Sticker", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Hippers", exact: true }),
  ).toBeChecked();
  await page.getByRole("checkbox", { name: "Sticker", exact: true }).uncheck();
  await expect(page.locator("main article h3")).toHaveText([
    "SMISKI Hippers Series",
  ]);
});

test("collection secrets are centered and shopping stays scoped to each series", async ({
  page,
}) => {
  for (const slug of ["birthday", "hippers", "strap1", "moving", "yoga"]) {
    await page.goto("/catalog/" + slug);
    await expect(
      page.getByRole("heading", {
        name: "Meet the Little Characters",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".character-grid > article")).toHaveCount(7);
    const secret = page.locator(".secret-character");
    await expect(secret).toHaveText("?");
    const bounds = await page.locator(".character-grid").boundingBox();
    const secretBounds = await secret.boundingBox();
    expect(
      Math.abs(
        secretBounds!.x +
          secretBounds!.width / 2 -
          bounds!.x -
          bounds!.width / 2,
      ),
    ).toBeLessThan(2);
    await page
      .getByRole("link", { name: "Explore the Shop", exact: true })
      .click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("series"))
      .toBe(slug);
    const expected =
      slug === "birthday"
        ? "SMISKI Birthday Series"
        : slug === "hippers"
          ? "SMISKI Hippers Series"
          : slug === "moving"
            ? "SMISKI Moving Series"
            : slug === "yoga"
              ? "SMISKI Yoga Series"
              : "SMISKI Strap Accessories Series 1";
    await expect(page.locator("main article h3")).toHaveText([expected]);
  }
  await page.goto("/catalog/toothbrush");
  await expect(page.locator(".secret-character")).toHaveCount(0);
});

test("collections carousel works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const carousel = page.locator(".collections-carousel");
  await expect(carousel.locator(".profile-card")).toHaveCount(6);
  await expect(carousel).toHaveCSS("scroll-snap-type", "x mandatory");
  await carousel.scrollIntoViewIfNeeded();
  const initial = await carousel.evaluate((element) => element.scrollLeft);
  await carousel.focus();
  await carousel.hover();
  await page.mouse.wheel(600, 0);
  await expect
    .poll(() => carousel.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(initial);
  await carousel.locator('a[href="/catalog/work"]').click();
  await expect(page).toHaveURL(/\/catalog\/work$/);
  await context.close();
});

test("images resist dragging while product links stay clickable and square", async ({
  page,
}) => {
  await page.goto("/shop");
  const image = page.locator("main article img").first();
  await expect(image).toHaveAttribute("draggable", "false");
  await expect(image).toHaveCSS("pointer-events", "none");
  await expect(image).toHaveCSS("user-select", "none");
  const container = page.locator(".store-card-image").first();
  const bounds = await container.boundingBox();
  expect(Math.abs(bounds!.width - bounds!.height)).toBeLessThan(2);
  expect(
    await container.evaluate(
      (element) =>
        !element.dispatchEvent(
          new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
        ),
    ),
  ).toBe(true);
  const card = page.locator("main article").first();
  await card.hover();
  await expect(card).not.toHaveCSS("box-shadow", "none");
  await card.getByRole("link").click();
  await expect(page).toHaveURL(/\/shop\/\d+$/);
});

test("About photos fill the screen and its story controls reach every slide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about", { waitUntil: "networkidle" });
  const carousel = page.getByRole("region", { name: "About SMISKI stories" });
  const track = carousel.locator(".about-story-track");
  const slides = carousel.locator(".about-story-panel");
  await expect(slides).toHaveCount(4);
  await expect(track).toHaveCSS("scroll-snap-type", "x mandatory");
  await expect(slides.first().locator("img")).toHaveCSS("object-fit", "cover");
  expect(
    await slides.locator("img").evaluateAll((images) =>
      images.map((image) => image.getAttribute("src")),
    ),
  ).toEqual([
    "/uploads/about01.png",
    "/uploads/about02.png",
    "/uploads/about03.gif",
    "/uploads/about04.png",
  ]);
  const heights = await page.evaluate(() => ({
    viewport: window.innerHeight,
    header: document.querySelector("header")!.getBoundingClientRect().height,
    slide: document.querySelector(".about-story-panel")!.getBoundingClientRect()
      .height,
  }));
  expect(Math.abs(heights.slide - (heights.viewport - heights.header))).toBeLessThan(2);

  await carousel.getByRole("button", { name: "Next story" }).click();
  await expect
    .poll(() => track.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(300);
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => track.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(700);
  await carousel
    .getByRole("button", { name: "Show Which little personality feels like you?" })
    .click();
  await expect
    .poll(() => track.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(1100);
  await carousel.getByRole("link", { name: "Meet the collections" }).click();
  await expect(page).toHaveURL(/\/catalog$/);
});
