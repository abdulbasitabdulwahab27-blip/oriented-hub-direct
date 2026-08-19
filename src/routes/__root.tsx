import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartProvider } from "@/lib/cart";
import { GEO, GOOGLE_MAPS_PLACE_URL, localBusinessSchema } from "@/lib/local-seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Oriented Hub — Quality Products. Better Care. Total Solutions." },
      { name: "description", content: "Nigeria's premium procurement platform for books, medical equipment, laboratory equipment, hospital consumables and educational materials." },
      { name: "author", content: "Oriented Hub" },
      { name: "geo.region", content: "NG-OS" },
      { name: "geo.placename", content: "Osogbo, Osun State, Nigeria" },
      { name: "geo.position", content: `${GEO.latitude};${GEO.longitude}` },
      { name: "ICBM", content: `${GEO.latitude}, ${GEO.longitude}` },
      { property: "og:title", content: "Oriented Hub — Quality Products. Better Care. Total Solutions." },
      { property: "og:description", content: "Nigeria's premium procurement platform for books, medical equipment, laboratory equipment, hospital consumables and educational materials." },
      { property: "og:type", content: "website" },
      { name: "google-site-verification", content: "9GA-6YkFI2lSzCaBfVTMxhwGD9TI2bIOd6IDvpjnAEY" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Oriented Hub — Quality Products. Better Care. Total Solutions." },
      { name: "twitter:description", content: "Nigeria's premium procurement platform for books, medical equipment, laboratory equipment, hospital consumables and educational materials." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/56d820a8-2eeb-4158-a890-0bc2cf676626/id-preview-96cb75ea--e5a314ac-7446-4809-b973-83a22b0cafb3.lovable.app-1781035425592.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/56d820a8-2eeb-4158-a890-0bc2cf676626/id-preview-96cb75ea--e5a314ac-7446-4809-b973-83a22b0cafb3.lovable.app-1781035425592.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", href: "/fonts/Inter-400-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/PlayfairDisplay-600-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.theorientedhub.com/#organization",
              name: "Oriented Hub",
              alternateName: ["The Oriented Hub", "Oriented Hub Nigeria"],
              url: "https://www.theorientedhub.com",
              logo: "https://www.theorientedhub.com/favicon.ico",
              email: "Orientedbanque@outlook.com",
              telephone: ["+2348136548965", "+2349064007879", "+447587869499"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "15, Oke-Fia Street, Opposite Zenith Bank",
                addressLocality: "Osogbo",
                addressCountry: "NG",
              },
              sameAs: [GOOGLE_MAPS_PLACE_URL],
            },
            {
              ...localBusinessSchema,
              "@context": undefined,
            },
            {
              "@type": "WebSite",
              "@id": "https://www.theorientedhub.com/#website",
              url: "https://www.theorientedhub.com",
              name: "Oriented Hub",
              publisher: { "@id": "https://www.theorientedhub.com/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.theorientedhub.com/shop?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
        <WhatsAppFab />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}
