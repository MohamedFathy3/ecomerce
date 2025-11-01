import { APP_NAME } from "@/lib/constants";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="wrapper">
        <div className="menus-wrapper">
          <div className="menu">
            <h4 className="title">Support</h4>
            <div className="space-y-3">
              <div>111 Bigway Street, Dhaka, DH 1515, Bangladesh</div>
              <div>exclusive@gmail.com</div>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">Account</h4>
            <div className="space-y-3">
              <Link href="/login" className="">
                Login / Register
              </Link>
              <Link href="/cart" className="">
                Cart
              </Link>
              <Link href="/wishlist" className="">
                Wishlist
              </Link>
              <Link href="/products" className="">
                Shop
              </Link>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/privacy" className="">
                Privacy Policy
              </Link>
              <Link href="/terms" className="">
                Terms of Use
              </Link>
              <Link href="/faq" className="">
                FAQ
              </Link>
              <Link href="/contact" className="">
                Contact
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
        {currentYear} &copy; forma. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;