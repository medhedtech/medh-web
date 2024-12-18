
import React from 'react';
import '@/assets/css/ovalAnimation.css'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[500px] h-[300px]">
        <div className="wavy-oval" />
      </div>
    </div>
  );
}