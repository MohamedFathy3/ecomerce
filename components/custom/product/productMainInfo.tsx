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
    { icon: <Tag className="w-4 h-4" />, label: "Type", value: product.type },
    { icon: <Beaker className="w-4 h-4" />, label: "Silicone Type", value: product.type_silicone },
    { icon: <Layers className="w-4 h-4" />, label: "Hardness", value: product.hardness },
    { icon: <FileText className="w-4 h-4" />, label: "Bio", value: product.bio },
    { icon: <Clock className="w-4 h-4" />, label: "Time in Ear", value: product.time_in_ear },
    { icon: <Calendar className="w-4 h-4" />, label: "End Curing", value: product.end_curing },
    { icon: <Zap className="w-4 h-4" />, label: "Viscosity", value: product.viscosity },
  ];

  const appearanceSpecs = [
    { icon: <Palette className="w-4 h-4" />, label: "Color", value: product.color },
    { icon: <Package className="w-4 h-4" />, label: "Packaging", value: product.packaging },
    { icon: <Hash className="w-4 h-4" />, label: "Item Number", value: product.item_number },
    { icon: <Syringe className="w-4 h-4" />, label: "Mix Gun", value: product.mix_gun },
    { icon: <Syringe className="w-4 h-4" />, label: "Mix Canules", value: product.mix_canules },
    { icon: <Box className="w-4 h-4" />, label: "Category", value: product.category },
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
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-primary font-medium">{product.category}</span>
        </nav>

        {/* Product Header */}
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
       
        </div>

        {/* Price Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-2">
              {product.discount && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl line-through text-gray-500 font-medium">
                    {product.old_price} {product.currency}
                  </span>
                  <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                    SAVE {product.discount}%
                  </Badge>
                </div>
              )}
              <span className="text-4xl font-bold text-green-600">
                {product.price} {product.currency}
              </span>
            </div>
            <p className="text-sm text-gray-600">Inclusive of all taxes • Free Shipping</p>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Premium Quality</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Certified</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Clock4 className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <RotateCcw className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Easy Returns</span>
          </div>
        </div>

        {/* Short Description */}
        {product.short_description && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-800 text-sm leading-relaxed">
                {product.short_description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add to Cart & Actions */}
        <div className="space-y-4">
          <ProductAddCart product={product} />
          
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <ButtonFavorite inFavorites={inFavorites} productId={product.id} />
            <ButtonShare />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">2-Year Warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Authentic</span>
          </div>
        </div>
      </div>

      {/* Product Details Section - Full Width */}
      <div className="lg:col-span-12 mt-12 space-y-8">
        
        {/* Product Description */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Ruler className="w-6 h-6 text-blue-600" />
                Product Description
              </h2>
            </div>
            <div className="p-8">
              {product.description ? (
                <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                  <TextExpander content={product.description} />
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-8">
                  No detailed description available for this product.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Specs */}
          <Card>
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Beaker className="w-5 h-5 text-blue-600" />
                  Technical Specifications
                </h3>
              </div>
              <ScrollArea className="h-96 p-6">
                <div className="space-y-4">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3 text-gray-700">
                        {spec.icon}
                        <span className="font-medium">{spec.label}</span>
                      </div>
                      <span className="text-gray-900 font-semibold text-right">
                        {spec.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Appearance & Additional Info */}
          <Card>
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Info className="w-5 h-5 text-green-600" />
                  Appearance & Details
                </h3>
              </div>
              <ScrollArea className="h-96 p-6">
                <div className="space-y-4">
                  {appearanceSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3 text-gray-700">
                        {spec.icon}
                        <span className="font-medium">{spec.label}</span>
                      </div>
                      <span className="text-gray-900 font-semibold text-right">
                        {spec.value || "N/A"}
                      </span>
                    </div>
                  ))}
                  
                  {/* Status */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-700">
                      <PackageCheck className="w-4 h-4" />
                      <span className="font-medium">Status</span>
                    </div>
                    <span className={`font-semibold ${
                      product.active ? "text-green-600" : "text-red-600"
                    }`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Box className="w-4 h-4" />
                      <span className="font-medium">Available Quantity</span>
                    </div>
                    <span className={`font-semibold ${
                      product.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {product.quantity} units
                    </span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Shipping & Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Shipping Information</h3>
              </div>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free shipping on orders over 500 {product.currency}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Express delivery available (1-2 business days)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Track your order in real-time</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>International shipping available</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Return Policy</h3>
              </div>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>30-day money-back guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Easy return process</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No questions asked returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Full refund within 7 days</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductMainInfo;