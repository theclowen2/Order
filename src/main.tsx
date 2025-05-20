
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter } from 'react-router-dom';
import { Toaster as SonnerToaster } from 'sonner';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <OrderProvider>
            <App />
            <SonnerToaster position="top-right" />
            <Toaster />
          </OrderProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
