import React from "react";

const FixedShadow = ({ align }) => {
  return (
    <div
      className={`fixed ${
        align === "right" ? "right-0" : "left-0"
      } top-0 w-full h-full pointer-events-none`}
    >
      {/* Primary gradient blob */}
      <div
        className={`absolute ${
          align === "right" ? "right-0 top-[15%]" : "left-0 top-0"
        } w-[60%] h-[60%] opacity-20 blur-[130px] rounded-full 
        ${align === "right" 
          ? "bg-gradient-to-br from-purple.medium via-secondary-300 to-primary-300" 
          : "bg-gradient-to-br from-primary-300 via-accent-teal to-accent-cyan"
        } dark:opacity-15 animate-pulse-slow`}
      ></div>
      
      {/* Secondary smaller gradient blob */}
      <div
        className={`absolute ${
          align === "right" ? "right-[20%] bottom-[10%]" : "left-[20%] bottom-[5%]"
        } w-[30%] h-[30%] opacity-15 blur-[100px] rounded-full 
        ${align === "right" 
          ? "bg-gradient-to-tr from-accent-indigo via-accent-purple to-accent-pink" 
          : "bg-gradient-to-tr from-accent-yellow via-secondary-400 to-accent-red"
        } dark:opacity-10 animate-float`}
      ></div>
    </div>
  );
};

export default FixedShadow;
