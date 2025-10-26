"use server";

import { plan, PlanSubscriptionFormData } from "@/types";
import { api } from "../axios";
import { AxiosError } from "axios";

/**
 * Get all available plans
 */
export async function getPlans() {
  try {
    const response = await api.get("plans");
    return {
      success: true,
      data: response.data.data as plan[],
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch plans",
        data: null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
}

/**
 * Get a specific plan by ID
 */
export async function getPlanById(planId: number) {
  try {
    const response = await api.get(`plans/${planId}`);
    return {
      success: true,
      data: response.data.data as plan,
    };
  } catch (error) {
    console.error("Error fetching plan:", error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch plan",
        data: null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
}

/**
 * Submit plan subscription
 */
export async function subscribeToPlan(data: PlanSubscriptionFormData) {
  try {
    const response = await api.post(`/plans/${data.plan_id}/subscribe`, data);
    if (response.data.result === "Success") {
      return {
        success: true,
        message: response.data.message || "Successfully subscribed to plan",
        errors: null,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to subscribe to plan",
        errors: null,
      };
    }
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    if (error instanceof AxiosError) {
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("; ");

        return {
          success: false,
          message: errorMessages,
          errors: errors,
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Failed to subscribe to plan",
        errors: null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      errors: null,
    };
  }
}
