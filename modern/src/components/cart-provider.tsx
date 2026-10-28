"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { clampQuantity, parseCart, type CartLine } from "@/lib/cart";

type CartContextValue = {
  items: CartLine[];
  count: number;
  ready: boolean;
  addItem: (productId: number, quantity: number, stock: number) => void;
  setQuantity: (productId: number, quantity: number, stock: number) => void;
  selectItem: (productId: number, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  removeItem: (productId: number) => void;
  clearItems: (productIds: number[]) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const memoryStore = new Map<string, string>();
const changeEvent = "smiskisite-cart-change";
const emptySnapshot = () => "";
const serverReady = () => false;
const clientReady = () => true;
const subscribeReady = () => () => {};

export function CartProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const storageKey = `smiskisite:cart:${userId ?? "guest"}`;
  useEffect(() => {
    if (!userId) return;
    try {
      const guest = parseCart(localStorage.getItem("smiskisite:cart:guest"));
      if (!guest.length) return;
      const owned = parseCart(localStorage.getItem(storageKey));
      const merged = [...owned];
      for (const line of guest) {
        const match = merged.find((item) => item.productId === line.productId);
        if (match)
          match.quantity = Math.min(99, match.quantity + line.quantity);
        else if (merged.length < 50) merged.push(line);
      }
      localStorage.setItem(storageKey, JSON.stringify(merged));
      localStorage.removeItem("smiskisite:cart:guest");
      window.dispatchEvent(new Event(changeEvent));
    } catch {
      /* A blocked storage provider leaves the existing bag untouched. */
    }
  }, [userId, storageKey]);
  const subscribe = useCallback((listener: () => void) => {
    window.addEventListener("storage", listener);
    window.addEventListener(changeEvent, listener);
    return () => {
      window.removeEventListener("storage", listener);
      window.removeEventListener(changeEvent, listener);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    if (memoryStore.has(storageKey)) return memoryStore.get(storageKey)!;
    try {
      return localStorage.getItem(storageKey) ?? "";
    } catch {
      return memoryStore.get(storageKey) ?? "";
    }
  }, [storageKey]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, emptySnapshot);
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const items = useMemo(() => parseCart(raw), [raw]);
  const update = useCallback(
    (transform: (current: CartLine[]) => CartLine[]) => {
      const updated = JSON.stringify(transform(parseCart(getSnapshot())));
      try {
        localStorage.setItem(storageKey, updated);
        memoryStore.delete(storageKey);
      } catch {
        memoryStore.set(storageKey, updated);
      }
      window.dispatchEvent(new Event(changeEvent));
    },
    [getSnapshot, storageKey],
  );
  const value: CartContextValue = {
    items,
    ready,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (productId, quantity, stock) =>
      update((current) => {
        if (stock <= 0) return current;
        const existing = current.find((item) => item.productId === productId);
        if (existing)
          return current.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: clampQuantity(item.quantity + quantity, stock),
                  selected: true,
                }
              : item,
          );
        return current.length < 50
          ? [
              ...current,
              {
                productId,
                quantity: clampQuantity(quantity, stock),
                selected: true,
              },
            ]
          : current;
      }),
    setQuantity: (productId, quantity, stock) =>
      update((current) =>
        current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: clampQuantity(quantity, stock) }
            : item,
        ),
      ),
    selectItem: (productId, selected) =>
      update((current) =>
        current.map((item) =>
          item.productId === productId ? { ...item, selected } : item,
        ),
      ),
    selectAll: (selected) =>
      update((current) => current.map((item) => ({ ...item, selected }))),
    removeItem: (productId) =>
      update((current) =>
        current.filter((item) => item.productId !== productId),
      ),
    clearItems: (productIds) =>
      update((current) =>
        current.filter((item) => !productIds.includes(item.productId)),
      ),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("Cart must be used inside CartProvider");
  return context;
}
