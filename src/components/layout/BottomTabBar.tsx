import { motion } from 'framer-motion';
import { CalendarCheck, Phone, MessageSquare, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const tabs: TabItem[] = [
  { id: 'requests', label: 'Requests', icon: CalendarCheck, path: '/dashboard' },
  { id: 'calls', label: 'Calls', icon: Phone, path: '/calls' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: 3 },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

interface BottomTabBarProps {
  pendingCount?: number;
  unreadMessages?: number;
}

export function BottomTabBar({ pendingCount = 3, unreadMessages = 3 }: BottomTabBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabPress = (tab: TabItem) => {
    if (tab.id === 'action') {
      // Center action button - navigate to new reservation or quick action
      navigate('/dashboard');
      return;
    }
    navigate(tab.path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-border/50">
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            const badge = tab.id === 'requests' ? pendingCount : tab.id === 'messages' ? unreadMessages : undefined;

            

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-4 min-w-[64px]",
                  "transition-colors duration-200"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      active ? "text-primary" : "text-muted-foreground"
                    )} 
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {badge && badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-1 text-[10px] font-medium transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 h-0.5 w-8 rounded-full bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
