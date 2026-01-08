export interface GuildLevel {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  benefits: string[];
}

export interface GuildEmployee {
  employeeId: string;
  employeeName: string;
  xp: number;
  level: number;
  achievements: string[];
  rewardsRedeemed: number;
  totalEarned: number;
}

export interface GuildReward {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  category: 'pto' | 'merch' | 'parking' | 'gift' | 'special';
  icon: string;
  available: boolean;
}

export const GUILD_LEVELS: GuildLevel[] = [
  {
    level: 1,
    name: 'Novice',
    minXP: 0,
    maxXP: 499,
    color: '#94a3b8',
    icon: '🌱',
    benefits: ['Basic rewards access', 'Team recognition'],
  },
  {
    level: 2,
    name: 'Apprentice',
    minXP: 500,
    maxXP: 1499,
    color: '#10b981',
    icon: '⭐',
    benefits: ['5% reward discount', 'Priority shift selection', 'Monthly bonus'],
  },
  {
    level: 3,
    name: 'Journeyman',
    minXP: 1500,
    maxXP: 3499,
    color: '#06b6d4',
    icon: '💎',
    benefits: ['10% reward discount', 'Premium parking spot', 'Quarterly bonus'],
  },
  {
    level: 4,
    name: 'Professional',
    minXP: 3500,
    maxXP: 6999,
    color: '#8b5cf6',
    icon: '🏆',
    benefits: ['15% reward discount', 'VIP lounge access', 'Training vouchers'],
  },
  {
    level: 5,
    name: 'Expert',
    minXP: 7000,
    maxXP: 11999,
    color: '#f59e0b',
    icon: '👑',
    benefits: ['20% reward discount', 'Flexible schedule', 'Leadership opportunities'],
  },
  {
    level: 6,
    name: 'Master',
    minXP: 12000,
    maxXP: 19999,
    color: '#ef4444',
    icon: '🔥',
    benefits: ['25% reward discount', 'Mentor status', 'Special projects access'],
  },
  {
    level: 7,
    name: 'Grandmaster',
    minXP: 20000,
    maxXP: Infinity,
    color: '#a855f7',
    icon: '⚡',
    benefits: ['30% reward discount', 'Hall of Fame', 'Profit sharing', 'Unlimited PTO requests'],
  },
];

export const GUILD_REWARDS: GuildReward[] = [
  // PTO Rewards
  { id: 'pto-2h', name: '2 Hours PTO', description: 'Add 2 hours to your PTO balance', xpCost: 200, category: 'pto', icon: '⏰', available: true },
  { id: 'pto-4h', name: '4 Hours PTO', description: 'Add 4 hours to your PTO balance', xpCost: 380, category: 'pto', icon: '⏰⏰', available: true },
  { id: 'pto-day', name: 'Full Day PTO', description: 'Add 8 hours to your PTO balance', xpCost: 720, category: 'pto', icon: '📅', available: true },
  { id: 'pto-week', name: 'Week PTO', description: 'Add 40 hours to your PTO balance', xpCost: 3200, category: 'pto', icon: '🏖️', available: true },

  // Parking Rewards
  { id: 'parking-day', name: 'Premium Parking (1 Day)', description: 'Reserved spot near entrance', xpCost: 100, category: 'parking', icon: '🅿️', available: true },
  { id: 'parking-week', name: 'Premium Parking (1 Week)', description: 'Reserved spot for a week', xpCost: 450, category: 'parking', icon: '🚗', available: true },
  { id: 'parking-month', name: 'Premium Parking (1 Month)', description: 'Reserved spot for 30 days', xpCost: 1500, category: 'parking', icon: '🏆', available: true },

  // Gift Cards
  { id: 'gift-10', name: '$10 Gift Card', description: 'Amazon, Starbucks, or Target', xpCost: 500, category: 'gift', icon: '🎁', available: true },
  { id: 'gift-25', name: '$25 Gift Card', description: 'Your choice of retailer', xpCost: 1200, category: 'gift', icon: '💳', available: true },
  { id: 'gift-50', name: '$50 Gift Card', description: 'Your choice of retailer', xpCost: 2300, category: 'gift', icon: '💰', available: true },
  { id: 'gift-100', name: '$100 Gift Card', description: 'Your choice of retailer', xpCost: 4500, category: 'gift', icon: '💎', available: true },

  // Merchandise
  { id: 'merch-mug', name: 'Company Mug', description: 'Premium ceramic mug', xpCost: 300, category: 'merch', icon: '☕', available: true },
  { id: 'merch-shirt', name: 'Company T-Shirt', description: 'Soft cotton tee', xpCost: 600, category: 'merch', icon: '👕', available: true },
  { id: 'merch-hoodie', name: 'Company Hoodie', description: 'Comfortable fleece hoodie', xpCost: 1200, category: 'merch', icon: '🧥', available: true },
  { id: 'merch-backpack', name: 'Company Backpack', description: 'Durable laptop backpack', xpCost: 1800, category: 'merch', icon: '🎒', available: true },
  { id: 'merch-jacket', name: 'Company Jacket', description: 'Premium windbreaker', xpCost: 2500, category: 'merch', icon: '🧥', available: true },

  // Special Rewards
  { id: 'special-lunch', name: 'Lunch with Leadership', description: 'One-on-one career mentoring', xpCost: 800, category: 'special', icon: '🍽️', available: true },
  { id: 'special-wfh', name: 'Work From Home Day', description: 'Single WFH pass (if applicable)', xpCost: 600, category: 'special', icon: '🏠', available: true },
  { id: 'special-training', name: 'Training Course', description: '$200 towards professional development', xpCost: 2000, category: 'special', icon: '📚', available: true },
  { id: 'special-spotlight', name: 'Employee Spotlight', description: 'Featured in company newsletter', xpCost: 400, category: 'special', icon: '🌟', available: true },
  { id: 'special-bonus', name: 'Cash Bonus', description: '$50 bonus added to next paycheck', xpCost: 5000, category: 'special', icon: '💵', available: true },
];

