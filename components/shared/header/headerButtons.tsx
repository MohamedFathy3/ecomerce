"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Moon, Sun } from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

const HeaderButtons = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const availableLanguages = ["nl", "en", "de", "fr"] as const;

  useEffect(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const savedLang = localStorage.getItem("Lan") as any;
    if (savedLang && availableLanguages.includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, [setLanguage]);

  const handleChangeLanguage = async (newLang: string) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!availableLanguages.includes(newLang as any)) return;
    
    // غير اللغة في localStorage (للكلينت)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLanguage(newLang as any);
    localStorage.setItem('Lan', newLang);
    
    // غير اللغة في cookies (للسيرفر)
    try {
      const response = await fetch('/api/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: newLang }),
      });
      
      if (response.ok) {
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    } catch (error) {
      console.log('Error setting language cookie:', error);
      setTimeout(() => {
        router.refresh();
      }, 100);
    }
  };

  useEffect(() => {
    if (!theme) setTheme("light");
  }, [theme, setTheme]);

  return (
    <div className="flex-center text-stone-700 dark:text-stone-400 !hidden lg:!flex">
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