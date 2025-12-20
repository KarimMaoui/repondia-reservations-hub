import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, Phone, MessageSquare, PhoneCall, MapPin, Check, X, Mail } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { reservations } from '@/data/mockData';
import { cn } from '@/lib/utils';

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

export default function ReservationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const reservation = reservations.find(r => r.id === id);

  if (!reservation) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <p className="text-muted-foreground">Reservation not found</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const SourceIcon = sourceIcons[reservation.source];
  const isPending = reservation.status === 'pending';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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
            <div className="flex-1">
              <h1 className="font-semibold text-foreground">Reservation Details</h1>
            </div>
            <span className={cn(statusStyles[reservation.status])}>
              {statusLabels[reservation.status]}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-secondary/30 to-primary/20">
                <span className="text-lg font-bold text-secondary-foreground">
                  {reservation.customerName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{reservation.customerName}</h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <SourceIcon className="h-4 w-4" />
                  <span>via {reservation.source === 'whatsapp' ? 'WhatsApp' : reservation.source.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </motion.div>

          {/* Reservation Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-5 space-y-4"
          >
            <h3 className="font-semibold text-secondary">Reservation Info</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{formatDate(reservation.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{reservation.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Party Size</p>
                  <p className="font-medium text-foreground">{reservation.guests} guests</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{reservation.customerPhone}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {reservation.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-elevated p-5"
            >
              <h3 className="font-semibold text-secondary mb-3">Special Requests</h3>
              <p className="text-foreground bg-muted/50 rounded-xl p-4">
                "{reservation.notes}"
              </p>
            </motion.div>
          )}

          {/* Request Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground"
          >
            Request received {formatCreatedAt(reservation.createdAt)}
          </motion.div>

          {/* Action Buttons */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 pt-4"
            >
              <Button variant="decline" size="lg" className="flex-1">
                <X className="h-5 w-5 mr-2" />
                Decline
              </Button>
              <Button variant="accept" size="lg" className="flex-1">
                <Check className="h-5 w-5 mr-2" />
                Accept
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
