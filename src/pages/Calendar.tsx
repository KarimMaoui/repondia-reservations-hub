import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar as CalendarIcon, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Calendar() {
  const navigate = useNavigate();
  const [confirmedReservations, setConfirmedReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmed = async () => {
      // On filtre uniquement les réservations 'confirmed'
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'confirmed') // Filtre SQL
        .order('reservation_date', { ascending: true });

      if (data) setConfirmedReservations(data);
      setLoading(false);
    };

    fetchConfirmed();

    // Optionnel : Écouter les changements pour mettre à jour le calendrier en direct
    const channel = supabase
      .channel('calendar-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchConfirmed(); // On recharge tout pour simplifier le tri par date
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-3 px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Calendrier des réservations</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="py-10 text-center text-slate-400">Chargement du planning...</div>
          ) : confirmedReservations.length > 0 ? (
            confirmedReservations.map((res, index) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
              >
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-xl p-3 min-w-[60px]">
                  <span className="text-xs font-bold uppercase">
                    {new Date(res.reservation_date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black">
                    {new Date(res.reservation_date).getDate()}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-slate-400" />
                    <h3 className="font-semibold text-slate-900 truncate">{res.customer_name}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>19:30</span> {/* À rendre dynamique plus tard */}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{res.guests_count} pers.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Aucune réservation confirmée</p>
              <p className="text-xs text-slate-400 mt-1">Les réservations que tu acceptes apparaîtront ici.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
