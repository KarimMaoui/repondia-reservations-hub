import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, MessageSquare, PhoneCall, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onClick?: (id: string) => void;
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
  declined: 'badge-declined',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Confirmed',
  declined: 'Declined',
};

export function ReservationCard({
  reservation,
  onAccept,
  onDecline,
  onClick,
  showActions = true,
}: ReservationCardProps) {
  const SourceIcon = sourceIcons[reservation.source];
  const isPending = reservation.status === 'pending';

  const formatDate = (dateString: string) => {
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
                {reservation.customerName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{reservation.customerName}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SourceIcon className="h-3 w-3" />
                <span>via {reservation.source === 'whatsapp' ? 'WhatsApp' : reservation.source.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <span className={cn(statusStyles[reservation.status])}>
            {statusLabels[reservation.status]}
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
            <span>{reservation.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.guests} guests</span>
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
            variant="decline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onDecline?.(reservation.id);
            }}
          >
            <X className="h-4 w-4" />
            Decline
          </Button>
          <Button
            variant="accept"
            size="sm"
            className="flex-1"
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
