"use server";

import { addRate, Brand, category, Product, ProductItem,OfferPeriod } from "@/types";
import { api } from "../axios";
import { AxiosError } from "axios";
import { delay } from "../utils";
import { success } from "zod";
import { auth } from "../auth";

// Get Endpoints

// Get All Categories
export async function getAllCategories() {
  try {
    const response = await api.get("front/categories");
    const categories: category[] = response.data.data;
    return categories;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching categories:", error.response);
    }
    return [];
  }
}





export async function getAllLatestOffers() {
  try {
    const response = await api.get("front/latest-offer");
    const categories: category[] = response.data.data;
    return categories;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching categories:", error.response);
    }
    return [];
  }
}

// Home API Endpoints

export async function getBrandsBytitle(title?: string) {
  try {
    console.log("Fetching brands with title:", title);
    const response = await api.get(`home/brands/`);
    const brands: Brand[] = response.data.data;
    console.log("Brands fetched successfully:", brands.length);
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



export async function getproduct() {
  try {
    const response = await api.get(`front/cards?sort=latest`);
    const products: ProductItem[] = response.data.data;
    console.log("Products fetched:", response);
    return products;
  } catch (error) {
    console.error("Error fetching products by title:", error);
    return [];
  }
}

export async function getProductsBytitle(title: string) {
  try {
    const response = await api.get(`front/cards/${title}`);
    const products: ProductItem[] = response.data.data;
    return products;
  } catch (error) {
    console.error("Error fetching products by title:", error);
    return [];
  }
}

// Get Search Products
export async function getSearchProducts(categoryId: string, keyword: string) {
  try {
    console.log("Searching products with:", { categoryId, keyword });
    const response = await api.get(`front/search-cards`, {
      params: { category_id: categoryId, keyword: keyword },
    });
    // console.log("Search API response:", response.data.data.products);
    if (
      response.data.result === "Success" &&
      response.data.data.products.length > 0
    ) {
      const products: ProductItem[] = response.data.data.products;
      return {
        success: true,
        data: products,
      };
    }

    return {
      success: false,
      data: [],
      empty: true,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
    };
  }
}

// Get Filtered Products
interface filterParams {
  price_min?: string;
  price_max?: string;
  user_rating_min?: string;
  pharmacist_rating_min?: string;
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  inStock?: string;
  pageSize?: number;
  page?: number;
  sort?: string;
  sortBy?: string;
}
export async function getFilteredProducts(filterParams: filterParams = {}) {
  try {
    console.log("🔍 [API] Sending request to /front/search-cards");
    console.log("🔍 [API] Filter params:", filterParams);
    
    const response = await api.get(`front/search-cards`, {
      params: {
        price_min: filterParams.price_min || "",
        price_max: filterParams.price_max || "",
        keyword: filterParams.keyword || "",
        category_id: filterParams.categoryId  || "", // أضفت category_id
        in_stock: filterParams.inStock || "",
      },
    });
    
    // Debug الـ response بالكامل
    console.log("📡 [API] Full response:", response);
    console.log("📡 [API] response.data:", response.data);
    console.log("📡 [API] response.data.data:", response.data.data);
    console.log("📡 [API] response.data.products:", response.data.products);
    
    // الـ response بيكون في أحد هذه الهياكل:
    // 1. { result: "Success", data: [...], message: "...", status: 200 }
    // 2. { success: true, data: { products: [...], pagination: {...} } }
    // 3. { success: true, products: [...], pagination: {...} }
    
    let products = [];
    let pagination = null;
    
    if (response.data.result === "Success" && Array.isArray(response.data.data)) {
      // الهيكل الأول
      products = response.data.data;
      console.log("📊 [API] Using result->data structure, products count:", products.length);
    } 
    else if (response.data.data && Array.isArray(response.data.data.products)) {
      // الهيكل الثاني
      products = response.data.data.products;
      pagination = response.data.data.pagination;
      console.log("📊 [API] Using data->products structure, products count:", products.length);
    }
    else if (Array.isArray(response.data.products)) {
      // الهيكل الثالث
      products = response.data.products;
      pagination = response.data.pagination;
      console.log("📊 [API] Using direct products structure, products count:", products.length);
    }
    else if (Array.isArray(response.data)) {
      // إذا الـ response.data نفسه array
      products = response.data;
      console.log("📊 [API] Using response.data as array, products count:", products.length);
    }
    else {
      console.log("❌ [API] Unknown response structure:", response.data);
    }
    
    return {
      success: true,
      products: products,
      pagination: pagination,
      message: "Filtered products retrieved successfully",
    };
    
  } catch (error) {
    console.error("❌ [API] Error fetching filtered products:", error);
    
    if (error instanceof AxiosError) {
      console.error("❌ [API] Axios error request:", error.request);
      console.error("❌ [API] Axios error response:", error.response?.data);
    }
    
    return {
      success: false,
      message: "Failed to retrieve filtered products",
      products: [],
      pagination: null,
    };
  }
}

// Get a single product by ID


export async function Offer() {
  try {
    const response = await api.get(`front/offers`);
    const products: OfferPeriod[] = response.data.data;
    console.log("Products fetched:", response);
    return products;
  } catch (error) {
    console.error("Error fetching products by title:", error);
    return [];
  }
}



export async function getProduct(productId: string) {
  try {
    const response = await api.get(`front/cards/${productId}`);
    const product: Product = response.data.data;
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function rateProduct(
  productID: string,
  rating: addRate,
  userToken: string
) {
  let token: string = userToken;
  if (!userToken) {
    const session = await auth();
    token = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      return { success: false, message: "User not authenticated" };
    }
  }

  try {
    const response = await api.post(
      `products/${productID}/ratings`,
      {
        ...rating,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.rating) {
      return { success: true, message: "Product rated successfully" };
    }

    console.log("Rating response:", response.data);

    return { success: false, message: "Failed to rate product" };
  } catch (error) {
    console.error("Error rating product:", error);
    return { success: false, message: "Error rating product" };
  }
}
export async function getAlternativeProducts(limit: number = 8) {
  try {
    console.log("🔄 [API] Fetching alternative products...");
    
    const response = await api.get(`front/cards`, {
      params: {
        limit: limit,
        sort: 'latest'
      }
    });

    console.log("📡 [API] Alternative products response:", response.data);

    if (response.data.result === "Success" && Array.isArray(response.data.data)) {
      console.log("✅ [API] Number of alternative products:", response.data.data.length);
      
      return {
        success: true,
        products: response.data.data,
        message: "Alternative products retrieved successfully"
      };
    }
    
    return {
      success: false,
      products: [],
      message: "No alternative products found"
    };
  } catch (error) {
    console.error("❌ [API] Error fetching alternative products:", error);
    return {
      success: false,
      products: [],
      message: "Failed to fetch alternative products"
    };
  }
}

// Post Endpoints

// Delete Endpoints
