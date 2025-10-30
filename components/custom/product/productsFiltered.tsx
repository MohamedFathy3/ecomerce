"use client";

import { getFilteredProducts } from "@/lib/api/apiProducts";
import { ProductItem, SearchParams } from "@/types";
import React, { useEffect, useState } from "react";
import NoData from "../noData";
import ProductCard from "./productCard";
import Pagination from "../pagination";
import Spinner from "../spinner";

interface ApiResponse {
  success: boolean;
  products: ProductItem[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination: any;
  message: string;
}

const ProductsFiltered = ({
  filterParams,
}: {
  filterParams: SearchParams;
}) => {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🧩 [ProductsFiltered] filterParams:", filterParams);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 [ProductsFiltered] Fetching products...");
        const response = await getFilteredProducts({ ...filterParams });
        
        console.log("📦 [ProductsFiltered] API response:", response);
        
        setApiResponse(response);
      } catch (err) {
        console.error("❌ [ProductsFiltered] Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterParams]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (error || !apiResponse) {
    return <NoData message={error || "Failed to load products"} />;
  }

  // Check if API call was successful
  if (!apiResponse.success) {
    console.log("❌ [ProductsFiltered] API returned unsuccessful response");
    return <NoData message={apiResponse.message || "Something went wrong"} />;
  }

  const products: ProductItem[] = apiResponse.products || [];
  const pagination = apiResponse.pagination;

  console.log("🧱 [ProductsFiltered] Products count:", products.length);
  console.log("🔢 [ProductsFiltered] Pagination:", pagination);

  // إذا مفيش منتجات
  if (products.length === 0) {
    return (
      <div className="col-span-full">
        <NoData message="No products found" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-3 xl:gap-2 justify-center">
        {products.map((productItem) => (
          <div className="sm:mx-0" key={productItem.id}>
            <ProductCard productItem={productItem} />
          </div>
        ))}
      </div>

      {/* Pagination مع safe checking */}
      {pagination && pagination.total && pagination.per_page && (
        <Pagination
          count={pagination.total}
          pageSize={pagination.per_page}
          visibleButtons={3}
        />
      )}
      
      {/* إذا في pagination لكن ناقصة بيانات */}
      {pagination && (!pagination.total || !pagination.per_page) && (
        console.log("⚠️ [ProductsFiltered] Pagination data incomplete:", pagination)
      )}
    </>
  );
};

export default ProductsFiltered;