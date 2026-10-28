import test from "node:test";
import assert from "node:assert/strict";
import { parseCart, clampQuantity } from "../src/lib/cart.ts";

test("bag data rejects corrupt, oversized, duplicate and non-integer quantities", () => {
  assert.deepEqual(parseCart("not json"), []);
  assert.deepEqual(parseCart("{}"), []);
  const parsed = parseCart(
    JSON.stringify([
      { productId: 1, quantity: 2, selected: false },
      { productId: 1, quantity: 3 },
      { productId: -1, quantity: 1 },
      { productId: 2, quantity: 100 },
      { productId: 3, quantity: 1.5 },
      { productId: 4, quantity: 3, selected: true, price: 1 },
    ]),
  );
  assert.deepEqual(parsed, [
    { productId: 1, quantity: 2, selected: false },
    { productId: 4, quantity: 3, selected: true },
  ]);
  assert.equal(
    parseCart(
      JSON.stringify(
        Array.from({ length: 80 }, (_, index) => ({
          productId: index + 1,
          quantity: 1,
        })),
      ),
    ).length,
    50,
  );
});

test("quantities respect stock and the order limit", () => {
  assert.equal(clampQuantity(500, 3), 3);
  assert.equal(clampQuantity(500, 500), 99);
  assert.equal(clampQuantity(-2, 10), 1);
  assert.equal(clampQuantity(3.9, 10), 3);
  assert.equal(clampQuantity(Number.NaN, 10), 1);
});
