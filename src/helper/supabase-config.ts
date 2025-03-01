import { createClient } from "@supabase/supabase-js";

<<<<<<< HEAD
const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL_SUPABASE || "";
const supabaseKey = process.env.NEXT_PUBLIC_BASE_KEY_SUPABASE || "";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
=======
const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL_SUPABASE || ''; // Provide a default empty string
const supabaseKey = process.env.NEXT_PUBLIC_BASE_KEY_SUPABASE || ''; // Provide a default empty string

// Check if the values are correctly set
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are not defined in the environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
    
>>>>>>> 98e0645e58e7b7be4ccdae48f028e8cc4a2bc1a5
