import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Activity, Users, ShieldCheck, User } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const LoginAnimation = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false); // Login ya Signup mode
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isSignup) {
        // Signup API Call
        await axios.post(`${API_URL}/signup`, { name, email, password });
        alert("Account ban gaya! Ab login karo.");
        setIsSignup(false); // Login form par switch karo
        setPassword('');
      } else {
        // Login API Call
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.user) {
          onLogin(response.data.user);
        }
      }
    } catch (err) {
      console.error(err);
      // Backend se jo error aayega wahi dikhega
      setError(err.response?.data?.detail || 'Backend se connect nahi ho pa raha. Check karo uvicorn chal raha hai ya nahi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="z-10 flex flex-col md:flex-row bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full mx-4">
        
        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-between bg-gradient-to-br from-indigo-950/80 to-slate-900 border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-600 p-2 rounded-lg"><Activity className="text-white" size={24} /></div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Smart Campus</h1>
            </div>
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
              Predict.<br />Prevent.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Perform.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-sm">Uniting campus data into one intelligent platform.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="bg-slate-800 p-2 rounded-full"><Users size={20} className="text-indigo-400" /></div>
              <p className="text-sm font-medium">Student Analytics Dashboard</p>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="bg-slate-800 p-2 rounded-full"><ShieldCheck size={20} className="text-blue-400" /></div>
              <p className="text-sm font-medium">AI-Powered Risk Prediction</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-slate-900/50">
          <h3 className="text-3xl font-bold text-white mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h3>
          <p className="text-slate-400 mb-8">{isSignup ? 'Sign up to get started.' : 'Please enter your details to sign in.'}</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@campus.edu" className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-indigo-500" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-500/30">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>{isSignup ? 'Sign Up' : 'Sign In'} <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAnimation;