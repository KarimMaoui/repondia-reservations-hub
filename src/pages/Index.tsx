import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, Check, X, MessageCircle } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export default function Index() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CHARGEMENT INITIAL ET TEMPS RÉEL (REALTIME)
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

    // Écoute les changements dans la base de données en direct
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

  // 2. ACTIONS : CONFIRMER OU REFUSER
  const updateStatus = async (id: string, newStatus: 'confirmed' | 'declined') => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success(newStatus === 'confirmed' ? "Réservation confirmée" : "Réservation refusée");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-primary font-medium">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6 px-4">
      <header className="mb-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Demandes de réservation</h1>
        <p className="text-slate-500 text-sm">Gérez les messages reçus par l'IA</p>
      </header>

      <div className="max-w-md mx-auto space-y-4">
        <AnimatePresence mode='popLayout'>
          {reservations.map((res) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={res.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{res.customer_name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <MessageCircle className="h-3 w-3 text-blue-500" />
                    <span>{res.customer_phone}</span>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  res.status === 'pending' ? "bg-blue-100 text-blue-600" : 
                  res.status === 'confirmed' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {res.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50 my-3">
                <div className="flex flex-col items-center border-r border-slate-50">
                  <Calendar className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-900 font-medium">
                    {res.reservation_date ? new Date(res.reservation_date).toLocaleDateString() : 'À définir'}
                  </span>
                </div>
                <div className="flex flex-col items-center border-r border-slate-50">
                  <Clock className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-900 font-medium">19:30</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-900 font-medium">{res.guests_count} pers.</span>
                </div>
              </div>

              {res.status === 'pending' && (
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => updateStatus(res.id, 'declined')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Refuser
                  </button>
                  <button 
                    onClick={() => updateStatus(res.id, 'confirmed')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors"
                  >
                    <Check className="h-4 w-4" /> Confirmer
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
