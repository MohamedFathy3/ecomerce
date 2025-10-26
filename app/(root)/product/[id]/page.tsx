import { Metadata } from "next";
import Link from "next/link";
import ProductSwiper from "@/components/custom/product/productSwiper";
import ProductMainInfo from "@/components/custom/product/productMainInfo";
import ProductRatingsComments from "@/components/custom/product/productRatingsComments";
import { getProduct } from "@/lib/api/apiProducts";
import { Product } from "@/types";
import { generateProductSEO, getProductCanonicalUrl } from "@/lib/seo";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateReviewSchema,
} from "@/lib/structured-data";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id: productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return {
      title: "المنتج غير موجود | فاليديريا - الصيدلية الإلكترونية",
      description:
        "المنتج المطلوب غير متوفر حالياً. تصفح مجموعتنا الواسعة من الأدوية والمنتجات الصحية.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Generate rich metadata
  const metadata = generateProductSEO({
    id: product.id,
    name: product.name,
    description:
      product.description ||
      `${product.name} من ${product.brandName}. ${product.form} ${
        product.strength ? `بتركيز ${product.strength}` : ""
      }. متوفر في ${product.pharmacy.name}.`,
    category: product.categoryName,
    brand: product.brandName,
    price: product.offer?.price_after || product.price,
    image: product.image || undefined,
  });

  // Add structured data
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image || undefined,
    brand: product.brandName,
    category: product.categoryName,
    availability: product.quantity > 0 ? "in_stock" : "out_of_stock",
    offer: product.offer
      ? {
          price_after: product.offer.price_after,
          discount_percentage: product.offer.discount_percentage,
        }
      : undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "الرئيسية", url: "/" },
    { name: "المنتجات", url: "/products" },
    {
      name: product.categoryName,
      url: `/products?category=${product.categoryName}`,
    },
    { name: product.name },
  ]);

  // Add review schemas if available
  const allComments = [
    ...product.user_comments.map((comment) => ({
      rating: comment.rate,
      comment: comment.comment,
      author: comment.user_name,
      date: new Date().toISOString(),
    })),
    ...product.doctors_comments.map((comment) => ({
      rating: comment.rate,
      comment: comment.comment,
      author: `د. ${comment.user_name}`,
      date: new Date().toISOString(),
    })),
  ];

  const reviewSchemas =
    allComments.length > 0 ? generateReviewSchema(allComments) : [];

  // Create structured data script
  const structuredData = [productSchema, breadcrumbSchema, ...reviewSchemas];

  // Enhanced metadata with product-specific SEO properties
  return {
    ...metadata,
    other: {
      "product:price:amount": String(
        product.offer?.price_after || product.price
      ),
      "product:price:currency": "EGP",
      "product:availability":
        product.quantity > 0 ? "in stock" : "out of stock",
      "product:brand": product.brandName,
      "product:category": product.categoryName,
      "product:retailer_item_id": String(product.id),
      "product:condition": "new",
      "og:price:amount": String(product.offer?.price_after || product.price),
      "og:price:currency": "EGP",
      "structured-data": JSON.stringify(structuredData),
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id: productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="flex-center h-screen">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  // Generate structured data for this product
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image || undefined,
    brand: product.brandName,
    category: product.categoryName,
    availability: product.quantity > 0 ? "in_stock" : "out_of_stock",
    offer: product.offer
      ? {
          price_after: product.offer.price_after,
          discount_percentage: product.offer.discount_percentage,
        }
      : undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "الرئيسية", url: "/" },
    { name: "المنتجات", url: "/products" },
    {
      name: product.categoryName,
      url: `/products?category=${product.categoryName}`,
    },
    { name: product.name },
  ]);

  // Add review schemas if available
  const allComments = [
    ...product.user_comments.map((comment) => ({
      rating: comment.rate,
      comment: comment.comment,
      author: comment.user_name,
      date: new Date().toISOString(),
    })),
    ...product.doctors_comments.map((comment) => ({
      rating: comment.rate,
      comment: comment.comment,
      author: `د. ${comment.user_name}`,
      date: new Date().toISOString(),
    })),
  ];

  const reviewSchemas =
    allComments.length > 0 ? generateReviewSchema(allComments) : [];
  const structuredData = [productSchema, breadcrumbSchema, ...reviewSchemas];

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Additional SEO Meta Tags */}
      <link
        rel="canonical"
        href={getProductCanonicalUrl(product.id, product.name)}
      />

      <section className="space-y-12 pt-6 px-4 sm:px-8">
        {/* Breadcrumb Navigation for SEO */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
          <ol className="flex items-center space-x-2 rtl:space-x-reverse">
            <li>
              <Link href="/" className="hover:text-primary">
                الرئيسية
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link href="/products" className="hover:text-primary">
                المنتجات
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link
                href={`/products?category=${product.categoryName}`}
                className="hover:text-primary"
              >
                {product.categoryName}
              </Link>
            </li>
            <span>/</span>
            <li className="text-gray-900 font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Name as H1 for SEO */}
        <h1 className="sr-only">
          {product.name} - {product.brandName} | فاليديريا
        </h1>

        {/* Main Info */}
        <ProductMainInfo product={product as Product} />

        {/* Ratings and Comments */}
        {/* <ProductRatingsComments product={product} />

        {product.similar_products && product.similar_products.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">المنتجات المشابهة</h2>
            <ProductSwiper
              products={product.similar_products}
              headLine="المنتجات المشابهة"
            />
          </section>
        )} */}
      </section>
    </>
  );
};

export default ProductPage;
