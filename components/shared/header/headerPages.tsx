"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from '@/contexts/LanguageContext';

const HeaderPages = () => {
  const pathName = usePathname();
  const { t } = useLanguage();

  const headerPages = [
    { title: t('navigation.headerPages.home'), path: "/" },
    { title: t('navigation.headerPages.about'), path: "/about" },
    { title: t('navigation.headerPages.contact'), path: "/contact-us" },
    { title: t('navigation.headerPages.categories'), path: "/#categories-section" },
  ];

  return (
    <div className="items-center hidden lg:flex">
      {headerPages.map((ele) => (
        <Button
          key={ele.path}
          variant="link"
          asChild
          className={`${
            pathName === ele.path
              ? "text-primary font-semibold"
              : "text-gray-500 font-medium"
          }  text-base hover:no-underline`}
        >
          <Link className="" href={ele.path}>
            {ele.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default HeaderPages;