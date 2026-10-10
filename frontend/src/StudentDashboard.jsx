import { useState, useEffect } from 'react'
import axios from 'axios'
import { Flame, Target, TrendingUp, MessageCircle, LogOut, GraduationCap, CheckCircle2, Calendar } from 'lucide-react'

const API = 'http://127.0.0.1:8000'

export default function StudentDashboard({ user, onLogout }) {
  const [student, setStudent] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streak] = useState(Math.floor(Math.random() * 15) + 5)

  useEffect(() => {
    axios.get(`${API}/students/me`)
      .then(r => setStudent(r.data))
      .catch(err => console.error(err))
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input
    setMessages([...messages, { role: 'user', text: userMsg }])
    setInput('')
    setTimeout(() => {
      const responses = [
        "I understand. Let's break this down into small steps. What subject is troubling you most?",
        "Great question! Based on your profile, I'd recommend focusing on 2 subjects this week. Want a 7-day plan?",
        "Remember, consistency beats intensity. Try 25-minute focused sessions with 5-minute breaks. You've got this! 💪",
        "Your placement readiness is improving. Let's practice 2 coding problems today. Which language do you prefer?"
      ]
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: responses[Math.floor(Math.random() * responses.length)]
      }])
    }, 800)
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const riskColor = student.risk_level === 'Low' ? 'text-green-600' : student.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Smart Campus</h1>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Hi, {student.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500">Here's your personalized success overview</p>
        </div>

        {/* Hero Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white">
            <p className="text-sm text-white/70 mb-2">Your Success Score</p>
            <p className="text-5xl font-bold mb-2">{student.success_score}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Keep it up!</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <p className="text-sm font-medium text-slate-600">Success Streak</p>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1">{streak} days</p>
            <p className="text-xs text-slate-500">Login daily to grow 🔥</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-brand-600" />
              <p className="text-sm font-medium text-slate-600">Risk Level</p>
            </div>
            <p className={`text-4xl font-bold mb-1 ${riskColor}`}>{student.risk_level}</p>
            <p className="text-xs text-slate-500">{student.risk_factors}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <MiniStat label="Attendance" value={`${student.attendance_pct}%`} />
          <MiniStat label="CGPA" value={student.cgpa} />
          <MiniStat label="Placement Ready" value={student.placement_readiness} />
          <MiniStat label="LMS Logins" value={student.login_count_last_30d} />
        </div>

        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">Today's Recommended Tasks</h3>
          </div>
          <div className="space-y-3">
            <TaskItem text="Complete Maths assignment (due today)" done={false} />
            <TaskItem text="Watch 'Calculus Basics' video (20 min)" done={false} />
            <TaskItem text="Practice 5 coding problems" done={true} />
            <TaskItem text="Log daily attendance" done={true} />
          </div>
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-700 text-white rounded-full p-4 shadow-2xl transition flex items-center gap-3 pr-6 z-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-semibold">AI Copilot</span>
        </button>

        {/* Chat Window */}
        {chatOpen && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Success Copilot</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 mb-3">Hi {student.name.split(' ')[0]}! 👋</p>
                  <p className="text-xs text-slate-400 mb-4">I'm here to help with studies, career, or just to chat</p>
                  <div className="space-y-2">
                    {["Help me study for exams", "I'm feeling stressed", "Give me career advice"].map(q => (
                      <button 
                        key={q}
                        onClick={() => setInput(q)}
                        className="block w-full text-left text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function TaskItem({ text, done }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${done ? 'bg-green-50' : 'bg-slate-50'}`}>
      <CheckCircle2 className={`w-5 h-5 ${done ? 'text-green-600' : 'text-slate-300'}`} />
      <span className={`text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{text}</span>
    </div>
  )
}