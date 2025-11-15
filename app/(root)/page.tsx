import Banner from "@/components/custom/home/banner";
import BrandSwiper from "@/components/custom/home/brandsSwiper";
import FeatureCards from "@/components/custom/home/featureCard";
import Hero from "@/components/custom/home/hero";
import ProductSwiper from "@/components/custom/product/productSwiper";
import OfferSection from "@/components/custom/offersection";
import {
  getAllCategories,
  getBrandsBytitle,
  getProductsBytitle,
  getproduct,
  getSearchProducts,
  Offer,
  getAlternativeProducts
} from "@/lib/api/apiProducts";
import { auth } from "@/lib/auth";
import { homeSEO,
homeSEO_NL, homeSEO_DE,homeSEO_FR

 } from "@/lib/seo";
export const metadata = {homeSEO, homeSEO_NL,homeSEO_DE,homeSEO_FR};

export default async function Home() {
  const session = await auth();
  console.log("token:", session?.accessToken);
  console.log("user data:", session?.user);
  
  // Get Products
  const offersProducts = await getProductsBytitle("offers");
  const uniqueProducts = await getProductsBytitle("features");
  const topRatesProducts = await getProductsBytitle("top-rates");
  const topSellingProducts = await getProductsBytitle("top-selling");
  // Get Categories
  const homeCategories = await getAllCategories();
  // Get Brands
  const brandCategories = await getBrandsBytitle();
  const product = await getproduct();
  const Offe = await Offer();
  const latestProducts = await getAlternativeProducts(8);

  return (
    <>
      <Hero />
      {/* <FeatureCards /> */}
      
      {/* {offersProducts && offersProducts.length > 0 && (
        <ProductSwiper
          headLine="home.products.offers"
          products={offersProducts}
          showAll
        />
      )} */}
      
      <div id="categories-section">
        <BrandSwiper
          items={homeCategories}
          headLine=""
          highlight="home.categories.highlight"
          subHeadign="home.categories.subheading"
        />
      </div>
      
      {Offe && Offe.length > 0 && (
        <OfferSection
          offers={Offe}
          headLine="home.offers.headline"
          showAll
        />
      )}

      <ProductSwiper
        products={product}
        headLine="home.products.unique"
        showAll
      />  
      
      {/* <BrandSwiper
        items={brandCategories}
        headLine="home.brands.headline"
        highlight="home.brands.highlight"
        subHeadign="home.brands.subheading"
      /> */}
      
      {/* {topRatesProducts && topRatesProducts.length > 0 && (
        <ProductSwiper
          products={topRatesProducts}
          headLine="home.products.topRated"
          showAll
        />
      )} */}
      
      {/* <Banner /> */}
      
      {/* <BrandSwiper
        items={brandCategories}
        headLine="home.brands.headline"
        highlight="home.brands.topRated"
        subHeadign=""
      /> */}
      
      {/* {topSellingProducts && topSellingProducts.length > 0 && (
        <ProductSwiper
          products={topSellingProducts}
          headLine="home.products.topSelling"
          showAll
        />
      )} */}
    </>
  );
}