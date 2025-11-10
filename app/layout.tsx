import type { Metadata } from "next";
import { Poppins, Cairo } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-cairo",
});

const SITE_URL = process.env.NEXTAUTH_URL || "https://valideria.com";

export const metadata: Metadata = {
  title: {
    template: `FORMA`,
    default: `FORMA`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SITE_URL),

  // Keywords for SEO
  keywords: [
    "صيدلية إلكترونية",
    "أدوية أونلاين",
    "مستحضرات تجميل",
    "منتجات صحية",
    "صيدليات متعددة", 
    "توصيل أدوية",
    "pharmacy online",
    "medicines delivery",
    "healthcare products",
    "cosmetics online",
    "valideria",
    "الشرق الأوسط",
    "مصر",
    "دواء",
    "علاج",
    "صحة",
  ],

  // Authors
  authors: [{ name: "Valideria Team" }, { name: "Healthcare Specialists" }],

  // Creator
  creator: "Valideria",
  publisher: "Valideria Healthcare Platform",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} - الصيدلية الإلكترونية الرائدة في الشرق الأوسط`,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [
      {
        url: `${SITE_URL}/images/logos/Logo.svg`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Online Pharmacy Platform`,
        type: "image/jpeg",
      },
      {
        url: `${SITE_URL}/images/logos/Logo.svg`,
        width: 800,
        height: 800,
        alt: `${APP_NAME} Logo`,
        type: "image/jpeg",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@valideria",
    creator: "@valideria",
    title: `${APP_NAME} - الصيدلية الإلكترونية الرائدة`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/images/logos/Logo.svg`,
        alt: `${APP_NAME} - Online Pharmacy`,
      },
    ],
  },

  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },

  // Additional metadata
  category: "Health & Medical",
  classification: "Healthcare Platform",

  // Manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "96x96", type: "image/x-icon" },
    ],
    // apple: [
    //   { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    // ],
    // other: [
    //   { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0f766e" },
    // ],
  },

  // Other
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ar-EG": `${SITE_URL}`,
      "en-US": `${SITE_URL}/en`,
      "se-US": `${SITE_URL}/se`,
      "gt-US": `${SITE_URL}/gt`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={` ${poppins.className} ${cairo.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
