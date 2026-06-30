"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    document.title = segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1) + " | Seapedia"
      : "Seapedia";
  }, [pathname]);

  return null;
}
