import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { User } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { HashRouter } from 'react-router-dom';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 辅助函数：从 profiles 表获取用户详情
  const fetchProfile = async (userId: string, email?: string, phone?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        return {
          id: userId,
          email: email,
          phone: phone,
          username: data.username,
          full_name: data.username, // 界面显示用
          avatar_url: data.avatar_url,
          role: data.role
        };
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    }
    
    // 如果 profiles 表里没有数据（比如刚注册还没写入），返回基础信息
    return {
      id: userId,
      email: email,
      phone: phone,
      full_name: email?.split('@')[0] || phone || 'Hiker'
    };
  };

  useEffect(() => {
    const initSession = async () => {
      // If Supabase is configured, check for an existing session
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchProfile(
            session.user.id, 
            session.user.email, 
            session.user.phone
          );
          setUser(userData);
        }
        setLoading(false);

        // 监听 Auth 状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
             const userData = await fetchProfile(
              session.user.id, 
              session.user.email, 
              session.user.phone
            );
            setUser(userData);
          } else {
            setUser(null);
          }
        });

        return () => subscription.unsubscribe();
      } else {
        // If mock mode, just stop loading
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium animate-pulse">Loading HikePal...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </HashRouter>
  );
};

export default App;