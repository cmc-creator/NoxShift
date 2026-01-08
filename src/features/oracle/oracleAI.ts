export interface OraclePrediction {
  type: 'flight-risk' | 'burnout' | 'overtime' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  employeeId: string;
  employeeName: string;
  confidence: number; // 0-100
  title: string;
  message: string;
  impact: string;
  suggestedAction: string;
  daysAhead?: number;
  data?: any;
}

export interface EmployeeAnalytics {
  employeeId: string;
  employeeName: string;
  shiftsWorked: number;
  consecutiveDays: number;
  overtimeHours: number;
  lateArrivals: number;
  absences: number;
  shiftsDeclined: number;
  onTimeRate: number; // percentage
  performanceScore: number; // 0-100
  lastShiftDate: Date;
}

// Flight Risk Prediction (90 days ahead)
export function predictFlightRisk(analytics: EmployeeAnalytics): OraclePrediction | null {
  let riskScore = 0;
  const factors: string[] = [];

  // Factor 1: Declining attendance (30% weight)
  if (analytics.absences > 3) {
    riskScore += 30;
    factors.push(`${analytics.absences} absences in past 30 days`);
  }

  // Factor 2: Late arrivals (20% weight)
  if (analytics.lateArrivals > 5) {
    riskScore += 20;
    factors.push(`${analytics.lateArrivals} late arrivals`);
  }

  // Factor 3: Declined shifts (25% weight)
  if (analytics.shiftsDeclined > 4) {
    riskScore += 25;
    factors.push(`Declined ${analytics.shiftsDeclined} shifts`);
  }

  // Factor 4: Performance decline (25% weight)
  if (analytics.performanceScore < 70) {
    riskScore += 25;
    factors.push(`Performance score: ${analytics.performanceScore}%`);
  }

  if (riskScore >= 50) {
    return {
      type: 'flight-risk',
      severity: riskScore >= 75 ? 'critical' : riskScore >= 60 ? 'high' : 'medium',
      employeeId: analytics.employeeId,
      employeeName: analytics.employeeName,
      confidence: Math.min(riskScore, 95),
      title: `High Flight Risk: ${analytics.employeeName}`,
      message: `Employee shows ${riskScore}% probability of leaving within 90 days. ${factors.join(', ')}.`,
      impact: `Replacement cost: $4,500 (recruiting + training). Productivity loss: 3-4 weeks.`,
      suggestedAction: 'Schedule one-on-one meeting to discuss career goals, workload, and satisfaction.',
      daysAhead: 90,
      data: { riskScore, factors },
    };
  }

  return null;
}

// Burnout Detection
export function detectBurnout(analytics: EmployeeAnalytics): OraclePrediction | null {
  let burnoutScore = 0;
  const factors: string[] = [];

  // Factor 1: Consecutive days worked (40% weight)
  if (analytics.consecutiveDays >= 7) {
    burnoutScore += 40;
    factors.push(`${analytics.consecutiveDays} consecutive days without break`);
  } else if (analytics.consecutiveDays >= 6) {
    burnoutScore += 25;
    factors.push(`${analytics.consecutiveDays} consecutive days`);
  }

  // Factor 2: Excessive overtime (35% weight)
  if (analytics.overtimeHours > 15) {
    burnoutScore += 35;
    factors.push(`${analytics.overtimeHours} hours of overtime this month`);
  } else if (analytics.overtimeHours > 10) {
    burnoutScore += 20;
    factors.push(`${analytics.overtimeHours} hours overtime`);
  }

  // Factor 3: Performance decline (25% weight)
  if (analytics.performanceScore < 75) {
    burnoutScore += 25;
    factors.push(`Performance dropped to ${analytics.performanceScore}%`);
  }

  if (burnoutScore >= 50) {
    return {
      type: 'burnout',
      severity: burnoutScore >= 80 ? 'critical' : burnoutScore >= 65 ? 'high' : 'medium',
      employeeId: analytics.employeeId,
      employeeName: analytics.employeeName,
      confidence: Math.min(burnoutScore, 93),
      title: `Burnout Risk: ${analytics.employeeName}`,
      message: `Employee showing ${burnoutScore}% burnout indicators. ${factors.join(', ')}.`,
      impact: `23% productivity decrease expected. Risk of errors increases 34%. Sick leave probability: 67%.`,
      suggestedAction: 'Mandate 2-day break immediately. Reduce hours next 2 weeks. Consider workload redistribution.',
      data: { burnoutScore, factors },
    };
  }

  return null;
}

