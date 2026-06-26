import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingCart, X, Search, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCurrentUser } from "@/lib/auth-hook";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/sales-rep", label: "Sales Rep" },
  { to: "/plans", label: "Plans" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { isAdmin } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="bg-gradient-primary text-primary-foreground text-xs">
        <div className="container-page flex h-8 items-center justify-between">
          <span className="hidden sm:inline">Nationwide delivery across Nigeria · Institutional procurement supported</span>
          <span className="sm:hidden">Nationwide delivery · Bulk orders</span>
          <a href="mailto:Orientedbanque@outlook.com" className="hidden md:inline hover:underline">Orientedbanque@outlook.com</a>
        </div>
      </div>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground font-bold shadow-soft">OH</div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Oriented Hub</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Quality · Care · Solutions</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "text-primary" }} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/shop" className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted" aria-label="Search shop">
            <Search className="h-4 w-4" />
          </Link>
          <Link to="/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-gold px-1 text-[10px] font-bold text-gold-foreground shadow-soft">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page flex flex-col py-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-sm font-medium border-b border-border/50 last:border-0">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
