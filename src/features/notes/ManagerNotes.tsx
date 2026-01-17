import React, { useState } from 'react';
import { X, StickyNote, Calendar, AlertCircle, MessageSquare, FileText, Plus, Trash2, Edit2 } from 'lucide-react';

interface ManagerNotesProps {
  selectedDate: Date;
  shifts: any[];
  onClose: () => void;
  onSaveNote?: (note: any) => void;
}

interface Note {
  id: string;
  date: string;
  type: 'shift' | 'daily' | 'staff' | 'reminder';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  relatedTo?: string; // employee name or shift ID
  createdAt: Date;
}

export function ManagerNotes({ selectedDate, shifts, onClose, onSaveNote }: ManagerNotesProps) {
  // Sample notes (in real app, these would be fetched from database)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      type: 'shift',
      title: 'Equipment Issue',
      content: 'Main register had connectivity issues during evening shift. IT notified, temporary fix applied.',
      priority: 'high',
      relatedTo: 'Evening Shift',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      type: 'staff',
      title: 'Employee Recognition',
      content: 'Sarah went above and beyond helping train new team member. Consider for Employee of the Month.',
      priority: 'medium',
      relatedTo: 'Sarah Johnson',
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      type: 'reminder',
      title: 'Inventory Count',
      content: 'Monthly inventory count scheduled for tomorrow morning. Ensure all staff are briefed.',
      priority: 'high',
      createdAt: new Date(Date.now() - 259200000)
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'all' | 'shift' | 'daily' | 'staff' | 'reminder'>('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    type: 'shift',
    priority: 'medium',
    date: selectedDate.toISOString().split('T')[0]
  });
  
  const todayNotes = notes.filter(n => {
    const noteDate = new Date(n.date).toDateString();
    const today = new Date().toDateString();
    return noteDate === today;
  });
  
  const upcomingNotes = notes.filter(n => {
    const noteDate = new Date(n.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return noteDate > today;
  });
  
  const filteredNotes = activeTab === 'all' 
    ? notes 
    : notes.filter(n => n.type === activeTab);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' };
      case 'medium': return { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-500' };
      case 'low': return { bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' };
      default: return { bg: 'bg-slate-900/20', border: 'border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-500' };
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shift': return <Calendar className="w-5 h-5" />;
      case 'daily': return <FileText className="w-5 h-5" />;
      case 'staff': return <MessageSquare className="w-5 h-5" />;
      case 'reminder': return <AlertCircle className="w-5 h-5" />;
      default: return <StickyNote className="w-5 h-5" />;
    }
  };
  
  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return;
    
    const note: Note = {
      id: Date.now().toString(),
      date: newNote.date || new Date().toISOString().split('T')[0],
      type: newNote.type || 'shift',
      title: newNote.title,
      content: newNote.content,
      priority: newNote.priority || 'medium',
      relatedTo: newNote.relatedTo,
      createdAt: new Date()
    };
    
    setNotes([note, ...notes]);
    setShowAddNote(false);
    setNewNote({
      type: 'shift',
      priority: 'medium',
      date: selectedDate.toISOString().split('T')[0]
    });
    
    if (onSaveNote) {
      onSaveNote(note);
    }
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border-2 border-amber-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 flex items-center justify-between border-b-2 border-amber-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <StickyNote className="w-8 h-8" />
              Manager Notes & Handoff
            </h2>
            <p className="text-amber-100 text-sm mt-1 font-semibold">
              Track incidents, reminders, and daily communications
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 border-2 border-blue-400/30">
              <FileText className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">{todayNotes.length}</div>
              <div className="text-sm text-blue-100 font-bold">Today's Notes</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 border-2 border-purple-400/30">
              <AlertCircle className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">{upcomingNotes.length}</div>
              <div className="text-sm text-purple-100 font-bold">Upcoming Reminders</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 border-2 border-green-400/30">
              <StickyNote className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-black text-white">{notes.length}</div>
              <div className="text-sm text-green-100 font-bold">Total Notes</div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                All ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('shift')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'shift'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Shift Notes
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Daily Log
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'staff'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setActiveTab('reminder')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'reminder'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                Reminders
              </button>
            </div>
            
            <button
              onClick={() => setShowAddNote(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Note
            </button>
          </div>
          
          {/* Notes List */}
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <StickyNote className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No notes yet</p>
                <p className="text-slate-500 text-sm">Click "Add Note" to create your first note</p>
              </div>
            ) : (
              filteredNotes.map(note => {
                const colors = getPriorityColor(note.priority);
                return (
                  <div key={note.id} className={`rounded-2xl p-6 border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-xl ${colors.bg} border ${colors.border}`}>
                          {getTypeIcon(note.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-white">{note.title}</h3>
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.text}`}>
                              {note.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{note.content}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(note.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="capitalize">{note.type}</span>
                            {note.relatedTo && (
                              <span className="text-amber-400">→ {note.relatedTo}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border-2 border-amber-500/50">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Plus className="w-7 h-7" />
              Create New Note
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Note Type */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Note Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {['shift', 'daily', 'staff', 'reminder'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewNote({ ...newNote, type: type as any })}
                      className={`px-4 py-3 rounded-xl font-bold capitalize transition-all ${
                        newNote.type === type
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                          : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => setNewNote({ ...newNote, priority: priority as any })}
                      className={`px-4 py-3 rounded-xl font-bold capitalize transition-all ${
                        newNote.priority === priority
                          ? priority === 'high' ? 'bg-red-600 text-white' :
                            priority === 'medium' ? 'bg-yellow-600 text-white' :
                            'bg-blue-600 text-white'
                          : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newNote.title || ''}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Brief title for your note..."
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              
              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Details</label>
                <textarea
                  value={newNote.content || ''}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Add detailed information..."
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-amber-500 resize-none"
                  rows={4}
                />
              </div>
              
              {/* Related To */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Related To (Optional)
                </label>
                <input
                  type="text"
                  value={newNote.relatedTo || ''}
                  onChange={(e) => setNewNote({ ...newNote, relatedTo: e.target.value })}
                  placeholder="Employee name, shift, or department..."
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote({
                    type: 'shift',
                    priority: 'medium',
                    date: selectedDate.toISOString().split('T')[0]
                  });
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.title || !newNote.content}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
