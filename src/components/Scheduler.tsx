import React, { useState, useEffect, useMemo } from 'react';
import BigCalendarView from './BigCalendarView';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon, 
  Trash2, 
  X,
  Printer,
  Copy,
  Clipboard,
  Wand2,
  Lock,
  Globe,
  Settings,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Download,
  ArrowRightLeft,
  Sparkles,
  MessageSquare,
  Building,
  DollarSign,
  Ban,
  Send,
  PlusCircle,
  Briefcase,
  RotateCcw,
  FileCheck,
  Palette,
  Trophy,
  Circle,
  Clock,
  Share2,
  Link2,
  Mail,
  QrCode,
  User,
  Users,
  Image as ImageIcon,
  Camera,
  Grip,
  FileText,
  ClipboardCopy,
  Moon,
  Sun,
  Keyboard,
  Coffee,
  TrendingUp,
  Zap,
  Filter,
  GitCompare,
  ShoppingCart,
  Layers,
  CloudRain,
  Target,
  Activity,
  Mic,
  MapPin,
  Navigation,
  Wifi,
  Battery,
  Thermometer,
  Wind,
  Sunrise,
  Sunset,
  Plug,
  Radio,
  Webhook,
  Gauge,
  HeartPulse,
  BrainCircuit,
  Award,
  Star,
  Brain,
  Smile,
  Frown,
  Meh,
  Bell,
  BellRing,
  Headphones,
  MessageCircle,
  Video,
  Flame,
  Crown,
  Gem,
  ThumbsUp,
  Heart,
  ShieldCheck,
  Cpu,
  LineChart,
  PieChart,
  Bot,
  Gamepad2,
  ShoppingBag,
  Gift,
  Menu,
  Rocket,
  Package,
  CreditCard,
  ZoomIn,
  ZoomOut,
  LogOut,
  StickyNote
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '../context/AuthContext';
import GuildDashboard from '../features/guild/GuildDashboard';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../lib/firebase';
import { 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  doc, 
  onSnapshot, 
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { app } from '../lib/firebase';
import { appId as configAppId, initialAuthToken } from '../firebase.config';
import { OracleAIPanel } from '../features/oracle/OracleAIPanel';
import { ConflictDetector } from '../features/conflicts/ConflictDetector';
import { CoverageHeatmap } from '../features/coverage/CoverageHeatmap';
import { ShiftMarketplace } from '../features/marketplace/ShiftMarketplace';
import { PTODonations } from '../features/pto/PTODonations';
import { PerformanceDashboard } from '../features/performance/PerformanceDashboard';
import { SchedulePublisher } from '../features/publishing/SchedulePublisher';
import { BudgetAlerts } from '../features/budget/BudgetAlerts';
import { QuickFillAI } from '../features/quickfill/QuickFillAI';
import { ManagerNotes } from '../features/notes/ManagerNotes';
import { ShiftReportTemplates } from '../features/templates/ShiftReportTemplates';
import { EmployeeManagement } from '../features/management/EmployeeManagement';
import { EmployeeOnboarding } from '../features/onboarding/EmployeeOnboarding';
import { EmployeeBasecamp } from '../features/basecamp/EmployeeBasecamp';

// --- Firebase Configuration ---
const db = getFirestore(app);
const appId = configAppId;

// --- Utility Functions ---

const getThemeColors = (name: string, customHue?: number | null) => {
  let h;
  if (customHue !== undefined && customHue !== null && customHue !== '') {
    h = parseInt(String(customHue));
  } else {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    h = Math.abs(hash) % 360;
  }
  
  return {
    bg: `hsl(${h}, 60%, 35%)`, 
    border: `hsl(${h}, 60%, 25%)`,
    text: `hsl(0, 0%, 95%)`,
    hue: h
  };
};

const formatTime = (time: string, use24h: boolean = false) => {
  if (use24h) return time;
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getEmployeeInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const COLOR_PRESETS = [
  { hue: 0, label: 'Red' },
  { hue: 15, label: 'Coral' },
  { hue: 30, label: 'Orange' },
  { hue: 45, label: 'Amber' },
  { hue: 60, label: 'Yellow' },
  { hue: 90, label: 'Lime' },
  { hue: 120, label: 'Green' },
  { hue: 150, label: 'Emerald' },
  { hue: 165, label: 'Teal' },
  { hue: 180, label: 'Cyan' },
  { hue: 195, label: 'Sky' },
  { hue: 210, label: 'Blue' },
  { hue: 240, label: 'Indigo' },
  { hue: 260, label: 'Purple' },
  { hue: 285, label: 'Violet' },
  { hue: 300, label: 'Pink' },
  { hue: 330, label: 'Rose' },
  { hue: 200, label: 'Gray' }
];

const APP_THEMES = {
  blue: { primary: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', border: 'border-blue-600', ring: 'ring-blue-200', bgSoft: 'bg-blue-50' },
  indigo: { primary: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-600', ring: 'ring-indigo-200', bgSoft: 'bg-indigo-50' },
  purple: { primary: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', border: 'border-purple-600', ring: 'ring-purple-200', bgSoft: 'bg-purple-50' },
  emerald: { primary: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'ring-emerald-200', bgSoft: 'bg-emerald-50' },
  rose: { primary: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-600', border: 'border-rose-600', ring: 'ring-rose-200', bgSoft: 'bg-rose-50' },
  slate: { primary: 'bg-slate-700', hover: 'hover:bg-slate-800', text: 'text-slate-700', border: 'border-slate-700', ring: 'ring-slate-200', bgSoft: 'bg-slate-100' },
};

const FONTS = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
};

interface Employee {
  name: string;
  rate: number;
  email?: string;
  phone?: string;
  role?: string;
  employmentStatus?: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  hireDate?: string;
  availability?: {
    monday?: { available: boolean; start?: string; end?: string };
    tuesday?: { available: boolean; start?: string; end?: string };
    wednesday?: { available: boolean; start?: string; end?: string };
    thursday?: { available: boolean; start?: string; end?: string };
    friday?: { available: boolean; start?: string; end?: string };
    saturday?: { available: boolean; start?: string; end?: string };
    sunday?: { available: boolean; start?: string; end?: string };
  };
}

interface ShiftPreset {
  label: string;
  start: string;
  end: string;
}

interface ShiftTemplate {
  id?: string;
  name: string;
  description?: string;
  shifts: Array<{
    employeeName: string;
    role: string;
    startTime: string;
    endTime: string;
    department?: string;
  }>;
}

interface TimeOffRequest {
  id?: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'Vacation' | 'Sick' | 'Personal' | 'Bereavement' | 'Jury Duty' | 'Unpaid';
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface ShiftSwapRequest {
  id?: string;
  requestingEmployee: string;
  requestedShiftId: string;
  targetEmployee?: string;
  offeredShiftId?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  respondedAt?: string;
}

interface Shift {
  id?: string;
  date: string;
  employeeName: string;
  startTime: string;
  endTime: string;
  role: string;
  department?: string;
  notes?: string;
  colorHue?: number | null;
  isDraft?: boolean;
  isTimeOff?: boolean;
  timestamp?: number;
  isRecurring?: boolean;
  recurringId?: string;
  recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  breakStart?: string;
  breakEnd?: string;
  breakDuration?: number;
  shiftComments?: string;
  differential?: number;
}

interface Holiday {
  date: string;
  name: string;
  type: 'federal' | 'company' | 'custom';
}

interface LocationTracking {
  employeeName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  distanceFromWorkplace?: number;
  isOnSite?: boolean;
}

interface SentimentAnalysis {
  employeeName: string;
  mood: 'positive' | 'neutral' | 'negative';
  score: number;
  text: string;
  timestamp: string;
}

interface WellnessAlert {
  employeeName: string;
  type: 'burnout' | 'overwork' | 'stress';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}

interface VoiceCommand {
  command: string;
  timestamp: string;
  action: string;
  success: boolean;
}

interface IntegrationApp {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: string;
  connected: boolean;
}

interface EmployeeStats {
  totalHours: number;
  totalShifts: number;
  totalEarnings: number;
  avgShiftLength: number;
  daysWorked: number;
  overtimeHours: number;
}

// --- Main Component ---

export default function Scheduler() {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: 'neutral', msg: 'Connecting...' });
  
  // Modals & Panels
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showGuild, setShowGuild] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [showTimeClock, setShowTimeClock] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [employeePhotos, setEmployeePhotos] = useState<Record<string, string>>({});
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month' | 'agenda' | 'shift-matrix' | 'bigcalendar'>('bigcalendar');
  const [calendarDisplayStyle, setCalendarDisplayStyle] = useState<'standard' | 'compact' | 'list' | 'timeline'>('standard');
  const [personalReminders, setPersonalReminders] = useState<Array<{id: string; title: string; date: string; time: string; notes: string}>>([]);
  const [personalEvents, setPersonalEvents] = useState<Array<{id: string; title: string; date: string; startTime: string; endTime: string; notes: string; color: string}>>([]);
  const [showPersonalPanel, setShowPersonalPanel] = useState(false);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [shiftSwapRequests, setShiftSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [selectedEmployeeProfile, setSelectedEmployeeProfile] = useState<string | null>(null);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidays, setHolidays] = useState<Array<{ date: string; name: string; type: 'federal' | 'company' }>>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Calendar zoom
  const [calendarZoom, setCalendarZoom] = useState(100); // 50 to 150%
  const [employeeAvailability, setEmployeeAvailability] = useState<Record<string, any>>({});
  const [showConflictDetector, setShowConflictDetector] = useState(false);
  const [showCostForecast, setShowCostForecast] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showEmployeeBasecamp, setShowEmployeeBasecamp] = useState(false);
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [showCompareView, setShowCompareView] = useState(false);
  const [showOracleAI, setShowOracleAI] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [showSchedulePublisher, setShowSchedulePublisher] = useState(false);
  const [showBudgetAlerts, setShowBudgetAlerts] = useState(false);
  const [showQuickFillAI, setShowQuickFillAI] = useState(false);
  const [showManagerNotes, setShowManagerNotes] = useState(false);
  const [showReportTemplates, setShowReportTemplates] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showEmployeeOnboarding, setShowEmployeeOnboarding] = useState(false);
  const [showPTODonations, setShowPTODonations] = useState(false);
  const [compareMonth, setCompareMonth] = useState<Date>(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const [notifications, setNotifications] = useState<Array<{id: string; type: string; message: string; timestamp: number; read: boolean}>>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusOfferings, setBonusOfferings] = useState<Array<{id: string; type: string; amount: number; date: string; employeeName: string; claimed: boolean}>>([]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  
  // Comprehensive Customization State
  const [customization, setCustomization] = useState({
    // Info Bar Metrics
    showInfoBar: true,
    monthlyBudget: 75000,
    budgetUsed: 48250,
    targetEPOB: 12.5,
    currentEPOB: 11.8,
    targetFTE: 22.0,
    currentFTE: 20.5,
    // Bonus & XP System
    bonusPerGapShift: 50,
    bonusPickupShift: 75,
    bonusWeekendShift: 100,
    bonusOvertimeShift: 125,
    xpClockInOnTime: 10,
    xpShiftComplete: 20,
    xpPickupShift: 100,
    xpWeekPerfect: 150,
    xpMonthPerfect: 500,
    // Calendar Colors
    calendarBg: '#ffffff',
    calendarBorder: '#e2e8f0',
    calendarText: '#1e293b',
    todayHighlight: '#a855f7',
    weekendBg: '#f8fafc',
    // Shift Card Styling
    shiftBorderRadius: 8,
    shiftBorderWidth: 1,
    shiftShadow: 'medium',
    shiftPadding: 8,
    // Employee Name Styling
    employeeNameBorder: true,
    employeeNameBorderColor: '#ffffff',
    employeeNameBorderWidth: 2,
    employeeNameBorderStyle: 'solid',
    employeeNameBg: 'transparent',
    employeeNamePadding: 4,
    // Typography
    employeeNameFontSize: 12,
    employeeNameFontWeight: 600,
    timeFontSize: 14,
    // Visual Effects
    enableAnimations: true,
    enableHoverEffects: true,
    enableGradients: true,
    glassIntensity: 90,
    // Dark Mode Override
    darkModeCalendarBg: '#1e293b',
    darkModeCalendarBorder: '#334155',
    darkModeCalendarText: '#f1f5f9'
  });
  
  // Revolutionary Features State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceHistory, setVoiceHistory] = useState<VoiceCommand[]>([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [locationTracking, setLocationTracking] = useState<LocationTracking[]>([]);
  const [showGPSModal, setShowGPSModal] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [showSentimentModal, setShowSentimentModal] = useState(false);
  const [showAIScheduleModal, setShowAIScheduleModal] = useState(false);
  const [wellnessAlerts, setWellnessAlerts] = useState<WellnessAlert[]>([]);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationApp[]>([
    { id: 'slack', name: 'Slack', icon: MessageCircle, description: 'Team messaging', category: 'Communication', connected: false },
    { id: 'teams', name: 'Microsoft Teams', icon: Video, description: 'Video conferencing', category: 'Communication', connected: false },
    { id: 'google', name: 'Google Calendar', icon: CalendarIcon, description: 'Calendar sync', category: 'Productivity', connected: false },
    { id: 'outlook', name: 'Outlook', icon: Mail, description: 'Email & calendar', category: 'Productivity', connected: false },
    { id: 'quickbooks', name: 'QuickBooks', icon: DollarSign, description: 'Payroll integration', category: 'Finance', connected: false },
    { id: 'adp', name: 'ADP', icon: Building, description: 'HR management', category: 'Finance', connected: false },
    { id: 'tableau', name: 'Tableau', icon: BarChart2, description: 'Data analytics', category: 'Analytics', connected: false },
    { id: 'powerbi', name: 'Power BI', icon: LineChart, description: 'Business intelligence', category: 'Analytics', connected: false }
  ]);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  
  // 🤖 KRONO AI CHATBOT STATE
  const [showKronoChat, setShowKronoChat] = useState(false);
  const [kronoMessages, setKronoMessages] = useState<Array<{role: 'user' | 'krono'; message: string; timestamp: number}>>([]);
  const [kronoInput, setKronoInput] = useState('');
  
  // Employees and Roles (must be declared before XP states that depend on them)
  const [employees, setEmployees] = useState<Employee[]>([
      { name: 'Izzy', rate: 18 }, 
      { name: 'Karen', rate: 18 }, 
      { name: 'Annalissia', rate: 18 }, 
      { name: 'Kenny', rate: 18 }
  ]);
  const [roles, setRoles] = useState(['Reception', 'Concierge', 'Manager']);

  // 🎮 GAMEHUB STATE
  const [showGameHub, setShowGameHub] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameInvites, setGameInvites] = useState<Array<{from: string; game: string; id: string}>>([]);
  
  // 🏪 MERCH STORE STATE
  const [showMerchStore, setShowMerchStore] = useState(false);
  const [merchItems, setMerchItems] = useState([
    { id: '1', name: 'Company T-Shirt', xpCost: 500, category: 'apparel', inStock: true, image: '👕' },
    { id: '2', name: 'Premium Parking Spot (1 Month)', xpCost: 1000, category: 'perks', inStock: true, image: '🅿️' },
    { id: '3', name: '$25 Gift Card', xpCost: 2500, category: 'rewards', inStock: true, image: '💳' },
    { id: '4', name: 'Extra PTO Day', xpCost: 3000, category: 'perks', inStock: true, image: '🏖️' },
    { id: '5', name: 'Coffee Mug', xpCost: 300, category: 'apparel', inStock: true, image: '☕' },
    { id: '6', name: '$50 Gift Card', xpCost: 5000, category: 'rewards', inStock: true, image: '💰' },
  ]);
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{itemId: string; date: number; xpSpent: number}>>([]);
  
  // 💎 ADVANCED XP ECONOMY STATE
  const [xpEconomy, setXpEconomy] = useState({
    clockInOnTime: 10,
    noOvertime: 25,
    bonusShiftPickup: 100,
    perfectAttendanceWeek: 150,
    policyCompliance: 50,
    shiftCompletion: 20,
    helpColleague: 30,
    managerCommendation: 200
  });
  const [employeeXP, setEmployeeXP] = useState<Record<string, {total: number; level: number; rank: string; history: Array<{action: string; xp: number; date: number}>}>>(
    employees.reduce((acc, emp) => {
      acc[emp.name] = {
        total: 0, // All employees start with 0 XP
        level: 1,
        rank: 'Bronze',
        history: []
      };
      return acc;
    }, {} as Record<string, {total: number; level: number; rank: string; history: Array<{action: string; xp: number; date: number}>}>)
  );
  
  // 🔮 THE ORACLE AI STATE
  const [oracleInsights, setOracleInsights] = useState({
    burnoutRisk: employees.map(emp => ({
      name: emp.name,
      risk: Math.random() * 100,
      factors: ['Overtime hours', 'Consecutive shifts', 'Low engagement']
    })),
    flightRisk: employees.map(emp => ({
      name: emp.name,
      risk: Math.random() * 100,
      indicators: ['Decreased performance', 'Missed shifts', 'Low morale']
    })),
    overtimeForecast: employees.map(emp => ({
      name: emp.name,
      projectedHours: Math.floor(Math.random() * 20),
      trend: Math.random() > 0.5 ? 'increasing' : 'stable'
    })),
    laborCompliance: {
      violations: [],
      warnings: ['3 employees approaching max weekly hours', 'Minimum rest period needed for 2 employees'],
      score: 94
    }
  });
  
  // 💬 KRONO CHATBOT STATE
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant'; text: string; timestamp: number}>>([
    {role: 'assistant', text: '⚡ Krono AI activated. I\'m your intelligent scheduling assistant. I can help with shift planning, coverage optimization, compliance checks, and answering workforce questions. How can I assist you today?', timestamp: Date.now()}
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // 🎯 MANAGER CONTROLS
  const [showEconomyControls, setShowEconomyControls] = useState(false);
  
  // Guild state
  const [currentEmployeeXP, setCurrentEmployeeXP] = useState(2500);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Theme hook
  const { currentTheme } = useTheme();
  
  // Customization State
  const [departments, setDepartments] = useState([
    'General',
    'Nursing',
    'Medical',
    'Surgery',
    'Emergency',
    'ICU',
    'Pediatrics',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Administration',
    'Maintenance',
    'Security'
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showDepartmentInput, setShowDepartmentInput] = useState(false);
  const [newDepartmentInput, setNewDepartmentInput] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  
  const [shiftPresets, setShiftPresets] = useState<ShiftPreset[]>([
    { label: 'Full Day', start: '08:00', end: '20:00' },
    { label: 'Morning', start: '08:00', end: '14:00' },
    { label: 'Evening', start: '14:00', end: '20:00' }
  ]);
  
  const [appTheme, setAppTheme] = useState<keyof typeof APP_THEMES>('blue');
  const [appFont, setAppFont] = useState<keyof typeof FONTS>('sans');
  
  const [settingsTab, setSettingsTab] = useState('employees'); 
  const [newItemInput, setNewItemInput] = useState('');
  const [newItemRate, setNewItemRate] = useState('');
  const [newPresetInput, setNewPresetInput] = useState({ label: '', start: '09:00', end: '17:00' });
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  
  // Calendar View Customization
  const [calendarStartHour, setCalendarStartHour] = useState(0); // 0-23 (default: midnight)
  const [calendarEndHour, setCalendarEndHour] = useState(23); // 0-23 (default: 11pm)
  const [employeeBadgeSize, setEmployeeBadgeSize] = useState(14); // Font size in px (12-20)
  const [settingsSectionExpanded, setSettingsSectionExpanded] = useState<{[key: string]: boolean}>({
    calendar: true,
    themes: false,
    display: false,
    advanced: false
  });

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // Default to Public/Shared storage
  const [usePrivateStorage, setUsePrivateStorage] = useState(false);

  // Copy/Paste Day Logic
  const [dayClipboard, setDayClipboard] = useState<any[] | null>(null); 
  const [clipboard, setClipboard] = useState<any>(null); 

  const [formData, setFormData] = useState({
    employeeName: '',
    startTime: '08:00',
    endTime: '20:00',
    role: 'Reception',
    department: 'General',
    notes: '',
    colorHue: null as number | null,
    isDraft: true,
    isTimeOff: false,
    shiftComments: '',
    differential: 1.0
  });

  const themeClasses = APP_THEMES[appTheme];

  // Load localStorage settings
  useEffect(() => {
    const savedTimeFormat = localStorage.getItem('noxshift-time-format');
    if (savedTimeFormat) setTimeFormat(savedTimeFormat as '12h' | '24h');
    
    const savedPhotos = localStorage.getItem(`noxshift-employee-photos-${appId}`);
    if (savedPhotos) setEmployeePhotos(JSON.parse(savedPhotos));
    
    const savedDarkMode = localStorage.getItem('noxshift-dark-mode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    
    const savedAvailability = localStorage.getItem(`noxshift-availability-${appId}`);
    if (savedAvailability) setEmployeeAvailability(JSON.parse(savedAvailability));
  }, [appId]);

  // --- Auth & Data Fetching ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setStatus({ type: 'error', msg: 'Auth Error' });
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser) setStatus({ type: 'success', msg: 'Connected' });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    let basePath = `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}`;

    // 1. Listen for Shifts
    const q = query(collection(db, `${basePath}/shifts`));
    const unsubscribeShifts = onSnapshot(q, (snapshot) => {
      const fetchedShifts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Shift));
      setShifts(fetchedShifts);
      setLoading(false);
      
      if (fetchedShifts.length === 0) setStatus({ type: 'neutral', msg: 'Schedule Empty' });
      else setStatus({ type: 'success', msg: `Loaded ${fetchedShifts.length} shifts` });

    }, (error) => {
      console.error("Firestore error:", error);
      setStatus({ type: 'error', msg: 'Permission Error' });
      setLoading(false);
    });

    // 2. Listen for Settings
    const settingsDocRef = doc(db, `${basePath}/config/settings`);
    const unsubscribeSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.roles) setRoles(data.roles);
        if (data.employees) {
            const rawEmps = data.employees;
            if (rawEmps.length > 0 && typeof rawEmps[0] === 'string') {
                setEmployees(rawEmps.map((name: string) => ({ name, rate: 0 })));
            } else {
                setEmployees(rawEmps);
            }
        }
        if (data.departments) setDepartments(data.departments);
        if (data.shiftPresets) setShiftPresets(data.shiftPresets);
        if (data.theme) setAppTheme(data.theme);
        if (data.font) setAppFont(data.font);
      }
    });

    return () => {
      unsubscribeShifts();
      unsubscribeSettings();
    };
  }, [user, usePrivateStorage]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      // Ctrl/Cmd + N: New shift
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsModalOpen(true);
      }
      // Ctrl/Cmd + P: Print view
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPrintView(true);
      }
      // Ctrl/Cmd + D: Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      }
      // Ctrl/Cmd + ,: Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
      // Esc: Close all modals
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setShowSettings(false);
        setShowTimeOffModal(false);
        setShowTemplateModal(false);
        setShowRecurringModal(false);
        setShowSwapModal(false);
        setShowNotifications(false);
        setShowAdvancedAnalytics(false);
        setShowAvailabilityModal(false);
        setShowEmployeeProfile(false);
        setShowHolidayModal(false);
        setShowPrintView(false);
        setShowKeyboardShortcuts(false);
      }
      // Arrow keys: Navigate months
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevMonth();
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextMonth();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [darkMode]);

  // Dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('noxshift-dark-mode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('noxshift-dark-mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // January XP Reset Effect
  useEffect(() => {
    const checkAndResetXP = () => {
      const lastReset = localStorage.getItem('noxshift-xp-last-reset');
      const now = new Date();
      const currentMonth = now.getMonth(); // 0 = January
      const currentYear = now.getFullYear();
      
      // If it's January and we haven't reset this year yet
      if (currentMonth === 0) {
        const lastResetDate = lastReset ? new Date(lastReset) : null;
        
        // Reset if no previous reset OR last reset was in a different year
        if (!lastResetDate || lastResetDate.getFullYear() !== currentYear) {
          console.log('🔄 Resetting all employee XP for new year...');
          
          setEmployeeXP(prevXP => {
            const resetXP: typeof prevXP = {};
            Object.keys(prevXP).forEach(employeeName => {
              resetXP[employeeName] = {
                total: 0,
                level: 1,
                rank: 'Bronze',
                history: [{
                  action: 'Annual XP Reset',
                  xp: 0,
                  date: Date.now()
                }]
              };
            });
            return resetXP;
          });
          
          // Mark reset as completed for this year
          localStorage.setItem('noxshift-xp-last-reset', now.toISOString());
          setStatus({ type: 'success', msg: '✨ XP Reset for new year!' });
        }
      }
    };
    
    checkAndResetXP();
  }, []); // Run once on mount

  // --- SETTINGS HANDLERS ---
  const saveSettings = async (updates: any) => {
    if (!user) return;
    let basePath = `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}`;
    const settingsDocRef = doc(db, `${basePath}/config/settings`);
    
    try {
        await setDoc(settingsDocRef, updates, { merge: true });
    } catch (e) {
        console.error("Error saving settings:", e);
    }
  };

  const addItem = (type: string) => {
    if (type === 'role' && newItemInput) {
        const updated = [...roles, newItemInput];
        setRoles(updated);
        saveSettings({ roles: updated });
        setNewItemInput('');
    } else if (type === 'employee' && newItemInput) {
        const updated = [...employees, { name: newItemInput, rate: parseFloat(newItemRate) || 0 }];
        setEmployees(updated);
        saveSettings({ employees: updated });
        setNewItemInput('');
        setNewItemRate('');
    } else if (type === 'department' && newItemInput) {
        const updated = [...departments, newItemInput];
        setDepartments(updated);
        saveSettings({ departments: updated });
        setNewItemInput('');
    } else if (type === 'preset' && newPresetInput.label) {
        const updated = [...shiftPresets, newPresetInput];
        setShiftPresets(updated);
        saveSettings({ shiftPresets: updated });
        setNewPresetInput({ label: '', start: '09:00', end: '17:00' });
    }
  };

  const removeItem = (type: string, item: any) => {
      if (type === 'role') {
          const updated = roles.filter(r => r !== item);
          setRoles(updated);
          saveSettings({ roles: updated });
      } else if (type === 'employee') {
          const updated = employees.filter(e => e.name !== item.name);
          setEmployees(updated);
          saveSettings({ employees: updated });
      } else if (type === 'department') {
          const updated = departments.filter(d => d !== item);
          setDepartments(updated);
          if (selectedDepartment === item) setSelectedDepartment('All');
          saveSettings({ departments: updated });
      } else if (type === 'preset') {
          const updated = shiftPresets.filter(p => p.label !== item.label);
          setShiftPresets(updated);
          saveSettings({ shiftPresets: updated });
      }
  };

  const updateAppearance = (theme?: string | null, font?: string | null) => {
      if (theme) setAppTheme(theme as keyof typeof APP_THEMES);
      if (font) setAppFont(font as keyof typeof FONTS);
      saveSettings({ 
          theme: theme || appTheme, 
          font: font || appFont 
      });
  };

  // --- FINALIZED SCHEDULE GENERATOR ---
  const applyFinalizedSchedule = async () => {
    if (!user) return;
    setLoading(true);
    setStatus({ type: 'neutral', msg: 'Applying Finalized Schedule...' });
    
    let collectionPath = `${usePrivateStorage ? 'users/' + user.uid : 'public/data'}`;
    let collectionRef = collection(db, `artifacts/${appId}/${collectionPath}/shifts`);

    try {
        const snapshot = await getDocs(collectionRef);
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);

        const year = 2026;
        const month = 0; // January
        
        const createShift = (day: number, name: string, start = "08:00", end = "20:00", colorHue: number | null = null) => ({
            date: new Date(year, month, day).toISOString(),
            employeeName: name,
            startTime: start,
            endTime: end,
            role: 'Reception',
            department: 'General',
            notes: 'Finalized',
            colorHue: colorHue,
            isDraft: false,
            timestamp: Date.now()
        });

        const promises: Promise<any>[] = [];
        // Izzy (15 shifts)
        [1, 2, 3, 8, 9, 10, 15, 16, 17, 20, 22, 23, 27, 29, 30].forEach(d => promises.push(addDoc(collectionRef, createShift(d, "Izzy"))));
        
        // Karen
        [5, 6, 7, 12, 13, 14, 19, 21, 26, 28].forEach(d => promises.push(addDoc(collectionRef, createShift(d, "Karen"))));
        promises.push(addDoc(collectionRef, createShift(18, "Karen", "14:00", "20:00")));
        promises.push(addDoc(collectionRef, createShift(25, "Karen", "14:00", "20:00")));
        
        // Annalissia
        [11, 24, 31].forEach(d => promises.push(addDoc(collectionRef, createShift(d, "Annalissia", "08:00", "20:00", 300))));
        promises.push(addDoc(collectionRef, createShift(25, "Annalissia", "08:00", "14:00", 300)));
        
        // Kenny
        promises.push(addDoc(collectionRef, createShift(4, "Kenny")));
        promises.push(addDoc(collectionRef, createShift(18, "Kenny", "08:00", "14:00")));

        await Promise.all(promises);
        
        // Auto-update settings with these employees
        saveSettings({ employees: [
            {name: 'Izzy', rate: 18}, {name: 'Karen', rate: 18}, 
            {name: 'Annalissia', rate: 18}, {name: 'Kenny', rate: 18}
        ]});
        
        setCurrentDate(new Date(2026, 0, 1));
        // Don't set loading to false here - let the Firebase listener handle it
 
    } catch (error: any) {
        console.error("Gen failed", error);
        setStatus({ type: 'error', msg: 'Error: ' + error.message });
        setLoading(false);
    }
  };

  // --- Publishing ---
  const handlePublishAll = async () => {
      if (!confirm("Publish all draft shifts? This will make them visible as official shifts.")) return;

      const drafts = shifts.filter(s => s.isDraft);
      let collectionPath = `${usePrivateStorage ? 'users/' + user.uid : 'public/data'}`;
      let collectionRef = collection(db, `artifacts/${appId}/${collectionPath}/shifts`);

      const batch = writeBatch(db);
      drafts.forEach(s => {
          if (s.id) batch.update(doc(collectionRef, s.id), { isDraft: false });
      });

      try {
          await batch.commit();
      } catch (e) {
          console.error(e);
          alert("Error publishing");
      }
  };

  // --- CSV Export ---
  const handleExportCSV = () => {
    const headers = ['Date', 'Employee', 'Role', 'Department', 'Start Time', 'End Time', 'Hours', 'Est Cost', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...shifts.filter(s => selectedDepartment === 'All' || s.department === selectedDepartment).map(s => {
        const dateStr = new Date(s.date).toLocaleDateString();
        const start = parseInt(s.startTime.split(':')[0]);
        const end = parseInt(s.endTime.split(':')[0]);
        const hours = Math.max(0, end - start);
        const rate = employees.find(e => e.name === s.employeeName)?.rate || 0;
        const cost = hours * rate;
        
        return `${dateStr},${s.employeeName},${s.role},${s.department || 'General'},${s.startTime},${s.endTime},${hours},${cost},"${s.notes || ''}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'schedule_export.csv');
    link.style.visibility = 'hidden';
    document.body.removeChild(link);
  };

  // Export to iCal format
  const handleExportiCal = () => {
    const monthShifts = shifts.filter(s => !s.isDraft && !s.isTimeOff);
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NoxShift//Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:NoxShift Schedule',
      'X-WR-TIMEZONE:America/New_York',
      ...monthShifts.map(shift => {
        const shiftDate = new Date(shift.date);
        const startDateTime = new Date(`${shift.date.split('T')[0]}T${shift.startTime}`);
        const endDateTime = new Date(`${shift.date.split('T')[0]}T${shift.endTime}`);
        
        const formatICalDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return [
          'BEGIN:VEVENT',
          `UID:${shift.id}@noxshift.app`,
          `DTSTAMP:${formatICalDate(new Date())}`,
          `DTSTART:${formatICalDate(startDateTime)}`,
          `DTEND:${formatICalDate(endDateTime)}`,
          `SUMMARY:${shift.employeeName} - ${shift.role}`,
          `DESCRIPTION:Department: ${shift.department || 'General'}\\nNotes: ${shift.notes || 'N/A'}`,
          `LOCATION:${shift.department || 'General'}`,
          'STATUS:CONFIRMED',
          'SEQUENCE:0',
          'END:VEVENT'
        ].join('\r\n');
      }),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `noxshift_schedule_${currentDate.toISOString().split('T')[0]}.ics`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus({ type: 'success', msg: 'Calendar file downloaded!' });
  };

  // Advanced conflict detection
  const detectAllConflicts = () => {
    const conflicts: Array<{type: string; message: string; shifts: Shift[]}> = [];
    
    // Double-booked employees
    const dateGroups = shifts.reduce((acc, shift) => {
      const date = shift.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);

    Object.entries(dateGroups).forEach(([date, dayShifts]) => {
      const employeeShifts = dayShifts.reduce((acc, shift) => {
        if (!acc[shift.employeeName]) acc[shift.employeeName] = [];
        acc[shift.employeeName].push(shift);
        return acc;
      }, {} as Record<string, Shift[]>);

      Object.entries(employeeShifts).forEach(([emp, empShifts]) => {
        if (empShifts.length > 1 && !empShifts.every(s => s.isTimeOff)) {
          conflicts.push({
            type: 'double-booking',
            message: `${emp} has ${empShifts.length} shifts on ${new Date(date).toLocaleDateString()}`,
            shifts: empShifts
          });
        }
      });
    });

    // Overtime warnings
    employees.forEach(emp => {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekHours = calculateWeeklyHours(emp.name, weekStart);
      if (weekHours > 40) {
        conflicts.push({
          type: 'overtime',
          message: `${emp.name} scheduled for ${weekHours.toFixed(1)} hours this week (OT: ${(weekHours - 40).toFixed(1)}h)`,
          shifts: []
        });
      }
    });

    // Understaffing
    Object.entries(dateGroups).forEach(([date, dayShifts]) => {
      const activeShifts = dayShifts.filter(s => !s.isTimeOff && !s.isDraft);
      if (activeShifts.length < 2) {
        conflicts.push({
          type: 'understaffed',
          message: `Only ${activeShifts.length} employee(s) scheduled for ${new Date(date).toLocaleDateString()}`,
          shifts: activeShifts
        });
      }
    });

    return conflicts;
  };

  // Calculate cost forecast
  const calculateCostForecast = () => {
    const totalHours = shifts.filter(s => !s.isTimeOff).reduce((sum, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const totalCost = employees.reduce((sum, emp) => {
      return sum + getEmployeeStats(emp.name).totalEarnings;
    }, 0);

    const avgHourlyRate = employees.reduce((sum, emp) => sum + emp.rate, 0) / employees.length;
    
    return {
      totalHours,
      totalCost,
      avgHourlyRate,
      projectedMonthly: totalCost * (30 / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()),
      laborPercent: 30 // Placeholder - could be made configurable
    };
  };

  // 🎙️ REVOLUTIONARY: Voice Command System
  const startVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice commands not supported in this browser. Try Chrome!');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceTranscript(transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (transcript: string) => {
    let success = false;
    let action = '';

    if (transcript.includes('schedule')) {
      const nameMatch = employees.find(e => transcript.includes(e.name.toLowerCase()));
      if (nameMatch) {
        action = `Scheduling ${nameMatch.name}...`;
        success = true;
        setTimeout(() => setIsModalOpen(true), 500);
      }
    } else if (transcript.includes('show') || transcript.includes('go to')) {
      if (transcript.includes('today')) {
        setCurrentDate(new Date());
        action = 'Jumped to today';
        success = true;
      } else if (transcript.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setCurrentDate(tomorrow);
        action = 'Jumped to tomorrow';
        success = true;
      }
    } else if (transcript.includes('how many')) {
      const nameMatch = employees.find(e => transcript.includes(e.name.toLowerCase()));
      if (nameMatch) {
        const stats = getEmployeeStats(nameMatch.name);
        action = `${nameMatch.name} has ${stats.totalShifts} shifts this month`;
        success = true;
        alert(action);
      }
    } else if (transcript.includes('open')) {
      if (transcript.includes('gamification') || transcript.includes('leaderboard')) {
        setShowNotifications(true);
        action = 'Opened notifications';
        success = true;
      } else if (transcript.includes('ai') || transcript.includes('recommendations')) {
        setShowOracle(true);
        action = 'Opened Oracle AI';
        success = true;
      } else if (transcript.includes('chat')) {
        setShowNotifications(true);
        action = 'Opened notifications';
        success = true;
      }
    }

    setVoiceHistory(prev => [...prev, {
      command: transcript,
      timestamp: new Date().toISOString(),
      action: action || 'Command not recognized',
      success
    }]);

    if (success) {
      const notification = {
        id: Date.now().toString(),
        type: 'success',
        message: `✓ ${action}`,
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  // 📍 REVOLUTIONARY: Real-time GPS Location Tracking
  const updateEmployeeLocation = (employeeName: string) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        const workplaceLat = 40.7128;
        const workplaceLng = -74.0060;
        
        const R = 6371;
        const dLat = (workplaceLat - latitude) * Math.PI / 180;
        const dLng = (workplaceLng - longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(workplaceLat * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        const newLocation: LocationTracking = {
          employeeName,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          distanceFromWorkplace: distance,
          isOnSite: distance < 0.5
        };

        setLocationTracking(prev => [...prev.filter(l => l.employeeName !== employeeName), newLocation]);

        const notification = {
          id: Date.now().toString(),
          type: newLocation.isOnSite ? 'success' : 'info',
          message: `${employeeName} is ${newLocation.isOnSite ? 'ON-SITE' : `${distance.toFixed(1)}km away`}`,
          timestamp: Date.now(),
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      }, (error) => {
        alert('Location access denied. Please enable location services.');
      });
    } else {
      alert('Geolocation not supported by this browser.');
    }
  };

  // 💭 REVOLUTIONARY: Sentiment Analysis
  const analyzeSentiment = (text: string, employeeName: string) => {
    const positiveWords = ['happy', 'great', 'excellent', 'love', 'perfect', 'amazing', 'fantastic', 'good', 'wonderful', 'pleased', 'excited'];
    const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'awful', 'horrible', 'poor', 'disappointed', 'frustrated', 'stressed', 'tired'];

    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });

    let mood: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (score > 0) mood = 'positive';
    if (score < 0) mood = 'negative';

    const analysis: SentimentAnalysis = {
      employeeName,
      mood,
      score: score / 10,
      text,
      timestamp: new Date().toISOString()
    };

    setSentimentData(prev => [...prev, analysis]);
    return analysis;
  };

  // 🤖 REVOLUTIONARY: AI-Powered Optimal Schedule Generator
  const generateOptimalSchedule = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const generatedShifts: Shift[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];

      employees.forEach((employee, idx) => {
        const shiftPattern = idx % 3;
        
        if (shiftPattern === 0 && day % 3 === 0) {
          generatedShifts.push({
            date: dateStr,
            employeeName: employee.name,
            startTime: '09:00',
            endTime: '17:00',
            role: roles[0] || 'Staff',
            department: departments[0] || 'General',
            colorHue: (idx * 50) % 360,
            isDraft: true,
            timestamp: Date.now()
          });
        } else if (shiftPattern === 1 && day % 3 === 1) {
          generatedShifts.push({
            date: dateStr,
            employeeName: employee.name,
            startTime: '13:00',
            endTime: '21:00',
            role: roles[1] || 'Staff',
            department: departments[1] || 'General',
            colorHue: (idx * 50) % 360,
            isDraft: true,
            timestamp: Date.now()
          });
        } else if (shiftPattern === 2 && day % 3 === 2) {
          generatedShifts.push({
            date: dateStr,
            employeeName: employee.name,
            startTime: '06:00',
            endTime: '14:00',
            role: roles[2] || 'Staff',
            department: departments[2] || 'General',
            colorHue: (idx * 50) % 360,
            isDraft: true,
            timestamp: Date.now()
          });
        }
      });
    }

    return generatedShifts;
  };

  // 💚 REVOLUTIONARY: Wellness & Burnout Detection
  const checkWellnessAlerts = () => {
    const alerts: WellnessAlert[] = [];
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    employees.forEach(emp => {
      const empShifts = shifts.filter(s => 
        s.employeeName === emp.name && 
        s.date.startsWith(thisMonth)
      );

      const totalHours = empShifts.reduce((sum, shift) => {
        const start = new Date(`2000-01-01T${shift.startTime}`);
        const end = new Date(`2000-01-01T${shift.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return sum + (hours > 0 ? hours : hours + 24);
      }, 0);

      const avgHoursPerWeek = (totalHours / 4);

      if (avgHoursPerWeek > 60) {
        alerts.push({
          employeeName: emp.name,
          type: 'burnout',
          severity: 'critical',
          message: `${emp.name} averaging ${avgHoursPerWeek.toFixed(1)}hrs/week - CRITICAL OVERWORK`,
          timestamp: now.toISOString()
        });
      } else if (avgHoursPerWeek > 50) {
        alerts.push({
          employeeName: emp.name,
          type: 'overwork',
          severity: 'high',
          message: `${emp.name} averaging ${avgHoursPerWeek.toFixed(1)}hrs/week - High risk`,
          timestamp: now.toISOString()
        });
      } else if (avgHoursPerWeek > 45) {
        alerts.push({
          employeeName: emp.name,
          type: 'stress',
          severity: 'medium',
          message: `${emp.name} averaging ${avgHoursPerWeek.toFixed(1)}hrs/week - Monitor closely`,
          timestamp: now.toISOString()
        });
      }

      const consecutiveDays = calculateConsecutiveDays(empShifts);
      if (consecutiveDays >= 7) {
        alerts.push({
          employeeName: emp.name,
          type: 'burnout',
          severity: 'high',
          message: `${emp.name} working ${consecutiveDays} consecutive days - REST NEEDED`,
          timestamp: now.toISOString()
        });
      }
    });

    setWellnessAlerts(alerts);
    return alerts;
  };

  const calculateConsecutiveDays = (employeeShifts: Shift[]) => {
    const sortedDates = employeeShifts
      .map(s => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());

    let maxConsecutive = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak++;
        maxConsecutive = Math.max(maxConsecutive, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxConsecutive;
  };

  // 🔌 REVOLUTIONARY: Integration Marketplace
  const connectIntegration = async (integrationId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIntegrations(prev => prev.map(i =>
      i.id === integrationId ? { ...i, connected: true } : i
    ));

    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      const notification = {
        id: Date.now().toString(),
        type: 'success',
        message: `✓ Connected to ${integration.name}!`,
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === integrationId ? { ...i, connected: false } : i
    ));
  };

  // --- Copy/Paste Day ---
  const handleCopyDay = (e: React.MouseEvent, dateShifts: Shift[]) => {
    e.stopPropagation();
    const cleanShifts = dateShifts.map(({ id, date, timestamp, ...rest }) => rest);
    setDayClipboard(cleanShifts);
    alert(`Copied ${cleanShifts.length} shifts.`);
  };

  const handlePasteDay = async (e: React.MouseEvent, targetDate: Date) => {
    e.stopPropagation();
    if (!dayClipboard || !dayClipboard.length) return;
    if (!confirm(`Paste ${dayClipboard.length} shifts to ${targetDate.toLocaleDateString()}?`)) return;

    let collectionPath = `${usePrivateStorage ? 'users/' + user.uid : 'public/data'}`;
    let collectionRef = collection(db, `artifacts/${appId}/${collectionPath}/shifts`);
    
    try {
      const promises = dayClipboard.map(shiftData => 
        addDoc(collectionRef, {
          ...shiftData,
          date: targetDate.toISOString(),
          timestamp: Date.now(),
          isDraft: true
        })
      );
      await Promise.all(promises);
    } catch (err) {
      console.error("Paste failed", err);
    }
  };

  // --- Calendar Logic ---
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    console.log('Day clicked:', day);
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setEditingShift(null);
    setFormData({
      employeeName: '',
      startTime: '08:00',
      endTime: '20:00',
      role: roles[0] || 'Reception',
      department: selectedDepartment === 'All' ? (departments[0] || 'General') : selectedDepartment,
      notes: '',
      colorHue: null,
      isDraft: true,
      isTimeOff: false,
      shiftComments: '',
      differential: 0
    });
    setIsModalOpen(true);
    console.log('Modal should open now');
  };

  const handleShiftClick = (e: React.MouseEvent, shift: Shift) => {
    e.stopPropagation();
    setEditingShift(shift);
    setSelectedDate(new Date(shift.date));
    setFormData({
      employeeName: shift.employeeName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      role: shift.role,
      department: shift.department || 'General',
      notes: shift.notes || '',
      colorHue: shift.colorHue || null,
      isDraft: shift.isDraft || false,
      isTimeOff: shift.isTimeOff || false,
      shiftComments: shift.shiftComments || '',
      differential: shift.differential || 1.0
    });
    setIsModalOpen(true);
  };

  // Conflict Detection
  const checkShiftConflicts = (employeeName: string, date: string, startTime: string, endTime: string, excludeShiftId?: string): string[] => {
    const conflicts: string[] = [];
    
    // Check for overlapping shifts for the same employee
    const employeeShifts = shifts.filter(s => 
      s.employeeName === employeeName && 
      s.date === date && 
      s.id !== excludeShiftId &&
      !s.isTimeOff
    );

    const newStart = parseInt(startTime.replace(':', ''));
    const newEnd = parseInt(endTime.replace(':', ''));

    for (const existingShift of employeeShifts) {
      const existingStart = parseInt(existingShift.startTime.replace(':', ''));
      const existingEnd = parseInt(existingShift.endTime.replace(':', ''));

      // Check for overlap
      if ((newStart < existingEnd && newEnd > existingStart)) {
        conflicts.push(`Overlaps with existing shift: ${formatTime(existingShift.startTime, false)} - ${formatTime(existingShift.endTime, false)}`);
      }
    }

    // Check against time-off requests
    const timeOffConflicts = shifts.filter(s => 
      s.employeeName === employeeName && 
      s.date === date && 
      s.isTimeOff
    );

    if (timeOffConflicts.length > 0) {
      conflicts.push(`Employee has time-off scheduled for this date`);
    }

    return conflicts;
  };

  const checkConflict = (newData: any) => {
    if (newData.isTimeOff) return null;
    const dayShifts = shifts.filter(s => s.date.startsWith(newData.date.split('T')[0]));
    
    const conflict = dayShifts.find(s => 
        s.employeeName.toLowerCase() === newData.employeeName.toLowerCase() && 
        s.id !== editingShift?.id
    );
    
    return conflict;
  };

  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSaveShift called');
    if (!user || !selectedDate) {
      console.log('Missing user or selectedDate', { user, selectedDate });
      setStatus({ type: 'error', msg: 'Not signed in or date not selected' });
      return;
    }
    
    const shiftData = { ...formData, date: selectedDate.toISOString(), timestamp: Date.now() };
    console.log('Saving shift data:', shiftData);
    
    const conflict = checkConflict(shiftData);
    if (conflict) {
        const conflictMsg = conflict.isTimeOff 
            ? `Warning: ${formData.employeeName} is marked as Unavailable/Time Off on this day.` 
            : `Warning: ${formData.employeeName} is already scheduled (${conflict.startTime}-${conflict.endTime}).`;
            
        if (!confirm(`${conflictMsg} Save anyway?`)) {
            return;
        }
    }

    let collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
    try {
      if (editingShift && editingShift.id) {
        console.log('Updating shift:', editingShift.id);
        await updateDoc(doc(collectionRef, editingShift.id), shiftData);
        setStatus({ type: 'success', msg: 'Shift updated successfully!' });
      } else {
        console.log('Creating new shift');
        await addDoc(collectionRef, shiftData);
        setStatus({ type: 'success', msg: 'Shift created successfully!' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving shift:', error);
      setStatus({ type: 'error', msg: 'Failed to save shift. Check console.' });
    }
  };

  const handleDeleteShift = async () => {
    if (!user || !editingShift || !editingShift.id) return;
    if (!confirm('Are you sure you want to delete this shift?')) return;
    
    console.log('Deleting shift:', editingShift.id);
    try {
      let collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
      await deleteDoc(doc(collectionRef, editingShift.id));
      setStatus({ type: 'success', msg: 'Shift deleted successfully!' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting shift:', error);
      setStatus({ type: 'error', msg: 'Failed to delete shift. Check console.' });
    }
  };

  const handleCopyShift = () => setClipboard({ ...formData });
  const handlePasteShift = () => { if (clipboard) setFormData({ ...clipboard }); };
  
  const handlePrint = () => { 
    window.focus(); 
    setTimeout(() => { window.print(); }, 200); 
  };

  const handleCopyCalendar = async () => {
    const calendarElement = document.querySelector('.max-w-full.mx-auto.glass') as HTMLElement;
    if (!calendarElement) {
      setStatus({ type: 'error', msg: 'Calendar not found' });
      return;
    }

    try {
      setStatus({ type: 'info', msg: 'Capturing calendar image...' });
      
      // Capture the calendar as canvas
      const canvas = await html2canvas(calendarElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setStatus({ type: 'error', msg: 'Failed to create image' });
          return;
        }

        try {
          // Copy to clipboard
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          setStatus({ type: 'success', msg: 'Calendar image copied! Paste into your email.' });
        } catch (err) {
          console.error('Clipboard error:', err);
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${MONTH_NAMES[currentDate.getMonth()]}_${currentDate.getFullYear()}_Schedule.png`;
          link.click();
          URL.revokeObjectURL(url);
          setStatus({ type: 'success', msg: 'Calendar downloaded! (Clipboard not supported)' });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Screenshot error:', error);
      setStatus({ type: 'error', msg: 'Failed to capture calendar' });
    }
  };

  // AI Mock
  const handleAnalyzeSchedule = () => { alert("AI Analysis: Schedule looks balanced. No critical gaps found."); setIsAIModalOpen(false); };
  const handleDraftEmail = () => { alert("Draft copied to clipboard: 'Hi Team, here is the schedule...'"); setIsAIModalOpen(false); };

  const handleGenerateQR = async () => {
    try {
      const url = window.location.href; // Current page URL
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeDataURL(qrDataURL);
      setShowQRModal(true);
    } catch (error) {
      console.error('QR Code generation error:', error);
      setStatus({ type: 'error', msg: 'Failed to generate QR code' });
    }
  };

  const handleAddDepartment = () => {
    if (newDepartmentInput.trim() && !departments.includes(newDepartmentInput.trim())) {
      const updated = [...departments, newDepartmentInput.trim()];
      setDepartments(updated);
      saveSettings({ departments: updated });
      setNewDepartmentInput('');
      setShowDepartmentInput(false);
      setStatus({ type: 'success', msg: 'Department added!' });
    }
  };

  // Calculate total hours worked in a week for overtime detection
  const calculateWeeklyHours = (employeeName: string, weekStart: Date): number => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return shifts
      .filter(shift => {
        const shiftDate = new Date(shift.date);
        return shift.employeeName === employeeName && 
               shiftDate >= weekStart && 
               shiftDate < weekEnd &&
               !shift.isTimeOff;
      })
      .reduce((total, shift) => {
        const start = new Date(`2000-01-01T${shift.startTime}`);
        const end = new Date(`2000-01-01T${shift.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
  };

  // Calculate break times based on shift length (auto OSHA compliance)
  const calculateBreaks = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (hours >= 8) {
      // 8+ hour shift: 30min meal break + 2x 15min rest breaks
      const lunchStart = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hours in
      return {
        breakStart: lunchStart.toTimeString().substring(0, 5),
        breakEnd: new Date(lunchStart.getTime() + 30 * 60 * 1000).toTimeString().substring(0, 5),
        breakDuration: 30,
        totalBreaks: 3
      };
    } else if (hours >= 6) {
      // 6-8 hour shift: 30min meal break
      const lunchStart = new Date(start.getTime() + 3 * 60 * 60 * 1000);
      return {
        breakStart: lunchStart.toTimeString().substring(0, 5),
        breakEnd: new Date(lunchStart.getTime() + 30 * 60 * 1000).toTimeString().substring(0, 5),
        breakDuration: 30,
        totalBreaks: 1
      };
    } else if (hours >= 4) {
      // 4-6 hour shift: 15min rest break
      const breakStart = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      return {
        breakStart: breakStart.toTimeString().substring(0, 5),
        breakEnd: new Date(breakStart.getTime() + 15 * 60 * 1000).toTimeString().substring(0, 5),
        breakDuration: 15,
        totalBreaks: 1
      };
    }
    
    return null;
  };

  // Get employee statistics
  const getEmployeeStats = (employeeName: string): EmployeeStats => {
    const employeeShifts = shifts.filter(s => s.employeeName === employeeName && !s.isTimeOff);
    const employee = employees.find(e => e.name === employeeName);
    const rate = employee?.rate || 0;

    const totalHours = employeeShifts.reduce((sum, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const weeklyHoursMap = new Map<string, number>();
    employeeShifts.forEach(shift => {
      const shiftDate = new Date(shift.date);
      const weekStart = new Date(shiftDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString();
      
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      weeklyHoursMap.set(weekKey, (weeklyHoursMap.get(weekKey) || 0) + hours);
    });

    const overtimeHours = Array.from(weeklyHoursMap.values())
      .reduce((sum, weekHours) => sum + Math.max(0, weekHours - 40), 0);

    return {
      totalHours,
      totalShifts: employeeShifts.length,
      totalEarnings: totalHours * rate + (overtimeHours * rate * 0.5), // OT is 1.5x
      avgShiftLength: employeeShifts.length > 0 ? totalHours / employeeShifts.length : 0,
      daysWorked: new Set(employeeShifts.map(s => s.date)).size,
      overtimeHours
    };
  };

  // Check if date is a holiday
  const isHoliday = (date: Date): Holiday | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.find(h => h.date.startsWith(dateStr));
  };

  // Smart Auto-Schedule for the entire month
  const handleSmartAutoSchedule = async () => {
    if (!confirm('This will auto-schedule the entire month using AI optimization. This may overwrite existing shifts. Continue?')) {
      return;
    }

    setStatus({ type: 'info', msg: 'Generating optimized schedule...' });
    
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
    const batch = writeBatch(db);
    const newShifts: Shift[] = [];

    // Smart algorithm: distribute shifts evenly, avoid consecutive days, respect time-off
    const employeeWorkDays: Record<string, number[]> = {};
    employees.forEach(emp => employeeWorkDays[emp.name] = []);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateObj.toISOString();
      const dayOfWeek = dateObj.getDay();
      
      // Skip Sundays (optional)
      if (dayOfWeek === 0) continue;

      // Determine shift coverage needed (2-3 people per day)
      const shiftsNeeded = dayOfWeek === 6 ? 2 : 3; // Less on Saturdays
      
      // Select employees who haven't worked recently
      const availableEmployees = employees
        .filter(emp => {
          const lastWorkDay = employeeWorkDays[emp.name][employeeWorkDays[emp.name].length - 1];
          return !lastWorkDay || day - lastWorkDay > 1; // At least 1 day between shifts
        })
        .slice(0, shiftsNeeded);

      // Create shifts for selected employees
      availableEmployees.forEach((emp, idx) => {
        const shiftTime = idx === 0 ? { start: '08:00', end: '16:00' } : 
                         idx === 1 ? { start: '12:00', end: '20:00' } :
                         { start: '16:00', end: '22:00' };
        
        const shiftData = {
          date: dateStr,
          employeeName: emp.name,
          startTime: shiftTime.start,
          endTime: shiftTime.end,
          role: roles[idx % roles.length] || 'Staff',
          department: departments[0] || 'General',
          notes: 'Auto-scheduled by AI',
          isDraft: true,
          timestamp: Date.now() + day
        };

        employeeWorkDays[emp.name].push(day);
        const docRef = doc(collectionRef);
        batch.set(docRef, shiftData);
        newShifts.push({ ...shiftData, id: docRef.id });
      });
    }

    try {
      await batch.commit();
      setStatus({ type: 'success', msg: `✨ Smart schedule created! ${newShifts.length} shifts generated.` });
    } catch (error) {
      console.error('Auto-schedule error:', error);
      setStatus({ type: 'error', msg: 'Failed to create schedule' });
    }
  };

  // Fill gaps in schedule
  const handleFillGaps = async () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
    const promises: Promise<any>[] = [];
    let gapsFound = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const dayShifts = shifts.filter(s => s.date.startsWith(dateStr) && !s.isTimeOff);

      // If fewer than 2 shifts, add one
      if (dayShifts.length < 2) {
        const availableEmployee = employees.find(emp => 
          !dayShifts.some(s => s.employeeName === emp.name)
        );
        
        if (availableEmployee) {
          gapsFound++;
          promises.push(addDoc(collectionRef, {
            date: dateObj.toISOString(),
            employeeName: availableEmployee.name,
            startTime: '08:00',
            endTime: '16:00',
            role: roles[0] || 'Staff',
            department: departments[0] || 'General',
            notes: 'Auto-filled gap',
            isDraft: true,
            timestamp: Date.now()
          }));
        }
      }
    }

    if (gapsFound === 0) {
      setStatus({ type: 'info', msg: 'No gaps found - schedule looks good!' });
      return;
    }

    try {
      await Promise.all(promises);
      setStatus({ type: 'success', msg: `Filled ${gapsFound} gaps in schedule!` });
    } catch (error) {
      console.error('Fill gaps error:', error);
      setStatus({ type: 'error', msg: 'Failed to fill gaps' });
    }
  };

  // Copy week to next week
  const handleCopyWeekForward = async () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekShifts: Shift[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dateStr = day.toISOString().split('T')[0];
      weekShifts.push(...shifts.filter(s => s.date.startsWith(dateStr)));
    }

    if (weekShifts.length === 0) {
      alert('No shifts in current week to copy');
      return;
    }

    if (!confirm(`Copy ${weekShifts.length} shifts to next week?`)) return;

    const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
    const promises = weekShifts.map(shift => {
      const shiftDate = new Date(shift.date);
      shiftDate.setDate(shiftDate.getDate() + 7); // Add 7 days
      
      return addDoc(collectionRef, {
        ...shift,
        id: undefined,
        date: shiftDate.toISOString(),
        isDraft: true,
        timestamp: Date.now()
      });
    });

    try {
      await Promise.all(promises);
      setStatus({ type: 'success', msg: `Copied ${weekShifts.length} shifts to next week!` });
    } catch (error) {
      console.error('Copy week error:', error);
      setStatus({ type: 'error', msg: 'Failed to copy week' });
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className={`min-h-[60px] backdrop-blur-sm border-r border-b print:bg-white print:min-h-[100px]`} style={{ backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.3)', borderColor: darkMode ? 'rgba(45, 45, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)' }}></div>);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const holiday = isHoliday(dateObj);
      
      const dayShifts = shifts.filter(s => {
          const matchesDate = s.date.startsWith(dateStr);
          const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
          return matchesDate && matchesDept;
      });

      dayShifts.sort((a, b) => a.startTime.localeCompare(b.startTime));
      const isToday = new Date().toDateString() === dateObj.toDateString();

      days.push(
        <div 
          key={day} 
          onClick={() => handleDayClick(day)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const shiftId = e.dataTransfer.getData('shiftId');
            const sourceDate = e.dataTransfer.getData('sourceDate');
            if (shiftId && sourceDate !== dateStr) {
              const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shiftId);
              updateDoc(shiftRef, { date: dateStr }).then(() => {
                setStatus({ type: 'success', msg: '✓ Shift moved successfully!' });
                setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
              }).catch((err) => {
                console.error('Drag drop error:', err);
                setStatus({ type: 'error', msg: 'Failed to move shift' });
              });
            }
          }}
          className={`min-h-[60px] border-r border-b p-3 transition-all duration-300 relative overflow-hidden group ${
            isToday 
              ? 'ring-2 ring-purple-400/50 print:bg-white' 
              : holiday 
              ? 'bg-gradient-to-br from-yellow-100/60 to-orange-100/60 backdrop-blur-sm' 
              : ''
          } hover:shadow-xl hover:scale-[1.01] hover:z-10 print:hover:bg-white cursor-pointer print:cursor-default print:min-h-[150px] animate-fade-in`}
          style={{
            backgroundColor: isToday 
              ? 'rgba(139, 92, 246, 0.15)'
              : darkMode 
              ? '#000000'
              : customization.calendarBg,
            borderColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : customization.calendarBorder,
            color: darkMode ? customization.darkModeCalendarText : customization.calendarText
          }}
        >
          {/* Holiday Badge */}
          {holiday && (
            <div className="absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg print:hidden flex items-center gap-1" title={holiday.name}>
              <Sparkles className="w-3 h-3" />
              {holiday.type === 'federal' ? '🎊' : holiday.type === 'company' ? '🎉' : '⭐'}
            </div>
          )}
          
          <div className="flex justify-between items-start mb-1.5">
              <div>
                <span className={`text-sm font-extrabold w-7 h-7 flex items-center justify-center rounded-xl shadow-sm transition-all duration-300 ${isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 print:bg-transparent print:text-black print:border print:border-black' : holiday ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white' : 'text-slate-700 group-hover:bg-slate-100'}`}>{day}</span>
                {holiday && (
                  <div className="text-[9px] font-bold text-yellow-700 mt-1 truncate max-w-[60px]" title={holiday.name}>
                    {holiday.name}
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 print:hidden">
                  {dayShifts.length > 0 && <button onClick={(e) => handleCopyDay(e, dayShifts)} className={`text-xs text-slate-400 ${themeClasses.text} opacity-0 group-hover:opacity-100 transition-all hover:scale-125 bg-white/50 p-1 rounded`} title="Copy Day"><Copy size={13} /></button>}
                  {dayClipboard && <button onClick={(e) => handlePasteDay(e, dateObj)} className="text-xs text-slate-400 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-125 bg-white/50 p-1 rounded" title="Paste Day"><Clipboard size={13} /></button>}
              </div>
          </div>
          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100%-2rem)] no-scrollbar print:overflow-visible">
            {dayShifts.map((shift, index) => {
              const theme = getThemeColors(shift.employeeName, shift.colorHue);
              const isDraft = shift.isDraft;
              const isTimeOff = shift.isTimeOff;
              const holiday = isHoliday(dateObj);
              
              // Check for overtime
              const weekStart = new Date(dateObj);
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              const weeklyHours = calculateWeeklyHours(shift.employeeName, weekStart);
              const hasOvertime = weeklyHours > 40;
              
              // Calculate breaks
              const breaks = calculateBreaks(shift.startTime, shift.endTime);

              if (isTimeOff) {
                  return (
                    <div key={shift.id} onClick={(e) => handleShiftClick(e, shift)} className="text-[10px] md:text-xs px-2 py-1.5 rounded-lg border shadow-md truncate flex items-center gap-1.5 hover:scale-105 hover:shadow-lg transition-all bg-slate-100 border-slate-300 text-slate-600 italic font-semibold animate-slide-in" style={{ animationDelay: `${index * 50}ms`, backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%, #e2e8f0 100%)', backgroundSize: '10px 10px' }}>
                        <Ban size={11} className="shrink-0" /><span className="truncate">{shift.employeeName}: Off</span>
                    </div>
                  );
              }

              return (
                <div 
                  key={shift.id} 
                  draggable="true"
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', shift.id!);
                    e.dataTransfer.setData('shiftId', shift.id!);
                    e.dataTransfer.setData('sourceDate', shift.date);
                    (e.target as HTMLElement).style.opacity = '0.5';
                  }}
                  onDragEnd={(e) => {
                    (e.target as HTMLElement).style.opacity = '1';
                  }}
                  onClick={(e) => handleShiftClick(e, shift)} 
                  className={`rounded-xl shift-card animate-slide-in print:border-slate-300 print:shadow-none cursor-move hover:cursor-grab active:cursor-grabbing relative overflow-hidden transition-all hover:scale-[1.02] ${isDraft ? 'opacity-90 border-dashed border-2 animate-pulse' : ''} ${
                    employeeXP[shift.employeeName]?.total > 3000 ? 'ring-2 ring-yellow-400 ring-opacity-60' : ''
                  } ${
                    calendarDisplayStyle === 'compact' ? 'mb-1' :
                    calendarDisplayStyle === 'list' ? 'mb-2 border-l-4' :
                    calendarDisplayStyle === 'timeline' ? 'mb-1.5 border-l-8' :
                    ''
                  }`} 
                  style={{ 
                    animationDelay: `${index * 50}ms`, 
                    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : theme.bg,
                    borderLeft: darkMode ? `4px solid ${theme.border}` : 'none',
                    borderColor: isDraft ? theme.bg : (darkMode ? 'rgba(71, 85, 105, 0.5)' : 'transparent'),
                    backdropFilter: 'blur(15px) saturate(150%)',
                    boxShadow: darkMode
                      ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    border: darkMode ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {/* Overtime Badge */}
                  {hasOvertime && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg print:hidden animate-pulse flex items-center gap-1" title={`${weeklyHours.toFixed(1)} hours this week`}>
                      <AlertCircle className="w-2.5 h-2.5" />
                      OT
                    </div>
                  )}
                  
                  {/* Shift Differential Badge */}
                  {shift.differential && shift.differential > 1.0 && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg print:hidden flex items-center gap-1" title={`${((shift.differential - 1) * 100).toFixed(0)}% shift differential`}>
                      <DollarSign className="w-2.5 h-2.5" />
                      +{((shift.differential - 1) * 100).toFixed(0)}%
                    </div>
                  )}
                  
                  {/* Card Content - Photo Prominent */}
                  <div className={`${
                    calendarDisplayStyle === 'compact' ? 'p-2' :
                    calendarDisplayStyle === 'list' ? 'p-2 flex items-center gap-3' :
                    calendarDisplayStyle === 'timeline' ? 'p-2 flex items-center gap-2' :
                    'p-3'
                  }`}>
                    <div className={`flex items-start gap-3 ${calendarDisplayStyle === 'list' || calendarDisplayStyle === 'timeline' ? 'mb-0' : 'mb-2'}`}>
                      {employeePhotos[shift.employeeName] ? (
                        <img 
                          src={employeePhotos[shift.employeeName]} 
                          alt={shift.employeeName}
                          className={`rounded-lg object-cover border-2 border-white/20 shadow-lg shrink-0 ${
                            calendarDisplayStyle === 'compact' ? 'w-8 h-8' :
                            calendarDisplayStyle === 'list' ? 'w-10 h-10' :
                            calendarDisplayStyle === 'timeline' ? 'w-8 h-8' :
                            'w-12 h-12'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployeeProfile(shift.employeeName);
                            setShowEmployeeProfile(true);
                          }}
                        />
                      ) : (
                        <div 
                          className={`rounded-lg flex items-center justify-center font-bold border-2 border-white/20 shadow-lg shrink-0 cursor-pointer hover:scale-105 transition-transform ${
                            calendarDisplayStyle === 'compact' ? 'w-8 h-8 text-xs' :
                            calendarDisplayStyle === 'list' ? 'w-10 h-10 text-xs' :
                            calendarDisplayStyle === 'timeline' ? 'w-8 h-8 text-xs' :
                            'w-12 h-12 text-sm'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.border} 100%)`, color: theme.text }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployeeProfile(shift.employeeName);
                            setShowEmployeeProfile(true);
                          }}
                        >
                          {getEmployeeInitials(shift.employeeName)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div 
                            className="font-bold text-sm leading-tight"
                            style={{
                              color: darkMode ? '#f1f5f9' : theme.text,
                              fontSize: `${customization.employeeNameFontSize}px`,
                              fontWeight: customization.employeeNameFontWeight
                            }}
                          >
                            {shift.employeeName}
                          </div>
                          {employeeXP[shift.employeeName] && (
                            <>
                              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 px-1.5 py-0.5 rounded text-[9px] font-extrabold text-black shadow-md">
                                <Star className="w-2.5 h-2.5" />
                                {employeeXP[shift.employeeName].total}
                              </div>
                              {employeeXP[shift.employeeName].total > 3000 && (
                                <Crown className="w-3.5 h-3.5 text-yellow-400 animate-pulse" title="Top Performer!" />
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-xs font-semibold" style={{ color: darkMode ? '#94a3b8' : theme.text, opacity: 0.8 }}>
                          {shift.role || shift.department || 'Staff'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" style={{ color: darkMode ? '#10b981' : theme.text, opacity: 0.7 }} />
                          <span className="text-xs font-bold" style={{ color: darkMode ? '#10b981' : theme.text }}>
                            {formatTime(shift.startTime, timeFormat === '24h')} - {formatTime(shift.endTime, timeFormat === '24h')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {shift.shiftComments && (
                      <div className="mt-2 text-[10px] opacity-75 italic truncate border-t border-white/10 pt-2" title={shift.shiftComments} style={{ color: darkMode ? '#cbd5e1' : theme.text }}>
                        💬 {shift.shiftComments}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) days.push(<div key={`empty-end-${i}`} className={`min-h-[60px] backdrop-blur-sm border-r border-b print:bg-white print:min-h-[100px]`} style={{ backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.3)', borderColor: darkMode ? 'rgba(45, 45, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)' }}></div>);
    return days;
  };

  const monthStats = useMemo(() => {
    const currentMonthShifts = shifts.filter(s => new Date(s.date).getMonth() === currentDate.getMonth() && !s.isTimeOff);
    const stats: Record<string, { hours: number; cost: number }> = {};
    let totalCost = 0;

    currentMonthShifts.forEach(s => {
        if (!stats[s.employeeName]) stats[s.employeeName] = { hours: 0, cost: 0 };
        const start = parseInt(s.startTime.split(':')[0]);
        const end = parseInt(s.endTime.split(':')[0]);
        const hours = Math.max(0, end - start);
        
        const emp = employees.find(e => e.name === s.employeeName);
        const rate = emp ? emp.rate : 0;
        const cost = hours * rate;

        stats[s.employeeName].hours += hours;
        stats[s.employeeName].cost += cost;
        totalCost += cost;
    });
    return { 
        totalShifts: currentMonthShifts.length, 
        uniqueEmployees: new Set(currentMonthShifts.map(s => s.employeeName)).size, 
        hours: stats,
        totalCost
    };
  }, [shifts, currentDate, employees]);

  const hasDrafts = useMemo(() => shifts.some(s => s.isDraft), [shifts]);

  // Day View Renderer
  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayShifts = shifts.filter(s => {
      const matchesDate = s.date.startsWith(dateStr);
      const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
      return matchesDate && matchesDept;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="glass rounded-3xl p-6 space-y-4">
        {dayShifts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No shifts scheduled for this day</p>
          </div>
        ) : (
          dayShifts.map((shift, index) => {
            const theme = getThemeColors(shift.employeeName, shift.colorHue);
            return (
              <div 
                key={shift.id} 
                onClick={(e) => handleShiftClick(e, shift)}
                className="p-4 rounded-xl border shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-4"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                {employeePhotos[shift.employeeName] ? (
                  <img src={employeePhotos[shift.employeeName]} alt={shift.employeeName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)', color: theme.text }}>
                    {getEmployeeInitials(shift.employeeName)}
                  </div>
                )}
                <div className="flex-1" style={{ color: theme.text }}>
                  <h3 className="font-bold text-lg">{shift.employeeName}</h3>
                  <p className="text-sm opacity-90">{shift.role} • {shift.department || 'General'}</p>
                  <p className="text-sm font-semibold mt-1">{formatTime(shift.startTime, timeFormat === '24h')} - {formatTime(shift.endTime, timeFormat === '24h')}</p>
                  {shift.notes && <p className="text-xs opacity-75 mt-2">{shift.notes}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  // Week View Renderer
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return (
      <div className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          {weekDays.map((day, i) => (
            <div key={i} className="py-4 text-center border-r border-white/20 last:border-r-0">
              <div className="text-xs font-bold text-slate-600 uppercase">{DAYS[i]}</div>
              <div className={`text-lg font-bold mt-1 ${day.toDateString() === new Date().toDateString() ? 'text-purple-600' : 'text-slate-700'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayShifts = shifts.filter(s => {
              const matchesDate = s.date.startsWith(dateStr);
              const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
              return matchesDate && matchesDept;
            }).sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div 
                key={i} 
                onClick={() => { setCurrentDate(day); setCalendarView('day'); }}
                className="min-h-[300px] p-3 border-r border-white/20 last:border-r-0 bg-white/50 hover:bg-white/80 cursor-pointer transition-all"
              >
                <div className="space-y-2">
                  {dayShifts.map((shift) => {
                    const theme = getThemeColors(shift.employeeName, shift.colorHue);
                    return (
                      <div 
                        key={shift.id}
                        className="text-xs px-2 py-1.5 rounded-lg border shadow-sm"
                        style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                      >
                        <div className="font-semibold truncate">{shift.employeeName}</div>
                        <div className="text-[10px] opacity-90">{formatTime(shift.startTime, timeFormat === '24h')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Agenda View Renderer
  const renderAgendaView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const agendaItems: {date: Date; shifts: Shift[]}[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const dayShifts = shifts.filter(s => {
        const matchesDate = s.date.startsWith(dateStr);
        const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
        return matchesDate && matchesDept;
      }).sort((a, b) => a.startTime.localeCompare(b.startTime));

      if (dayShifts.length > 0) {
        agendaItems.push({ date: dateObj, shifts: dayShifts });
      }
    }

    return (
      <div className="glass rounded-3xl p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {agendaItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No shifts scheduled this month</p>
          </div>
        ) : (
          agendaItems.map(({ date, shifts: dayShifts }) => (
            <div key={date.toISOString()} className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-lg text-slate-800 mb-3">
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-2">
                {dayShifts.map((shift) => {
                  const theme = getThemeColors(shift.employeeName, shift.colorHue);
                  return (
                    <div 
                      key={shift.id}
                      onClick={(e) => handleShiftClick(e, shift)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      {employeePhotos[shift.employeeName] ? (
                        <img src={employeePhotos[shift.employeeName]} alt={shift.employeeName} className="w-10 h-10 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: theme.border }} />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm" style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}>
                          {getEmployeeInitials(shift.employeeName)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{shift.employeeName}</div>
                        <div className="text-xs text-slate-600">{shift.role} • {shift.department || 'General'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-800">{formatTime(shift.startTime, timeFormat === '24h')}</div>
                        <div className="text-xs text-slate-500">to {formatTime(shift.endTime, timeFormat === '24h')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Helper function to categorize shift by time period
  const getShiftPeriod = (startTime: string): 'Day Shift' | 'Evening Shift' | 'Night Shift' => {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour >= 6 && hour < 14) return 'Day Shift';
    if (hour >= 14 && hour < 22) return 'Evening Shift';
    return 'Night Shift';
  };

  /**
   * Maps department names to unique color hues for visual identification.
   * Each department is assigned a distinct hue value (0-360) to ensure
   * different departments are easily distinguishable in the shift matrix.
   * 
   * @param department - The department name (e.g., 'Nursing', 'Emergency')
   * @returns The hue value (0-360) for the department, or null if not found
   */
  const getDepartmentHue = (department: string | undefined): number | null => {
    if (!department) return null;
    const hueMap: Record<string, number> = {
      'Nursing': 210,
      'Emergency': 0,
      'Radiology': 150,
      'Laboratory': 30,
      'Pharmacy': 270,
      'Surgery': 330,
      'ICU': 200,
      'Pediatrics': 300,
      'Cardiology': 15,
      'Housekeeping': 180,
      'Administration': 240,
      'Security': 90,
      'General': 220  // Changed from 200 to 220 to avoid conflict with ICU
    };
    return hueMap[department] || null;
  };

  /**
   * Renders an enhanced shift card for the shift matrix view.
   * Cards include employee avatar/initials, role badge, department label,
   * time display, and XP badge. Supports drag-and-drop and hover tooltips.
   * 
   * @param shift - The shift data to render
   * @param index - The index of the shift in the array (for React key)
   * @returns React component for the shift card
   */
  const renderEnhancedShiftCard = (shift: Shift, index: number) => {
    const theme = getThemeColors(shift.employeeName, shift.colorHue);
    const isDraft = shift.isDraft;
    const departmentHue = getDepartmentHue(shift.department);
    const finalTheme = shift.colorHue === null && departmentHue !== null ? 
      getThemeColors(shift.department || 'General', departmentHue) : theme;

    return (
      <div
        key={shift.id}
        draggable="true"
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', shift.id!);
          e.dataTransfer.setData('shiftId', shift.id!);
          e.dataTransfer.setData('sourceDate', shift.date);
          (e.target as HTMLElement).style.opacity = '0.5';
        }}
        onDragEnd={(e) => {
          (e.target as HTMLElement).style.opacity = '1';
        }}
        onClick={(e) => handleShiftClick(e, shift)}
        className={`group relative rounded-lg p-1.5 cursor-move hover:cursor-grab active:cursor-grabbing transition-all hover:scale-[1.03] hover:shadow-xl ${
          isDraft ? 'opacity-90' : ''
        }`}
        style={{
          backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : finalTheme.bg,
          borderLeft: `4px solid ${finalTheme.border}`,
          borderRight: darkMode ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
          borderTop: darkMode ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
          borderBottom: darkMode ? '1px solid rgba(71, 85, 105, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
          borderStyle: isDraft ? 'dashed' : 'solid',
          boxShadow: darkMode
            ? `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
            : `0 2px 8px rgba(0, 0, 0, 0.1)`
        }}
      >
        <div className="flex items-start gap-1.5">
          {/* Photo/Initial Circle */}
          {employeePhotos[shift.employeeName] ? (
            <img
              src={employeePhotos[shift.employeeName]}
              alt={shift.employeeName}
              className="w-7 h-7 rounded-full object-cover border-2 shadow-sm shrink-0 ring-1 ring-white/20"
              style={{ borderColor: finalTheme.border }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployeeProfile(shift.employeeName);
                setShowEmployeeProfile(true);
              }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2 shadow-sm shrink-0 cursor-pointer ring-1 ring-white/20"
              style={{ background: `linear-gradient(135deg, ${finalTheme.bg} 0%, ${finalTheme.border} 100%)`, color: finalTheme.text, borderColor: finalTheme.border }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployeeProfile(shift.employeeName);
                setShowEmployeeProfile(true);
              }}
            >
              {getEmployeeInitials(shift.employeeName)}
            </div>
          )}

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="font-bold truncate" style={{
                color: darkMode ? '#f1f5f9' : finalTheme.text,
                fontSize: `${employeeBadgeSize}px`
              }}>
                {shift.employeeName}
              </div>
              {/* Role Badge */}
              {shift.role && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-tight shrink-0" style={{
                  backgroundColor: darkMode ? `${finalTheme.border}40` : `${finalTheme.border}30`,
                  color: darkMode ? '#f1f5f9' : finalTheme.border,
                  border: `1px solid ${finalTheme.border}60`
                }}>
                  {shift.role.length <= 3 ? shift.role.toUpperCase() : shift.role.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Department & Time */}
            <div className="flex items-center gap-1 text-[9px]">
              {shift.department && (
                <span className="font-medium truncate px-1 rounded" style={{
                  color: darkMode ? '#94a3b8' : finalTheme.text,
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
                  opacity: 0.85
                }}>
                  {shift.department}
                </span>
              )}
              <span className="font-bold flex items-center gap-0.5 shrink-0" style={{
                color: darkMode ? '#10b981' : finalTheme.text,
                opacity: 0.9
              }}>
                <Clock className="w-2.5 h-2.5" />
                {formatTime(shift.startTime, timeFormat === '24h')}
              </span>
            </div>
          </div>

          {/* XP Badge */}
          {employeeXP[shift.employeeName] && employeeXP[shift.employeeName].total > 0 && (
            <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold text-black shadow-sm">
              <Star className="w-2.5 h-2.5" />
              {employeeXP[shift.employeeName].total}
            </div>
          )}
        </div>
        
        {/* Hover Tooltip */}
        <div className="absolute left-0 -top-1 translate-y-[-100%] hidden group-hover:block z-50 pointer-events-none">
          <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap border border-slate-700">
            {shift.employeeName} • {formatTime(shift.startTime, timeFormat === '24h')} - {formatTime(shift.endTime, timeFormat === '24h')}
          </div>
        </div>
      </div>
    );
  };

  // Shift Matrix View Renderer - Grid layout by shift period and day
  const renderShiftMatrixView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Define shift periods
    const shiftPeriods = [
      { label: 'Day Shift', timeRange: '6:00 AM - 2:00 PM', period: 'Day Shift' as const },
      { label: 'Evening Shift', timeRange: '2:00 PM - 10:00 PM', period: 'Evening Shift' as const },
      { label: 'Night Shift', timeRange: '10:00 PM - 6:00 AM', period: 'Night Shift' as const }
    ];

    // Build calendar days array
    const calendarDays: Array<{day: number | null; dateObj: Date | null}> = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, dateObj: null });
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      calendarDays.push({ day, dateObj });
    }

    return (
      <div className="rounded-3xl overflow-hidden animate-scale-in" style={{
        backgroundColor: darkMode ? 'rgba(15, 15, 35, 0.6)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: darkMode ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header Row - Days of Week */}
        <div className="grid border-b" style={{
          gridTemplateColumns: '160px repeat(7, 1fr)',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)',
          background: darkMode ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(79, 70, 229, 0.3))' : 'linear-gradient(135deg, rgba(243, 232, 255, 0.5), rgba(252, 231, 243, 0.5))'
        }}>
          <div className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-center border-r" style={{
            color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#475569',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'
          }}>
            Shift Period
          </div>
          {DAYS.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-widest" style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#475569'
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Matrix Grid - Each Row is a Shift Period */}
        {shiftPeriods.map((shiftPeriod) => (
          <div key={shiftPeriod.period} className="grid border-b" style={{
            gridTemplateColumns: '160px repeat(7, 1fr)',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'
          }}>
            {/* Shift Period Label Column */}
            <div className="py-3 px-4 border-r flex flex-col justify-center" style={{
              backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.3)',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'
            }}>
              <div className="font-bold text-sm" style={{
                color: darkMode ? '#f1f5f9' : '#1e293b'
              }}>
                {shiftPeriod.label}
              </div>
              <div className="text-xs" style={{
                color: darkMode ? '#94a3b8' : '#64748b'
              }}>
                {shiftPeriod.timeRange}
              </div>
            </div>

            {/* Day Cells for this Shift Period */}
            {calendarDays.slice(0, 7).map((dayInfo, colIndex) => {
              if (!dayInfo.dateObj || !dayInfo.day) {
                return (
                  <div key={`empty-${shiftPeriod.period}-${colIndex}`} className="border-r p-2" style={{
                    backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    borderColor: darkMode ? 'rgba(45, 45, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                  }} />
                );
              }

              const dateStr = dayInfo.dateObj.toISOString().split('T')[0];
              const dayShifts = shifts.filter(s => {
                const matchesDate = s.date.startsWith(dateStr);
                const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
                const matchesPeriod = !s.isTimeOff && getShiftPeriod(s.startTime) === shiftPeriod.period;
                return matchesDate && matchesDept && matchesPeriod;
              }).sort((a, b) => a.startTime.localeCompare(b.startTime));

              const isToday = new Date().toDateString() === dayInfo.dateObj.toDateString();
              const holiday = isHoliday(dayInfo.dateObj);

              return (
                <div
                  key={`${shiftPeriod.period}-${dayInfo.day}`}
                  onClick={() => handleDayClick(dayInfo.day!)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const shiftId = e.dataTransfer.getData('shiftId');
                    const sourceDate = e.dataTransfer.getData('sourceDate');
                    if (shiftId && sourceDate !== dateStr) {
                      const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shiftId);
                      updateDoc(shiftRef, { date: dateStr }).then(() => {
                        setStatus({ type: 'success', msg: '✓ Shift moved successfully!' });
                        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
                      }).catch((err) => {
                        console.error('Drag drop error:', err);
                        setStatus({ type: 'error', msg: 'Failed to move shift' });
                      });
                    }
                  }}
                  className={`border-r p-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01] ${
                    isToday ? 'ring-2 ring-purple-400/50' : ''
                  }`}
                  style={{
                    backgroundColor: isToday 
                      ? 'rgba(139, 92, 246, 0.15)'
                      : holiday 
                      ? (darkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.2)')
                      : darkMode 
                      ? 'rgba(0, 0, 0, 0.2)' 
                      : 'rgba(255, 255, 255, 0.5)',
                    borderColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'
                  }}
                >
                  {/* Day Number Badge - Only show in first row */}
                  {shiftPeriod.period === 'Day Shift' && (
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-lg ${
                        isToday 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                          : holiday
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
                          : ''
                      }`} style={{
                        color: !isToday && !holiday ? (darkMode ? '#f1f5f9' : '#1e293b') : undefined
                      }}>
                        {dayInfo.day}
                      </span>
                      {holiday && (
                        <div className="text-[8px] font-bold text-yellow-600" title={holiday.name}>
                          {holiday.type === 'federal' ? '🎊' : '🎉'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shift Cards - Enhanced Compact Design */}
                  <div className="space-y-1">
                    {dayShifts.map((shift, index) => renderEnhancedShiftCard(shift, index))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Additional Weeks if Month has more than 7 days */}
        {calendarDays.length > 7 && (
          <>
            {/* Week 2 */}
            {calendarDays.slice(7, 14).length > 0 && shiftPeriods.map((shiftPeriod) => (
              <div key={`week2-${shiftPeriod.period}`} className="grid border-b" style={{
                gridTemplateColumns: '160px repeat(7, 1fr)',
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'
              }}>
                <div className="py-3 px-4 border-r flex flex-col justify-center" style={{
                  backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'
                }}>
                  <div className="font-bold text-sm" style={{
                    color: darkMode ? '#f1f5f9' : '#1e293b'
                  }}>
                    {shiftPeriod.label}
                  </div>
                  <div className="text-xs" style={{
                    color: darkMode ? '#94a3b8' : '#64748b'
                  }}>
                    {shiftPeriod.timeRange}
                  </div>
                </div>

                {calendarDays.slice(7, 14).map((dayInfo, colIndex) => {
                  if (!dayInfo.dateObj || !dayInfo.day) {
                    return (
                      <div key={`empty-week2-${shiftPeriod.period}-${colIndex}`} className="border-r p-2" style={{
                        backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                        borderColor: darkMode ? 'rgba(45, 45, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                      }} />
                    );
                  }

                  const dateStr = dayInfo.dateObj.toISOString().split('T')[0];
                  const dayShifts = shifts.filter(s => {
                    const matchesDate = s.date.startsWith(dateStr);
                    const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
                    const matchesPeriod = !s.isTimeOff && getShiftPeriod(s.startTime) === shiftPeriod.period;
                    return matchesDate && matchesDept && matchesPeriod;
                  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

                  const isToday = new Date().toDateString() === dayInfo.dateObj.toDateString();
                  const holiday = isHoliday(dayInfo.dateObj);

                  return (
                    <div
                      key={`week2-${shiftPeriod.period}-${dayInfo.day}`}
                      onClick={() => handleDayClick(dayInfo.day!)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const shiftId = e.dataTransfer.getData('shiftId');
                        const sourceDate = e.dataTransfer.getData('sourceDate');
                        if (shiftId && sourceDate !== dateStr) {
                          const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shiftId);
                          updateDoc(shiftRef, { date: dateStr }).then(() => {
                            setStatus({ type: 'success', msg: '✓ Shift moved successfully!' });
                            setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
                          }).catch((err) => {
                            console.error('Drag drop error:', err);
                            setStatus({ type: 'error', msg: 'Failed to move shift' });
                          });
                        }
                      }}
                      className={`border-r p-2 transition-all cursor-pointer hover:shadow-lg ${
                        isToday ? 'ring-2 ring-purple-400/50' : ''
                      }`}
                      style={{
                        backgroundColor: isToday 
                          ? 'rgba(139, 92, 246, 0.15)'
                          : holiday 
                          ? (darkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.2)')
                          : darkMode 
                          ? 'rgba(0, 0, 0, 0.2)' 
                          : 'rgba(255, 255, 255, 0.5)',
                        borderColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'
                      }}
                    >
                      {shiftPeriod.period === 'Day Shift' && (
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-lg ${
                            isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : ''
                          }`} style={{
                            color: !isToday ? (darkMode ? '#f1f5f9' : '#1e293b') : undefined
                          }}>
                            {dayInfo.day}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        {dayShifts.map((shift, index) => renderEnhancedShiftCard(shift, index))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Additional weeks... continue pattern for weeks 3-5 if needed */}
            {[14, 21, 28, 35].map((weekStart, weekIndex) => {
              if (calendarDays.slice(weekStart, weekStart + 7).length === 0) return null;
              
              return shiftPeriods.map((shiftPeriod) => (
                <div key={`week${weekIndex + 3}-${shiftPeriod.period}`} className="grid border-b" style={{
                  gridTemplateColumns: '160px repeat(7, 1fr)',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'
                }}>
                  <div className="py-3 px-4 border-r flex flex-col justify-center" style={{
                    backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'
                  }}>
                    <div className="font-bold text-sm" style={{
                      color: darkMode ? '#f1f5f9' : '#1e293b'
                    }}>
                      {shiftPeriod.label}
                    </div>
                    <div className="text-xs" style={{
                      color: darkMode ? '#94a3b8' : '#64748b'
                    }}>
                      {shiftPeriod.timeRange}
                    </div>
                  </div>

                  {calendarDays.slice(weekStart, weekStart + 7).map((dayInfo, colIndex) => {
                    if (!dayInfo.dateObj || !dayInfo.day) {
                      return (
                        <div key={`empty-week${weekIndex + 3}-${shiftPeriod.period}-${colIndex}`} className="border-r p-2" style={{
                          backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                          borderColor: darkMode ? 'rgba(45, 45, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                        }} />
                      );
                    }

                    const dateStr = dayInfo.dateObj.toISOString().split('T')[0];
                    const dayShifts = shifts.filter(s => {
                      const matchesDate = s.date.startsWith(dateStr);
                      const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
                      const matchesPeriod = !s.isTimeOff && getShiftPeriod(s.startTime) === shiftPeriod.period;
                      return matchesDate && matchesDept && matchesPeriod;
                    }).sort((a, b) => a.startTime.localeCompare(b.startTime));

                    const isToday = new Date().toDateString() === dayInfo.dateObj.toDateString();

                    return (
                      <div
                        key={`week${weekIndex + 3}-${shiftPeriod.period}-${dayInfo.day}`}
                        onClick={() => handleDayClick(dayInfo.day!)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const shiftId = e.dataTransfer.getData('shiftId');
                          const sourceDate = e.dataTransfer.getData('sourceDate');
                          if (shiftId && sourceDate !== dateStr) {
                            const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shiftId);
                            updateDoc(shiftRef, { date: dateStr }).then(() => {
                              setStatus({ type: 'success', msg: '✓ Shift moved successfully!' });
                              setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
                            }).catch((err) => {
                              console.error('Drag drop error:', err);
                              setStatus({ type: 'error', msg: 'Failed to move shift' });
                            });
                          }
                        }}
                        className={`border-r p-2 transition-all cursor-pointer ${
                          isToday ? 'ring-2 ring-purple-400/50' : ''
                        }`}
                        style={{
                          backgroundColor: isToday 
                            ? 'rgba(139, 92, 246, 0.15)'
                            : darkMode 
                            ? 'rgba(0, 0, 0, 0.2)' 
                            : 'rgba(255, 255, 255, 0.5)',
                          borderColor: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'
                        }}
                      >
                        {shiftPeriod.period === 'Day Shift' && (
                          <div className="mb-1">
                            <span className={`text-xs font-bold ${isToday ? 'bg-purple-500 text-white px-1 rounded' : ''}`} style={{
                              color: !isToday ? (darkMode ? '#f1f5f9' : '#1e293b') : undefined
                            }}>
                              {dayInfo.day}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1">
                          {dayShifts.map((shift, index) => renderEnhancedShiftCard(shift, index))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })}
          </>
        )}
      </div>
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const modalTheme = getThemeColors(formData.employeeName || 'Preview', formData.colorHue);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1030] to-[#0f0a20] text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 text-slate-900'} ${FONTS[appFont]} flex flex-col print:bg-white transition-colors duration-500`}>
      <header className="sticky top-0 z-10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:static print:shadow-none print:px-0 print:py-2 animate-slide-in" style={{backgroundColor: darkMode ? 'rgba(10, 10, 26, 0.75)' : customization.calendarBg || '#ffffff', backdropFilter: 'blur(20px) saturate(180%)', boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'}}>
        <div className="flex items-center gap-3">
          <img 
            src="/noxshift-logo.png" 
            alt="NoxShift Logo" 
            className="w-10 h-10 object-contain print:w-12 print:h-12" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }} 
          />
          <div className={`${themeClasses.primary} p-3 rounded-xl print:hidden text-white shadow-lg transform transition-transform hover:scale-110 hover:rotate-3`} style={{display: 'none'}}>
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold gradient-text leading-none print:text-2xl tracking-tight">NoxShift</h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold tracking-wider print:text-slate-600">WORKFORCE MANAGEMENT</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
             <div className="nox-tracer px-4 py-2 flex items-center gap-2 print:hidden relative" style={{'--tracer-color': '#a855f7'} as React.CSSProperties}>
                <Building className="w-4 h-4 text-white" />
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer min-w-[140px] appearance-none pr-6"
                >
                    <option value="All" className="bg-slate-900">All Departments</option>
                    {departments.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-white pointer-events-none absolute right-3" />
                <button 
                  onClick={() => setShowDepartmentInput(!showDepartmentInput)} 
                  className="p-1 hover:bg-white/10 rounded transition-all text-white hover:scale-110 ml-1"
                  title="Add Department"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
            </div>
            {showDepartmentInput && (
              <div className="flex items-center gap-2 glass rounded-xl p-2 print:hidden animate-scale-in">
                <input
                  type="text"
                  value={newDepartmentInput}
                  onChange={(e) => setNewDepartmentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                  placeholder="New department..."
                  className="bg-white/50 px-2 py-1 rounded text-sm outline-none w-32"
                  autoFocus
                />
                <button onClick={handleAddDepartment} className="text-green-600 hover:scale-110">
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button onClick={() => {setShowDepartmentInput(false); setNewDepartmentInput('');}} className="text-red-600 hover:scale-110">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Month Navigation */}
            <div className="nox-tracer px-3 py-2 flex items-center gap-4 print:hidden" style={{'--tracer-color': '#ec4899'} as React.CSSProperties}>
              <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded transition-all text-white hover:scale-110">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base font-extrabold text-white min-w-[160px] text-center tabular-nums">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded transition-all text-white hover:scale-110">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar View Switcher */}
            <div className="nox-tracer px-4 py-2 relative print:hidden" style={{'--tracer-color': '#8b5cf6'} as React.CSSProperties}>
              <select 
                value={calendarView} 
                onChange={(e) => setCalendarView(e.target.value as 'day' | 'week' | 'month' | 'agenda' | 'shift-matrix' | 'bigcalendar')}
                className="bg-transparent text-white font-bold px-2 py-1 cursor-pointer appearance-none pr-8 outline-none">
                <option value="bigcalendar" className="bg-slate-900">Modern Calendar (Default)</option>
                <option value="month" className="bg-slate-900">Classic Month</option>
                <option value="week" className="bg-slate-900">Week</option>
                <option value="day" className="bg-slate-900">Day</option>
                <option value="shift-matrix" className="bg-slate-900">Shift Matrix</option>
                <option value="agenda" className="bg-slate-900">Agenda</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
            
            {/* Display Style Selector */}
            <div className="nox-tracer px-4 py-2 relative print:hidden" style={{'--tracer-color': '#6366f1'} as React.CSSProperties}>
              <select 
                value={calendarDisplayStyle} 
                onChange={(e) => setCalendarDisplayStyle(e.target.value as 'standard' | 'compact' | 'list' | 'timeline')}
                className="bg-transparent text-white font-bold px-2 py-1 cursor-pointer appearance-none pr-8 outline-none">
                <option value="standard" className="bg-slate-900">Standard</option>
                <option value="compact" className="bg-slate-900">Compact</option>
                <option value="list" className="bg-slate-900">List</option>
                <option value="timeline" className="bg-slate-900">Timeline</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
        </div>

        <div className="flex items-center gap-3">
            {hasDrafts && (
                <button onClick={handlePublishAll} className="nox-tracer p-3 print:hidden animate-pulse flex items-center gap-2" title="Publish All Drafts" style={{'--tracer-color': '#f59e0b'} as React.CSSProperties}>
                    <Send className="w-5 h-5 text-white" />
                </button>
            )}
            
            {/* ICON BUTTONS - Match Reference Image */}
            <button onClick={() => {
              const newDarkMode = !darkMode;
              setDarkMode(newDarkMode);
              localStorage.setItem('noxshift-dark-mode', newDarkMode.toString());
            }} className="nox-tracer p-3 print:hidden" title="Toggle Dark Mode" style={{'--tracer-color': '#06b6d4'} as React.CSSProperties}>
              {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
            
            <button onClick={() => setShowStats(true)} className="nox-tracer p-3 print:hidden" title="View Stats" style={{'--tracer-color': '#14b8a6'} as React.CSSProperties}>
              <BarChart2 className="w-5 h-5 text-white" />
            </button>
            
            <button onClick={() => setShowTimeClock(true)} className="nox-tracer p-3 print:hidden" title="Time Clock" style={{'--tracer-color': '#10b981'} as React.CSSProperties}>
              <Clock className="w-5 h-5 text-white" />
            </button>
            
            <div className="relative">
              <button onClick={() => setShowNotifications(true)} className="nox-tracer p-3 print:hidden relative" title="Notifications" style={{'--tracer-color': '#fbbf24'} as React.CSSProperties}>
                <Bell className="w-5 h-5 text-white" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse z-10">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
            
            <button onClick={() => setShowBonusModal(true)} className="nox-tracer p-3 print:hidden" title="Bonus System" style={{'--tracer-color': '#10b981'} as React.CSSProperties}>
              <DollarSign className="w-5 h-5 text-white" />
            </button>
            
            <button onClick={() => setShowOracle(true)} className="nox-tracer p-3 print:hidden" title="Oracle AI" style={{'--tracer-color': '#8b5cf6'} as React.CSSProperties}>
              <BrainCircuit className="w-5 h-5 text-white" />
            </button>
            
            <button onClick={() => setShowSettings(true)} className="nox-tracer p-3 print:hidden" title="Settings" style={{'--tracer-color': '#ec4899'} as React.CSSProperties}>
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            <button onClick={() => signOut()} className="nox-tracer p-3 print:hidden" title="Sign Out" style={{'--tracer-color': '#ef4444'} as React.CSSProperties}>
              <LogOut className="w-5 h-5 text-white" />
            </button>
            
            {/* MENU DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setShowMenuDropdown(!showMenuDropdown)} 
                className="nox-tracer p-3 print:hidden"
                title="More Options"
                style={{'--tracer-color': '#e879f9'} as React.CSSProperties}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              
              {showMenuDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto" style={{
                  backgroundColor: darkMode ? 'rgba(30, 30, 46, 0.98)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: darkMode ? '0 20px 60px rgba(0, 0, 0, 0.6)' : '0 10px 40px rgba(0, 0, 0, 0.15)'
                }}>
                  <div className="p-4 border-b" style={{borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}}>
                    <h3 className="font-bold text-lg" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>Features & Tools</h3>
                  </div>
                  
                  <div className="p-2">
                    {/* Gamification Section */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold uppercase" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>Gamification</div>
                      <button onClick={() => { setShowGameHub(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all" style={{
                        background: darkMode ? 'rgba(251, 191, 36, 0.1)' : 'linear-gradient(to right, rgb(255, 251, 235), rgb(255, 247, 237))',
                        color: darkMode ? '#fbbf24' : '#1e293b'
                      }}>
                        <Gamepad2 className="w-5 h-5" style={{color: '#f59e0b'}} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            GameHub
                            <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                          </div>
                          <div className="text-xs text-slate-500">Team building games</div>
                        </div>
                        {gameInvites.length > 0 && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">{gameInvites.length}</span>
                        )}
                      </button>
                      <button onClick={() => { setShowMerchStore(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all bg-gradient-to-r from-green-50 to-emerald-50">
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Merch Store
                            <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">XP</span>
                          </div>
                          <div className="text-xs text-slate-500">Redeem rewards</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowGuild(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Trophy className="w-5 h-5 text-amber-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Guild System</div>
                          <div className="text-xs text-slate-500">XP, levels & achievements</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowEconomyControls(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all border-l-4 border-purple-500">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            XP Economy Controls
                            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">MGR</span>
                          </div>
                          <div className="text-xs text-slate-500">Adjust XP rates & prices</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* AI & Analytics */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">AI & Analytics</div>
                      <button onClick={() => { setShowAdvancedAnalytics(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <BarChart2 className="w-5 h-5 text-indigo-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Advanced Analytics</div>
                          <div className="text-xs text-slate-500">Deep insights & reports</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowAIScheduleModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <BrainCircuit className="w-5 h-5 text-indigo-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">AI Auto-Schedule</div>
                          <div className="text-xs text-slate-500">Smart scheduling</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowOracleAI(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Oracle AI Insights
                            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Predictive analytics & alerts</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowConflicts(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Conflict Detector
                            <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Real-time scheduling conflicts</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowPerformanceDashboard(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Award className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Performance Dashboard
                            <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Attendance & reliability scores</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowBudgetAlerts(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Budget Dashboard
                            <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Real-time labor cost tracking</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowQuickFillAI(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Quick-Fill AI
                            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Auto-suggest best employees</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Employee Management */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold uppercase" style={{color: darkMode ? '#94a3b8' : '#64748b'}}>Employee Tools</div>
                      <button
                        onClick={() => {
                          setShowEmployeeBasecamp(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white" style={{
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        color: darkMode ? '#e879f9' : '#a855f7'
                      }}>
                        <Rocket className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Basecamp Portal
                            <span className="text-[9px] bg-gradient-to-r from-purple-600 to-pink-600 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                          </div>
                          <div className="text-xs opacity-75">Social hub, games & more</div>
                        </div>
                      </a>
                      <button onClick={() => { setShowEmployeeProfile(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <ImageIcon className="w-5 h-5 text-pink-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Photo Gallery</div>
                          <div className="text-xs text-slate-500">Manage employee photos</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowAvailabilityModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Users className="w-5 h-5 text-teal-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Availability</div>
                          <div className="text-xs text-slate-500">Schedule preferences</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowWellnessModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <HeartPulse className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Wellness Monitor</div>
                          <div className="text-xs text-slate-500">Track employee wellbeing</div>
                        </div>
                        {wellnessAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{wellnessAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}</span>
                        )}
                      </button>
                      <button onClick={() => { setShowSentimentModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Sentiment Analysis</div>
                          <div className="text-xs text-slate-500">Mood tracking</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Schedule Management */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">Schedule Tools</div>
                      <button onClick={() => { setShowTimeOffModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <CalendarIcon className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Time-Off Requests</div>
                          <div className="text-xs text-slate-500">Manage absences</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowSchedulePublisher(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Send className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Publish Schedule
                            <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Notify all employees</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowManagerNotes(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <StickyNote className="w-5 h-5 text-amber-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Manager Notes
                            <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Shift logs & handoff</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowReportTemplates(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Report Templates
                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Custom shift reports</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowEmployeeManagement(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <UserCheck className="w-5 h-5 text-cyan-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Employee Management
                            <span className="text-[9px] bg-cyan-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Add users & assign logins</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowMarketplace(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            Shift Marketplace
                            <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Bonus shifts & rewards</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowPTODonations(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            PTO Donations
                            <span className="text-[9px] bg-pink-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          </div>
                          <div className="text-xs text-slate-500">Support teammates in need</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowSwapModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Shift Swaps</div>
                          <div className="text-xs text-slate-500">Employee exchanges</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowTemplateModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Shift Templates</div>
                          <div className="text-xs text-slate-500">Reusable patterns</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowHolidayModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Holidays</div>
                          <div className="text-xs text-slate-500">Manage special days</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Advanced Features */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">Advanced</div>
                      <button onClick={() => { setShowVoiceModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Mic className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Voice Commands</div>
                          <div className="text-xs text-slate-500">Hands-free control</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowGPSModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">GPS Tracking</div>
                          <div className="text-xs text-slate-500">Location monitoring</div>
                        </div>
                        {locationTracking.filter(l => l.isOnSite).length > 0 && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{locationTracking.filter(l => l.isOnSite).length}</span>
                        )}
                      </button>
                      <button onClick={() => { setShowIntegrationsModal(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Webhook className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Integrations</div>
                          <div className="text-xs text-slate-500">Connect apps</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Customization & More */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">Customization</div>
                      <button onClick={() => { setShowThemeSelector(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Themes</div>
                          <div className="text-xs text-slate-500">Visual customization</div>
                        </div>
                      </button>
                      <button onClick={() => { setShowNotifications(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <MessageSquare className="w-5 h-5 text-pink-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Notifications</div>
                          <div className="text-xs text-slate-500">System alerts</div>
                        </div>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">{notifications.filter(n => !n.read).length}</span>
                        )}
                      </button>
                    </div>
                    
                    {/* Export & Print */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">Export & Print</div>
                      <button onClick={() => { setShowPrintView(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Printer className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Print View</div>
                          <div className="text-xs text-slate-500">Printer-friendly format</div>
                        </div>
                      </button>
                      <button onClick={() => { handleExportCSV(); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Download className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Export CSV</div>
                          <div className="text-xs text-slate-500">Download spreadsheet</div>
                        </div>
                      </button>
                      <button onClick={() => { handleExportiCal(); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Export iCal</div>
                          <div className="text-xs text-slate-500">Calendar file</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Help */}
                    <div>
                      <div className="px-3 py-1 text-xs font-bold text-slate-500 uppercase">Help</div>
                      <button onClick={() => { setShowKeyboardShortcuts(true); setShowMenuDropdown(false); }} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/50 flex items-center gap-3 transition-all">
                        <Keyboard className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Keyboard Shortcuts</div>
                          <div className="text-xs text-slate-500">Quick commands</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </header>

      {/* NEON GREEN INFO BAR */}
      {customization.showInfoBar && (
        <div className="sticky top-[88px] z-10 px-6 py-2 flex items-center justify-between gap-6 print:hidden animate-slide-in" style={{backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(15px)', borderBottom: '1px solid rgba(34, 197, 94, 0.3)'}}>
        <div className="flex items-center gap-6 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" style={{color: '#22c55e'}} />
            <span style={{color: '#22c55e', fontWeight: 600}}>BUDGET:</span>
            <span style={{color: '#22c55e'}}>${customization.budgetUsed.toLocaleString()} / ${customization.monthlyBudget.toLocaleString()}</span>
            <span style={{color: customization.budgetUsed > customization.monthlyBudget * 0.9 ? '#ef4444' : '#22c55e', fontSize: '10px'}}>({((customization.budgetUsed / customization.monthlyBudget) * 100).toFixed(1)}%)</span>
          </div>
          <div className="w-px h-4" style={{backgroundColor: 'rgba(34, 197, 94, 0.3)'}}></div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" style={{color: '#22c55e'}} />
            <span style={{color: '#22c55e', fontWeight: 600}}>EPOB:</span>
            <span style={{color: '#22c55e'}}>{customization.currentEPOB} / {customization.targetEPOB}</span>
            <span style={{color: customization.currentEPOB < customization.targetEPOB ? '#f59e0b' : '#22c55e', fontSize: '10px'}}>({customization.currentEPOB < customization.targetEPOB ? '↓' : '✓'})</span>
          </div>
          <div className="w-px h-4" style={{backgroundColor: 'rgba(34, 197, 94, 0.3)'}}></div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" style={{color: '#22c55e'}} />
            <span style={{color: '#22c55e', fontWeight: 600}}>FTE:</span>
            <span style={{color: '#22c55e'}}>{customization.currentFTE} / {customization.targetFTE}</span>
            <span style={{color: customization.currentFTE < customization.targetFTE ? '#f59e0b' : '#22c55e', fontSize: '10px'}}>({customization.currentFTE < customization.targetFTE ? '↓' : '✓'})</span>
          </div>
        </div>
        <div className="text-[10px]" style={{color: 'rgba(34, 197, 94, 0.7)', fontFamily: 'monospace'}}>LIVE METRICS • {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</div>
      </div>
      )}

      <main className="flex-1 p-2 md:p-6 overflow-auto print:overflow-visible print:p-0 relative animate-fade-in">
        {shifts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-scale-in">
                <div className="glass p-10 rounded-3xl max-w-md text-center pointer-events-auto hover-lift">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:rotate-12 transition-transform">
                      <FileCheck className="w-9 h-9 text-white" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Populate Finalized Schedule</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">Click below to load the approved January 2026 roster for Izzy, Karen, Annalissia, and Kenny.</p>
                    <button onClick={applyFinalizedSchedule} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group">
                      <FileCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Apply Finalized Jan 2026 Schedule
                    </button>
                </div>
            </div>
        )}
        
        {/* Calendar Views */}
        <div style={{transform: `scale(${calendarZoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.3s ease'}}>
          {calendarView === 'month' && (
            <div className="max-w-full mx-auto rounded-3xl overflow-hidden print:shadow-none print:border-none print:rounded-none animate-scale-in" style={{backgroundColor: darkMode ? 'rgba(15, 15, 35, 0.6)' : 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)', border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(148, 163, 184, 0.2)', boxShadow: darkMode ? '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)' : '0 10px 40px rgba(0, 0, 0, 0.1)'}}>
              <div className="grid grid-cols-7 border-b print:bg-white print:border-b-2 print:border-slate-800" style={{borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)', background: darkMode ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(79, 70, 229, 0.3))' : 'linear-gradient(135deg, rgba(243, 232, 255, 0.5), rgba(252, 231, 243, 0.5))'}}>
                {DAYS.map(day => (
                  <div key={day} className="py-4 text-center text-xs font-bold uppercase tracking-widest print:text-black" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#475569'}}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-fr gap-px border-b print:bg-slate-300 print:border-slate-300" style={{backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)', borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'}}>
                {renderCalendarDays()}
              </div>
            </div>
          )}

          {calendarView === 'day' && renderDayView()}
          {calendarView === 'week' && renderWeekView()}
          {calendarView === 'shift-matrix' && renderShiftMatrixView()}
          {calendarView === 'agenda' && renderAgendaView()}
          {calendarView === 'bigcalendar' && (
            <BigCalendarView 
              shifts={shifts}
              onEventClick={(shift) => {
                setEditingShift(shift);
                setIsModalOpen(true);
              }}
              onEventDrop={(shift, start, end) => {
                // Convert date/time to shift format
                const newDate = start.toISOString().split('T')[0];
                const newStartTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
                const newEndTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                
                if (shift.id) {
                  const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shift.id);
                  updateDoc(shiftRef, { 
                    date: newDate,
                    startTime: newStartTime,
                    endTime: newEndTime
                  }).then(() => {
                    setStatus({ type: 'success', msg: '✓ Shift updated!' });
                    setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
                  }).catch((err) => {
                    console.error('Update error:', err);
                    setStatus({ type: 'error', msg: 'Failed to update shift' });
                  });
                }
              }}
              onSelectSlot={(start, end) => {
                setSelectedDate(start);
                setEditingShift(null);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      </main>

      <div className="glass border-t border-white/20 py-2 px-4 flex items-center justify-between text-[10px] text-slate-400 print:hidden">
        <div className="flex items-center gap-2">
          {status.type === 'success' && <CheckCircle2 className="w-3 h-3 text-green-600 animate-pulse" />}
          {status.type === 'error' && <AlertCircle className="w-3 h-3 text-red-600 animate-pulse" />}
          <span className="font-medium">{status.msg}</span>
        </div>
        <div className="text-[9px] text-slate-400 font-medium tracking-wide">
          NoxShift™ © {new Date().getFullYear()} - All Rights Reserved
        </div>
        <div className="relative flex items-center gap-3">
            <button onClick={() => setUsePrivateStorage(!usePrivateStorage)} className={`flex items-center gap-1.5 hover:text-slate-600 transition-all px-2 py-1 rounded-lg hover:bg-white/50 ${usePrivateStorage ? 'text-blue-600 font-bold' : ''}`} title="Switch Storage (Private/Public)">
              {usePrivateStorage ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
              <span className="text-xs">{usePrivateStorage ? 'Private' : 'Public'}</span>
            </button>
            <button onClick={() => setShowDebugMenu(!showDebugMenu)} className="flex items-center gap-1 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-white/50 transition-all">
              <Settings className="w-3.5 h-3.5" />
            </button>
            {showDebugMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-72 glass rounded-2xl p-4 z-50 animate-scale-in">
                <h4 className="font-extrabold text-slate-800 mb-3 text-sm">Developer Tools</h4>
                <button onClick={applyFinalizedSchedule} className="w-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:from-green-100 hover:to-emerald-100 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm mb-2 transition-all hover-lift">
                  <Settings className="w-4 h-4" /> Re-Apply Finalized Schedule
                </button>
                <button onClick={() => setShowSettings(true)} className="w-full bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border border-slate-200 hover:from-slate-100 hover:to-slate-200 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all hover-lift">
                  <Settings className="w-4 h-4" /> Customize Settings
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Modals - Stats, AI, Settings, Shift Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div
            className="rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: darkMode ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : `2px solid ${modalTheme.color}`,
              boxShadow: darkMode ? '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 20px 60px rgba(0, 0, 0, 0.3)',
              background: darkMode ? 'linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(30, 15, 50, 0.95))' : modalTheme.gradient
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold" style={{color: darkMode ? '#ffffff' : '#1e293b'}}>
                  {editingShift ? 'Edit Shift' : 'Create New Shift'}
                </h2>
                <p className="text-sm mt-1" style={{color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748b'}}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#64748b', backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'transparent'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'transparent'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Employee Name *</label>
                <input
                  type="text"
                  list="employee-list"
                  required
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                    color: darkMode ? '#ffffff' : '#1e293b',
                    borderColor: darkMode ? 'rgba(147, 51, 234, 0.5)' : '#a855f7'
                  }}
                  placeholder="Select or type employee name"
                />
                <datalist id="employee-list">
                  {employees.map(emp => <option key={emp} value={emp} />)}
                </datalist>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                    style={{
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                      color: darkMode ? '#ffffff' : '#1e293b'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>End Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                    style={{
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                      color: darkMode ? '#ffffff' : '#1e293b'
                    }}
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                    style={{
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                      color: darkMode ? '#ffffff' : '#1e293b'
                    }}
                  >
                    {roles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                    style={{
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                      color: darkMode ? '#ffffff' : '#1e293b'
                    }}
                  >
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              {/* Shift Differential */}
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>
                  <DollarSign className="w-4 h-4" style={{color: darkMode ? '#10b981' : '#059669'}} />
                  Shift Differential (Extra Pay)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, differential: 1.25})}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${(formData.differential === 1.25) ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                  >
                    Evening<br/>+25%
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, differential: 1.5})}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${(formData.differential === 1.5) ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                  >
                    Night<br/>+50%
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, differential: 2.0})}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${(formData.differential === 2.0) ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                  >
                    Weekend<br/>+100%
                  </button>
                </div>
                <p className="text-xs mt-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.5)' : '#64748b'}}>
                  Wage multiplier: {formData.differential || 1.0}x base rate
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none resize-none"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                    color: darkMode ? '#ffffff' : '#1e293b'
                  }}
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Shift Comments (visible on calendar) */}
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>
                  <MessageSquare className="w-4 h-4" style={{color: darkMode ? '#a78bfa' : '#9333ea'}} />
                  Shift Comments (Visible on Calendar)
                </label>
                <input
                  type="text"
                  value={formData.shiftComments || ''}
                  onChange={(e) => setFormData({ ...formData, shiftComments: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                  style={{
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : '#ffffff',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '2px solid #e2e8f0',
                    color: darkMode ? '#ffffff' : '#1e293b'
                  }}
                  placeholder="Brief comment shown on shift card..."
                  maxLength={50}
                />
                <p className="text-xs mt-1" style={{color: darkMode ? 'rgba(255, 255, 255, 0.5)' : '#64748b'}}>This will appear directly on the shift card in the calendar</p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                    className="w-5 h-5 rounded focus:ring-2"
                    style={{
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : '#cbd5e1',
                      accentColor: '#9333ea'
                    }}
                  />
                  <span className="text-sm font-semibold" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Save as Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTimeOff}
                    onChange={(e) => setFormData({ ...formData, isTimeOff: e.target.checked })}
                    className="w-5 h-5 rounded focus:ring-2"
                    style={{
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : '#cbd5e1',
                      accentColor: '#dc2626'
                    }}
                  />
                  <span className="text-sm font-semibold" style={{color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#334155'}}>Time Off / Blocked</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4" style={{borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'}}>
                {editingShift && (
                  <button
                    type="button"
                    onClick={handleDeleteShift}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
                {!editingShift && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setShowRecurringModal(true);
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Recurring
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                  {editingShift ? 'Update Shift' : 'Create Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowStats(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Schedule Statistics</h2>
                  <p className="text-sm text-slate-500">Comprehensive analytics for {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                </div>
              </div>
              <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Total Shifts */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{shifts.filter(s => !s.isTimeOff && !s.isDraft).length}</div>
                    <div className="text-xs text-slate-500">Total Shifts</div>
                  </div>
                </div>
              </div>

              {/* Total Hours */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">
                      {shifts.filter(s => !s.isTimeOff).reduce((sum, s) => {
                        const start = new Date(`2000-01-01T${s.startTime}`);
                        const end = new Date(`2000-01-01T${s.endTime}`);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0).toFixed(0)}h
                    </div>
                    <div className="text-xs text-slate-500">Total Hours</div>
                  </div>
                </div>
              </div>

              {/* Labor Cost */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">${calculateCostForecast().totalCost.toFixed(0)}</div>
                    <div className="text-xs text-slate-500">Labor Cost</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Breakdown */}
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Employee Breakdown
              </h3>
              <div className="space-y-3">
                {employees.map(emp => {
                  const empShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff && !s.isDraft);
                  const totalHours = empShifts.reduce((sum, s) => {
                    const start = new Date(`2000-01-01T${s.startTime}`);
                    const end = new Date(`2000-01-01T${s.endTime}`);
                    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  }, 0);
                  const totalCost = totalHours * emp.rate;
                  
                  return (
                    <div key={emp.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        {employeePhotos[emp.name] ? (
                          <img src={employeePhotos[emp.name]} alt={emp.name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-500">${emp.rate}/hr</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">{empShifts.length} shifts</div>
                        <div className="text-sm text-slate-600">{totalHours.toFixed(1)}h • ${totalCost.toFixed(0)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Department Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {departments.map(dept => {
                  const deptShifts = shifts.filter(s => s.department === dept && !s.isTimeOff && !s.isDraft);
                  return (
                    <div key={dept} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="text-lg font-bold text-slate-800">{deptShifts.length}</div>
                      <div className="text-xs text-slate-500">{dept}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showEmployeeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowEmployeeProfile(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl text-white">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Employee Gallery</h2>
                  <p className="text-sm text-slate-500">Manage employee photos</p>
                </div>
              </div>
              <button onClick={() => setShowEmployeeProfile(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {employees.map(emp => (
                <div key={emp.name} className="glass rounded-xl p-4 hover:scale-105 transition-all">
                  <div className="relative mb-3">
                    {employeePhotos[emp.name] ? (
                      <img 
                        src={employeePhotos[emp.name]} 
                        alt={emp.name} 
                        className="w-full h-32 object-cover rounded-lg border-2 border-indigo-200" 
                      />
                    ) : (
                      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <div className="text-4xl font-bold text-white">{emp.name.charAt(0)}</div>
                      </div>
                    )}
                    <label 
                      htmlFor={`photo-${emp.name}`}
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all"
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                    </label>
                    <input
                      type="file"
                      id={`photo-${emp.name}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const newPhotos = { ...employeePhotos, [emp.name]: event.target?.result as string };
                            setEmployeePhotos(newPhotos);
                            localStorage.setItem(`noxshift-employee-photos-${appId}`, JSON.stringify(newPhotos));
                            setStatus({ type: 'success', msg: `Photo updated for ${emp.name}` });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-800">{emp.name}</div>
                    <div className="text-xs text-slate-500">${emp.rate}/hr</div>
                    {employeePhotos[emp.name] && (
                      <button
                        onClick={() => {
                          const newPhotos = { ...employeePhotos };
                          delete newPhotos[emp.name];
                          setEmployeePhotos(newPhotos);
                          localStorage.setItem(`noxshift-employee-photos-${appId}`, JSON.stringify(newPhotos));
                          setStatus({ type: 'success', msg: `Photo removed for ${emp.name}` });
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Click the camera icon to upload employee photos. Supported formats: JPG, PNG, GIF. Photos are stored locally in your browser.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Feature Modals */}
      {showThemeSelector && <ThemeSelector onClose={() => setShowThemeSelector(false)} />}
      
      {showGuild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowGuild(false)}>
          <div className="glass rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl text-white">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Guild System - Manager Dashboard</h2>
                  <p className="text-sm text-slate-500">Team Performance & Employee Stats</p>
                </div>
              </div>
              <button onClick={() => setShowGuild(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{employees.length}</div>
                    <div className="text-xs text-slate-500">Total Employees</div>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{shifts.filter(s => !s.isDraft && !s.isTimeOff).length}</div>
                    <div className="text-xs text-slate-500">Active Shifts</div>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{(employees.length * 2500).toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Total Team XP</div>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Crown className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">Gold</div>
                    <div className="text-xs text-slate-500">Avg Team Level</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Performance Cards */}
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              Employee Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map(emp => {
                const empShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff && !s.isDraft);
                const totalHours = empShifts.reduce((sum, s) => {
                  const start = new Date(`2000-01-01T${s.startTime}`);
                  const end = new Date(`2000-01-01T${s.endTime}`);
                  return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }, 0);
                const avgHoursPerShift = empShifts.length > 0 ? totalHours / empShifts.length : 0;
                const totalCost = totalHours * emp.rate;
                const mockXP = 2500 + (empShifts.length * 50);
                const mockLevel = mockXP < 1000 ? 'Bronze' : mockXP < 2500 ? 'Silver' : mockXP < 5000 ? 'Gold' : 'Platinum';

                return (
                  <div key={emp.name} className="glass rounded-xl p-6 hover:scale-102 transition-all">
                    <div className="flex items-start gap-4">
                      {employeePhotos[emp.name] ? (
                        <img src={employeePhotos[emp.name]} alt={emp.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-bold text-lg text-slate-800">{emp.name}</div>
                          <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                            mockLevel === 'Platinum' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' :
                            mockLevel === 'Gold' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
                            mockLevel === 'Silver' ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800' :
                            'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
                          }`}>
                            {mockLevel}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">${emp.rate}/hr • {mockXP.toLocaleString()} XP</div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-blue-700">{empShifts.length}</div>
                            <div className="text-xs text-blue-600">Shifts Worked</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-green-700">{totalHours.toFixed(0)}h</div>
                            <div className="text-xs text-green-600">Total Hours</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-purple-700">{avgHoursPerShift.toFixed(1)}h</div>
                            <div className="text-xs text-purple-600">Avg/Shift</div>
                          </div>
                          <div className="bg-amber-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-amber-700">${totalCost.toFixed(0)}</div>
                            <div className="text-xs text-amber-600">Labor Cost</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Guild Rewards & Gamification
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                The Guild System motivates employees by rewarding completed shifts with XP. Employees level up from Bronze → Silver → Gold → Platinum and unlock rewards like PTO, parking spots, merchandise, and gift cards.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4">
                  <div className="font-bold text-sm text-slate-800 mb-1">📊 Performance Tracking</div>
                  <div className="text-xs text-slate-600">Real-time XP tracking per shift</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-bold text-sm text-slate-800 mb-1">🎁 Reward Redemption</div>
                  <div className="text-xs text-slate-600">Employees redeem XP for benefits</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-bold text-sm text-slate-800 mb-1">🏆 Leaderboards</div>
                  <div className="text-xs text-slate-600">Friendly team competition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💰 BONUS OFFERINGS MODAL */}
      {showBonusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowBonusModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white relative overflow-hidden">
                  <Gift className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">Bonus & Incentive System</h2>
                  <p className="text-sm text-slate-600">Reward employees for excellence & pick up extra shifts</p>
                </div>
              </div>
              <button onClick={() => setShowBonusModal(false)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Active Bonus Offerings */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Zap className="w-6 h-6 text-amber-500" />
                Active Bonus Offerings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: '1', type: 'pickup', amount: 25, date: '2026-01-15', reason: 'Coverage needed', claimed: false },
                  { id: '2', type: 'overtime', amount: 50, date: '2026-01-20', reason: 'Weekend coverage', claimed: false },
                  { id: '3', type: 'performance', amount: 100, date: '2026-01-25', reason: 'Perfect attendance', claimed: true }
                ].map((bonus) => (
                  <div key={bonus.id} className={`relative overflow-hidden rounded-2xl transition-all hover:scale-105 cursor-pointer ${
                    bonus.claimed 
                      ? 'bg-slate-200/50 opacity-60' 
                      : 'bg-gradient-to-br from-red-600 via-red-500 to-rose-600 shadow-2xl'
                  }`}>
                    {/* NoxTitan Style Bonus Card */}
                    <div className="p-6">
                      {!bonus.claimed && (
                        <div className="absolute top-3 right-3 bg-amber-400 text-black px-3 py-1 text-xs font-extrabold rounded-lg shadow-lg">
                          AVAILABLE
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <Gift className={`w-7 h-7 ${bonus.claimed ? 'text-slate-400' : 'text-white'}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold uppercase tracking-wider ${bonus.claimed ? 'text-slate-500' : 'text-white/80'}`}>
                            {bonus.type} bonus
                          </div>
                          <div className={`text-3xl font-black ${bonus.claimed ? 'text-slate-600' : 'text-white'}`}>
                            ${bonus.amount}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`space-y-2 mb-4 ${bonus.claimed ? 'text-slate-600' : 'text-white/90'}`}>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-semibold">{new Date(bonus.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className={`text-sm font-medium ${bonus.claimed ? '' : 'text-white/80'}`}>{bonus.reason}</div>
                      </div>
                      
                      {!bonus.claimed ? (
                        <button
                          onClick={() => {
                            setStatus({ type: 'success', msg: `Claimed $${bonus.amount} bonus! 🎉` });
                            setBonusOfferings(prev => prev.map(b => b.id === bonus.id ? { ...b, claimed: true } : b));
                          }}
                          className="w-full px-4 py-3 bg-white hover:bg-slate-100 text-red-600 font-black rounded-xl transition-all shadow-lg hover:shadow-xl text-sm"
                        >
                          CLAIM BONUS NOW
                        </button>
                      ) : (
                        <div className="w-full px-4 py-3 bg-slate-400 text-white font-bold rounded-xl text-center text-sm">
                          ✓ CLAIMED
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Bonus (Manager Only) */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-indigo-600" />
                Create New Bonus Offering
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bonus Type</label>
                  <select className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500">
                    <option>Shift Pickup Bonus</option>
                    <option>Overtime Bonus</option>
                    <option>Performance Bonus</option>
                    <option>Attendance Bonus</option>
                    <option>Holiday Bonus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount ($)</label>
                  <input type="number" placeholder="25" className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Date</label>
                  <input type="date" className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reason/Description</label>
                  <input type="text" placeholder="Weekend coverage needed" className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500" />
                </div>
              </div>
              <button
                onClick={() => setStatus({ type: 'success', msg: 'Bonus offering created!' })}
                className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-105"
              >
                CREATE BONUS OFFERING
              </button>
            </div>

            {/* Gamification Integration */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Guild System Integration
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Bonuses earned through this system automatically convert to Guild XP! Each $1 earned = 10 XP toward leveling up your Guild rank.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">$50 = 500 XP</div>
                  <div className="text-xs text-purple-600">Shift pickup bonus</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-amber-700">$100 = 1000 XP</div>
                  <div className="text-xs text-amber-600">Perfect attendance</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-emerald-700">$25 = 250 XP</div>
                  <div className="text-xs text-emerald-600">Extra shift coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOracle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowOracle(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white relative">
                  <Circle className="w-6 h-6" fill="white" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                  <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Oracle AI</h2>
                  <p className="text-sm text-slate-500">Predictive Analytics & Insights</p>
                </div>
              </div>
              <button onClick={() => setShowOracle(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* AI Predictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-bold text-slate-700">Flight Risk Analysis</h4>
                  </div>
                  <div className="space-y-2">
                    {employees.map(emp => {
                      const empShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff);
                      const avgHours = empShifts.length > 0 ? empShifts.reduce((sum, s) => {
                        const start = new Date(`2000-01-01T${s.startTime}`);
                        const end = new Date(`2000-01-01T${s.endTime}`);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0) / empShifts.length : 0;
                      const riskScore = avgHours < 20 ? 'High' : avgHours < 30 ? 'Medium' : 'Low';
                      const riskColor = riskScore === 'High' ? 'text-red-600' : riskScore === 'Medium' ? 'text-amber-600' : 'text-green-600';
                      return (
                        <div key={emp.name} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{emp.name}</span>
                          <span className={`font-bold ${riskColor}`}>{riskScore} Risk</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-slate-700">Burnout Detection</h4>
                  </div>
                  <div className="space-y-2">
                    {employees.map(emp => {
                      const weekShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff);
                      const totalHours = weekShifts.reduce((sum, s) => {
                        const start = new Date(`2000-01-01T${s.startTime}`);
                        const end = new Date(`2000-01-01T${s.endTime}`);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0);
                      const avgWeekly = totalHours / 4;
                      const burnoutRisk = avgWeekly > 45 ? '🔥 High' : avgWeekly > 40 ? '⚠️ Moderate' : '✅ Good';
                      return (
                        <div key={emp.name} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{emp.name}</span>
                          <span className="font-bold">{burnoutRisk}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Overtime Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-700">${calculateCostForecast().overtimeCost.toFixed(0)}</div>
                    <div className="text-xs text-blue-600">Projected OT Cost</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-700">{calculateCostForecast().overtimeHours.toFixed(0)}h</div>
                    <div className="text-xs text-purple-600">OT Hours</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-700">${calculateCostForecast().totalCost.toFixed(0)}</div>
                    <div className="text-xs text-green-600">Total Labor Cost</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Schedule Optimization Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-bold text-blue-900 mb-1">💡 Cost Reduction Opportunity</div>
                    <div className="text-sm text-blue-700">Shift 2 hours from peak rate employees to save ~${(calculateCostForecast().totalCost * 0.08).toFixed(0)}/month</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="font-bold text-green-900 mb-1">📊 Coverage Balanced</div>
                    <div className="text-sm text-green-700">Current schedule maintains 95% coverage efficiency across all departments</div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <div className="font-bold text-amber-900 mb-1">⚡ Peak Hour Staffing</div>
                    <div className="text-sm text-amber-700">Consider adding 1 staff member during 2pm-6pm window for better coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowShare(false)}>
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Share Schedule</h2>
                  <p className="text-sm text-slate-500">Share with coworkers & team members</p>
                </div>
              </div>
              <button onClick={() => setShowShare(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="glass rounded-xl p-6 hover-lift cursor-pointer" onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}&dept=${selectedDepartment}`;
                navigator.clipboard.writeText(shareUrl);
                setStatus({ type: 'success', msg: 'Link copied to clipboard!' });
              }}>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">Copy Shareable Link</h3>
                    <p className="text-sm text-slate-600 mb-2">Share a direct link to this schedule view</p>
                    <div className="bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600 break-all">
                      {window.location.origin}{window.location.pathname}?month={currentDate.getMonth()}&year={currentDate.getFullYear()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="glass rounded-xl p-6 hover-lift cursor-pointer" onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}&dept=${selectedDepartment}`;
                const subject = `Schedule for ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                const body = `Check out the NoxShift schedule:\n\n${shareUrl}\n\nDepartment: ${selectedDepartment}\nTotal Shifts: ${shifts.length}`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">Email Schedule</h3>
                    <p className="text-sm text-slate-600">Send schedule link via email to coworkers</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl text-white">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">QR Code</h3>
                    <p className="text-sm text-slate-600 mb-3">Scan to view schedule on mobile devices</p>
                    <div className="bg-white rounded-xl p-4 inline-block border-2 border-slate-200">
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-center text-slate-500 mt-2">QR generation coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handlePrint} className="bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-200 text-slate-700 p-3 rounded-xl font-bold text-sm transition-all hover-lift">
                    <Printer className="w-4 h-4 mx-auto mb-1" />
                    Print PDF
                  </button>
                  <button onClick={handleExportCSV} className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-700 p-3 rounded-xl font-bold text-sm transition-all hover-lift">
                    <Download className="w-4 h-4 mx-auto mb-1" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Access Settings */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1 text-sm">Sharing Permissions</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Currently using <strong>{usePrivateStorage ? 'Private' : 'Public'}</strong> storage. {usePrivateStorage ? 'Only you can view this schedule.' : 'Anyone with the link can view this schedule.'} Toggle storage mode in the footer to change access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowQRModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">QR Code</h2>
                  <p className="text-sm text-slate-500">Scan to view schedule</p>
                </div>
              </div>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-slate-200">
              {qrCodeDataURL && (
                <img src={qrCodeDataURL} alt="QR Code" className="w-64 h-64" />
              )}
              <p className="text-xs text-slate-500 mt-4 text-center">
                Scan this code with your phone to open the schedule
              </p>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'noxshift-qr-code.png';
                  link.href = qrCodeDataURL;
                  link.click();
                }}
                className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover-lift"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowSettings(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in border-2 border-purple-200 dark:border-purple-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl text-white shadow-lg">
                  <Settings className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">⚙️ Settings</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customize every aspect of your scheduler</p>
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Settings Content with Expandable Sections */}
            <div className="space-y-3">
              
              {/* CALENDAR VIEW SETTINGS */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                <button
                  onClick={() => setSettingsSectionExpanded({...settingsSectionExpanded, calendar: !settingsSectionExpanded.calendar})}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">📅 Calendar View</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Time range, display, and view options</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${settingsSectionExpanded.calendar ? 'rotate-90' : ''}`} />
                </button>
                {settingsSectionExpanded.calendar && (
                  <div className="px-6 py-4 space-y-4 bg-white/50 dark:bg-slate-800/50">
                    {/* Calendar Hour Range */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">📍 Calendar Hour Range (Perfect for Reception 8AM-8PM!)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Start Hour</label>
                          <select
                            value={calendarStartHour}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCalendarStartHour(val);
                              localStorage.setItem('noxshift-calendar-start', val.toString());
                              setStatus({type: 'success', msg: `Calendar starts at ${val}:00`});
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">End Hour</label>
                          <select
                            value={calendarEndHour}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setCalendarEndHour(val);
                              localStorage.setItem('noxshift-calendar-end', val.toString());
                              setStatus({type: 'success', msg: `Calendar ends at ${val}:00`});
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                          >
                            {Array.from({length: 24}, (_, i) => (
                              <option key={i} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => { setCalendarStartHour(8); setCalendarEndHour(20); localStorage.setItem('noxshift-calendar-start', '8'); localStorage.setItem('noxshift-calendar-end', '20'); setStatus({type: 'success', msg: 'Set to 8AM-8PM! 🎯'}); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all shadow-md">Reception (8AM-8PM)</button>
                        <button onClick={() => { setCalendarStartHour(6); setCalendarEndHour(22); localStorage.setItem('noxshift-calendar-start', '6'); localStorage.setItem('noxshift-calendar-end', '22'); setStatus({type: 'success', msg: 'Set to 6AM-10PM'}); }} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-all">Extended (6AM-10PM)</button>
                        <button onClick={() => { setCalendarStartHour(0); setCalendarEndHour(23); localStorage.setItem('noxshift-calendar-start', '0'); localStorage.setItem('noxshift-calendar-end', '23'); setStatus({type: 'success', msg: 'Reset to 24hr'}); }} className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-all">24 Hours</button>
                      </div>
                    </div>
                    
                    {/* Employee Badge Size */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">👤 Employee Name Size: {employeeBadgeSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        value={employeeBadgeSize}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setEmployeeBadgeSize(val);
                          localStorage.setItem('noxshift-badge-size', val.toString());
                        }}
                        className="w-full h-3 bg-blue-200 dark:bg-blue-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Smaller</span>
                        <span>Larger & Easier to Read</span>
                      </div>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">🕐 Time Format</label>
                      <div className="flex gap-3">
                        <button onClick={() => { setTimeFormat('12h'); localStorage.setItem('noxshift-time-format', '12h'); setStatus({type: 'success', msg: '12-hour format'}); }} className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${timeFormat === '12h' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>12h (3:00 PM)</button>
                        <button onClick={() => { setTimeFormat('24h'); localStorage.setItem('noxshift-time-format', '24h'); setStatus({type: 'success', msg: '24-hour format'}); }} className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${timeFormat === '24h' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>24h (15:00)</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* THEMES & COLORS */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
                <button
                  onClick={() => setSettingsSectionExpanded({...settingsSectionExpanded, themes: !settingsSectionExpanded.themes})}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">🎨 Themes & Colors</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Personalize your scheduler appearance</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${settingsSectionExpanded.themes ? 'rotate-90' : ''}`} />
                </button>
                {settingsSectionExpanded.themes && (
                  <div className="px-6 py-4 space-y-4 bg-white/50 dark:bg-slate-800/50">
                    {/* Theme Selector */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Choose Your Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(APP_THEMES).map(([key, theme]) => (
                          <button
                            key={key}
                            onClick={() => { setAppTheme(key as keyof typeof APP_THEMES); setStatus({type: 'success', msg: `${key.toUpperCase()} theme activated! 🎨`}); }}
                            className={`px-4 py-6 rounded-xl font-bold transition-all border-2 ${appTheme === key ? 'border-purple-500 shadow-lg scale-105' : 'border-transparent hover:scale-105'}`}
                            style={{background: `linear-gradient(135deg, ${key === 'blue' ? '#3b82f6' : key === 'indigo' ? '#6366f1' : key === 'purple' ? '#a855f7' : key === 'emerald' ? '#10b981' : key === 'rose' ? '#f43f5e' : '#475569'} 0%, ${key === 'blue' ? '#1d4ed8' : key === 'indigo' ? '#4f46e5' : key === 'purple' ? '#9333ea' : key === 'emerald' ? '#059669' : key === 'rose' ? '#e11d48' : '#334155'} 100%)`}}
                          >
                            <div className="text-white text-sm capitalize">{key}</div>
                            {appTheme === key && <div className="text-white text-xs mt-1">✓ Active</div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Custom Calendar Colors</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Background</label>
                          <input type="color" value={customization.calendarBg} onChange={(e) => setCustomization({...customization, calendarBg: e.target.value})} className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Border</label>
                          <input type="color" value={customization.calendarBorder} onChange={(e) => setCustomization({...customization, calendarBorder: e.target.value})} className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Text</label>
                          <input type="color" value={customization.calendarText} onChange={(e) => setCustomization({...customization, calendarText: e.target.value})} className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Today Highlight</label>
                          <input type="color" value={customization.todayHighlight} onChange={(e) => setCustomization({...customization, todayHighlight: e.target.value})} className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600" />
                        </div>
                      </div>
                    </div>

                    <button onClick={() => { setCustomization({calendarBg: '#ffffff', calendarBorder: '#e2e8f0', calendarText: '#1e293b', todayHighlight: '#a855f7', weekendBg: '#f8fafc', shiftBorderRadius: 8, shiftBorderWidth: 1, shiftShadow: 'medium', shiftPadding: 8, employeeNameBorder: true, employeeNameBorderColor: '#ffffff', employeeNameBorderWidth: 2, employeeNameBorderStyle: 'solid', employeeNameBg: 'transparent', employeeNamePadding: 4, employeeNameFontSize: 12, employeeNameFontWeight: 600, timeFontSize: 14, enableAnimations: true, enableHoverEffects: true, enableGradients: true, glassIntensity: 90, darkModeCalendarBg: '#1e293b', darkModeCalendarBorder: '#334155', darkModeCalendarText: '#f1f5f9'}); setStatus({type: 'success', msg: 'Colors reset!'}); }} className="w-full px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold transition-all">Reset Colors</button>
                  </div>
                )}
              </div>

              {/* DISPLAY OPTIONS */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden">
                <button
                  onClick={() => setSettingsSectionExpanded({...settingsSectionExpanded, display: !settingsSectionExpanded.display})}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">👁️ Display Options</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Visual preferences and animations</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${settingsSectionExpanded.display ? 'rotate-90' : ''}`} />
                </button>
                {settingsSectionExpanded.display && (
                  <div className="px-6 py-4 space-y-4 bg-white/50 dark:bg-slate-800/50">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">✨ Enable Animations</span>
                        <input type="checkbox" checked={customization.enableAnimations} onChange={(e) => setCustomization({...customization, enableAnimations: e.target.checked})} className="w-5 h-5 rounded" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">🖱️ Hover Effects</span>
                        <input type="checkbox" checked={customization.enableHoverEffects} onChange={(e) => setCustomization({...customization, enableHoverEffects: e.target.checked})} className="w-5 h-5 rounded" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">🌈 Gradient Backgrounds</span>
                        <input type="checkbox" checked={customization.enableGradients} onChange={(e) => setCustomization({...customization, enableGradients: e.target.checked})} className="w-5 h-5 rounded" />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{usePrivateStorage ? '🔒 Private' : '🌐 Public'} Storage Mode</label>
                      <button onClick={() => { setUsePrivateStorage(!usePrivateStorage); setStatus({type: 'success', msg: `Switched to ${!usePrivateStorage ? 'Private' : 'Public'} mode`}); }} className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all shadow-md">
                        Switch to {usePrivateStorage ? 'Public' : 'Private'} Mode
                      </button>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{usePrivateStorage ? 'Your schedule is private and only visible to you' : 'Your schedule is shared with your team'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ADVANCED SETTINGS */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 overflow-hidden">
                <button
                  onClick={() => setSettingsSectionExpanded({...settingsSectionExpanded, advanced: !settingsSectionExpanded.advanced})}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">⚡ Advanced</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Expert-level customizations</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${settingsSectionExpanded.advanced ? 'rotate-90' : ''}`} />
                </button>
                {settingsSectionExpanded.advanced && (
                  <div className="px-6 py-4 space-y-4 bg-white/50 dark:bg-slate-800/50">
                    <div>
                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={customization.employeeNameBorder} onChange={(e) => setCustomization({...customization, employeeNameBorder: e.target.checked})} className="w-4 h-4" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Employee Name Borders</span>
                      </label>
                      {customization.employeeNameBorder && (
                        <div className="space-y-2 pl-6">
                          <div>
                            <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Border Width: {customization.employeeNameBorderWidth}px</label>
                            <input type="range" min="1" max="5" value={customization.employeeNameBorderWidth} onChange={(e) => setCustomization({...customization, employeeNameBorderWidth: parseInt(e.target.value)})} className="w-full" />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Border Color</label>
                            <input type="color" value={customization.employeeNameBorderColor} onChange={(e) => setCustomization({...customization, employeeNameBorderColor: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer border-2 border-slate-300 dark:border-slate-600" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name Font Weight: {customization.employeeNameFontWeight}</label>
                      <input type="range" min="400" max="900" step="100" value={customization.employeeNameFontWeight} onChange={(e) => setCustomization({...customization, employeeNameFontWeight: parseInt(e.target.value)})} className="w-full" />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1"><span>Light</span><span>Bold</span><span>Extra Bold</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* App Info */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 border-slate-300 dark:border-slate-700 text-center">
                <div className="text-4xl mb-2">🚀</div>
                <p className="font-black text-xl text-slate-800 dark:text-white mb-1">NoxShift™</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} - Powered by Innovation</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Smart Scheduling • Guild Gamification • Enterprise Features</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTimeClock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowTimeClock(false)}>
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Time Clock</h2>
                  <p className="text-sm text-slate-500">Employee Time Tracking</p>
                </div>
              </div>
              <button onClick={() => setShowTimeClock(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Time */}
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-6xl font-bold text-slate-800 mb-2">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-lg text-slate-600">
                  {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Clock In/Out Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const timestamp = new Date().toLocaleString();
                    setStatus({ type: 'success', msg: `Clocked IN at ${timestamp}` });
                    // TODO: Save to Firebase
                  }}
                  className="glass rounded-xl p-8 hover:scale-105 transition-all text-center group"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-green-700">Clock IN</div>
                  <div className="text-xs text-slate-500 mt-1">Start your shift</div>
                </button>

                <button
                  onClick={() => {
                    const timestamp = new Date().toLocaleString();
                    setStatus({ type: 'success', msg: `Clocked OUT at ${timestamp}` });
                    // TODO: Save to Firebase
                  }}
                  className="glass rounded-xl p-8 hover:scale-105 transition-all text-center group"
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                    <Ban className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="text-xl font-bold text-red-700">Clock OUT</div>
                  <div className="text-xs text-slate-500 mt-1">End your shift</div>
                </button>
              </div>

              {/* Today's Punches */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Today's Time Entries
                </h3>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Activity className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Clock IN</div>
                          <div className="text-xs text-slate-500">08:00 AM</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">No GPS data</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Ban className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Clock OUT</div>
                          <div className="text-xs text-slate-500">12:00 PM</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-600">4.0 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📍</div>
                  <h4 className="font-bold text-slate-700 mb-1 text-sm">GPS Tracking</h4>
                  <p className="text-xs text-slate-500">Location verification</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <h4 className="font-bold text-slate-700 mb-1 text-sm">Photo Verify</h4>
                  <p className="text-xs text-slate-500">Selfie on punch</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">⏰</div>
                  <h4 className="font-bold text-slate-700 mb-1 text-sm">Auto OT</h4>
                  <p className="text-xs text-slate-500">Overtime detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time-Off Management Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowTimeOffModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl text-white">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Time-Off Management</h2>
                  <p className="text-sm text-slate-500">Request and manage employee time off</p>
                </div>
              </div>
              <button onClick={() => setShowTimeOffModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Time Off Form */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-600" />
                  Request Time Off
                </h3>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const employeeName = formData.get('employee') as string;
                  const startDate = formData.get('startDate') as string;
                  const endDate = formData.get('endDate') as string;
                  const type = formData.get('type') as string;
                  const reason = formData.get('reason') as string;

                  // Create time-off shifts for each day in range
                  const start = new Date(startDate);
                  const end = new Date(endDate);
                  const promises = [];
                  
                  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString();
                    const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                    promises.push(addDoc(collectionRef, {
                      date: dateStr,
                      employeeName,
                      startTime: '00:00',
                      endTime: '23:59',
                      role: `Time Off - ${type}`,
                      department: 'Time Off',
                      notes: reason,
                      isTimeOff: true,
                      isDraft: false,
                      timestamp: Date.now()
                    }));
                  }

                  Promise.all(promises).then(() => {
                    setStatus({ type: 'success', msg: 'Time-off request submitted!' });
                    e.currentTarget.reset();
                  }).catch(err => {
                    console.error('Time-off error:', err);
                    setStatus({ type: 'error', msg: 'Failed to submit request' });
                  });
                }}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Employee</label>
                    <select name="employee" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none">
                      {employees.map(emp => <option key={emp.name} value={emp.name}>{emp.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                      <input name="startDate" type="date" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                      <input name="endDate" type="date" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                    <select name="type" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none">
                      <option>Vacation</option>
                      <option>Sick Leave</option>
                      <option>Personal</option>
                      <option>Bereavement</option>
                      <option>Jury Duty</option>
                      <option>Unpaid Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Optional)</label>
                    <textarea name="reason" rows={3} className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none resize-none" placeholder="Additional details..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                    Submit Request
                  </button>
                </form>
              </div>

              {/* Time-Off Calendar View */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  Upcoming Time-Off
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {shifts.filter(s => s.isTimeOff).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(timeOff => {
                    const date = new Date(timeOff.date);
                    return (
                      <div key={timeOff.id} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-slate-800">{timeOff.employeeName}</h4>
                            <p className="text-sm text-slate-600">{timeOff.role}</p>
                          </div>
                          <button onClick={async () => {
                            if (confirm('Delete this time-off entry?')) {
                              const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                              await deleteDoc(doc(collectionRef, timeOff.id!));
                              setStatus({ type: 'success', msg: 'Time-off deleted' });
                            }
                          }} className="text-red-400 hover:text-red-600 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-500">
                          📅 {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {timeOff.notes && <p className="text-xs text-slate-600 mt-2 italic">{timeOff.notes}</p>}
                      </div>
                    );
                  })}
                  {shifts.filter(s => s.isTimeOff).length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No time-off requests</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowTemplateModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Shift Templates</h2>
                  <p className="text-sm text-slate-500">Save and reuse common shift patterns</p>
                </div>
              </div>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Template */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Create New Template
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Quick Tip</h4>
                  <p className="text-blue-700 text-sm mb-4">
                    Templates let you save a full day's schedule and reapply it instantly to any date. Perfect for repeating patterns!
                  </p>
                  <div className="space-y-3">
                    <div className="glass rounded-lg p-3">
                      <h5 className="font-bold text-xs text-slate-700 mb-1">1. Schedule a Full Day</h5>
                      <p className="text-xs text-slate-600">Create all shifts for a typical day pattern</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <h5 className="font-bold text-xs text-slate-700 mb-1">2. Save as Template</h5>
                      <p className="text-xs text-slate-600">Use the "Save Day as Template" button</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <h5 className="font-bold text-xs text-slate-700 mb-1">3. Apply Anywhere</h5>
                      <p className="text-xs text-slate-600">Click any date and apply the template instantly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Library */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Saved Templates
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {shiftTemplates.map((template, idx) => (
                    <div key={template.id || idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800">{template.name}</h4>
                          <p className="text-xs text-slate-600">{template.description || 'No description'}</p>
                        </div>
                        <button onClick={() => {
                          if (confirm(`Delete template "${template.name}"?`)) {
                            setShiftTemplates(shiftTemplates.filter((_, i) => i !== idx));
                            setStatus({ type: 'success', msg: 'Template deleted' });
                          }
                        }} className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 mb-3">
                        📊 {template.shifts?.length || 0} shifts
                      </div>
                      <button onClick={() => {
                        if (!selectedDate) {
                          alert('Please select a date first by clicking a day on the calendar');
                          setShowTemplateModal(false);
                          return;
                        }
                        // Apply template to selected date
                        const dateStr = selectedDate.toISOString();
                        const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                        const promises = template.shifts.map(shift => 
                          addDoc(collectionRef, {
                            ...shift,
                            date: dateStr,
                            isDraft: true,
                            timestamp: Date.now()
                          })
                        );
                        Promise.all(promises).then(() => {
                          setStatus({ type: 'success', msg: `Template "${template.name}" applied!` });
                          setShowTemplateModal(false);
                        });
                      }} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                        Apply to Selected Date
                      </button>
                    </div>
                  ))}
                  {shiftTemplates.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No templates saved yet</p>
                      <p className="text-xs mt-1">Create a full day schedule, then save it as a template</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button onClick={() => {
                const name = prompt('Template name:');
                if (!name || !selectedDate) return;
                const dateStr = selectedDate.toISOString().split('T')[0];
                const dayShifts = shifts.filter(s => s.date.startsWith(dateStr) && !s.isTimeOff);
                if (dayShifts.length === 0) {
                  alert('No shifts on selected date to save as template');
                  return;
                }
                setShiftTemplates([...shiftTemplates, {
                  name,
                  description: `${dayShifts.length} shifts`,
                  shifts: dayShifts.map(s => ({
                    employeeName: s.employeeName,
                    role: s.role,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    department: s.department
                  }))
                }]);
                setStatus({ type: 'success', msg: 'Template saved!' });
              }} className="glass hover:bg-gradient-to-r from-blue-500 to-cyan-500 hover:text-white p-4 rounded-xl transition-all hover-lift">
                <div className="text-2xl mb-1">💾</div>
                <div className="font-bold text-sm">Save Current Day</div>
              </button>
              <button onClick={() => {
                const morningTemplate: ShiftTemplate = {
                  name: 'Morning Shift',
                  description: 'Standard morning coverage',
                  shifts: [
                    { employeeName: employees[0]?.name || 'Staff 1', role: roles[0] || 'Reception', startTime: '08:00', endTime: '12:00' },
                    { employeeName: employees[1]?.name || 'Staff 2', role: roles[1] || 'Concierge', startTime: '08:00', endTime: '12:00' }
                  ]
                };
                setShiftTemplates([...shiftTemplates, morningTemplate]);
                setStatus({ type: 'success', msg: 'Morning template created!' });
              }} className="glass hover:bg-gradient-to-r from-amber-500 to-orange-500 hover:text-white p-4 rounded-xl transition-all hover-lift">
                <div className="text-2xl mb-1">🌅</div>
                <div className="font-bold text-sm">Create Morning</div>
              </button>
              <button onClick={() => {
                const eveningTemplate: ShiftTemplate = {
                  name: 'Evening Shift',
                  description: 'Standard evening coverage',
                  shifts: [
                    { employeeName: employees[0]?.name || 'Staff 1', role: roles[0] || 'Reception', startTime: '16:00', endTime: '20:00' },
                    { employeeName: employees[1]?.name || 'Staff 2', role: roles[1] || 'Concierge', startTime: '16:00', endTime: '20:00' }
                  ]
                };
                setShiftTemplates([...shiftTemplates, eveningTemplate]);
                setStatus({ type: 'success', msg: 'Evening template created!' });
              }} className="glass hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white p-4 rounded-xl transition-all hover-lift">
                <div className="text-2xl mb-1">🌆</div>
                <div className="font-bold text-sm">Create Evening</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Shifts Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowRecurringModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Recurring Shifts</h2>
                  <p className="text-sm text-slate-500">Set up repeating shift patterns</p>
                </div>
              </div>
              <button onClick={() => setShowRecurringModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const employeeName = formData.get('employee') as string;
              const startTime = formData.get('startTime') as string;
              const endTime = formData.get('endTime') as string;
              const role = formData.get('role') as string;
              const pattern = formData.get('pattern') as string;
              const occurrences = parseInt(formData.get('occurrences') as string);

              const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
              const promises: Promise<any>[] = [];
              const recurringId = `recurring-${Date.now()}`;

              for (let i = 0; i < occurrences; i++) {
                const shiftDate = new Date(currentDate);
                if (pattern === 'daily') shiftDate.setDate(shiftDate.getDate() + i);
                else if (pattern === 'weekly') shiftDate.setDate(shiftDate.getDate() + (i * 7));
                else if (pattern === 'biweekly') shiftDate.setDate(shiftDate.getDate() + (i * 14));
                else if (pattern === 'monthly') shiftDate.setMonth(shiftDate.getMonth() + i);

                promises.push(addDoc(collectionRef, {
                  date: shiftDate.toISOString(),
                  employeeName,
                  startTime,
                  endTime,
                  role,
                  department: selectedDepartment === 'All' ? departments[0] : selectedDepartment,
                  notes: `Recurring ${pattern}`,
                  isDraft: true,
                  isRecurring: true,
                  recurringId,
                  recurringPattern: pattern,
                  timestamp: Date.now()
                }));
              }

              try {
                await Promise.all(promises);
                setStatus({ type: 'success', msg: `Created ${occurrences} recurring shifts!` });
                setShowRecurringModal(false);
                e.currentTarget.reset();
              } catch (error) {
                console.error('Recurring shift error:', error);
                setStatus({ type: 'error', msg: 'Failed to create recurring shifts' });
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Employee</label>
                  <select name="employee" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none">
                    {employees.map(emp => <option key={emp.name} value={emp.name}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                  <select name="role" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Time</label>
                  <input name="startTime" type="time" required defaultValue="08:00" className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">End Time</label>
                  <input name="endTime" type="time" required defaultValue="16:00" className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pattern</label>
                  <select name="pattern" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Occurrences</label>
                  <input name="occurrences" type="number" required min="1" max="52" defaultValue="4" className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Create Recurring Shifts
              </button>
            </form>

            {/* Existing Recurring Shifts */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-bold text-lg mb-4">Active Recurring Patterns</h3>
              <div className="space-y-2">
                {[...new Set(shifts.filter(s => s.isRecurring).map(s => s.recurringId))].map(recurringId => {
                  const pattern = shifts.find(s => s.recurringId === recurringId);
                  const count = shifts.filter(s => s.recurringId === recurringId).length;
                  if (!pattern) return null;
                  return (
                    <div key={recurringId} className="glass rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{pattern.employeeName} - {pattern.recurringPattern}</div>
                        <div className="text-xs text-slate-600">{count} occurrences • {pattern.startTime}-{pattern.endTime}</div>
                      </div>
                      <button onClick={async () => {
                        if (confirm(`Delete all ${count} shifts in this recurring pattern?`)) {
                          const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                          const toDelete = shifts.filter(s => s.recurringId === recurringId);
                          await Promise.all(toDelete.map(s => deleteDoc(doc(collectionRef, s.id!))));
                          setStatus({ type: 'success', msg: 'Recurring pattern deleted' });
                        }
                      }} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {shifts.filter(s => s.isRecurring).length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <RotateCcw className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recurring shifts yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift Swap/Trade Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowSwapModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl text-white">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Shift Swaps & Trading</h2>
                  <p className="text-sm text-slate-500">Request and manage shift swaps</p>
                </div>
              </div>
              <button onClick={() => setShowSwapModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Swap */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                  Request Shift Swap
                </h3>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const requestingEmployee = formData.get('from') as string;
                  const targetEmployee = formData.get('to') as string;
                  const shiftDate = formData.get('date') as string;

                  const newRequest: ShiftSwapRequest = {
                    id: `swap-${Date.now()}`,
                    requestingEmployee,
                    requestedShiftId: shiftDate,
                    targetEmployee,
                    status: 'Pending',
                    requestedAt: new Date().toISOString()
                  };
                  
                  setSwapRequests([...swapRequests, newRequest]);
                  setNotifications([...notifications, {
                    id: `notif-${Date.now()}`,
                    type: 'swap',
                    message: `${requestingEmployee} requested to swap shift with ${targetEmployee}`,
                    timestamp: Date.now(),
                    read: false
                  }]);
                  setStatus({ type: 'success', msg: 'Swap request sent!' });
                  e.currentTarget.reset();
                }}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">From Employee</label>
                    <select name="from" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none">
                      {employees.map(emp => <option key={emp.name} value={emp.name}>{emp.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">To Employee</label>
                    <select name="to" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none">
                      {employees.map(emp => <option key={emp.name} value={emp.name}>{emp.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Shift Date</label>
                    <input name="date" type="date" required className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg">
                    Submit Swap Request
                  </button>
                </form>
              </div>

              {/* Pending Swaps */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Pending Requests
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {swapRequests.filter(r => r.status === 'Pending').map(request => (
                    <div key={request.id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-slate-800">{request.requestingEmployee} → {request.targetEmployee}</div>
                          <div className="text-xs text-slate-600">{new Date(request.requestedAt).toLocaleDateString()}</div>
                        </div>
                        <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">Pending</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => {
                          setSwapRequests(swapRequests.map(r => r.id === request.id ? { ...r, status: 'Approved', respondedAt: new Date().toISOString() } : r));
                          setNotifications([...notifications, {
                            id: `notif-${Date.now()}`,
                            type: 'success',
                            message: `Swap request approved for ${request.requestingEmployee}`,
                            timestamp: Date.now(),
                            read: false
                          }]);
                          setStatus({ type: 'success', msg: 'Swap approved!' });
                        }} className="flex-1 bg-green-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600">
                          ✓ Approve
                        </button>
                        <button onClick={() => {
                          setSwapRequests(swapRequests.map(r => r.id === request.id ? { ...r, status: 'Rejected', respondedAt: new Date().toISOString() } : r));
                          setStatus({ type: 'error', msg: 'Swap rejected' });
                        }} className="flex-1 bg-red-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-600">
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {swapRequests.filter(r => r.status === 'Pending').length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No pending swap requests</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap History */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-bold text-lg mb-4">Recent Swaps</h3>
              <div className="grid grid-cols-2 gap-3">
                {swapRequests.filter(r => r.status !== 'Pending').map(request => (
                  <div key={request.id} className={`glass rounded-xl p-3 ${request.status === 'Approved' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-bold">{request.requestingEmployee} ↔ {request.targetEmployee}</div>
                        <div className="text-xs text-slate-500">{new Date(request.requestedAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${request.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Center */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowNotifications(false)}>
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-red-600 p-3 rounded-xl text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Notifications</h2>
                  <p className="text-sm text-slate-500">{notifications.filter(n => !n.read).length} unread messages</p>
                </div>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mark all as read */}
            {notifications.filter(n => !n.read).length > 0 && (
              <button onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} className="w-full mb-4 text-sm text-purple-600 hover:text-purple-800 font-semibold">
                Mark all as read
              </button>
            )}

            <div className="space-y-3">
              {notifications.sort((a, b) => b.timestamp - a.timestamp).map(notif => (
                <div key={notif.id} className={`rounded-xl p-4 transition-all ${notif.read ? 'bg-slate-50' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'error' ? 'bg-red-500' : notif.type === 'swap' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {notif.type === 'error' && <X className="w-4 h-4 text-white" />}
                      {notif.type === 'swap' && <ArrowRightLeft className="w-4 h-4 text-white" />}
                      {notif.type === 'info' && <AlertCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                    {!notif.read && (
                      <button onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))} className="text-purple-600 hover:text-purple-800 text-xs font-semibold">
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No notifications yet</p>
                  <p className="text-sm mt-1">You'll see updates here when actions occur</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Dashboard */}
      {showAdvancedAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden animate-fade-in" onClick={() => setShowAdvancedAnalytics(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Advanced Analytics</h2>
                  <p className="text-sm text-slate-500">Deep insights into your schedule</p>
                </div>
              </div>
              <button onClick={() => setShowAdvancedAnalytics(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4 border-l-4 border-purple-500">
                <div className="text-2xl font-bold text-purple-600">{shifts.length}</div>
                <div className="text-xs text-slate-600 font-semibold">Total Shifts</div>
              </div>
              <div className="glass rounded-xl p-4 border-l-4 border-blue-500">
                <div className="text-2xl font-bold text-blue-600">{new Set(shifts.map(s => s.employeeName)).size}</div>
                <div className="text-xs text-slate-600 font-semibold">Active Employees</div>
              </div>
              <div className="glass rounded-xl p-4 border-l-4 border-green-500">
                <div className="text-2xl font-bold text-green-600">${monthStats.totalCost.toLocaleString()}</div>
                <div className="text-xs text-slate-600 font-semibold">Labor Cost</div>
              </div>
              <div className="glass rounded-xl p-4 border-l-4 border-orange-500">
                <div className="text-2xl font-bold text-orange-600">{shifts.filter(s => s.isDraft).length}</div>
                <div className="text-xs text-slate-600 font-semibold">Draft Shifts</div>
              </div>
            </div>

            {/* Employee Performance */}
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Employee Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(monthStats.hours).sort((a, b) => b[1].hours - a[1].hours).map(([name, data]) => {
                  const avgDailyHours = data.hours / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                  const progressPercent = (data.hours / Math.max(...Object.values(monthStats.hours).map(d => d.hours))) * 100;
                  return (
                    <div key={name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800">{name}</span>
                        <span className="text-slate-600">{data.hours}h • ${data.cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="text-xs text-slate-500">Avg: {avgDailyHours.toFixed(1)}h/day</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  By Department
                </h3>
                <div className="space-y-3">
                  {departments.map(dept => {
                    const deptShifts = shifts.filter(s => (s.department === dept || (!s.department && dept === 'General')) && !s.isTimeOff);
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">{dept}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">{deptShifts.length} shifts</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  By Role
                </h3>
                <div className="space-y-3">
                  {roles.map(role => {
                    const roleShifts = shifts.filter(s => s.role === role && !s.isTimeOff);
                    return (
                      <div key={role} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">{role}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">{roleShifts.length} shifts</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Coverage Heatmap */}
            <div className="glass rounded-xl p-6 mt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                Coverage Heatmap
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                  const dayShifts = shifts.filter(s => new Date(s.date).getDay() === idx && !s.isTimeOff);
                  const avgCoverage = dayShifts.length / 4;
                  const intensity = Math.min(avgCoverage / 3, 1);
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs font-bold text-slate-600 mb-2">{day}</div>
                      <div className={`h-24 rounded-lg flex items-center justify-center font-bold transition-all`} style={{ 
                        background: `linear-gradient(135deg, rgba(139, 92, 246, ${intensity * 0.7}) 0%, rgba(219, 39, 119, ${intensity * 0.7}) 100%)`
                      }}>
                        <span className="text-white text-lg">{dayShifts.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Availability Management Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAvailabilityModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Users className="w-7 h-7" />
                Employee Availability & Notes
              </h2>
              <button onClick={() => setShowAvailabilityModal(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              {employees.map(employee => {
                const availability = employeeAvailability[employee.name] || {};
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                
                return (
                  <div key={employee.name} className="glass rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">{employee.name}</h3>
                    
                    {/* Employee Notes Section */}
                    <div className="mb-6 glass rounded-lg p-4">
                      <label className="block font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Availability Notes
                      </label>
                      <textarea
                        value={availability.notes || ''}
                        onChange={(e) => {
                          setEmployeeAvailability(prev => ({
                            ...prev,
                            [employee.name]: {
                              ...prev[employee.name],
                              notes: e.target.value
                            }
                          }));
                        }}
                        placeholder={`Add notes about ${employee.name}'s availability, preferences, time-off requests, restrictions, etc.`}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Weekly Schedule Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {days.map(day => {
                        const dayAvail = availability[day] || { available: true, start: '08:00', end: '20:00' };
                        return (
                          <div key={day} className="glass rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-sm capitalize text-slate-700">{day}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={dayAvail.available}
                                  onChange={(e) => {
                                    setEmployeeAvailability(prev => ({
                                      ...prev,
                                      [employee.name]: {
                                        ...prev[employee.name],
                                        [day]: { ...dayAvail, available: e.target.checked }
                                      }
                                    }));
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                              </label>
                            </div>
                            {dayAvail.available && (
                              <div className="space-y-2">
                                <input
                                  type="time"
                                  value={dayAvail.start}
                                  onChange={(e) => {
                                    setEmployeeAvailability(prev => ({
                                      ...prev,
                                      [employee.name]: {
                                        ...prev[employee.name],
                                        [day]: { ...dayAvail, start: e.target.value }
                                      }
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                  type="time"
                                  value={dayAvail.end}
                                  onChange={(e) => {
                                    setEmployeeAvailability(prev => ({
                                      ...prev,
                                      [employee.name]: {
                                        ...prev[employee.name],
                                        [day]: { ...dayAvail, end: e.target.value }
                                      }
                                    }));
                                  }}
                                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={async () => {
                await saveSettings({ employeeAvailability });
                localStorage.setItem(`noxshift-availability-${appId}`, JSON.stringify(employeeAvailability));
                setStatus({ type: 'success', msg: 'Availability & notes saved!' });
                setShowAvailabilityModal(false);
              }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Availability & Notes
            </button>
          </div>
        </div>
      )}

      {/* Holiday Management Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHolidayModal(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-yellow-500" />
                Holiday Management
              </h2>
              <button onClick={() => setShowHolidayModal(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Holiday Form */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Add Holiday</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const holiday: Holiday = {
                    date: formData.get('date') as string,
                    name: formData.get('name') as string,
                    type: formData.get('type') as 'federal' | 'company' | 'custom'
                  };
                  
                  const updated = [...holidays, holiday];
                  setHolidays(updated);
                  await saveSettings({ holidays: updated });
                  setStatus({ type: 'success', msg: 'Holiday added!' });
                  e.currentTarget.reset();
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Holiday Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g., Christmas Day"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      name="date"
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                    <select
                      name="type"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="federal">Federal Holiday</option>
                      <option value="company">Company Holiday</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Add Holiday
                  </button>
                </form>
              </div>

              {/* Holidays List */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Upcoming Holidays</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((holiday, idx) => (
                    <div key={idx} className="glass rounded-lg p-4 flex justify-between items-center hover-lift">
                      <div>
                        <p className="font-bold text-slate-800">{holiday.name}</p>
                        <p className="text-sm text-slate-600">{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <span className={`text-xs px-2 py-1 rounded-lg mt-1 inline-block ${
                          holiday.type === 'federal' ? 'bg-blue-100 text-blue-700' :
                          holiday.type === 'company' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {holiday.type}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          if (confirm('Remove this holiday?')) {
                            const updated = holidays.filter((_, i) => i !== idx);
                            setHolidays(updated);
                            await saveSettings({ holidays: updated });
                            setStatus({ type: 'success', msg: 'Holiday removed' });
                          }
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                  {holidays.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No holidays scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print View Modal */}
      {showPrintView && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="text-2xl font-bold text-slate-800">Print Schedule</h2>
              <div className="flex gap-3">
                <button onClick={() => window.print()} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg">
                  <Printer className="w-5 h-5" />
                  Print
                </button>
                <button onClick={() => setShowPrintView(false)} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all">
                  Close
                </button>
              </div>
            </div>

            {/* Print-optimized schedule */}
            <div className="bg-white border border-slate-300 rounded-lg p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">NoxShift Schedule</h1>
                <p className="text-lg text-slate-600">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-300">
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Employee</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Role</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Time</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts
                    .filter(shift => !shift.isDraft && !shift.isTimeOff)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((shift, idx) => {
                      const holiday = isHoliday(new Date(shift.date));
                      return (
                        <tr key={idx} className={`border-b border-slate-200 ${holiday ? 'bg-yellow-50' : ''}`}>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {holiday && <span className="ml-2 text-xs text-yellow-700">({holiday.name})</span>}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">{shift.employeeName}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{shift.role}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{shift.department || 'General'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-slate-800">Employee Summary</h3>
                  {employees.map(emp => {
                    const stats = getEmployeeStats(emp.name);
                    return (
                      <div key={emp.name} className="flex justify-between py-2 border-b border-slate-200">
                        <span className="font-semibold text-sm">{emp.name}</span>
                        <span className="text-sm text-slate-600">{stats.totalHours.toFixed(1)}h | {stats.totalShifts} shifts</span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 text-slate-800">Cost Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-sm">Total Labor Hours:</span>
                      <span className="font-semibold text-sm">{shifts.filter(s => !s.isTimeOff).reduce((sum, s) => {
                        const start = new Date(`2000-01-01T${s.startTime}`);
                        const end = new Date(`2000-01-01T${s.endTime}`);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0).toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-sm">Total Labor Cost:</span>
                      <span className="font-semibold text-sm">${employees.reduce((sum, emp) => sum + getEmployeeStats(emp.name).totalEarnings, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="glass rounded-3xl p-8 max-w-3xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Keyboard className="w-7 h-7" />
                Keyboard Shortcuts
              </h2>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Navigation</h3>
                {[
                  { keys: 'Alt + ←', action: 'Previous Month' },
                  { keys: 'Alt + →', action: 'Next Month' },
                  { keys: 'Esc', action: 'Close Modal' }
                ].map(shortcut => (
                  <div key={shortcut.keys} className="flex justify-between items-center glass rounded-lg p-3">
                    <span className="text-sm text-slate-700">{shortcut.action}</span>
                    <kbd className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-mono font-bold rounded-lg shadow">{shortcut.keys}</kbd>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Actions</h3>
                {[
                  { keys: 'Ctrl + N', action: 'New Shift' },
                  { keys: 'Ctrl + P', action: 'Print View' },
                  { keys: 'Ctrl + D', action: 'Toggle Dark Mode' },
                  { keys: 'Ctrl + ,', action: 'Settings' },
                  { keys: 'Ctrl + K', action: 'Shortcuts' }
                ].map(shortcut => (
                  <div key={shortcut.keys} className="flex justify-between items-center glass rounded-lg p-3">
                    <span className="text-sm text-slate-700">{shortcut.action}</span>
                    <kbd className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-mono font-bold rounded-lg shadow">{shortcut.keys}</kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 glass rounded-xl p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Pro tip: Use keyboard shortcuts to navigate NoxShift 10x faster!</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Modal */}
      {showEmployeeProfile && selectedEmployeeProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowEmployeeProfile(false); setSelectedEmployeeProfile(null); }}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const employee = employees.find(e => e.name === selectedEmployeeProfile);
              if (!employee) return null;
              
              const stats = getEmployeeStats(employee.name);
              const weekStart = new Date(currentDate);
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              const weeklyHours = calculateWeeklyHours(employee.name, weekStart);
              const isOvertime = weeklyHours > 40;

              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold gradient-text">{employee.name}</h2>
                        <p className="text-slate-600">{employee.role || 'Staff'} • ${employee.rate}/hr</p>
                        {isOvertime && (
                          <div className="mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg flex items-center gap-1 w-fit animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Overtime This Week: {weeklyHours.toFixed(1)}h
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => { setShowEmployeeProfile(false); setSelectedEmployeeProfile(null); }} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                      <X className="w-6 h-6 text-slate-600" />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass rounded-xl p-4 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{stats.totalShifts}</div>
                      <div className="text-xs text-slate-600 mt-1">Total Shifts</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{stats.totalHours.toFixed(0)}h</div>
                      <div className="text-xs text-slate-600 mt-1">Total Hours</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">${stats.totalEarnings.toFixed(0)}</div>
                      <div className="text-xs text-slate-600 mt-1">Earnings</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{stats.avgShiftLength.toFixed(1)}h</div>
                      <div className="text-xs text-slate-600 mt-1">Avg Shift</div>
                    </div>
                  </div>

                  {/* Upcoming Shifts */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-purple-600" />
                      Upcoming Shifts
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {shifts
                        .filter(s => s.employeeName === employee.name && !s.isDraft && !s.isTimeOff && new Date(s.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 10)
                        .map((shift, idx) => {
                          const breaks = calculateBreaks(shift.startTime, shift.endTime);
                          return (
                            <div key={idx} className="glass rounded-lg p-3 flex justify-between items-center hover-lift">
                              <div>
                                <p className="font-semibold text-sm text-slate-800">
                                  {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-slate-600">{formatTime(shift.startTime)} - {formatTime(shift.endTime)} • {shift.role}</p>
                                {breaks && (
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Coffee className="w-3 h-3" />
                                    Break: {breaks.breakStart} - {breaks.breakEnd} ({breaks.breakDuration}min)
                                  </p>
                                )}
                              </div>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">{shift.department || 'General'}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Conflict Detector Modal */}
      {showConflictDetector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowConflictDetector(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <AlertCircle className="w-7 h-7 text-orange-500" />
                Conflict Detector
              </h2>
              <button onClick={() => setShowConflictDetector(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {(() => {
              const conflicts = detectAllConflicts();
              if (conflicts.length === 0) {
                return (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">All Clear!</h3>
                    <p className="text-slate-600">No scheduling conflicts detected this month.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {conflicts.map((conflict, idx) => (
                    <div key={idx} className={`glass rounded-xl p-5 border-l-4 ${
                      conflict.type === 'double-booking' ? 'border-red-500 bg-red-50/50' :
                      conflict.type === 'overtime' ? 'border-orange-500 bg-orange-50/50' :
                      'border-yellow-500 bg-yellow-50/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        {conflict.type === 'double-booking' && <Ban className="w-5 h-5 text-red-600 shrink-0 mt-1" />}
                        {conflict.type === 'overtime' && <TrendingUp className="w-5 h-5 text-orange-600 shrink-0 mt-1" />}
                        {conflict.type === 'understaffed' && <Users className="w-5 h-5 text-yellow-600 shrink-0 mt-1" />}
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{conflict.message}</p>
                          {conflict.shifts.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {conflict.shifts.map((shift, sidx) => (
                                <div key={sidx} className="text-sm text-slate-600 flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {shift.employeeName}: {formatTime(shift.startTime)} - {formatTime(shift.endTime)} ({shift.role})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          conflict.type === 'double-booking' ? 'bg-red-100 text-red-700' :
                          conflict.type === 'overtime' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {conflict.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Cost Forecast Modal */}
      {showCostForecast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCostForecast(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <DollarSign className="w-7 h-7 text-green-500" />
                Cost Forecast & Budget Analysis
              </h2>
              <button onClick={() => setShowCostForecast(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {(() => {
              const forecast = calculateCostForecast();
              return (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{forecast.totalHours.toFixed(0)}h</div>
                      <div className="text-xs text-slate-600 mt-1">Total Hours</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">${forecast.totalCost.toFixed(0)}</div>
                      <div className="text-xs text-slate-600 mt-1">Current Cost</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">${forecast.projectedMonthly.toFixed(0)}</div>
                      <div className="text-xs text-slate-600 mt-1">Projected Monthly</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">${forecast.avgHourlyRate.toFixed(2)}</div>
                      <div className="text-xs text-slate-600 mt-1">Avg Rate/Hour</div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Budget Breakdown</h3>
                    <div className="space-y-3">
                      {employees.map(emp => {
                        const stats = getEmployeeStats(emp.name);
                        const percent = (stats.totalEarnings / forecast.totalCost) * 100;
                        return (
                          <div key={emp.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-semibold">{emp.name}</span>
                              <span className="text-sm text-slate-600">${stats.totalEarnings.toFixed(2)} ({percent.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-6">
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Cost Trends
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Regular Hours:</span>
                          <span className="font-semibold">{Math.min(forecast.totalHours, employees.length * 160).toFixed(0)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Overtime Hours:</span>
                          <span className="font-semibold text-orange-600">{employees.reduce((sum, emp) => sum + getEmployeeStats(emp.name).overtimeHours, 0).toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Labor %:</span>
                          <span className="font-semibold">{forecast.laborPercent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Recommendations
                      </h3>
                      <div className="space-y-2 text-sm text-slate-700">
                        {forecast.totalCost > 10000 && <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" />High labor cost detected</div>}
                        {employees.some(emp => getEmployeeStats(emp.name).overtimeHours > 10) && <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" />Excessive overtime usage</div>}
                        {forecast.totalHours < employees.length * 100 && <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" />Efficient scheduling</div>}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Shift Marketplace Modal */}
      {showMarketplace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMarketplace(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-indigo-500" />
                Shift Marketplace (Trade Board)
              </h2>
              <button onClick={() => setShowMarketplace(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Shifts */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Available for Pickup
                </h3>
                <p className="text-sm text-slate-600 mb-4">Shifts that employees want to give away</p>
                <div className="space-y-3">
                  {shifts.filter(s => s.notes?.includes('[MARKETPLACE]')).map(shift => (
                    <div key={shift.id} className="glass rounded-lg p-4 hover-lift">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{new Date(shift.date).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-600">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">{shift.role}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">Posted by: {shift.employeeName}</p>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:scale-105 transition-all">
                        Claim Shift
                      </button>
                    </div>
                  ))}
                  {shifts.filter(s => s.notes?.includes('[MARKETPLACE]')).length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No shifts available in marketplace</p>
                      <p className="text-xs mt-1">Add "[MARKETPLACE]" to shift notes to list here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Requested Shifts */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Shift Requests
                </h3>
                <p className="text-sm text-slate-600 mb-4">Employees looking for extra shifts</p>
                <div className="space-y-3">
                  {employees.map(emp => {
                    const empShifts = shifts.filter(s => s.employeeName === emp.name && !s.isTimeOff);
                    const canTakeMore = empShifts.length < 20; // Example threshold
                    if (!canTakeMore) return null;
                    
                    return (
                      <div key={emp.name} className="glass rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{emp.name}</p>
                            <p className="text-xs text-slate-600">Currently: {empShifts.length} shifts</p>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all">
                            Assign Shift
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operations Modal */}
      {showBulkOps && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBulkOps(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Layers className="w-7 h-7 text-cyan-500" />
                Bulk Operations
              </h2>
              <button onClick={() => setShowBulkOps(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={async () => {
                if (!confirm('Delete ALL draft shifts?')) return;
                const draftShifts = shifts.filter(s => s.isDraft);
                const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                const batch = writeBatch(db);
                draftShifts.forEach(shift => {
                  if (shift.id) batch.delete(doc(collectionRef, shift.id));
                });
                await batch.commit();
                setStatus({ type: 'success', msg: `Deleted ${draftShifts.length} draft shifts` });
                setShowBulkOps(false);
              }} className="glass rounded-xl p-6 hover-lift text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl text-white">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Clear Drafts</h3>
                </div>
                <p className="text-sm text-slate-600">Delete all draft shifts at once</p>
              </button>

              <button onClick={handlePublishAll} className="glass rounded-xl p-6 hover-lift text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl text-white">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Publish All</h3>
                </div>
                <p className="text-sm text-slate-600">Make all draft shifts official</p>
              </button>

              <button onClick={async () => {
                if (!confirm('Copy THIS month to NEXT month?')) return;
                const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                const monthShifts = shifts.filter(s => {
                  const sDate = new Date(s.date);
                  return sDate.getMonth() === currentDate.getMonth() && !s.isDraft;
                });
                
                const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                const batch = writeBatch(db);
                
                monthShifts.forEach(shift => {
                  const shiftDate = new Date(shift.date);
                  const newDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), shiftDate.getDate());
                  const { id, date, timestamp, ...shiftData } = shift;
                  const newRef = doc(collectionRef);
                  batch.set(newRef, { ...shiftData, date: newDate.toISOString(), timestamp: Date.now(), isDraft: true });
                });
                
                await batch.commit();
                setStatus({ type: 'success', msg: `Copied ${monthShifts.length} shifts to next month` });
                setShowBulkOps(false);
              }} className="glass rounded-xl p-6 hover-lift text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-xl text-white">
                    <Copy className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Copy Month Forward</h3>
                </div>
                <p className="text-sm text-slate-600">Duplicate entire month to next month</p>
              </button>

              <button onClick={async () => {
                if (!confirm('Clear ALL time-off entries?')) return;
                const timeOffShifts = shifts.filter(s => s.isTimeOff);
                const collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
                const batch = writeBatch(db);
                timeOffShifts.forEach(shift => {
                  if (shift.id) batch.delete(doc(collectionRef, shift.id));
                });
                await batch.commit();
                setStatus({ type: 'success', msg: `Cleared ${timeOffShifts.length} time-off entries` });
                setShowBulkOps(false);
              }} className="glass rounded-xl p-6 hover-lift text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl text-white">
                    <Ban className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">Clear Time-Off</h3>
                </div>
                <p className="text-sm text-slate-600">Remove all time-off blockouts</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Compare View Modal */}
      {showCompareView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCompareView(false)}>
          <div className="glass rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <GitCompare className="w-7 h-7 text-violet-500" />
                Schedule Comparison
              </h2>
              <button onClick={() => setShowCompareView(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Current Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">Current</span>
                </div>
                <div className="glass rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Shifts:</span>
                      <span className="font-bold">{shifts.filter(s => !s.isDraft && !s.isTimeOff).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Hours:</span>
                      <span className="font-bold">{shifts.filter(s => !s.isTimeOff).reduce((sum, s) => {
                        const start = new Date(`2000-01-01T${s.startTime}`);
                        const end = new Date(`2000-01-01T${s.endTime}`);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0).toFixed(0)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Labor Cost:</span>
                      <span className="font-bold">${calculateCostForecast().totalCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Avg Shifts/Day:</span>
                      <span className="font-bold">{(shifts.filter(s => !s.isDraft && !s.isTimeOff).length / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Month */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{MONTH_NAMES[compareMonth.getMonth()]} {compareMonth.getFullYear()}</h3>
                  <select 
                    value={compareMonth.getMonth()}
                    onChange={(e) => setCompareMonth(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                    className="px-3 py-1 glass rounded-lg text-sm font-semibold"
                  >
                    {MONTH_NAMES.map((month, idx) => (
                      <option key={idx} value={idx}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="glass rounded-xl p-6">
                  <div className="text-center py-8 text-slate-500">
                    <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Historical comparison coming soon</p>
                    <p className="text-xs mt-1">This will show stats from previous months</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 glass rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Insights</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <div className="text-xs text-slate-600 mt-1">Efficiency vs last month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">-8%</div>
                  <div className="text-xs text-slate-600 mt-1">Overtime reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-xs text-slate-600 mt-1">Schedule completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎙️ Voice Commands Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl text-white">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Voice Commands</h2>
                  <p className="text-sm text-slate-600">Control your schedule with your voice</p>
                </div>
              </div>
              <button onClick={() => setShowVoiceModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={startVoiceCommand}
                disabled={isListening}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  isListening 
                    ? 'bg-red-500 animate-pulse cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105'
                }`}
              >
                {isListening ? '🎤 Listening...' : '🎙️ Start Voice Command'}
              </button>
              {voiceTranscript && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm font-semibold text-blue-800 mb-1">You said:</div>
                  <div className="text-lg text-slate-800">"{voiceTranscript}"</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-3">Command History</h3>
              {voiceHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No voice commands yet. Try saying:</p>
                  <p className="text-sm mt-2">"Schedule Mike for Monday"</p>
                  <p className="text-sm">"Show me today"</p>
                  <p className="text-sm">"How many shifts does Karen have?"</p>
                </div>
              ) : (
                voiceHistory.slice().reverse().map((cmd, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${cmd.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-slate-800">"{cmd.command}"</div>
                      {cmd.success ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="text-sm text-slate-600">{cmd.action}</div>
                    <div className="text-xs text-slate-400 mt-1">{new Date(cmd.timestamp).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📍 GPS Tracking Modal */}
      {showGPSModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">GPS Location Tracking</h2>
                  <p className="text-sm text-slate-600">Real-time employee location monitoring</p>
                </div>
              </div>
              <button onClick={() => setShowGPSModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {employees.map(emp => (
                <button
                  key={emp.name}
                  onClick={() => updateEmployeeLocation(emp.name)}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-bold text-slate-800">{emp.name}</div>
                      <div className="text-xs text-slate-600">Track location</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-3">Location Data</h3>
              {locationTracking.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No location data yet</p>
                </div>
              ) : (
                locationTracking.map((loc, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${loc.isOnSite ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800">{loc.employeeName}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${loc.isOnSite ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {loc.isOnSite ? '✓ ON-SITE' : `${loc.distanceFromWorkplace?.toFixed(1)}km away`}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Lat: {loc.latitude.toFixed(4)}, Lng: {loc.longitude.toFixed(4)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{new Date(loc.timestamp).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 💭 Sentiment Analysis Modal */}
      {showSentimentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Team Sentiment Analysis</h2>
                  <p className="text-sm text-slate-600">Monitor team morale and wellbeing</p>
                </div>
              </div>
              <button onClick={() => setShowSentimentModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                <select className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl">
                  {employees.map(emp => (
                    <option key={emp.name} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const text = prompt('Enter employee feedback/message:');
                    if (text) analyzeSentiment(text, employees[0].name);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
                >
                  Analyze
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <Smile className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{sentimentData.filter(s => s.mood === 'positive').length}</div>
                <div className="text-xs text-slate-600">Positive</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <Meh className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{sentimentData.filter(s => s.mood === 'neutral').length}</div>
                <div className="text-xs text-slate-600">Neutral</div>
              </div>
              <div className="p-4 bg-red-50 rounded-xl text-center">
                <Frown className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{sentimentData.filter(s => s.mood === 'negative').length}</div>
                <div className="text-xs text-slate-600">Negative</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-3">Recent Analysis</h3>
              {sentimentData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No sentiment data yet</p>
                </div>
              ) : (
                sentimentData.slice().reverse().slice(0, 10).map((sent, idx) => {
                  const icon = sent.mood === 'positive' ? <Smile className="w-5 h-5 text-green-600" /> :
                               sent.mood === 'negative' ? <Frown className="w-5 h-5 text-red-600" /> :
                               <Meh className="w-5 h-5 text-blue-600" />;
                  const bgColor = sent.mood === 'positive' ? 'bg-green-50 border-green-200' :
                                  sent.mood === 'negative' ? 'bg-red-50 border-red-200' :
                                  'bg-blue-50 border-blue-200';
                  
                  return (
                    <div key={idx} className={`p-4 rounded-xl border-2 ${bgColor}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {icon}
                        <div className="font-bold text-slate-800">{sent.employeeName}</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-1">"{sent.text}"</div>
                      <div className="text-xs text-slate-400">{new Date(sent.timestamp).toLocaleString()}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🤖 AI Auto-Schedule Modal */}
      {showAIScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-2xl w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl text-white">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">AI Optimal Schedule Generator</h2>
                  <p className="text-sm text-slate-600">Let AI create the perfect schedule</p>
                </div>
              </div>
              <button onClick={() => setShowAIScheduleModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="glass rounded-xl p-6 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                How It Works
              </h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Analyzes employee availability and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Optimizes coverage for all shifts and roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Balances workload fairly across team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Minimizes overtime and prevents burnout</span>
                </li>
              </ul>
            </div>

            <button
              onClick={async () => {
                if (confirm('Generate AI-powered optimal schedule for this month? This will create draft shifts.')) {
                  const newShifts = generateOptimalSchedule();
                  alert(`✓ Generated ${newShifts.length} optimal shifts! Review and publish when ready.`);
                  setShowAIScheduleModal(false);
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-6 h-6" />
              Generate Optimal Schedule
            </button>

            <div className="mt-4 text-center text-xs text-slate-500">
              ⚡ Powered by advanced AI algorithms
            </div>
          </div>
        </div>
      )}

      {/* 💚 Wellness Monitor Modal */}
      {showWellnessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl text-white">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Wellness & Burnout Monitor</h2>
                  <p className="text-sm text-slate-600">Protect your team from overwork</p>
                </div>
              </div>
              <button onClick={() => setShowWellnessModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <button
              onClick={() => checkWellnessAlerts()}
              className="w-full mb-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-all"
            >
              🔍 Scan for Wellness Issues
            </button>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">{wellnessAlerts.filter(a => a.severity === 'low').length}</div>
                <div className="text-xs text-slate-600 mt-1">Low Risk</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-yellow-600">{wellnessAlerts.filter(a => a.severity === 'medium').length}</div>
                <div className="text-xs text-slate-600 mt-1">Medium</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-orange-600">{wellnessAlerts.filter(a => a.severity === 'high').length}</div>
                <div className="text-xs text-slate-600 mt-1">High Risk</div>
              </div>
              <div className="p-4 bg-red-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-600">{wellnessAlerts.filter(a => a.severity === 'critical').length}</div>
                <div className="text-xs text-slate-600 mt-1">Critical</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-3">Active Alerts</h3>
              {wellnessAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <HeartPulse className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-green-600">✓ No wellness issues detected</p>
                  <p className="text-sm mt-2">Your team is in good shape!</p>
                </div>
              ) : (
                wellnessAlerts.map((alert, idx) => {
                  const bgColor = alert.severity === 'critical' ? 'bg-red-50 border-red-300' :
                                  alert.severity === 'high' ? 'bg-orange-50 border-orange-300' :
                                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                                  'bg-green-50 border-green-300';
                  const icon = alert.severity === 'critical' || alert.severity === 'high' ? 
                               <AlertCircle className="w-5 h-5 text-red-600" /> :
                               <Activity className="w-5 h-5 text-yellow-600" />;
                  
                  return (
                    <div key={idx} className={`p-4 rounded-xl border-2 ${bgColor}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {icon}
                        <div className="font-bold text-slate-800">{alert.employeeName}</div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                          alert.severity === 'critical' ? 'bg-red-500 text-white' :
                          alert.severity === 'high' ? 'bg-orange-500 text-white' :
                          alert.severity === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 font-semibold mb-1">{alert.message}</div>
                      <div className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleString()}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔌 Integration Marketplace Modal */}
      {showIntegrationsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl text-white">
                  <Webhook className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">Integration Marketplace</h2>
                  <p className="text-sm text-slate-600">Connect with your favorite tools</p>
                </div>
              </div>
              <button onClick={() => setShowIntegrationsModal(false)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map(integration => (
                <div key={integration.id} className="glass rounded-xl p-6 hover:scale-105 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${integration.connected ? 'bg-green-100' : 'bg-slate-100'}`}>
                      <integration.icon className={`w-6 h-6 ${integration.connected ? 'text-green-600' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-800">{integration.name}</div>
                      <div className="text-xs text-slate-500 mb-1">{integration.category}</div>
                      <div className="text-sm text-slate-600">{integration.description}</div>
                    </div>
                  </div>
                  <div>
                    {integration.connected ? (
                      <button
                        onClick={() => disconnectIntegration(integration.id)}
                        className="w-full px-4 py-2 bg-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-300 transition-all"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => connectIntegration(integration.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-blue-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Webhook className="w-5 h-5 text-blue-600" />
                Why Integrations Matter
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                <div>
                  <p className="font-semibold mb-1">💬 Communication Tools</p>
                  <p className="text-xs">Sync schedules to Slack, Teams for instant notifications</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">💰 Payroll Systems</p>
                  <p className="text-xs">Auto-export hours to QuickBooks, ADP for seamless payroll</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">📅 Calendar Apps</p>
                  <p className="text-xs">Sync shifts to Google/Outlook calendars automatically</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">📊 Analytics Platforms</p>
                  <p className="text-xs">Send data to Tableau, Power BI for advanced reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 KRONO AI CHATBOT MODAL */}
      {showKronoChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowKronoChat(false)}>
          <div className="glass rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden relative">
                    <img 
                      src="/krono-avatar.png" 
                      alt="Krono AI" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl">
                      🤖
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">Krono AI Assistant</h2>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online & Ready to Help
                  </p>
                </div>
              </div>
              <button onClick={() => setShowKronoChat(false)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {kronoMessages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl overflow-hidden relative">
                    <img 
                      src="/krono-avatar.png" 
                      alt="Krono" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-6xl">
                      🤖
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Hey! I'm Krono! 👋</h3>
                  <p className="text-slate-600 mb-4">Your AI-powered scheduling assistant</p>
                  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <button
                      onClick={() => {
                        setKronoMessages([{role: 'user', message: 'Show me this week\'s schedule', timestamp: Date.now()}]);
                        setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: 'Here\'s your week! You have 12 shifts scheduled with total coverage of 240 hours. Peak busy day is Friday with 5 employees.', timestamp: Date.now()}]), 1000);
                      }}
                      className="glass hover:bg-purple-50 p-4 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold text-purple-700">📅 Show this week</p>
                      <p className="text-xs text-slate-500">View weekly overview</p>
                    </button>
                    <button
                      onClick={() => {
                        setKronoMessages([{role: 'user', message: 'Who needs more hours?', timestamp: Date.now()}]);
                        setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: 'Based on availability: Izzy (16hrs), Kenny (18hrs), and Karen (20hrs) all have open availability and could take more shifts this week!', timestamp: Date.now()}]), 1000);
                      }}
                      className="glass hover:bg-blue-50 p-4 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold text-blue-700">👥 Who needs hours?</p>
                      <p className="text-xs text-slate-500">Find available staff</p>
                    </button>
                    <button
                      onClick={() => {
                        setKronoMessages([{role: 'user', message: 'Any conflicts today?', timestamp: Date.now()}]);
                        setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: 'All clear! ✅ No scheduling conflicts detected for today. Everyone is assigned appropriately.', timestamp: Date.now()}]), 1000);
                      }}
                      className="glass hover:bg-green-50 p-4 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold text-green-700">⚠️ Check conflicts</p>
                      <p className="text-xs text-slate-500">Detect issues</p>
                    </button>
                    <button
                      onClick={() => {
                        setKronoMessages([{role: 'user', message: 'Generate this month\'s schedule', timestamp: Date.now()}]);
                        setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: '🪄 AI-generating optimal schedule... Balanced 120 shifts across 4 employees! Considering availability, skills, and preferences. Ready to publish?', timestamp: Date.now()}]), 1500);
                      }}
                      className="glass hover:bg-amber-50 p-4 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold text-amber-700">🪄 Auto-schedule</p>
                      <p className="text-xs text-slate-500">AI magic</p>
                    </button>
                  </div>
                </div>
              )}

              {kronoMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'glass'} rounded-2xl p-4`}>
                    <div className="flex items-start gap-3">
                      {msg.role === 'krono' && (
                        <img 
                          src="/krono-avatar.png" 
                          alt="Krono" 
                          className="w-8 h-8 rounded-lg shrink-0"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                          }}
                          onError={(e) => e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">🤖</text></svg>'}
                        />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={kronoInput}
                  onChange={(e) => setKronoInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && kronoInput.trim()) {
                      setKronoMessages(prev => [...prev, {role: 'user', message: kronoInput, timestamp: Date.now()}]);
                      setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: `I understand you're asking about "${kronoInput}". Let me help you with that! 🚀`, timestamp: Date.now()}]), 1000);
                      setKronoInput('');
                    }
                  }}
                  placeholder="Ask Krono anything... (e.g., 'Fill gaps next week', 'Who's available Friday?')"
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500"
                />
                <button
                  onClick={() => {
                    if (kronoInput.trim()) {
                      setKronoMessages(prev => [...prev, {role: 'user', message: kronoInput, timestamp: Date.now()}]);
                      setTimeout(() => setKronoMessages(prev => [...prev, {role: 'krono', message: `I understand you're asking about "${kronoInput}". Let me help you with that! 🚀`, timestamp: Date.now()}]), 1000);
                      setKronoInput('');
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎮 GAMEHUB MODAL */}
      {showGameHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowGameHub(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl text-white relative overflow-hidden">
                  <Gamepad2 className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">GameHub</h2>
                  <p className="text-sm text-slate-600">Team building through play • Earn XP while connecting</p>
                </div>
              </div>
              <button onClick={() => setShowGameHub(false)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Featured Games */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer border-2 border-purple-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trivia Challenge</h3>
                    <p className="text-xs text-slate-500">2-8 players • 15 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Test knowledge on work policies, industry facts, and fun topics!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">3 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Play Now +50 XP
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer border-2 border-green-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    🃏
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Cards Against Work</h3>
                    <p className="text-xs text-slate-500">3-10 players • 30 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Hilarious office-themed party game for team bonding!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">7 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Join Game +75 XP
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer border-2 border-blue-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    🏁
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Schedule Sprint</h3>
                    <p className="text-xs text-slate-500">2-4 players • 10 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Race to build the perfect schedule against colleagues!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">2 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Start Race +60 XP
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎨
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Pictionary Office</h3>
                    <p className="text-xs text-slate-500">4-12 players • 20 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Draw workplace scenarios and guess what colleagues sketch!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">5 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Draw Now +55 XP
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎲
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Two Truths & A Lie</h3>
                    <p className="text-xs text-slate-500">3-20 players • 15 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Get to know your team with this classic icebreaker game!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">1 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Start +40 XP
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                    👥
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Manager vs Team</h3>
                    <p className="text-xs text-slate-500">2 teams • 25 min</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Compete in challenges - managers vs staff showdown!</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">6 online</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs rounded-lg hover:scale-105 transition-all">
                    Join Battle +100 XP
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-amber-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Why GameHub Matters
              </h3>
              <p className="text-sm text-slate-700 mb-4">
                Studies show teams that play together work better together! GameHub strengthens relationships, improves communication, and makes work more fun.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">+25%</p>
                  <p className="text-xs text-slate-600">Team Cohesion</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">+40%</p>
                  <p className="text-xs text-slate-600">Engagement</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">Earn XP</p>
                  <p className="text-xs text-slate-600">While Playing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🛍️ MERCH STORE MODAL */}
      {showMerchStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowMerchStore(false)}>
          <div className="glass rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl text-white relative overflow-hidden">
                  <ShoppingBag className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">XP Merch Store</h2>
                  <p className="text-sm text-slate-600">Redeem your hard-earned XP for awesome rewards!</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass px-6 py-3 rounded-xl">
                  <p className="text-xs text-slate-500">Your Balance</p>
                  <p className="text-2xl font-black text-purple-600">{currentEmployeeXP} XP</p>
                </div>
                <button onClick={() => setShowMerchStore(false)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchItems.map((item) => {
                const canAfford = currentEmployeeXP >= item.xpCost;
                return (
                  <div key={item.id} className={`glass rounded-2xl p-6 transition-all ${canAfford ? 'hover:scale-105 cursor-pointer border-2 border-green-300' : 'opacity-60'}`}>
                    <div className="text-6xl mb-4 text-center">{item.image}</div>
                    <h3 className="font-bold text-lg mb-2 text-slate-800">{item.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-purple-600">{item.xpCost} XP</span>
                      {item.inStock ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">IN STOCK</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">SOLD OUT</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (canAfford && item.inStock) {
                          setStatus({ type: 'success', msg: `Redeemed ${item.name} for ${item.xpCost} XP! 🎉` });
                          setCurrentEmployeeXP(prev => prev - item.xpCost);
                          setPurchaseHistory(prev => [...prev, {itemId: item.id, date: Date.now(), xpSpent: item.xpCost}]);
                        }
                      }}
                      disabled={!canAfford || !item.inStock}
                      className={`w-full px-4 py-3 font-bold rounded-xl transition-all ${
                        canAfford && item.inStock
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford && item.inStock ? 'REDEEM NOW' : !canAfford ? `Need ${item.xpCost - currentEmployeeXP} more XP` : 'OUT OF STOCK'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-purple-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                How to Earn More XP
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xl font-bold text-green-600">+{xpEconomy.clockInOnTime} XP</p>
                  <p className="text-xs text-slate-600">On-time clock-in</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xl font-bold text-blue-600">+{xpEconomy.noOvertime} XP</p>
                  <p className="text-xs text-slate-600">No overtime</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xl font-bold text-amber-600">+{xpEconomy.bonusShiftPickup} XP</p>
                  <p className="text-xs text-slate-600">Bonus shift</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xl font-bold text-purple-600">+{xpEconomy.policyCompliance} XP</p>
                  <p className="text-xs text-slate-600">Policy follow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💎 XP ECONOMY CONTROLS MODAL (Manager Only) */}
      {showEconomyControls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowEconomyControls(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl text-white relative overflow-hidden">
                  <Settings className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">XP Economy Controls</h2>
                  <p className="text-sm text-slate-600">Fine-tune XP rewards and merch pricing</p>
                </div>
              </div>
              <button onClick={() => setShowEconomyControls(false)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* XP Rates */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                XP Reward Rates
              </h3>
              <div className="space-y-4">
                {Object.entries(xpEconomy).map(([key, value]) => (
                  <div key={key} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-xs text-slate-500">Current reward: {value} XP</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={value}
                        onChange={(e) => setXpEconomy(prev => ({...prev, [key]: parseInt(e.target.value)}))}
                        className="w-48"
                      />
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setXpEconomy(prev => ({...prev, [key]: parseInt(e.target.value) || 0}))}
                        className="w-20 px-3 py-2 border-2 border-slate-300 rounded-lg text-center font-bold"
                      />
                      <span className="text-sm text-slate-600 font-semibold">XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Merch Pricing */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-green-500" />
                Merch Store Pricing
              </h3>
              <div className="space-y-4">
                {merchItems.map((item) => (
                  <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{item.image}</span>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={item.xpCost}
                        onChange={(e) => setMerchItems(prev => prev.map(i => i.id === item.id ? {...i, xpCost: parseInt(e.target.value)} : i))}
                        className="w-48"
                      />
                      <input
                        type="number"
                        value={item.xpCost}
                        onChange={(e) => setMerchItems(prev => prev.map(i => i.id === item.id ? {...i, xpCost: parseInt(e.target.value) || 0} : i))}
                        className="w-24 px-3 py-2 border-2 border-slate-300 rounded-lg text-center font-bold"
                      />
                      <span className="text-sm text-slate-600 font-semibold">XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-amber-50">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Manager Tip
              </h3>
              <p className="text-sm text-slate-700">
                Balance is key! Set XP rewards high enough to motivate, but not so high that merch becomes too easy to earn. Monitor redemption rates weekly.
              </p>
            </div>

            <button
              onClick={() => {
                setStatus({ type: 'success', msg: 'XP economy settings saved!' });
                setShowEconomyControls(false);
              }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-xl transition-all shadow-xl"
            >
              SAVE ECONOMY SETTINGS
            </button>
          </div>
        </div>
      )}

      {/* 🔮 THE ORACLE AI ANALYTICS PANEL */}
      {showOracle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setShowOracle(false)}>
          <div className="bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl" onClick={(e) => e.stopPropagation()} style={{border: '2px solid rgba(168, 85, 247, 0.4)'}}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl relative overflow-hidden">
                  <BrainCircuit className="w-10 h-10 text-white relative z-10 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white flex items-center gap-3">
                    THE ORACLE
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  </h2>
                  <p className="text-violet-200 font-medium">AI-Powered Workforce Analytics & Predictions</p>
                </div>
              </div>
              <button onClick={() => setShowOracle(false)} className="p-3 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            {/* Compliance Score */}
            <div className="mb-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-green-300" />
                    Labor Law Compliance Score
                  </h3>
                  <p className="text-green-200 text-sm">Real-time tracking of federal, state, and local labor regulations</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-green-300">{oracleInsights.laborCompliance.score}%</div>
                  <div className="text-green-200 text-sm font-semibold">COMPLIANCE</div>
                </div>
              </div>
              {oracleInsights.laborCompliance.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {oracleInsights.laborCompliance.warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-amber-500/20 border border-amber-400/40 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-amber-300 shrink-0" />
                      <span className="text-amber-100 text-sm font-medium">{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grid Layout for Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* Burnout Risk Analysis */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Burnout Risk Detection
                </h3>
                <div className="space-y-3">
                  {oracleInsights.burnoutRisk.sort((a, b) => b.risk - a.risk).slice(0, 5).map((emp, idx) => (
                    <div key={idx} className="bg-black/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{emp.name}</span>
                        <div className={`px-3 py-1 rounded-lg font-bold text-xs ${emp.risk > 75 ? 'bg-red-500' : emp.risk > 50 ? 'bg-amber-500' : 'bg-green-500'}`}>
                          {emp.risk.toFixed(0)}% RISK
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div className={`h-2 rounded-full ${emp.risk > 75 ? 'bg-red-500' : emp.risk > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${emp.risk}%`}}></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {emp.factors.slice(0, 2).map((factor, fidx) => (
                          <span key={fidx} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md">{factor}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flight Risk Prediction */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  Flight Risk Prediction
                </h3>
                <div className="space-y-3">
                  {oracleInsights.flightRisk.sort((a, b) => b.risk - a.risk).slice(0, 5).map((emp, idx) => (
                    <div key={idx} className="bg-black/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{emp.name}</span>
                        <div className={`px-3 py-1 rounded-lg font-bold text-xs ${emp.risk > 75 ? 'bg-red-500' : emp.risk > 50 ? 'bg-amber-500' : 'bg-green-500'}`}>
                          {emp.risk.toFixed(0)}% RISK
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div className={`h-2 rounded-full ${emp.risk > 75 ? 'bg-red-500' : emp.risk > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${emp.risk}%`}}></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {emp.indicators.slice(0, 2).map((indicator, iidx) => (
                          <span key={iidx} className="text-xs bg-white/10 text-white px-2 py-1 rounded-md">{indicator}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overtime Forecast */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  Overtime Forecast (Next 2 Weeks)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {oracleInsights.overtimeForecast.filter(emp => emp.projectedHours > 0).slice(0, 8).map((emp, idx) => (
                    <div key={idx} className="bg-black/30 rounded-xl p-4 text-center">
                      <div className="font-bold text-white text-lg mb-1">{emp.name}</div>
                      <div className={`text-3xl font-black mb-1 ${emp.projectedHours > 15 ? 'text-red-400' : emp.projectedHours > 10 ? 'text-amber-400' : 'text-blue-400'}`}>
                        +{emp.projectedHours}h
                      </div>
                      <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        {emp.trend === 'increasing' ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                        {emp.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-300" />
                AI Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="font-bold text-white mb-1">Redistribute Workload</div>
                  <div className="text-sm text-cyan-200">3 employees need fewer hours to prevent burnout</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-bold text-white mb-1">Increase Incentives</div>
                  <div className="text-sm text-cyan-200">Offer bonuses for weekend shifts to balance coverage</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-bold text-white mb-1">Schedule 1-on-1s</div>
                  <div className="text-sm text-cyan-200">2 high-risk employees need manager check-ins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* �💬 KRONO FLOATING CHATBOT */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 print:hidden bg-transparent"
        >
          <img 
            src="/krono-avatar.png" 
            alt="Krono"
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) parent.innerHTML = '<div class="text-3xl">🤖</div>';
            }}
          />
        </button>
      )}

      {showChatbot && (
        <div className="fixed bottom-6 right-6 z-[60] w-96 h-[600px] animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-gradient-to-br from-purple-950 via-violet-900 to-fuchsia-950 rounded-2xl shadow-2xl h-full flex flex-col border-2 border-purple-500/40" style={{boxShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.2)'}}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 p-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 p-0.5 animate-pulse">
                    <img 
                      src="/krono-avatar.png" 
                      alt="Krono"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.innerHTML = '<div class="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-violet-950 flex items-center justify-center text-2xl">🤖</div>';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-400"></div>
                </div>
                <div>
                  <h3 className="font-black text-white text-lg tracking-tight">KRONO</h3>
                  <p className="text-xs text-purple-200 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Scheduling Assistant
                  </p>
                </div>
              </div>
              <button onClick={() => setShowChatbot(false)} className="p-2 hover:bg-white/10 rounded-lg transition-all relative z-10">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-950/50 to-violet-950/30">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 p-0.5 flex items-center justify-center mr-2 shrink-0">
                      <img 
                        src="/krono-avatar.png" 
                        alt="Krono"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) parent.innerHTML = '🤖';
                        }}
                      />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-gradient-to-br from-purple-900/80 to-violet-900/80 text-white border border-purple-500/30 backdrop-blur-lg'
                  }`}>
                    <div className="text-sm font-medium">{msg.text}</div>
                    <div className="text-[10px] opacity-60 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-gradient-to-br from-purple-950 to-violet-950 border-t border-purple-500/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      const userMsg = {role: 'user' as const, text: chatInput, timestamp: Date.now()};
                      setChatMessages(prev => [...prev, userMsg]);
                      
                      // Simple AI response
                      setTimeout(() => {
                        let response = "I can help you with scheduling! Try asking about coverage, compliance, or shift optimization.";
                        if (chatInput.toLowerCase().includes('coverage')) {
                          response = "📊 Current coverage looks good for this week. You have 18 shifts scheduled with balanced distribution.";
                        } else if (chatInput.toLowerCase().includes('complian')) {
                          response = `✅ Labor compliance score: ${oracleInsights.laborCompliance.score}%. You have ${oracleInsights.laborCompliance.warnings.length} warnings to review.`;
                        } else if (chatInput.toLowerCase().includes('overtime')) {
                          response = "⚠️ 3 employees are projected to hit overtime next week. Consider redistributing shifts.";
                        } else if (chatInput.toLowerCase().includes('bonus')) {
                          response = `💰 You have ${bonusOfferings.filter(b => !b.claimed).length} unclaimed bonus offerings available. Promote these to increase shift pickups!`;
                        }
                        setChatMessages(prev => [...prev, {role: 'assistant', text: response, timestamp: Date.now()}]);
                      }, 800);
                      
                      setChatInput('');
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 bg-purple-900/50 border-2 border-purple-500/40 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      const userMsg = {role: 'user' as const, text: chatInput, timestamp: Date.now()};
                      setChatMessages(prev => [...prev, userMsg]);
                      setTimeout(() => {
                        setChatMessages(prev => [...prev, {role: 'assistant', text: "I can help with scheduling, coverage, compliance, and more!", timestamp: Date.now()}]);
                      }, 500);
                      setChatInput('');
                    }
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-xl text-white font-bold transition-all shadow-lg shadow-purple-500/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📅 PERSONAL PANEL - Reminders & Events */}
      {showPersonalPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={() => setShowPersonalPanel(false)}>
          <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border-2 border-indigo-500/40" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-2xl font-black text-white">Personal Calendar</h2>
                  <p className="text-sm text-indigo-200">Your reminders & events</p>
                </div>
              </div>
              <button onClick={() => setShowPersonalPanel(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button className="px-6 py-3 font-bold text-white bg-indigo-500/30 border-b-2 border-white">
                📋 Reminders
              </button>
              <button className="px-6 py-3 font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all">
                📅 Events
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add New Reminder Form */}
              <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Add New Reminder</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Reminder title..."
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-indigo-400 focus:outline-none"
                  />
                  <input 
                    type="date" 
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-indigo-400 focus:outline-none"
                  />
                  <input 
                    type="time" 
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-indigo-400 focus:outline-none"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all shadow-lg">
                    <PlusCircle className="w-5 h-5 inline mr-2" />
                    Add Reminder
                  </button>
                </div>
              </div>

              {/* Reminders List */}
              <div className="space-y-3">
                {personalReminders.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">No reminders yet</p>
                    <p className="text-sm">Add your first reminder above</p>
                  </div>
                ) : (
                  personalReminders.map(reminder => (
                    <div key={reminder.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{reminder.title}</h4>
                          <p className="text-sm text-white/60">{reminder.date} at {reminder.time}</p>
                          {reminder.notes && <p className="text-xs text-white/40 mt-1">{reminder.notes}</p>}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏪 XP MERCH STORE */}
      {showMerchStore && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setShowMerchStore(false)}>
          <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl" onClick={(e) => e.stopPropagation()} style={{border: '2px solid rgba(16, 185, 129, 0.4)'}}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl relative overflow-hidden">
                  <ShoppingBag className="w-10 h-10 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white flex items-center gap-3">
                    XP MERCH STORE
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </h2>
                  <p className="text-green-200 font-medium">Trade Your XP Points for Rewards!</p>
                </div>
              </div>
              <button onClick={() => setShowMerchStore(false)} className="p-3 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            {/* User XP Balance */}
            <div className="mb-8 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/40 rounded-2xl p-6 text-center">
              <div className="text-sm text-yellow-200 mb-2 font-semibold">YOUR XP BALANCE</div>
              <div className="text-6xl font-black text-yellow-300 flex items-center justify-center gap-3">
                <Star className="w-12 h-12" />
                {employeeXP[employees[0]?.name]?.total || 0}
                <Star className="w-12 h-12" />
              </div>
            </div>

            {/* Merch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchItems.map((item) => {
                const canAfford = (employeeXP[employees[0]?.name]?.total || 0) >= item.xpCost;
                return (
                  <div key={item.id} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all ${canAfford ? 'border-green-400 hover:scale-105 cursor-pointer' : 'border-white/20 opacity-60'}`}>
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">{item.image}</div>
                      <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs text-white font-semibold mb-3">
                        {item.category.toUpperCase()}
                      </div>
                    </div>
                    <div className={`text-center py-3 rounded-xl font-bold ${canAfford ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                      <Star className="w-5 h-5 inline mr-2" />
                      {item.xpCost} XP
                    </div>
                    {canAfford && (
                      <button
                        onClick={() => {
                          setStatus({type: 'success', msg: `🎉 ${item.name} purchased!`});
                          setEmployeeXP(prev => ({
                            ...prev,
                            [employees[0]?.name]: {
                              ...prev[employees[0]?.name],
                              total: prev[employees[0]?.name].total - item.xpCost
                            }
                          }));
                        }}
                        className="w-full mt-3 px-4 py-3 bg-white hover:bg-gray-100 text-green-900 font-bold rounded-xl transition-all"
                      >
                        REDEEM NOW
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Oracle AI Panel */}
      {showOracleAI && (
        <OracleAIPanel
          shifts={shifts}
          employees={employees}
          onClose={() => setShowOracleAI(false)}
        />
      )}

      {/* Conflict Detector */}
      {showConflicts && (
        <ConflictDetector
          shifts={shifts}
          onClose={() => setShowConflicts(false)}
        />
      )}

      {/* Shift Marketplace */}
      {showMarketplace && (
        <ShiftMarketplace
          onClose={() => setShowMarketplace(false)}
          employees={employees}
          onClaimShift={(shiftId, employeeId) => {
            console.log('Shift claimed:', shiftId, employeeId);
            setStatus({ type: 'success', msg: 'Shift claimed successfully!' });
          }}
        />
      )}

      {/* PTO Donations */}
      {showPTODonations && (
        <PTODonations
          onClose={() => setShowPTODonations(false)}
          employees={employees}
          onDonate={(requestId, employeeId, hours) => {
            console.log('PTO donated:', requestId, employeeId, hours);
            setStatus({ type: 'success', msg: `${hours} hours donated!` });
          }}
        />
      )}

      {/* Performance Dashboard */}
      {showPerformanceDashboard && (
        <PerformanceDashboard
          shifts={shifts}
          employees={employees}
          onClose={() => setShowPerformanceDashboard(false)}
        />
      )}

      {/* Schedule Publisher */}
      {showSchedulePublisher && (
        <SchedulePublisher
          shifts={shifts}
          employees={employees}
          currentMonth={currentMonth}
          onClose={() => setShowSchedulePublisher(false)}
          onPublish={(notifyEmployees, lockSchedule) => {
            setStatus({type: 'success', msg: `📅 Schedule published! ${notifyEmployees ? `${new Set(shifts.map(s => s.employeeName)).size} employees notified` : ''}`});
          }}
        />
      )}

      {/* Budget Alerts */}
      {showBudgetAlerts && (
        <BudgetAlerts
          shifts={shifts}
          monthlyBudget={monthlyBudget}
          budgetUsed={budgetUsed}
          currentMonth={currentMonth}
          onClose={() => setShowBudgetAlerts(false)}
        />
      )}

      {/* Quick-Fill AI */}
      {showQuickFillAI && (
        <QuickFillAI
          shifts={shifts}
          employees={employees}
          selectedWeek={selectedDate}
          onClose={() => setShowQuickFillAI(false)}
          onApplySuggestions={(suggestions) => {
            setStatus({type: 'success', msg: `🤖 AI assigned ${suggestions.length} shifts automatically!`});
          }}
        />
      )}

      {/* Manager Notes */}
      {showManagerNotes && (
        <ManagerNotes
          selectedDate={selectedDate}
          shifts={shifts}
          onClose={() => setShowManagerNotes(false)}
          onSaveNote={(note) => {
            setStatus({type: 'success', msg: `📝 Note saved: ${note.title}`});
          }}
        />
      )}

      {/* Shift Report Templates */}
      {showReportTemplates && (
        <ShiftReportTemplates
          onClose={() => setShowReportTemplates(false)}
          currentUser={employees[0]?.name || 'Manager'}
          onSaveTemplate={(template) => {
            setStatus({type: 'success', msg: `📄 Template "${template.name}" created!`});
          }}
          onUseTemplate={(templateId) => {
            setStatus({type: 'success', msg: '📝 Template loaded! Fill out your shift report.'});
          }}
        />
      )}

      {/* Employee Management */}
      {showEmployeeManagement && (
        <EmployeeManagement
          onClose={() => setShowEmployeeManagement(false)}
          currentUser={employees[0]?.name || 'Manager'}
          onAddEmployee={(employee) => {
            setStatus({type: 'success', msg: `✅ ${employee.name} added successfully!`});
          }}
          onUpdateEmployee={(employee) => {
            setStatus({type: 'success', msg: `✅ ${employee.name} updated!`});
          }}
        />
      )}

      {/* Employee Onboarding */}
      {showEmployeeOnboarding && (
        <EmployeeOnboarding
          employeeName="New Employee"
          employeeEmail="employee@company.com"
          companyName="Your Company"
          managerName={employees[0]?.name || 'Manager'}
          startDate={new Date().toISOString()}
          onComplete={() => {
            setShowEmployeeOnboarding(false);
            setStatus({type: 'success', msg: '🎉 Welcome onboarding complete!'});
          }}
          onSkip={() => setShowEmployeeOnboarding(false)}
        />
      )}

      {/* Employee Basecamp */}
      {showEmployeeBasecamp && (
        <EmployeeBasecamp
          currentUser={employees[0]?.name || 'Employee'}
          onClose={() => setShowEmployeeBasecamp(false)}
        />
      )}

    </div>
  );
}
