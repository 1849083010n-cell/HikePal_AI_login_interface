import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// 安全配置说明：
// ------------------------------------------------------------------
// 为了安全起见，不要将 API Key 直接写在代码里上传到 GitHub。
// 请在项目根目录创建一个名为 .env 的文件（Git 会忽略它），并填入以下内容：
// 
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_KEY=your-anon-key
// ------------------------------------------------------------------

// 尝试获取环境变量 (支持 Vite, Create React App 或标准 Node 环境)
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`] || import.meta.env[key];
  }
  return process.env[`VITE_${key}`] || process.env[`REACT_APP_${key}`] || process.env[key];
};

const supabaseUrl = getEnvVar('SUPABASE_URL') || '';
const supabaseKey = getEnvVar('SUPABASE_KEY') || '';

// 检查是否已配置有效的 Supabase 凭证
const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http');
const isKeyValid = supabaseKey && supabaseKey.length > 0;

export const isSupabaseConfigured = isUrlValid && isKeyValid;

// 防止因 URL 无效导致 createClient 崩溃
// 如果本地 .env 没有配置，我们使用占位符，但 AuthPage 会检测 isSupabaseConfigured 并使用 Mock 模式
const clientUrl = isUrlValid ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isKeyValid ? supabaseKey : 'placeholder-key';

// 初始化 Supabase 客户端
export const supabase = createClient(clientUrl, clientKey);

// 用于演示的模拟登录功能（当未连接数据库时使用）
export const mockLogin = async (emailOrPhone: string): Promise<{ user: any; error: any }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功返回
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