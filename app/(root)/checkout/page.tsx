// app/checkout/page.tsx
import { auth, signOut } from "@/lib/auth";
import { getCartData } from "@/lib/api/apiCart";
import { getAllCountries } from "@/lib/api/apiCountries";
import { CartItem, Country } from "@/types";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";

export default async function CheckoutPage() {
  const session = await auth();
  
  // التحقق من المصادقة
  if (!session || !session.user || !session.accessToken) {
    redirect("/signin?callbackUrl=/checkout");
  }

  // جلب بيانات السلة والبلاد بالتوازي
  const [cartData, countries] = await Promise.all([
    getCartData(),
    getAllCountries()
  ]);

  // إذا لم يكن المستخدم مصادقاً
  if (cartData?.notAuthenticated) {
    await signOut({ redirectTo: "/signin" });
    return null;
  }

  // إذا كانت السلة فارغة
  if (cartData?.empty || !cartData?.data || cartData.data.items.length === 0) {
    return (
      <section className="wrapper mx-auto px-4 md:px-8 !py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Items in Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please add some products to your cart first.</p>
          <Link 
            href="/products" 
            className="bg-[#e30a02] text-white px-6 py-2 rounded-lg hover:bg-[#e30a02]/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  const cartItems: CartItem[] = cartData.data.items;

  return (
    <section className="wrapper mx-auto px-4 md:px-8 !py-8 md:!py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete your purchase</p>
      </div>

      <CheckoutForm cartItems={cartItems} countries={countries} />
    </section>
  );
}