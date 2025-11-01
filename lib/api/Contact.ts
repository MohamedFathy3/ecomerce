// lib/api/Contact.ts
import { api } from "../axios";
import { AxiosError } from "axios";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function saveContact(contactData: ContactFormData) {
  try {
    console.log("📨 Sending contact data:", contactData);
    
    const response = await api.post("/contacts", contactData);
    
    console.log("✅ Contact API response:", response.data);
    
    // تحقق من النجاح بطرق مختلفة
    if (response.data.data || response.status === 200 || response.status === 201) {
      return { 
        success: true, 
        data: response.data.data,
        message: "Message sent successfully"
      };
    }
    
    return {
      success: false,
      message: "Failed to send message",
    };
  } catch (error) {
    console.error("❌ Contact save error:", error);
    
    if (error instanceof AxiosError) {
      console.log("🔍 Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Handle validation errors (422)
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        return {
          success: false,
          message: `Validation failed: ${errorMessages}`,
          errors: validationErrors,
        };
      }

      // Handle other HTTP errors
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }

      return { 
        success: false, 
        message: error.message || "Network error occurred" 
      };
    }
    
    return { 
      success: false, 
      message: "An unknown error occurred" 
    };
  }
}