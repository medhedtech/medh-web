"use client";

import { useCallback, useMemo } from "react";
import type { SweetAlertIcon, SweetAlertPosition, SweetAlertOptions } from "sweetalert2";

export type AlertType = SweetAlertIcon;
export type AlertPosition = SweetAlertPosition;

export interface AlertOptions {
  position?: AlertPosition;
  timer?: number;
  timerProgressBar?: boolean;
  showConfirmButton?: boolean;
  customClass?: string;
}

export interface AlertResult {
  createToast: (type: AlertType, message: string, options?: AlertOptions) => Promise<void>;
  createModal: (options: SweetAlertOptions) => Promise<any>;
  createConfirm: (
    title: string, 
    message: string, 
    confirmText?: string, 
    cancelText?: string
  ) => Promise<boolean>;
}

// Lazy load SweetAlert2 to prevent HMR issues
const getSwal = async () => {
  try {
    const { default: Swal } = await import("sweetalert2");
    return Swal;
  } catch (error) {
    console.error("Failed to load SweetAlert2:", error);
    return null;
  }
};

/**
 * Custom hook that provides various alert capabilities using SweetAlert2
 * @returns Object with methods for different types of alerts
 */
export const useSweetAlert = (): AlertResult => {
  /**
   * Creates a toast notification
   * @param type - The type/icon of the toast
   * @param message - The message to display
   * @param options - Additional options for customizing the toast
   */
  const createToast = useCallback(async (
    type: AlertType, 
    message: string, 
    options?: AlertOptions
  ): Promise<void> => {
    try {
      const Swal = await getSwal();
      if (!Swal) return;

      const Toast = Swal.mixin({
        toast: true,
        position: options?.position || "bottom-start",
        showConfirmButton: options?.showConfirmButton ?? false,
        timer: options?.timer ?? 3000,
        timerProgressBar: options?.timerProgressBar ?? true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      
      Toast.fire({
        customClass: {
          container: options?.customClass || "z-xxxl"
        },
        icon: type,
        title: message,
      });
    } catch (error) {
      console.error("Error creating toast:", error);
    }
  }, []);

  /**
   * Creates a modal dialog with custom options
   * @param options - SweetAlert2 options
   * @returns Promise resolving to the modal result
   */
  const createModal = useCallback(async (options: SweetAlertOptions): Promise<any> => {
    try {
      const Swal = await getSwal();
      if (!Swal) return null;
      
      return Swal.fire(options);
    } catch (error) {
      console.error("Error creating modal:", error);
      return null;
    }
  }, []);

  /**
   * Creates a confirmation dialog
   * @param title - The title of the confirmation
   * @param message - The message/question to confirm
   * @param confirmText - Text for the confirm button
   * @param cancelText - Text for the cancel button
   * @returns Promise resolving to true if confirmed, false otherwise
   */
  const createConfirm = useCallback(async (
    title: string, 
    message: string, 
    confirmText: string = "Yes",
    cancelText: string = "No"
  ): Promise<boolean> => {
    try {
      const Swal = await getSwal();
      if (!Swal) return false;

      const result = await Swal.fire({
        title,
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      
      return result.isConfirmed;
    } catch (error) {
      console.error("Error in confirmation dialog:", error);
      return false;
    }
  }, []);

  return {
    createToast,
    createModal,
    createConfirm,
  };
};

export default useSweetAlert; 