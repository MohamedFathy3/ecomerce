import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
import { CartData, Product } from "@/types";
import AddToCart from "./addToCart";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getCartData } from "@/lib/api/apiCart";
import { CURRENCY_CODE } from "@/lib/constants";

const ProductAddCart = async ({ product }: { product: Product }) => {
  const session = await auth();
  const cartData = await getCartData();
  let cart: CartData | null | undefined;

  if (cartData?.success) {
    cart = cartData.data;
  }
  if (cartData?.empty) {
    cart = null;
  }
  const stock = product.quantity || 0;
  const price = product.offer ? product.offer.price_after : product.price;

  return (
    <Card className="p-0">
      <CardContent className="p-4">
        <div className="mb-2 flex justify-between">
          <div>Price</div>
          <div>
            {formatCurrency(
              price,
              session?.user.currency_code || CURRENCY_CODE
            )}
          </div>
        </div>
        <div className="mb-2 flex justify-between">
          <div>Status</div>
          <div>
            {stock > 0 ? (
              <Badge variant="outline">In Stock </Badge>
            ) : (
              <Badge variant="destructive">Out Of Stock</Badge>
            )}
          </div>
        </div>
        {stock > 0 && (
          <div className="flex-center">
            <AddToCart
              // cart={cart}
              stock={stock}
              productId={product.id}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAddCart;
