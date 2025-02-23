import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL_SUPABASE;
const supabaseKey = process.env.NEXT_PUBLIC_BASE_KEY_SUPABASE;

export const supabase = createClient(supabaseUrl, supabaseKey);