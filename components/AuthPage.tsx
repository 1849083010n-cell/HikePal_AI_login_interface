import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, mockLogin } from '../services/supabaseClient';
import { AuthMode, AuthMethod, User } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Mail, Phone, Lock, User as UserIcon, ArrowRight, Mountain, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [method, setMethod] = useState<AuthMethod>(AuthMethod.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (method === AuthMethod.EMAIL && !email) throw new Error("Email is required");
      if (method === AuthMethod.PHONE) {
        if (!phone) throw new Error("Phone number is required");
        if (phone.length !== 8) throw new Error("Hong Kong phone numbers must be 8 digits");
      }
      if (mode !== AuthMode.FORGOT_PASSWORD && !password && method === AuthMethod.EMAIL) throw new Error("Password is required");

      // DEMO MODE CHECK
      // If Supabase credentials aren't set in env, we use the mock login to demonstrate the UI flow.
      if (!isSupabaseConfigured) {
        console.warn("Supabase not configured. Using Mock Login.");
        
        // Simulate OTP step for phone
        if (method === AuthMethod.PHONE && !showOtpInput && mode !== AuthMode.FORGOT_PASSWORD) {
          await new Promise(r => setTimeout(r, 800)); // Fake network delay
          setShowOtpInput(true);
          setLoading(false);
          return;
        }

        const { user, error: mockError } = await mockLogin(method === AuthMethod.EMAIL ? email : phone);
        if (mockError) throw new Error(mockError);
        if (user) onLoginSuccess({ ...user, full_name: fullName || user.full_name });
        return;
      }

      // REAL SUPABASE LOGIC
      // 1. Email Login / Register
      if (method === AuthMethod.EMAIL) {
        if (mode === AuthMode.REGISTER) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
          });
          if (error) throw error;
          if (data.user) onLoginSuccess({ id: data.user.id, email: data.user.email, full_name: fullName });
        } else if (mode === AuthMode.LOGIN) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) onLoginSuccess({ id: data.user.id, email: data.user.email });
        }
      } 
      // 2. Phone Login (Note: Requires Supabase Phone Auth setup with SMS provider)
      else if (method === AuthMethod.PHONE) {
        const formattedPhone = `+852${phone}`;
        
        if (!showOtpInput) {
            // Step 1: Send OTP
            const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
            if (error) throw error;
            setShowOtpInput(true);
        } else {
            // Step 2: Verify OTP
            const { data, error } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: otp,
                type: 'sms'
            });
            if (error) throw error;
            if (data.user) onLoginSuccess({ id: data.user.id, phone: phone });
        }
      }

    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
    setError(null);
    setShowOtpInput(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/1036/1920/1080" 
          alt="Hong Kong Mountains" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Section */}
        <div className="bg-emerald-600 px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Abstract topo lines pattern could go here */}
             <svg width="100%" height="100%">
               <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                 <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
               </pattern>
               <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
             </svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-sm shadow-inner">
              <Mountain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome to HikePal</h1>
            <p className="text-emerald-100 text-sm mt-1">Your Ultimate Hong Kong Hiking Companion</p>
          </div>
        </div>

        {/* Method Toggles */}
        <div className="flex border-b border-stone-100">
          <button
            onClick={() => { setMethod(AuthMethod.EMAIL); setError(null); }}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              method === AuthMethod.EMAIL ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Email
            {method === AuthMethod.EMAIL && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600" />}
          </button>
          <button
            onClick={() => { setMethod(AuthMethod.PHONE); setError(null); }}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              method === AuthMethod.PHONE ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Mobile (HK)
            {method === AuthMethod.PHONE && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600" />}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Mode Title */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-800">
                {mode === AuthMode.LOGIN ? 'Sign In' : mode === AuthMode.REGISTER ? 'Create Account' : 'Reset Password'}
              </h2>
              <p className="text-stone-500 text-sm">
                {mode === AuthMode.LOGIN 
                  ? 'Enter your details to continue your journey.' 
                  : mode === AuthMode.REGISTER 
                  ? 'Join the community of hikers today.'
                  : 'Enter your email to receive a reset link.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name Field (Register only) */}
            {mode === AuthMode.REGISTER && (
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                icon={<UserIcon className="h-5 w-5" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            {/* Email Form */}
            {method === AuthMethod.EMAIL && (
              <>
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  icon={<Mail className="h-5 w-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {mode !== AuthMode.FORGOT_PASSWORD && (
                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
              </>
            )}

            {/* Phone Form */}
            {method === AuthMethod.PHONE && (
              <>
                {!showOtpInput ? (
                   <div className="space-y-1.5">
                     <label className="block text-sm font-medium text-stone-700">Phone Number</label>
                     <div className="relative flex">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 bg-stone-50 border-r border-stone-200 rounded-l-lg pr-2 z-10">
                         <span className="text-sm font-medium">🇭🇰 +852</span>
                       </div>
                       <input
                         type="tel"
                         maxLength={8}
                         className="block w-full rounded-lg border border-stone-300 bg-white pl-24 pr-4 py-2.5 text-stone-900 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 focus:outline-none transition-all"
                         placeholder="1234 5678"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <Phone className="h-5 w-5 text-stone-400" />
                       </div>
                     </div>
                   </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <Input 
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center tracking-widest text-lg font-mono"
                      maxLength={6}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowOtpInput(false)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 mt-2 font-medium"
                    >
                      Change Phone Number
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="pt-2">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={loading}
              >
                {mode === AuthMode.LOGIN ? 'Log In' : mode === AuthMode.REGISTER ? 'Sign Up' : 'Send Reset Link'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Footer / Toggle */}
            <div className="text-center text-sm">
              {mode === AuthMode.LOGIN ? (
                <p className="text-stone-500">
                  Don't have an account?{' '}
                  <button type="button" onClick={toggleMode} className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-stone-500">
                  Already have an account?{' '}
                  <button type="button" onClick={toggleMode} className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                    Log in
                  </button>
                </p>
              )}
              
              {mode === AuthMode.LOGIN && method === AuthMethod.EMAIL && (
                <button 
                  type="button"
                  onClick={() => setMode(AuthMode.FORGOT_PASSWORD)}
                  className="mt-4 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Forgot your password?
                </button>
              )}
               {mode === AuthMode.FORGOT_PASSWORD && (
                <button 
                  type="button"
                  onClick={() => setMode(AuthMode.LOGIN)}
                  className="mt-4 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Back to login
                </button>
              )}
            </div>

          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full text-center z-10">
        <p className="text-white/40 text-xs">© 2024 HikePal Hong Kong. All rights reserved.</p>
      </div>
    </div>
  );
};
