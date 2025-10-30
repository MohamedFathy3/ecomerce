import { api } from "../axios";
import { getAuthToken } from "./helpers";

export interface CreateOrderRequest {
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  payment_method: string;
  promo_code?: string;
  cards: Array<{
    id: number;
    qty: number;
  }>;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  order_number?: string;
  message?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  redirect_url: string;
  transaction_type: string;
  email: string;
  country: string;
  webhook_url: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  data?: Array<{
    payment_id: string;
    token: string;
    amount: number;
    currency: string;
    order_id: string;
    transaction_type: string;
    payment_status: string;
    description: string;
    webhook_url: string;
    redirect_url: string;
    merchant_email: string;
    created_at: string;
    updated_at: string;
  }>;
  message?: string;
}

// Create Order
export async function createOrder(orderData: CreateOrderRequest, userToken?: string): Promise<CreateOrderResponse> {
  try {
    console.log("🔄 [API] Creating order...", orderData);
    
    // جلب التوكن - تأكد إنه بيتعمل في كل request
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      console.error("❌ [API] No token available");
      return {
        success: false,
        message: authResult.message
      };
    }

    console.log("🔑 [API] Using token:", authResult.token ? "Token exists" : "No token");
    
    const response = await api.post("/front/create-order", orderData, {
      headers: {
        Authorization: `Bearer ${authResult.token}`,
      },
    });
    
    console.log("✅ [API] Order created successfully:", response.data);
    
    if (response.data.result === "Success" && response.data.data) {
      return {
        success: true,
        order_id: response.data.data.id,
        order_number: response.data.data.order_number,
        message: response.data.message || "Order created successfully"
      };
    }
    
    return {
      success: false,
      message: response.data.message || "Failed to create order"
    };
    
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [API] Error creating order:", error);
    
    if (error.response) {
      console.error("🔍 [API] Error details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
    } else if (error.request) {
      console.error("🔍 [API] No response received:", error.request);
    } else {
      console.error("🔍 [API] Error message:", error.message);
    }
    
    return {
      success: false,
      message: "Failed to create order"
    };
  }
}

// Create Payment
export async function createPayment(paymentData: CreatePaymentRequest, userToken?: string): Promise<CreatePaymentResponse> {
  try {
    console.log("🔄 [API] Creating payment...", paymentData);
    
    // جلب التوكن
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return {
        success: false,
        message: authResult.message
      };
    }
    
    const response = await api.post("/alqaseh/create-payment", paymentData, {
      headers: {
        Authorization: `Bearer ${authResult.token}`,
      },
    });
    
    console.log("✅ [API] Payment created successfully:", response.data);
    
    return {
      success: true,
      data: response.data.data,
      message: "Payment created successfully"
    };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [API] Error creating payment:", error);
    
    if (error.response) {
      console.error("🔍 [API] Error details:", {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    return {
      success: false,
      message: "Failed to create payment"
    };
  }
}

// Clear Cart
export async function clearCart(userToken?: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("🔄 [API] Clearing cart...");
    
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return {
        success: false,
        message: authResult.message || "Authentication failed" 
      };
    }

    console.log("🔑 [API] Clear cart token:", authResult.token ? "Token exists" : "No token");
    
    const cartResponse = await api.get("/front/cart", {
      headers: {
        Authorization: `Bearer ${authResult.token}`,
      },
    });
    
    console.log("🛒 [API] Cart response:", cartResponse.data);
    
    if (cartResponse.data.result === "Success" && Array.isArray(cartResponse.data.data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deletePromises = cartResponse.data.data.map((item: any) =>
        api.post("/front/cart", {
          card_id: item.card_id,
          method: "delete"
        }, {
          headers: {
            Authorization: `Bearer ${authResult.token}`,
          },
        })
      );
      
      await Promise.all(deletePromises);
      console.log("✅ [API] Cart cleared successfully");
      
      return {
        success: true,
        message: "Cart cleared successfully"
      };
    }
    
    return {
      success: true,
      message: "Cart is already empty"
    };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [API] Error clearing cart:", error);
    
    if (error.response) {
      console.error("🔍 [API] Error details:", {
        status: error.response.status,
        data: error.response.data
      });
      
      // إضافة رسالة خطأ محددة بناءً على status code
      if (error.response.status === 401) {
        return {
          success: false,
          message: "Authentication failed - Please login again"
        };
      } else if (error.response.status === 404) {
        return {
          success: false,
          message: "Cart not found"
        };
      } else if (error.response.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
    }
    
    return {
      success: false,
      message: "Failed to clear cart"
    };
  }
}