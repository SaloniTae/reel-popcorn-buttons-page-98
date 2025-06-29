
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root with proper error handling
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found!");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
