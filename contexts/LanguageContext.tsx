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
  const [language, setLanguageState] = useState<Locale>('en');

  // دالة للبحث في الترجمه
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key; // ارجع الكي نفسه لو ملقاهوش
      }
    }
    
    return value;
  };

  // دالة تغيير اللغه
  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('Lan', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  };

  // تحميل اللغه من localStorage عند البدء
  useEffect(() => {
    const savedLang = localStorage.getItem('Lan') as Locale;
    if (savedLang && ['en', 'nl', 'de', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    }
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