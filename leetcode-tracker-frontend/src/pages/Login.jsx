import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Code2, Brain, Activity } from 'lucide-react';

const API_URL = "https://dsa-mastery-hub.onrender.com/api/auth";

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        await axios.post(`${API_URL}/forgot-password`, { 
          email, 
          leetcodeUsername: username, 
          newPassword: password 
        });
        setSuccessMsg("Password reset successfully! You can now log in.");
        setIsForgotPassword(false);
        setPassword('');
      } else {
        const endpoint = isRegistering ? '/register' : '/login';
        const payload = isRegistering 
          ? { email, password, leetcodeUsername: username }
          : { email, password, leetcodeUsername: "" };
          
        const res = await axios.post(`${API_URL}${endpoint}`, payload);
        onLogin(res.data.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-100 selection:bg-sky-500/30">
      
      {/* Left Panel: Visual Hook (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/50 z-0"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px]"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-sky-500/20 p-2 rounded-xl border border-sky-500/30">
            <Code2 className="text-sky-400" size={28} />
          </div>
          <span className="text-2xl font-bold tracking-wider text-slate-200">DSA<span className="text-sky-400">Master</span></span>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Level up your algorithmic thinking.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10">
            Automatically intercept your LeetCode submissions, analyze Time & Space complexity with Gemini AI, and track your true skill progression.
          </p>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/50">
              <Brain className="text-indigo-400" size={24} />
              <div className="text-sm font-medium text-slate-300">AI Analysis</div>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/50">
              <Activity className="text-emerald-400" size={24} />
              <div className="text-sm font-medium text-slate-300">Skill Tracking</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 font-medium">
          Powered by Google Gemini 2.5 Flash
        </div>
      </div>

      {/* Right Panel: Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-50 dark:bg-transparent transition-colors duration-300">
        
        {/* Mobile Background Elements (Dark Mode Only) */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full dark:bg-slate-950 -z-10"></div>
        <div className="lg:hidden absolute top-0 right-0 w-64 h-64 dark:bg-sky-500/10 rounded-full blur-[80px] -z-10"></div>

        <div className="w-full max-w-sm bg-white dark:bg-slate-900/60 dark:backdrop-blur-2xl p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-300">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isForgotPassword ? "Reset Password" : "Login"}
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Email</label>
              <input 
                type="email" required
                placeholder="Email @example.com"
                className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/80 rounded-lg p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-sky-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-500 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isForgotPassword || isRegistering ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">LeetCode Username</label>
              <input 
                type="text" required={isForgotPassword || isRegistering}
                placeholder="johndoe123"
                className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/80 rounded-lg p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-sky-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-500 transition-all"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">{isForgotPassword ? "New Password" : "Password"}</label>
                {!isForgotPassword && (
                  <button type="button" onClick={() => { setIsForgotPassword(true); setIsRegistering(false); }} className="text-xs text-slate-500 hover:text-slate-800 dark:text-sky-400 dark:hover:text-sky-300 hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required
                  placeholder="Password"
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700/80 rounded-lg p-3 pr-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-sky-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-500 transition-all"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              {isForgotPassword || isRegistering ? (
                <>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isForgotPassword ? "Reset Password" : "Create Account")}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(false); setIsRegistering(false); setError(''); }}
                    className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium py-3 rounded-lg transition-all"
                  >
                    Back to Login
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Login"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsRegistering(true); setError(''); }}
                    className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium py-3 rounded-lg transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
