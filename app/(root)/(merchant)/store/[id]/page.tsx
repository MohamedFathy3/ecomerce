import Banner from "@/components/custom/home/banner";
import BrandSwiper from "@/components/custom/home/brandsSwiper";
import ProductSwiper from "@/components/custom/product/productSwiper";
import StoreHero from "@/components/custom/store/storeHero";
import {
  getPharmacyBrandsByTitle,
  getPharmacyCategories,
  getPharmacyData,
  getPharmacyProductsByTitle,
} from "@/lib/api/apiPharmacy";
import { Pharmacy } from "@/types";
import React from "react";

interface StorePageProps {
  params: Promise<{
    id: string;
    [key: string]: string | undefined;
  }>;
}

const StorePage = async ({ params }: StorePageProps) => {
  const { id: pharmacyId } = await params;
  const pharmacyData = await getPharmacyData(pharmacyId);
  let pharmacy: Pharmacy | null = null;
  if (pharmacyData && pharmacyData.success) {
    pharmacy = pharmacyData.data;
  }
  const pharmacyOffers = await getPharmacyProductsByTitle("offers", pharmacyId);
  const pharmacyFeatured = await getPharmacyProductsByTitle(
    "features",
    pharmacyId
  );
  const pharmacyTopRates = await getPharmacyProductsByTitle(
    "top-rates",
    pharmacyId
  );
  const pharmacyTopSelling = await getPharmacyProductsByTitle(
    "top-selling",
    pharmacyId
  );

  const pharmacyCategories = await getPharmacyCategories(pharmacyId);

  const pharmacyBrands = await getPharmacyBrandsByTitle("brands", pharmacyId);
  return (
    <>
      <StoreHero pharmacy={pharmacy} />
      <ProductSwiper headLine="Offers" products={pharmacyOffers} />
      <BrandSwiper
        headLine="Browse all"
        highlight="Categories"
        subHeadign="Choose from a wide range of medicines, health products, and personal care products – everything you need in one place."
        items={pharmacyCategories}
      />
      <ProductSwiper headLine="Unique Products" products={pharmacyFeatured} />
      <BrandSwiper
        headLine=""
        highlight="Brands"
        subHeadign=""
        items={pharmacyBrands}
      />
      <ProductSwiper
        products={pharmacyTopSelling}
        headLine="Top Rated Products"
      />
      {/* <Banner /> */}
      {/* <BrandSwiper headLine="Top" highlight="Rated Brands" subHeadign="" /> */}
      <ProductSwiper
        headLine="Top Selling Products"
        products={pharmacyTopRates}
      />
    </>
  );
};

export default StorePage;