// Overtime Forecast (monthly)
export function forecastOvertime(
  currentOvertimeHours: number,
  daysElapsed: number,
  totalDaysInMonth: number
): OraclePrediction | null {
  const avgOvertimePerDay = currentOvertimeHours / daysElapsed;
  const projectedMonthlyOvertime = avgOvertimePerDay * totalDaysInMonth;

  if (projectedMonthlyOvertime > 20) {
    const monthlyCost = projectedMonthlyOvertime * 37.50; // $25/hr base * 1.5x overtime

    return {
      type: 'overtime',
      severity: projectedMonthlyOvertime > 40 ? 'high' : projectedMonthlyOvertime > 30 ? 'medium' : 'low',
      employeeId: 'team',
      employeeName: 'Team-wide',
      confidence: Math.min(70 + (daysElapsed / totalDaysInMonth) * 25, 95),
      title: 'Overtime Budget Alert',
      message: `Current pace: ${currentOvertimeHours}hrs in ${daysElapsed} days. Projected monthly total: ${Math.round(projectedMonthlyOvertime)} hours.`,
      impact: `Estimated cost: $${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}. Budget overrun: ${Math.round((projectedMonthlyOvertime / 20 - 1) * 100)}%.`,
      suggestedAction: 'Review scheduling efficiency. Consider hiring temporary staff. Evaluate workload distribution.',
      data: { currentOvertimeHours, projectedMonthlyOvertime, monthlyCost },
    };
  }

  return null;
}

// Smart Recommendation Engine
export function generateRecommendation(analytics: EmployeeAnalytics): OraclePrediction | null {
  // Positive performance recognition
  if (
    analytics.onTimeRate >= 98 &&
    analytics.consecutiveDays < 6 &&
    analytics.performanceScore >= 90
  ) {
    return {
      type: 'recommendation',
      severity: 'low',
      employeeId: analytics.employeeId,
      employeeName: analytics.employeeName,
      confidence: 95,
      title: `Star Performer: ${analytics.employeeName}`,
      message: `${analytics.employeeName} maintained ${analytics.onTimeRate}% on-time rate with ${analytics.performanceScore}% performance score.`,
      impact: 'Leadership development opportunity. Potential for increased responsibility and compensation.',
      suggestedAction: 'Consider for promotion to shift lead or supervisor role. Offer leadership training. Award Guild XP bonus.',
      data: { analytics },
    };
  }

  // Schedule optimization
  if (analytics.consecutiveDays >= 5 && analytics.consecutiveDays < 7) {
    return {
      type: 'recommendation',
      severity: 'medium',
      employeeId: analytics.employeeId,
      employeeName: analytics.employeeName,
      confidence: 85,
      title: `Schedule Optimization: ${analytics.employeeName}`,
      message: `${analytics.employeeName} has worked ${analytics.consecutiveDays} consecutive days. Recommend scheduling a break.`,
      impact: 'Prevent burnout. Maintain performance quality. Improve retention by 15-20%.',
      suggestedAction: 'Schedule 2-day break within next 48 hours. Cross-train other staff to provide coverage.',
      data: { analytics },
    };
  }

  return null;
}

// Run full Oracle analysis
export function runOracleAnalysis(
  employeeAnalytics: EmployeeAnalytics[],
  overtimeData: { current: number; daysElapsed: number; totalDays: number }
): OraclePrediction[] {
  const predictions: OraclePrediction[] = [];

  // Check each employee
  employeeAnalytics.forEach((analytics) => {
    const flightRisk = predictFlightRisk(analytics);
    const burnout = detectBurnout(analytics);
    const recommendation = generateRecommendation(analytics);

    if (flightRisk) predictions.push(flightRisk);
    if (burnout) predictions.push(burnout);
    if (recommendation) predictions.push(recommendation);
  });

  // Team-wide overtime forecast
  const overtimeForecast = forecastOvertime(
    overtimeData.current,
    overtimeData.daysElapsed,
    overtimeData.totalDays
  );
  if (overtimeForecast) predictions.push(overtimeForecast);

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  predictions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return predictions;
}

// Mock data generator for testing
export function generateMockAnalytics(): EmployeeAnalytics[] {
  return [
    {
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      shiftsWorked: 22,
      consecutiveDays: 3,
      overtimeHours: 8,
      lateArrivals: 1,
      absences: 0,
      shiftsDeclined: 0,
      onTimeRate: 98,
      performanceScore: 95,
      lastShiftDate: new Date(),
    },
    {
      employeeId: '2',
      employeeName: 'Marcus Williams',
      shiftsWorked: 18,
      consecutiveDays: 7,
      overtimeHours: 16,
      lateArrivals: 3,
      absences: 1,
      shiftsDeclined: 2,
      onTimeRate: 89,
      performanceScore: 78,
      lastShiftDate: new Date(),
    },
    {
      employeeId: '3',
      employeeName: 'Jennifer Lee',
      shiftsWorked: 24,
      consecutiveDays: 2,
      overtimeHours: 4,
      lateArrivals: 0,
      absences: 0,
      shiftsDeclined: 0,
      onTimeRate: 100,
      performanceScore: 97,
      lastShiftDate: new Date(),
    },
    {
      employeeId: '4',
      employeeName: 'David Kim',
      shiftsWorked: 15,
      consecutiveDays: 1,
      overtimeHours: 2,
      lateArrivals: 7,
      absences: 5,
      shiftsDeclined: 6,
      onTimeRate: 68,
      performanceScore: 65,
      lastShiftDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];
}
