import { forwardRef } from 'react'; // <--- 1. On importe forwardRef
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, PhoneCall, MessageSquare, Check, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  onAccept?: (id: string | number) => void;
  onDecline?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
  showActions?: boolean;
}

const sourceIcons = {
  call: PhoneCall,
  sms: MessageSquare,
  whatsapp: MessageSquare,
};

const statusStyles = {
  pending: 'badge-pending',
  accepted: 'badge-accepted',
  confirmed: 'badge-accepted',
  declined: 'badge-declined',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Confirmed',
  confirmed: 'Confirmed',
  declined: 'Declined',
};

// 2. On enveloppe le composant avec forwardRef
export const ReservationCard = forwardRef<HTMLDivElement, ReservationCardProps>(
  ({ reservation, onAccept, onDecline, onClick, showActions = true }, ref) => {
    
    const SourceIcon = (reservation.source && sourceIcons[reservation.source as keyof typeof sourceIcons]) || HelpCircle;
    const isPending = reservation.status === 'pending';

    const formatDate = (dateString: string) => {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      }
      if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
      <motion.div
        ref={ref} // <--- 3. On attache la ref ici pour que Framer Motion puisse mesurer la carte
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card-elevated p-4 transition-shadow hover:shadow-float"
      >
        <button
          onClick={() => onClick?.(reservation.id)}
          className="w-full text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                <span className="text-sm font-semibold text-secondary-foreground">
                  {reservation.customerName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{reservation.customerName || 'Unknown Client'}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <SourceIcon className="h-3 w-3" />
                  <span>via {reservation.source === 'whatsapp' ? 'WhatsApp' : (reservation.source?.toUpperCase() || 'UNKNOWN')}</span>
                </div>
              </div>
            </div>
            <span className={cn(statusStyles[reservation.status as keyof typeof statusStyles] || 'badge-pending')}>
              {statusLabels[reservation.status as keyof typeof statusLabels] || 'Unknown'}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(reservation.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{reservation.time || '--:--'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{reservation.guests || 0} guests</span>
            </div>
          </div>

          {/* Notes */}
          {reservation.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-3">
              "{reservation.notes}"
            </p>
          )}
        </button>

        {/* Actions */}
        {showActions && isPending && (
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDecline?.(reservation.id);
              }}
            >
              <X className="h-4 w-4" />
              Decline
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.(reservation.id);
              }}
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
          </div>
        )}
      </motion.div>
    );
  }
);

// Important pour le débogage dans React DevTools
ReservationCard.displayName = "ReservationCard";
