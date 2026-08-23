type Variant = { src: string; width: number };

/**
 * Responsive <picture> with AVIF -> WebP -> original fallback.
 * Mobile downloads the smallest variant that satisfies `sizes`.
 */
export function ResponsiveImage({
  avif = [],
  webp = [],
  fallback,
  alt,
  width,
  height,
  sizes = "100vw",
  priority = false,
  className,
}: {
  avif?: Variant[];
  webp?: Variant[];
  fallback: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const set = (v: Variant[]) => v.map((x) => `${x.src} ${x.width}w`).join(", ");
  return (
    <picture>
      {avif.length > 0 && <source type="image/avif" srcSet={set(avif)} sizes={sizes} />}
      {webp.length > 0 && <source type="image/webp" srcSet={set(webp)} sizes={sizes} />}
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
