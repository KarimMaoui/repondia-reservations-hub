import { ReactNode, useEffect, useState } from 'react';
import { BottomTabBar } from './BottomTabBar';
import { supabase } from '@/lib/supabase';

interface AppLayoutProps {
  children: ReactNode;
  hideTabBar?: boolean;
}

export function AppLayout({ children, hideTabBar = false }: AppLayoutProps) {
  const [pendingCount, setPendingCount] = useState(0);

  // On récupère le nombre de réservations en attente en temps réel pour le badge
  useEffect(() => {
    const fetchCounts = async () => {
      const { count } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setPendingCount(count || 0);
    };

    fetchCounts();

    const channel = supabase
      .channel('layout-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchCounts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className={hideTabBar ? '' : 'pb-20'}>
        {children}
      </main>
      {!hideTabBar && (
        <BottomTabBar 
          pendingCount={pendingCount} 
          unreadMessages={0} // On pourra lier ça plus tard
        />
      )}
    </div>
  );
}
