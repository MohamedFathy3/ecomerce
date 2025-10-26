"use client";
import { Button } from "@/components/ui/button";
import { headerPages } from "@/lib/sampleData";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HaederPages = () => {
  const pathName = usePathname();
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

export default HaederPages;
