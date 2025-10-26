"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <section className="wrapper">
      <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="rounded-2xl bg-muted/50 p-6 space-y-8 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">اتصل بنا</h2>
            <p className="text-muted-foreground text-sm">
              نحن متواجدون على مدار الساعة طوال أيام الأسبوع.
            </p>
            <p className="text-muted-foreground text-sm">
              الهاتف: +8801611112222
            </p>
          </div>
          <hr />
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">اكتب لنا</h2>
            <p className="text-muted-foreground text-sm">
              املأ استمارتنا وسنتواصل معك خلال 24 ساعة.
            </p>
            <p className="text-muted-foreground text-sm">
              البريد الإلكتروني: customer@exclusive.com
            </p>
            <p className="text-muted-foreground text-sm">
              البريد الإلكتروني: support@exclusive.com
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 rounded-2xl bg-muted/50 px-6 py-10 flex flex-col space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input placeholder="اسمك *" className="bg-white dark:bg-gray-800" />
            <Input
              placeholder="بريدك الإلكتروني *"
              className="bg-white dark:bg-gray-800"
            />
            <Input
              placeholder="هاتفك *"
              className="bg-white dark:bg-gray-800"
            />
          </div>
          <Textarea
            placeholder="رسالتك"
            rows={6}
            className="flex-grow-1 bg-white dark:bg-gray-800"
          />
          <div className="flex justify-end">
            <Button className="rounded-xl px-6 text-base">إرسال رسالة</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
