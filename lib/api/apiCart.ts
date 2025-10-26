"use server";

// Get Cart Data
import { api } from "../axios";
import { CartData } from "@/types";
import { AxiosError } from "axios";
import { getAuthToken } from "./helpers";

export const getCartData = async (userToken?: string) => {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  const token = authResult.token;
  try {
    const response = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cart: CartData = response.data.data;
    if (cart) {
      return {
        success: true,
        data: cart,
      };
    }

    if (!response.data.data && response.data.status === 500) {
      return { success: false, message: "Cart is Empty", empty: true };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      //   console.log("Error fetching cart data:", error.response);
      if (error.response?.statusText === "Unauthorized") {
        return {
          success: false,
          message: "Unauthorized access",
          data: null,
          notAuthenticated: true,
        };
      }
    }
    return { success: false, message: "Failed to retrieve cart data" };
  }
};

export const addToCart = async (
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
    const response = await api.post(
      "/add-to-cart",
      {
        product_id: productID,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Add to cart response:", response.data);
    if (response.data.result === "Success") {
      // console.log("Item added to cart successfully", response.data);
      return {
        success: true,
        data: response.data.message,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.statusText === "Unauthorized") {
        return {
          success: false,
          message: "Unauthorized access",
          data: null,
          notAuthenticated: true,
        };
      }
    }
    return {
      success: false,
      message: "Failed to add item to cart",
      data: null,
      notAuthenticated: null,
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
    const response = await api.post(
      "/update-cart-item",
      {
        product_id: productID,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
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
      };
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      if (error.response?.statusText === "Unauthorized") {
        console.log(error.response.data);
        return {
          success: false,
          message: "Unauthorized access",
          data: null,
          notAuthenticated: true,
        };
      }
    }
    return {
      success: false,
      message: "Failed to update item in cart",
      data: null,
      notAuthenticated: null,
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
    const response = await api.post(
      `/remove-cart-item/${productID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Add to cart response:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.message,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.statusText === "Unauthorized") {
        return {
          success: false,
          message: "Unauthorized access",
          data: null,
          notAuthenticated: true,
        };
      }
    }
    return {
      success: false,
      message: "Failed to remove item from cart",
      data: null,
      notAuthenticated: null,
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
    console.log("Add coupon response:", response.data);
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
  } catch (error) {
    console.log("Error adding coupon to cart:", error);
    if (error instanceof AxiosError) {
      console.log("Error adding coupon to cart:", error.response?.statusText);
      if (error.response?.statusText === "Unauthorized") {
        return {
          success: false,
          message: "Unauthorized access",
          data: null,
          notAuthenticated: true,
        };
      }
    }
    return {
      success: false,
      message: "Failed to add coupon to cart",
      data: null,
      notAuthenticated: null,
    };
  }
};