export const ACHIEVEMENTS = [
  { id: 'perfect-week', name: 'Perfect Week', description: 'No absences for 7 days', xp: 100, icon: '✅' },
  { id: 'perfect-month', name: 'Perfect Month', description: 'No absences for 30 days', xp: 500, icon: '🏅' },
  { id: 'early-bird', name: 'Early Bird', description: 'Clocked in early 10 times', xp: 200, icon: '🐦' },
  { id: 'overtime-hero', name: 'Overtime Hero', description: 'Worked 10+ extra shifts', xp: 300, icon: '💪' },
  { id: 'team-player', name: 'Team Player', description: 'Covered 5 coworker shifts', xp: 250, icon: '🤝' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Completed tasks 20% faster', xp: 150, icon: '⚡' },
  { id: 'helping-hand', name: 'Helping Hand', description: 'Trained 3 new employees', xp: 400, icon: '👋' },
  { id: 'loyal', name: 'Company Loyal', description: '1 year of service', xp: 1000, icon: '🎖️' },
  { id: 'veteran', name: 'Veteran', description: '3 years of service', xp: 3000, icon: '🏆' },
  { id: 'legend', name: 'Legend', description: '5 years of service', xp: 5000, icon: '👑' },
];

export function calculateLevel(xp: number): GuildLevel {
  for (let i = GUILD_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= GUILD_LEVELS[i].minXP) {
      return GUILD_LEVELS[i];
    }
  }
  return GUILD_LEVELS[0];
}

export function getProgressToNextLevel(xp: number): { current: number; max: number; percentage: number } {
  const currentLevel = calculateLevel(xp);
  const nextLevel = GUILD_LEVELS.find(l => l.minXP > xp);
  
  if (!nextLevel) {
    return { current: xp, max: xp, percentage: 100 };
  }

  const current = xp - currentLevel.minXP;
  const max = nextLevel.minXP - currentLevel.minXP;
  const percentage = (current / max) * 100;

  return { current, max, percentage };
}

export function awardXP(
  employeeId: string,
  xpAmount: number,
  reason: string
): { success: boolean; newXP: number; levelUp?: boolean } {
  // This would integrate with your Firebase/database
  console.log(`Awarding ${xpAmount} XP to ${employeeId} for: ${reason}`);
  
  // Return mock data - in real implementation, update database
  return {
    success: true,
    newXP: xpAmount,
    levelUp: false,
  };
}

export function redeemReward(
  employeeId: string,
  rewardId: string,
  currentXP: number
): { success: boolean; newXP: number; message: string } {
  const reward = GUILD_REWARDS.find(r => r.id === rewardId);
  
  if (!reward) {
    return { success: false, newXP: currentXP, message: 'Reward not found' };
  }

  if (currentXP < reward.xpCost) {
    return { success: false, newXP: currentXP, message: 'Insufficient XP' };
  }

  // Deduct XP and process reward
  const newXP = currentXP - reward.xpCost;
  
  console.log(`Employee ${employeeId} redeemed ${reward.name} for ${reward.xpCost} XP`);
  
  return {
    success: true,
    newXP,
    message: `Successfully redeemed ${reward.name}!`,
  };
}
