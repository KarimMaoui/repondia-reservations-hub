import { createClient } from '@supabase/supabase-js';

// Remplace par tes vraies infos trouvées dans Supabase (Settings > API)
const supabaseUrl = 'https://lneatawnixlynoglxzob.supabase.co';
const supabaseAnonKey = 'sb_publishable_0x_lrDlFDiHR4vWi-SIDqQ_MtoCULOX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
