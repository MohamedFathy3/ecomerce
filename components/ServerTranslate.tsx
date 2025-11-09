"use client";

import { useEffect, useState } from 'react';

// استيراد ملفات الترجمه
import en from '@/lib/locales/en.json';
import nl from '@/lib/locales/nl.json';
import de from '@/lib/locales/de.json';
import fr from '@/lib/locales/fr.json';

const translations = {
  en,
  nl, 
  de,
  fr
};

interface ServerTranslateProps {
  textKey: string;
  className?: string;
  fallback?: string;
}

export const ServerTranslate = ({ 
  textKey, 
  className,
  fallback 
}: ServerTranslateProps) => {
  const [language, setLanguage] = useState<'en' | 'nl' | 'de' | 'fr'>('nl');

  useEffect(() => {
    // جلب اللغه من cookies أو localStorage
    const getLanguage = () => {
      if (typeof window === 'undefined') return 'nl';
      
      // جرب من localStorage أولاً
      const savedLanguage = localStorage.getItem('Lan') as 'en' | 'nl' | 'de' | 'fr';
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      // جرب من cookies
      const cookies = document.cookie.split(';');
      const langCookie = cookies.find(cookie => cookie.trim().startsWith('Lan='));
      if (langCookie) {
        const langValue = langCookie.split('=')[1] as 'en' | 'nl' | 'de' | 'fr';
        if (translations[langValue]) {
          return langValue;
        }
      }
      
      return 'nl';
    };

    setLanguage(getLanguage());
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return fallback || key;
      }
    }
    
    return value;
  };

  return (
    <span className={className}>
      {t(textKey)}
    </span>
  );
};