"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyEGP } from "@/lib/utils";
import { CartItem } from "@/types";
import { createOrder, createPayment, clearCart } from "@/lib/api/apiOrders";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

// Popup Component
const SuccessPopup = ({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your order <span className="font-semibold text-[#e30a02]">#{orderNumber}</span> has been placed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to home page...
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-[#e30a02] text-white py-3 rounded-lg hover:bg-[#e30a02]/90 transition-colors font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

interface CheckoutFormProps {
  cartItems: CartItem[];
}

export default function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    zip_code: "",
    payment_method: "card",
    promo_code: ""
  });

  // حساب الإجماليات
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.card?.price || "0");
    return sum + (price * item.quantity);
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.push('/');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🔄 [Checkout] Starting checkout process...");

      // Step 1: Create Order
      const orderData = {
        ...formData,
        cards: cartItems.map(item => ({
          id: item.card.id,
          qty: item.quantity
        }))
      };

      console.log("📦 [Checkout] Order data:", orderData);

      const orderResult = await createOrder(orderData);
      
      if (!orderResult.success || !orderResult.order_number) {
        alert(orderResult.message || "Failed to create order. Please try again.");
        return;
      }

      const orderNum = orderResult.order_number;
      console.log("✅ [Checkout] Order created successfully. Order Number:", orderNum);

      // Step 2: Create Payment (اختياري - حسب نظام الدفع)
      const paymentData = {
        amount: totalPrice,
        currency: "EGP",
        order_id: orderNum,
        description: `Order #${orderNum} - ${totalItems} items`,
        redirect_url: `${window.location.origin}/payment-success`,
        transaction_type: "Retail",
        email: formData.email,
        country: "EG",
        webhook_url: `${window.location.origin}/api/webhooks/payment`
      };

      console.log("💳 [Checkout] Payment data:", paymentData);

      // Step 3: Clear Cart بعد ما الطلب ينجح
      console.log("🗑️ [Checkout] Clearing cart...");
      await clearCart();

      // Step 4: Invalidate React Query Cache - ده اللي هيمسح الـ cart من الـ cache
      console.log("🔄 [Checkout] Invalidating cart query...");
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Optional: يمكنك إضافة إعادة جلب البيانات فوراً
      await queryClient.refetchQueries({ queryKey: ["cart"] });

      console.log("✅ [Checkout] Cart cache invalidated successfully");

      // Step 5: Show Success Popup
      setOrderNumber(orderNum);
      setShowSuccessPopup(true);

    } catch (error) {
      console.error("❌ [Checkout] Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup 
          orderNumber={orderNumber} 
          onClose={handleSuccessPopupClose} 
        />
      )}

      {/* Checkout Form */}
      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Checkout Form */}
          <Card className="bg-white dark:bg-slate-800 shadow-sm md:shadow-md rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address Line *
                  </label>
                  <input
                    type="text"
                    name="address_line"
                    required
                    value={formData.address_line}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Cairo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Cairo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    required
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="payment_method"
                    required
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="wallet">E-Wallet</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="promo_code"
                    value={formData.promo_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="SUMMER2024"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 shadow-sm md:shadow-md rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {item.card.image ? (
                          <Image
                            src={item.card.gallery?.[0] || item.card.image}
                            alt={item.card.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-600 flex items-center justify-center border">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.card.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formatCurrencyEGP(parseFloat(item.card.price))}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
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

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Products Total:</span>
                      <span className="font-medium">{formatCurrencyEGP(totalPrice)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-slate-600">
                      <span className="text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-[#e30a02]">
                        {formatCurrencyEGP(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-[#e30a02] text-white py-3 rounded-lg hover:bg-[#e30a02]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processing..." : `Pay ${formatCurrencyEGP(totalPrice)}`}
                </button>

                <Link
                  href="/cart"
                  className="block w-full mt-3 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 text-center py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors font-medium"
                >
                  Back to Cart
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}