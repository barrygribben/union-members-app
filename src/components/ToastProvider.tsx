import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from './ToastConfig';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast context interface
interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = (type: ToastType, title: string, message?: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  };

  const showSuccess = (message: string, title: string = 'Success') => {
    showToast('success', title, message);
  };

  const showError = (message: string, title: string = 'Error') => {
    showToast('error', title, message);
  };

  const showInfo = (message: string, title: string = 'Info') => {
    showToast('info', title, message);
  };

  const showWarning = (message: string, title: string = 'Warning') => {
    showToast('warning', title, message);
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast config={toastConfig} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 