"use client";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ButtonAddToCompare = ({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) => {
  const { addToCompare, itemInCompare } = useCompare();
  const router = useRouter();

  const handleAddToCompare = () => {
    console.log("Adding to compare:", id);
    if (itemInCompare(id)) {
      toast.error("هذا المنتج موجود بالفعل في المقارنة", {
        duration: 2000,
        action: {
          label: " عرض المقارنة",
          onClick: () => {
            router.push("/account/compare");
          },
        },
      });
      return;
    }
    addToCompare(id);
    toast.success("تمت الإضافة إلى المقارنة", {
      duration: 2000,
      action: {
        label: " عرض المقارنة",
        onClick: () => {
          router.push("/account/compare");
        },
      },
    });
  };

  return <div onClick={handleAddToCompare}>{children}</div>;
};

export default ButtonAddToCompare;
