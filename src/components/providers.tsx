"use client";

import { HeroUIProvider } from "@heroui/react";
import { WeddingProvider } from "@/contexts/wedding-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <WeddingProvider>{children}</WeddingProvider>
    </HeroUIProvider>
  );
}
