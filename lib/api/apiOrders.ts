"use server";

import { api } from "../axios";
import { AxiosError } from "axios";
import { auth } from "../auth";
import {
  OrderDetails,
  OrderItem,
  orderSaveParams,
  PaymentMethod,
} from "@/types";
import { getAuthToken } from "./helpers";

export async function saveOrder(
  orderParams: orderSaveParams,
  userToken?: string
) {
  let token: string = "";
  if (!userToken) {
    const session = await auth();
    token = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      return { success: false, message: "User not authenticated" };
    }
  }

  try {
    console.log(orderParams);
    const response = await api.post("/orders", orderParams, {
      headers: {
        Authorization: `Bearer ${token || userToken}`,
      },
    });
    console.log("response", response.data);
    if (response.data.result === "Success") {
      return { success: true, data: response.data.data };
    }
    return {
      success: false,
      message: response.data.message || "Failed to save order",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Order save error:", error.response?.data || error.message);

      // Handle validation errors (422) with detailed error messages
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        return {
          success: false,
          message: `Validation failed: ${errorMessages}`,
          errors: validationErrors,
        };
      }

      // Handle other HTTP errors with server message
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }

      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function getUserOrders(userToken?: string) {
  let token: string = "";
  if (!userToken) {
    const session = await auth();
    token = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      return { success: false, message: "User not authenticated" };
    }
  } else {
    token = userToken;
  }

  try {
    const response = await api.get("/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.result === "Success") {
      return { success: true, data: response.data.data as OrderItem[] };
    }
    return {
      success: false,
      message: response.data.message || "Failed to retrieve orders",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function getOrderDetails(userToken: string, orderId: number) {
  let token: string = "";
  if (!userToken) {
    const session = await auth();
    token = session?.user?.token || session?.accessToken || "";
    if (!session || !session.user || !session.accessToken) {
      return { success: false, message: "User not authenticated" };
    }
  } else {
    token = userToken;
  }

  try {
    const response = await api.get(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.result === "Success") {
      return { success: true, data: response.data.data as OrderDetails };
    }
    return {
      success: false,
      message: response.data.message || "Failed to retrieve order details",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function cancelOrder(orderId: number, userToken?: string) {
  try {
    if (!userToken) {
      const session = await auth();
      userToken = session?.user?.token || session?.accessToken || "";
      if (!session || !session.user || !session.accessToken) {
        return { success: false, message: "User not authenticated" };
      }
    }
    const response = await api.post(
      `/orders/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log("Cancel order response:", response.data);
    if (response.data.result === "Success") {
      return { success: true, data: response.data.data };
    }
    return {
      success: false,
      message: response.data.message || "Failed to cancel order",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function getPaymentMethods(userToken?: string) {
  const authResult = await getAuthToken(userToken);
  if (!authResult.success) {
    return { success: false, message: authResult.message };
  }
  const token = authResult.token;

  try {
    const response = await api.get("payment-methods/index", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.result === "Success") {
      return { success: true, data: response.data.data as PaymentMethod[] };
    }
    return {
      success: false,
      message: response.data.message || "Failed to retrieve payment methods",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}
