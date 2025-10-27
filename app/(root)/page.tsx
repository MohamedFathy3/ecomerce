import { Suspense } from "react";
import Spinner from "@/components/custom/spinner";
import Banner from "@/components/custom/home/banner";
import BrandSwiper from "@/components/custom/home/brandsSwiper";
import FeatureCards from "@/components/custom/home/featureCard";
import Hero from "@/components/custom/home/hero";
import ProductSwiper from "@/components/custom/product/productSwiper";
import {
  getAllCategories,
  getBrandsBytitle,
  getProductsBytitle,
} from "@/lib/api/apiProducts";
import { auth } from "@/lib/auth";
import getLocaleStrings from "@/localization";
import { homeSEO } from "@/lib/seo";

export const metadata = homeSEO;

export default async function Home() {
  const session = await auth();
  const locals = await getLocaleStrings();

  const offersProducts = await getProductsBytitle("offers");
  const uniqueProducts = await getProductsBytitle("features");
  const topRatesProducts = await getProductsBytitle("top-rates");
  const topSellingProducts = await getProductsBytitle("top-selling");
  const homeCategories = await getAllCategories();
  const brandCategories = await getBrandsBytitle();

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-white">
          <Spinner />
        </div>
      }
    >
      <Hero />
      <FeatureCards />
      {offersProducts && offersProducts.length > 0 && (
        <ProductSwiper
          headLine={locals.offers}
          products={offersProducts}
          showAll
        />
      )}
      <BrandSwiper
        items={homeCategories}
        headLine="Browse all"
        highlight="Categories"
        subHeadign="Choose from a wide range of medicines, health products, and personal care products – everything you need in one place."
      />
      {topRatesProducts && topRatesProducts.length > 0 && (
        <ProductSwiper
          products={topRatesProducts}
          headLine="Top Rated Products"
          showAll
        />
      )}
      {topSellingProducts && topSellingProducts.length > 0 && (
        <ProductSwiper
          products={topSellingProducts}
          headLine="Top Selling Products"
          showAll
        />
      )}
    </Suspense>
  );
}
