export interface ShiftDifferential {
  type: 'night' | 'weekend' | 'holiday' | 'overtime' | 'hazard' | 'oncall';
  multiplier: number;
  description: string;
  color: string;
}

export interface CalculatedPay {
  baseHours: number;
  baseRate: number;
  basePay: number;
  differentials: {
    type: string;
    hours: number;
    rate: number;
    amount: number;
  }[];
  totalPay: number;
  breakdown: string;
}

export const DIFFERENTIALS: ShiftDifferential[] = [
  {
    type: 'night',
    multiplier: 1.15,
    description: 'Night Shift (10 PM - 6 AM)',
    color: '#6366f1',
  },
  {
    type: 'weekend',
    multiplier: 1.25,
    description: 'Weekend (Saturday & Sunday)',
    color: '#8b5cf6',
  },
  {
    type: 'holiday',
    multiplier: 2.0,
    description: 'Holiday (Federal/Company)',
    color: '#ef4444',
  },
  {
    type: 'overtime',
    multiplier: 1.5,
    description: 'Overtime (Over 40 hrs/week)',
    color: '#f59e0b',
  },
  {
    type: 'hazard',
    multiplier: 1.5,
    description: 'Hazard Pay (High-risk situations)',
    color: '#dc2626',
  },
  {
    type: 'oncall',
    multiplier: 1.2,
    description: 'On-Call Standby',
    color: '#06b6d4',
  },
];

export const HOLIDAYS = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 20, name: 'Martin Luther King Jr. Day' },
  { month: 1, day: 17, name: "Presidents' Day" },
  { month: 4, day: 26, name: 'Memorial Day' },
  { month: 6, day: 4, name: 'Independence Day' },
  { month: 8, day: 1, name: 'Labor Day' },
  { month: 9, day: 13, name: 'Columbus Day' },
  { month: 10, day: 11, name: 'Veterans Day' },
  { month: 10, day: 27, name: 'Thanksgiving' },
  { month: 11, day: 25, name: 'Christmas Day' },
];

export function isHoliday(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();
  return HOLIDAYS.some(h => h.month === month && h.day === day);
}

export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
}

export function isNightShift(startTime: string, endTime: string): boolean {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  
  // Night shift if starts between 22:00-23:59 OR ends between 00:00-06:00
  return start >= 22 || end <= 6;
}

export function calculateShiftHours(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let hours = endHour - startHour + (endMin - startMin) / 60;
  
  // Handle overnight shifts
  if (hours < 0) {
    hours += 24;
  }
  
  return hours;
}

export function calculatePay(
  shiftDate: Date,
  startTime: string,
  endTime: string,
  baseRate: number,
  weeklyHours: number = 0,
  options: {
    isHazard?: boolean;
    isOnCall?: boolean;
  } = {}
): CalculatedPay {
  const hours = calculateShiftHours(startTime, endTime);
  const basePay = hours * baseRate;
  
  const differentials: CalculatedPay['differentials'] = [];
  let totalPay = basePay;

  // Night Differential
  if (isNightShift(startTime, endTime)) {
    const nightDiff = DIFFERENTIALS.find(d => d.type === 'night')!;
    const amount = hours * baseRate * (nightDiff.multiplier - 1);
    differentials.push({
      type: 'Night Shift',
      hours,
      rate: baseRate * nightDiff.multiplier,
      amount,
    });
    totalPay += amount;
  }

  // Weekend Differential
  if (isWeekend(shiftDate)) {
    const weekendDiff = DIFFERENTIALS.find(d => d.type === 'weekend')!;
    const amount = hours * baseRate * (weekendDiff.multiplier - 1);
    differentials.push({
      type: 'Weekend',
      hours,
      rate: baseRate * weekendDiff.multiplier,
      amount,
    });
    totalPay += amount;
  }

  // Holiday Differential
  if (isHoliday(shiftDate)) {
    const holidayDiff = DIFFERENTIALS.find(d => d.type === 'holiday')!;
    const amount = hours * baseRate * (holidayDiff.multiplier - 1);
    differentials.push({
      type: 'Holiday',
      hours,
      rate: baseRate * holidayDiff.multiplier,
      amount,
    });
    totalPay += amount;
  }

  // Overtime Differential (after 40 hours)
  if (weeklyHours > 40) {
    const overtimeHours = Math.min(hours, weeklyHours - 40);
    if (overtimeHours > 0) {
      const overtimeDiff = DIFFERENTIALS.find(d => d.type === 'overtime')!;
      const amount = overtimeHours * baseRate * (overtimeDiff.multiplier - 1);
      differentials.push({
        type: 'Overtime',
        hours: overtimeHours,
        rate: baseRate * overtimeDiff.multiplier,
        amount,
      });
      totalPay += amount;
    }
  }

  // Hazard Pay
  if (options.isHazard) {
    const hazardDiff = DIFFERENTIALS.find(d => d.type === 'hazard')!;
    const amount = hours * baseRate * (hazardDiff.multiplier - 1);
    differentials.push({
      type: 'Hazard Pay',
      hours,
      rate: baseRate * hazardDiff.multiplier,
      amount,
    });
    totalPay += amount;
  }

  // On-Call
  if (options.isOnCall) {
    const onCallDiff = DIFFERENTIALS.find(d => d.type === 'oncall')!;
    const amount = hours * baseRate * (onCallDiff.multiplier - 1);
    differentials.push({
      type: 'On-Call',
      hours,
      rate: baseRate * onCallDiff.multiplier,
      amount,
    });
    totalPay += amount;
  }

  const breakdown = [
    `Base: ${hours}h × $${baseRate}/h = $${basePay.toFixed(2)}`,
    ...differentials.map(d => 
      `${d.type}: ${d.hours}h × $${d.rate.toFixed(2)}/h = +$${d.amount.toFixed(2)}`
    ),
  ].join('\n');

  return {
    baseHours: hours,
    baseRate,
    basePay,
    differentials,
    totalPay,
    breakdown,
  };
}

