"use client";

import { useLocalStorage } from "./useLocalStorage";
import type { Perspective, FamilySide } from "@/lib/types/wedding";

export function usePerspective() {
  const [perspective, setPerspective] = useLocalStorage<Perspective>(
    "shaadios-perspective",
    "all"
  );

  const isVisible = (side: FamilySide): boolean => {
    if (perspective === "all") return true;
    if (side === "shared") return true;
    return side === perspective;
  };

  const isBlurred = (side: FamilySide): boolean => {
    if (perspective === "all") return false;
    if (side === "shared") return false;
    return side !== perspective;
  };

  return { perspective, setPerspective, isVisible, isBlurred };
}
