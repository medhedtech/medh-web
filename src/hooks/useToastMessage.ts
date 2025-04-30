import { useToast } from '@/components/shared/ui/ToastProvider';

export const useToastMessage = () => {
  const { showToast } = useToast();

  const success = (message: string) => {
    showToast(message, 'success');
  };

  const error = (message: string) => {
    showToast(message, 'error');
  };

  const info = (message: string) => {
    showToast(message, 'info');
  };

  const warning = (message: string) => {
    showToast(message, 'warning');
  };

  return {
    success,
    error,
    info,
    warning,
  };
}; 