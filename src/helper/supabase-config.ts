import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL_SUPABASE || "";
const supabaseKey = process.env.NEXT_PUBLIC_BASE_KEY_SUPABASE || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
