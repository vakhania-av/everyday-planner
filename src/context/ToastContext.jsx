import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext } from 'react';
import { useState } from 'react';

const ToastContext = createContext();

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, severity = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, severity, duration };

    setToasts((prev) => [...prev, newToast]);

    // Автоматическое удаление через указанный duration
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const handleClose = (id) => removeToast(id);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Рендерим все тосты */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          sx={{
            position: 'fixed',
            zIndex: 9999,
            bottom: `${index * 70 + 20}px` // Смещаем тосты друг над другом
          }}>
          <Alert
            severity={toast.severity}
            onClose={() => handleClose(toast.id)}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
