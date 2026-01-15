import React, { useState } from 'react';
import { X, Copy, Calendar, Clock, Users, Repeat, Save } from 'lucide-react';

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  role: string;
  department: string;
  notes: string;
  color?: string;
}

interface ShiftTemplateManagerProps {
  templates: ShiftTemplate[];
  roles: string[];
  departments: string[];
  onSaveTemplate: (template: Omit<ShiftTemplate, 'id'>) => void;
  onApplyTemplate: (template: ShiftTemplate, dates: Date[]) => void;
  onDeleteTemplate: (id: string) => void;
  onClose: () => void;
}

export default function ShiftTemplateManager({ templates, roles, departments, onSaveTemplate, onApplyTemplate, onDeleteTemplate, onClose }: ShiftTemplateManagerProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'templates'>('templates');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    startTime: '08:00',
    endTime: '17:00',
    role: roles[0] || '',
    department: departments[0] || '',
    notes: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    onSaveTemplate(newTemplate);
    setNewTemplate({
      name: '',
      startTime: '08:00',
      endTime: '17:00',
      role: roles[0] || '',
      department: departments[0] || '',
      notes: '',
    });
    setActiveTab('templates');
  };

  const commonTemplates = [
    { name: 'Morning Shift', startTime: '07:00', endTime: '15:00', icon: '🌅' },
    { name: 'Day Shift', startTime: '09:00', endTime: '17:00', icon: '☀️' },
    { name: 'Evening Shift', startTime: '15:00', endTime: '23:00', icon: '🌆' },
    { name: 'Night Shift', startTime: '23:00', endTime: '07:00', icon: '🌙' },
    { name: '12-Hour Day', startTime: '07:00', endTime: '19:00', icon: '📅' },
    { name: '12-Hour Night', startTime: '19:00', endTime: '07:00', icon: '🌃' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl text-white">
              <Copy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold gradient-text">Shift Templates</h2>
              <p className="text-sm text-slate-500">Create and manage reusable shift templates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'templates'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'create'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create New
          </button>
        </div>

        {activeTab === 'templates' && (
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-12">
                <Copy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No templates yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all"
                >
                  Create Your First Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="glass rounded-xl p-6 hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{template.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{template.role} • {template.department}</p>
                      </div>
                      <button
                        onClick={() => onDeleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {template.startTime} - {template.endTime}
                      </span>
                    </div>
                    {template.notes && (
                      <p className="text-sm text-slate-600 mb-4">{template.notes}</p>
                    )}
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-lg transition-all"
                    >
                      Apply Template
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Quick Templates */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Quick Start Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setNewTemplate({ ...newTemplate, name: template.name, startTime: template.startTime, endTime: template.endTime })}
                    className="glass rounded-xl p-4 hover-lift text-center"
                  >
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <div className="font-bold text-sm text-slate-700">{template.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{template.startTime} - {template.endTime}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Template Form */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Template Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Reception Morning"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      value={newTemplate.startTime}
                      onChange={(e) => setNewTemplate({ ...newTemplate, startTime: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      value={newTemplate.endTime}
                      onChange={(e) => setNewTemplate({ ...newTemplate, endTime: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role *</label>
                    <select
                      value={newTemplate.role}
                      onChange={(e) => setNewTemplate({ ...newTemplate, role: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    >
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                    <select
                      value={newTemplate.department}
                      onChange={(e) => setNewTemplate({ ...newTemplate, department: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    >
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={newTemplate.notes}
                    onChange={(e) => setNewTemplate({ ...newTemplate, notes: e.target.value })}
                    rows={3}
                    placeholder="Add any notes about this template..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveTemplate}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
