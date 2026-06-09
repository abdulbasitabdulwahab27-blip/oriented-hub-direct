import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Oriented Hub" }, { name: "description", content: "Review the items in your cart and proceed to checkout." }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, count } = useCart();

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">Your Cart</h1>
      <p className="mt-1 text-muted-foreground">{count > 0 ? `${count} item${count > 1 ? "s" : ""} ready for procurement` : "Your cart is empty."}</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Browse our catalogue and add items to your cart.</p>
          <Link to="/shop" className="mt-5 inline-flex rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft">Start Shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 p-4">
                <img src={it.image} alt={it.name} width={96} height={96} className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <Link to="/product/$id" params={{ id: it.slug }} className="font-semibold hover:text-primary line-clamp-2">{it.name}</Link>
                  <div className="text-xs text-muted-foreground capitalize">{it.category.replace("-", " ")}</div>
                  <div className="text-sm font-semibold text-primary mt-1">Price on Request</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-input">
                      <button onClick={() => setQty(it.id, it.quantity - 1)} className="p-2 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                      <button onClick={() => setQty(it.id, it.quantity + 1)} className="p-2 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => remove(it.id)} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-xl border border-border bg-card p-6 shadow-card h-fit">
            <h2 className="font-display text-lg font-semibold">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd className="font-semibold">{count}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold text-primary">On Request</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Final pricing confirmed at checkout via WhatsApp based on availability and delivery details.</p>
            <Link to="/checkout" className="mt-5 w-full inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">Proceed to Checkout</Link>
            <Link to="/shop" className="mt-2 w-full inline-flex items-center justify-center text-sm text-muted-foreground hover:text-primary">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
