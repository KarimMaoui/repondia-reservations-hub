import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Création d'un nouvel utilisateur
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else toast.success("Compte créé ! Tu peux maintenant te connecter.");
    } else {
      // Connexion d'un utilisateur existant
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("Identifiants incorrects");
      else {
        toast.success("Bienvenue !");
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <h1 className="text-3xl font-bold text-center mb-2">Repondia</h1>
        <p className="text-slate-500 text-center mb-8 italic">Votre assistant de réservation</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email professionnel" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="h-12 rounded-xl"
          />
          <Input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="h-12 rounded-xl"
          />
          <Button className="w-full h-12 rounded-xl font-semibold" type="submit" disabled={loading}>
            {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-slate-400 hover:text-primary transition-colors mt-4"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Nouveau ? Créer un compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
