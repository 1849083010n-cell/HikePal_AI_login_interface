export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
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
