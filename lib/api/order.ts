import { api } from "../axios";
import { getAuthToken } from "./helpers";

export interface Order {
  id: number;
  name: string;
  email: string;
  order_number: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  status: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
  zip_code: string;
  payment_method: string;
  payment_status: string;
  promo_code?: string;
  cards: Array<{
    id: number;
    card_id: number;
    qty: number;
    card: {
      id: number;
      name: string;
      slug: string;
      description: string;
      short_description: string;
      old_price: string;
      discount: string;
      price: string;
      currency: string;
      image?: string;
      gallery: string[];
      category: string;
      average_rating: number;
      reviews_count: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  result: string;
  data: Order[];
  message: string;
  status: number;
}
export interface OrdersApiResponse {
  result: string;
  data: Order[];
  message: string;
  status: number;
}
// جلب جميع الأوردرات
export async function getUserOrders(userToken?: string): Promise<OrdersApiResponse> {
  try {
    console.log("🔄 [API] Fetching user orders...");
    
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      throw new Error(authResult.message || "Authentication failed");
    }

    const response = await api.get("/front/orders", {
      headers: {
        Authorization: `Bearer ${authResult.token}`,
      },
    });
    
    console.log("✅ [API] Orders fetched successfully");
    return response.data;
    
  } catch (error: any) {
    console.error("❌ [API] Error fetching orders:", error);
    
    if (error.response) {
      console.error("🔍 [API] Error details:", {
        status: error.response.status,
        data: error.response.data
      });
      
      throw new Error(error.response.data?.message || "Failed to fetch orders");
    }
    
    throw new Error("Failed to fetch orders");
  }
}

// جلب أوردر معين بالID
export async function getOrderById(orderId: number, userToken?: string): Promise<Order> {
  try {
    console.log("🔄 [API] Fetching order:", orderId);
    
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      throw new Error(authResult.message || "Authentication failed");
    }

    const response = await api.get(`/front/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${authResult.token}`,
      },
    });
    
    console.log("✅ [API] Order fetched successfully");
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ [API] Error fetching order:", error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || "Failed to fetch order");
    }
    
    throw new Error("Failed to fetch order");
  }
}