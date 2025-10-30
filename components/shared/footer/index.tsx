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
              <div>+88015-88888-9999</div>
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
            <h4 className="text-xl font-medium">Download App</h4>

            <div className="!space-y-2">
              <p className="text-xs font-medium">
                Save $3 with the new user app only
              </p>

              <div className="flex gap-3">
                <div className="flex items-center flex-col gap-1">
                  <Link href="#" className="overflow-hidden">
                    <Image
                      src="/images/logos/googlePlay.png"
                      width={90}
                      height={36}
                      alt="Get it on Google Play"
                      className="w-24 h-9 object-contain bg-black rounded-lg"
                    />
                  </Link>
                  <Image
                    src="/images/uploads/qr-code.jpg"
                    width={80}
                    height={80}
                    alt="QR Code for Google Play"
                    className="w-20 p-1 bg-white"
                  />
                </div>
                <div className="flex items-center flex-col gap-1">
                  <Link href="#" className="overflow-hidden">
                    <Image
                      src="/images/logos/appStore.png"
                      width={90}
                      height={36}
                      alt="Download on App Store"
                      className="w-24 h-9 object-contain bg-black rounded-lg"
                    />
                  </Link>
                  <Image
                    src="/images/uploads/qr-code.jpg"
                    width={80}
                    height={80}
                    alt="QR Code for App Store"
                    className="w-20 p-1 bg-white"
                  />
                </div>
              </div>
            </div>

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
        {currentYear} &copy; {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;