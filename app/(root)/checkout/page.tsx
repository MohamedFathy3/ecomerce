"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyEGP } from "@/lib/utils";
import { CartItem } from "@/types";
import { createOrder, createPayment, clearCart } from "@/lib/api/apiOrders";
import Image from "next/image";
import Link from "next/link";

// Popup Component
const SuccessPopup = ({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

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
          Your order <span className="font-semibold text-primary">#{orderNumber}</span> has been placed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to home page in 3 seconds...
        </p>
        
        <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-green-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  // جلب بيانات الـ Cart
  useEffect(() => {
    const cartData = searchParams.get('cartData');
    if (cartData) {
      try {
        const parsedCartItems = JSON.parse(cartData);
        setCartItems(parsedCartItems);
        console.log("🛒 [Checkout] Cart items loaded:", parsedCartItems);
      } catch (error) {
        console.error("❌ [Checkout] Error parsing cart data:", error);
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [searchParams, router]);

  // إذا مفيش منتجات
  if (cartItems.length === 0 && !showSuccessPopup) {
    return (
      <section className="wrapper mx-auto px-4 md:px-8 !py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items in Cart</h1>
          <p className="text-gray-600 mb-6">Please add some products to your cart first.</p>
          <Link 
            href="/products" 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

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
    // مسح الـ cart من الـ localStorage أو session إذا كان مخزن
    localStorage.removeItem('cart_data');
    sessionStorage.removeItem('cart_data');
    
    // Redirect إلى الـ home
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
        alert("Failed to create order. Please try again.");
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

      // Step 4: Show Success Popup
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
      <section className="wrapper mx-auto px-4 md:px-8 !py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Checkout Form */}
            <Card className="bg-white shadow-md rounded-xl border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+20 123 456 7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line *
                    </label>
                    <input
                      type="text"
                      name="address_line"
                      required
                      value={formData.address_line}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Cairo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Cairo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      required
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      name="payment_method"
                      required
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="wallet">E-Wallet</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="promo_code"
                      value={formData.promo_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="SUMMER2024"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-white shadow-md rounded-xl border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                  
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
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center border">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.card.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {formatCurrencyEGP(parseFloat(item.card.price))}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatCurrencyEGP(parseFloat(item.card.price) * item.quantity)}
                          </div>
                          {item.card.discount && parseFloat(item.card.discount) > 0 && (
                            <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                              {item.card.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium">{totalItems}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Products Total:</span>
                        <span className="font-medium">{formatCurrencyEGP(totalPrice)}</span>
                      </div>

                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-primary">
                          {formatCurrencyEGP(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : `Pay ${formatCurrencyEGP(totalPrice)}`}
                  </button>

                  <Link
                    href="/cart"
                    className="block w-full mt-3 bg-gray-200 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Back to Cart
                  </Link>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span>Secure SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span>Free Shipping Over 500 EGP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span>14-Day Return Policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </section>

      {/* CSS للـ progress bar */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </>
  );
}