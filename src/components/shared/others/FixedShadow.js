import React from "react";

const FixedShadow = ({ 
  align = "left", 
  color = "green",
  opacity = 0.03,
  size = "lg"
}) => {
  // Size variants
  const sizeClasses = {
    sm: "w-[300px] h-[300px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[800px] h-[800px]",
    xl: "w-[1200px] h-[1200px]"
  };
  
  // Color variants
  const colorClasses = {
    green: "from-green-500",
    blue: "from-blue-500",
    purple: "from-purple-500",
    teal: "from-teal-500"
  };
  
  // Position based on alignment
  const positionClasses = {
    left: "left-[-400px] top-[10%]",
    right: "right-[-400px] top-[60%]",
    top: "top-[-400px] left-[50%] -translate-x-1/2",
    bottom: "bottom-[-400px] left-[50%] -translate-x-1/2"
  };
  
  return (
    <div 
      className={`
        fixed ${positionClasses[align]} ${sizeClasses[size]}
        rounded-full blur-[150px] 
        bg-gradient-radial ${colorClasses[color]} to-transparent
        pointer-events-none
        z-[-1]
      `}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export default FixedShadow;
