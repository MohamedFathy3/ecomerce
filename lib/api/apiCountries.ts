// lib/api/apiCountries.ts
import { api } from "@/lib/axios";

export interface Country {
  id: number;
  name: string;
  iso_code: string | null;
  shipping_price: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CountriesResponse {
  result: string;
  message: string;
  data: {
    current_page: number;
    data: Country[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// جلب جميع البلاد
export async function getAllCountries(): Promise<Country[]> {
  try {
    console.log("🔄 [API] Fetching countries...");
    
    const response = await api.post<CountriesResponse>("/countries-shipping/index");
    
    console.log("✅ [API] Countries fetched successfully:", response.data);
    
    // تحقق من هيكل البيانات
    if (response.data.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    } else if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("⚠️ [API] Unexpected data structure:", response.data);
      return [];
    }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [API] Error fetching countries:", error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch countries");
    }
    
    throw new Error("Failed to fetch countries");
  }
}