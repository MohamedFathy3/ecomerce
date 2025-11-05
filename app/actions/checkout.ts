"use server";

import { auth, signOut } from "@/lib/auth";
import { createOrder, clearCart } from "@/lib/api/apiOrders";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address_line: string;
  house_number: string;
  city: string;
  zip_code: string;
  country: string;
  payment_method: string;
  promo_code?: string;
}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processCheckout(formData: CheckoutFormData, cartItems: any[]) {
  try {
    const session = await auth();
    
    if (!session || !session.accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    console.log("🔄 [Server Action] Processing checkout...");

    // Step 1: Create Order
    const orderData = {
      ...formData,
      state: formData.city, 
      cards: cartItems.map(item => ({
        id: item.card.id,
        qty: item.quantity
      }))
    };

    console.log("📦 [Server Action] Order data:", orderData);

    const orderResult = await createOrder(orderData, session.accessToken);
    
    if (!orderResult.success || !orderResult.order_number) {
      console.error("❌ [Server Action] Order creation failed:", orderResult.message);
      return { success: false, message: orderResult.message || "Failed to create order" };
    }

    const orderNum = orderResult.order_number;
    console.log("✅ [Server Action] Order created successfully. Order Number:", orderNum);

    // Step 2: Clear Cart
    console.log("🗑️ [Server Action] Clearing cart...");
    const clearResult = await clearCart(session.accessToken);
    
    if (!clearResult.success) {
      console.warn("⚠️ [Server Action] Cart clearing failed:", clearResult.message);
    } else {
      console.log("✅ [Server Action] Cart cleared successfully");
    }

    // Step 3: Revalidate cache
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { 
      success: true, 
      order_number: orderNum,
      message: "Order created successfully" 
    };

  } catch (error) {
    console.error("❌ [Server Action] Checkout error:", error);
    return { success: false, message: "An error occurred during checkout" };
  }
}