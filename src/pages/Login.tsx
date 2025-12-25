import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // 1. Création du compte utilisateur
        const { data, error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password 
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // 2. Création du profil lié avec le nom du restaurant
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ 
              id: data.user.id, 
              restaurant_name: restaurantName 
            });
          
          if (profileError) throw profileError;

          toast.success("Compte créé avec succès !");
          navigate('/dashboard');
        }
      } else {
        // Connexion simple
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (signInError) throw signInError;

        toast.success("Bon retour !");
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Repondia</h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isSignUp ? "Commencez à automatiser vos réservations" : "Gérez votre restaurant en toute simplicité"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-sm font-semibold text-slate-700 ml-1">Nom de l'établissement</label>
                <Input 
                  type="text"
                  placeholder="Ex: La Trattoria" 
                  value={restaurantName} 
                  onChange={(e) => setRestaurantName(e.target.value)} 
                  required={isSignUp}
                  className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
            <Input 
              type="email" 
              placeholder="chef@restaurant.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Mot de passe</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="rounded-xl h-12 border-slate-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <Button 
            className="w-full h-12 mt-4 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Chargement...
              </div>
            ) : isSignUp ? "Créer mon compte" : "Se connecter"}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Ou</span></div>
          </div>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm font-semibold text-slate-500 hover:text-primary transition-colors py-2"
          >
            {isSignUp ? "Vous avez déjà un compte ? Connectez-vous" : "Pas encore de compte ? Inscrivez votre restaurant"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
