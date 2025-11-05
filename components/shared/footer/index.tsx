import { APP_NAME } from "@/lib/constants";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ServerTranslate } from '@/components/ServerTranslate';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="wrapper">
        <div className="menus-wrapper">
          <div className="menu">
            <h4 className="title">
              <ServerTranslate textKey="footer.support" />
            </h4>
            <div className="space-y-3">
              <div><ServerTranslate textKey="footer.address" /></div>
              <div><ServerTranslate textKey="footer.email" /></div>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">
              <ServerTranslate textKey="footer.account" />
            </h4>
            <div className="space-y-3">
              <Link href="/login" className="">
                <ServerTranslate textKey="footer.loginRegister" />
              </Link>
              <Link href="/cart" className="">
                <ServerTranslate textKey="footer.cart" />
              </Link>
              <Link href="/wishlist" className="">
                <ServerTranslate textKey="footer.wishlist" />
              </Link>
              <Link href="/products" className="">
                <ServerTranslate textKey="footer.shop" />
              </Link>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">
              <ServerTranslate textKey="footer.quickLinks" />
            </h4>
            <div className="space-y-3">
              <Link href="/privacy-terms" className="">
                <ServerTranslate textKey="footer.privacyPolicy" />
              </Link>
              <Link href="/terms" className="">
                <ServerTranslate textKey="footer.termsOfUse" />
              </Link>
              <Link href="/faq" className="">
                <ServerTranslate textKey="footer.faq" />
              </Link>
              <Link href="/contact" className="">
                <ServerTranslate textKey="footer.contact" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6 px-4">
              <Link href="#" aria-label="LinkedIn">
                <Linkedin />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 flex-center border-t">
        {currentYear} &copy; {APP_NAME}. <ServerTranslate textKey="footer.copyright" />
      </div>
    </footer>
  );
};

export default Footer;