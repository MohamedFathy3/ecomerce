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
      <section className="wrapper mx-auto px-3 sm:px-4 md:px-6 !py-8 sm:!py-10 md:!py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            <ShoppingCartIcon className="inline-block me-2 w-5 h-5 sm:w-6 sm:h-6" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Your cart is empty
          </p>
          <Link 
            href="/products" 
            className="inline-block mt-4 bg-[#e30a02] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-[#e30a02]/90 transition-colors text-sm sm:text-base"
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
    <section className="wrapper mx-auto px-3 sm:px-4 md:px-6 !py-8 sm:!py-10 md:!py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <ShoppingCartIcon className="inline-block me-2 w-5 h-5 sm:w-6 sm:h-6" />
          Shopping Cart
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Manage your shopping cart items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Display all cart items in one card */}
        <Card className="bg-white dark:bg-slate-800 shadow-sm sm:shadow-md rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 lg:col-span-2">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-[#e30a02]">
                All Products
              </h2>
              <Badge className="bg-[#d39435] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </Badge>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {cart.items.map((item: CartItem) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 dark:border-slate-600 rounded-lg"
                >
                  <div className="flex-shrink-0 flex justify-center sm:justify-start">
                    {item.card.image ? (
                      <Image
                        src={item.card.image}
                        alt={item.card.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20 border"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center border">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {item.card.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.card.short_description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price: {formatCurrencyEGP(parseFloat(item.card.price))}
                      </span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                      {formatCurrencyEGP(parseFloat(item.card.price) * item.quantity)}
                    </div>
                    {item.card.discount && parseFloat(item.card.discount) > 0 && (
                      <Badge className="bg-[#e30a02] text-white text-xs mt-1">
                        {item.card.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Subtotal:
                </span>
                <span className="text-lg sm:text-xl font-bold text-[#e30a02]">
                  {formatCurrencyEGP(totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={{
                  pathname: "/checkout",
                  query: { 
                    cartData: JSON.stringify(cart.items)
                  }
                }}
                className="flex-1 bg-[#e30a02] text-white text-center py-2.5 sm:py-3 rounded-lg hover:bg-[#e30a02]/90 transition-colors font-medium text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-gray-200 text-gray-700 text-center py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="bg-white dark:bg-slate-800 shadow-sm sm:shadow-md rounded-lg sm:rounded-xl border border-gray-200 dark:border-slate-700 h-fit">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600 dark:text-gray-400">Products Total:</span>
                <span className="font-medium">{formatCurrencyEGP(totalPrice)}</span>
              </div>

              {cart.items.some(item => item.card.discount && parseFloat(item.card.discount) > 0) && (
                <div className="flex justify-between text-green-600 dark:text-green-400 text-sm sm:text-base">
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

              <div className="border-t border-gray-200 dark:border-slate-600 pt-2 sm:pt-3 mt-2 sm:mt-3">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-[#e30a02]">
                    {formatCurrencyEGP(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}