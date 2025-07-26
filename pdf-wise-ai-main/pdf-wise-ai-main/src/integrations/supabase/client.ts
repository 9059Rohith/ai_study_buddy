import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uifzuiwhnfysjahxqsmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZnp1aXdobmZ5c2phaHhxc21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDA4MDEsImV4cCI6MjA2OTA3NjgwMX0.6gRFzKoERQK8vgbmsDmvTcX9-lRS8Pp-uaQ0-XhyeHI";


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});