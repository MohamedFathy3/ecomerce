import { cookies } from 'next/headers';

// استيراد ملفات الترجمه
import en from '@/lib/locales/en.json';
import nl from '@/lib/locales/nl.json';
import de from '@/lib/locales/de.json';
import fr from '@/lib/locales/fr.json';

// تعريف الترجمات
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

export const ServerTranslate = async ({ 
  textKey, 
  className,
  fallback 
}: ServerTranslateProps) => {
  // جيب اللغه من cookies
  const cookieStore = await cookies();
  const language = cookieStore.get('Lan')?.value || 'nl';
  
  // دالة الترجمه
  const t = (key: string): string => {
    const keys = key.split('.');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language as keyof typeof translations];
    
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