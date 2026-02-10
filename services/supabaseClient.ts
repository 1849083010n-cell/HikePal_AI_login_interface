import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// 安全配置说明：
// ------------------------------------------------------------------
// 本地开发时，请确保您的 .env 文件包含以下键，并且以 VITE_ 开头：
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_KEY=your-anon-key
// ------------------------------------------------------------------

// 在 Vite 中，必须直接访问 import.meta.env.VITE_xxx 才能被正确打包
// 不要使用动态 key (如 env[key]) 或 process.env，这会导致读取失败或报错
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// 检查是否已配置有效的 Supabase 凭证
// URL 必须存在且以 http 开头
const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
// Key 必须存在
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// 防止因 URL 无效导致 createClient 崩溃
// 如果没有配置，使用占位符，这样应用不会直接白屏，而是会 fallback 到 mock 模式
const clientUrl = isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isKeyValid ? supabaseKey : 'placeholder-key';

export const supabase = createClient(clientUrl, clientKey);

export const mockLogin = async (emailOrPhone: string): Promise<{ user: any; error: any }> => {
  // 模拟网络延迟
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