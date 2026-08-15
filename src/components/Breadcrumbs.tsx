import { Link } from "@tanstack/react-router";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-foreground/80">{it.name}</span>
            ) : (
              <Link to={it.path} className="hover:text-primary">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
