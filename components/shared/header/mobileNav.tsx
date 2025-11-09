"use client";

import {
  House,
  ShoppingCart,
  TruckElectric,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/", icon: House, label: "Home" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/account/orders", icon: TruckElectric, label: "Order" },
];

const MobileNav = () => {
  const pathName = usePathname();
  const isActive = (href: string) => {
    if (href === "/") {
      return pathName === href || pathName === "/";
    }
    return pathName.includes(href);
  };

  return (
    <nav
      className="nav-mobile border-t border-[#d39435]"
      style={{
        background: "#b39435",
      }}
    >
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center space-y-0.5 transition-colors duration-200 
                ${
                  isActive(href)
                    ? "text-[#e30a02]"
                    : "text-[#e30a02]/60"
                } hover:text-[#e30a02] dark:hover:text-[#ff3b30]`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive(href)
                    ? "text-[#e30a02] dark:text-[#ff3b30]"
                    : "text-[#e30a02]/60 dark:text-[#ff3b30]/70"
                }`}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "#e30a02" }}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
