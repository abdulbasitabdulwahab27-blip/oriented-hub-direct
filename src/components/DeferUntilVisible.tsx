import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children only once the placeholder scrolls near the viewport.
 * Keeps heavy below-the-fold sections (images, forms) off the critical path on mobile.
 */
export function DeferUntilVisible({
  children,
  minHeight = 600,
  rootMargin = "400px",
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  if (show) return <>{children}</>;
  return <div ref={ref} style={{ minHeight }} aria-hidden />;
}
