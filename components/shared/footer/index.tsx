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
              <div><ServerTranslate textKey="footer.email" /></div>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">
              <ServerTranslate textKey="footer.account" />
            </h4>
            <div className="space-y-3">
              <Link href="/signin" className="">
                <ServerTranslate textKey="footer.loginRegister" />
              </Link>
              <Link href="/cart" className="">
                <ServerTranslate textKey="footer.cart" />
              </Link>
              {/* <Link href="/wishlist" className="">
                <ServerTranslate textKey="footer.wishlist" />
              </Link> */}
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
            
          
              <Link href="/contact-us" className="">
                <ServerTranslate textKey="footer.contact" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6 px-4">
              <Link href="#" aria-label="LinkedIn"  target="_blank">
                <Linkedin />
              </Link>
              <Link href="https://www.instagram.com/formashop.nl/" aria-label="Instagram" target="_blank">
                <Instagram />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="https://www.facebook.com/people/Forma-Shop/61583053477324/" aria-label="Facebook"  target="_blank">
                <Facebook />
              </Link>
               <Link href="https://www.tiktok.com/tag/tecktik" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          width="24"
          height="24"
          fill="currentColor"
          className=" dark:hover:text-white transition"
        >
          <path d="M200.5 81.6a59 59 0 0 1-35.3-11.8v68.6a53.9 53.9 0 1 1-48-53.7v24.5a28 28 0 1 0 20 26.9V24a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8 35 35 0 0 0 35 35 8 8 0 0 1 8 8v14.6a8 8 0 0 1-8 8Z" />
        </svg>
      </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 flex-center border-t">
        {currentYear} &copy;  FORMA. <ServerTranslate textKey="footer.copyright" />
      </div>
    </footer>
  );
};

export default Footer;