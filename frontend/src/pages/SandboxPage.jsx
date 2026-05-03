import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { Play, Code, Layout, Users, X, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const DEFAULT_CODE = `function hello() {
  console.log("Welcome to live coding sandbox!");
}
hello();`;

export default function SandboxPage() {
  const { user, token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchParams] = useSearchParams();
  const withContactId = searchParams.get('with');
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

      socket.on('receive-code', (newCode) => {
        setCode(newCode);
      });

      return () => {
        socket.off('receive-code');
      };
    }
  }, [socket, activeContact]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
        if (withContactId) {
          const contact = data.contacts.find(c => c._id === withContactId);
          if (contact) setActiveContact(contact);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket && activeContact) {
      const roomId = [user._id, activeContact._id].sort().join('-');
      socket.emit('send-code', { roomId, code: value });
    }
  };

  const runCode = () => {
    try {
      // Very basic evaluation for testing
      const originalConsoleLog = console.log;
      let logs = [];
      console.log = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      };
      
      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      
      console.log = originalConsoleLog;
      
      setOutput(logs.join('\n') + (result !== undefined ? '\n' + result : ''));
    } catch (err) {
      setOutput(err.toString());
    }
  };

  return (
    <div className="flex h-screen bg-dark-900 text-slate-100 overflow-hidden">
      {/* Sidebar for Connections */}
      {isSidebarOpen && (
        <aside className="w-72 glass border-r border-slate-800/50 flex flex-col transition-all">
          <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2"><Users className="w-4 h-4"/> Collaborate</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 border-b border-slate-800/50 bg-dark-800">
             <button
                onClick={() => setActiveContact(null)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                  !activeContact ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                Use Alone (Local Sandbox)
              </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {contacts.map((contact) => (
              <button
                key={contact._id}
                onClick={() => setActiveContact(contact)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  activeContact?._id === contact._id 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-transparent hover:bg-slate-800/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                  <p className="text-[10px] text-slate-400 truncate capitalize">{contact.role}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-14 glass border-b border-slate-800/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white">
                <Users className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-sm">
                {activeContact ? `Live with ${activeContact.name}` : 'Local Sandbox'}
              </span>
              {activeContact && (
                <span className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  LIVE
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-slate-800 text-slate-300 text-sm font-semibold rounded-lg transition-all border border-slate-700/50"
              title="Minimize Sandbox"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={runCode}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/20"
            >
              <Play className="w-4 h-4" /> Run Code
            </button>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Monaco Editor */}
          <div className="flex-1 border-r border-slate-800/50">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          
          {/* Output Pane */}
          <div className="w-full lg:w-1/3 flex flex-col bg-dark-950">
            <div className="px-4 py-2 bg-dark-900 border-b border-slate-800/50 flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Console Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-slate-600 italic">Click 'Run Code' to see output here...</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
