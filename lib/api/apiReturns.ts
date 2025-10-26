import { api } from "../axios";
import { AxiosError } from "axios";
import { ReturnedRequest, ReturnRequest } from "@/types";
import { getAuthToken } from "./helpers";

export async function CreateReturnRequest(
  data: ReturnRequest,
  userToken?: string
) {
  try {
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return { success: false, message: authResult.message };
    }
    const token = authResult.token;

    // Create FormData to handle file uploads
    const formData = new FormData();
    formData.append("order_id", data.order_id);
    formData.append("return_reason", data.return_reason);

    // Add each item with its image file
    data.items.forEach((item, index) => {
      formData.append(
        `items[${index}][order_item_id]`,
        item.order_item_id.toString()
      );
      formData.append(`items[${index}][quantity]`, item.quantity.toString());

      // Only append image if it exists and is a File
      if (item.image && item.image instanceof File) {
        formData.append(`items[${index}][image]`, item.image);
      }
    });

    const response = await api.post("returns/request-return", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("return response: ", response);
    if (response.data.result === "Success") {
      return { success: true, data: response.data.data };
    }
    return {
      success: false,
      message: response.data.message || "Failed to submit return request",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error creating return request:", error.response);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create return request",
      };
    }
  }
}

export async function getReturnedRequests(userToken?: string) {
  try {
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return { success: false, message: authResult.message };
    }
    const token = authResult.token;

    const response = await api.get("returns", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data.returns as ReturnedRequest[],
      };
    }
    return {
      success: false,
      message: response.data.message || "Failed to retrieve return requests",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error fetching return requests:", error.response);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to retrieve return requests",
      };
    }
  }
}

export async function getReturnRequestDetails(
  requestId: string,
  userToken?: string
) {
  try {
    const authResult = await getAuthToken(userToken);
    if (!authResult.success) {
      return { success: false, message: authResult.message };
    }
    const token = authResult.token;

    const response = await api.get(`returns/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Return request details:", response.data);
    if (response.data.result === "Success") {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message:
        response.data.message || "Failed to retrieve return request details",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error fetching return request details:", error.response);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to retrieve return request details",
      };
    }
  }
}
