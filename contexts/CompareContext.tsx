"use client";

import { ProductItemCompare } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type compareContextType = {
  compareItems: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (itemId: number) => void;
  clearCompare: () => void;
  itemInCompare: (id: number) => boolean;
};

const compareContext = createContext<compareContextType | undefined>(undefined);

const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<number[]>([]);

  const addToCompare = (id: number) => {
    if (compareItems.length === 2) {
      clearCompare();
    }
    setCompareItems((prev) => [...prev, id]);
  };

  const removeFromCompare = (itemId: number) => {
    setCompareItems((prev) => prev.filter((item) => item !== itemId));
  };

  const itemInCompare = (id: number) => {
    return compareItems.includes(id);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <compareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        itemInCompare,
      }}
    >
      {children}
    </compareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(compareContext);
  if (!context) {
    throw new Error("useCompareContext must be used within a CompareProvider");
  }
  return context;
};

export default CompareProvider;
