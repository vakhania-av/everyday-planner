import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initializeCsrfToken } from './api/auth.js';

// Инициализируем CSRF токен перед рендерингом приложения
initializeCsrfToken().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
