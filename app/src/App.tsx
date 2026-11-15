// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Biblioteca } from './pages/Biblioteca';
import { Cadastrar } from './pages/Cadastrar';
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
    <Toaster richColors position="top-right" />
    <BrowserRouter>
      <Routes>
        {/* O AppLayout envolvera todas as rotas filhas declaradas aqui dentro */}
        <Route element={<AppLayout />}>
          {/* Redireciona a raiz (/) diretamente para o /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/cadastrar" element={<Cadastrar />} />
        </Route>

        {/* Redirecionamento de seguranca para qualquer rota desconhecida */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}