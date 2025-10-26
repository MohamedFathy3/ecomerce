// app/(root)/compare/page.tsx

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Pill,
  Info,
  PackageCheck,
  Landmark,
  AlertTriangle,
  CircleCheckBig,
  Star,
  Calendar,
  Building2,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useCompare } from "@/contexts/CompareContext";
import { getCompareList } from "@/lib/api/apiCompare";
import { ProductItemCompare } from "@/types";
import { formatCurrencyEGP } from "@/lib/utils";
import AddToCart from "@/components/custom/product/addToCart";
import TextExpander from "@/components/custom/textExpander";

const ProductComparison = () => {
  const { compareItems } = useCompare();
  const [compareList, setCompareList] = useState<ProductItemCompare[]>([]);

  const handleFetchItems = useCallback(async () => {
    const itemsResponse = await getCompareList(compareItems);
    if (itemsResponse.success) {
      setCompareList(itemsResponse.data);
    } else {
      setCompareList([]);
    }
  }, [compareItems]);

  useEffect(() => {
    handleFetchItems();
  }, [handleFetchItems]);

  return (
    <main className="wrapper text-sm sm:text-base">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        مقارنة المنتجات
      </h1>
      {/* Removed global search grid; moved input into each column */}
      {compareList.length === 0 ? (
        <div className="text-center text-muted-foreground">
          لا توجد منتجات للمقارنة. يرجى إضافة منتجات إلى قائمة المقارنة.
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-muted max-w-6xl mx-auto">
          {compareList.map((product, index) => (
            <div
              key={`${index}-${product.id}`}
              className={` px-3 md:px-10 flex flex-col space-y-3 sm:space-y-5 ${
                index === 1 ? "pe-0" : "ps-0"
              }`}
            >
              {/* Product Image */}

              <Avatar className="w-32 h-32 md:w-44 md:h-44 lg:w-60 lg:h-60 mx-auto  !rounded-md">
                <AvatarImage
                  src={product.image || undefined}
                  alt={product.name}
                  className="object-contain rounded-md"
                />
                <AvatarFallback className="text-2xl !rounded-md">
                  {product.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Product Info */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-center">
                  {product.name}
                </h2>
                <p className="text-sm text-muted-foreground text-center">
                  الاسم العلمي: {product.generic_name}
                </p>
                <div className="text-sm text-muted-foreground text-center">
                  <TextExpander content={product.description} />
                </div>
                <div className="flex justify-center">
                  <Badge variant="secondary">{product.type}</Badge>
                </div>
              </div>

              {/* Product Details */}
              <ul className="text-sm space-y-3">
                <li className="flex gap-2 items-start">
                  <Building2 className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>الصيدلية:</strong> {product.pharmacy.name}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <Landmark className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>الفئة:</strong> {product.categoryName}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <Info className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>العلامة التجارية:</strong> {product.brandName}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <Pill className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>الشكل:</strong> {product.form}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <PackageCheck className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>التركيز:</strong> {product.strength}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <CircleCheckBig className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>السعر:</strong> {formatCurrencyEGP(product.price)}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <CircleCheckBig className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>الكمية المتاحة:</strong> {product.quantity}
                  </span>
                </li>
                {product.pack_size && (
                  <li className="flex gap-2 items-start">
                    <PackageCheck className="text-teal-600 mt-1" size={16} />
                    <span>
                      <strong>حجم العبوة:</strong> {product.pack_size}
                    </span>
                  </li>
                )}
                <li className="flex gap-2 items-start">
                  <Calendar className="text-teal-600 mt-1" size={16} />
                  <span>
                    <strong>تاريخ الإنتاج:</strong>{" "}
                    {new Date(product.production_date).toLocaleDateString(
                      "ar-EG"
                    )}
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <AlertTriangle className="text-yellow-600 mt-1" size={16} />
                  <span>
                    <strong>تاريخ الانتهاء:</strong>{" "}
                    {new Date(product.expiry_date).toLocaleDateString("ar-EG")}
                  </span>
                </li>

                {/* Ratings */}
                <li className="flex gap-2 items-start">
                  <Star className="text-yellow-500 mt-1" size={16} />
                  <span>
                    <strong>تقييم المستخدمين:</strong>{" "}
                    {product.average_rating.user}/5 (
                    {product.average_rating.count_user_rate} تقييم)
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <Star className="text-blue-500 mt-1" size={16} />
                  <span>
                    <strong>تقييم الصيادلة:</strong>{" "}
                    {product.average_rating.pharmacist}/5 (
                    {product.average_rating.count_pharmacist_rate} تقييم)
                  </span>
                </li>
              </ul>

              {/* Offer Badge */}
              {product.offer && (
                <div className="flex justify-center">
                  <Badge variant="destructive">
                    خصم {product.offer.discount_percentage}% -{" "}
                    {formatCurrencyEGP(product.offer.price_after)}
                  </Badge>
                </div>
              )}

              {/* <AddToCart /> */}

              {/* <Button className="w-full mt-auto">
                <ShoppingCart className="ml-2 h-4 w-4" />
                أضف إلى السلة (
                {formatCurrencyEGP(product.offer?.price_after || product.price)}
                )
              </Button> */}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductComparison;
