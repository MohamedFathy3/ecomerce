import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <section className="bg-purple-50 dark:bg-slate-800/80 relative aspect-[14_/_4] min-h-72 max-w-full">
      <Image
        src="/images/uploads/drug-banner.png"
        alt=""
        fill
        className=" object-contain object-center pointer-events-none"
      />
      <div className="wrapper h-full">
        <div className="content-center py-8 h-full">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h4 className="text-teal-700 text-xl font-medium">
              فيتامين ب6 (بيريدوكسين)
            </h4>

            <h2 className="text-teal-700 max-w-sm text-4xl font-semibold">
              الفيتامينات والمكملات الغذائية
            </h2>

            <Button asChild className="font-sans">
              <Link href="" className="btn btn-primary-500 rounded-md">
                <span>Show more</span>
                <ArrowRight className="auto-dir" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
