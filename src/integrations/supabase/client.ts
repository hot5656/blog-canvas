import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ukloaaccuetocrkxsdlv.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_B0JuVN99vLE1oZXyaTv2ow_X01htLIg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
