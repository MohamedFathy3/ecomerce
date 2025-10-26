"use server";

import { api } from "../axios";
import { AxiosError } from "axios";
import { auth } from "../auth";
import { wallet } from "@/types";
// import { WalletDetails } from "@/types";

export const getWalletDetails = async (token?: string) => {
  try {
    if (!token) {
      const session = await auth();
      token = session?.user?.token || session?.accessToken || "";
      if (!session || !session.user || !session.accessToken) {
        return { success: false, message: "User not authenticated" };
      }
    }
    const response = await api.get("user-wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Wallet details response:", response.data);
    if (response.data.result === "Success") {
      return { success: true, data: response.data.data as wallet };
    }
    return {
      success: false,
      message: response.data.message || "Failed to retrieve wallet details",
    };
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
};
