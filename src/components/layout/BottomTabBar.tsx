import { motion } from 'framer-motion';
import { CalendarCheck, MessageSquare, User, Calendar } from 'lucide-react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

// Mise à jour : Ajout de l'onglet Calendar pour voir les réservations acceptées
const tabs: TabItem[] = [
  { id: 'requests', label: 'Requests', icon: CalendarCheck, path: '/dashboard' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' }, // Nouvel onglet
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

interface BottomTabBarProps {
  pendingCount?: number;
  unreadMessages?: number;
}

export function BottomTabBar({ pendingCount = 0, unreadMessages = 0 }: BottomTabBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabPress = (tab: TabItem) => {
    navigate(tab.path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-border/50 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,12px)] pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            const badge = tab.id === 'requests' ? pendingCount : tab.id === 'messages' ? unreadMessages : undefined;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-2 min-w-[70px]",
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
                  {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-white">
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
                    className="absolute -bottom-1 h-1 w-6 rounded-full bg-primary"
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
