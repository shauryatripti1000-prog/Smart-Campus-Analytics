import { useState } from 'react'
import axios from 'axios'
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import LoginAnimation from './LoginAnimation'

const API = 'http://127.0.0.1:8000'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = isRegister ? `${API}/auth/register` : `${API}/auth/login`
      const payload = isRegister
        ? { email, password, role, roll_no: role === 'student' ? Number(rollNo) : null }
        : { email, password }
      
      const res = await axios.post(url, payload)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@campus.edu')
      setPassword('admin123')
    } else {
      setEmail('aarav@campus.edu')
      setPassword('student123')
    }
    setIsRegister(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Animated Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-12 flex-col justify-between relative overflow-hidden">
        <LoginAnimation />

        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Smart Campus</h1>
            <p className="text-sm text-white/60">Analytics Platform</p>
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="text-5xl font-extrabold mb-5 leading-[1.1] tracking-tight">
            Predict.<br />
            Prevent.<br />
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Excel.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-md leading-relaxed">
            AI-powered platform that identifies at-risk students before it's too late — turning campus data into student success.
          </p>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-extrabold">50+</p>
              <p className="text-sm text-white/50 mt-1">Students</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">7</p>
              <p className="text-sm text-white/50 mt-1">Data Sources</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">24/7</p>
              <p className="text-sm text-white/50 mt-1">AI Copilot</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-sm">
          © 2024 Smart Campus Analytics · All rights reserved
        </p>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2540e0' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Smart Campus</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isRegister ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="text-slate-500 mb-8">
            {isRegister ? 'Sign up to get started' : 'Sign in to access your dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Register Fields */}
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Roll Number
                    </label>
                    <input
                      type="number"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="501"
                    />
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: '#2540e0',
                color: 'white'
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create account' : 'Sign in'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemo('admin')}
                className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                👨‍💼 Admin Demo
              </button>
              <button
                onClick={() => fillDemo('student')}
                className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                🎓 Student Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}