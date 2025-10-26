import { getFilteredProducts } from "@/lib/api/apiProducts";
import { ProductItem, SearchParams } from "@/types";
import React from "react";
import NoData from "../noData";
import ProductCard from "./productCard";
import Pagination from "../pagination";

const ProductsFiltered = async ({
  filterParams,
}: {
  filterParams: SearchParams;
}) => {
  const productsRes = await getFilteredProducts({ ...filterParams });
  const products: ProductItem[] = productsRes.products as ProductItem[];
  const pagination = productsRes.pagination;
  if (!productsRes.success) return <NoData message="Something went wrong" />;
  return (
    <>
      <div className=" grid grid-cols-1 gap-3 md:gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-3 xl:gap-2 justify-center">
        {products.length > 0 ? (
          products.map((productItem) => (
            <div className=" sm:mx-0" key={productItem.id}>
              <ProductCard productItem={productItem} />
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <NoData message="No products found" />
          </div>
        )}
      </div>

      {products.length > 0 && (
        <Pagination
          count={pagination.total}
          pageSize={pagination.per_page}
          visibleButtons={3}
        />
      )}
    </>
  );
};

export default ProductsFiltered;
