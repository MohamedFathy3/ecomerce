"use client";

import { useLanguage } from '@/contexts/LanguageContext';

interface TranslateProps {
  textKey: string;
  className?: string;
  fallback?: string;
}

export const Translate: React.FC<TranslateProps> = ({ 
  textKey, 
  className,
  fallback 
}) => {
  const { t } = useLanguage();
  
  return (
    <span className={className}>
      {t(textKey) || fallback || textKey}
    </span>
  );
};