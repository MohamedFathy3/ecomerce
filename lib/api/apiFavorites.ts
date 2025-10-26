"use server";

import { api } from "../axios";
import { AxiosError } from "axios";
import { auth } from "../auth";
import { delay } from "../utils";
import { FavoriteItem } from "@/types";
import { revalidatePath } from "next/cache";

export const getFavorites = async () => {
  const session = await auth();
  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "User not authenticated" };
  }
  const token = session?.user?.token || session?.accessToken;
  try {
    const response = await api.get("/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response", response.data);
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
      "/favorites/add",
      {
        product_id: productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response.data);
    if (response.data.result === "Success") {
      // revalidatePath("/favorites");
      // await delay(100); // Delay to ensure revalidation is processed
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
      console.log("Error adding to favorites:", error.response);
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
    const response = await api.delete(`/favorites/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response.data);
    if (response.data.result === "Success") {
      // revalidatePath("/favorites");
      // await delay(100); // Delay to ensure revalidation is processed
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
    }
    return {
      success: false,
      message: "Failed to remove from favorites",
      notAuthenticated: null,
      data: null,
    };
  }
};
