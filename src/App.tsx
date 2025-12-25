import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import Index from "./pages/Index";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. On vérifie si l'utilisateur est déjà connecté au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. On écoute les changements (connexion ou déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pendant que Supabase vérifie la session, on affiche un écran blanc ou un chargement
  if (loading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Si connecté, /login renvoie au dashboard. Sinon, affiche Login */}
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />

            {/* ROUTES PROTÉGÉES : Si pas de session, on renvoie vers /login */}
            <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={session ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/messages" element={session ? <Messages /> : <Navigate to="/login" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />

            {/* Page d'accueil publique */}
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
