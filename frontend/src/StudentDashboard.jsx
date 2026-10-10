import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIChat from './AIChat';
import { Flame, Target, TrendingUp, MessageCircle, LogOut, Download, Plus, RefreshCw } from 'lucide-react';

const API = 'https://smart-campus-analytics-1.onrender.com';

export default function StudentDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Data fetch error:", error);
      // Fallback: Agar backend band hai toh yeh dikhega
      setStudents([
        { id: 1, roll: '#550', name: 'Anya Dwivedi', score: 93.9, attendance: '100%', risk: 'Low' },
        { id: 2, roll: '#522', name: 'Myra Kapoor', score: 92.9, attendance: '100%', risk: 'Low' }
      ]);
    } finally {
      // Yeh line sabse important hai! Isse loading hamesha band ho jayega.
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Roll,Name,Score,Attendance,Risk"].join(",") + "\n"
      + students.map(s => `${s.roll},${s.name},${s.score},${s.attendance},${s.risk}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Loading state agar abhi bhi true hai (sirf 1-2 second ke liye dikhega)
  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Campus</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">{user?.email || 'admin@campus.edu'}</span>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><TrendingUp size={24} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Low Risk</p><h3 className="text-2xl font-bold text-gray-800">31</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Target size={24} /></div>
          <div><p className="text-gray-500 text-sm font-medium">Medium Risk</p><h3 className="text-2xl font-bold text-gray-800">18</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full"><Flame size={24} /></div>
          <div><p className="text-gray-500 text-sm font-medium">High Risk</p><h3 className="text-2xl font-bold text-gray-800">1</h3></div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={fetchStudents} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all font-medium">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
        <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all font-medium">
          <Download size={18} /> Export CSV
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium">
          <Plus size={18} /> Add New Student
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-800">Students ({students.length} results)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-medium">ROLL</th>
                <th className="p-4 font-medium">NAME</th>
                <th className="p-4 font-medium">SCORE</th>
                <th className="p-4 font-medium">ATTENDANCE</th>
                <th className="p-4 font-medium">RISK</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-600 font-medium">{student.roll}</td>
                  <td className="p-4 text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-800 font-semibold">{student.score}</td>
                  <td className="p-4 text-gray-600">{student.attendance}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.risk === 'High' ? 'bg-red-100 text-red-700' : 
                      student.risk === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {student.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI CHAT */}
      <button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-105">
        <MessageCircle size={28} />
      </button>
      {chatOpen && <AIChat onClose={() => setChatOpen(false)} />}

    </div>
  );
}