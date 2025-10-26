import { Button } from "@/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
import {
  Heart,
  Scaling,
  Layers,
  FileText,
  Tag,
  Box,
  Zap,
  Calendar,
  PackageCheck,
  Store,
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
import { CURRENCY_CODE } from "@/lib/constants";

const ProductMainInfo = async ({ product }: { product: Product }) => {
  const session = await auth();
  // let favorites: FavoriteItem[] | null = null;
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
  return (
    <section className="wrapper grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
      {/* Product Image */}
      <ProductImages images={product.gallery} />

      <div className="col-span-1 sm:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Product Text Info */}
        <div className="space-y-6 sm:col-span-2">
          {/* Store Link */}
          <Button asChild variant="link" className="mb-2">
            <Link href={`/store/${product.pharmacy.id}`}>
              <Store />
              {product.pharmacy.name}
            </Link>
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-slate-200">
            {product.name}
          </h1>

          <div className="flex gap-2 items-center ">
            {product.offer ? (
              <>
                <span className="line-through text-gray-500">
                  {formatCurrency(
                    product.offer.price_before,
                    session?.user.currency_code || CURRENCY_CODE
                  )}
                </span>
                <span className="text-primary font-semibold text-2xl">
                  {formatCurrency(
                    product.offer.price_after,
                    session?.user.currency_code || CURRENCY_CODE
                  )}
                </span>
              </>
            ) : (
              <span className="text-primary font-semibold text-2xl">
                {formatCurrency(
                  product.price,
                  session?.user.currency_code || CURRENCY_CODE
                )}
              </span>
            )}
          </div>

          <TextExpander content={product.description} />

          <div className="flex flex-wrap gap-3">
            {/* <ButtonAddToCompare id={product.id}>
              <Button variant="outline" className="flex items-center gap-2">
                <Scaling className="w-5 h-5" />
                أضف للمقارنة
              </Button>
            </ButtonAddToCompare> */}

            <div className="flex justify-end gap-2 mb-2">
              <ButtonShare />
              <ButtonFavorite
                inFavorites={inFavorites}
                productId={product.id}
              />
            </div>
          </div>
        </div>

        <div>
          <ProductAddCart product={product} />
        </div>
      </div>
      <div className="col-span-full">
        <h3 className="text-xl font-semibold mt-6 mb-2">تفاصيل المنتج</h3>
        {/* Product detailed info table */}
        <Table className="w-full border bg-muted/20">
          <TableBody className="divide-y text-base">
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <FileText className="w-4 h-4" />
                الاسم العلمي
              </TableCell>
              <TableCell className="font-medium">
                {product.generic_name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Layers className="w-4 h-4" />
                الفئة
              </TableCell>
              <TableCell className="font-medium">
                {product.categoryName}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Tag className="w-4 h-4" />
                العلامة التجارية
              </TableCell>
              <TableCell className="font-medium">{product.brandName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Tag className="w-4 h-4" />
                النوع
              </TableCell>
              <TableCell className="font-medium">{product.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Box className="w-4 h-4" />
                الشكل
              </TableCell>
              <TableCell className="font-medium">{product.form}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Zap className="w-4 h-4" />
                القوة
              </TableCell>
              <TableCell className="font-medium">{product.strength}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <Calendar className="w-4 h-4" />
                تاريخ الإنتاج
              </TableCell>
              <TableCell className="font-medium">
                {product.production_date}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2 font-semibold bg-muted">
                <PackageCheck className="w-4 h-4" />
                حجم العبوة
              </TableCell>
              <TableCell className="font-medium">{product.pack_size}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ProductMainInfo;
