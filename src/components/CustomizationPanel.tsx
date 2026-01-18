import { useState } from 'react'
import { X, Palette, DollarSign, Zap, Grid, Type, Eye, Sparkles, Settings, Save, RotateCcw } from 'lucide-react'

interface CustomizationPanelProps {
  onClose: () => void
  customization: any
  setCustomization: (value: any) => void
}

export default function CustomizationPanel({ onClose, customization, setCustomization }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'rewards' | 'visual' | 'layout'>('budget')

  const handleReset = () => {
    if (confirm('Reset all customizations to defaults?')) {
      setCustomization({
        showInfoBar: true,
        monthlyBudget: 75000,
        budgetUsed: 48250,
        targetEPOB: 12.5,
        currentEPOB: 11.8,
        targetFTE: 22.0,
        currentFTE: 20.5,
        bonusPerGapShift: 50,
        bonusPickupShift: 75,
        bonusWeekendShift: 100,
        bonusOvertimeShift: 125,
        xpClockInOnTime: 10,
        xpShiftComplete: 20,
        xpPickupShift: 100,
        xpWeekPerfect: 150,
        xpMonthPerfect: 500,
        calendarBg: '#ffffff',
        calendarBorder: '#e2e8f0',
        calendarText: '#1e293b',
        todayHighlight: '#a855f7',
        weekendBg: '#f8fafc',
        shiftBorderRadius: 8,
        shiftBorderWidth: 1,
        shiftShadow: 'medium',
        shiftPadding: 8,
        employeeNameBorder: true,
        employeeNameBorderColor: '#ffffff',
        employeeNameBorderWidth: 2,
        employeeNameBorderStyle: 'solid',
        employeeNameBg: 'transparent',
        employeeNamePadding: 4,
        employeeNameFontSize: 12,
        employeeNameFontWeight: 600,
        timeFontSize: 14,
        enableAnimations: true,
        enableHoverEffects: true,
        enableGradients: true,
        glassIntensity: 90,
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-scale-in bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-white/10 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Advanced Customization</h2>
                <p className="text-purple-100 text-sm">Customize every aspect of your scheduler</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                title="Reset to defaults"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto">
          {[
            { id: 'budget', label: 'Budget & Metrics', icon: DollarSign },
            { id: 'rewards', label: 'Rewards & XP', icon: Zap },
            { id: 'visual', label: 'Visual Style', icon: Palette },
            { id: 'layout', label: 'Layout & Effects', icon: Grid },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-200 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Budget & Metrics Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">Monthly Budget ($)</label>
                  <input
                    type="number"
                    value={customization.monthlyBudget}
                    onChange={(e) => setCustomization({...customization, monthlyBudget: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Budget Used ($)</label>
                  <input
                    type="number"
                    value={customization.budgetUsed}
                    onChange={(e) => setCustomization({...customization, budgetUsed: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Target EPOB (Hours/Patient/Day)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customization.targetEPOB}
                    onChange={(e) => setCustomization({...customization, targetEPOB: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Current EPOB</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customization.currentEPOB}
                    onChange={(e) => setCustomization({...customization, currentEPOB: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Target FTE</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customization.targetFTE}
                    onChange={(e) => setCustomization({...customization, targetFTE: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Current FTE</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customization.currentFTE}
                    onChange={(e) => setCustomization({...customization, currentFTE: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rewards & XP Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Bonus Amounts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Gap Shift Bonus ($)</label>
                    <input
                      type="number"
                      value={customization.bonusPerGapShift}
                      onChange={(e) => setCustomization({...customization, bonusPerGapShift: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Pickup Shift Bonus ($)</label>
                    <input
                      type="number"
                      value={customization.bonusPickupShift}
                      onChange={(e) => setCustomization({...customization, bonusPickupShift: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Weekend Shift Bonus ($)</label>
                    <input
                      type="number"
                      value={customization.bonusWeekendShift}
                      onChange={(e) => setCustomization({...customization, bonusWeekendShift: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Overtime Shift Bonus ($)</label>
                    <input
                      type="number"
                      value={customization.bonusOvertimeShift}
                      onChange={(e) => setCustomization({...customization, bonusOvertimeShift: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  XP Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Clock In On Time (XP)</label>
                    <input
                      type="number"
                      value={customization.xpClockInOnTime}
                      onChange={(e) => setCustomization({...customization, xpClockInOnTime: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Complete Shift (XP)</label>
                    <input
                      type="number"
                      value={customization.xpShiftComplete}
                      onChange={(e) => setCustomization({...customization, xpShiftComplete: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Pickup Extra Shift (XP)</label>
                    <input
                      type="number"
                      value={customization.xpPickupShift}
                      onChange={(e) => setCustomization({...customization, xpPickupShift: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Perfect Week (XP)</label>
                    <input
                      type="number"
                      value={customization.xpWeekPerfect}
                      onChange={(e) => setCustomization({...customization, xpWeekPerfect: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 mb-2">Perfect Month (XP)</label>
                    <input
                      type="number"
                      value={customization.xpMonthPerfect}
                      onChange={(e) => setCustomization({...customization, xpMonthPerfect: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visual Style Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Calendar Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'calendarBg', label: 'Background' },
                    { key: 'calendarBorder', label: 'Border' },
                    { key: 'calendarText', label: 'Text' },
                    { key: 'todayHighlight', label: 'Today Highlight' },
                    { key: 'weekendBg', label: 'Weekend BG' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-purple-200 mb-2">{label}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={customization[key]}
                          onChange={(e) => setCustomization({...customization, [key]: e.target.value})}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization[key]}
                          onChange={(e) => setCustomization({...customization, [key]: e.target.value})}
                          className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Employee Name Size (px)</label>
                    <input
                      type="number"
                      value={customization.employeeNameFontSize}
                      onChange={(e) => setCustomization({...customization, employeeNameFontSize: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Font Weight</label>
                    <select
                      value={customization.employeeNameFontWeight}
                      onChange={(e) => setCustomization({...customization, employeeNameFontWeight: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Time Font Size (px)</label>
                    <input
                      type="number"
                      value={customization.timeFontSize}
                      onChange={(e) => setCustomization({...customization, timeFontSize: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Shift Card Styling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Border Radius (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={customization.shiftBorderRadius}
                      onChange={(e) => setCustomization({...customization, shiftBorderRadius: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-white">{customization.shiftBorderRadius}px</span>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Border Width (px)</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={customization.shiftBorderWidth}
                      onChange={(e) => setCustomization({...customization, shiftBorderWidth: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-white">{customization.shiftBorderWidth}px</span>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Shadow Style</label>
                    <select
                      value={customization.shiftShadow}
                      onChange={(e) => setCustomization({...customization, shiftShadow: e.target.value})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                      <option value="none">None</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Padding (px)</label>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      value={customization.shiftPadding}
                      onChange={(e) => setCustomization({...customization, shiftPadding: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-white">{customization.shiftPadding}px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout & Effects Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-purple-200 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Show Info Bar
                  </span>
                  <input
                    type="checkbox"
                    checked={customization.showInfoBar}
                    onChange={(e) => setCustomization({...customization, showInfoBar: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-purple-200 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Enable Animations
                  </span>
                  <input
                    type="checkbox"
                    checked={customization.enableAnimations}
                    onChange={(e) => setCustomization({...customization, enableAnimations: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-purple-200">Enable Hover Effects</span>
                  <input
                    type="checkbox"
                    checked={customization.enableHoverEffects}
                    onChange={(e) => setCustomization({...customization, enableHoverEffects: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-purple-200">Enable Gradients</span>
                  <input
                    type="checkbox"
                    checked={customization.enableGradients}
                    onChange={(e) => setCustomization({...customization, enableGradients: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-purple-200">Employee Name Border</span>
                  <input
                    type="checkbox"
                    checked={customization.employeeNameBorder}
                    onChange={(e) => setCustomization({...customization, employeeNameBorder: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="block text-purple-200 mb-2">Glass Morphism Intensity (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.glassIntensity}
                  onChange={(e) => setCustomization({...customization, glassIntensity: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="text-white">{customization.glassIntensity}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-white/10 bg-gradient-to-r from-slate-900 to-purple-900">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
