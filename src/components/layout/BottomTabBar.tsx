import { motion } from 'framer-motion';
import { CalendarCheck, MessageSquare, User } from 'lucide-react'; // Suppression de Phone et Plus
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

// Mise à jour : Uniquement les 3 onglets essentiels pour ton flux WhatsApp
const tabs: TabItem[] = [
  { id: 'requests', label: 'Requests', icon: CalendarCheck, path: '/dashboard' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
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
    // La logique spécifique au bouton "Plus" a été supprimée
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
        {/* Ajustement du padding pour un meilleur espacement avec 3 icônes */}
        <div className="flex items-center justify-around px-6 pb-[env(safe-area-inset-bottom,12px)] pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            const badge = tab.id === 'requests' ? pendingCount : tab.id === 'messages' ? unreadMessages : undefined;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-4 min-w-[80px]",
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
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-1 text-[11px] font-medium transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
                
                {/* Indicateur visuel sous l'icône active */}
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
