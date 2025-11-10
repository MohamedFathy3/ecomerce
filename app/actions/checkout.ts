// app/actions/checkout.ts
'use server';

import { auth } from "@/lib/auth";
import { api } from "@/lib/axios";
import { CartItem } from "@/types";

interface CheckoutData {
  full_name: string;
  email: string;
  phone: string;
  address_line: string;
  house_number: string;
  city: string;
  apartment: string;
  zip_code: string;
  country: string;
  payment_method: string;
  promo_code: string;
}

export async function processCheckout(formData: CheckoutData, cartItems: CartItem[]) {
  try {
    const session = await auth();
    
    if (!session || !session.accessToken) {
      return {
        success: false,
        message: "Not authenticated"
      };
    }

    // تحضير بيانات الطلب
    const orderData = {
      name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      address_line: formData.address_line,
      house_number: formData.house_number,
      city: formData.city,
      apartment: formData.apartment || "",
      zip_code: formData.zip_code,
      state: formData.country,
      country: formData.country,
      payment_method: formData.payment_method,
      promo_code: formData.promo_code || "",
      cards: cartItems.map(item => ({
        id: item.card.id, // التغيير هنا: من card_id إلى id
        qty: item.quantity
      }))
    };

    console.log("🔄 [Server Action] Processing checkout:", orderData);

    const response = await api.post("/front/create-order", orderData, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log("✅ [Server Action] Checkout successful:", response.data);

    return {
      success: true,
      order_number: response.data.data.order_number,
      message: "Order placed successfully"
    };

  } catch (error: any) {
    console.error("❌ [Server Action] Checkout error:", error);
    
    if (error.response) {
      console.error("🔍 Error details:", {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message
      });
    }
    
    return {
      success: false,
      message: error.response?.data?.message || "Failed to process checkout"
    };
  }
}