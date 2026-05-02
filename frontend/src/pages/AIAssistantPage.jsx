import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, User, Sparkles, Loader2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIAssistantPage() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: `Hi ${user?.name}! I'm your AI Mentor. How can I help you today?` }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(1) // Send history excluding the first greeting
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm sorry, I'm having some trouble connecting. Please try again later." }] }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Error: AI Assistant is currently offline." }] }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', parts: [{ text: `Hi ${user?.name}! I'm your AI Mentor. How can I help you today?` }] }]);
  };

  return (
    <div className="flex h-screen bg-dark-900 text-slate-100 overflow-hidden">
      <div className="flex-1 flex flex-col relative max-w-4xl mx-auto border-x border-slate-800/50 shadow-2xl shadow-primary-500/5">
        {/* Header */}
        <header className="p-4 glass border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI Mentor Assistant
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-medium">Powered by Gemini AI</span>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex items-center gap-2 text-xs font-medium"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-primary-600 shadow-lg shadow-primary-500/10'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'glass border border-slate-700/50 text-slate-200 rounded-tl-none shadow-xl'
                  }`}
                >
                  {msg.parts[0].text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-primary-500/10">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass border border-slate-700/50 text-slate-400 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 glass border-t border-slate-800/50">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-blue-500 rounded-2xl opacity-20 group-focus-within:opacity-40 transition-all blur"></div>
            <div className="relative flex items-center gap-3 bg-dark-800 border border-slate-700/50 rounded-2xl p-2 pl-4 shadow-2xl">
              <input
                type="text"
                placeholder="Ask anything about your career, coding, or interviews..."
                className="flex-1 bg-transparent border-none text-sm focus:outline-none text-white py-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-4 uppercase tracking-widest font-bold">
            MentorConnect AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}
