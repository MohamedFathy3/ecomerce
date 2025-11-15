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
      className="nav-mobile border-t border-[#d39435] fixed bottom-0 left-0 right-0 z-50 overflow-visible"
      style={{
        background: "#b39435",
        borderTopLeftRadius: '25px',
        borderTopRightRadius: '25px',
      }}
    >
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-20 relative">
          
          {/* الخلفية المتحركة للنصف دايره - تتحرك بين العناصر */}
          <div className="absolute top-0 left-0 w-full h-3 overflow-visible pointer-events-none">
            {navItems.map(({ href }, index) => (
              <div
                key={href}
                className={`absolute top-0 transition-all duration-400 ease-out ${
                  isActive(href) ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  left: `${(index * 33.33) + 16.66}%`,
                  transform: `translateX(-50%) ${isActive(href) ? 'translateY(-3px)' : 'translateY(6px)'}`,
                  width: '60px',
                  height: '30px',
                }}
              >
                <div
                  className="w-full h-full rounded-t-full transition-all duration-400 ease-out"
                  style={{
                    background: "#e30a02",
                    transform: isActive(href) ? "scale(1.1)" : "scale(0.8)",
                  }}
                />
              </div>
            ))}
          </div>

          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center transition-all duration-400 ease-out z-10
                ${isActive(href) ? "text-[#e30a02]" : "text-[#e30a02]/60 hover:text-[#e30a02]"}`}
              style={{
                transform: isActive(href) ? 'translateY(-8px)' : 'translateY(0)',
              }}
            >
              
              {/* الدائرة البيضاء - متداخلة مع الـ section */}
              <div
                className={`absolute transition-all duration-400 ease-out overflow-hidden ${
                  isActive(href) ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  background: "white",
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  top: '-25px',
                  border: '4px solid #b39435',
                  boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                }}
              />
              
              {/* المحتوى (آيكون + نص) */}
              <div className="relative flex flex-col items-center space-y-1 z-20" 
                style={{
                  marginTop: isActive(href) ? '-5px' : '0px'
                }}>
                
                {/* الآيكون - يكبر مع الدائرة */}
                <Icon
                  className={`transition-all duration-400 ease-out ${
                    isActive(href)
                      ? "text-[#e30a02] scale-125"
                      : "text-[#e30a02]/60 scale-100"
                  }`}
                  style={{
                    width: isActive(href) ? '26px' : '22px',
                    height: isActive(href) ? '19px' : '22px',
                  }}
                />

                {/* النص */}
                <span
                  className={`text-xs font-medium transition-all duration-300 ease-out ${
                    isActive(href)
                      ? "text-[#e30a02] font-semibold"
                      : "text-[#e30a02]/60 font-medium"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;