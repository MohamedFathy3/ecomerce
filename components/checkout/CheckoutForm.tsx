// components/checkout/CheckoutForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CartItem, Country } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '@/contexts/LanguageContext';
import { processCheckout } from '@/app/actions/checkout';

// Popup Component
const SuccessPopup = ({ orderNumber, onClose, t }: { orderNumber: string; onClose: () => void; t: (key: string) => string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.success.title')}</h2>
        <p className="text-gray-600 mb-4">
          {t('checkout.success.message')} <span className="font-semibold text-[#e30a02]">#{orderNumber}</span>
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-[#e30a02] text-white py-3 rounded-lg hover:bg-[#e30a02]/90 transition-colors font-medium"
        >
          {t('checkout.success.continueShopping')}
        </button>
      </div>
    </div>
  );
};

interface CheckoutFormProps {
  cartItems: CartItem[];
  countries: Country[];
}

export default function CheckoutForm({ cartItems, countries }: CheckoutFormProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0] || {
    id: 1,
    name: "Netherlands",
    iso_code: null,
    shipping_price: "0.00",
    currency: "EUR",
    created_at: "",
    updated_at: ""
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line: "",
    house_number: "",
    city: "",
    apartment: "",
    zip_code: "",
    country: countries[0]?.name || "Netherlands",
    payment_method: "card",
    promo_code: ""
  });

  

  // حساب الإجماليات
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const productsTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.card?.price || "0");
    return sum + (price * item.quantity);
  }, 0);

  const shippingPrice = parseFloat(selectedCountry.shipping_price);
  const totalAmount = productsTotal + shippingPrice;

  // تحديث البلد المختار
  useEffect(() => {
    const country = countries.find(c => c.name === formData.country);
    if (country) {
      setSelectedCountry(country);
    }
  }, [formData.country, countries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = countries.find(c => c.name === countryName);
    
    if (country) {
      setSelectedCountry(country);
      setFormData({
        ...formData,
        country: countryName
      });
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.push('/');
    router.refresh();
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🔄 [Client] Starting checkout process...");

      // التحقق من صحة البيانات
      if (!formData.full_name || !formData.email || !formData.phone) {
        alert("Please fill all required fields");
        return;
      }

      // استخدام Server Action - بدون إرسال بيانات الشحن منفصلة
      const result = await processCheckout(formData, cartItems);
      
      if (!result.success) {
        alert(result.message || t('checkout.errors.orderFailed'));
        return;
      }

      // عرض نافذة النجاح
      setOrderNumber(result.order_number!);
      setShowSuccessPopup(true);

    } catch (error) {
      console.error("❌ [Client] Checkout error:", error);
      alert(t('checkout.errors.generic'));
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
          t={t}
        />
      )}

      {/* Checkout Form */}
      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Checkout Form */}
          <Card className="bg-white dark:bg-slate-800 shadow-sm md:shadow-md rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                {t('checkout.shippingInfo')}
              </h2>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.fullName')} *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.placeholders.fullName')}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.placeholders.email')}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.placeholders.phone')}
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.street')} *
                  </label>
                  <input
                    type="text"
                    name="address_line"
                    required
                    value={formData.address_line}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.placeholders.street')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* House Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.houseNumber')} *
                    </label>
                    <input
                      type="text"
                      name="house_number"
                      required
                      value={formData.house_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={t('checkout.placeholders.houseNumber')}
                    />
                  </div>

                  {/* Apartment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.apartment')}
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={t('checkout.placeholders.apartment')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.city')} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={t('checkout.placeholders.city')}
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.postalCode')} *
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      required
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={t('checkout.placeholders.postalCode')}
                    />
                  </div>
                </div>

                {/* Country Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.country')} *
                  </label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleCountryChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name} - {(parseFloat(country.shipping_price), country.currency)} {t('checkout.shipping')}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('checkout.shippingPriceFor')} {selectedCountry.name}: {(shippingPrice)}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.paymentMethod')} *
                  </label>
                  <select
                    name="payment_method"
                    required
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="card">{t('checkout.paymentOptions.card')}</option>
                    <option value="wallet">{t('checkout.paymentOptions.wallet')}</option>
                    <option value="bank">{t('checkout.paymentOptions.bank')}</option>
                  </select>
                </div>

                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.promoCode')}
                  </label>
                  <input
                    type="text"
                    name="promo_code"
                    value={formData.promo_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30a02] focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.placeholders.promoCode')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 shadow-sm md:shadow-md rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-700">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {t('checkout.orderSummary')}
                </h3>
                
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
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              {t('checkout.noImage')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.card.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('checkout.quantity')}: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {(parseFloat(item.card.price))}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {(parseFloat(item.card.price) * item.quantity)}
                        </div>
                        {item.card.discount && parseFloat(item.card.discount) > 0 && (
                          <Badge className="bg-[#e30a02] text-white text-xs mt-1">
                            {item.card.discount}% {t('checkout.off')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('checkout.totalItems')}:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('checkout.productsTotal')}:</span>
                      <span className="font-medium">{(productsTotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('checkout.shipping')} ({selectedCountry.name}):
                      </span>
                      <span className="font-medium">{(shippingPrice)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-slate-600">
                      <span className="text-gray-900 dark:text-white">{t('checkout.totalAmount')}:</span>
                      <span className="text-[#e30a02]">
                        {(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-[#e30a02] text-white py-3 rounded-lg hover:bg-[#e30a02]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('checkout.processing') : `${t('checkout.pay')} ${(totalAmount)}`}
                </button>

                <Link
                  href="/cart"
                  className="block w-full mt-3 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 text-center py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors font-medium"
                >
                  {t('checkout.backToCart')}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}