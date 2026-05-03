import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Search, User, Paperclip, MoreVertical, Phone, Video, Smile, UserMinus, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Code } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function ChatPage() {
  const { user, token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && activeContact) {
      const roomId = [user._id, activeContact._id].sort().join('-');
      socket.emit('join-room', roomId);

      socket.on('receive-message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      fetchChatHistory();

      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/messages/${activeContact._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeContact) return;

    const roomId = [user._id, activeContact._id].sort().join('-');
    socket.emit('send-message', {
      senderId: user._id,
      receiverId: activeContact._id,
      text: newMessage,
      roomId: roomId,
    });

    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-dark-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 glass border-r border-slate-800/50 flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-dark-800 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setActiveContact(contact)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-all border-l-2 ${
                activeContact?._id === contact._id ? 'border-primary-500 bg-primary-500/5' : 'border-transparent'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                  <span className="text-[10px] text-slate-500">12:45 PM</span>
                </div>
                <p className="text-xs text-slate-400 truncate capitalize">{contact.role}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <header className="p-4 glass border-b border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeContact.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    <span className="text-[10px] text-slate-400">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/sandbox?with=${activeContact._id}`)}
                  className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                  title="Live Coding Sandbox"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><Phone className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><Video className="w-4 h-4" /></button>
                <button 
                  onClick={() => handleDisconnect(activeContact._id)}
                  className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                  title="Remove Connection"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender === user._id
                        ? 'bg-primary-600 text-white rounded-tr-none'
                        : 'glass border border-slate-700/50 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] opacity-60 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 glass border-t border-slate-800/50">
              <div className="flex items-center gap-3 bg-dark-800 border border-slate-700/50 rounded-2xl p-2 pl-4 shadow-inner">
                <button type="button" className="text-slate-500 hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button type="button" className="text-slate-500 hover:text-white transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none text-sm focus:outline-none text-white py-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 border border-slate-800">
              <MessageSquare className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
            <p className="text-slate-500 max-w-xs">Choose a mentor or student from the sidebar to start chatting in real-time.</p>
          </div>
        )}
      </main>
    </div>
  );
}
