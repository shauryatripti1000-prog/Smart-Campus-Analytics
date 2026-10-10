import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Users, TrendingUp, AlertTriangle, Award, Search, LogOut, 
  ChevronRight, X, BarChart3, Target
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, ScatterChart, Scatter, XAxis, YAxis } from 'recharts'

const API = 'http://127.0.0.1:8000'
const RISK_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }

export default function AdminDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState(null)
  const [segments, setSegments] = useState([])
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    axios.get(`${API}/students`).then(r => { setStudents(r.data); setFiltered(r.data) })
    axios.get(`${API}/stats`).then(r => setStats(r.data))
    axios.get(`${API}/segments`).then(r => setSegments(r.data))
  }, [])

  const handleSearch = () => {
    const q = query.toLowerCase()
    let result = [...students]
    if (q.includes('high risk')) result = result.filter(s => s.risk_level === 'High')
    if (q.includes('medium')) result = result.filter(s => s.risk_level === 'Medium')
    if (q.includes('maths') || q.includes('math')) result = result.filter(s => s.avg_marks < 60)
    if (q.includes('placement')) result = result.filter(s => s.placement_readiness < 60)
    if (q.includes('star')) result = result.filter(s => s.segment === 'Star Performer')
    if (q.includes('attendance')) result = result.filter(s => s.attendance_pct < 75)
    setFiltered(result)
  }

  const riskData = stats ? [
    { name: 'Low', value: stats.low_risk, color: '#10b981' },
    { name: 'Medium', value: stats.medium_risk, color: '#f59e0b' },
    { name: 'High', value: stats.high_risk, color: '#ef4444' },
  ] : []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Smart Campus</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden md:block">{user.email}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Success Overview</h2>
          <p className="text-slate-500">AI-powered insights across {stats?.total_students || 0} students</p>
        </div>

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <KPICard 
              icon={Users}
              label="Total Students"
              value={stats.total_students}
              sub="Active enrolled"
              color="blue"
            />
            <KPICard 
              icon={TrendingUp}
              label="Avg Success Score"
              value={stats.avg_success_score}
              sub="Out of 100"
              color="indigo"
            />
            <KPICard 
              icon={AlertTriangle}
              label="High Risk"
              value={stats.high_risk}
              sub="Need intervention"
              color="red"
            />
            <KPICard 
              icon={Award}
              label="Star Performers"
              value={segments.find(s => s.segment === 'Star Performer')?.count || 0}
              sub="Top achievers"
              color="green"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">Risk Distribution</h3>
            <p className="text-sm text-slate-500 mb-4">Student breakdown by risk level</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie 
                  data={riskData} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {riskData.map(r => (
                <div key={r.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: r.color }}></div>
                  <span className="text-sm text-slate-600">{r.name}: <b>{r.value}</b></span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">Attendance vs Success Score</h3>
            <p className="text-sm text-slate-500 mb-4">Correlation analysis</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <XAxis dataKey="attendance_pct" name="Attendance %" tick={{ fontSize: 12 }} />
                <YAxis dataKey="success_score" name="Success" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={students} fill="#3b5fff" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">Student Segments</h3>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {segments.map(s => (
              <div key={s.segment} className="p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-md transition">
                <p className="font-semibold text-slate-800 text-sm mb-1">{s.segment}</p>
                <p className="text-2xl font-bold text-brand-600">{s.count}</p>
                <p className="text-xs text-slate-500">Avg score: {s.avg_score?.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NLP Search */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">AI-Powered Search</h3>
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder='Try: "high risk" · "star performers" · "low placement" · "attendance"'
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <button 
              onClick={handleSearch} 
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Students</h3>
            <p className="text-sm text-slate-500">{filtered.length} results</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Roll</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Attendance</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice(0, 20).map(s => (
                  <tr key={s.roll_no} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">#{s.roll_no}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{s.success_score}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.attendance_pct}%</td>
                    <td className="px-6 py-4">
                      <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ background: RISK_COLORS[s.risk_level] }}
                      >
                        {s.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.segment}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelected(s)} 
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        View <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                  <p className="text-sm text-slate-500">Roll #{selected.roll_no} · {selected.department} · Sem {selected.semester}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <StatBox label="Success Score" value={selected.success_score} highlight />
                <StatBox label="Risk Level" value={selected.risk_level} color={RISK_COLORS[selected.risk_level]} />
                <StatBox label="Attendance" value={`${selected.attendance_pct}%`} />
                <StatBox label="CGPA" value={selected.cgpa} />
                <StatBox label="Placement Ready" value={selected.placement_readiness} />
                <StatBox label="LMS Logins (30d)" value={selected.login_count_last_30d} />
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Risk Factors</h3>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm text-red-700">{selected.risk_factors}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Score Breakdown (Explainable AI)</h3>
                <div className="space-y-3">
                  <ScoreBar label="Academics (30%)" value={selected.avg_marks} />
                  <ScoreBar label="Attendance (20%)" value={selected.attendance_pct} />
                  <ScoreBar label="LMS Activity (15%)" value={(selected.login_count_last_30d / 30) * 100} />
                  <ScoreBar label="Placement (15%)" value={selected.placement_readiness} />
                  <ScoreBar label="Skills (10%)" value={(selected.technical_score + selected.soft_skill_score) / 2} />
                  <ScoreBar label="Engagement (5%)" value={Math.min(100, (selected.events_attended + selected.clubs_joined + selected.hackathons + selected.certifications) * 8)} />
                  <ScoreBar label="Feedback (5%)" value={((selected.student_satisfaction + selected.faculty_feedback) / 10) * 100} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Segment</h3>
                <span className="inline-block bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium">
                  {selected.segment}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KPICard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
  }
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
      <div className={`w-11 h-11 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}

function StatBox({ label, value, color, highlight }) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-brand-50 border border-brand-100' : 'bg-slate-50'}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: color || '#0f172a' }}>{value}</p>
    </div>
  )
}

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value?.toFixed(0)}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all" 
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }} 
        />
      </div>
    </div>
  )
}