import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, MessageSquare, Clock, Settings, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/cards/StatsCard';
import { ReservationCard } from '@/components/cards/ReservationCard';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

// IMPORT DE SUPABASE
import { supabase } from '@/lib/supabase';
import { dashboardStats } from '@/data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('Mon Restaurant');

  // 1. CHARGEMENT DES DONNÉES ET DU PROFIL
  useEffect(() => {
    const fetchData = async () => {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // A. Récupérer le nom du restaurant dans Profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('restaurant_name')
          .eq('id', user.id)
          .single();
        
        if (profile) setRestaurantName(profile.restaurant_name);

        // B. Récupérer les réservations liées à cet utilisateur
        const { data: resData } = await supabase
          .from('reservations')
          .select('*')
          .eq('user_id', user.id) // Ségrégation des données
          .order('created_at', { ascending: false });
        
        if (resData) setReservations(resData);
      }
      setLoading(false);
    };

    fetchData();

    // C. Écoute temps réel (Realtime)
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reservations' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [payload.new, ...prev]);
            toast.success("Nouvelle demande reçue !");
          } else if (payload.eventType === 'UPDATE') {
            setReservations((prev) => prev.map(r => r.id === payload.new.id ? payload.new : r));
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', id);

    if (error) toast.error("Erreur lors de la confirmation");
    else toast.success("Réservation confirmée");
  };

  const handleDecline = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'declined' })
      .eq('id', id);

    if (error) toast.error("Erreur lors du refus");
    else toast.success("Réservation refusée");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6">
        {/* Header Dynamique */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tableau de bord</p>
            <h1 className="text-2xl font-bold text-slate-900">{restaurantName}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="rounded-full bg-white shadow-sm border"
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatsCard
            icon={<Calendar className="h-5 w-5" />}
            label="En attente"
            value={pendingReservations.length}
            variant="warning"
            onClick={() => {}}
          />
          <StatsCard
            icon={<Calendar className="h-5 w-5" />}
            label="Aujourd'hui"
            value={dashboardStats.todayReservations}
            variant="success"
            onClick={() => navigate('/calendar')}
          />
          <StatsCard
            icon={<Phone className="h-5 w-5" />}
            label="Appels manqués"
            value={0}
            variant="primary"
            onClick={() => {}}
          />
          <StatsCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Messages"
            value={0}
            variant="primary"
            onClick={() => navigate('/messages')}
          />
        </div>

        {/* Pending Requests Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Demandes en attente</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calendar')}
            className="text-primary font-semibold"
          >
            Voir tout
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Reservation Cards */}
        <div className="space-y-3">
          <AnimatePresence mode='popLayout'>
            {pendingReservations.length > 0 ? (
              pendingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={{
                    ...reservation,
                    customerName: reservation.customer_name || "Client Inconnu",
                    guestName: reservation.customer_name || "Client Inconnu",
                    phoneNumber: reservation.customer_phone || "Non renseigné",
                    date: reservation.reservation_date || new Date().toISOString(),
                    guests: reservation.guests_count || 0,
                    time: "19:30"
                  }}
                  onAccept={() => handleAccept(reservation.id)}
                  onDecline={() => handleDecline(reservation.id)}
                  onClick={() => navigate(`/reservation/${reservation.id}`)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed"
              >
                <div className="p-4 rounded-full bg-slate-50 mb-4">
                  <Calendar className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Tout est à jour !</h3>
                <p className="text-sm text-slate-500">Aucune nouvelle demande pour le moment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
