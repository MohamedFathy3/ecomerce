// contexts/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// استيراد ملفات الترجمه
import en from '@/lib/locales/en.json';
import nl from '@/lib/locales/nl.json';
import de from '@/lib/locales/de.json';
import fr from '@/lib/locales/fr.json';

// تعريف نوع البيانات
type Locale = 'en' | 'nl' | 'de' | 'fr';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// دمج كل الترجمات
const translations: Record<Locale, any> = {
  en,
  nl, 
  de,
  fr
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Locale>('nl');

  // دالة للبحث في الترجمه
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
    }
    
    return value;
  };

  // دالة تغيير اللغه
  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('Lan', lang);
    document.cookie = `Lan=${lang}; path=/; max-age=31536000`; // إضافة للكوكيز أيضاً
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    
    // إطلاق event علشان ننبه كل المكونات بالتغيير
    window.dispatchEvent(new Event('languageChanged'));
  };

  // تحميل اللغه من localStorage عند البدء
  useEffect(() => {
    const getInitialLanguage = (): Locale => {
      if (typeof window === 'undefined') return 'nl';
      
      // جرب من localStorage أولاً
      const savedLanguage = localStorage.getItem('Lan') as Locale;
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      // جرب من cookies
      const cookies = document.cookie.split(';');
      const langCookie = cookies.find(cookie => cookie.trim().startsWith('Lan='));
      if (langCookie) {
        const langValue = langCookie.split('=')[1] as Locale;
        if (translations[langValue]) {
          return langValue;
        }
      }
      
      return 'nl';
    };

    const initialLang = getInitialLanguage();
    setLanguageState(initialLang);
    document.documentElement.lang = initialLang;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook علشان نستخدم الكون텍ست
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};