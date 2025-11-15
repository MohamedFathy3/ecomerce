import { APP_NAME } from "@/lib/constants";

const SITE_URL = process.env.NEXTAUTH_URL || "https://forma.com";

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  alternateName: "Forma Online Store",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logos/forma-logo.png`,
  description:
    "Leading multi-vendor online marketplace for various products in the Middle East",
  foundingDate: "2023",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+20-123-456-7890",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      areaServed: "EG",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Main Street",
    addressLocality: "Cairo",
    addressRegion: "Cairo Governorate",
    postalCode: "11511",
    addressCountry: "EG",
  },
  sameAs: [
    "https://www.facebook.com/forma",
    "https://www.twitter.com/forma",
    "https://www.instagram.com/forma",
    "https://www.linkedin.com/company/forma",
  ],
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: SITE_URL,
  description:
    "Online store platform offering various products with fast delivery across the Middle East",
  publisher: {
    "@type": "Organization",
    name: APP_NAME,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?keyword={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "ar-EG",
  copyrightYear: "2024",
  copyrightHolder: {
    "@type": "Organization",
    name: APP_NAME,
  },
};

// Store Schema
export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: APP_NAME,
  url: SITE_URL,
  description:
    "Online store offering a wide range of products including electronics, clothing, and more",
  serviceType: "Online Retail",
  areaServed: {
    "@type": "Country",
    name: "Egypt",
  },
  availableService: [
    {
      "@type": "Service",
      name: "Product Delivery",
      description: "Fast and reliable product delivery service",
    },
    {
      "@type": "Service",
      name: "Customer Support",
      description: "24/7 support for any queries and assistance",
    },
  ],
};

// Product Schema Generator
export function generateProductSchema(product: {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  brand: string;
  category: string;
  availability?: string;
  offer?: {
    price_after: number;
    discount_percentage: number;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: `PROD-${product.id}`,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    image: product.image
      ? `${SITE_URL}${product.image}`
      : `${SITE_URL}/images/logo.png`,
    url: `${SITE_URL}/product/${product.id}`,
    offers: {
      "@type": "Offer",
      price: product.offer?.price_after || product.price,
      priceCurrency: "EGP",
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: APP_NAME,
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
      },
    },
    ...(product.offer && {
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: product.offer.price_after,
        priceCurrency: "EGP",
      },
    }),
  };
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${SITE_URL}${item.url}` }),
    })),
  };
}

// FAQ Schema Generator
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Review Schema Generator
export function generateReviewSchema(
  reviews: Array<{
    rating: number;
    comment: string;
    author: string;
    date: string;
  }>
) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.comment,
    author: {
      "@type": "Person",
      name: review.author,
    },
    datePublished: review.date,
  }));
}
