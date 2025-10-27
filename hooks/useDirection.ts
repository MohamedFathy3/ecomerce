"use client";

import { useEffect, useState } from "react";

export function useDirection() {
  const [direction, setDirection] = useState<"rtl" | "ltr">("ltr");

  useEffect(() => {
    const dir = document?.documentElement?.dir || "ltr";
    setDirection(dir === "rtl" ? "rtl" : "ltr");

    const observer = new MutationObserver(() => {
      const currentDir = document?.documentElement?.dir || "ltr";
      setDirection(currentDir === "rtl" ? "rtl" : "ltr");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return direction;
}
