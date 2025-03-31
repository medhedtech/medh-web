"use client";
import React from 'react';
import { usePlacementForm } from '@/context/PlacementFormContext';
import PlacementForm from '@/components/layout/main/dashboards/PlacementForm';
import { AnimatePresence } from 'framer-motion';

const PlacementFormModal: React.FC = () => {
  const { isFormOpen, closeForm } = usePlacementForm();
  
  return (
    <AnimatePresence>
      {isFormOpen && <PlacementForm isOpen={isFormOpen} onClose={closeForm} />}
    </AnimatePresence>
  );
};

export default PlacementFormModal; 