import { Metadata } from "next";
import StructuredData from "./StructuredData";

interface SEOHeadProps {
  canonicalUrl?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
  children?: React.ReactNode;
}

export function SEOHead({
  canonicalUrl,
  structuredData,
  noIndex = false,
  children,
}: SEOHeadProps) {
  return (
    <>
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* No Index Meta Tag */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data */}
      {structuredData && <StructuredData data={structuredData} />}

      {/* Additional SEO elements */}
      {children}
    </>
  );
}

// Helper function to create complete metadata object
export function createSEOMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  structuredData,
  noIndex = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
}): Metadata {
  const siteUrl = process.env.NEXTAUTH_URL || "https://formashop.nl/";
  const fullTitle = title.includes("forma")
    ? title
    : `${title} | forma - forma  `;
  const fullImage = ogImage || `${siteUrl}/images/logos/logos.png`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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

    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: canonicalUrl || siteUrl,
      siteName: "forma",
      locale: "ar_EG",
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@forma",
      creator: "@forma",
      title: fullTitle,
      description,
      images: [fullImage],
    },

    alternates: {
      canonical: canonicalUrl,
    },

    other: structuredData
      ? {
          "structured-data": JSON.stringify(structuredData),
        }
      : undefined,
  };
}

export default SEOHead;
