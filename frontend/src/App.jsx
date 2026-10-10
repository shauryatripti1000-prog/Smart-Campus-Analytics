import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './Login'
import AdminDashboard from './AdminDashboard'
import StudentDashboard from './StudentDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return <Login onLogin={handleLogin} />
  if (user.role === 'admin') return <AdminDashboard user={user} onLogout={handleLogout} />
  return <StudentDashboard user={user} onLogout={handleLogout} />
}

export default App