// lib/api/apiFavorites.ts
"use server";

import { api } from "../axios";
import { AxiosError } from "axios";
import { auth } from "../auth";
import { FavoriteItem } from "@/types";

export const getFavorites = async () => {
  const session = await auth();
  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "User not authenticated" };
  }
  const token = session?.user?.token || session?.accessToken;
  try {
    const response = await api.get("/front/favorite", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res = response.data.data;
    if (res.length > 0) {
      return {
        success: true,
        data: res as FavoriteItem[],
      };
    } else {
      return { success: true, message: "No favorites found", empty: true };
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
    return { success: false, message: "Failed to retrieve favorites" };
  }
};

export const addToFavorites = async (
  prevState: unknown,
  formInputs: FormData
) => {
  const session = await auth();
  if (!session || !session.user || !session.accessToken) {
    return {
      success: false,
      message: "User not authenticated",
      notAuthenticated: true,
      data: null,
    };
  }
  const token = session?.user?.token || session?.accessToken;
  const productId = formInputs.get("productId");
  try {
    const response = await api.post(
      "/front/favorite",
      {
        card_id: productId,
        method: 'add' // صححت typo من 'methed' إلى 'method'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ [API] Add to favorites response:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        message: "Added to favorites",
      };
    }
    return {
      success: false,
      data: null,
      message: "Failed to add to favorites",
      notAuthenticated: false,
    };
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
      console.log("❌ [API] Error adding to favorites:", error.response?.data);
    }

    return {
      success: false,
      message: "Error to add to favorites",
      notAuthenticated: null,
      data: null,
    };
  }
};

export const removeFromFavorites = async (
  prevState: unknown,
  formInputs: FormData
) => {
  const session = await auth();
  if (!session || !session.user || !session.accessToken) {
    return {
      success: false,
      message: "User not authenticated",
      notAuthenticated: true,
      data: null,
    };
  }
  const token = session?.user?.token || session?.accessToken;
  const productId = formInputs.get("productId");
  try {
    const response = await api.post( // غيرت من DELETE إلى POST
      "/front/favorite",
      {
        card_id: productId,
        method: 'delete' // استخدم method: 'delete' حسب الـ API
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ [API] Remove from favorites response:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        message: "Removed from favorites",
      };
    }
    return {
      success: false,
      data: null,
      message: "Failed to remove from favorites",
      notAuthenticated: false,
    };
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
      console.log("❌ [API] Error removing from favorites:", error.response?.data);
    }
    return {
      success: false,
      message: "Failed to remove from favorites",
      notAuthenticated: null,
      data: null,
    };
  }
};