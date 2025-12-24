import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ukloaaccuetocrkxsdlv.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbG9hYWNjdWV0b2Nya3hzZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzQ1MTYsImV4cCI6MjA4MTE1MDUxNn0.IH7L48O319kSVViA5OEcyVCBH0wRKzsJnTeji77q3YM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
