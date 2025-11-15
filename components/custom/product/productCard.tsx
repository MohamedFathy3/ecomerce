// components/custom/product/productCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCardAddCart from "./productCardAddCart";
import ButtonFavorite from "./buttonFavorite";
import { FavoriteItem, ProductItem } from "@/types";

interface ProductCardProps {
  productItem: ProductItem;
  initialInFavorites?: boolean; // نضيف prop علشان نخلي الـ parent يتحكم في حالة الـ favorites
}

const ProductCard = ({ productItem, initialInFavorites = false }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [inFavorites, setInFavorites] = useState(initialInFavorites);

  // تحديد الصور المتاحة للعرض
  const availableImages = [
    productItem.image,
    ...(productItem.gallery || [])
  ].filter(Boolean) as string[];

  const hasMultipleImages = availableImages.length > 1;
  const hasDiscount = productItem.discount && parseFloat(productItem.discount) > 0;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // تغيير الصورة عند click على النقاط
  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group w-full h-full flex flex-col">
      
      {/* قسم الصورة */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Link href={`/product/${productItem.id}`} className="block w-full h-full">
          
          {/* حالة الخطأ - صورة بديلة */}
          {imageError || availableImages.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">No Image</span>
            </div>
          ) : (
            <>
              {/* الصورة الرئيسية */}
              <Image
                src={availableImages[currentImageIndex]}
                alt={productItem.name}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={currentImageIndex === 0}
              />

              {/* Badge للخصم */}
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10 shadow-md">
                  -{productItem.discount}%
                </div>
              )}

              {/* Badge للـ Out of Stock */}
              {productItem.quantity <= 0 && (
                <div className="absolute top-3 right-3 bg-gray-700 text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10 shadow-md">
                  Out of Stock
                </div>
              )}
            </>
          )}

          {/* النقاط (Dots) للتنقل بين الصور - تحت الصورة مباشرة */}
          {hasMultipleImages && availableImages.length > 0 && !imageError && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {availableImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(index, e)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-white ${
                    index === currentImageIndex 
                      ? 'bg-red-500 scale-110'
                      : 'bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* زر الـ Favorites في الزاوية */}
        {/* <div className="absolute top-3 right-3 z-10">
          <ButtonFavorite 
            inFavorites={inFavorites} 
            productId={productItem.id} 
          />
        </div> */}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${productItem.id}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-tight">
            {productItem.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          {hasDiscount && productItem.old_price && (
            <span className="text-base text-gray-500 line-through font-medium">
              {productItem.old_price} {productItem.currency}
            </span>
          )}
          <span className={`text-xl font-bold ${
            hasDiscount ? 'text-red-600' : 'text-green-600'
          }`}>
            {productItem.price} {productItem.currency}
          </span>
        </div>

        {/* الوصف القصير */}
        {productItem.short_description && (
          <p className="text-gray-600 line-clamp-2 mb-3 text-sm leading-relaxed">
            {productItem.short_description}
          </p>
        )}

        {/* قسم المخزون وإضافة إلى السلة */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          {/* حالة المخزون */}
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            productItem.quantity > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {productItem.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>

          {/* زر إضافة إلى السلة */}
          <ProductCardAddCart productItem={productItem} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;