import { Metadata } from "next";
import Link from "next/link";
import ProductSwiper from "@/components/custom/product/productSwiper";
import ProductMainInfo from "@/components/custom/product/productMainInfo";
import { getProduct, getAlternativeProducts } from "@/lib/api/apiProducts";
import { Product, ProductItem } from "@/types"; // تأكد من استيراد ProductItem
import { generateProductSEO, getProductCanonicalUrl } from "@/lib/seo";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
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
      title: "Product Not Found | Valideria - Online Pharmacy",
      description: "The requested product is currently unavailable.",
      robots: { index: false, follow: false },
    };
  }

  const metadata = generateProductSEO({
    id: product.id,
    name: product.name,
    description: product.description || product.short_description || `${product.name} - ${product.type}`,
    category: product.category,
    brand: product.type,
    price: product.price,
    image: product.image,
  });

  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description || product.short_description,
    price: product.price,
    image: product.image,
    brand: product.type,
    category: product.category,
    availability: product.active ? "in_stock" : "out_of_stock",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
    { name: product.name },
  ]);

  const structuredData = [productSchema, breadcrumbSchema];
  
  return {
    ...metadata,
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": product.currency,
      "product:availability": product.active ? "in stock" : "out of stock",
      "product:brand": product.type,
      "product:category": product.category,
      "product:retailer_item_id": String(product.id),
      "product:condition": "new",
      "og:price:amount": String(product.price),
      "og:price:currency": product.currency,
      "structured-data": JSON.stringify(structuredData),
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id: productId } = await params;
  
  console.log("🚀 [PAGE] Starting product page load...");
  console.log("🎯 [PAGE] Requested product ID:", productId);

  const product = await getProduct(productId);

  if (!product) {
    console.log("❌ [PAGE] Product not found:", productId);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product youre looking for doesnt exist.</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  console.log("✅ [PAGE] Product found:", {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price
  });

  // Fetch alternative products (latest products)
  console.log("🔄 [PAGE] Fetching alternative products...");
  const alternativeProductsResponse = await getAlternativeProducts(12);
  
  console.log("📊 [PAGE] Alternative products result:", {
    success: alternativeProductsResponse.success,
    productsCount: alternativeProductsResponse.products?.length || 0,
    message: alternativeProductsResponse.message
  });

  // Filter out the current product from alternative products - تم إصلاح TypeScript error هنا
  let filteredProducts: ProductItem[] = [];
  if (alternativeProductsResponse.success && alternativeProductsResponse.products && alternativeProductsResponse.products.length > 0) {
    filteredProducts = alternativeProductsResponse.products.filter(
      (productItem: ProductItem) => productItem.id !== product.id
    ).slice(0, 8); // Take max 8 products
    
    console.log("✅ [PAGE] Filtered products count:", filteredProducts.length);
  }

  // Generate structured data
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.name,
    description: product.description || product.short_description,
    price: product.price,
    image: product.image,
    brand: product.type,
    category: product.category,
    availability: product.active ? "in_stock" : "out_of_stock",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.category, url: `/products?category=${encodeURIComponent(product.category)}` },
    { name: product.name },
  ]);

  const structuredData = [productSchema, breadcrumbSchema];

  console.log("🎉 [PAGE] Page preparation completed successfully!");

  return (
    <>
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <link rel="canonical" href={getProductCanonicalUrl(product.id, product.name)} />

      <section className="space-y-12 pt-6 px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
          <ol className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <span>/</span>
            <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
            <span>/</span>
            <li><Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link></li>
            <span>/</span>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Name as H1 for SEO */}
        <h1 className="sr-only">{product.name} - {product.type} | Valideria</h1>

        {/* Main Info */}
        <ProductMainInfo product={product} />

        {/* You May Also Like Section */}
        {filteredProducts.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You May Also Like</h2>
                <p className="text-gray-600">Other products you might be interested in</p>
              </div>
              <Link 
                href="/latest-products" 
                className="text-primary hover:text-primary-dark font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductSwiper
              products={filteredProducts}
              headLine=""
              showAll={false}
            />
          </section>
        ) : (
          <div className="mt-16 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Check out our latest products</p>
            <Link 
              href="/latest-products" 
              className="inline-block mt-4 text-primary hover:text-primary-dark font-medium"
            >
              View Latest Products →
            </Link>
          </div>
        )}

        {/* Latest Products Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Products</h2>
              <p className="text-gray-600">Discover our newest arrivals</p>
            </div>
            <Link 
              href="/latest-products" 
              className="text-primary hover:text-primary-dark font-medium flex items-center gap-2 transition-colors"
            >
              Browse All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <ProductSwiper
            products={alternativeProductsResponse.products?.slice(0, 8) || []}
            headLine=""
            showAll={false}
          />
        </section>
      </section>
    </>
  );
};

export default ProductPage;