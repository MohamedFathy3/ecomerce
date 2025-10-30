// "use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCartData } from "@/lib/api/apiCart";
import { auth, signOut } from "@/lib/auth";
import { formatCurrencyEGP } from "@/lib/utils";
import { CartData, CartItem } from "@/types";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Cart() {
  const session = await auth();
  const cartData = await getCartData();
  
  let cart: CartData | null = null;
  const isAuthenticated = session && session.user && session.accessToken;

  if (!isAuthenticated) {
    redirect("/signin?callbackUrl=/cart");
  }

  if (cartData?.notAuthenticated) {
    await signOut({ redirectTo: "/signin" });
    return null;
  }

  if (cartData?.empty || !cartData?.data || cartData.data.items.length === 0) {
    return (
      <section className="wrapper mx-auto px-4 md:px-8 !py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <ShoppingCartIcon className="inline-block me-2" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Your cart is empty
          </p>
          <Link 
            href="/products" 
            className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  cart = cartData.data;

  // Calculate totals
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.card?.price || "0");
    return sum + (price * item.quantity);
  }, 0);

  return (
    <section className="wrapper mx-auto px-4 md:px-8 !py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          <ShoppingCartIcon className="inline-block me-2" />
          Shopping Cart
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your shopping cart items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Display all cart items in one card */}
        <Card className="bg-white dark:bg-slate-800 shadow-md rounded-xl border border-gray-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-teal-900 dark:text-teal-400">
                All Products
              </h2>
              <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                Products: {totalItems}
              </Badge>
            </div>

            <div className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-4 border border-gray-100 dark:border-slate-600 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {item.card.image ? (
                      <Image
                        src={item.card.image}
                        alt={item.card.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover w-16 h-16 border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center border">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.card.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.card.short_description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price: {formatCurrencyEGP(parseFloat(item.card.price))}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {formatCurrencyEGP(parseFloat(item.card.price) * item.quantity)}
                    </div>
                    {item.card.discount && parseFloat(item.card.discount) > 0 && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs mt-1">
                        {item.card.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Subtotal:
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {formatCurrencyEGP(totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
             <Link
  href={{
    pathname: "/checkout",
    query: { 
      cartData: JSON.stringify(cart.items) // نمرر بيانات الـ Cart
    }
  }}
  className="flex-1 bg-primary text-white text-center py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
>
  Proceed to Checkout
</Link>
              <Link
                href="/products"
                className="flex-1 bg-gray-200 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-white dark:bg-slate-800 shadow-md rounded-xl border border-gray-200 dark:border-slate-700 h-fit">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Products Total:</span>
                <span className="font-medium">{formatCurrencyEGP(totalPrice)}</span>
              </div>

              {cart.items.some(item => item.card.discount && parseFloat(item.card.discount) > 0) && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>You Save:</span>
                  <span className="font-medium">
                    {formatCurrencyEGP(
                      cart.items.reduce((savings, item) => {
                        if (item.card.discount && item.card.old_price) {
                          const discount = parseFloat(item.card.discount);
                          const oldPrice = parseFloat(item.card.old_price);
                          const saving = (oldPrice * discount / 100) * item.quantity;
                          return savings + saving;
                        }
                        return savings;
                      }, 0)
                    )}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-slate-600 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {formatCurrencyEGP(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-shipping-fast"></i>
                <span>Free shipping on orders over 500 EGP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-undo"></i>
                <span>Free returns within 14 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-shield-alt"></i>
                <span>Secure payment processing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}