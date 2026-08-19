import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingCart, X, Search, Shield, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCurrentUser } from "@/lib/auth-hook";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/order", label: "Order" },
  { to: "/track", label: "Track" },
  { to: "/sales-rep", label: "Sales Rep" },
  
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const supplyNav = [
  { to: "/medical-equipment-supplier", label: "Medical Equipment Supplier" },
  { to: "/laboratory-equipment-supplier", label: "Laboratory Equipment Supplier" },
  { to: "/hospital-consumables-and-stationeries", label: "Hospital Consumables and Stationeries" },
  { to: "/medical-textbooks-supplier", label: "Medical Textbooks Supplier" },
  { to: "/nuc-accreditation-textbooks-supplier", label: "NUC Accreditation Textbooks Supplier" },
  { to: "/international-book-seller", label: "International Book Seller" },
] as const;

const categoryNav = [
  { to: "/books", label: "Academic Books" },
  { to: "/medical-equipment", label: "Medical Equipment" },
  { to: "/laboratory-equipment", label: "Laboratory Equipment" },
  { to: "/hospital-consumables", label: "Hospital Consumables" },
  { to: "/educational-materials", label: "Educational Materials" },
  { to: "/business-solutions", label: "Business Solutions" },
  { to: "/delivery-information", label: "Delivery Information" },
  { to: "/blog", label: "Blog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { isAdmin } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="bg-gradient-primary text-primary-foreground text-xs">
        <div className="container-page flex h-8 items-center justify-between">
          <span className="hidden sm:inline">Nationwide delivery across Nigeria · Worldwide shipping available · Institutional procurement supported</span>
          <span className="sm:hidden">Nationwide & worldwide delivery · Bulk orders</span>
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
          <div className="relative group">
            <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Categories <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute right-0 top-full z-50 w-64 rounded-md border border-border bg-background p-2 shadow-elevated">
              {categoryNav.map((n) => (
                <Link key={n.to} to={n.to} activeProps={{ className: "text-primary" }} className="block rounded px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative group">
            <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Supplies <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute right-0 top-full z-50 w-72 rounded-md border border-border bg-background p-2 shadow-elevated">
              {categoryNav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-sm font-medium border-b border-border/50">
                {n.label}
              </Link>
            ))}
            {supplyNav.map((n) => (
                <Link key={n.to} to={n.to} activeProps={{ className: "text-primary" }} className="block rounded px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="hidden sm:inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground" aria-label="Admin dashboard">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
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
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-sm font-medium border-b border-border/50">
                {n.label}
              </Link>
            ))}
            {supplyNav.map((n) => (
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
