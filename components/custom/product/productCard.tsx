import { Heart, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FavoriteItem, ProductItem } from "@/types";
import StarRating from "../starRating";
import { auth } from "@/lib/auth";
import { getFavorites } from "@/lib/api/apiFavorites";
import ButtonFavorite from "./buttonFavorite";
import { Badge } from "@/components/ui/badge";
import ButtonAddToCompare from "./buttonAddToCompare";
import Image from "next/image";
import { CURRENCY_CODE } from "@/lib/constants";

const ProductCard = async ({ productItem }: { productItem: ProductItem }) => {
  const session = await auth();
  let inFavorites = false;
  if (session && session.user) {
    const res = await getFavorites();
    if (res && res.success && !res.empty) {
      const favorites = res.data as FavoriteItem[];
      inFavorites = favorites.some((item) => item.id === productItem.id);
    }
  }
  const isValidImage =
    productItem.image &&
    (productItem.image.endsWith(".jpg") || productItem.image.endsWith(".png"));

  const image = isValidImage ? productItem.image : "/images/no-image.jpg";

  return (
    <div className="bg-white dark:bg-slate-800 w-full rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 h-full flex flex-col gap-3 relative transition-all duration-300 hover:shadow-md">
      {/* Favorite Button */}
      <div className="absolute top-3 end-3 z-10">
        <ButtonFavorite inFavorites={inFavorites} productId={productItem.id} />
      </div>

      {/* Product Image - الصورة من فوق */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
        <Link href={`/product/${productItem.id}`}>
          <Image
            src={image || "/images/no-image.jpg"}
            alt={productItem.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
        
        {/* Discount Badge */}
        {productItem.offer_discount && (
          <Badge className="absolute top-2 start-2 bg-red-600 text-white text-xs px-2 py-1">
            خصم
          </Badge>
        )}
      </div>

      {/* Product Content - المحتوى من تحت */}
      <div className="flex flex-col flex-grow space-y-3">
        {/* Product Name */}
        <Link href={`/product/${productItem.id}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-red-600 transition-colors min-h-[40px]">
            {productItem.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            {productItem.offer_discount ? (
              <>
                <span className="line-through text-gray-500 text-xs">
                  {formatCurrency(
                    productItem.price as number,
                    productItem.currency_symbol
                  )}
                </span>
                <span className="text-foreground font-bold text-lg text-red-600">
                  {formatCurrency(
                    productItem.final_price as number,
                    productItem.currency_symbol
                  )}
                </span>
              </>
            ) : (
              <span className="text-foreground font-bold text-lg">
                {formatCurrency(
                  productItem.price as number,
                  session?.user.currency_code || CURRENCY_CODE
                )}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {productItem.quantity > 0 ? (
          <div className="flex items-center gap-2 text-green-600 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            متوفر في المخزون
          </div>
        ) : (
          <Badge variant="destructive" className="w-fit text-xs py-1 px-2">
            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
            غير متوفر
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            asChild
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-all duration-200"
          >
            <Link href={`/product/${productItem.id}`}>
              {productItem.quantity > 0 ? "اشتري الآن" : "التفاصيل"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;