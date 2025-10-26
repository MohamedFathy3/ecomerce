// "use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCartData } from "@/lib/api/apiCart";
import { auth, signOut } from "@/lib/auth";
import { formatCurrencyEGP } from "@/lib/utils";
import { CartData } from "@/types";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Cart() {
  const session = await auth();
  const cartData = await getCartData();
  let cart: CartData | null = null;
  let multiStores = false;
  const isAuthenticated = session && session.user && session.accessToken;
  if (isAuthenticated) {
    if (cartData?.notAuthenticated) {
      cart = null;
      signOut({ redirectTo: "/signin" });
    }
    if (cartData?.empty) {
      redirect("/");
    } else {
      cart = cartData?.data as CartData;
      if (cart?.pharmacies && cart.pharmacies.length > 1) {
        multiStores = true;
      } else {
        redirect(`/cart/${cart.pharmacies[0].pharmacy_id}`);
      }
    }
  } else {
    redirect("/signin?callbackUrl=/cart");
  }

  return (
    <section className="wrapper mx-auto px-4 md:px-8 !py-12">
      <div className=" mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          <ShoppingCartIcon className="inline-block me-2" />
          سلة التسوق
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          &quot;إدارة سلة التسوق الخاصة بك عبر المتاجر المختلفة&quot;
        </p>
      </div>
      <div className="  grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {multiStores && cart?.pharmacies
          ? cart.pharmacies.map((pharmacy) => {
              return (
                <Link
                  href={`/cart/${pharmacy.pharmacy_id}`}
                  key={pharmacy.pharmacy_id}
                  className="block"
                >
                  <Card
                    key={pharmacy.pharmacy_id}
                    className="bg-white cursor-pointer p-4 dark:bg-slate-800 shadow-md rounded-xl border border-gray-200 dark:border-slate-700"
                  >
                    <CardContent className="flex items-center gap-6">
                      <Image
                        // src={pharmacy.image}
                        // alt={pharmacy.name}
                        src="/images/no-image.jpg"
                        alt="Pharmacy Image"
                        width={64}
                        height={64}
                        className="rounded-full object-cover w-16 h-16 border "
                      />
                      <div className="flex-1 flex flex-wrap gap-4 justify-between">
                        <h2 className="text-lg font-bold text-teal-900 dark:text-teal-400 mb-1">
                          {pharmacy.pharmacy_id} pharamcy
                        </h2>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                            عدد المنتجات: {pharmacy.items.length}
                          </Badge>
                          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
                            الإجمالي: {formatCurrencyEGP(pharmacy.total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          : null}
      </div>
    </section>
  );
}
