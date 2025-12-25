import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// IMPORT DES PAGES
import Index from "./pages/Index";
import Login from "./pages/Login"; 
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ReservationDetail from "./pages/ReservationDetail";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. On vérifie la session actuelle au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. On écoute les changements d'état (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Écran de chargement pendant que l'app vérifie qui tu es
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-slate-500 font-medium">Chargement de Repondia...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* AUTH : Si déjà connecté, /login renvoie au dashboard */}
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />

            {/* PUBLIC / SEMI-PUBLIC */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

            {/* ROUTES PROTÉGÉES : Redirection vers /login si session absente */}
            <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={session ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/messages" element={session ? <Messages /> : <Navigate to="/login" />} />
            <Route path="/messages/:id" element={session ? <MessageDetail /> : <Navigate to="/login" />} />
            <Route path="/reservation/:id" element={session ? <ReservationDetail /> : <Navigate to="/login" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
