"use client";

import { Button } from "@/components/ui/button";
import { revalidate } from "@/lib/api/actions";
import {
  addToCart,
  getCartData,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/apiCart";
import { CartData } from "@/types";
import { Plus, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import SpinnerMini from "../SpinnerMini";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetCart } from "@/hooks/useGetCart";

const ButtonSubmit = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus();
  if (pending) return <SpinnerMini />;

  return <>{children}</>;
};

// --------  AddToCart Component --------
// This component handles adding products to the cart

const AddToCart = ({
  productId,
  stock,
}: {
  productId: number;
  stock: number;
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const [inCart, setInCart] = useState(false);
  const [inCartCount, setInCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  const { data, isLoading, error } = useGetCart();
  const cart = data?.data as CartData | null | undefined;

  const queryClient = useQueryClient();

  // Handle Add to Cart mutation
  const { mutate: cartAddMutation, isPending: isAddPending } = useMutation({
    mutationFn: async () => {
      const response = await addToCart(productId, 1);
      
      // Handle specific error cases
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
        setInCartCount(1);
        setInCart(true);
        showToast("Item added to cart successfully");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
    onError: (error: Error) => {
      console.error("Add to cart error:", error);
      
      if (error.message.includes('Product not found')) {
        toast.error("This product is no longer available", {
          description: "The product may have been removed or is out of stock"
        });
      } else if (error.message.includes('Please login')) {
        toast.warning("Please sign in to add items to cart", {
          action: {
            label: "Sign In",
            onClick: () => {
              router.push(`/signin?callbackUrl=${pathName}`);
            },
          },
        });
      } else {
        toast.error(error.message || "Failed to add item to cart");
      }
    },
  });

  // Handle Plus mutation
  const { mutate: cartPlusMutation, isPending: isPlusPending } = useMutation({
    mutationFn: async () => {
      const response = await updateCartItem(productId, inCartCount + 1);
      
      if (!response.success) {
        if (response.message?.includes('No query results for model')) {
          throw new Error('Product not found');
        }
        throw new Error(response.message || 'Failed to update cart');
      }
      
      return response;
    },
    onSuccess: (response) => {
      if (response && response.success) {
        setInCartCount((prev) => prev + 1);
        showToast("Item updated in cart successfully");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      if (response && response.stockOut) {
        toast.error("Not enough stock available", {
          action: {
            label: "View Cart",
            onClick: () => {
              router.push("/cart");
            },
          },
        });
      }
    },
    onError: (error: Error) => {
      console.error("Plus cart error:", error);
      toast.error(error.message || "Failed to update cart");
    },
  });

  // Handle Minus mutation
  const { mutate: cartMinusMutation, isPending: isMinusPending } = useMutation({
    mutationFn: async () => {
      if (inCartCount > 1) {
        const response = await updateCartItem(productId, inCartCount - 1);
        
        if (!response.success) {
          if (response.message?.includes('No query results for model')) {
            throw new Error('Product not found');
          }
          throw new Error(response.message || 'Failed to update cart');
        }
        
        return response;
      } else {
        const response = await removeCartItem(productId);
        
        if (!response.success) {
          if (response.message?.includes('No query results for model')) {
            throw new Error('Product not found');
          }
          throw new Error(response.message || 'Failed to remove item from cart');
        }
        
        return response;
      }
    },
    onSuccess: (response) => {
      if (response && response.success) {
        setInCartCount((prev) => Math.max(prev - 1, 0));
        showToast("Item updated in cart successfully");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        if (inCartCount === 1) {
          setInCart(false);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Minus cart error:", error);
      toast.error(error.message || "Failed to update cart");
    },
  });

  // Check if product is in cart
  useEffect(() => {
    if (cart && cart.items && !data?.notAuthenticated) {
      const cartItem = cart.items.find((item) => item.card_id === productId);
      
      if (cartItem) {
        setInCart(true);
        setInCartCount(cartItem.quantity);
      } else {
        setInCart(false);
        setInCartCount(0);
      }
    }
    setMounted(true);
  }, [cart, productId, data?.notAuthenticated]);

  function showToast(message: string) {
    toast.success(message, {
      action: {
        label: "View Cart",
        onClick: () => {
          router.push("/cart");
        },
      },
    });
  }

  // Handle not authenticated state
  if (data?.notAuthenticated || !session) {
    return (
      <Button
        onClick={() => {
          toast.warning("Please sign in to add items to cart", {
            action: {
              label: "Sign In",
              onClick: () => {
                router.push(`/signin?callbackUrl=${pathName}`);
              },
            },
          });
        }}
        className="flex items-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </Button>
    );
  }

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <Button disabled>
        <SpinnerMini />
      </Button>
    );
  }

  // Show out of stock state
  if (stock <= 0) {
    return (
      <Button disabled variant="outline">
        Out of Stock
      </Button>
    );
  }

  // If product is already in cart, show quantity controls
  if (inCart) {
    return (
      <div className="flex items-center gap-2 border rounded-md px-2 py-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cartMinusMutation()}
          className="w-6 h-6 text-lg text-red-500 hover:bg-red-100"
          disabled={isMinusPending || isPlusPending || inCartCount < 1}
        >
          -
        </Button>
        <span className="text-sm font-medium w-6 text-center dark:text-white">
          {isMinusPending || isPlusPending ? <SpinnerMini /> : inCartCount}
        </span>
        {inCartCount < stock && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => cartPlusMutation()}
            className="w-6 h-6 text-lg text-green-600 hover:bg-green-100"
            disabled={isMinusPending || isPlusPending || inCartCount >= stock}
          >
            +
          </Button>
        )}
      </div>
    );
  }

  // Default state - Add to Cart button
  return (
    <div>
      <Button
        onClick={() => cartAddMutation()}
        disabled={isAddPending || stock <= 0}
        className="flex items-center gap-2"
      >
        {isAddPending ? (
          <SpinnerMini />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCart;