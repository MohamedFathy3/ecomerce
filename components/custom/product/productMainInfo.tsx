import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  Layers,
  FileText,
  Tag,
  Box,
  Zap,
  Calendar,
  PackageCheck,
  Clock,
  Beaker,
  Palette,
  Package,
  Hash,
  Syringe,
  Shield,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  Award,
  Clock4,
  ShieldCheck,
  Ruler,
  Info,
} from "lucide-react";
import TextExpander from "../textExpander";
import ProductAddCart from "./productAddCart";
import ProductImages from "./productImage";
import ButtonShare from "../buttonShare";
import { FavoriteItem, Product } from "@/types";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getFavorites } from "@/lib/api/apiFavorites";
import ButtonFavorite from "./buttonFavorite";
import { revalidatePath } from "next/cache";
import ButtonAddToCompare from "./buttonAddToCompare";
import { ServerTranslate } from "@/components/ServerTranslate";

const ProductMainInfo = async ({ product }: { product: Product }) => {
  const session = await auth();
  let inFavorites = false;
  if (session && session.user) {
    const res = await getFavorites();
    if (res && res.success && !res.empty) {
      const favorites = res.data as FavoriteItem[];
      inFavorites = favorites.some((item) => item.id === product.id);
    }
  }

  async function revalidate() {
    "use server";
    revalidatePath(`/product/${product.id}`);
  }

  // تحديد الصور المعروضة
  const displayImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : product.image 
      ? [product.image] 
      : [];

  const hasVideo = product.link_video;

  // البيانات التقنية
  const technicalSpecs = [
    { icon: <Tag className="w-4 h-4" />, label: "product.type", value: product.type },
    { icon: <Beaker className="w-4 h-4" />, label: "product.siliconeType", value: product.type_silicone },
    { icon: <Layers className="w-4 h-4" />, label: "product.hardness", value: product.hardness },
    { icon: <FileText className="w-4 h-4" />, label: "product.bio", value: product.bio },
    { icon: <Clock className="w-4 h-4" />, label: "product.timeInEar", value: product.time_in_ear },
    { icon: <Calendar className="w-4 h-4" />, label: "product.endCuring", value: product.end_curing },
    { icon: <Zap className="w-4 h-4" />, label: "product.viscosity", value: product.viscosity },
  ];

  const appearanceSpecs = [
    { icon: <Palette className="w-4 h-4" />, label: "product.color", value: product.color },
    { icon: <Package className="w-4 h-4" />, label: "product.packaging", value: product.packaging },
    { icon: <Hash className="w-4 h-4" />, label: "product.itemNumber", value: product.item_number },
    { icon: <Syringe className="w-4 h-4" />, label: "product.mixGun", value: product.mix_gun },
    { icon: <Syringe className="w-4 h-4" />, label: "product.mixCanules", value: product.mix_canules },
    { icon: <Box className="w-4 h-4" />, label: "product.category", value: product.category },
  ];

  return (
    <section className="wrapper grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Product Images & Video Section - Sticky مع scroll محدود */}
      <div className="lg:col-span-6">
        <div className="sticky top-6 transition-all duration-300 hover:shadow-xl rounded-xl">
          <ProductImages 
            images={displayImages} 
            videoUrl={hasVideo ? product.link_video : undefined}
            productName={product.name}
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-[#e30a02] transition-colors">
            <ServerTranslate textKey="common.home" />
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#e30a02] transition-colors">
            <ServerTranslate textKey="common.products" />
          </Link>
          <span>/</span>
          <span className="text-[#e30a02] font-medium">{product.category}</span>
        </nav>

        {/* Product Header */}
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Price Section */}
        <Card className="bg-gradient-to-br from-[#d39435]/10 to-[#d39435]/5 border-[#d39435]/20 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              {product.discount && (
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl line-through text-gray-500 dark:text-gray-400 font-medium">
                    {product.old_price} {product.currency}
                  </span>
                  <Badge className="bg-[#e30a02] text-white px-3 py-1 text-sm font-bold">
                    <ServerTranslate textKey="product.save" /> {product.discount}%
                  </Badge>
                </div>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-[#e30a02]">
                {product.price} {product.currency}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <ServerTranslate textKey="product.inclusiveTaxes" />
            </p>
          </CardContent>
        </Card>

        {/* Add to Cart & Actions */}
        <div className="space-y-4">
          <ProductAddCart product={product} />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-[#d39435]/10 rounded-lg border border-[#d39435]/20">
            <ShieldCheck className="w-5 h-5 text-[#e30a02]" />
            <span className="text-sm font-medium text-[#e30a02]">
              <ServerTranslate textKey="product.premiumQuality" />
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#d39435]/10 rounded-lg border border-[#d39435]/20">
            <Award className="w-5 h-5 text-[#e30a02]" />
            <span className="text-sm font-medium text-[#e30a02]">
              <ServerTranslate textKey="product.certified" />
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#d39435]/10 rounded-lg border border-[#d39435]/20">
            <Clock4 className="w-5 h-5 text-[#e30a02]" />
            <span className="text-sm font-medium text-[#e30a02]">
              <ServerTranslate textKey="product.fastDelivery" />
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ButtonShare />
          </div>
        </div>
      </div>

      {/* Product Details Section - Full Width */}
      <div className="lg:col-span-12 mt-12 space-y-8">
        
        {/* Product Description */}
        <Card className="overflow-hidden bg-[#d39435]/5 border-[#d39435]/20">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-[#d39435]/10 to-[#d39435]/5 p-6 border-b border-[#d39435]/20">
              <h2 className="text-2xl font-bold text-[#e30a02] flex items-center gap-3">
                <Ruler className="w-6 h-6" />
                <ServerTranslate textKey="product.description" />
              </h2>
            </div>
            <div className="p-6 md:p-8">
              {product.description ? (
                <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  <TextExpander content={product.description} />
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                  <ServerTranslate textKey="product.noDescription" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications - Uncomment if needed */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-[#d39435]/5 border-[#d39435]/20">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-[#d39435]/10 to-[#d39435]/5 p-6 border-b border-[#d39435]/20">
                <h3 className="text-xl font-bold text-[#e30a02] flex items-center gap-3">
                  <Beaker className="w-5 h-5" />
                  <ServerTranslate textKey="product.technicalSpecs" />
                </h3>
              </div>
              <ScrollArea className="h-96 p-6">
                <div className="space-y-4">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#d39435]/10 last:border-b-0">
                      <div className="flex items-center gap-3 text-[#e30a02] dark:text-[#e30a02]">
                        {spec.icon}
                        <span className="font-medium">
                          <ServerTranslate textKey={spec.label} />
                        </span>
                      </div>
                      <span className="font-semibold text-right">
                        {spec.value || <ServerTranslate textKey="common.notAvailable" />}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-[#d39435]/5 border-[#d39435]/20">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-[#d39435]/10 to-[#d39435]/5 p-6 border-b border-[#d39435]/20">
                <h3 className="text-xl font-bold text-[#e30a02] flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  <ServerTranslate textKey="product.appearanceDetails" />
                </h3>
              </div>
              <ScrollArea className="h-96 p-6">
                <div className="space-y-4">
                  {appearanceSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#d39435]/10 last:border-b-0">
                      <div className="flex items-center gap-3 text-[#e30a02] dark:text-[#e30a02]">
                        {spec.icon}
                        <span className="font-medium">
                          <ServerTranslate textKey={spec.label} />
                        </span>
                      </div>
                      <span className="font-semibold text-right">
                        {spec.value || <ServerTranslate textKey="common.notAvailable" />}
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between py-3 border-b border-[#d39435]/10">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <PackageCheck className="w-4 h-4" />
                      <span className="font-medium">
                        <ServerTranslate textKey="product.status" />
                      </span>
                    </div>
                    <span className={`font-semibold ${
                      product.active ? "text-green-600" : "text-[#e30a02]"
                    }`}>
                      {product.active ? 
                        <ServerTranslate textKey="common.active" /> : 
                        <ServerTranslate textKey="common.inactive" />
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Box className="w-4 h-4" />
                      <span className="font-medium">
                        <ServerTranslate textKey="product.availableQuantity" />
                      </span>
                    </div>
                    <span className={`font-semibold ${
                      product.quantity > 0 ? "text-green-600" : "text-[#e30a02]"
                    }`}>
                      {product.quantity} <ServerTranslate textKey="product.units" />
                    </span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
};

export default ProductMainInfo;