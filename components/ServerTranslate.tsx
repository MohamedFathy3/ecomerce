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

type Language = 'en' | 'nl' | 'de' | 'fr';

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
  const [language, setLanguage] = useState<Language>('nl');
  const [updateTrigger, setUpdateTrigger] = useState(0); // علشان نforce update

  useEffect(() => {
    const getLanguage = (): Language => {
      if (typeof window === 'undefined') return 'nl';
      
      const savedLanguage = localStorage.getItem('Lan') as Language;
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      const cookies = document.cookie.split(';');
      const langCookie = cookies.find(cookie => cookie.trim().startsWith('Lan='));
      if (langCookie) {
        const langValue = langCookie.split('=')[1] as Language;
        if (translations[langValue]) {
          return langValue;
        }
      }
      
      return 'nl';
    };

    setLanguage(getLanguage());

    // وظيفة علشان نسمع لتغييرات الـ localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'Lan' && e.newValue) {
        const newLang = e.newValue as Language;
        if (translations[newLang]) {
          setLanguage(newLang);
          setUpdateTrigger(prev => prev + 1); // force re-render
        }
      }
    };

    // وظيفة علشان نسمع لتغييرات الـ cookies
    const checkCookieChange = () => {
      const currentLang = getLanguage();
      if (currentLang !== language) {
        setLanguage(currentLang);
        setUpdateTrigger(prev => prev + 1);
      }
    };

    // event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // نcheck كل ثانية لو في تغيير في الـ cookies
    const interval = setInterval(checkCookieChange, 1000);
    
    // نسمع لأي تغيير في الـ localStorage من نفس الـ tab
    const handleLocalStorageChange = (e: Event) => {
      // ده هيشتغل لما نغير الـ localStorage من الـ JavaScript
      checkCookieChange();
    };
    
    // نضيف custom event علشان نtrigger من أي مكان
    const handleLanguageChange = () => {
      checkCookieChange();
    };
    
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
      window.removeEventListener('languageChange', handleLanguageChange);
      clearInterval(interval);
    };
  }, [language, updateTrigger]); // علشان الـ effect يrun كل ما الـ language تتغير

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