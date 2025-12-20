import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, MessageSquare, Clock, Settings, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/cards/StatsCard';
import { ReservationCard } from '@/components/cards/ReservationCard';
import { restaurant, reservations as initialReservations, dashboardStats } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(initialReservations);

  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const handleAccept = (id: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'accepted' as const } : r))
    );
  };

  const handleDecline = (id: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'declined' as const } : r))
    );
  };

  const handleReservationClick = (id: string) => {
    navigate(`/reservation/${id}`);
  };

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
            value={dashboardStats.pendingRequests}
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
          <AnimatePresence>
            {pendingReservations.length > 0 ? (
              pendingReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onClick={handleReservationClick}
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
