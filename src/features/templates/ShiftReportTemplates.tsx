import React, { useState } from 'react';
import { X, Plus, FileText, Trash2, Edit2, Copy, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: TemplateField[];
  createdBy: string;
  isShared: boolean;
  usageCount: number;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'rating' | 'time';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface ShiftReportTemplatesProps {
  onClose: () => void;
  currentUser: string;
  onSaveTemplate?: (template: ReportTemplate) => void;
  onUseTemplate?: (templateId: string) => void;
}

export function ShiftReportTemplates({ onClose, currentUser, onSaveTemplate, onUseTemplate }: ShiftReportTemplatesProps) {
  // Sample templates
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Reception Shift Report',
      description: 'Daily front desk operations checklist',
      category: 'Reception',
      fields: [
        { id: 'f1', label: 'Total Check-ins', type: 'number', required: true },
        { id: 'f2', label: 'Phone Calls Handled', type: 'number', required: true },
        { id: 'f3', label: 'Visitor Log', type: 'textarea', required: true, placeholder: 'List all visitors...' },
        { id: 'f4', label: 'Package Deliveries', type: 'number', required: false },
        { id: 'f5', label: 'Maintenance Issues', type: 'textarea', required: false, placeholder: 'Describe any issues...' },
        { id: 'f6', label: 'Inventory Status', type: 'checkbox', required: true },
        { id: 'f7', label: 'Cleanliness Rating', type: 'rating', required: true },
        { id: 'f8', label: 'Special Notes', type: 'textarea', required: false, placeholder: 'Anything to pass along...' },
        { id: 'f9', label: 'Equipment Functional', type: 'checkbox', required: true },
        { id: 'f10', label: 'Shift End Time', type: 'time', required: true }
      ],
      createdBy: 'System',
      isShared: true,
      usageCount: 45
    },
    {
      id: '2',
      name: 'Nursing Shift Report',
      description: 'Patient care and unit status',
      category: 'Nursing',
      fields: [
        { id: 'n1', label: 'Patient Count', type: 'number', required: true },
        { id: 'n2', label: 'Admissions', type: 'number', required: true },
        { id: 'n3', label: 'Discharges', type: 'number', required: true },
        { id: 'n4', label: 'Critical Incidents', type: 'textarea', required: false, placeholder: 'Describe any incidents...' },
        { id: 'n5', label: 'Medication Administration', type: 'checkbox', required: true },
        { id: 'n6', label: 'Chart Updates Complete', type: 'checkbox', required: true },
        { id: 'n7', label: 'Supply Inventory Check', type: 'checkbox', required: true },
        { id: 'n8', label: 'Patient Concerns', type: 'textarea', required: false },
        { id: 'n9', label: 'Handoff Notes for Next Shift', type: 'textarea', required: true, placeholder: 'Important information...' }
      ],
      createdBy: 'System',
      isShared: true,
      usageCount: 67
    },
    {
      id: '3',
      name: 'Retail Closing Report',
      description: 'End-of-day store operations',
      category: 'Retail',
      fields: [
        { id: 'r1', label: 'Total Sales', type: 'number', required: true },
        { id: 'r2', label: 'Cash Drawer Count', type: 'number', required: true },
        { id: 'r3', label: 'Credit Card Transactions', type: 'number', required: true },
        { id: 'r4', label: 'Returns Processed', type: 'number', required: false },
        { id: 'r5', label: 'Store Cleanliness', type: 'rating', required: true },
        { id: 'r6', label: 'Doors Locked', type: 'checkbox', required: true },
        { id: 'r7', label: 'Alarm Set', type: 'checkbox', required: true },
        { id: 'r8', label: 'Deposit Prepared', type: 'checkbox', required: true },
        { id: 'r9', label: 'Issues/Concerns', type: 'textarea', required: false, placeholder: 'Report any problems...' }
      ],
      createdBy: 'System',
      isShared: true,
      usageCount: 38
    }
  ]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    category: '',
    fields: [],
    isShared: false
  });
  const [newField, setNewField] = useState<Partial<TemplateField>>({
    label: '',
    type: 'text',
    required: true
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);
  
  const handleAddField = () => {
    if (!newField.label) return;
    
    const field: TemplateField = {
      id: `f${Date.now()}`,
      label: newField.label,
      type: newField.type || 'text',
      required: newField.required || false,
      placeholder: newField.placeholder
    };
    
    setNewTemplate({
      ...newTemplate,
      fields: [...(newTemplate.fields || []), field]
    });
    
    setNewField({
      label: '',
      type: 'text',
      required: true
    });
  };
  
  const handleRemoveField = (fieldId: string) => {
    setNewTemplate({
      ...newTemplate,
      fields: (newTemplate.fields || []).filter(f => f.id !== fieldId)
    });
  };
  
  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.category || (newTemplate.fields?.length || 0) === 0) {
      return;
    }
    
    const template: ReportTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description || '',
      category: newTemplate.category,
      fields: newTemplate.fields || [],
      createdBy: currentUser,
      isShared: newTemplate.isShared || false,
      usageCount: 0
    };
    
    setTemplates([template, ...templates]);
    setShowCreateModal(false);
    setNewTemplate({
      name: '',
      description: '',
      category: '',
      fields: [],
      isShared: false
    });
    
    if (onSaveTemplate) {
      onSaveTemplate(template);
    }
  };
  
  const handleDuplicateTemplate = (template: ReportTemplate) => {
    const duplicate: ReportTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdBy: currentUser,
      usageCount: 0
    };
    
    setTemplates([duplicate, ...templates]);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  
  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'textarea': return '📝';
      case 'number': return '🔢';
      case 'checkbox': return '☑️';
      case 'rating': return '⭐';
      case 'time': return '⏰';
      default: return '📄';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden border-2 border-indigo-500/50 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between border-b-2 border-indigo-400/30">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Shift Report Templates
            </h2>
            <p className="text-indigo-100 text-sm mt-1 font-semibold">
              Create custom templates for daily reports and logs
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="p-8 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                All ({templates.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </button>
          </div>
          
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-indigo-600/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30">
                        {template.category}
                      </span>
                      {template.isShared && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-lg text-xs font-bold border border-green-500/30">
                          Shared
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-slate-500 font-semibold mb-2">
                    {template.fields.length} Fields:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 6).map(field => (
                      <span key={field.id} className="text-xs bg-slate-900/50 text-slate-300 px-2 py-1 rounded border border-slate-700">
                        {getFieldTypeIcon(field.type)} {field.label}
                      </span>
                    ))}
                    {template.fields.length > 6 && (
                      <span className="text-xs text-slate-500 px-2 py-1">
                        +{template.fields.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-500">
                    Used {template.usageCount} times
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors text-blue-400"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {template.createdBy === currentUser && (
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (onUseTemplate) onUseTemplate(template.id);
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all text-xs"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-500/50">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Plus className="w-7 h-7" />
              Create New Template
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Template Name *</label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Reception Shift Report"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Brief description of this template..."
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Category *</label>
                <input
                  type="text"
                  value={newTemplate.category || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="e.g., Reception, Nursing, Retail"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Share Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTemplate.isShared || false}
                  onChange={(e) => setNewTemplate({ ...newTemplate, isShared: e.target.checked })}
                  className="w-5 h-5 rounded accent-indigo-600"
                />
                <span className="text-sm font-bold text-white">Share with team (others can use this template)</span>
              </label>
            </div>
            
            {/* Fields Section */}
            <div className="border-t border-slate-700 pt-6 mb-6">
              <h4 className="text-lg font-black text-white mb-4">Template Fields</h4>
              
              {/* Add Field Form */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newField.label || ''}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="Field label (e.g., Total Sales)"
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newField.type || 'text'}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="rating">Rating (1-5)</option>
                    <option value="time">Time</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newField.placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="Placeholder text (optional)"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={newField.required || false}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                    Required
                  </label>
                  <button
                    onClick={handleAddField}
                    disabled={!newField.label}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all text-sm disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Current Fields */}
              {(newTemplate.fields || []).length > 0 && (
                <div className="space-y-2">
                  {newTemplate.fields?.map((field, idx) => (
                    <div key={field.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between border border-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getFieldTypeIcon(field.type)}</span>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </div>
                          <div className="text-xs text-slate-400">
                            {field.type} {field.placeholder && `• ${field.placeholder}`}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {(newTemplate.fields || []).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields added yet. Add fields above.</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTemplate({ name: '', description: '', category: '', fields: [], isShared: false });
                }}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!newTemplate.name || !newTemplate.category || (newTemplate.fields?.length || 0) === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
