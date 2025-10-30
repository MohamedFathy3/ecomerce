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
import getLocaleStrings from "@/localization";
import { homeSEO } from "@/lib/seo";

export const metadata = homeSEO;

export default async function Home() {
  const session = await auth();
  console.log("token:", session?.accessToken);
  console.log("user data:", session?.user);
  const locals = await getLocaleStrings();
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
      <FeatureCards />
      {/* {offersProducts && offersProducts.length > 0 && (
        <ProductSwiper
          headLine={locals.offers}
          products={offersProducts}
          showAll
        />
      )} */}

        {Offe && Offe.length > 0 && (
        <OfferSection
          offers={Offe}
          headLine="Exclusive Offers"
          showAll
        />
      )}

      <BrandSwiper
        items={homeCategories}
        headLine="Browse all"
        highlight="Categories"
        subHeadign="Choose from a wide range of medicines, health products, and personal care products – everything you need in one place."
      />
        <ProductSwiper
          products={product}
          headLine="Unique Products"
          showAll
        />  
      {/* <BrandSwiper
        items={brandCategories}
        headLine="Browse all"
        highlight="Brands"
        subHeadign="Choose from a wide range of medicines, health products, and personal care products – everything you need in one place."
      /> */}
      {/* {topRatesProducts && topRatesProducts.length > 0 && (
        <ProductSwiper
          products={topRatesProducts}
          headLine="Top Rated Products"
          showAll
        />
      )} */}
      {/* <Banner /> */}
      {/* <BrandSwiper
        items={brandCategories}
        headLine="Top"
        highlight="Rated Brands"
        subHeadign=""
      />
      {topSellingProducts && topSellingProducts.length > 0 && (
        <ProductSwiper
          products={topSellingProducts}
          headLine="Top Selling Products"
          showAll
        />
      )} */}
    </>
  );
}
