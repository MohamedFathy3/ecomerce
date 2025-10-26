import ProductsFiltered from "@/components/custom/product/productsFiltered";
import ProductSidebar from "@/components/custom/product/productSidebar";
import Spinner from "@/components/custom/spinner";
import { delay } from "@/lib/utils";
import { SearchParams } from "@/types";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { productsSEO } from "@/lib/seo";

export const metadata = productsSEO;

const Products = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const filterParams = await searchParams;

  async function refetchDataWithParams() {
    "use server";
    revalidatePath("/products");
  }

  return (
    <div className="">
      <div className="grid grid-cols-12 xl:grid-cols-11 gap-6 px-3 xl:gap-2 sm:px-6 py-8 relative">
        {/* Sidebar filters */}
        <ProductSidebar revalidate={refetchDataWithParams} />

        {/* Product grid */}
        <section className="col-span-12 pt-4 lg:pt-0 lg:col-span-9 xl:col-span-9 space-y-6 flex flex-col">
          <Suspense fallback={<Spinner />} key={JSON.stringify(filterParams)}>
            <ProductsFiltered filterParams={filterParams} />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Products;
