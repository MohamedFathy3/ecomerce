"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export const useNavigationData = () => {
  const { t } = useLanguage();

  const headerPages = [
    { title: t('navigation.headerPages.home'), path: "/" },
    { title: t('navigation.headerPages.about'), path: "/about" },
    { title: t('navigation.headerPages.contact'), path: "/contact-us" },
    { title: t('navigation.headerPages.categories'), path: "/#categories-section" },
  ];

  const pharmacyCategories = [
    { name: t('navigation.pharmacyCategories.painRelief'), href: "?category=pain-relief" },
    { name: t('navigation.pharmacyCategories.coldFlu'), href: "?category=cold-flu" },
    { name: t('navigation.pharmacyCategories.vitamins'), href: "?category=vitamins" },
    { name: t('navigation.pharmacyCategories.personalCare'), href: "?category=personal-care" },
    { name: t('navigation.pharmacyCategories.babyCare'), href: "?category=baby-care" },
    { name: t('navigation.pharmacyCategories.skincare'), href: "?category=skincare" },
    { name: t('navigation.pharmacyCategories.hairCare'), href: "?category=hair-care" },
    { name: t('navigation.pharmacyCategories.oralCare'), href: "?category=oral-care" },
  ];

  return { headerPages, pharmacyCategories };
};