export function getApplicableDifferentials(
  shiftDate: Date,
  startTime: string,
  endTime: string,
  weeklyHours: number = 0
): ShiftDifferential[] {
  const applicable: ShiftDifferential[] = [];

  if (isNightShift(startTime, endTime)) {
    applicable.push(DIFFERENTIALS.find(d => d.type === 'night')!);
  }

  if (isWeekend(shiftDate)) {
    applicable.push(DIFFERENTIALS.find(d => d.type === 'weekend')!);
  }

  if (isHoliday(shiftDate)) {
    applicable.push(DIFFERENTIALS.find(d => d.type === 'holiday')!);
  }

  if (weeklyHours > 40) {
    applicable.push(DIFFERENTIALS.find(d => d.type === 'overtime')!);
  }

  return applicable;
}

export function formatPayBreakdown(calc: CalculatedPay): string {
  const lines = [
    `💰 Pay Breakdown`,
    `━━━━━━━━━━━━━━━━`,
    `Base Pay: $${calc.basePay.toFixed(2)}`,
    `  ${calc.baseHours}h @ $${calc.baseRate}/h`,
  ];

  if (calc.differentials.length > 0) {
    lines.push(`\nDifferentials:`);
    calc.differentials.forEach(d => {
      lines.push(`  ${d.type}: +$${d.amount.toFixed(2)}`);
    });
  }

  lines.push(`━━━━━━━━━━━━━━━━`);
  lines.push(`TOTAL: $${calc.totalPay.toFixed(2)}`);

  return lines.join('\n');
}

// Calculate weekly totals for overtime detection
export function calculateWeeklyHours(
  shifts: Array<{ date: string; startTime: string; endTime: string }>,
  weekStartDate: Date
): number {
  const weekEnd = new Date(weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 7);

  let totalHours = 0;

  shifts.forEach(shift => {
    const shiftDate = new Date(shift.date);
    if (shiftDate >= weekStartDate && shiftDate < weekEnd) {
      totalHours += calculateShiftHours(shift.startTime, shift.endTime);
    }
  });

  return totalHours;
}

// Overtime warning system
export function checkOvertimeWarning(
  weeklyHours: number,
  proposedShiftHours: number
): { warning: boolean; message: string; severity: 'low' | 'medium' | 'high' } | null {
  const projectedTotal = weeklyHours + proposedShiftHours;

  if (projectedTotal > 40) {
    const overtimeHours = projectedTotal - 40;
    const severity = overtimeHours > 8 ? 'high' : overtimeHours > 4 ? 'medium' : 'low';

    return {
      warning: true,
      message: `⚠️ OVERTIME ALERT: This shift will result in ${overtimeHours.toFixed(1)} overtime hours this week (${projectedTotal.toFixed(1)}h total). Overtime rate: 1.5x base pay.`,
      severity,
    };
  }

  if (projectedTotal > 35 && projectedTotal <= 40) {
    return {
      warning: true,
      message: `ℹ️ Approaching overtime: ${projectedTotal.toFixed(1)}/40 hours this week. ${(40 - projectedTotal).toFixed(1)} hours remaining before overtime.`,
      severity: 'low',
    };
  }

  return null;
}
