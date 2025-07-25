import { useToast } from '@/components/shared/ui/ToastProvider';

export const useToastMessage = () => {
  const { showToast } = useToast();

  const success = (message: string) => {
    showToast.success(message);
  };

  const error = (message: string) => {
    showToast.error(message);
  };

  const info = (message: string) => {
    showToast.info(message);
  };

  const warning = (message: string) => {
    showToast.warning(message);
  };

  return {
    success,
    error,
    info,
    warning,
  };
}; 