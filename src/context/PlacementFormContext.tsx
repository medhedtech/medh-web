"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlacementFormContextType {
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
}

const PlacementFormContext = createContext<PlacementFormContextType | undefined>(undefined);

interface PlacementFormProviderProps {
  children: ReactNode;
}

export const PlacementFormProvider: React.FC<PlacementFormProviderProps> = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <PlacementFormContext.Provider value={{ isFormOpen, openForm, closeForm }}>
      {children}
    </PlacementFormContext.Provider>
  );
};

export const usePlacementForm = (): PlacementFormContextType => {
  const context = useContext(PlacementFormContext);
  
  if (context === undefined) {
    throw new Error('usePlacementForm must be used within a PlacementFormProvider');
  }
  
  return context;
}; 