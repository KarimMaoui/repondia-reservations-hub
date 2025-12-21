import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, Check, X, MessageCircle } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export default function Index() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CHARGEMENT ET TEMPS RÉEL
  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setReservations(data);
      setLoading(false);
    };

    fetchReservations();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reservations' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [payload.new, ...prev]);
            toast.success("Nouvelle demande WhatsApp !");
          } else if (payload.eventType === 'UPDATE') {
            setReservations((prev) => prev.map(r => r.id === payload.new.id ? payload.new : r));
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. ACTIONS : CONFIRMER / REFUSER
  const updateStatus = async (id: string, newStatus: 'confirmed' | 'declined') => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) toast.error("Erreur mise à jour");
    else toast.success(newStatus === 'confirmed' ? "Réservation confirmée" : "Réservation refusée");
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-primary">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Demandes de réservation</h1>
        <p className="text-slate-500 text-sm">Gérez les messages reçus par l'IA</p>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {reservations.map((res) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y
