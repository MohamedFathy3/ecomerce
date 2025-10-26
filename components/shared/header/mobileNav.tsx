"use client";

import {
  House,
  MessagesSquare,
  Pill,
  ShoppingCart,
  TruckElectric,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/", icon: House, label: "الرئيسية" },
  // { href: "/account/portions", icon: Pill, label: "جرعتي" },
  { href: "/cart", icon: ShoppingCart, label: "العربة" },
  { href: "/account/orders", icon: TruckElectric, label: "طلباتي" },
  { href: "/account/chat", icon: MessagesSquare, label: "المحادثات" },
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
    <nav className="nav-mobile">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              className={`nav-item${isActive(href) ? " active" : ""}`}
              href={href}
            >
              <Icon />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
