import { ReactNode } from 'react';
import { BottomTabBar } from './BottomTabBar';
import { dashboardStats } from '@/data/mockData';

interface AppLayoutProps {
  children: ReactNode;
  hideTabBar?: boolean;
}

export function AppLayout({ children, hideTabBar = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={hideTabBar ? '' : 'safe-bottom'}>
        {children}
      </main>
      {!hideTabBar && (
        <BottomTabBar 
          pendingCount={dashboardStats.pendingRequests} 
          unreadMessages={dashboardStats.unreadMessages} 
        />
      )}
    </div>
  );
}
