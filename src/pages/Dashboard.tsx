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
import { restaurant, dashboardStats } from '@/data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Remplacement des mockData par un state vide au départ
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

    // Écoute WhatsApp en direct
    const channel = supabase
      .channel('dashboard-realtime')
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

  const pendingReservations = reservations.filter(r => r.status === 'pending');

  // 2. ACTIONS RÉELLES SUR LA BASE DE DONNÉES
  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' }) // On utilise 'confirmed' comme dans ton SQL
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

  const handleReservationClick = (id: string) => {
    navigate(`/reservation/${id}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>;

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-secondary">Welcome back</p>
            <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="rounded-full"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatsCard
            icon={<Calendar className="h-5 w-5" />}
            label="Pending"
            value={pendingReservations.length} // Dynamique !
            variant="warning"
            onClick={() => {}}
          />
          <StatsCard
            icon={<Calendar className="h-5 w-5" />}
            label="Today"
            value={dashboardStats.todayReservations}
            sublabel="reservations"
            variant="success"
            onClick={() => navigate('/history')}
          />
          <StatsCard
            icon={<Phone className="h-5 w-5" />}
            label="Missed Calls"
            value={dashboardStats.missedCalls}
            variant="primary"
            onClick={() => navigate('/calls')}
          />
          <StatsCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Unread"
            value={dashboardStats.unreadMessages}
            sublabel="messages"
            variant="primary"
            onClick={() => navigate('/messages')}
          />
        </div>

        {/* Quick Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Avg. Response Time</p>
              <p className="text-xs text-muted-foreground">{dashboardStats.weeklyAcceptRate}% acceptance rate</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">{dashboardStats.averageResponseTime}</p>
        </motion.div>

        {/* Pending Requests Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary">Pending Requests</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/history')}
            className="text-muted-foreground"
          >
            View All
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
                    // Adaptation des noms de colonnes SQL aux noms attendus par le composant
                    guestName: reservation.customer_name,
                    phoneNumber: reservation.customer_phone,
                    date: reservation.reservation_date,
                    guests: reservation.guests_count,
                    time: "19:30" // On peut le rendre dynamique plus tard
                  }}
                  onAccept={() => handleAccept(reservation.id)}
                  onDecline={() => handleDecline(reservation.id)}
                  onClick={() => handleReservationClick(reservation.id)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-4 rounded-full bg-success/10 mb-4">
                  <Calendar className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No pending requests at the moment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
