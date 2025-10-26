import { getAllCategories } from "@/lib/api/apiProducts";
import { pharmacyCategories } from "@/lib/sampleData";
import { category } from "@/types";
import Link from "next/link";
import React from "react";

export const Categories = async () => {
  const categories: category[] = await getAllCategories();
  return (
    <div className="hidden  items-center justify-center bg-primary font-sans">
      {categories.map((ele) => (
        <Link
          key={`category-${ele.id}`}
          href={`/products?category=${ele.id}`}
          className="text-stone-200 font-medium p-2"
        >
          {ele.name}
        </Link>
      ))}
    </div>
  );
};
