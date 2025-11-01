"use client";
import SpinnerMini from "@/components/custom/SpinnerMini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories, getSearchProducts } from "@/lib/api/apiProducts";
import { category, ProductItem } from "@/types";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { set } from "zod";

const HeaderSearch = ({ categories }: { categories: category[] }) => {
  const [isPending, searchTransitionStart] = useTransition();
  const [categoryId, setCategoryId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const router = useRouter();

  async function handleSearch(categoryId: string, keyword: string) {
    const result = await getSearchProducts(categoryId, keyword);
    if (result.success && result.data && result.data.length > 0) {
      setProducts(result.data);
    }
    if (result.empty) {
      setProducts([]);
    }
  }

  useEffect(
    function () {
      if (isItemSelected) {
        setIsItemSelected(false);
        return;
      }
      if (keyword.trim() === "") {
        setProducts([]);
        setShowModalSearch(false);
        return;
      }
      const category = categoryId === "all" ? "" : categoryId;
      setShowModalSearch(true);
      searchTransitionStart(() => handleSearch(category, keyword));
    },
    [categoryId, keyword]
  );

  return (
    <div className="relative">
      <div className="border border-[#e30a02] rounded-md bg-white dark:bg-slate-800 h-9 md:h-10 flex items-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center flex-1 h-full">
          <Select
            onValueChange={(value) => {
              setCategoryId(value);
            }}
            value={categoryId || "all"}
          >
            <SelectTrigger className="w-32 md:w-36 h-full bg-transparent border-0 border-r border-[#e30a02] rounded-none focus:ring-0 focus:ring-offset-0 px-3">
              <SelectValue
                placeholder="All Categories"
                className="text-gray-600 dark:text-gray-300 text-sm"
              />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto bg-white dark:bg-slate-800 border border-[#e30a02]">
              <SelectGroup>
                <SelectLabel className="text-[#e30a02] font-semibold">Categories</SelectLabel>
                <SelectItem value="all" className="text-gray-700 dark:text-gray-300 hover:bg-[#e30a02]/10 focus:bg-[#e30a02]/10">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id.toString()}
                    value={category.id.toString()}
                    className="text-gray-700 dark:text-gray-300 hover:bg-[#e30a02]/10 focus:bg-[#e30a02]/10"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="text"
            className="h-full bg-transparent border-0 shadow-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 flex-1 px-3"
            placeholder="Search for products..."
            onChange={(e) => {
              setKeyword(e.target.value.trim());
            }}
            value={keyword}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (keyword.trim() === "") return;
                router.push(
                  `/products?category=${categoryId}&keyword=${keyword}`
                );
                setShowModalSearch(false);
              }
            }}
          />
        </div>
        <Button
          onClick={() => {
            if (keyword.trim() === "") return;
            router.push(`/products?category=${categoryId}&keyword=${keyword}`);
            setShowModalSearch(false);
          }}
          className="h-full bg-[#e30a02] hover:bg-[#e30a02]/90 text-white rounded-none px-3 md:px-4 shadow-none border-l border-[#e30a02]"
        >
          <Search className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
      
      {/* Search Results Modal */}
      {showModalSearch && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-[#e30a02] rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {isPending ? (
            <div className="flex justify-center items-center py-4">
              <SpinnerMini />
            </div>
          ) : products.length > 0 ? (
            <div className="py-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center px-4 py-3 hover:bg-[#e30a02]/10 border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors duration-200"
                  onClick={() => {
                    setShowModalSearch(false);
                    setKeyword("");
                    setIsItemSelected(true);
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {product.categoryName}
                    </p>
                  </div>
                  <div className="text-[#e30a02] font-semibold text-sm">
                    ${product.price}
                  </div>
                </Link>
              ))}
            </div>
          ) : keyword.trim() !== "" ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;