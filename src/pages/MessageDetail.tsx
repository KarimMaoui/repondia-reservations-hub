import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Info, Check, CheckCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { messages } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function MessageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const conversation = messages.find(m => m.id === id);

  if (!conversation) {
    return (
      <AppLayout hideTabBar>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <p className="text-muted-foreground">Conversation not found</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = conversation.messages.reduce((groups, message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, typeof conversation.messages>);

  return (
    <AppLayout hideTabBar>
      <div className="flex flex-col min-h-screen bg-muted/30">
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-border/50">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary/30 to-primary/20">
                <span className="text-sm font-semibold text-secondary-foreground">
                  {conversation.customerName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{conversation.customerName}</h1>
                <p className="text-xs text-muted-foreground">{conversation.customerPhone}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5 text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => navigate(`/reservation/${conversation.reservationId}`)}
            >
              <Info className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {dateKey}
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {msgs.map((message, index) => {
                  const isCustomer = message.sender === 'customer';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex",
                        isCustomer ? "justify-start" : "justify-end"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] px-4 py-2.5 rounded-2xl",
                          isCustomer
                            ? "bg-card border border-border/50 rounded-bl-md"
                            : "bg-primary text-primary-foreground rounded-br-md"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={cn(
                          "flex items-center justify-end gap-1 mt-1",
                          isCustomer ? "text-muted-foreground" : "text-primary-foreground/70"
                        )}>
                          <span className="text-[10px]">{formatTime(message.timestamp)}</span>
                          {!isCustomer && (
                            <CheckCheck className={cn(
                              "h-3.5 w-3.5",
                              message.read ? "text-primary-foreground" : "text-primary-foreground/50"
                            )} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Read-only notice */}
        <div className="sticky bottom-0 glass border-t border-border/50 px-4 py-3">
          <p className="text-center text-sm text-muted-foreground">
            This conversation is read-only. Use WhatsApp to reply.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
