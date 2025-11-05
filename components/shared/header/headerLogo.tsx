import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="block">
        <Image
          src="/images/logos/logo.webp"
          width={180} // 👈 حجم اللوجو
          height={50}
          className="object-contain object-left"
          alt={`${APP_NAME} logo`}
          priority
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
