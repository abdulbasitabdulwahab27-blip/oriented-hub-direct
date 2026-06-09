import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "oh_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) return prev.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { id: p.id, name: p.name, slug: p.slug, category: p.category, image: p.image, quantity: qty }];
    });
  };
  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const setQty: CartCtx["setQty"] = (id, qty) => setItems((p) => p.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, count, add, remove, setQty, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
