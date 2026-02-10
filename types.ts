export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string; // 对应 profiles 表的 username
  full_name?: string; // 保留用于兼容显示
  avatar_url?: string; // 对应 profiles 表的 avatar_url
  role?: string; // 对应 profiles 表的 role (e.g., 'hiker')
}

export enum AuthMode {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum AuthMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}