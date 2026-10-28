export type CartLine = {
  productId: number;
  quantity: number;
  selected: boolean;
};
export const MAX_QUANTITY = 99;

export function parseCart(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const ids = new Set<number>();
    return parsed
      .filter((item): item is CartLine => {
        if (!item || typeof item !== "object") return false;
        const line = item as Record<string, unknown>;
        if (
          !Number.isSafeInteger(line.productId) ||
          Number(line.productId) <= 0 ||
          !Number.isInteger(line.quantity) ||
          Number(line.quantity) < 1 ||
          Number(line.quantity) > MAX_QUANTITY ||
          ids.has(Number(line.productId))
        )
          return false;
        ids.add(Number(line.productId));
        return true;
      })
      .slice(0, 50)
      .map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        selected: line.selected !== false,
      }));
  } catch {
    return [];
  }
}

export function clampQuantity(quantity: number, stock: number) {
  return Math.max(
    1,
    Math.min(
      Math.trunc(quantity) || 1,
      MAX_QUANTITY,
      Math.max(1, Math.trunc(stock)),
    ),
  );
}
