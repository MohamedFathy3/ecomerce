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
            <h4 className="title">الدعم</h4>

            <div className="space-y-3">
              <div>111 بيجوي ساراني، داكا، DH 1515، بنغلاديش.</div>
              <div>exclusive@gmail.com</div>
              <div>+88015-88888-9999</div>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">الحساب</h4>
            <div className="space-y-3">
              <Link href="" className="">
                تسجيل الدخول / التسجيل
              </Link>
              <Link href="" className="">
                العربة
              </Link>
              <Link href="" className="">
                قائمة الرغبات
              </Link>
              <Link href="" className="">
                تسوق
              </Link>
            </div>
          </div>

          <div className="menu">
            <h4 className="title">رابط سريع</h4>
            <div className="space-y-3">
              <Link href="" className="">
                سياسة الخصوصية
              </Link>
              <Link href="" className="">
                شروط الاستخدام
              </Link>
              <Link href="" className="">
                الأسئلة الشائعة
              </Link>
              <Link href="" className="">
                اتصل
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-xl font-medium">تحميل التطبيق</h4>

            <div className="!space-y-2">
              <p className="text-xs font-medium">
                وفّر 3 دولار مع تطبيق جديد للمستخدمين فقط
              </p>

              <div className="flex gap-3">
                <div className="flex items-center flex-col gap-1">
                  <Link href="" className="overflow-hidden">
                    <Image
                      src="/images/logos/googlePlay.png"
                      width={90}
                      height={36}
                      alt=""
                      className="w-24 h-9 object-contain bg-black rounded-lg"
                    />
                  </Link>
                  <Image
                    src="/images/uploads/qr-code.jpg"
                    width={80}
                    height={80}
                    alt=""
                    className="w-20 p-1 bg-white"
                  />
                </div>
                <div className="flex items-center flex-col gap-1">
                  <Link href="" className="overflow-hidden">
                    <Image
                      src="/images/logos/appStore.png"
                      width={90}
                      height={36}
                      alt=""
                      className="w-24 h-9 object-contain bg-black rounded-lg"
                    />
                  </Link>
                  <Image
                    src="/images/uploads/qr-code.jpg"
                    width={80}
                    height={80}
                    alt=""
                    className="w-20 p-1 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 px-4">
              <Link href="">
                <Linkedin />
              </Link>
              <Link href="">
                <Instagram />
              </Link>
              <Link href="">
                <Twitter />
              </Link>
              <Link href="">
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
