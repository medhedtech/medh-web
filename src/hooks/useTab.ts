"use client";
import { useState } from "react";

interface UseTabReturn {
  handleTabClick: (idx: number) => void;
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
}

const useTab = (initialIdx?: number): UseTabReturn => {
  const [currentIdx, setCurrentIdx] = useState<number>(initialIdx || 0);
  // handle clicking event
  const handleTabClick = (idx: number): void => {
    setCurrentIdx(idx);
  };
  return { handleTabClick, currentIdx, setCurrentIdx };
};

export default useTab;
