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

  const { data, isLoading, error } = useGetCart();
  const cart = data?.data as CartData | null | undefined;

  const queryClient = useQueryClient();
  const { mutate: cartAddMutation, isPending: isAddPending } = useMutation({
    mutationFn: handleAddToCart,
    onSuccess: (response) => {
      if (response && response.success) {
        setInCartCount(1);
        setInCart(true);
        showToast("Item added to cart successfully");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  const { mutate: cartPlusMutation, isPending: isPlusPending } = useMutation({
    mutationFn: handlePlus,
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
  });

  const { mutate: cartMinusMutation, isPending: isMinusPending } = useMutation({
    mutationFn: handleMinus,
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
  });

  useEffect(
    function () {
      if (cart && cart.pharmacies && !data?.notAuthenticated) {
        setInCart(
          cart.pharmacies.some((pharmacy) => {
            const item = pharmacy.items.find(
              (item) => item.product_id === productId
            );
            if (item) {
              setInCartCount(item.quantity);
            }
            return item;
          })
        );
      }
      setMounted(true);
    },
    [cart, productId, status]
  );

  async function handleAddToCart() {
    return await addToCart(productId, 1);
  }

  async function handlePlus() {
    return await updateCartItem(productId, inCartCount + 1);
  }

  async function handleMinus() {
    if (inCartCount > 1) {
      return await updateCartItem(productId, inCartCount - 1);
    } else {
      return await removeCartItem(productId);
    }
  }

  function showToast(message: string) {
    // console.log("pathName", pathName);
    // revalidate(pathName);
    toast.success(message, {
      action: {
        label: "View Cart",
        onClick: () => {
          router.push("/cart");
        },
      },
    });
  }

  if (data?.notAuthenticated) {
    return (
      <Button
        onClick={() => {
          toast.warning("You are not signed in!", {
            action: {
              label: "go to sign in",
              onClick: () => {
                router.push(`/signin?callbackUrl=${pathName}`);
              },
            },
          });
        }}
      >
        <ShoppingCart className="w-5 h-5" />
        أضف إلى العربة
      </Button>
    );
  }

  // console.log(inCart, "inCart");
  // console.log(inCartCount, "inCartCount");
  if (!mounted) {
    return <SpinnerMini />;
  }

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

  return (
    <div>
      <Button
        type="submit"
        onClick={() => cartAddMutation()}
        disabled={isAddPending || stock <= 0}
      >
        {isAddPending ? (
          <SpinnerMini />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            أضف إلى العربة
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCart;
