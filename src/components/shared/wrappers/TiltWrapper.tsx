"use client";

import React, { ReactNode, useEffect } from "react";
import Aos from "aos";
import VanillaTilt from "vanilla-tilt";

interface TiltWrapperProps {
  children: ReactNode;
}

const TiltWrapper: React.FC<TiltWrapperProps> = ({ children }) => {
  useEffect(() => {
    // hover effect parallax
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
      perspective: 1000,
    });
  }, []);
  
  return children;
};

export default TiltWrapper;
