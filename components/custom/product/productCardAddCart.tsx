// components/custom/product/productCardAddCart.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/useGetCart";
import { CartData, ProductItem } from "@/types";
import { Plus, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SpinnerMini from "../SpinnerMini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, updateCartItem, removeCartItem } from "@/lib/api/apiCart";

interface ProductCardAddCartProps {
  productItem: ProductItem;
}

const ProductCardAddCart = ({ productItem }: ProductCardAddCartProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  const { data, isLoading } = useGetCart();
  const cart = data?.data as CartData | null | undefined;

  const queryClient = useQueryClient();

  const productId = productItem.id;
  const stock = productItem.quantity;
  const productName = productItem.name;

  // Get current quantity from cart
  const currentCartItem = cart?.items?.find((item) => item.card_id === productId);
  const currentQuantity = currentCartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  // Handle Add to Cart mutation
  const { mutate: cartAddMutation, isPending: isAddPending } = useMutation({
    mutationFn: async () => {
      const response = await addToCart(productId, 1);
      
      if (!response.success) {
        if (response.message?.includes('No query results for model')) {
          throw new Error('Product not found');
        }
        if (response.message?.includes('Unauthorized')) {
          throw new Error('Please login to add items to cart');
        }
        throw new Error(response.message || 'Failed to add item to cart');
      }
      
      return response;
    },
    onSuccess: (response) => {
      if (response && response.success) {
        toast.success(`${productName} added to cart`, {
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: (error: Error) => {
      if (error.message.includes('Please login')) {
        toast.warning("Please sign in to add items to cart", {
          action: {
            label: "Sign In",
            onClick: () => router.push(`/signin?callbackUrl=${pathName}`),
          },
        });
      } else {
        toast.error(error.message || "Failed to add item to cart");
      }
    },
  });

  // Handle Quantity mutations
  const { mutate: cartPlusMutation, isPending: isPlusPending } = useMutation({
    mutationFn: async () => {
      const newQuantity = currentQuantity + 1;
      const response = await updateCartItem(productId, newQuantity);
      
      if (!response.success) throw new Error(response.message || 'Failed to update cart');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update cart");
    },
  });

  const { mutate: cartMinusMutation, isPending: isMinusPending } = useMutation({
    mutationFn: async () => {
      const newQuantity = currentQuantity - 1;
      
      if (newQuantity > 0) {
        const response = await updateCartItem(productId, newQuantity);
        if (!response.success) throw new Error(response.message || 'Failed to update cart');
        return response;
      } else {
        const response = await removeCartItem(productId);
        if (!response.success) throw new Error(response.message || 'Failed to remove item');
        return response;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update cart");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle not authenticated state
  if (!session) {
    return (
      <Button
        onClick={() => {
          toast.warning("Please sign in to add items to cart", {
            action: {
              label: "Sign In",
              onClick: () => router.push(`/signin?callbackUrl=${pathName}`),
            },
          });
        }}
        className="flex items-center gap-1 text-sm px-2 py-1 h-8"
        size="sm"
      >
        <ShoppingCart className="w-3 h-3" />
        Add to Cart
      </Button>
    );
  }

  if (!mounted || isLoading) {
    return (
      <Button disabled size="sm" className="h-8">
        <SpinnerMini />
      </Button>
    );
  }

  if (stock <= 0) {
    return (
      <Button disabled variant="outline" size="sm" className="h-8 text-xs">
        Out of Stock
      </Button>
    );
  }

  if (isInCart) {
    return (
      <div className="flex items-center gap-1 border rounded px-2 py-1 text-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cartMinusMutation()}
          className="w-5 h-5 text-xs text-red-500 hover:bg-red-100"
          disabled={isMinusPending || currentQuantity <= 1}
        >
          {isMinusPending ? <SpinnerMini /> : "-"}
        </Button>
        <span className="w-4 text-center text-xs font-medium">
          {currentQuantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cartPlusMutation()}
          className="w-5 h-5 text-xs text-green-600 hover:bg-green-100"
          disabled={isPlusPending || currentQuantity >= stock}
        >
          {isPlusPending ? <SpinnerMini /> : "+"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => cartAddMutation()}
      disabled={isAddPending}
      className="flex items-center gap-1 text-sm px-2 py-1 h-8"
      size="sm"
    >
      {isAddPending ? (
        <SpinnerMini />
      ) : (
        <>
          <Plus className="w-3 h-3" />
          Add to Cart
        </>
      )}
    </Button>
  );
};

export default ProductCardAddCart;