import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeCsrfToken } from './api/auth';

// Инициализируем CSRF токен перед рендерингом приложения
initializeCsrfToken()
  .then(() => {
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      throw new Error('Failed to find the root element');
    }

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error(err);
  });
