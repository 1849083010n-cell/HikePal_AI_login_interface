import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// 安全配置说明 (Vite 本地开发模式)：
// ------------------------------------------------------------------
// 1. 在项目根目录创建一个名为 .env 的文件
// 2. 添加以下内容 (替换为你自己的 Supabase 密钥):
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_KEY=your-anon-key
// ------------------------------------------------------------------

// 安全获取环境变量，防止 import.meta.env 未定义导致崩溃
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_KEY');

// 检查是否已配置有效的 Supabase 凭证
const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// 如果没有配置，使用占位符以防止崩溃（应用会降级到 Mock 模式）
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