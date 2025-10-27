"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfile } from "@/hooks/useGetProfile";
import { updateUserLanguage } from "@/lib/api/apiUser";
import { useQueryClient } from "@tanstack/react-query";
import { Globe, Moon, Sun } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

// تعديل الكود الخاص بتغيير اللغة
const HeaderButtons = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const { theme, setTheme } = useTheme();
  const { profileData, isLoadoingProfile } = useGetProfile();
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState("en");

  // قائمة اللغات التي نريدها فقط (إزالة العربية)
  const availableLanguages = ["en", "nl", "de", "fr"]; // الإنجليزي، الهولندي، الألماني، الفرنسي

  // ضبط اللغة في المستند
  const setDocumentLanguage = (newLang: string) => {
    document.documentElement.lang = newLang;
    document.documentElement.dir = "ltr"; // كل اللغات هنا لليسار لليمين
  };

  // عند تحميل البروفايل أو اللغة المحفوظة
  useEffect(() => {
    if (profileData?.success && profileData.data?.language) {
      setLanguage(profileData.data.language);
      setDocumentLanguage(profileData.data.language);
      localStorage.setItem("Lan", profileData.data.language);
    } else {
      const savedLang = localStorage.getItem("Lan") || "en";
      setLanguage(savedLang);
      setDocumentLanguage(savedLang);
    }
  }, [profileData]);

  // تغيير اللغة
  const handleChangeLanguage = async (newLang: string) => {
    if (!availableLanguages.includes(newLang)) return; // تأكد من أن اللغة في القائمة المتاحة

    // تغيير اللغة في الواجهة
    setLanguage(newLang);
    setDocumentLanguage(newLang);
    localStorage.setItem("Lan", newLang);

    // تحديث السيرفر في الخلفية
    try {
      const response = await updateUserLanguage(newLang);
      if (response?.success) {
        console.log("✅ Language updated on server");
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }, 1000);
      } else {
        console.log("⚠️ Server update failed");
      }
    } catch (error) {
      console.log("Error updating language:", error);
    }
  };

  // ضبط الثيم الافتراضي ليكون Light
  useEffect(() => {
    if (!theme) setTheme("light");
  }, [theme, setTheme]);

  if (isLoadoingProfile) return null;

  return (
    <div className="flex-center text-stone-700 dark:text-stone-400 !hidden lg:!flex">
      {/* زر اللغة */}
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 p-0">
              <Globe className="!w-6 !h-6" />
              {language.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => handleChangeLanguage(lang)}
              >
                {lang.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* زر الثيم */}
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="ghost"
        className="p-0"
      >
        {theme === "light" ? (
          <Moon className="!w-6 !h-6" />
        ) : (
          <Sun className="!w-6 !h-6" />
        )}
      </Button>

      {children}
    </div>
  );
};

export default HeaderButtons;
