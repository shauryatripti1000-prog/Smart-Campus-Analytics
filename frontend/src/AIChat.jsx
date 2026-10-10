import React, { useState } from 'react';
import axios from 'axios';

const AIChat = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('https://smart-campus-analytics-1.onrender.com/chat', {
        message: input,
      });
      const aiMessage = { sender: 'ai', text: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, backend se connect nahi ho pa raha. Thodi der baad try karo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50 overflow-hidden">
      
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2">✨ AI Assistant</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold leading-none">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10 text-sm">Kuch bhi pucho, jaise "Aaj ka date kya hai?"</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-[85%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-xs italic">AI soch raha hai...</p>}
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything..."
          className="flex-1 border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;