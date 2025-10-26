"use client";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState, useTransition } from "react";
import { revalidatePath } from "next/cache";
import { Brand, category } from "@/types";
import { getAllCategories, getBrandsBytitle } from "@/lib/api/apiProducts";
import { set } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function SidebarContent({
  minRef,
  maxRef,
  customerRating,
  doctorRating,
  selectedCategories,
  inStock,
  setInStock,
  setCustomerRating,
  setDoctorRating,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  handleApply,
  handleReset,
}: {
  minRef: React.RefObject<HTMLInputElement | null>;
  maxRef: React.RefObject<HTMLInputElement | null>;
  customerRating: number | null;
  doctorRating: number | null;
  selectedCategories: string[];
  selectedBrands: string[];
  inStock: string;
  setCustomerRating: React.Dispatch<React.SetStateAction<number | null>>;
  setDoctorRating: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  setInStock: React.Dispatch<React.SetStateAction<string>>;
  handleApply: () => void;
  handleReset: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [filteredCategories, setFilteredCategories] = useState<category[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(function () {
    startTransition(fetchFilters);
  }, []);

  async function fetchFilters() {
    const categoriesRes = await getAllCategories();
    if (categoriesRes.length > 0) {
      setCategories(categoriesRes);
      setFilteredCategories(categoriesRes);
    }
    // console.log("Categories fetched:", categoriesRes);
    const brandsRes = await getBrandsBytitle();
    if (brandsRes.length > 0) {
      setBrands(brandsRes);
      setFilteredBrands(brandsRes);
    }
    // console.log("Brands fetched:", brandsRes);
  }

  return (
    <aside className="space-y-3 divide-y divide-y-reverse divide-accent/70 lg:bg-white dark:lg:bg-slate-900 p-4 rounded-md shadow overflow-y-auto  ">
      <div className="border-none">
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <div className="basis-1/2">
            <label className="block text-sm">From</label>
            <Input
              ref={minRef}
              type="number"
              placeholder="Min"
              min={0}
              className="mb-2"
            />
          </div>
          <div className="basis-1/2">
            <label className="block text-sm">To</label>
            <Input
              ref={maxRef}
              type="number"
              placeholder="Max"
              min={0}
              className="mb-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Customer Rating</h3>
        <div className="flex flex-wrap">
          <Input
            id="customer-rating-slider"
            type="range"
            min={0}
            max={5}
            step={1}
            value={customerRating ?? 1}
            onChange={(e) => setCustomerRating(Number(e.target.value))}
            className="w-full accent-primary shadow-none "
          />
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (customerRating ?? 1)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Doctor Rating</h3>
        <div className="flex flex-wrap">
          <Input
            id="doctor-rating-slider"
            type="range"
            min={0}
            max={5}
            step={1}
            value={doctorRating ?? 1}
            onChange={(e) => setDoctorRating(Number(e.target.value))}
            className="w-full accent-primary shadow-none"
          />
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (doctorRating ?? 1)
                    ? "fill-green-500 text-green-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 space-y-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            id="inStock"
            className="accent-primary"
            checked={inStock === "true"}
            onChange={(e) => {
              setInStock("true");
            }}
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium cursor-pointer ml-2"
          >
            In Stock
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="outOfStock"
            id="outOfStock"
            className="accent-primary"
            checked={inStock === "false"}
            onChange={(e) => {
              setInStock("false");
            }}
          />
          <label
            htmlFor="outOfStock"
            className="text-sm font-medium cursor-pointer ml-2"
          >
            Out of Stock
          </label>
        </div>
      </div>

      <Accordion type="multiple" className="m-0">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold mb-2">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Search categories..."
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filtered = categories.filter((cat) =>
                  cat.name.toLowerCase().includes(query)
                );
                setFilteredCategories(filtered);
              }}
              className="mb-2"
            />
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <input
                    id={`category-${cat.id}`}
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => {
                      setSelectedCategories((prev: string[]) =>
                        prev.includes(cat.id)
                          ? prev.filter((id) => id !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                    className="accent-primary"
                  />
                  <label
                    htmlFor={`category-${cat.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brands">
          <AccordionTrigger className="text-lg font-semibold mb-2">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Search brands..."
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filtered = brands.filter((brand) =>
                  brand.name.toLowerCase().includes(query)
                );
                setFilteredBrands(filtered);
              }}
              className="mb-2"
            />
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {filteredBrands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-2">
                  <input
                    id={`brand-${brand.id}`}
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id.toString())}
                    onChange={() => {
                      setSelectedBrands((prev: string[]) =>
                        prev.includes(brand.id.toString())
                          ? prev.filter(
                              (id) => id.toString() !== brand.id.toString()
                            )
                          : [...prev, brand.id.toString()]
                      );
                    }}
                    className="accent-primary"
                  />
                  <label
                    htmlFor={`category-${brand.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="">
        <Button onClick={handleApply} className="w-full mt-4">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleReset} className="w-full mt-2">
          Reset Filters
        </Button>
      </div>
    </aside>
  );
}

function ProductSidebar({ revalidate }: { revalidate: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const [customerRating, setCustomerRating] = useState<number | null>(0);
  const [doctorRating, setDoctorRating] = useState<number | null>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState<string>("");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minRef.current?.value) {
      params.set("price_min", minRef.current.value);
    } else {
      params.delete("price_min");
    }
    if (maxRef.current?.value) {
      params.set("price_max", maxRef.current.value);
    } else {
      params.delete("price_max");
    }
    if (customerRating) {
      params.set("user_rating_min", String(customerRating));
    } else {
      params.delete("user_rating_min");
    }
    if (doctorRating) {
      params.set("pharmacist_rating_min", String(doctorRating));
    } else {
      params.delete("pharmacist_rating_min");
    }
    if (selectedCategories.length > 0) {
      params.set("categoryId", selectedCategories.join(","));
    } else {
      params.delete("categoryId");
    }
    if (selectedBrands.length > 0) {
      params.set("brandId", selectedBrands.join(","));
    } else {
      params.delete("brandId");
    }
    if (inStock) {
      params.set("inStock", inStock);
    } else {
      params.delete("inStock");
    }
    router.push(`?${params.toString()}`);
    revalidate(); // Call revalidate if provided
  };

  const handleReset = () => {
    if (minRef.current) minRef.current.value = "";
    if (maxRef.current) maxRef.current.value = "";
    setCustomerRating(null);
    setDoctorRating(null);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStock("");

    router.push("?");
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" className="absolute">
              <Filter /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white dark:bg-slate-900">
            <SheetTitle></SheetTitle>
            <SidebarContent
              minRef={minRef}
              maxRef={maxRef}
              customerRating={customerRating}
              doctorRating={doctorRating}
              selectedCategories={selectedCategories}
              setInStock={setInStock}
              inStock={inStock}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              setCustomerRating={setCustomerRating}
              setDoctorRating={setDoctorRating}
              handleApply={handleApply}
              handleReset={handleReset}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:col-span-3 xl:col-span-2 lg:block">
        <SidebarContent
          minRef={minRef}
          maxRef={maxRef}
          customerRating={customerRating}
          doctorRating={doctorRating}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          setCustomerRating={setCustomerRating}
          setDoctorRating={setDoctorRating}
          inStock={inStock}
          setInStock={setInStock}
          handleApply={handleApply}
          handleReset={handleReset}
        />
      </div>
    </>
  );
}

export default ProductSidebar;
