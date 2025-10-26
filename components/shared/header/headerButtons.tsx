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
import { formatCurrencyEGP } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Globe, Moon, ShoppingCart, Sun } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

const HeaderButtons = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const { theme, setTheme } = useTheme();
  // const [language, setLanguage] = useState<string>("");
  let language = "en";
  const { profileData, isLoadoingProfile } = useGetProfile();
  const queryClient = useQueryClient();

  // useEffect(
  //   function () {
  //     const localLang = localStorage?.getItem("Lan");
  //     if (profileData?.success && profileData.data?.language) {
  //       setLanguage(profileData.data.language);
  //       setDocumentLanguage(profileData.data.language);
  //       console.log("current lan:", profileData.data.language);
  //       console.log("set from profileData");
  //     } else if (localLang) {
  //       setLanguage(localLang);
  //       setDocumentLanguage(localLang);
  //       console.log("set from localStorage");
  //     } else {
  //       setLanguage("ar"); // default language
  //       setDocumentLanguage("ar");
  //       console.log("set default");
  //     }

  //     setMounted(true);
  //   },
  //   [profileData?.data.language, profileData?.success]
  // );

  async function handleChangeLanguage() {
    if (profileData?.success) {
      const response = await updateUserLanguage(language);
      console.log(response);
      if (response?.success) {
        // Invalidate and refetch
        language = language === "en" ? "ar" : "en";
        setDocumentLanguage(language);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        console.log("Language updated successfully");
      } else {
        console.log("Failed to update language");
      }
    }
    // setLanguage(newLang);
    // localStorage?.setItem("Lan", newLang);
    // setDocumentLanguage(newLang);
  }

  function setDocumentLanguage(newLang: string) {
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  if (isLoadoingProfile) return null;

  const localLang = localStorage?.getItem("Lan");
  if (profileData?.success && profileData.data?.language) {
    language = profileData.data.language;
    setDocumentLanguage(profileData.data.language);
    console.log("current lan:", profileData.data.language);
    console.log("set from profileData");
  } else if (localLang) {
    language = localLang;
    setDocumentLanguage(localLang);
    console.log("set from localStorage");
  } else {
    language = "en"; // default language
    setDocumentLanguage("en");
    console.log("set default");
  }
  return (
    <div className="flex-center text-stone-700 dark:text-stone-400 !hidden lg:!flex">
      <Button
        onClick={handleChangeLanguage}
        variant="ghost"
        className=" gap-1 p-0"
      >
        <Globe className="!w-6 !h-6" />
        {language === "en" ? "AR" : "EN"}
      </Button>
      <Button onClick={toggleTheme} variant="ghost" className=" p-0">
        {theme === "light" ? (
          <Moon className="!w-6 !h-6" />
        ) : (
          <Sun className="!w-6 !h-6" />
        )}
      </Button>
      {/* Shopping cart */}
      {children}
    </div>
  );
};

export default HeaderButtons;
