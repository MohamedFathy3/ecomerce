// components/custom/product/buttonFavorite.tsx
"use client";

import { Button } from "@/components/ui/button";
import { revalidate } from "@/lib/api/actions";
import { addToFavorites, removeFromFavorites } from "@/lib/api/apiFavorites";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";

const ButtonFavorite = ({
  inFavorites,
  productId,
}: {
  inFavorites: boolean;
  productId: number;
}) => {
  const [addedToFavorites, setAddedToFavorites] = React.useState(inFavorites);
  const router = useRouter();
  const pathName = usePathname();
  
  const [resAdd, actionAdd] = useActionState(addToFavorites, {
    success: false,
    message: "",
    data: null,
    notAuthenticated: false,
  });

  const [resRemove, actionRemove] = useActionState(removeFromFavorites, {
    success: false,
    message: "",
    data: null,
    notAuthenticated: false,
  });

  // تحديث الحالة عندما يتغير الـ prop
  useEffect(() => {
    setAddedToFavorites(inFavorites);
  }, [inFavorites]);

  useEffect(() => {
    if (resAdd.success) {
      setAddedToFavorites(true);
      toast.success("Added to favorites");
      revalidate("/favorites");
      if (pathName.startsWith("/product/")) {
        revalidate(`/product/${productId}`);
      }
    }
  }, [resAdd, pathName, productId]);

  useEffect(() => {
    if (resRemove.success) {
      setAddedToFavorites(false);
      toast.success("Removed from favorites");
      revalidate("/favorites");
      if (pathName.startsWith("/product/")) {
        revalidate(`/product/${productId}`);
      }
    }
  }, [resRemove, pathName, productId]);

  useEffect(() => {
    if (resAdd.notAuthenticated || resRemove.notAuthenticated) {
      toast.error("You need to log in to manage favorites", {
        action: {
          label: "Login",
          onClick: () => {
            router.push(`/signin?callbackUrl=${pathName}`);
          },
        },
      });
    }
  }, [resAdd, resRemove, router, pathName]);

  return (
    <form action={addedToFavorites ? actionRemove : actionAdd}>
      <input type="hidden" name="productId" value={productId} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="!text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
      >
        <Heart 
          fill={addedToFavorites ? "red" : "none"} 
          className="!w-6 !h-6 transition-colors" 
        />
      </Button>
    </form>
  );
};

export default ButtonFavorite;