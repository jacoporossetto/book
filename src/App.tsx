// File: src/App.tsx (Versione Corretta)

import { Toaster } from "@/components/ui/toaster";
// --- CORREZIONE QUI ---
// Importiamo il componente Toaster dal file sonner.tsx e lo rinominiamo in SonnerToaster
// per evitare conflitti con l'altro componente Toaster.
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; 
// --------------------
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import OnboardingPage from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import "./scanner-styles.css";

const queryClient = new QueryClient();

// Componente speciale per proteggere le rotte
const ProtectedRoute = ({ children }) => {
  const hasProfile = localStorage.getItem('userPreferences');
  
  if (!hasProfile) {
    // Se non c'è un profilo, reindirizza all'onboarding
    return <Navigate to="/onboarding" replace />;
  }

  // Altrimenti, mostra la pagina richiesta
  return children;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* --- CORREZIONE QUI --- Usiamo il nome corretto del componente importato */}
      <SonnerToaster /> 
      {/* -------------------- */}
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;