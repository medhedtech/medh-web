import React, { useState } from "react";

const SimpleSelect = ({
  options,
  register,
  name,
  className,
  defaultValue,
  onChange,
  isCustom = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  // Toggles the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handles selection of an option in custom dropdown
  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  const renderSelect = () => (
    <select
      className={`w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none ${className}`}
      {...register(name)}
      value={selectedValue}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  // Custom dropdown UI (not using <select>)
  const renderCustomDropdown = () => (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className={`cursor-pointer w-full px-4 py-2 border rounded-lg dark:bg-inherit dark:text-white text-gray-700 focus:outline-none ${className}`}
      >
        {selectedValue
          ? options.find((option) => option.value === selectedValue)?.label
          : "Select Option"}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 z-10">
          {options.map(({ value, label }) => (
            <div
              key={value}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(value)}
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {/* Registering the selected value for react-hook-form */}
      <input type="hidden" {...register(name)} value={selectedValue} />
    </div>
  );

  return isCustom ? renderCustomDropdown() : renderSelect();
};

export default SimpleSelect;
