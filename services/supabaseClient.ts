import { createClient } from '@supabase/supabase-js';

// Helper to access env vars safely
const getEnvVar = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  return '';
};

// 1. Try loading from Environment Variables (.env file)
let supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
let supabaseKey = getEnvVar('VITE_SUPABASE_KEY');

// 2. If not found in .env, try loading from Local Storage (Manual Setup Fallback)
if (!supabaseUrl || !supabaseKey) {
  try {
    const storedUrl = localStorage.getItem('hikepal_supabase_url');
    const storedKey = localStorage.getItem('hikepal_supabase_key');
    if (storedUrl) supabaseUrl = storedUrl;
    if (storedKey) supabaseKey = storedKey;
  } catch (e) {
    console.warn("Local storage access failed");
  }
}

// Validation
const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// Debug log
if (isSupabaseConfigured) {
  console.log("✅ Supabase connected.");
} else {
  console.warn("⚠️ Supabase NOT configured. Running in Demo Mode.");
}

// Create Client
const clientUrl = isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isKeyValid ? supabaseKey : 'placeholder-key';

export const supabase = createClient(clientUrl, clientKey);

// 3. Helper functions for UI-based configuration
export const saveSupabaseConfig = (url: string, key: string) => {
  if (!url || !key) return;
  localStorage.setItem('hikepal_supabase_url', url);
  localStorage.setItem('hikepal_supabase_key', key);
  // Reload page to re-initialize the supabase client with new values
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('hikepal_supabase_url');
  localStorage.removeItem('hikepal_supabase_key');
  window.location.reload();
};

export const mockLogin = async (emailOrPhone: string): Promise<{ user: any; error: any }> => {
  console.log("Mock Login triggered for:", emailOrPhone);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: {
      id: 'mock-user-id-123',
      email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
      full_name: 'HikePal Explorer (Demo)',
      avatar_url: 'https://picsum.photos/200/200',
    },
    error: null
  };
};