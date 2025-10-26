import { api } from "../axios";
import { AxiosError } from "axios";
import { auth } from "../auth";
import { delay } from "../utils";
import { Brand, category, Pharmacy, ProductItem } from "@/types";
import { success } from "zod";

export async function getPharmacyProductsByTitle(
  title: string,
  pharmacyId: string
) {
  try {
    const response = await api.get(`pharmacy/${pharmacyId}/products/${title}`);
    const products: ProductItem[] = response.data.data;
    return products;
  } catch (error) {
    console.error("Error fetching pharmacy products by title:", error);
    return [];
  }
}

export async function getPharmacyBrandsByTitle(
  title?: string,
  pharmacyId?: string
) {
  try {
    console.log("Fetching brands with title:", title);
    const response = await api.get(`pharmacy/${pharmacyId}/brands/`);
    const brands: Brand[] = response.data.data;
    // console.log("Brands fetched successfully:", brands.length);
    return brands;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error fetching brands by title:", error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
    // console.error("Unknown error fetching brands:", error);
    return [];
  }
}

// Get All Categories
export async function getPharmacyCategories(pharmacyId: string) {
  try {
    const response = await api.get(`pharmacy/${pharmacyId}/categories`);
    const categories: category[] = response.data.data;
    return categories;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching categories:", error.response);
    }
    return [];
  }
}

export async function getPharmacyData(pharmacyId: string) {
  try {
    const response = await api.get(`pharmacies/${pharmacyId}/show`);
    if (response.data.result === "Success") {
      //   console.log("Pharmacy data fetched successfully:", response.data.data);
      // Return the pharmacy data directly
      return {
        success: true,
        data: response.data.data as Pharmacy,
      };
    }
    console.error("Failed to fetch pharmacy data:", response.data.message);
    return {
      success: false,
      data: response.data.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching pharmacy data:", error.response);
    }
    return null;
  }
}
