// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ulvmmeaqkkilanvgyuwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdm1tZWFxa2tpbGFudmd5dXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNTA0MDMsImV4cCI6MjA1MDkyNjQwM30.omuNuOTmclhTJrzCaZ7VyvxmrxrwODzcdc5clV3CEPI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);