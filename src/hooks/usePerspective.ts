"use client";

import { useWedding } from "@/contexts/wedding-context";

export function usePerspective() {
  const ctx = useWedding();
  return {
    perspective: ctx.perspective,
    setPerspective: ctx.setPerspective,
    isVisible: ctx.isVisible,
    isBlurred: ctx.isBlurred,
  };
}
