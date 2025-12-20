import { motion } from 'framer-motion';
import { ArrowLeft, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Voicemail, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { callLogs } from '@/data/mockData';
import { cn } from '@/lib/utils';

const callTypeIcons = {
  missed: PhoneMissed,
  received: PhoneIncoming,
  outgoing: PhoneOutgoing,
};

const callTypeStyles = {
  missed: 'text-destructive',
  received: 'text-success',
  outgoing: 'text-muted-foreground',
};

export default function Calls() {
  const navigate = useNavigate();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const groupedCalls = callLogs.reduce((groups, call) => {
    const date = new Date(call.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(call);
    return groups;
  }, {} as Record<string, typeof callLogs>);

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
            <h1 className="text-lg font-semibold text-foreground">Call History</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {Object.entries(groupedCalls).map(([dateKey, calls]) => (
            <div key={dateKey}>
              <h2 className="text-sm font-semibold text-secondary mb-3">{dateKey}</h2>
              <div className="space-y-2">
                {calls.map((call, index) => {
                  const Icon = callTypeIcons[call.type];
                  return (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-subtle flex items-center gap-4 p-4"
                    >
                      <div className={cn(
                        "p-2.5 rounded-full",
                        call.type === 'missed' ? 'bg-destructive/10' : 'bg-muted'
                      )}>
                        <Icon className={cn("h-5 w-5", callTypeStyles[call.type])} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">
                            {call.customerName || call.customerPhone}
                          </p>
                          {call.hasVoicemail && (
                            <Voicemail className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{call.type.charAt(0).toUpperCase() + call.type.slice(1)}</span>
                          {call.duration > 0 && (
                            <>
                              <span>•</span>
                              <span>{formatDuration(call.duration)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{formatTime(call.timestamp)}</p>
                      </div>

                      <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
