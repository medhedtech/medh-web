"use client";
import { useEffect, useState, ReactNode } from "react";

interface TabContentWrapperProps {
  children: ReactNode;
  isShow: boolean;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ children, isShow }) => {
  const [isBlock, setIsBlock] = useState<boolean>(false);

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setIsBlock(true);
      }, 150);
    } else {
      setIsBlock(false);
    }
  }, [isShow]);
  return (
    <div
      className={`transition-opacity duration-150 ease-linear ${
        isShow ? "block " : "hidden "
      } ${isBlock ? "opacity-100" : "opacity-0"}`}
    >
      {children}
    </div>
  );
};

export default TabContentWrapper;
