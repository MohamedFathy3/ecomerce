import { Metadata } from "next";
import { APP_NAME } from "./constants";

const SITE_URL = process.env.NEXTAUTH_URL || "https://valideria.com";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  path?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image,
  path = "",
  type = "website",
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${APP_NAME} -    FORMA`;
  const url = `${SITE_URL}${path}`;
  const fullImage = image
    ? `${SITE_URL}${image}`
    : `${SITE_URL}/images/logos/logo.png`;

  // Base keywords for all pages
  const baseKeywords = [
"body casting",
"hand casting kit",
"3D hand sculpture",
"fingerprint jewelry",
"custom jewelry",
"personalized gifts",
"custom gifts online",
"memorial jewelry",
"keepsake gifts",
"3D body molds",
"silicone molding",
"medical grade silicone",
"German silicone",
"silicone wholesale",
"silicone retail",
"silicone for artists",
"silicone for medical use",
"3D art materials",
"online gift shop",
"personalized jewelry",
"baby hand casting",
"couples gifts",
"FORMA gifts",
"custom mold making",
"handprint jewelry",
"creative gifts",

"body casting",
"handafdruk 3D",
"vingerafdruk sieraden",
"gepersonaliseerde cadeaus",
"persoonlijke sieraden",
"3D handbeeld",
"siliconen mal",
"medische siliconen",
"Duitse siliconen",
"siliconen groothandel",
"siliconen detailhandel",
"siliconen voor kunstenaars",
"siliconen voor medisch gebruik",
"cadeauwinkel online",
"maatwerk cadeaus",
"herinneringssieraden",
"baby handafdruk",
"FORMA cadeaus",
"custom molds",

"Body Casting",
"Handabdruck 3D",
"Fingerabdruck Schmuck",
"personalisierte Geschenke",
"maßgeschneiderter Schmuck",
"3D Hand Skulptur",
"Silikonformen",
"medizinisches Silikon",
"deutsches Silikon",
"Silikon Großhandel",
"Silikon Einzelhandel",
"Silikon für Künstler",
"Silikon für medizinische Zwecke",
"online Geschenkeshop",
"Erinnerungsschmuck",
"Baby Handabdruck",
"FORMA Shop",
"3D Modellierung",

"body casting",
"empreinte de main 3D",
"bijoux empreinte digitale",
"cadeaux personnalisés",
"bijoux personnalisés",
"sculpture main 3D",
"moulage en silicone",
"silicone médical",
"silicone allemand",
"silicone en gros",
"silicone au détail",
"silicone pour artistes",
"silicone médical",
"boutique de cadeaux en ligne",
"cadeaux sur mesure",
"bijoux commémoratifs",
"empreinte bébé",
"FORMA cadeaux",
"moulage personnalisé"
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords],

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
      type,
      siteName: APP_NAME,
      title: fullTitle,
      description,
      url,
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
      site: "@FORMA",
      creator: "@FORMA",
      title: fullTitle,
      description,
      images: [fullImage],
    },

    alternates: {
      canonical: url,
    },
  };
}

// Pre-configured SEO for common pages
export const homeSEO_EN = generateSEO({
  title: "Home Page",
  description:
    "FORMA – the premier destination for body casting, personalized gifts, and custom jewelry. We provide certified medical-grade silicone for artists and the medical sector, offering wholesale and retail options with innovative mould-making solutions.",
  keywords: [
"body casting", "life casting", "personalized gifts", "custom jewelry", "medical-grade silicone", "silicone moulds", "silicone for artists", "mould making, FORMA",

"body casting", "life casting", "persoonlijke cadeaus", "gepersonaliseerde sieraden", "medische siliconen", "siliconen mallen", "siliconen voor kunstenaars", "mallen maken", "FORMA",

"Body Casting", "Life Casting", "personalisierte Geschenke", "individueller Schmuck", "medizinisches Silikon", "Silikonformen", "Silikon für Künstler", "Formenherstellung", "FORMA",


"body casting", "life casting", "cadeaux personnalisés", "bijoux sur mesure", "silicone médical", "moules en silicone", "silicone pour artistes", "fabrication de moules", "FORMA",
"body casting",
"hand casting kit",
"3D hand sculpture",
"fingerprint jewelry",
"custom jewelry",
"personalized gifts",
"custom gifts online",
"memorial jewelry",
"keepsake gifts",
"3D body molds",
"silicone molding",
"medical grade silicone",
"German silicone",
"silicone wholesale",
"silicone retail",
"silicone for artists",
"silicone for medical use",
"3D art materials",
"online gift shop",
"personalized jewelry",
"baby hand casting",
"couples gifts",
"FORMA gifts",
"custom mold making",
"handprint jewelry",
"creative gifts",

"body casting",
"handafdruk 3D",
"vingerafdruk sieraden",
"gepersonaliseerde cadeaus",
"persoonlijke sieraden",
"3D handbeeld",
"siliconen mal",
"medische siliconen",
"Duitse siliconen",
"siliconen groothandel",
"siliconen detailhandel",
"siliconen voor kunstenaars",
"siliconen voor medisch gebruik",
"cadeauwinkel online",
"maatwerk cadeaus",
"herinneringssieraden",
"baby handafdruk",
"FORMA cadeaus",
"custom molds",

"Body Casting",
"Handabdruck 3D",
"Fingerabdruck Schmuck",
"personalisierte Geschenke",
"maßgeschneiderter Schmuck",
"3D Hand Skulptur",
"Silikonformen",
"medizinisches Silikon",
"deutsches Silikon",
"Silikon Großhandel",
"Silikon Einzelhandel",
"Silikon für Künstler",
"Silikon für medizinische Zwecke",
"online Geschenkeshop",
"Erinnerungsschmuck",
"Baby Handabdruck",
"FORMA Shop",
"3D Modellierung",

"body casting",
"empreinte de main 3D",
"bijoux empreinte digitale",
"cadeaux personnalisés",
"bijoux personnalisés",
"sculpture main 3D",
"moulage en silicone",
"silicone médical",
"silicone allemand",
"silicone en gros",
"silicone au détail",
"silicone pour artistes",
"silicone médical",
"boutique de cadeaux en ligne",
"cadeaux sur mesure",
"bijoux commémoratifs",
"empreinte bébé",
"FORMA cadeaux",
"moulage personnalisé"
  ],
});

export const homeSEO_NL = generateSEO({
  title: "Homepagina",
  description:
    "FORMA – de nummer één bestemming voor body casting, persoonlijke cadeaus en op maat gemaakte sieraden. Wij bieden gecertificeerde medische siliconen voor kunstenaars en de medische sector, zowel groothandel als detailhandel, met innovatieve oplossingen voor het maken van mallen.",
  keywords: [
    "body casting",
    "life casting",
    "persoonlijke cadeaus",
    "gepersonaliseerde sieraden",
    "medische siliconen",
    "siliconen mallen",
    "mallen maken",
    "3D body casting",
    "siliconen groothandel",
    "siliconen voor kunstenaars",
    "FORMA"
  ],
});

export const homeSEO_DE = generateSEO({
  title: "Startseite",
  description:
    "FORMA – die führende Adresse für Body Casting, personalisierte Geschenke und maßgefertigten Schmuck. Wir bieten zertifiziertes medizinisches Silikon für Künstler und den medizinischen Bereich, im Groß- und Einzelhandel, mit innovativen Lösungen für die Formenherstellung.",
  keywords: [
    "Body Casting",
    "Life Casting",
    "personalisierte Geschenke",
    "maßgefertigter Schmuck",
    "medizinisches Silikon",
    "Silikonformen",
    "Formenherstellung",
    "3D Body Casting",
    "Silikon Großhandel",
    "Silikon für Künstler",
    "FORMA"
  ],
});

export const homeSEO_FR = generateSEO({
  title: "Page d’accueil",
  description:
    "FORMA – la destination incontournable pour le body casting, les cadeaux personnalisés et les bijoux sur mesure. Nous fournissons du silicone médical certifié pour le secteur médical et les artistes, en vente en gros et au détail, avec des solutions innovantes de création de moules.",
  keywords: [
    "body casting",
    "life casting",
    "cadeaux personnalisés",
    "bijoux sur mesure",
    "silicone médical",
    "moules en silicone",
    "création de moules",
    "3D body casting",
    "silicone en gros",
    "silicone pour artistes",
    "FORMA"
  ],
});

export const productsSEO = generateSEO({
  title: "جميع المنتجات",
  description:
    "تصفح مجموعة واسعة من الأدوية والمنتجات الصحية من أفضل الصيدليات. فلترة حسب الفئة، السعر، والتقييم.",
  keywords: [
    "كتالوج الأدوية",
    "منتجات صحية",
    "أدوية بوصفة",
    "أدوية بدون وصفة",
    "مقارنة الأسعار",
  ],
});

export const aboutSEO = generateSEO({
  title: "من نحن",
  description:
    "تعرف على فاليديريا، المنصة الرائدة للصيدليات الإلكترونية في الشرق الأوسط. مهمتنا توفير الرعاية الصحية للجميع.",
  keywords: ["عن فاليديريا", "رؤية الشركة", "خدمات صحية", "منصة صيدليات"],
});

export const contactSEO = generateSEO({
  title: "اتصل بنا",
  description:
    "تواصل مع فريق خدمة العملاء في فاليديريا. نحن هنا لمساعدتك في جميع استفساراتك الطبية والصيدلانية.",
  keywords: ["خدمة العملاء", "دعم فني", "استشارة صيدلانية", "تواصل معنا"],
});

// Dynamic product SEO generator
export function generateProductSEO(product: {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  image?: string;
  id: number;
}) {
  return generateSEO({
    title: product.name,
    description: `${product.description} - FORMA  to FORMA price ${product.price} pount. Order now and get fast delivery.`,
    keywords: [
      product.name,
      product.category,
      product.brand,
      "Buy online",
    "Fast delivery",
      `${product.category} `,
      "FORMA",
      "products store",
      `دواء ${product.name}`,
      `${product.brand} products`,
    ],
    image: product.image,
    path: `/product/${product.id}`,
    type: "website",
  });
}

// Product URL generator for consistent URL structure
export function getProductUrl(productId: number, productName?: string): string {
  const baseUrl = `/product/${productId}`;
  if (productName) {
    // Create SEO-friendly slug from product name
    const slug = productName
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "") // Keep Arabic, English, numbers, spaces, hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();
    return slug ? `${baseUrl}/${slug}` : baseUrl;
  }
  return baseUrl;
}

// Generate canonical URL for products
export function getProductCanonicalUrl(
  productId: number,
  productName?: string
): string {
  const siteUrl = process.env.NEXTAUTH_URL || "https://valideria.com";
  return `${siteUrl}${getProductUrl(productId, productName)}`;
}

// Dynamic category SEO generator
export function generateCategorySEO(category: {
  name: string;
  description?: string;
  productCount?: number;
}) {
  return generateSEO({
    title: category.name,
    description:
      category.description ||
      `تسوق من مجموعة ${category.name}  to products. ${
        category.productCount
          ? `mor from   ${category.productCount}  productCount`
          : ""
      } With fast delivery and quality guarantee.`,
    keywords: [
      category.name,
      `products ${category.name}`,
      `products ${category.name}`,
      "Shop online",
    ],
    path: `/products?category=${category.name}`,
  });
}

// Account pages SEO (no-index for privacy)
export const accountSEO = {  
  profile: generateSEO({     
    title: "Profile",     
    description: "Manage your personal information and preferences at Forma.",     
    path: "/account/profile",     
    noIndex: true,   
  }),  

  orders: generateSEO({     
    title: "My Orders",     
    description: "Track your orders and purchase history at Forma.",     
    path: "/account/orders",     
    noIndex: true,   
  }),  

  addresses: generateSEO({     
    title: "My Addresses",     
    description: "Manage your saved shipping addresses in your account.",     
    path: "/account/addresses",     
    noIndex: true,   
  }),  

  favorites: generateSEO({     
    title: "Favorites",     
    description: "Your list of favorite products at Forma.",     
    path: "/favorites",     
    noIndex: true,   
  }), 
};

export default generateSEO;
