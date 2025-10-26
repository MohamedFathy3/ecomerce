import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <div className="flex-start">
      <Link href="/" className="relative w-10 md:w-14 aspect-square">
        <Image
          src="/images/logos/logos.png"
          fill
          className="object-contain object-center"
          alt={`${APP_NAME} "logo"`}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
