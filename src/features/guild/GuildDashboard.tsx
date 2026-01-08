import React, { useState } from 'react';
import { Trophy, Star, Gift, TrendingUp, Award, Crown, Zap, X } from 'lucide-react';
import { 
  GUILD_LEVELS, 
  GUILD_REWARDS, 
  calculateLevel, 
  getProgressToNextLevel,
  redeemReward 
} from './guildSystem';
import { useTheme } from '../../context/ThemeContext';

interface GuildDashboardProps {
  employeeId: string;
  employeeName: string;
  currentXP: number;
  onRedeemReward: (rewardId: string, newXP: number) => void;
  onClose: () => void;
}

export default function GuildDashboard({ 
  employeeId, 
  employeeName, 
  currentXP, 
  onRedeemReward, 
  onClose 
}: GuildDashboardProps) {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pto' | 'merch' | 'parking' | 'gift' | 'special'>('all');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const currentLevel = calculateLevel(currentXP);
  const progress = getProgressToNextLevel(currentXP);
  const nextLevel = GUILD_LEVELS.find(l => l.minXP > currentXP);

  const filteredRewards = selectedCategory === 'all' 
    ? GUILD_REWARDS 
    : GUILD_REWARDS.filter(r => r.category === selectedCategory);

  const handleRedeem = (rewardId: string) => {
    const result = redeemReward(employeeId, rewardId, currentXP);
    if (result.success) {
      onRedeemReward(rewardId, result.newXP);
      setShowConfirm(null);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div
        className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-slide-in"
        style={{
          background: currentTheme.gradients?.background || currentTheme.colors.background,
          color: currentTheme.colors.text,
          border: `2px solid ${currentTheme.colors.border}`,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 p-6 border-b"
          style={{
            background: currentTheme.colors.primary,
            borderColor: currentTheme.colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="w-10 h-10" />
              <div>
                <h2 className="text-3xl font-black">GUILD SYSTEM</h2>
                <p className="text-sm opacity-90">Level Up • Earn Rewards • Compete with Team</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Player Stats */}
          <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Level */}
              <div
                className="p-6 rounded-xl border-2 relative overflow-hidden"
                style={{
                  background: currentTheme.colors.surface,
                  borderColor: currentLevel.color,
                }}
              >
                <div
                  className="absolute top-0 right-0 text-9xl opacity-10"
                  style={{ color: currentLevel.color }}
                >
                  {currentLevel.icon}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5" style={{ color: currentLevel.color }} />
                    <span className="text-sm font-bold opacity-70">CURRENT RANK</span>
                  </div>
                  <h3
                    className="text-4xl font-black mb-1"
                    style={{ color: currentLevel.color }}
                  >
                    {currentLevel.name}
                  </h3>
                  <p className="text-sm opacity-80">Level {currentLevel.level}</p>
                  <div className="mt-4 space-y-1">
                    {currentLevel.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Star className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: currentLevel.color }} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  background: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
                  <span className="text-sm font-bold opacity-70">EXPERIENCE POINTS</span>
                </div>
                <div className="text-center mb-4">
                  <div
                    className="text-5xl font-black"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    {currentXP.toLocaleString()}
                  </div>
                  <p className="text-sm opacity-70 mt-1">Total XP Earned</p>
                </div>
                {nextLevel && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress to {nextLevel.name}</span>
                      <span className="font-bold">{Math.round(progress.percentage)}%</span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: currentTheme.colors.border }}
                    >
                      <div
                        className="h-full transition-all duration-1000 rounded-full"
                        style={{
                          width: `${progress.percentage}%`,
                          background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-2 opacity-70">
                      {progress.current.toLocaleString()} / {progress.max.toLocaleString()} XP
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  background: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" style={{ color: currentTheme.colors.success }} />
                  <span className="text-sm font-bold opacity-70">ACHIEVEMENTS</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div
                      className="text-3xl font-black"
                      style={{ color: currentTheme.colors.success }}
                    >
                      12
                    </div>
                    <p className="text-xs opacity-70">Unlocked</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-3xl font-black"
                      style={{ color: currentTheme.colors.warning }}
                    >
                      8
                    </div>
                    <p className="text-xs opacity-70">Rewards Redeemed</p>
                  </div>
                  <div className="text-center col-span-2">
                    <div
                      className="text-2xl font-black"
                      style={{ color: currentTheme.colors.info }}
                    >
                      #3
                    </div>
                    <p className="text-xs opacity-70">Leaderboard Rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Shop */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-2xl font-bold">Rewards Shop</h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pto', 'parking', 'gift', 'merch', 'special'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat ? 'scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background: selectedCategory === cat ? currentTheme.colors.primary : 'transparent',
                    border: `2px solid ${currentTheme.colors.border}`,
                    color: selectedCategory === cat ? '#fff' : currentTheme.colors.text,
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRewards.map((reward) => {
                const canAfford = currentXP >= reward.xpCost;
                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      canAfford ? 'hover:scale-105 cursor-pointer' : 'opacity-50'
                    }`}
                    style={{
                      background: currentTheme.colors.surface,
                      borderColor: canAfford ? currentTheme.colors.success : currentTheme.colors.border,
                    }}
                    onClick={() => canAfford && setShowConfirm(reward.id)}
                  >
                    <div className="text-4xl mb-2">{reward.icon}</div>
                    <h4 className="font-bold mb-1">{reward.name}</h4>
                    <p className="text-xs opacity-70 mb-3">{reward.description}</p>
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-lg font-bold text-sm"
                      style={{
                        background: canAfford ? currentTheme.colors.success + '20' : currentTheme.colors.border,
                        color: canAfford ? currentTheme.colors.success : currentTheme.colors.textSecondary,
                      }}
                    >
                      <span>COST</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {reward.xpCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Progression */}
          <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Crown className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              Guild Ranks
            </h3>
            <div className="space-y-3">
              {GUILD_LEVELS.map((level, idx) => {
                const isUnlocked = currentXP >= level.minXP;
                const isCurrent = currentLevel.level === level.level;
                return (
                  <div
                    key={level.level}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      isCurrent ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{
                      background: isUnlocked ? level.color + '20' : currentTheme.colors.surface,
                      borderColor: isCurrent ? level.color : currentTheme.colors.border,
                      opacity: isUnlocked ? 1 : 0.5,
                    }}
                  >
                    <div className="text-4xl">{level.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg" style={{ color: level.color }}>
                          {level.name}
                        </h4>
                        {isCurrent && (
                          <span
                            className="px-2 py-1 rounded text-xs font-bold"
                            style={{ background: level.color, color: '#fff' }}
                          >
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm opacity-70 mb-2">
                        Level {level.level} • {level.minXP.toLocaleString()} - {level.maxXP === Infinity ? '∞' : level.maxXP.toLocaleString()} XP
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {level.benefits.map((benefit, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              background: currentTheme.colors.surface,
                              border: `1px solid ${currentTheme.colors.border}`,
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirm(null)} />
          <div
            className="relative p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
            style={{
              background: currentTheme.colors.surface,
              border: `2px solid ${currentTheme.colors.border}`,
            }}
          >
            {(() => {
              const reward = GUILD_REWARDS.find(r => r.id === showConfirm);
              if (!reward) return null;
              return (
                <>
                  <h3 className="text-xl font-bold mb-4">Confirm Redemption</h3>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">{reward.icon}</div>
                    <p className="font-bold text-lg">{reward.name}</p>
                    <p className="text-sm opacity-70">{reward.description}</p>
                    <p className="mt-4 text-sm">
                      This will cost <span className="font-bold" style={{ color: currentTheme.colors.warning }}>{reward.xpCost.toLocaleString()} XP</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(null)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold"
                      style={{
                        background: currentTheme.colors.error,
                        color: '#fff',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRedeem(showConfirm)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold"
                      style={{
                        background: currentTheme.colors.success,
                        color: '#fff',
                      }}
                    >
                      Redeem
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
