import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Clock, Phone, Mail, MapPin, 
  Bell, Shield, HelpCircle, LogOut, ChevronRight, 
  Users, Palette, Save, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // État des données du restaurant
  const [profile, setProfile] = useState({
    restaurant_name: '',
    address: '',
    phone: '',
    email_pro: '',
    opening_hours: '',
    capacity: 0
  });

  // 1. Charger les données au démarrage
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // 2. Sauvegarder les modifications
  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) toast.error("Erreur lors de la mise à jour");
    else toast.success("Profil mis à jour !");
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen pb-20">
        {/* Header avec bouton Sauvegarder */}
        <div className="sticky top-0 z-10 glass border-b border-border/50 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Paramètres</h1>
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2 rounded-xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Carte Restaurant Dynamique */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-4 p-5 bg-white rounded-3xl border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <Input 
                variant="ghost" 
                className="text-xl font-bold p-0 h-auto focus-visible:ring-0 border-none"
                value={profile.restaurant_name}
                onChange={(e) => setProfile({...profile, restaurant_name: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">Compte vérifié</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <Input 
                className="h-8 text-sm border-none bg-slate-50 rounded-lg"
                placeholder="Adresse du restaurant"
                value={profile.address || ''}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <Input 
                className="h-8 text-sm border-none bg-slate-50 rounded-lg"
                placeholder="Numéro de téléphone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <Input 
                className="h-8 text-sm border-none bg-slate-50 rounded-lg"
                placeholder="Email de contact"
                value={profile.email_pro || ''}
                onChange={(e) => setProfile({...profile, email_pro: e.target.value})}
              />
            </div>
          </div>
        </motion.div>

        {/* Section Preferences Dynamique */}
        <div className="mt-8">
          <h3 className="px-6 mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Préférences</h3>
          <div className="bg-white border-y divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-xl"><Clock className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="font-medium">Horaires d'ouverture</p>
                  <input 
                    className="text-sm text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-full"
                    value={profile.opening_hours || ''}
                    onChange={(e) => setProfile({...profile, opening_hours: e.target.value})}
                    placeholder="ex: 12:00-14:30, 19:00-22:30"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 rounded-xl"><Users className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <p className="font-medium">Capacité totale</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      className="text-sm text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-12"
                      value={profile.capacity || 0}
                      onChange={(e) => setProfile({...profile, capacity: parseInt(e.target.value)})}
                    />
                    <span className="text-sm text-slate-400 text-sm">couverts disponibles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-10 px-4">
          <Button 
            variant="destructive" 
            className="w-full h-12 rounded-2xl gap-2 font-bold"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Se déconnecter
          </Button>
          <p className="text-center text-xs text-slate-400 mt-6">Repondia v1.0.0 — 2025</p>
        </div>
      </div>
    </AppLayout>
  );
}
