/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CreditCard,
  Globe,
  Heart,
  Home,
  Info,
  Languages,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MenuIcon,
  Moon,
  PanelLeft,
  RotateCcw,
  Settings,
  Sun,
  UserCircle,
  Package,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import React, { ReactNode, useEffect, useState, useTransition } from "react";
import profileImg from "/public/images/uploads/profile.png";
import Link from "next/link";
import { useTheme } from "next-themes";
import { getAllCategories } from "@/lib/api/apiProducts";
import { category } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { signOutUser } from "@/lib/api/apiUser";
import { revalidate } from "@/lib/api/actions";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderSearch from "./headerSearch";
import { ServerTranslate } from "@/components/ServerTranslate";

type AvailableLanguage = "nl" | "en" | "de" | "fr";

const headerPages = [
  { 
    titleKey: "navigation.headerPages.home", 
    path: "/", 
    icon: <Home /> 
  },
  { 
    titleKey: "navigation.headerPages.about", 
    path: "/about", 
    icon: <Info /> 
  },
  { 
    titleKey: "navigation.headerPages.contact", 
    path: "/contact-us", 
    icon: <Mail /> 
  },
];

const accountPages = [
  { title: "Personal Info", path: "/account/profile", icon: <UserCircle /> },
  { title: "Favorites", path: "/favorites", icon: <Heart /> },
    { title: "order", path: "/account/orders", icon: <Package /> },

];

const HeaderMenu = ({ session }: { session: any }) => {
  const { theme, setTheme } = useTheme();
  const [pending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<category[]>([]);
  const [isAuth, setIsAuth] = useState<boolean>(
    session?.user?.token || session?.accessToken ? true : false
  );
  const [initials, setInitials] = useState<string>("");
  const pathName = usePathname();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  async function handleGetCategories() {
    const categories = await getAllCategories();
    setCategories(categories);
  }

  async function handleSignOut() {
    const responses = await Promise.all([
      signOutUser(session?.user?.token as string),
      signOut({ redirect: false }),
      revalidate(pathName),
    ]);
    setIsAuth(false);
    setInitials("");
  }

  useEffect(() => {
    if (isAuth) {
      setInitials(
        `${session?.user.firstName?.charAt(0)} ${session?.user.lastName?.charAt(
          0
        )}`
      );
    }
  }, [isAuth]);

  useEffect(function () {
    startTransition(handleGetCategories);
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // LanguageDropdownMenu component داخل الـ HeaderMenu
  function LanguageDropdownMenu() {
    const availableLanguages: AvailableLanguage[] = ["nl", "en", "de", "fr"];

    const handleChangeLanguage = async (newLang: AvailableLanguage) => {
      setLanguage(newLang);
      localStorage.setItem('Lan', newLang);
      
      try {
        const response = await fetch('/api/language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: newLang }),
        });
        
        if (response.ok) {
          setTimeout(() => {
            router.refresh();
          }, 100);
        }
      } catch (error) {
        console.log('Error setting language cookie:', error);
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    };

    return (
      <div className="w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="language">
            <AccordionTrigger className="py-3 px-6 text-lg hover:no-underline">
              <div className="flex items-center gap-4">
                <div className="text-primary">
                  <Globe />
                </div>
                <span>Language ({language.toUpperCase()})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col pl-10">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleChangeLanguage(lang)}
                    className={`py-2 text-left ${
                      language === lang 
                        ? 'text-primary font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <nav className="lg:hidden">
      <Sheet>
        <SheetTrigger className="align-middle p-1 rounded-md text-[#e30a02]">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent className="flex flex-col items-start p-4 overflow-auto">
          <SheetTitle></SheetTitle>
          {isAuth && (
            <div className="flex-center gap-3">
              {session?.user.image?.endsWith(".svg") ? (
                <Image
                  src={session?.user.image}
                  width={50}
                  height={50}
                  alt="profile"
                />
              ) : (
                <div className="w-[50px] h-[50px] rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-medium">{initials}</span>
                </div>
              )}
              <p className="text-gray-600 font-medium text-lg">
                {session?.user.firstName} {session?.user.lastName}
              </p>
            </div>
          )}
          {/* Menus */}
          <div className="flex-grow-1 w-full flex flex-col divide-y divide-gray-200 dark:divide-slate-700">
            {!isAuth ? (
              <Menu>
                <MenuItem href="/signin" title="signin" icon={<LogIn />} />
              </Menu>
            ) : null}
            {/* Menu Main Pages */}
           <Menu>
  {headerPages.map((ele) => (
    <MenuItem
      key={`${ele.path}-mobile`}
      href={ele.path}
      title={<ServerTranslate textKey={ele.titleKey} />}
      icon={ele.icon}
    />
  ))}
</Menu>

            {/* Categories */}
          <Accordion type="single" collapsible>
  <AccordionItem value="categories">
    <AccordionTrigger className="py-3 px-6 text-lg hover:no-underline">
      Categories
    </AccordionTrigger>
    <AccordionContent>
      <Menu>
        {categories.map((ele) => (
          <MenuItem
            key={`${ele.name}-category`}
            title={ele.name}
            href={`/products?categoryId=${ele.id}`}
          />
        ))}
      </Menu>
    </AccordionContent>
  </AccordionItem>
</Accordion>

            {/* Account */}
            {isAuth ? (
              <Accordion type="single" collapsible>
                <AccordionItem value="account">
                  <AccordionTrigger className="py-3 px-6 text-lg hover:no-underline">
                    Account
                  </AccordionTrigger>
                  <AccordionContent>
                    <Menu>
                      {accountPages.map((ele) => (
                        <MenuItem
                          key={`${ele.title}-account`}
                          title={ele.title}
                          href={ele.path}
                          icon={ele.icon}
                        />
                      ))}
                    </Menu>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}

            {/* Menu Actions */}
            <Menu>
              
                <LanguageDropdownMenu />
              
              
         <MenuItem
  title={
    <ServerTranslate 
      textKey={theme === "light" ? "common.lightMode" : "common.darkMode"} 
    />
  }
  icon={theme === "dark" ? <Sun /> : <Moon />}
  handleClick={toggleTheme}
/>
            </Menu>

            {/* Logout */}
            {isAuth ? (
              <Menu>
             <MenuItem
  title={<ServerTranslate textKey="auth.logout" />}
  icon={<LogOut />}
  color="text-destructive"
  handleClick={() => startTransition(handleSignOut)}
/>
              </Menu>
            ) : null}


            {/* <div className="row-start-2 row-span-1 col-span-full">
              <HeaderSearch categories={categories} />
            </div> */}

          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );

};

function Menu({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col w-full gap-3 py-2">{children}</ul>;
}

function MenuItem({
  href,
  title,
  color,
  icon,
  handleClick,
}: {
  icon?: ReactNode;
  href?: string;
  title: ReactNode; // غير من string إلى ReactNode
  color?: string;
  handleClick?: () => void;
}) {
  return (
    <li className="cursor-pointer py-3 px-6 active:bg-stone-200 active:text-gray-500 dark:active:text-slate-500 dark:active:bg-slate-700 rounded-full">
      {href ? (
        <Link href={href} className="flex items-center gap-4">
          <div className="text-primary">{icon}</div>
          <p className="text-lg">{title}</p>
        </Link>
      ) : (
        <span
          onClick={() => {
            if (handleClick) handleClick();
          }}
          className="flex items-center gap-4"
        >
          <div className={color || "text-primary"}>{icon}</div>
          <p className="text-lg">{title}</p>
        </span>
      )}
    </li>
  );
}

export default HeaderMenu;