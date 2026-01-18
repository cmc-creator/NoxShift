import React, { useState, useRef, useEffect } from 'react';
import { X, Palette, Sun, Moon, Sparkles, RefreshCw, Type, Image, Video, Play, Pause, Volume2, VolumeX, Sliders, Star, Zap, Heart, Coffee, Music, Flame, Snowflake, Droplets, Wind, Cloud, Orbit } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEMES, getThemesByCategory } from '../themes/themeConfig';

interface ThemeSelectorProps {
  onClose?: () => void;
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { currentTheme, setTheme, customColors, updateCustomColor, resetCustomColors, fontFamily, setFontFamily, fontSize, setFontSize } = useTheme();
  const [activeTab, setActiveTab] = useState<'themes' | 'textures' | 'motion' | 'particles' | 'advanced'>('themes');
  const [themeCategory, setThemeCategory] = useState<'light' | 'dark' | 'creative'>('dark');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);
  const [particleEffect, setParticleEffect] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const lightThemes = getThemesByCategory('light');
  const darkThemes = getThemesByCategory('dark');
  const creativeThemes = getThemesByCategory('creative');

  const fonts = [
    { value: 'system-ui, -apple-system, sans-serif', label: 'System Default', icon: '🖥️' },
    { value: '"Inter", sans-serif', label: 'Inter', icon: '📝' },
    { value: '"Poppins", sans-serif', label: 'Poppins', icon: '✨' },
    { value: '"Roboto", sans-serif', label: 'Roboto', icon: '🤖' },
    { value: '"Open Sans", sans-serif', label: 'Open Sans', icon: '📖' },
    { value: '"Montserrat", sans-serif', label: 'Montserrat', icon: '🏔️' },
    { value: '"Lato", sans-serif', label: 'Lato', icon: '💼' },
    { value: '"Raleway", sans-serif', label: 'Raleway', icon: '🎨' },
    { value: '"Playfair Display", serif', label: 'Playfair', icon: '👑' },
    { value: '"Merriweather", serif', label: 'Merriweather', icon: '📚' },
    { value: '"Fira Code", monospace', label: 'Fira Code', icon: '💻' },
    { value: '"JetBrains Mono", monospace', label: 'JetBrains', icon: '⚡' },
    { value: '"Comic Sans MS", cursive', label: 'Comic Sans', icon: '😄' },
    { value: '"Courier New", monospace', label: 'Courier', icon: '📰' },
    { value: '"Georgia", serif', label: 'Georgia', icon: '🍑' },
    { value: '"Impact", fantasy', label: 'Impact', icon: '💥' },
    { value: '"Brush Script MT", cursive', label: 'Brush Script', icon: '🖌️' },
    { value: '"Papyrus", fantasy', label: 'Papyrus', icon: '📜' },
    { value: '"Trattatello", fantasy', label: 'Trattatello', icon: '🎭' },
    { value: '"Luminari", fantasy', label: 'Luminari', icon: '✨' },
  ];

  const textures = [
    { 
      name: 'None', 
      icon: '🚫',
      apply: () => {
        document.body.style.backgroundImage = 'none';
      }
    },
    { 
      name: 'Purple Dreams', 
      icon: '💜',
      apply: () => {
        document.body.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Grid Light', 
      icon: '📐',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(90deg, rgba(100, 100, 100, 0.03) 0px, rgba(100, 100, 100, 0.03) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(0deg, rgba(100, 100, 100, 0.03) 0px, rgba(100, 100, 100, 0.03) 1px, transparent 1px, transparent 40px),
          linear-gradient(90deg, rgb(245, 245, 245), rgb(225, 225, 225))
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Diagonal Stripes', 
      icon: '📏',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px),
          linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Carbon Fiber', 
      icon: '🔲',
      apply: () => {
        document.body.style.backgroundImage = `
          linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.02) 100%),
          repeating-linear-gradient(90deg, #a0a0a0 0px, #b0b0b0 1px, #c0c0c0 2px, #d0d0d0 3px, #c0c0c0 4px, #b0b0b0 5px, #a0a0a0 6px)
        `;
        document.body.style.backgroundSize = '100% 100%, 6px 100%';
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Midnight Blue', 
      icon: '🌙',
      apply: () => {
        document.body.style.backgroundImage = `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Dark Grid', 
      icon: '⬛',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0px, transparent 1px, transparent 2px, rgba(255, 255, 255, 0.05) 3px),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0px, transparent 1px, transparent 2px, rgba(255, 255, 255, 0.05) 3px),
          linear-gradient(135deg, #0f172a 0%, #1e293b 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Neon Glow', 
      icon: '💚',
      apply: () => {
        document.body.style.backgroundImage = `
          radial-gradient(ellipse at top, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          #0f172a
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Sunset Plaid', 
      icon: '🌅',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 10px, transparent 10px, transparent 20px),
          repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 10px, transparent 10px, transparent 20px),
          linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Spiral Galaxy', 
      icon: '🌌',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-conic-gradient(from 0deg at 50% 50%, rgba(0, 0, 0, 0.05) 0deg, transparent 2deg, rgba(0, 0, 0, 0.05) 4deg),
          linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Ocean Waves', 
      icon: '🌊',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0px, transparent 30px),
          linear-gradient(180deg, #0ea5e9 0%, #06b6d4 50%, #0891b2 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Emerald Matrix', 
      icon: '💎',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0px, rgba(16, 185, 129, 0.05) 1px, transparent 1px, transparent 20px),
          repeating-linear-gradient(0deg, rgba(16, 185, 129, 0.05) 0px, rgba(16, 185, 129, 0.05) 1px, transparent 1px, transparent 20px),
          linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Candy Pop', 
      icon: '🍬',
      apply: () => {
        document.body.style.backgroundImage = `
          radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Lava Flow', 
      icon: '🌋',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-radial-gradient(circle at 50% 50%, transparent 0px, rgba(0, 0, 0, 0.2) 10px, transparent 20px),
          linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Arctic Ice', 
      icon: '❄️',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(30deg, rgba(255, 255, 255, 0.1) 0px, transparent 10px, rgba(255, 255, 255, 0.1) 20px),
          linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Forest Canopy', 
      icon: '🌲',
      apply: () => {
        document.body.style.backgroundImage = `
          radial-gradient(ellipse at top, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(21, 128, 61, 0.2) 0%, transparent 50%),
          linear-gradient(180deg, #14532d 0%, #166534 50%, #15803d 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Holographic', 
      icon: '🔮',
      apply: () => {
        document.body.style.backgroundImage = `
          linear-gradient(45deg, rgba(255, 0, 255, 0.1) 0%, transparent 25%, rgba(0, 255, 255, 0.1) 50%, transparent 75%, rgba(255, 255, 0, 0.1) 100%),
          linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Cherry Blossom', 
      icon: '🌸',
      apply: () => {
        document.body.style.backgroundImage = `
          radial-gradient(circle at 20% 30%, rgba(244, 114, 182, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(251, 207, 232, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Cyberpunk', 
      icon: '🤖',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(90deg, rgba(236, 72, 153, 0.05) 0px, transparent 1px, transparent 20px),
          repeating-linear-gradient(0deg, rgba(14, 165, 233, 0.05) 0px, transparent 1px, transparent 20px),
          linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Golden Hour', 
      icon: '🌇',
      apply: () => {
        document.body.style.backgroundImage = `
          linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
          linear-gradient(0deg, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #fed7aa 0%, #fef3c7 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
    { 
      name: 'Midnight City', 
      icon: '🏙️',
      apply: () => {
        document.body.style.backgroundImage = `
          repeating-linear-gradient(0deg, rgba(59, 130, 246, 0.02) 0px, transparent 2px, transparent 100px),
          repeating-linear-gradient(90deg, rgba(139, 92, 246, 0.02) 0px, transparent 2px, transparent 100px),
          linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)
        `;
        document.body.style.backgroundAttachment = 'fixed';
      }
    },
  ];

  const motionBackgrounds = [
    { 
      name: 'Floating Bubbles', 
      icon: '🫧',
      css: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 1%);
          background-size: 50px 50px;
          animation: float 6s ease-in-out infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Pulse Wave', 
      icon: '〰️',
      css: `
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Diagonal Sweep', 
      icon: '↗️',
      css: `
        @keyframes sweep {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px);
          background-size: 200% 200%;
          animation: sweep 20s linear infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Rotating Gradient', 
      icon: '🔄',
      css: `
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%);
          animation: rotate 30s linear infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Aurora Borealis', 
      icon: '🌈',
      css: `
        @keyframes aurora {
          0%, 100% { opacity: 0.3; transform: translateX(-10%); }
          50% { opacity: 0.6; transform: translateX(10%); }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%);
          animation: aurora 15s ease-in-out infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Breathing Glow', 
      icon: '✨',
      css: `
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 50px rgba(147, 51, 234, 0.2); }
          50% { box-shadow: 0 0 100px rgba(236, 72, 153, 0.4); }
        }
        body::before {
          content: '';
          position: fixed;
          top: 50%;
          left: 50%;
          width: 80%;
          height: 80%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: breathe 6s ease-in-out infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Neon Pulse', 
      icon: '⚡',
      css: `
        @keyframes neonPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(90deg, transparent 48%, rgba(236, 72, 153, 0.5) 50%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(59, 130, 246, 0.5) 50%, transparent 52%);
          background-size: 100px 100px;
          animation: neonPulse 2s ease-in-out infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
    { 
      name: 'Plasma Flow', 
      icon: '🌀',
      css: `
        @keyframes plasma {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2), rgba(251, 191, 36, 0.2), rgba(59, 130, 246, 0.2));
          background-size: 400% 400%;
          animation: plasma 15s ease infinite;
          z-index: -1;
          pointer-events: none;
        }
      `
    },
  ];

  const particleEffects = [
    { name: 'None', icon: '🚫', id: 'none' },
    { name: 'Falling Stars', icon: '⭐', id: 'stars' },
    { name: 'Snow', icon: '❄️', id: 'snow' },
    { name: 'Rain', icon: '🌧️', id: 'rain' },
    { name: 'Fireflies', icon: '✨', id: 'fireflies' },
    { name: 'Confetti', icon: '🎉', id: 'confetti' },
    { name: 'Hearts', icon: '💖', id: 'hearts' },
    { name: 'Sakura', icon: '🌸', id: 'sakura' },
    { name: 'Money', icon: '💵', id: 'money' },
    { name: 'Emojis', icon: '😄', id: 'emojis' },
  ];

  const applyMotionBackground = (css: string) => {
    // Remove existing motion styles
    const existingStyle = document.getElementById('noxshift-motion-bg');
    if (existingStyle) existingStyle.remove();
    
    // Create new style element
    const style = document.createElement('style');
    style.id = 'noxshift-motion-bg';
    style.textContent = css;
    document.head.appendChild(style);
  };

  const applyParticleEffect = (effectId: string) => {
    // Remove existing particle container
    const existingContainer = document.getElementById('noxshift-particles');
    if (existingContainer) existingContainer.remove();
    
    if (effectId === 'none') {
      setParticleEffect(null);
      return;
    }
    
    setParticleEffect(effectId);
    
    // Create particle container
    const container = document.createElement('div');
    container.id = 'noxshift-particles';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    container.style.overflow = 'hidden';
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.fontSize = `${Math.random() * 20 + 10}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationIterationCount = 'infinite';
      particle.style.animationTimingFunction = 'linear';
      
      switch (effectId) {
        case 'stars':
          particle.textContent = '⭐';
          particle.style.animation = 'fall 8s linear infinite';
          break;
        case 'snow':
          particle.textContent = '❄️';
          particle.style.animation = 'fall 10s linear infinite';
          break;
        case 'rain':
          particle.textContent = '💧';
          particle.style.animation = 'fall 3s linear infinite';
          break;
        case 'fireflies':
          particle.textContent = '✨';
          particle.style.animation = 'float 6s ease-in-out infinite';
          break;
        case 'confetti':
          particle.textContent = '🎉';
          particle.style.animation = 'fall 5s linear infinite';
          break;
        case 'hearts':
          particle.textContent = '💖';
          particle.style.animation = 'float 8s ease-in-out infinite';
          break;
        case 'sakura':
          particle.textContent = '🌸';
          particle.style.animation = 'fall 12s linear infinite';
          break;
        case 'money':
          particle.textContent = '💵';
          particle.style.animation = 'fall 6s linear infinite';
          break;
        case 'emojis':
          const emojis = ['😄', '😎', '🤩', '🥳', '🎯', '🚀', '💪', '👍'];
          particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          particle.style.animation = 'fall 7s linear infinite';
          break;
      }
      
      container.appendChild(particle);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0.3; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
        25% { transform: translateY(-50px) translateX(20px); opacity: 1; }
        50% { transform: translateY(0) translateX(40px); opacity: 0.6; }
        75% { transform: translateY(-30px) translateX(20px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(container);
  };

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
                <h2 className="text-2xl font-bold">🎨 Ultimate Theme Gallery</h2>
                <p className="text-sm opacity-80">100+ Themes • Textures • Motion Backgrounds • Particle Effects</p>
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
          {/* Main Tabs */}
          <div className="sticky top-0 z-10 flex gap-2 p-4 border-b" style={{ background: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}>
            {[
              { id: 'themes', label: 'Themes', icon: Palette },
              { id: 'textures', label: 'Textures', icon: Image },
              { id: 'motion', label: 'Motion', icon: Zap },
              { id: 'particles', label: 'Particles', icon: Sparkles },
              { id: 'advanced', label: 'Advanced', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: activeTab === tab.id ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === tab.id ? '#fff' : currentTheme.colors.text,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* THEMES TAB */}
          {activeTab === 'themes' && (
            <div className="p-6">
              {/* Theme Category Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setThemeCategory('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    themeCategory === 'light' ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: themeCategory === 'light' ? currentTheme.colors.primary : 'transparent',
                    color: themeCategory === 'light' ? '#fff' : currentTheme.colors.text,
                  }}
                >
                  <Sun className="w-4 h-4" />
                  Light ({lightThemes.length})
                </button>
                <button
                  onClick={() => setThemeCategory('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    themeCategory === 'dark' ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: themeCategory === 'dark' ? currentTheme.colors.primary : 'transparent',
                    color: themeCategory === 'dark' ? '#fff' : currentTheme.colors.text,
                  }}
                >
                  <Moon className="w-4 h-4" />
                  Dark ({darkThemes.length})
                </button>
                <button
                  onClick={() => setThemeCategory('creative')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    themeCategory === 'creative' ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: themeCategory === 'creative' ? currentTheme.colors.primary : 'transparent',
                    color: themeCategory === 'creative' ? '#fff' : currentTheme.colors.text,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Creative ({creativeThemes.length})
                </button>
              </div>

              {themeCategory === 'light' && renderThemeGrid(lightThemes)}
              {themeCategory === 'dark' && renderThemeGrid(darkThemes)}
              {themeCategory === 'creative' && renderThemeGrid(creativeThemes)}
            </div>
          )}

          {/* TEXTURES TAB */}
          {activeTab === 'textures' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-2xl font-bold">Background Textures & Patterns</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {textures.map((texture) => (
                  <button
                    key={texture.name}
                    onClick={texture.apply}
                    className="aspect-square rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
                    style={{
                      borderColor: currentTheme.colors.border,
                    }}
                  >
                    <span className="text-4xl">{texture.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: currentTheme.colors.text }}>{texture.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs opacity-60 mt-6">✨ Click any texture to apply as app background</p>
            </div>
          )}

          {/* MOTION TAB */}
          {activeTab === 'motion' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-2xl font-bold">Animated Motion Backgrounds</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    const existingStyle = document.getElementById('noxshift-motion-bg');
                    if (existingStyle) existingStyle.remove();
                  }}
                  className="aspect-square rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <span className="text-4xl">🚫</span>
                  <span className="text-xs font-semibold">None</span>
                </button>
                {motionBackgrounds.map((motion) => (
                  <button
                    key={motion.name}
                    onClick={() => applyMotionBackground(motion.css)}
                    className="aspect-square rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: currentTheme.colors.border }}
                  >
                    <span className="text-4xl">{motion.icon}</span>
                    <span className="text-xs font-semibold">{motion.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs opacity-60 mt-6">⚡ Animated backgrounds add life to your workspace!</p>
            </div>
          )}

          {/* PARTICLES TAB */}
          {activeTab === 'particles' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-2xl font-bold">Particle Effects Overlay</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {particleEffects.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => applyParticleEffect(effect.id)}
                    className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2 ${
                      particleEffect === effect.id ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{ 
                      borderColor: particleEffect === effect.id ? currentTheme.colors.primary : currentTheme.colors.border,
                      ringColor: currentTheme.colors.primary
                    }}
                  >
                    <span className="text-4xl">{effect.icon}</span>
                    <span className="text-xs font-semibold">{effect.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs opacity-60 mt-6">✨ Particle effects appear above everything - perfect for celebrations!</p>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
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
                      <div className="flex items-center gap-2">
                        <span>{font.icon}</span>
                        <span>{font.label}</span>
                      </div>
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
                  {showCustomizer ? 'Hide' : 'Show'} Color Customizer
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

              {/* Background Controls */}
              <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <Sliders className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                  <h3 className="text-lg font-bold">Background Controls</h3>
                </div>
                <div className="space-y-4">
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
                  </div>

                  {/* Clear All Button */}
                  <button
                    onClick={() => {
                      document.body.style.backgroundImage = 'none';
                      const video = document.getElementById('noxshift-video-bg');
                      if (video) video.remove();
                      const motion = document.getElementById('noxshift-motion-bg');
                      if (motion) motion.remove();
                      const particles = document.getElementById('noxshift-particles');
                      if (particles) particles.remove();
                      setParticleEffect(null);
                    }}
                    className="w-full px-4 py-3 rounded-lg border transition-all hover:scale-105 font-bold"
                    style={{
                      background: currentTheme.colors.error,
                      color: '#fff',
                    }}
                  >
                    🗑️ Clear All Effects
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="p-6 border-t sticky bottom-0" style={{ background: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}>
            <button
              onClick={() => onClose?.()}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              style={{ background: currentTheme.colors.primary, color: '#fff' }}
            >
              ✅ Apply Changes & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
