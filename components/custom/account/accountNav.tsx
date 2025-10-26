"use client";

import { useProfile } from "@/contexts/ProfileContext";
import { CameraIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const accountTabs = [
  { name: "البيانات الشخصية", href: "/account/profile" },
  { name: "العناوين", href: "/account/addresses" },
  { name: "الطلبات", href: "/account/orders" },
  // { name: "المرتجعات", href: "/account/refund" },
  // { name: "طرق الدفع", href: "/account/payment-methods" },
  // { name: "المحفظة", href: "/account/wallet" },
  // { name: "مقارنة المنتجات", href: "/account/compare" },
  // { name: "استشر طبيب", href: "/account/doctor" },
];

const AccountNav = () => {
  const pathName = usePathname();
  const { profile, loading, refreshProfile } = useProfile();

  if (loading) {
    return (
      <aside className="col-span-1 hidden lg:block bg-teal-50 dark:bg-accent p-6 rounded-sm shadow-teal-900/10 shadow-sm sticky top-24 h-fit animate-pulse">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center" />
            <span className="absolute bottom-0 right-0 bg-gray-200 dark:bg-gray-600 rounded-full p-2 shadow-md" />
          </div>
          <div className="mt-4 h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        <nav className="space-y-2">
          {Array.from({ length: accountTabs.length }).map((_, idx) => (
            <div
              key={idx}
              className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="col-span-1 hidden lg:block bg-teal-50 dark:bg-accent p-6 rounded-sm shadow-teal-900/10 shadow-sm sticky top-24 h-fit">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <UserIcon className="w-12 h-12" />
          </div>
          <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
            <CameraIcon className="text-teal-500 w-5 h-5" />
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-accent-foreground">
          {profile?.first_name} {profile?.last_name}
        </h2>
      </div>
      <nav className="space-y-2 text-sm font-medium text-accent-foreground">
        {accountTabs.map((tab, index) => {
          const isActive = pathName.startsWith(tab.href);
          return (
            <Link
              key={index}
              href={tab.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-teal-600 text-white" : "hover:bg-muted"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AccountNav;
