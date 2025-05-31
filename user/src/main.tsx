import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './index.css'
import { queryClient } from './lib/queryClient'

console.log('🚀 main.tsx se está ejecutando');
console.log('🔍 Elemento root:', document.getElementById('root'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ No se encontró el elemento root!');
  throw new Error('No se encontró el elemento root!');
}

console.log('📦 Iniciando React con Query...');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)

console.log('✅ React con Query iniciado correctamente');
