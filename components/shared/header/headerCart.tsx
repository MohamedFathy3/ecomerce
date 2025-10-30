/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCart } from "@/hooks/useGetCart";
import { CURRENCY_CODE } from "@/lib/constants";
import { formatCurrency, formatCurrencyEGP } from "@/lib/utils";
import { CartData } from "@/types";
import { ShoppingCart } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const HeaderCart = ({ session }: { session?: any }) => {
  const isAuthenticated = session && session.user && session.accessToken;
  const { data: cartData, isLoading, error } = useGetCart();

  // Handle authentication and cart states
  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <ShoppingCart className="!w-6 !h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-3">
          <DropdownMenuLabel className="text-primary">
            <div className="flex items-center gap-2 text-foreground text-lg font-medium capitalize">
              <Link href="/signin" className="text-primary underline">
                Login
              </Link>{" "}
              to view your cart
            </div>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Handle not authenticated from API
  if (cartData?.notAuthenticated) {
    signOut({ redirectTo: "/signin" });
    return null;
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Button variant="ghost" className="p-0" disabled>
        <ShoppingCart className="!w-6 !h-6" />
      </Button>
    );
  }

  // Handle empty cart
  if (cartData?.empty || !cartData?.data || cartData.data.items.length === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <ShoppingCart className="!w-6 !h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-3">
          <DropdownMenuLabel className="text-primary">
            <div className="flex items-center gap-2 text-foreground text-lg font-medium capitalize">
              <ShoppingCart className="w-5 h-5 opacity-50" />
              Cart is Empty
            </div>
          </DropdownMenuLabel>
          <Button
            asChild
            className="w-full mt-2 bg-primary text-white hover:bg-primary/90 transition font-semibold"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const cart = cartData.data;

  // Calculate cart totals
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.card?.price || "0");
    return sum + (price * item.quantity);
  }, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-0">
          <ShoppingCart className="!w-6 !h-6" />
          {/* Cart count badge */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <DropdownMenuLabel className="text-primary pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground text-lg font-medium">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart
            </div>
            <Badge variant="secondary" className="text-sm">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </DropdownMenuLabel>

        {/* Cart items preview */}
        <div className="max-h-60 overflow-y-auto space-y-3 mb-3">
          {cart.items.slice(0, 3).map((item) => (
            <DropdownMenuItem 
              key={item.id} 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition"
              asChild
            >
              <Link href="/cart">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-slate-600 rounded flex items-center justify-center">
                    {item.card.image ? (
                      <img 
                        src={item.card.image} 
                        alt={item.card.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.card.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} × {formatCurrencyEGP(parseFloat(item.card.price))}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrencyEGP(parseFloat(item.card.price) * item.quantity)}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
          {cart.items.length > 3 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
              +{cart.items.length - 3} more items
            </div>
          )}
        </div>

        {/* Cart summary */}
        <div className="border-t border-gray-200 dark:border-slate-600 pt-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrencyEGP(totalPrice)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            asChild
            className="flex-1 bg-primary text-white hover:bg-primary/90 transition font-semibold"
          >
            <Link href="/cart">View Cart</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1"
          >
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderCart;