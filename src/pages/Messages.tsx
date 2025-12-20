import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Check, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { messages } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Messages() {
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
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getLastMessage = (msgs: typeof messages[0]['messages']) => {
    return msgs[msgs.length - 1];
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
            <h1 className="text-lg font-semibold text-foreground">Messages</h1>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {messages.map((conversation, index) => {
            const lastMessage = getLastMessage(conversation.messages);
            const isFromCustomer = lastMessage.sender === 'customer';

            return (
              <motion.button
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/messages/${conversation.id}`)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary/30 to-primary/20">
                    <span className="text-sm font-semibold text-secondary-foreground">
                      {conversation.customerName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn(
                      "font-medium truncate",
                      conversation.unreadCount > 0 ? "text-foreground" : "text-foreground/80"
                    )}>
                      {conversation.customerName}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!isFromCustomer && (
                      <CheckCheck className={cn(
                        "h-4 w-4 shrink-0",
                        lastMessage.read ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                    <p className={cn(
                      "text-sm truncate",
                      conversation.unreadCount > 0 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {lastMessage.content}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No messages</h3>
            <p className="text-sm text-muted-foreground">Customer messages will appear here.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
