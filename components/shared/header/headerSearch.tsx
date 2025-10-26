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
      <div className="!border-primary border rounded-md bg-secondary h-9 md:h-10 flex-center overflow-hidden">
        <div className="flex-center py-2 flex-grow-1">
          <Select
            onValueChange={(value) => {
              setCategoryId(value);
            }}
            value={categoryId || "all"}
          >
            <SelectTrigger className="!text-froreground !bg-transparent w-36 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ">
              <SelectValue
                placeholder="All Categories"
                className="text-gray-500"
              />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto">
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id.toString()}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="text"
            className="h-full !bg-transparent shadow-none border-0 border-s !border-stone-300 dark:!border-stone-700 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-0 !text-base text-gray-700 dark:text-gray-300"
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
          className="h-full rounded-sm shadow-none"
        >
          <Search />
        </Button>
      </div>
      {/* Search Results */}
      {showModalSearch && (
        <>
          <div
            className="fixed z-10 top-18 left-0 w-screen h-screen right-0 mt-2  bg-background/10 shadow-lg backdrop-blur-sm"
            onClick={() => setKeyword("")}
          ></div>
          <div className="absolute z-20 top-8 left-0 right-0 mt-2 rounded-md bg-background/30 shadow-lg overflow-hidden border backdrop-blur-sm">
            {isPending ? (
              <div className="flex-center py-4">
             
              </div>
            ) : (
              <>
                {products.length > 0 ? (
                  <div className="bg-background/90 py-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products?category=${categoryId}&keyword=${product.name}`}
                        className=""
                        onClick={() => {
                          setIsItemSelected(true);
                          setKeyword(product.name);
                          setShowModalSearch(false);
                        }}
                      >
                        <div className="font-semibold flex items-center gap-2 hover:bg-muted px-3 py-2 cursor-pointer">
                          <Search className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">{product.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-gray-500 bg-background">
                    No results found
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderSearch;
