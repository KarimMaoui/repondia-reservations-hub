import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ReservationCard } from '@/components/cards/ReservationCard';
import { reservations } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'pending' | 'accepted' | 'declined';

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
];

export default function History() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredReservations = reservations.filter(r => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  // Group by date
  const groupedReservations = filteredReservations.reduce((groups, reservation) => {
    const date = new Date(reservation.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateKey = 'Tomorrow';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(reservation);
    return groups;
  }, {} as Record<string, typeof reservations>);

  // Sort dates (Today first, then Tomorrow, then rest chronologically)
  const sortedDates = Object.keys(groupedReservations).sort((a, b) => {
    const priority: Record<string, number> = { Today: 0, Tomorrow: 1, Yesterday: 2 };
    const priorityA = priority[a] ?? 3;
    const priorityB = priority[b] ?? 3;
    return priorityA - priorityB;
  });

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-border/50">
          <div className="flex items-center gap-3 px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Reservation History</h1>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "rounded-full shrink-0",
                  activeFilter === filter.id && "shadow-soft"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-6">
          <AnimatePresence mode="popLayout">
            {sortedDates.length > 0 ? (
              sortedDates.map((dateKey) => (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {dateKey}
                  </h2>
                  <div className="space-y-3">
                    {groupedReservations[dateKey].map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onClick={(id) => navigate(`/reservation/${id}`)}
                        showActions={reservation.status === 'pending'}
                      />
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No reservations</h3>
                <p className="text-sm text-muted-foreground">
                  No {activeFilter !== 'all' ? activeFilter : ''} reservations found.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
