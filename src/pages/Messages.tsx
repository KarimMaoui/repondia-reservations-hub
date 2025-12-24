import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setConversations(data);
      setLoading(false);
    };

    fetchConversations();

    const channel = supabase
      .channel('messages-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, (payload) => {
        setConversations((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-3 px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Vrais Messages WhatsApp</h1>
          </div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Connexion à Supabase...</div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <div key={conv.id} className="w-full flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {conv.customer_name?.substring(0, 1) || 'W'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{conv.customer_name}</h3>
                    <span className="text-xs text-slate-400">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Réservation pour {conv.guests_count} pers.
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
               <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500">Aucun message réel dans Supabase.</p>
               <p className="text-xs text-slate-400 mt-2">Utilise le SQL Editor pour en ajouter un !</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
