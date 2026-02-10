import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// 安全配置说明：
// ------------------------------------------------------------------
// 本地开发时，请确保您的 .env 文件包含以下键，并且以 VITE_ 开头：
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_KEY=your-anon-key
// ------------------------------------------------------------------

const getEnvVar = (key: string) => {
  // 优先使用 Vite 的 import.meta.env (浏览器标准)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${key}`] || import.meta.env[key];
  }
  
  // 安全地检查 process.env (防止在浏览器中报错 'process is not defined')
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[`VITE_${key}`] || process.env[key];
    }
  } catch (e) {
    // 忽略错误
  }
  
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL') || '';
const supabaseKey = getEnvVar('SUPABASE_KEY') || '';

// 检查是否已配置有效的 Supabase 凭证
const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// 防止因 URL 无效导致 createClient 崩溃
const clientUrl = isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isKeyValid ? supabaseKey : 'placeholder-key';

export const supabase = createClient(clientUrl, clientKey);

export const mockLogin = async (emailOrPhone: string): Promise<{ user: any; error: any }> => {
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