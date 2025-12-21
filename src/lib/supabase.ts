import { createClient } from '@supabase/supabase-js';

// Remplace par tes vraies infos trouvées dans Supabase (Settings > API)
const supabaseUrl = 'https://ton-projet.supabase.co';
const supabaseAnonKey = 'ta-cle-anon-ici';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
