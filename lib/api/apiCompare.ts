import { ProductItemCompare } from "@/types";
import { api } from "../axios";

// guest-user/compare/list
export async function getCompareList(ids: number[]) {
  try {
    const response = await api.get("guest-user/compare/list", {
      params: { products: ids },
    });
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data as ProductItemCompare[],
      };
    }
    return {
      success: false,
      data: [],
      message: response.data.message || "Failed to fetch compare list",
    };
  } catch (error) {
    console.error("Error fetching compare list:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch compare list",
    };
  }
}
