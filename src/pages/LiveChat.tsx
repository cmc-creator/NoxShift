import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Home, Send, Smile, Paperclip, Users, Search } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
  lastMessage: string;
}

export default function LiveChat() {
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  
  const channels: Channel[] = [
    { id: 'general', name: '# General', unread: 3, lastMessage: 'Hey team!' },
    { id: 'team', name: '# Team Updates', unread: 0, lastMessage: 'Great work!' },
    { id: 'social', name: '# Social', unread: 5, lastMessage: 'Coffee anyone?' },
    { id: 'help', name: '# Help Desk', unread: 1, lastMessage: 'Need assistance' },
  ];

  const messages: Message[] = [
    { id: '1', sender: 'Sarah J.', content: 'Good morning team! 🌅', timestamp: new Date(2026, 0, 18, 9, 0), isOwn: false },
    { id: '2', sender: 'You', content: 'Morning! Ready for a great day!', timestamp: new Date(2026, 0, 18, 9, 5), isOwn: true },
    { id: '3', sender: 'Michael C.', content: 'Don\'t forget our team meeting at 2pm', timestamp: new Date(2026, 0, 18, 9, 10), isOwn: false },
    { id: '4', sender: 'Emily D.', content: 'Thanks for the reminder!', timestamp: new Date(2026, 0, 18, 9, 12), isOwn: false },
    { id: '5', sender: 'You', content: 'See you all there! 👍', timestamp: new Date(2026, 0, 18, 9, 15), isOwn: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Command Center</span>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <MessageCircle className="w-7 h-7 text-purple-400" />
              Live Team Chat 💬
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-2">
            <h3 className="text-white font-bold mb-3">Channels</h3>
            {channels.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`w-full text-left p-3 rounded-lg transition-all ${activeChannel === ch.id ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{ch.name}</span>
                  {ch.unread > 0 && <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{ch.unread}</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="col-span-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{channels.find(c => c.id === activeChannel)?.name}</h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.isOwn ? 'bg-purple-600' : 'bg-white/10'} rounded-2xl p-4`}>
                    {!msg.isOwn && <div className="text-purple-300 text-sm font-bold mb-1">{msg.sender}</div>}
                    <div className="text-white">{msg.content}</div>
                    <div className="text-xs text-purple-200 mt-1">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg"><Paperclip className="w-5 h-5 text-purple-300" /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg"><Smile className="w-5 h-5 text-purple-300" /></button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"><Send className="w-5 h-5 text-white" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
