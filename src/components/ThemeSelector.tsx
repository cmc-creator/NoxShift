import React, { useState, useRef, useEffect } from 'react';
import { X, Palette, Sun, Moon, Sparkles, RefreshCw, Type, Image, Video, Play, Pause, Volume2, VolumeX, Sliders } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEMES, getThemesByCategory } from '../themes/themeConfig';

interface ThemeSelectorProps {
  onClose?: () => void;
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { currentTheme, setTheme, customColors, updateCustomColor, resetCustomColors, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  const [activeTab, setActiveTab] = useState<'light' | 'dark' | 'creative'>('dark');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const lightThemes = getThemesByCategory('light');
  const darkThemes = getThemesByCategory('dark');
  const creativeThemes = getThemesByCategory('creative');

  const fonts = [
    { value: 'system-ui, -apple-system, sans-serif', label: 'System Default' },
    { value: '"Inter", sans-serif', label: 'Inter' },
    { value: '"Poppins", sans-serif', label: 'Poppins' },
    { value: '"Roboto", sans-serif', label: 'Roboto' },
    { value: '"Open Sans", sans-serif', label: 'Open Sans' },
    { value: '"Montserrat", sans-serif', label: 'Montserrat' },
    { value: '"Lato", sans-serif', label: 'Lato' },
    { value: '"Raleway", sans-serif', label: 'Raleway' },
    { value: '"Playfair Display", serif', label: 'Playfair' },
    { value: '"Merriweather", serif', label: 'Merriweather' },
    { value: '"Fira Code", monospace', label: 'Fira Code' },
    { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
    { value: '"Comic Sans MS", cursive', label: 'Comic Sans' },
    { value: '"Courier New", monospace', label: 'Courier' },
    { value: '"Georgia", serif', label: 'Georgia' },
    { value: '"Impact", fantasy', label: 'Impact' },
    { value: '"Brush Script MT", cursive', label: 'Brush Script' },
    { value: '"Papyrus", fantasy', label: 'Papyrus' },
    { value: '"Trattatello", fantasy', label: 'Trattatello' },
    { value: '"Luminari", fantasy', label: 'Luminari' },
  ];

  const renderThemeGrid = (themes: typeof THEMES) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
            currentTheme.id === theme.id
              ? 'border-white shadow-lg scale-105'
              : 'border-transparent opacity-75 hover:opacity-100'
          }`}
          style={{
            background: theme.gradients?.background || theme.colors.background,
            color: theme.colors.text,
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{theme.name}</span>
              {currentTheme.id === theme.id && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </div>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded" style={{ background: theme.colors.primary }} />
              <div className="w-6 h-6 rounded" style={{ background: theme.colors.secondary }} />
              <div className="w-6 h-6 rounded" style={{ background: theme.colors.accent }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onClose?.()} />
      
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-slide-in"
        style={{
          background: currentTheme.colors.surface,
          color: currentTheme.colors.text,
          border: `2px solid ${currentTheme.colors.border}`,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 p-6 border-b"
          style={{
            background: currentTheme.gradients?.primary || currentTheme.colors.primary,
            borderColor: currentTheme.colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Theme Gallery</h2>
                <p className="text-sm opacity-80">30+ Beautiful Themes • Fully Customizable</p>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => onClose?.()}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Tabs */}
          <div className="sticky top-0 z-10 flex gap-2 p-4 border-b" style={{ background: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}>
            <button
              onClick={() => setActiveTab('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'light' ? 'scale-105' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: activeTab === 'light' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'light' ? '#fff' : currentTheme.colors.text,
              }}
            >
              <Sun className="w-4 h-4" />
              Light ({lightThemes.length})
            </button>
            <button
              onClick={() => setActiveTab('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'dark' ? 'scale-105' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: activeTab === 'dark' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'dark' ? '#fff' : currentTheme.colors.text,
              }}
            >
              <Moon className="w-4 h-4" />
              Dark ({darkThemes.length})
            </button>
            <button
              onClick={() => setActiveTab('creative')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'creative' ? 'scale-105' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: activeTab === 'creative' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'creative' ? '#fff' : currentTheme.colors.text,
              }}
            >
              <Sparkles className="w-4 h-4" />
              Creative ({creativeThemes.length})
            </button>
          </div>

          {/* Theme Grid */}
          <div className="p-6">
            {activeTab === 'light' && renderThemeGrid(lightThemes)}
            {activeTab === 'dark' && renderThemeGrid(darkThemes)}
            {activeTab === 'creative' && renderThemeGrid(creativeThemes)}
          </div>

          {/* Font Selector */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-bold">Font Family</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFontFamily(font.value)}
                  className={`px-4 py-2 rounded-lg border transition-all hover:scale-105 ${
                    fontFamily === font.value ? 'scale-105' : 'opacity-70'
                  }`}
                  style={{
                    background: fontFamily === font.value ? currentTheme.colors.primary : 'transparent',
                    borderColor: currentTheme.colors.border,
                    color: fontFamily === font.value ? '#fff' : currentTheme.colors.text,
                    fontFamily: font.value,
                  }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-lg font-bold">Font Size</h3>
              </div>
              <span className="text-sm font-mono px-3 py-1 rounded-lg" style={{ background: currentTheme.colors.surface, border: `1px solid ${currentTheme.colors.border}` }}>
                {fontSize}px
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold" style={{ color: currentTheme.colors.text }}>Small</span>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.primary} ${((fontSize - 12) / 12) * 100}%, ${currentTheme.colors.border} ${((fontSize - 12) / 12) * 100}%, ${currentTheme.colors.border} 100%)`,
                }}
              />
              <span className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>Large</span>
            </div>
            <div className="grid grid-cols-6 gap-2 mt-4">
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-2 rounded-lg border transition-all hover:scale-105 ${
                    fontSize === size ? 'scale-105' : 'opacity-70'
                  }`}
                  style={{
                    background: fontSize === size ? currentTheme.colors.primary : 'transparent',
                    borderColor: currentTheme.colors.border,
                    color: fontSize === size ? '#fff' : currentTheme.colors.text,
                    fontSize: `${size}px`,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Editor */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ background: currentTheme.colors.primary, color: '#fff' }}
            >
              <Palette className="w-4 h-4" />
              {showCustomizer ? 'Hide' : 'Show'} Advanced Customizer
            </button>

            {showCustomizer && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold mb-1 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColors[key as keyof typeof customColors] || value}
                        onChange={(e) => updateCustomColor(key as keyof typeof currentTheme.colors, e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors[key as keyof typeof customColors] || value}
                        onChange={(e) => updateCustomColor(key as keyof typeof currentTheme.colors, e.target.value)}
                        className="flex-1 px-2 py-1 rounded text-sm"
                        style={{
                          background: currentTheme.colors.surface,
                          border: `1px solid ${currentTheme.colors.border}`,
                          color: currentTheme.colors.text,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="col-span-full flex gap-2">
                  <button
                    onClick={resetCustomColors}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                    style={{ background: currentTheme.colors.error, color: '#fff' }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Custom Colors
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Background Textures */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-bold">Background Textures</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => document.body.style.backgroundImage = 'none'}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center text-xs font-bold"
                style={{
                  background: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                }}
              >
                None
              </button>
              <button
                onClick={() => {
                  document.body.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    repeating-linear-gradient(
                      90deg,
                      rgba(100, 100, 100, 0.03) 0px,
                      rgba(100, 100, 100, 0.03) 1px,
                      transparent 1px,
                      transparent 40px
                    ),
                    repeating-linear-gradient(
                      0deg,
                      rgba(100, 100, 100, 0.03) 0px,
                      rgba(100, 100, 100, 0.03) 1px,
                      transparent 1px,
                      transparent 40px
                    ),
                    linear-gradient(90deg, rgb(245, 245, 245), rgb(225, 225, 225))
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      90deg,
                      rgba(100, 100, 100, 0.1) 0px,
                      rgba(100, 100, 100, 0.1) 1px,
                      transparent 1px,
                      transparent 20px
                    ),
                    repeating-linear-gradient(
                      0deg,
                      rgba(100, 100, 100, 0.1) 0px,
                      rgba(100, 100, 100, 0.1) 1px,
                      transparent 1px,
                      transparent 20px
                    ),
                    linear-gradient(90deg, rgb(245, 245, 245), rgb(225, 225, 225))
                  `,
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 2px,
                      rgba(0, 0, 0, 0.05) 2px,
                      rgba(0, 0, 0, 0.05) 4px
                    ),
                    linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 2px,
                      rgba(0, 0, 0, 0.08) 2px,
                      rgba(0, 0, 0, 0.08) 4px
                    ),
                    linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)
                  `,
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    linear-gradient(
                      180deg,
                      rgba(0, 0, 0, 0.02) 0%,
                      rgba(255, 255, 255, 0.02) 50%,
                      rgba(0, 0, 0, 0.02) 100%
                    ),
                    repeating-linear-gradient(
                      90deg,
                      #a0a0a0 0px,
                      #b0b0b0 1px,
                      #c0c0c0 2px,
                      #d0d0d0 3px,
                      #c0c0c0 4px,
                      #b0b0b0 5px,
                      #a0a0a0 6px
                    )
                  `;
                  document.body.style.backgroundSize = '100% 100%, 6px 100%';
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      180deg,
                      rgba(0, 0, 0, 0.03) 0%,
                      rgba(255, 255, 255, 0.03) 50%,
                      rgba(0, 0, 0, 0.03) 100%
                    ),
                    repeating-linear-gradient(
                      90deg,
                      #a0a0a0 0px,
                      #b0b0b0 1px,
                      #c0c0c0 2px,
                      #d0d0d0 3px,
                      #c0c0c0 4px,
                      #b0b0b0 5px,
                      #a0a0a0 6px
                    )
                  `,
                  backgroundSize: '100% 100%, 6px 100%',
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
                    linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    repeating-linear-gradient(
                      0deg,
                      rgba(255, 255, 255, 0.05) 0px,
                      transparent 1px,
                      transparent 2px,
                      rgba(255, 255, 255, 0.05) 3px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      rgba(255, 255, 255, 0.05) 0px,
                      transparent 1px,
                      transparent 2px,
                      rgba(255, 255, 255, 0.05) 3px
                    ),
                    linear-gradient(135deg, #0f172a 0%, #1e293b 100%)
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    radial-gradient(ellipse at top, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    #0f172a
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: `
                    radial-gradient(ellipse at top, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                    #0f172a
                  `,
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    repeating-linear-gradient(
                      45deg,
                      rgba(0, 0, 0, 0.1) 0px,
                      rgba(0, 0, 0, 0.1) 10px,
                      transparent 10px,
                      transparent 20px
                    ),
                    repeating-linear-gradient(
                      -45deg,
                      rgba(0, 0, 0, 0.1) 0px,
                      rgba(0, 0, 0, 0.1) 10px,
                      transparent 10px,
                      transparent 20px
                    ),
                    linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  borderColor: currentTheme.colors.border,
                }}
              />
              <button
                onClick={() => {
                  document.body.style.backgroundImage = `
                    repeating-conic-gradient(
                      from 0deg at 50% 50%,
                      rgba(0, 0, 0, 0.05) 0deg,
                      transparent 2deg,
                      rgba(0, 0, 0, 0.05) 4deg
                    ),
                    linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)
                  `;
                  document.body.style.backgroundAttachment = 'fixed';
                }}
                className="aspect-square rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  borderColor: currentTheme.colors.border,
                }}
              />
            </div>
            <p className="text-xs opacity-60 mt-3">Click any texture to apply as app background</p>
          </div>

          {/* Custom Image Backgrounds */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-bold">Custom Image Backgrounds</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Placeholder for user images - these will load from /backgrounds/ folder */}
              {[
                { name: 'Image 1', file: 'background-1.jpg' },
                { name: 'Image 2', file: 'background-2.jpg' },
                { name: 'Image 3', file: 'background-3.jpg' },
                { name: 'Image 4', file: 'background-4.jpg' },
                { name: 'Image 5', file: 'background-5.png' },
                { name: 'Image 6', file: 'background-6.png' },
              ].map((bg) => (
                <button
                  key={bg.file}
                  onClick={() => {
                    document.body.style.backgroundImage = `url('/backgrounds/${bg.file}')`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundAttachment = 'fixed';
                    document.body.style.backgroundRepeat = 'no-repeat';
                    // Remove video if active
                    const existingVideo = document.getElementById('noxshift-video-bg');
                    if (existingVideo) existingVideo.remove();
                  }}
                  className="aspect-video rounded-lg border-2 transition-all hover:scale-105 overflow-hidden relative group"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url('/backgrounds/${bg.file}')`,
                      filter: 'brightness(0.8)'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{bg.name}</span>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    IMG
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs opacity-60 mt-3">
              Add your images to <code className="px-1.5 py-0.5 rounded" style={{ background: currentTheme.colors.surface }}>public/backgrounds/</code> folder
            </p>
          </div>

          {/* Custom Video Backgrounds */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-bold">Custom Video Backgrounds</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Placeholder for user videos */}
              {[
                { name: 'Video 1', file: 'background-1.mp4' },
                { name: 'Video 2', file: 'background-2.mp4' },
                { name: 'Video 3', file: 'background-3.mp4' },
                { name: 'Video 4', file: 'background-4.webm' },
              ].map((bg) => (
                <button
                  key={bg.file}
                  onClick={() => {
                    // Remove existing video
                    const existingVideo = document.getElementById('noxshift-video-bg');
                    if (existingVideo) existingVideo.remove();
                    
                    // Clear image background
                    document.body.style.backgroundImage = 'none';
                    
                    // Create video element
                    const video = document.createElement('video');
                    video.id = 'noxshift-video-bg';
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = videoMuted;
                    video.playsInline = true;
                    video.src = `/backgrounds/${bg.file}`;
                    video.style.position = 'fixed';
                    video.style.top = '0';
                    video.style.left = '0';
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    video.style.zIndex = '-1';
                    video.style.opacity = (backgroundOpacity / 100).toString();
                    document.body.insertBefore(video, document.body.firstChild);
                    videoRef.current = video;
                    setVideoPlaying(true);
                  }}
                  className="aspect-video rounded-lg border-2 transition-all hover:scale-105 overflow-hidden relative group"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Play className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{bg.name}</span>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    VIDEO
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs opacity-60 mt-3">
              Add your videos (MP4/WebM) to <code className="px-1.5 py-0.5 rounded" style={{ background: currentTheme.colors.surface }}>public/backgrounds/</code> folder
            </p>
          </div>

          {/* Video Controls */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-3 mb-4">
              <Sliders className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-bold">Background Controls</h3>
            </div>
            <div className="space-y-4">
              {/* Video Play/Pause */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Video Playback</span>
                <button
                  onClick={() => {
                    const video = document.getElementById('noxshift-video-bg') as HTMLVideoElement;
                    if (video) {
                      if (videoPlaying) {
                        video.pause();
                        setVideoPlaying(false);
                      } else {
                        video.play();
                        setVideoPlaying(true);
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-lg border transition-all hover:scale-105 flex items-center gap-2"
                  style={{
                    background: currentTheme.colors.surface,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                  }}
                >
                  {videoPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Play
                    </>
                  )}
                </button>
              </div>

              {/* Video Mute/Unmute */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Video Sound</span>
                <button
                  onClick={() => {
                    const video = document.getElementById('noxshift-video-bg') as HTMLVideoElement;
                    if (video) {
                      video.muted = !videoMuted;
                      setVideoMuted(!videoMuted);
                    }
                  }}
                  className="px-4 py-2 rounded-lg border transition-all hover:scale-105 flex items-center gap-2"
                  style={{
                    background: currentTheme.colors.surface,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                  }}
                >
                  {videoMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Mute
                    </>
                  )}
                </button>
              </div>

              {/* Background Opacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Background Opacity</span>
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: currentTheme.colors.surface }}>
                    {backgroundOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={backgroundOpacity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setBackgroundOpacity(value);
                    const video = document.getElementById('noxshift-video-bg') as HTMLVideoElement;
                    if (video) {
                      video.style.opacity = (value / 100).toString();
                    }
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.primary} ${backgroundOpacity}%, ${currentTheme.colors.border} ${backgroundOpacity}%, ${currentTheme.colors.border} 100%)`,
                  }}
                />
                <p className="text-xs opacity-60 mt-2">Adjust if text readability is affected</p>
              </div>

              {/* Clear Background */}
              <button
                onClick={() => {
                  document.body.style.backgroundImage = 'none';
                  const video = document.getElementById('noxshift-video-bg');
                  if (video) video.remove();
                }}
                className="w-full px-4 py-2 rounded-lg border transition-all hover:scale-105"
                style={{
                  background: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                }}
              >
                Clear Background
              </button>
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-6 border-t sticky bottom-0" style={{ background: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}>
            <button
              onClick={() => onClose?.()}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              style={{ background: currentTheme.colors.primary, color: '#fff' }}
            >
              Apply Changes & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
