"use client";
import React, { ReactNode, useEffect } from "react";
import filter from "@/libs/filter";

interface FilterControllerWrapperProps {
  children: ReactNode;
}

const FilterControllerWrapper: React.FC<FilterControllerWrapperProps> = ({ children }) => {
  useEffect(() => {
    filter();
  }, []);
  
  return children;
};

export default FilterControllerWrapper;
