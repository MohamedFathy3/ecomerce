"use server";

// Get Cart Data
import { api } from "../axios";
import { CartData, CartItem } from "@/types";
import { AxiosError } from "axios";
import { getAuthToken } from "./helpers";

export const getCartData = async (userToken?: string) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { 
      success: false, 
      message: authResult.message,
      data: null,
      empty: true 
    };
  }
  
  const token = authResult.token;
  
  try {
    const response = await api.get("/front/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🛒 Cart API Response:", response.data);

    // التحقق من هيكل الـ response
    if (response.data.result === "Success" && Array.isArray(response.data.data)) {
      const cartItems: CartItem[] = response.data.data;
      
      if (cartItems.length === 0) {
        return { 
          success: true, 
          message: "Cart is empty", 
          data: {
            items: [],
            total: 0,
            items_count: 0,
            total_price: 0
          },
          empty: true 
        };
      }

      // حساب الإجماليات
      const total_price = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.card?.price || "0");
        return sum + (price * item.quantity);
      }, 0);

      const items_count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      const processedCart: CartData = {
        items: cartItems,
        total: cartItems.length, // عدد العناصر المختلفة
        items_count: items_count, // إجمالي الكميات
        total_price: total_price // إجمالي السعر
      };

      return {
        success: true,
        data: processedCart,
        message: response.data.message || "Cart items retrieved successfully"
      };
    }

    // إذا الـ response مش كما نتوقع
    return { 
      success: false, 
      message: "Invalid cart response structure",
      data: null,
      empty: true 
    };

  } catch (error) {
    console.error("❌ Error fetching cart data:", error);
    
    if (error instanceof AxiosError) {
      console.log("🔍 Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Cart not found",
          data: null,
          empty: true
        };
      }

      // إذا كان الـ cart فاضي والـ API بيرجع error
      if (error.response?.status === 500) {
        return {
          success: true,
          message: "Cart is empty",
          data: {
            items: [],
            total: 0,
            items_count: 0,
            total_price: 0
          },
          empty: true
        };
      }

      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          data: null,
          empty: true
        };
      }
    }

    return { 
      success: false, 
      message: "Failed to retrieve cart data",
      data: null,
      empty: true 
    };
  }
};

export const addToCart = async (productId: number, quantity: number, userToken?: string) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { 
      success: false, 
      message: authResult.message,
      data: null,
      notAuthenticated: true
    };
  }
  
  const token = authResult.token;
  
  try {
    console.log("🛒 Sending add to cart request:", {
      productId,
      quantity,
      token: token ? "Token exists" : "No token"
    });
    
    const response = await api.post("/front/cart", 
      {
        card_id: productId,
        quantity: quantity,
        method:'add',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    console.log("✅ Add to cart success:", response.data);
    
    return {
      success: response.data.result === "Success",
      message: response.data.message,
      data: response.data.data
    };
    
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("❌ Add to cart API error:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Authentication failed - Please login again",
          data: null,
          notAuthenticated: true
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null
      };
    }
    
    console.error("❌ Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null
    };
  }
};

export const updateCartItem = async (
  productID: number,
  quantity: number,
  userToken?: string
) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  const token = authResult.token;
  
  try {
    console.log("🔄 Updating cart item:", { productID, quantity });
    
    const response = await api.post(
      "/front/cart",
      {
        card_id: productID, // غيرت من product_id لـ card_id علشان يmatch مع الـ addToCart
        quantity: quantity,
        method: "plus" // add for first time (plus quantity or minus quantity ) => delete Item. [add, plus, minus, delete]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Update cart response:", response.data);
    
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.message,
      };
    }

    if (response.data.result === "Error") {
      return {
        success: false,
        stockOut: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      message: response.data.message || "Failed to update cart item"
    };
    
  } catch (error) {
    console.error("❌ Update cart error:", error);
    
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true,
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    }
    
    return {
      success: false,
      message: "Failed to update item in cart",
      data: null,
    };
  }
};

export const removeCartItem = async (productID: number, userToken?: string) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  const token = authResult.token;
  
  try {
    console.log("🗑️ Removing cart item:", productID);
    
    const response = await api.post(
      "/front/cart",
      {
        card_id: productID,
        method: "delete" // استخدم method delete علشان تحذف الـ item
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("✅ Remove cart response:", response.data);
    
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.message,
      };
    }
    
    return {
      success: false,
      message: response.data.message || "Failed to remove item from cart"
    };
    
  } catch (error) {
    console.error("❌ Remove cart error:", error);
    
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true,
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    }
    
    return {
      success: false,
      message: "Failed to remove item from cart",
      data: null,
    };
  }
};

export const addCouponToCart = async (
  couponCode: string,
  pharamcyId: number,
  userToken?: string
) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  const token = authResult.token;
  
  try {
    console.log("🎫 Adding coupon:", { couponCode, pharamcyId });
    
    const response = await api.post(
      "/add-coupon",
      {
        coupon_code: couponCode,
        pharmacy_id: pharamcyId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("✅ Add coupon response:", response.data);
    
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.message,
      };
    }
    
    if (response.data.result === "Error") {
      return {
        success: false,
        message: response.data.message,
      };
    }
    
    return {
      success: false,
      message: response.data.message || "Failed to add coupon"
    };
    
  } catch (error) {
    console.error("❌ Add coupon error:", error);
    
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Unauthorized access - Please login again",
          data: null,
          notAuthenticated: true,
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    }
    
    return {
      success: false,
      message: "Failed to add coupon to cart",
      data: null,
    };
  }
};