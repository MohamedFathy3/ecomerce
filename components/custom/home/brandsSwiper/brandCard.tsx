"use client";
import { Brand, category } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BrandCard = ({ item }: { item: Brand | category }) => {
  const [isValidImage, setIsValidImage] = useState(true);

  useEffect(() => {
    if (!item.image || item.image.trim() === "") {
      setIsValidImage(false);
      return;
    }

    const img = new window.Image();
    img.src = item.image;
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
  }, [item.image]);

  const image = isValidImage ? item.image : "/images/no-image.jpg";
  return (
    <Link href={`/products?brand=${item.name}`} className="flex-center w-full">
      <div className="rounded-md w-full flex flex-col gap-3 justify-center">
        <div className="w-full aspect-square relative mx-auto">
          <Image
            src={image || "/images/no-image.jpg"}
            fill
            alt=""
            className="aspect-square rounded-full border border-[#e7000b] object-cover"
          />
        </div>

        <div className="text-center">{item.name}</div>
      </div>
    </Link>
  );
};

export default BrandCard;
