import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2, Maximize2, Sparkles, Zap, Calendar, Users, Clock, TrendingUp, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'krono';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface KronoAIProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KronoAI({ isOpen, onClose }: KronoAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'krono',
      content: "👋 Hi! I'm Krono, your AI scheduling assistant! I can help you with:\n\n• Schedule management\n• Shift swaps\n• Time-off requests\n• Coverage analysis\n• Smart suggestions\n• Voice commands\n\nWhat can I help you with today?",
      timestamp: new Date(),
      suggestions: ['Show my schedule', 'Request time off', 'Find shift coverage', 'Analyze staffing']
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getKronoResponse = (userMessage: string): Message => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Smart responses based on keywords
    if (lowerMsg.includes('schedule') || lowerMsg.includes('shift')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "📅 Here's your upcoming schedule:\n\n• Today (Jan 18): 9:00 AM - 5:00 PM\n• Monday (Jan 20): 9:00 AM - 5:00 PM\n• Wednesday (Jan 22): 9:00 AM - 5:00 PM\n\nYou have 3 shifts this week (24 hours total). Would you like me to:\n\n1. Request a day off\n2. Swap a shift\n3. Pick up extra hours",
        timestamp: new Date(),
        suggestions: ['Request day off', 'Find shift swap', 'View open shifts']
      };
    }
    
    if (lowerMsg.includes('time off') || lowerMsg.includes('pto') || lowerMsg.includes('vacation')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "🏖️ Time Off Request:\n\nYou have:\n• 12 days PTO remaining\n• 3 sick days available\n• 2 personal days\n\nWhen would you like to request time off? I can check coverage and submit it for you!",
        timestamp: new Date(),
        suggestions: ['Next week', 'Specific dates', 'Check coverage first']
      };
    }
    
    if (lowerMsg.includes('coverage') || lowerMsg.includes('staffing')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "📊 Coverage Analysis:\n\n✅ Monday: Fully staffed (5/5)\n✅ Tuesday: Fully staffed (5/5)\n⚠️ Wednesday: Short 1 person (4/5)\n✅ Thursday: Fully staffed (5/5)\n❌ Friday: Short 2 people (3/5)\n\nI can help post these open shifts or suggest overtime opportunities.",
        timestamp: new Date(),
        suggestions: ['Post open shifts', 'Offer overtime', 'Find per diem staff']
      };
    }
    
    if (lowerMsg.includes('swap')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "🔄 Shift Swap Finder:\n\nI found 3 potential swap partners:\n\n1. **Sarah J.** - Available Wed, wants your Fri\n2. **Michael C.** - Available Thu, wants your Mon\n3. **Emily D.** - Flexible, open to negotiate\n\nWould you like me to send a swap request?",
        timestamp: new Date(),
        suggestions: ['Request swap with Sarah', 'See more options', 'Cancel']
      };
    }
    
    if (lowerMsg.includes('analytics') || lowerMsg.includes('insight') || lowerMsg.includes('data')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "📈 Smart Analytics:\n\n• You've worked 87 hours this month\n• Average: 21.7 hrs/week\n• 3 overtime shifts\n• $2,847 earned so far\n\n🎯 Predictions:\n• Likely to hit 95 hours this month\n• On track for Q1 goals\n• Recommended: 1 more shift for optimal scheduling",
        timestamp: new Date(),
        suggestions: ['View detailed report', 'Set new goals', 'Compare to team']
      };
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "Hello! 👋 I'm here to make your work life easier! I can help with scheduling, time-off, shift swaps, coverage analysis, and more. What would you like to do?",
        timestamp: new Date(),
        suggestions: ['Show my schedule', 'Request time off', 'Get insights']
      };
    }
    
    if (lowerMsg.includes('help')) {
      return {
        id: Date.now().toString(),
        type: 'krono',
        content: "🤖 Krono AI Commands:\n\n**Scheduling:**\n• \"Show my schedule\"\n• \"When do I work next?\"\n• \"Add a shift\"\n\n**Time Off:**\n• \"Request time off\"\n• \"Check my PTO balance\"\n\n**Coverage:**\n• \"Check staffing\"\n• \"Find coverage\"\n• \"Who's working Monday?\"\n\n**Smart Features:**\n• \"Analyze my hours\"\n• \"Find shift swaps\"\n• \"Voice commands\"\n\nJust type naturally - I understand!",
        timestamp: new Date(),
        suggestions: ['Try a command', 'Voice input', 'View examples']
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'krono',
      content: `I understand you're asking about "${userMessage}". While I'm still learning, I can help with:\n\n• Schedule management\n• Time-off requests\n• Shift swapping\n• Coverage analysis\n• Smart insights\n\nTry asking me about one of these topics!`,
      timestamp: new Date(),
      suggestions: ['Show schedule', 'Get help', 'View capabilities']
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const kronoResponse = getKronoResponse(input);
      setMessages(prev => [...prev, kronoResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInput("Show my schedule for this week");
        setIsListening(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 transition-all duration-300`}>
      {/* Minimized State */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all relative group"
        >
          <Bot className="w-8 h-8 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      ) : (
        /* Full Chat Interface */
        <div className="w-96 h-[600px] bg-slate-900 border-2 border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8 text-white" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Krono AI</h3>
                <p className="text-xs text-purple-100">Your Smart Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}>
                    {message.type === 'krono' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-bold text-purple-300">Krono</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-purple-300 text-xs rounded-full transition-colors border border-purple-500/30"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-purple-300">
                <Bot className="w-4 h-4" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-3 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {isListening ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-purple-300" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask Krono anything..."}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                disabled={isListening}
              />
              <button
                onClick={handleSend}
                className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all hover:scale-105"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              💡 Try: "Show schedule", "Request time off", "Find coverage"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
