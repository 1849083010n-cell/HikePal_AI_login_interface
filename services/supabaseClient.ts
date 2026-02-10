import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// 1. 确保在项目根目录有 .env 文件
// 2. 内容如下:
// VITE_SUPABASE_URL=你的地址
// VITE_SUPABASE_KEY=你的Key
// ------------------------------------------------------------------

// Safely access environment variables to avoid "undefined is not an object" error
const getEnvVar = (key: string) => {
  try {
    // Check if import.meta and import.meta.env exist before accessing
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || '';
    }
  } catch (e) {
    console.warn('Error reading env var:', key);
  }
  return '';
};

// 在 Vite 中，我们直接使用 import.meta.env，但通过 helper 安全获取
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_KEY');

const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// Debug log to help user
if (isSupabaseConfigured) {
  console.log("✅ Supabase is configured and connected.");
} else {
  console.warn("⚠️ Supabase is NOT configured. App is running in Demo Mode. Data will not be saved.");
  if (typeof import.meta !== 'undefined' && !import.meta.env) {
     console.warn("NOTE: import.meta.env is undefined. Ensure you are running with Vite (npm run dev).");
  } else {
     console.log("Current URL:", supabaseUrl);
     console.log("Current Key length:", supabaseKey.length);
  }
}

const clientUrl = isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isKeyValid ? supabaseKey : 'placeholder-key';

export const supabase = createClient(clientUrl, clientKey);

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