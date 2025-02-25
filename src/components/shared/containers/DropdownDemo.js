"use client";

import React, { useState } from "react";
import DropdownContainer from "./DropdownContainer";

const DropdownDemo = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [isScrollOpen, setIsScrollOpen] = useState(false);

  // Demo items
  const demoItems = [
    { name: "Profile", icon: "👤", path: "#" },
    { name: "Settings", icon: "⚙️", path: "#" },
    { name: "Messages", icon: "✉️", path: "#", badge: "3" },
    { name: "Help Center", icon: "❓", path: "#" },
    { name: "Logout", icon: "🚪", path: "#" },
  ];

  // Many items for scrolling demo
  const manyItems = Array(15)
    .fill(null)
    .map((_, i) => ({
      name: `Option ${i + 1}`,
      icon: "📌",
      path: "#",
      badge: i % 5 === 0 ? "New" : null,
    }));

  return (
    <div className="p-8 space-y-12">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Dropdown Container Demos
      </h2>

      {/* Basic Dropdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Basic Dropdown
        </h3>
        <div className="relative inline-block">
          <button
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            onClick={() => setIsBasicOpen(!isBasicOpen)}
          >
            Click me
          </button>
          <div className="absolute top-full left-0 mt-2 z-50">
            <DropdownContainer
              isOpen={isBasicOpen}
              onToggle={setIsBasicOpen}
              position="left"
              width="w-48"
            >
              <ul className="py-1">
                {demoItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.path}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </DropdownContainer>
          </div>
        </div>
      </div>

      {/* Position Variants */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Position Variants
        </h3>
        <div className="flex space-x-4">
          {["left", "center", "right"].map((pos) => (
            <div key={pos} className="relative inline-block">
              <button
                className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors"
                onClick={() => setIsPositionOpen(!isPositionOpen)}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
              <div className="absolute top-full left-0 mt-2 z-50">
                <DropdownContainer
                  isOpen={isPositionOpen}
                  onToggle={setIsPositionOpen}
                  position={pos}
                  width="w-48"
                >
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      This dropdown is aligned to the <strong>{pos}</strong>
                    </p>
                  </div>
                </DropdownContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Custom Styling
        </h3>
        <div className="relative inline-block">
          <button
            className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={() => setIsCustomOpen(!isCustomOpen)}
          >
            Custom Style
          </button>
          <div className="absolute top-full left-0 mt-2 z-50">
            <DropdownContainer
              isOpen={isCustomOpen}
              onToggle={setIsCustomOpen}
              position="left"
              width="w-64"
              className="bg-gradient-to-br from-accent-indigo to-accent-purple border-0"
            >
              <div className="p-4 text-center">
                <h4 className="text-white font-bold mb-2">Custom Dropdown</h4>
                <p className="text-white/80 text-sm">
                  This dropdown has custom styling with a gradient background
                </p>
                <button className="mt-3 px-4 py-1.5 bg-white text-accent-purple rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                  Action Button
                </button>
              </div>
            </DropdownContainer>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Scrollable Content
        </h3>
        <div className="relative inline-block">
          <button
            className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => setIsScrollOpen(!isScrollOpen)}
          >
            Many Options
          </button>
          <div className="absolute top-full left-0 mt-2 z-50">
            <DropdownContainer
              isOpen={isScrollOpen}
              onToggle={setIsScrollOpen}
              position="left"
              width="w-56"
              maxHeight="200px"
            >
              <ul className="py-1">
                {manyItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.path}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-accent-red/10 text-accent-red dark:bg-accent-red/20">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </DropdownContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownDemo; 