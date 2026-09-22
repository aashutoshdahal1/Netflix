import "./globals.css";
import Script from "next/script";

export const viewport = {
  themeColor: "#e50914",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fmovies.in.net"),
  title: {
    default: "Watchio - Movie Reviews, Cast Info & Entertainment Guide | fmovies.in.net",
    template: "%s | Watchio",
  },
  description:
    "Discover movies and TV shows on Watchio. Read comprehensive reviews, explore cast information, find recommendations, and get detailed analysis of your favorite entertainment.",
  keywords: ["movie reviews", "TV show reviews", "cast information", "entertainment guide", "Watchio", "fmovies"],
  authors: [{ name: "Watchio" }],
  creator: "Watchio",
  openGraph: {
    type: "website",
    siteName: "Watchio",
    images: [{ url: "/watchio-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/watchio-logo.png"],
  },
  icons: {
    icon: "/watchio-logo.png",
    apple: "/watchio-logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Watchio",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Watchio",
  alternateName: "fmovies.in.net",
  url: "https://fmovies.in.net",
  description: "Movie reviews, cast information, and entertainment recommendations",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fmovies.in.net/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Watchio",
  url: "https://fmovies.in.net",
  logo: "https://fmovies.in.net/watchio-logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "fmovieshelp@gmail.com",
    contactType: "Customer Support",
  },
  sameAs: ["https://www.youtube.com/@Aashucode"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script src="/anti-devtools.js" strategy="afterInteractive" />
      </head>
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
