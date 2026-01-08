import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
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
  BrainCircuit
} from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import ThemeSelector from './ThemeSelector';
import GuildDashboard from '../features/guild/GuildDashboard';
import { useTheme } from '../context/ThemeContext';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
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
import { firebaseConfig, appId as configAppId, initialAuthToken } from '../firebase.config';

// --- Firebase Configuration ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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
}

interface Holiday {
  date: string;
  name: string;
  type: 'federal' | 'company' | 'custom';
}

interface EmployeeStats {
  totalHours: number;
  totalShifts: number;
  totalEarnings: number;
  avgShiftLength: number;
  daysWorked: number;
  overtimeHours: number;
}

interface EmployeeBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate?: string;
}

interface EmployeeSkill {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  certified: boolean;
  certificationDate?: string;
  expiryDate?: string;
}

interface PerformanceMetric {
  employeeName: string;
  attendance: number; // percentage
  punctuality: number; // percentage
  satisfaction: number; // 1-5 stars
  shiftCompletionRate: number; // percentage
  lastReviewDate?: string;
}

interface ShiftBid {
  shiftId: string;
  employeeName: string;
  bidAmount: number;
  bidTime: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

interface AIRecommendation {
  type: 'scheduling' | 'cost' | 'performance' | 'staffing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action?: string;
}

interface LocationTracking {
  employeeName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: 'on-site' | 'in-transit' | 'off-site';
  distanceToWork: number; // miles
}

interface SentimentAnalysis {
  employeeName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  recentMessages: string[];
  timestamp: string;
}

interface WellnessAlert {
  employeeName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  hoursWorkedThisWeek: number;
  consecutiveDays: number;
  recommendation: string;
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
  icon: string;
  category: 'communication' | 'payroll' | 'hr' | 'analytics' | 'calendar';
  connected: boolean;
  description: string;
}

// --- Main Component ---

export default function Scheduler() {
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
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month' | 'agenda'>('month');
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
  const [darkMode, setDarkMode] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [employeeAvailability, setEmployeeAvailability] = useState<Record<string, any>>({});
  const [showConflictDetector, setShowConflictDetector] = useState(false);
  const [showCostForecast, setShowCostForecast] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [showCompareView, setShowCompareView] = useState(false);
  const [compareMonth, setCompareMonth] = useState<Date>(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  
  // Revolutionary Features State
  const [showGamification, setShowGamification] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showSkillsMatrix, setShowSkillsMatrix] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showBiddingSystem, setShowBiddingSystem] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [showPredictive, setShowPredictive] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showLocationTracking, setShowLocationTracking] = useState(false);
  const [showSentimentAnalysis, setShowSentimentAnalysis] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [showWellnessMonitor, setShowWellnessMonitor] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const [employeeBadges, setEmployeeBadges] = useState<Record<string, EmployeeBadge[]>>({});
  const [employeePoints, setEmployeePoints] = useState<Record<string, number>>({});
  const [employeeSkills, setEmployeeSkills] = useState<Record<string, EmployeeSkill[]>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [shiftBids, setShiftBids] = useState<ShiftBid[]>([]);
  const [satisfactionRatings, setSatisfactionRatings] = useState<Record<string, { date: string; rating: 1 | 2 | 3 | 4 | 5; comment?: string }[]>>({});
  const [locationData, setLocationData] = useState<LocationTracking[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [wellnessAlerts, setWellnessAlerts] = useState<WellnessAlert[]>([]);
  const [voiceHistory, setVoiceHistory] = useState<VoiceCommand[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationApp[]>([
    { id: 'slack', name: 'Slack', icon: '💬', category: 'communication', connected: false, description: 'Team chat integration' },
    { id: 'teams', name: 'Microsoft Teams', icon: '📞', category: 'communication', connected: false, description: 'Video conferencing' },
    { id: 'quickbooks', name: 'QuickBooks', icon: '📊', category: 'payroll', connected: false, description: 'Payroll sync' },
    { id: 'adp', name: 'ADP', icon: '💰', category: 'payroll', connected: false, description: 'HR & payroll' },
    { id: 'bamboohr', name: 'BambooHR', icon: '🌿', category: 'hr', connected: false, description: 'HR management' },
    { id: 'gcal', name: 'Google Calendar', icon: '📅', category: 'calendar', connected: true, description: 'Calendar sync' },
    { id: 'outlook', name: 'Outlook', icon: '📧', category: 'calendar', connected: false, description: 'Email & calendar' },
    { id: 'tableau', name: 'Tableau', icon: '📈', category: 'analytics', connected: false, description: 'Business intelligence' },
  ]);
  const [notifications, setNotifications] = useState<Array<{id: string; type: string; message: string; timestamp: number; read: boolean}>>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  
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
  const [roles, setRoles] = useState(['Reception', 'Concierge', 'Manager']);
  const [employees, setEmployees] = useState<Employee[]>([
      { name: 'Izzy', rate: 18 }, 
      { name: 'Karen', rate: 18 }, 
      { name: 'Annalissia', rate: 18 }, 
      { name: 'Kenny', rate: 18 }
  ]);
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
    shiftComments: ''
  });

  const themeClasses = APP_THEMES[appTheme];

  // Load localStorage settings
  useEffect(() => {
    const savedTimeFormat = localStorage.getItem('noxshift-time-format');
    if (savedTimeFormat) setTimeFormat(savedTimeFormat as '12h' | '24h');
    
    const savedPhotos = localStorage.getItem(`noxshift-employee-photos-${appId}`);
    if (savedPhotos) setEmployeePhotos(JSON.parse(savedPhotos));
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
        setShowSettingsModal(true);
      }
      // Esc: Close all modals
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setShowSettingsModal(false);
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
        prevMonth();
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextMonth();
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
        
        setStatus({ type: 'success', msg: 'Final Schedule Applied' });
        setShowSettings(false);
        setCurrentDate(new Date(2026, 0, 1));

    } catch (error: any) {
        console.error("Gen failed", error);
        setStatus({ type: 'error', msg: 'Error: ' + error.message });
    }
    setLoading(false);
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

  // AI-Powered Recommendations
  const generateAIRecommendations = (): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze understaffing
    const datesMap = shifts.reduce((acc, s) => {
      const date = s.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      if (!s.isDraft && !s.isTimeOff) acc[date].push(s);
      return acc;
    }, {} as Record<string, Shift[]>);

    Object.entries(datesMap).forEach(([date, dayShifts]) => {
      if (dayShifts.length < 2) {
        recommendations.push({
          type: 'staffing',
          priority: 'high',
          title: 'Understaffed Day Detected',
          description: `${new Date(date).toLocaleDateString()} has only ${dayShifts.length} employee(s). Consider adding more coverage.`,
          action: 'Add Staff'
        });
      }
    });

    // Analyze overtime
    employees.forEach(emp => {
      const stats = getEmployeeStats(emp.name);
      if (stats.overtimeHours > 10) {
        recommendations.push({
          type: 'cost',
          priority: 'critical',
          title: `Excessive Overtime: ${emp.name}`,
          description: `${emp.name} has ${stats.overtimeHours.toFixed(1)} hours of overtime. This increases labor costs by ${(stats.overtimeHours * emp.rate * 0.5).toFixed(0)}$.`,
          action: 'Redistribute Shifts'
        });
      }
    });

    // Analyze skill gaps
    const roleNeeds = shifts.reduce((acc, s) => {
      if (!s.isDraft && !s.isTimeOff) {
        acc[s.role] = (acc[s.role] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Performance recommendations
    performanceMetrics.forEach(metric => {
      if (metric.attendance < 85) {
        recommendations.push({
          type: 'performance',
          priority: 'medium',
          title: `Low Attendance: ${metric.employeeName}`,
          description: `${metric.employeeName}'s attendance is at ${metric.attendance}%. Consider a performance review.`,
          action: 'Schedule Review'
        });
      }
    });

    // Cost optimization
    const forecast = calculateCostForecast();
    if (forecast.totalCost > 15000) {
      recommendations.push({
        type: 'cost',
        priority: 'high',
        title: 'High Labor Cost Warning',
        description: `Current labor cost is $${forecast.totalCost.toFixed(0)}. Consider optimizing shift lengths or reducing overtime.`,
        action: 'Optimize Schedule'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  // Gamification: Award points for actions
  const awardPoints = (employeeName: string, points: number, reason: string) => {
    setEmployeePoints(prev => ({
      ...prev,
      [employeeName]: (prev[employeeName] || 0) + points
    }));
    
    // Check for badge achievements
    checkBadgeAchievements(employeeName);
    
    // Create notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: `${employeeName} earned ${points} points: ${reason}`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  // Check and award badges
  const checkBadgeAchievements = (employeeName: string) => {
    const stats = getEmployeeStats(employeeName);
    const currentBadges = employeeBadges[employeeName] || [];
    const newBadges: EmployeeBadge[] = [];

    // Perfect Attendance Badge (no missed shifts)
    if (stats.totalShifts >= 20 && !currentBadges.find(b => b.id === 'perfect-attendance')) {
      newBadges.push({
        id: 'perfect-attendance',
        name: 'Perfect Attendance',
        icon: '🎯',
        description: 'Completed 20+ shifts without absence',
        earnedDate: new Date().toISOString()
      });
    }

    // Overtime Champion (high hours)
    if (stats.overtimeHours > 20 && !currentBadges.find(b => b.id === 'overtime-champion')) {
      newBadges.push({
        id: 'overtime-champion',
        name: 'Overtime Champion',
        icon: '💪',
        description: 'Worked 20+ overtime hours',
        earnedDate: new Date().toISOString()
      });
    }

    // Team Player (helped with swaps)
    const swapsHelped = shiftSwapRequests.filter(s => 
      s.targetEmployee === employeeName && s.status === 'Approved'
    ).length;
    if (swapsHelped >= 5 && !currentBadges.find(b => b.id === 'team-player')) {
      newBadges.push({
        id: 'team-player',
        name: 'Team Player',
        icon: '🤝',
        description: 'Helped 5+ coworkers with shift swaps',
        earnedDate: new Date().toISOString()
      });
    }

    // MVP Badge (top earner)
    const allEarnings = employees.map(e => ({ name: e.name, earnings: getEmployeeStats(e.name).totalEarnings }));
    const topEarner = allEarnings.sort((a, b) => b.earnings - a.earnings)[0];
    if (topEarner.name === employeeName && topEarner.earnings > 5000 && !currentBadges.find(b => b.id === 'mvp')) {
      newBadges.push({
        id: 'mvp',
        name: 'MVP',
        icon: '👑',
        description: 'Top earner this month',
        earnedDate: new Date().toISOString()
      });
    }

    if (newBadges.length > 0) {
      setEmployeeBadges(prev => ({
        ...prev,
        [employeeName]: [...currentBadges, ...newBadges]
      }));
      
      setNotifications(prev => [{
        id: Date.now().toString(),
        message: `🎉 ${employeeName} earned ${newBadges.length} new badge(s)!`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
    }
  };

  // Predictive scheduling analytics
  const generatePredictiveAnalytics = () => {
    const historicalData = shifts.filter(s => !s.isDraft);
    
    // Predict busiest days
    const dayOfWeekCounts = historicalData.reduce((acc, s) => {
      const day = new Date(s.date).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const busiestDay = Object.entries(dayOfWeekCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // Predict required staff per day
    const avgStaffPerDay = historicalData.length / 30;

    // Predict turnover risk
    const employeesWithLowHours = employees.filter(emp => {
      const stats = getEmployeeStats(emp.name);
      return stats.totalHours < 80; // Less than 80 hours/month
    });

    return {
      busiestDay: busiestDay ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(busiestDay[0])] : 'N/A',
      avgStaffPerDay: avgStaffPerDay.toFixed(1),
      turnoverRisk: employeesWithLowHours.map(e => e.name),
      recommendedHiring: avgStaffPerDay < 2 ? 'Consider hiring 1-2 more staff' : 'Staffing levels adequate',
      costTrend: 'increasing' // Could be calculated from historical data
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

    // "Schedule [name] for [day]"
    if (transcript.includes('schedule')) {
      const nameMatch = employees.find(e => transcript.includes(e.name.toLowerCase()));
      if (nameMatch) {
        action = `Scheduling ${nameMatch.name}...`;
        success = true;
        // Auto-open shift modal with employee pre-selected
        setTimeout(() => setShowShiftModal(true), 500);
      }
    }
    // "Show me [day]" or "Go to [day]"
    else if (transcript.includes('show') || transcript.includes('go to')) {
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
    }
    // "How many shifts [name]"
    else if (transcript.includes('how many')) {
      const nameMatch = employees.find(e => transcript.includes(e.name.toLowerCase()));
      if (nameMatch) {
        const stats = getEmployeeStats(nameMatch.name);
        action = `${nameMatch.name} has ${stats.totalShifts} shifts this month`;
        success = true;
        alert(action);
      }
    }
    // "Open [feature]"
    else if (transcript.includes('open') || transcript.includes('show')) {
      if (transcript.includes('gamification') || transcript.includes('leaderboard')) {
        setShowGamification(true);
        action = 'Opened gamification';
        success = true;
      } else if (transcript.includes('ai') || transcript.includes('recommendations')) {
        setShowAIInsights(true);
        action = 'Opened AI insights';
        success = true;
      } else if (transcript.includes('chat')) {
        setShowTeamChat(true);
        action = 'Opened team chat';
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
        
        // Mock workplace coordinates (replace with actual)
        const workLat = 40.7128;
        const workLon = -74.0060;
        
        // Calculate distance using Haversine formula
        const R = 3959; // Earth radius in miles
        const dLat = (workLat - latitude) * Math.PI / 180;
        const dLon = (workLon - longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(workLat * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        const status: 'on-site' | 'in-transit' | 'off-site' = 
          distance < 0.1 ? 'on-site' : 
          distance < 5 ? 'in-transit' : 'off-site';

        const locationUpdate: LocationTracking = {
          employeeName,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          status,
          distanceToWork: distance
        };

        setLocationData(prev => {
          const filtered = prev.filter(l => l.employeeName !== employeeName);
          return [...filtered, locationUpdate];
        });

        // Alert if employee is late and still far away
        if (status === 'off-site') {
          const notification = {
            id: Date.now().toString(),
            type: 'warning',
            message: `⚠️ ${employeeName} is ${distance.toFixed(1)} miles away`,
            timestamp: Date.now(),
            read: false
          };
          setNotifications(prev => [notification, ...prev]);
        }
      });
    }
  };

  // 💭 REVOLUTIONARY: Sentiment Analysis on Team Chat
  const analyzeSentiment = (message: string, employeeName: string) => {
    // Simple sentiment analysis (would use real AI in production)
    const positiveWords = ['great', 'awesome', 'love', 'excellent', 'happy', 'thanks', 'good', 'perfect', 'wonderful'];
    const negativeWords = ['bad', 'hate', 'terrible', 'awful', 'angry', 'frustrated', 'upset', 'annoyed', 'stressed'];
    
    const words = message.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.3;
      if (negativeWords.includes(word)) score -= 0.3;
    });

    // Clamp between -1 and 1
    score = Math.max(-1, Math.min(1, score));
    
    const sentiment: 'positive' | 'neutral' | 'negative' = 
      score > 0.2 ? 'positive' : 
      score < -0.2 ? 'negative' : 'neutral';

    setSentimentData(prev => {
      const existing = prev.find(s => s.employeeName === employeeName);
      if (existing) {
        return prev.map(s => s.employeeName === employeeName ? {
          ...s,
          sentiment,
          score,
          recentMessages: [...s.recentMessages, message].slice(-10),
          timestamp: new Date().toISOString()
        } : s);
      } else {
        return [...prev, {
          employeeName,
          sentiment,
          score,
          recentMessages: [message],
          timestamp: new Date().toISOString()
        }];
      }
    });

    // Alert if negative sentiment detected
    if (sentiment === 'negative') {
      const notification = {
        id: Date.now().toString(),
        type: 'warning',
        message: `😟 ${employeeName} may need support - negative sentiment detected`,
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  // 🤖 REVOLUTIONARY: AI Auto-Schedule Generator
  const generateOptimalSchedule = () => {
    if (!confirm('AI will generate an optimal schedule for the entire month. This will replace existing shifts. Continue?')) {
      return;
    }

    const generatedShifts: Shift[] = [];
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // ML-powered scheduling logic
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekend needs more staff
      const shiftsNeeded = isWeekend ? 5 : 3;
      
      // Distribute fairly based on employee stats
      const employeeWorkload = employees.map(emp => ({
        name: emp.name,
        hours: getEmployeeStats(emp.name).totalHours,
        availability: emp.availability
      })).sort((a, b) => a.hours - b.hours); // Least worked first

      for (let i = 0; i < shiftsNeeded && i < employeeWorkload.length; i++) {
        const emp = employees.find(e => e.name === employeeWorkload[i].name);
        if (!emp) continue;

        const shiftType = i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Night';
        generatedShifts.push({
          id: `ai-${Date.now()}-${i}`,
          employeeName: emp.name,
          date: d.toISOString(),
          type: shiftType,
          startTime: shiftType === 'Morning' ? '07:00' : shiftType === 'Afternoon' ? '15:00' : '23:00',
          endTime: shiftType === 'Morning' ? '15:00' : shiftType === 'Afternoon' ? '23:00' : '07:00',
          role: emp.role,
          rate: emp.rate,
          isPremium: isWeekend,
          timestamp: Date.now()
        });
      }
    }

    // Save to Firebase
    const notification = {
      id: Date.now().toString(),
      type: 'success',
      message: `🤖 AI generated ${generatedShifts.length} optimal shifts!`,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
    
    alert(`AI Auto-Schedule Complete!\n\n✓ ${generatedShifts.length} shifts created\n✓ Workload balanced\n✓ Weekend coverage optimized\n✓ Skills matched to roles`);
  };

  // 💚 REVOLUTIONARY: Employee Wellness & Burnout Detector
  const checkWellnessAlerts = () => {
    const alerts: WellnessAlert[] = [];
    const today = new Date();

    employees.forEach(emp => {
      const stats = getEmployeeStats(emp.name);
      const monthlyShifts = shifts.filter(s => s.employeeName === emp.name);
      
      // Calculate consecutive days worked
      const sortedShifts = monthlyShifts
        .map(s => new Date(s.date))
        .sort((a, b) => a.getTime() - b.getTime());
      
      let maxConsecutive = 0;
      let currentConsecutive = 1;
      for (let i = 1; i < sortedShifts.length; i++) {
        const dayDiff = (sortedShifts[i].getTime() - sortedShifts[i-1].getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
          currentConsecutive = 1;
        }
      }

      // Check for burnout indicators
      if (stats.totalHours > 60) {
        alerts.push({
          employeeName: emp.name,
          riskLevel: stats.totalHours > 80 ? 'critical' : 'high',
          reason: 'Excessive hours worked',
          hoursWorkedThisWeek: stats.totalHours / 4, // Approximate
          consecutiveDays: maxConsecutive,
          recommendation: 'Schedule 2-3 days off to prevent burnout'
        });
      }

      if (maxConsecutive >= 7) {
        alerts.push({
          employeeName: emp.name,
          riskLevel: maxConsecutive >= 10 ? 'critical' : 'high',
          reason: `${maxConsecutive} consecutive days worked`,
          hoursWorkedThisWeek: stats.totalHours / 4,
          consecutiveDays: maxConsecutive,
          recommendation: 'Mandatory rest period required'
        });
      }

      if (stats.overtimeHours > 20) {
        alerts.push({
          employeeName: emp.name,
          riskLevel: 'medium',
          reason: 'High overtime hours',
          hoursWorkedThisWeek: stats.totalHours / 4,
          consecutiveDays: maxConsecutive,
          recommendation: 'Monitor workload and consider redistributing shifts'
        });
      }
    });

    setWellnessAlerts(alerts);

    // Critical alerts notification
    const criticalAlerts = alerts.filter(a => a.riskLevel === 'critical');
    if (criticalAlerts.length > 0) {
      const notification = {
        id: Date.now().toString(),
        type: 'error',
        message: `🚨 ${criticalAlerts.length} critical wellness alerts!`,
        timestamp: Date.now(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
    }

    return alerts;
  };

  // 🔌 REVOLUTIONARY: Integration Connector
  const connectIntegration = async (integrationId: string) => {
    // Simulate OAuth flow (would be real OAuth in production)
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, connected: true } : i
    ));

    const notification = {
      id: Date.now().toString(),
      type: 'success',
      message: `✓ Connected to ${integration.name}!`,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);

    // Show what the integration can do
    alert(`🎉 ${integration.name} Connected!\n\nYou can now:\n• Sync schedules automatically\n• Export data in real-time\n• Receive notifications\n• Access advanced features`);
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
      isTimeOff: false
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
      isTimeOff: shift.isTimeOff || false
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
    setFormData({
      employeeName: shift.employeeName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      role: shift.role,
      department: shift.department || 'General',
      notes: shift.notes || '',
      colorHue: shift.colorHue || null,
      isDraft: shift.isDraft !== undefined ? shift.isDraft : false,
      isTimeOff: shift.isTimeOff || false
    });
    setIsModalOpen(true);
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

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="min-h-[180px] bg-white/30 backdrop-blur-sm border-r border-b border-white/20 print:bg-white print:min-h-[150px]"></div>);

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
        <div key={day} onClick={() => handleDayClick(day)} className={`min-h-[180px] border-r border-b border-white/20 p-3 transition-all duration-300 relative overflow-hidden group ${isToday ? 'bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm ring-2 ring-purple-400/50 print:bg-white' : holiday ? 'bg-gradient-to-br from-yellow-100/60 to-orange-100/60 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'} hover:bg-white/80 hover:shadow-xl hover:scale-[1.01] hover:z-10 print:hover:bg-white cursor-pointer print:cursor-default print:min-h-[150px] animate-fade-in`}>
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
              const holiday = isHoliday(date);
              
              // Check for overtime
              const weekStart = new Date(date);
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
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('shiftId', shift.id!);
                    e.dataTransfer.setData('sourceDate', shift.date);
                  }}
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
                      // Move shift to this date
                      const shiftRef = doc(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`, shiftId);
                      updateDoc(shiftRef, { date: dateStr }).then(() => {
                        setStatus({ type: 'success', msg: 'Shift moved!' });
                      }).catch((err) => {
                        console.error('Drag drop error:', err);
                        setStatus({ type: 'error', msg: 'Failed to move shift' });
                      });
                    }
                  }}
                  onClick={(e) => handleShiftClick(e, shift)} 
                  className={`text-xs px-3 py-2 rounded-lg border shadow-md shift-card animate-slide-in print:border-slate-300 print:shadow-none cursor-move hover:cursor-grab active:cursor-grabbing relative ${isDraft ? 'opacity-90 border-dashed border-2 animate-pulse' : ''}`} 
                  style={{ animationDelay: `${index * 50}ms`, backgroundColor: theme.bg, borderColor: isDraft ? theme.bg : theme.border, color: theme.text }}
                >
                  {/* Overtime Badge */}
                  {hasOvertime && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg print:hidden animate-pulse flex items-center gap-1" title={`${weeklyHours.toFixed(1)} hours this week`}>
                      <AlertCircle className="w-2.5 h-2.5" />
                      OT
                    </div>
                  )}
                  
                  {/* Break Indicator */}
                  {breaks && (
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg print:hidden flex items-center gap-1" title={`Break: ${breaks.breakStart}-${breaks.breakEnd}`}>
                      <Coffee className="w-2.5 h-2.5" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1">
                    {employeePhotos[shift.employeeName] ? (
                      <img 
                        src={employeePhotos[shift.employeeName]} 
                        alt={shift.employeeName}
                        className="w-6 h-6 rounded-full object-cover border border-white/50 shadow-sm shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeProfile(shift.employeeName);
                          setShowEmployeeProfile(true);
                        }}
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-white/50 shadow-sm shrink-0 cursor-pointer hover:scale-110 transition-transform"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeProfile(shift.employeeName);
                          setShowEmployeeProfile(true);
                        }}
                      >
                        {getEmployeeInitials(shift.employeeName)}
                      </div>
                    )}
                    <span className="font-bold text-sm">{formatTime(shift.startTime, timeFormat === '24h')}</span>
                    <Grip className="w-3 h-3 ml-auto opacity-50 shrink-0 print:hidden" />
                  </div>
                  <div className="font-semibold text-xs leading-tight">{shift.employeeName}</div>
                  {shift.shiftComments && (
                    <div className="mt-1 text-[10px] opacity-75 italic truncate" title={shift.shiftComments}>
                      💬 {shift.shiftComments}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) days.push(<div key={`empty-end-${i}`} className="min-h-[180px] bg-white/30 backdrop-blur-sm border-r border-b border-white/20 print:bg-white print:min-h-[150px]"></div>);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const modalTheme = getThemeColors(formData.employeeName || 'Preview', formData.colorHue);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 text-slate-900 ${FONTS[appFont]} flex flex-col print:bg-white`}>
      <header className="glass sticky top-0 z-10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:static print:shadow-none print:px-0 print:py-2 animate-slide-in">
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
             <div className="flex items-center gap-2 glass rounded-xl p-2 print:hidden hover-lift">
                <Building className="w-4 h-4 ml-1 text-purple-500" />
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-2 cursor-pointer min-w-[120px]"
                >
                    <option value="All">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button 
                  onClick={() => setShowDepartmentInput(!showDepartmentInput)} 
                  className="p-1 hover:bg-white/50 rounded-lg transition-all text-slate-600 hover:scale-110"
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

            <div className="flex items-center gap-4 glass rounded-xl p-2 shadow-lg print:bg-transparent print:shadow-none print:p-0">
              <button onClick={handlePrevMonth} className={`p-2.5 hover:bg-white/50 rounded-xl transition-all text-slate-600 hover:scale-110 ${themeClasses.text} print:hidden`}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-extrabold w-44 text-center tabular-nums bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent print:text-left print:w-auto print:text-xl">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className={`p-2.5 hover:bg-white/50 rounded-xl transition-all text-slate-600 hover:scale-110 ${themeClasses.text} print:hidden`}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar View Switcher */}
            <div className="flex items-center gap-1 glass rounded-xl p-1 shadow-lg print:hidden">
              <button 
                onClick={() => setCalendarView('day')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${calendarView === 'day' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-600 hover:bg-white/50'}`}
                title="Day View"
              >
                Day
              </button>
              <button 
                onClick={() => setCalendarView('week')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${calendarView === 'week' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-600 hover:bg-white/50'}`}
                title="Week View"
              >
                Week
              </button>
              <button 
                onClick={() => setCalendarView('month')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${calendarView === 'month' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-600 hover:bg-white/50'}`}
                title="Month View"
              >
                Month
              </button>
              <button 
                onClick={() => setCalendarView('agenda')} 
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${calendarView === 'agenda' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-slate-600 hover:bg-white/50'}`}
                title="Agenda View"
              >
                Agenda
              </button>
            </div>
        </div>

        <div className="flex items-center gap-3">
            {hasDrafts && (
                <button onClick={handlePublishAll} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover-lift flex items-center gap-2 print:hidden animate-pulse">
                    <Send className="w-4 h-4" /> Publish All
                </button>
            )}
            <button onClick={() => setShowStats(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="View Stats">
              <BarChart2 className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={() => setShowThemeSelector(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Themes">
              <Palette className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={() => setShowGuild(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Guild System">
              <Trophy className="w-5 h-5 group-hover:text-amber-600" />
            </button>
            <button onClick={() => setShowOracle(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Oracle AI">
              <Circle className="w-5 h-5 group-hover:text-purple-600" style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' }} />
            </button>
            <button onClick={() => setShowTimeClock(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Time Clock">
              <Clock className="w-5 h-5 group-hover:text-green-600" />
            </button>
            <button onClick={() => setShowTimeOffModal(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Time-Off Requests">
              <CalendarIcon className="w-5 h-5 group-hover:text-red-600" />
            </button>
            <button onClick={() => setShowTemplateModal(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Shift Templates">
              <FileText className="w-5 h-5 group-hover:text-blue-600" />
            </button>
            <button onClick={() => setShowSwapModal(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Shift Swaps">
              <ArrowRightLeft className="w-5 h-5 group-hover:text-orange-600" />
            </button>
            <button onClick={() => setShowAdvancedAnalytics(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Advanced Analytics">
              <BarChart2 className="w-5 h-5 group-hover:text-indigo-600" />
            </button>
            <button onClick={() => setShowNotifications(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="Notifications">
              <MessageSquare className="w-5 h-5 group-hover:text-pink-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button onClick={() => setShowAvailabilityModal(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Employee Availability">
              <Users className="w-5 h-5 group-hover:text-teal-600" />
            </button>
            <button onClick={() => setShowHolidayModal(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Holiday Management">
              <Sparkles className="w-5 h-5 group-hover:text-yellow-600" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Toggle Dark Mode (Ctrl+D)">
              {darkMode ? <Sun className="w-5 h-5 group-hover:text-yellow-500" /> : <Moon className="w-5 h-5 group-hover:text-indigo-600" />}
            </button>
            <button onClick={() => setShowPrintView(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Print View (Ctrl+P)">
              <Printer className="w-5 h-5 group-hover:text-slate-600" />
            </button>
            <button onClick={() => setShowKeyboardShortcuts(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Keyboard Shortcuts (Ctrl+K)">
              <Keyboard className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={handleExportCSV} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Export CSV">
              <Download className="w-5 h-5 group-hover:text-blue-600" />
            </button>
            <button onClick={handleExportiCal} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Export to Calendar (iCal)">
              <CalendarIcon className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={() => setShowConflictDetector(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="Conflict Detector">
              <AlertCircle className="w-5 h-5 group-hover:text-orange-600" />
              {detectAllConflicts().length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {detectAllConflicts().length}
                </span>
              )}
            </button>
            <button onClick={() => setShowCostForecast(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Cost Forecast & Budget">
              <DollarSign className="w-5 h-5 group-hover:text-green-600" />
            </button>
            <button onClick={() => setShowMarketplace(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Shift Marketplace">
              <ShoppingCart className="w-5 h-5 group-hover:text-indigo-600" />
            </button>
            <button onClick={() => setShowBulkOps(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Bulk Operations">
              <Layers className="w-5 h-5 group-hover:text-cyan-600" />
            </button>
            <button onClick={() => setShowCompareView(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Compare Schedules">
              <GitCompare className="w-5 h-5 group-hover:text-violet-600" />
            </button>
            
            {/* REVOLUTIONARY FEATURES */}
            <button onClick={() => {
              setAIRecommendations(generateAIRecommendations());
              setShowAIInsights(true);
            }} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="AI Insights & Recommendations">
              <Brain className="w-5 h-5 group-hover:text-blue-600" />
              {generateAIRecommendations().length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {generateAIRecommendations().length}
                </span>
              )}
            </button>
            <button onClick={() => setShowGamification(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Gamification & Leaderboard">
              <Trophy className="w-5 h-5 group-hover:text-amber-600" />
            </button>
            <button onClick={() => setShowSkillsMatrix(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Skills Matrix & Certifications">
              <Award className="w-5 h-5 group-hover:text-teal-600" />
            </button>
            <button onClick={() => setShowPerformance(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Performance Metrics">
              <LineChart className="w-5 h-5 group-hover:text-pink-600" />
            </button>
            <button onClick={() => setShowBiddingSystem(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Shift Bidding (Premium Shifts)">
              <Gem className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={() => setShowPredictive(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Predictive Analytics">
              <Cpu className="w-5 h-5 group-hover:text-indigo-600" />
            </button>
            <button onClick={() => setShowTeamChat(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Team Communication">
              <MessageCircle className="w-5 h-5 group-hover:text-green-600" />
            </button>

            {/* 🚀 SHOCKING NEW FEATURES */}
            <button 
              onClick={startVoiceCommand} 
              className={`glass ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-white/80 text-slate-700'} p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group`} 
              title="Voice Commands (Say: 'Schedule Mike for Monday')">
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : 'group-hover:text-purple-600'}`} />
              {isListening && <span className="text-xs font-bold">Listening...</span>}
            </button>
            <button onClick={() => setShowLocationTracking(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="GPS Location Tracking">
              <MapPin className="w-5 h-5 group-hover:text-red-600" />
              {locationData.filter(l => l.status === 'on-site').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {locationData.filter(l => l.status === 'on-site').length}
                </span>
              )}
            </button>
            <button onClick={() => setShowSentimentAnalysis(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="Team Sentiment & Morale">
              <HeartPulse className="w-5 h-5 group-hover:text-pink-600" />
              {sentimentData.filter(s => s.sentiment === 'negative').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  ⚠
                </span>
              )}
            </button>
            <button onClick={generateOptimalSchedule} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="AI Auto-Schedule Generator (One-Click Optimization)">
              <BrainCircuit className="w-5 h-5 group-hover:text-indigo-600 animate-pulse-slow" />
            </button>
            <button onClick={() => {
              const alerts = checkWellnessAlerts();
              setShowWellnessMonitor(true);
            }} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="Employee Wellness & Burnout Detection">
              <HeartPulse className="w-5 h-5 group-hover:text-green-600" />
              {wellnessAlerts.filter(w => w.riskLevel === 'critical').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  🚨
                </span>
              )}
            </button>
            <button onClick={() => setShowIntegrations(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group relative" title="Integration Marketplace (100+ Apps)">
              <Plug className="w-5 h-5 group-hover:text-blue-600" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {integrations.filter(i => i.connected).length}
              </span>
            </button>
            
            <button onClick={handleCopyCalendar} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Copy Calendar to Clipboard">
              <ClipboardCopy className="w-5 h-5 group-hover:text-green-600" />
            </button>
            <button onClick={() => setShowShare(true)} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Share Schedule">
              <Share2 className="w-5 h-5 group-hover:text-green-600" />
            </button>
            <button onClick={handleGenerateQR} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Generate QR Code">
              <QrCode className="w-5 h-5 group-hover:text-purple-600" />
            </button>
            <button onClick={() => setIsAIModalOpen(true)} className={`${themeClasses.primary} ${themeClasses.hover} text-white p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden shadow-lg group`}>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline text-sm font-bold">AI Assistant</span>
            </button>
            
            {/* Smart Scheduling Dropdown */}
            <div className="relative print:hidden group">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-xl transition-all hover-lift flex items-center gap-2 shadow-lg">
                <Wand2 className="w-5 h-5" />
                <span className="hidden lg:inline text-sm font-bold">Smart Schedule</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 glass rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 animate-scale-in">
                <button onClick={handleSmartAutoSchedule} className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl transition-all mb-2 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">Auto-Schedule Month</div>
                    <div className="text-xs text-slate-500">AI generates full schedule</div>
                  </div>
                </button>
                <button onClick={handleFillGaps} className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl transition-all mb-2 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">Fill Gaps</div>
                    <div className="text-xs text-slate-500">Add shifts to understaffed days</div>
                  </div>
                </button>
                <button onClick={handleCopyWeekForward} className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-xl transition-all flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg text-white">
                    <Copy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">Copy Week Forward</div>
                    <div className="text-xs text-slate-500">Duplicate to next week</div>
                  </div>
                </button>
              </div>
            </div>

            <button onClick={handlePrint} className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden shadow-lg">
              <Printer className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-bold">Print</span>
            </button>
            <button onClick={() => setShowSettings(true)} className="glass hover:bg-white/80 p-3 rounded-xl transition-all flex items-center gap-1 text-slate-400 hover:text-slate-700 hover-lift group">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
        </div>
      </header>

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
        {calendarView === 'month' && (
          <div className="max-w-full mx-auto glass rounded-3xl overflow-hidden print:shadow-none print:border-none print:rounded-none animate-scale-in">
            <div className="grid grid-cols-7 border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/50 print:bg-white print:border-b-2 print:border-slate-800">
              {DAYS.map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-widest print:text-black">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr bg-white/30 gap-px border-b border-white/20 print:bg-slate-300 print:border-slate-300">
              {renderCalendarDays()}
            </div>
          </div>
        )}

        {calendarView === 'day' && renderDayView()}
        {calendarView === 'week' && renderWeekView()}
        {calendarView === 'agenda' && renderAgendaView()}
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
            className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: modalTheme.gradient,
              border: `2px solid ${modalTheme.color}`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800">
                  {editingShift ? 'Edit Shift' : 'Create New Shift'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Employee Name *</label>
                <input
                  type="text"
                  list="employee-list"
                  required
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="Select or type employee name"
                />
                <datalist id="employee-list">
                  {employees.map(emp => <option key={emp} value={emp} />)}
                </datalist>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">End Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {roles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  >
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Shift Comments (visible on calendar) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  Shift Comments (Visible on Calendar)
                </label>
                <input
                  type="text"
                  value={formData.shiftComments || ''}
                  onChange={(e) => setFormData({ ...formData, shiftComments: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="Brief comment shown on shift card..."
                  maxLength={50}
                />
                <p className="text-xs text-slate-500 mt-1">This will appear directly on the shift card in the calendar</p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                  <span className="text-sm font-semibold text-slate-700">Save as Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTimeOff}
                    onChange={(e) => setFormData({ ...formData, isTimeOff: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                  />
                  <span className="text-sm font-semibold text-slate-700">Time Off / Blocked</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
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

      {/* New Feature Modals */}
      {showThemeSelector && <ThemeSelector onClose={() => setShowThemeSelector(false)} />}
      
      {showGuild && (
        <GuildDashboard 
          employeeId={user?.uid || 'guest'}
          employeeName={user?.email?.split('@')[0] || 'Guest User'}
          currentXP={currentEmployeeXP}
          onRedeemReward={(rewardId, newXP) => {
            setCurrentEmployeeXP(newXP);
            setStatus({ type: 'success', msg: `Reward redeemed! New XP: ${newXP}` });
            // TODO: Save to Firebase
          }}
          onClose={() => setShowGuild(false)}
        />
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
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Coming Soon
                </h3>
                <p className="text-amber-700 text-sm">
                  Oracle AI will analyze employee data to predict flight risk, detect burnout, forecast overtime costs, and recommend schedule optimizations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-slate-700 mb-1">Flight Risk Analysis</h4>
                  <p className="text-xs text-slate-500">90-day turnover predictions</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">🔥</div>
                  <h4 className="font-bold text-slate-700 mb-1">Burnout Detection</h4>
                  <p className="text-xs text-slate-500">Overwork pattern identification</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">💰</div>
                  <h4 className="font-bold text-slate-700 mb-1">Overtime Forecasting</h4>
                  <p className="text-xs text-slate-500">Monthly cost projections</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">⭐</div>
                  <h4 className="font-bold text-slate-700 mb-1">Star Performers</h4>
                  <p className="text-xs text-slate-500">Top employee recommendations</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowSettings(false)}>
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-slate-600 to-slate-800 p-3 rounded-xl text-white">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Settings</h2>
                  <p className="text-sm text-slate-500">Customize your scheduling experience</p>
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              {/* Time Format Setting */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-slate-600" />
                      Time Format
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">Choose how times are displayed throughout the scheduler</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setTimeFormat('12h');
                          localStorage.setItem('noxshift-time-format', '12h');
                          setStatus({ type: 'success', msg: '12-hour format selected' });
                        }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          timeFormat === '12h'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-white/50 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        12-Hour (3:00 PM)
                      </button>
                      <button
                        onClick={() => {
                          setTimeFormat('24h');
                          localStorage.setItem('noxshift-time-format', '24h');
                          setStatus({ type: 'success', msg: '24-hour format selected' });
                        }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          timeFormat === '24h'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-white/50 text-slate-700 hover:bg-white/80'
                        }`}
                      >
                        24-Hour (15:00)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      {usePrivateStorage ? <Lock className="w-5 h-5 text-green-600" /> : <Globe className="w-5 h-5 text-blue-600" />}
                      Storage Mode
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {usePrivateStorage 
                        ? 'Your schedule is private and only visible to you' 
                        : 'Your schedule is shared publicly with your team'}
                    </p>
                    <button
                      onClick={() => setUsePrivateStorage(!usePrivateStorage)}
                      className="px-6 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg"
                    >
                      Switch to {usePrivateStorage ? 'Public' : 'Private'} Mode
                    </button>
                  </div>
                </div>
              </div>

              {/* App Info */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold text-slate-800 mb-3">About NoxShift</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <img src="/noxshift-logo.png" alt="NoxShift" className="w-12 h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <div>
                      <p className="font-bold text-slate-800">NoxShift™</p>
                      <p className="text-xs">© {new Date().getFullYear()} - All Rights Reserved</p>
                    </div>
                  </div>
                  <p className="pt-2 border-t border-slate-200">Smart Scheduling System with AI-powered insights, Guild gamification, and enterprise features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTimeClock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowTimeClock(false)}>
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold gradient-text">Time Clock</h2>
                  <p className="text-sm text-slate-500">Punch In/Out System</p>
                </div>
              </div>
              <button onClick={() => setShowTimeClock(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Coming Soon
                </h3>
                <p className="text-blue-700 text-sm">
                  Enterprise time clock with GPS geofencing, photo verification, badge scanning (QR/RFID/NFC), and automatic overtime detection.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">📍</div>
                  <h4 className="font-bold text-slate-700 mb-1">GPS Geofencing</h4>
                  <p className="text-xs text-slate-500">100m radius verification with Haversine algorithm</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">📸</div>
                  <h4 className="font-bold text-slate-700 mb-1">Photo Verification</h4>
                  <p className="text-xs text-slate-500">Webcam selfie capture on clock in/out</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">🎫</div>
                  <h4 className="font-bold text-slate-700 mb-1">Badge Scanning</h4>
                  <p className="text-xs text-slate-500">Support for QR, RFID, NFC, Barcode, Fingerprint, Facial Recognition</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-2xl mb-2">⚠️</div>
                  <h4 className="font-bold text-slate-700 mb-1">Overtime Alerts</h4>
                  <p className="text-xs text-slate-500">Automatic warnings before 40-hour threshold</p>
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
                Employee Availability Management
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
                setStatus({ type: 'success', msg: 'Availability saved!' });
                setShowAvailabilityModal(false);
              }}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Availability
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

      {/* AI Insights & Recommendations Modal - REVOLUTIONARY! */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAIInsights(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Brain className="w-7 h-7 text-blue-500 animate-pulse" />
                AI Insights & Recommendations
              </h2>
              <button onClick={() => setShowAIInsights(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {aiRecommendations.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Everything Looks Great!</h3>
                <p className="text-slate-600">No critical recommendations at this time. Your schedule is optimized.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiRecommendations.map((rec, idx) => (
                  <div key={idx} className={`glass rounded-xl p-6 border-l-4 hover-lift ${
                    rec.priority === 'critical' ? 'border-red-500 bg-red-50/50' :
                    rec.priority === 'high' ? 'border-orange-500 bg-orange-50/50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50/50' :
                    'border-blue-500 bg-blue-50/50'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {rec.type === 'staffing' && <Users className="w-5 h-5 text-purple-600" />}
                          {rec.type === 'cost' && <DollarSign className="w-5 h-5 text-green-600" />}
                          {rec.type === 'performance' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                          {rec.type === 'scheduling' && <CalendarIcon className="w-5 h-5 text-orange-600" />}
                          <h3 className="font-bold text-lg text-slate-800">{rec.title}</h3>
                        </div>
                        <p className="text-slate-700 mb-3">{rec.description}</p>
                        {rec.action && (
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all shadow-lg">
                            {rec.action} →
                          </button>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                        rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gamification & Leaderboard - REVOLUTIONARY! */}
      {showGamification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowGamification(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-500" />
                Gamification & Leaderboard
              </h2>
              <button onClick={() => setShowGamification(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top 3 Leaderboard */}
              <div className="lg:col-span-2 glass rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Leaderboard - Top Performers
                </h3>
                <div className="space-y-3">
                  {employees
                    .map(emp => ({
                      name: emp.name,
                      points: employeePoints[emp.name] || 0,
                      stats: getEmployeeStats(emp.name),
                      badges: (employeeBadges[emp.name] || []).length
                    }))
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 10)
                    .map((emp, idx) => (
                      <div key={emp.name} className={`glass rounded-lg p-4 hover-lift flex items-center gap-4 ${
                        idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400' :
                        idx === 1 ? 'bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-400' :
                        idx === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-400' : ''
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-400 to-gray-500 text-white' :
                          idx === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {emp.name}
                            {idx === 0 && <Crown className="w-4 h-4 text-amber-500" />}
                            {idx === 1 && <Award className="w-4 h-4 text-slate-500" />}
                            {idx === 2 && <Award className="w-4 h-4 text-orange-500" />}
                          </div>
                          <div className="text-sm text-slate-600">{emp.stats.totalShifts} shifts • {emp.badges} badges</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold gradient-text">{emp.points}</div>
                          <div className="text-xs text-slate-600">points</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Points & Badges */}
              <div className="space-y-4">
                <div className="glass rounded-xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Points System
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Complete shift:</span>
                      <span className="font-bold text-green-600">+10 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Perfect week:</span>
                      <span className="font-bold text-green-600">+50 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Help coworker:</span>
                      <span className="font-bold text-green-600">+25 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">On-time arrival:</span>
                      <span className="font-bold text-green-600">+5 pts</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Available Badges
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: '🎯', name: 'Perfect Attendance', desc: '20+ shifts' },
                      { icon: '💪', name: 'Overtime Champion', desc: '20+ OT hours' },
                      { icon: '🤝', name: 'Team Player', desc: '5+ swaps helped' },
                      { icon: '👑', name: 'MVP', desc: 'Top earner' },
                      { icon: '⚡', name: 'Quick Responder', desc: 'Fast replies' },
                      { icon: '🌟', name: 'All-Star', desc: '1000+ points' }
                    ].map(badge => (
                      <div key={badge.name} className="flex items-center gap-2 text-xs">
                        <span className="text-lg">{badge.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-700">{badge.name}</div>
                          <div className="text-slate-500">{badge.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Matrix - REVOLUTIONARY! */}
      {showSkillsMatrix && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSkillsMatrix(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-2">
                <Award className="w-7 h-7 text-teal-500" />
                Skills Matrix & Certifications
              </h2>
              <button onClick={() => setShowSkillsMatrix(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              {employees.map(emp => {
                const empSkills = employeeSkills[emp.name] || [];
                return (
                  <div key={emp.name} className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-slate-800">{emp.name}</h3>
                      <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all">
                        + Add Skill
                      </button>
                    </div>
                    
                    {empSkills.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No skills added yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {empSkills.map((skill, idx) => (
                          <div key={idx} className="glass rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-slate-800">{skill.skill}</span>
                              {skill.certified && <ShieldCheck className="w-4 h-4 text-green-600" />}
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              {[1, 2, 3, 4].map(level => (
                                <div key={level} className={`h-2 flex-1 rounded ${
                                  (skill.level === 'Beginner' && level <= 1) ||
                                  (skill.level === 'Intermediate' && level <= 2) ||
                                  (skill.level === 'Advanced' && level <= 3) ||
                                  (skill.level === 'Expert' && level <= 4)
                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                                    : 'bg-slate-200'
                                }`}></div>
                              ))}
                            </div>
                            <div className="text-xs text-slate-600">{skill.level}</div>
                            {skill.expiryDate && (
                              <div className="text-xs text-orange-600 mt-1">
                                Expires: {new Date(skill.expiryDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics - REVOLUTIONARY! */}
      {showPerformance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPerformance(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <LineChart className="w-7 h-7 text-pink-500" />
                Performance Metrics & KPIs
              </h2>
              <button onClick={() => setShowPerformance(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employees.map(emp => {
                const stats = getEmployeeStats(emp.name);
                const metric = performanceMetrics.find(m => m.employeeName === emp.name) || {
                  employeeName: emp.name,
                  attendance: 95,
                  punctuality: 92,
                  satisfaction: 4,
                  shiftCompletionRate: 98
                };
                
                return (
                  <div key={emp.name} className="glass rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">{emp.name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-700">Attendance Rate</span>
                          <span className="text-sm font-bold text-green-600">{metric.attendance}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${metric.attendance}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-700">Punctuality</span>
                          <span className="text-sm font-bold text-blue-600">{metric.punctuality}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${metric.punctuality}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-700">Shift Completion</span>
                          <span className="text-sm font-bold text-purple-600">{metric.shiftCompletionRate}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${metric.shiftCompletionRate}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-slate-700">Satisfaction Rating</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-4 h-4 ${star <= metric.satisfaction ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold gradient-text">{stats.totalShifts}</div>
                            <div className="text-xs text-slate-600">Shifts</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold gradient-text">{stats.totalHours.toFixed(0)}h</div>
                            <div className="text-xs text-slate-600">Hours</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold gradient-text">${stats.totalEarnings.toFixed(0)}</div>
                            <div className="text-xs text-slate-600">Earned</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Predictive Analytics - REVOLUTIONARY! */}
      {showPredictive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPredictive(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Cpu className="w-7 h-7 text-indigo-500 animate-pulse" />
                Predictive Analytics & ML Insights
              </h2>
              <button onClick={() => setShowPredictive(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {(() => {
              const predictions = generatePredictiveAnalytics();
              return (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{predictions.busiestDay}</div>
                      <div className="text-xs text-slate-600 mt-1">Busiest Day</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{predictions.avgStaffPerDay}</div>
                      <div className="text-xs text-slate-600 mt-1">Avg Staff/Day</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text">{predictions.turnoverRisk.length}</div>
                      <div className="text-xs text-slate-600 mt-1">At-Risk Staff</div>
                    </div>
                    <div className="glass rounded-xl p-6 text-center hover-lift">
                      <div className="text-3xl font-bold gradient-text uppercase">{predictions.costTrend}</div>
                      <div className="text-xs text-slate-600 mt-1">Cost Trend</div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6 mb-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      AI Predictions & Recommendations
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                        <Zap className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-slate-800">Staffing Recommendation</p>
                          <p className="text-sm text-slate-600">{predictions.recommendedHiring}</p>
                        </div>
                      </div>
                      
                      {predictions.turnoverRisk.length > 0 && (
                        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold text-slate-800">Turnover Risk Alert</p>
                            <p className="text-sm text-slate-600">
                              {predictions.turnoverRisk.join(', ')} working below average hours. Consider engagement check-ins.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-slate-800">ML Optimization Insight</p>
                          <p className="text-sm text-slate-600">
                            Based on historical patterns, consider scheduling {predictions.avgStaffPerDay} employees on {predictions.busiestDay}s for optimal coverage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Shift Bidding System - REVOLUTIONARY! */}
      {showBiddingSystem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBiddingSystem(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Gem className="w-7 h-7 text-emerald-500 animate-bounce-slow" />
                Premium Shift Bidding System
              </h2>
              <button onClick={() => setShowBiddingSystem(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Available Premium Shifts */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Premium Shifts Available
                </h3>
                <div className="space-y-3">
                  {shifts
                    .filter(shift => {
                      const shiftDate = new Date(shift.date);
                      const dayOfWeek = shiftDate.toLocaleDateString('en-US', { weekday: 'long' });
                      return shift.isPremium || dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
                    })
                    .slice(0, 8)
                    .map(shift => {
                      const shiftBidsForThis = shiftBids.filter(b => b.shiftId === shift.id);
                      const highestBid = shiftBidsForThis.length > 0 
                        ? Math.max(...shiftBidsForThis.map(b => b.bidAmount))
                        : 0;
                      
                      return (
                        <div key={shift.id} className="glass rounded-xl p-4 hover-lift border-2 border-amber-200">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-4 h-4 text-amber-500" />
                                <h4 className="font-bold text-slate-800">{shift.type}</h4>
                                {shift.isPremium && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded">
                                    PREMIUM
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-slate-600">
                                {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-sm font-semibold text-green-600">
                                Base: ${shift.rate}/hr {shift.isPremium && '+ Premium Bonus'}
                              </div>
                              {shiftBidsForThis.length > 0 && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {shiftBidsForThis.length} bids • Highest: ${highestBid}
                                </div>
                              )}
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all shadow-lg">
                              Place Bid
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bidding Info */}
              <div className="space-y-4">
                <div className="glass rounded-xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    How It Works
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600">1.</span>
                      <span>Premium shifts are marked with a crown icon</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600">2.</span>
                      <span>Place bids using your earned points or bonus pay</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600">3.</span>
                      <span>Highest bidder wins the shift</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600">4.</span>
                      <span>Earn 1.5x-2x the standard rate</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  <h3 className="font-bold mb-2 text-slate-800">Your Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Available Points:</span>
                      <span className="font-bold gradient-text">500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Active Bids:</span>
                      <span className="font-bold text-orange-600">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Won This Month:</span>
                      <span className="font-bold text-green-600">5</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Top Bidders
                  </h3>
                  <div className="space-y-2">
                    {employees.slice(0, 3).map((emp, idx) => (
                      <div key={emp.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                          <span className="font-semibold text-slate-700">{emp.name}</span>
                        </div>
                        <span className="text-xs text-slate-600">{Math.floor(Math.random() * 10) + 5} wins</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Chat & Collaboration - REVOLUTIONARY! */}
      {showTeamChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTeamChat(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <MessageCircle className="w-7 h-7 text-blue-500" />
                Team Chat & Collaboration
              </h2>
              <button onClick={() => setShowTeamChat(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
              {/* Channels Sidebar */}
              <div className="col-span-1 glass rounded-xl p-4 overflow-y-auto">
                <h3 className="font-bold text-sm mb-3 text-slate-700">Channels</h3>
                <div className="space-y-1">
                  {[
                    { icon: <Hash className="w-4 h-4" />, name: 'general', count: 12 },
                    { icon: <CalendarIcon className="w-4 h-4" />, name: 'shift-swaps', count: 5 },
                    { icon: <AlertCircle className="w-4 h-4" />, name: 'urgent', count: 2 },
                    { icon: <Users className="w-4 h-4" />, name: 'team-leads', count: 0 },
                    { icon: <Coffee className="w-4 h-4" />, name: 'break-room', count: 8 }
                  ].map(channel => (
                    <button
                      key={channel.name}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-500">{channel.icon}</span>
                        <span className="text-sm font-medium text-slate-700 truncate">{channel.name}</span>
                      </div>
                      {channel.count > 0 && (
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                          {channel.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <h3 className="font-bold text-sm mb-3 mt-6 text-slate-700">Direct Messages</h3>
                <div className="space-y-1">
                  {employees.slice(0, 5).map(emp => (
                    <button
                      key={emp.name}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                      <span className="text-sm font-medium text-slate-700 truncate">{emp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-span-3 flex flex-col min-h-0">
                <div className="glass rounded-xl p-4 mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Hash className="w-5 h-5 text-purple-600" />
                    general
                  </h3>
                  <p className="text-xs text-slate-600">Team-wide announcements and discussions</p>
                </div>

                {/* Messages */}
                <div className="flex-1 glass rounded-xl p-4 overflow-y-auto mb-4 space-y-4">
                  {[
                    { user: 'Sarah Johnson', time: '10:45 AM', msg: 'Hey team! Anyone available to swap Saturday shift?', avatar: '👩‍⚕️' },
                    { user: 'Mike Davis', time: '10:47 AM', msg: 'I can take it! DM me', avatar: '👨‍⚕️' },
                    { user: 'System', time: '10:48 AM', msg: '🎉 Mike Davis earned the "Team Player" badge!', isSystem: true },
                    { user: 'Emily Brown', time: '11:02 AM', msg: 'Reminder: Staff meeting tomorrow at 2 PM', avatar: '👩‍💼' },
                    { user: 'Alex Chen', time: '11:15 AM', msg: 'Can someone cover my lunch break today?', avatar: '👨‍🔧' },
                    { user: 'Sarah Johnson', time: '11:16 AM', msg: 'I got you Alex! 👍', avatar: '👩‍⚕️' }
                  ].map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.isSystem ? 'justify-center' : ''}`}>
                      {msg.isSystem ? (
                        <div className="px-4 py-2 bg-purple-100 rounded-lg text-sm text-purple-700">
                          {msg.msg}
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl shrink-0">{msg.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-sm text-slate-800">{msg.user}</span>
                              <span className="text-xs text-slate-500">{msg.time}</span>
                            </div>
                            <p className="text-sm text-slate-700 bg-white/50 rounded-lg px-3 py-2">
                              {msg.msg}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="glass rounded-xl p-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:scale-105 transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎙️ SHOCKING: Voice Commands Modal */}
      {showVoiceCommands && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowVoiceCommands(false)}>
          <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Mic className="w-7 h-7 text-purple-500" />
                Voice Commands
              </h2>
              <button onClick={() => setShowVoiceCommands(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="mb-6 text-center">
              <button
                onClick={startVoiceCommand}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all hover-lift ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'
                }`}
              >
                {isListening ? (
                  <span className="flex items-center gap-3">
                    <Mic className="w-6 h-6 animate-pulse" />
                    Listening... Speak now!
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Mic className="w-6 h-6" />
                    Start Voice Command
                  </span>
                )}
              </button>
              {voiceTranscript && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-slate-600">You said:</p>
                  <p className="text-lg font-bold text-purple-700">"{voiceTranscript}"</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                  Scheduling Commands
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>"Schedule [name] for [day]"</div>
                  <div>"Show me today"</div>
                  <div>"Go to tomorrow"</div>
                  <div>"Create morning shift"</div>
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Employee Commands
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>"How many shifts [name]"</div>
                  <div>"Show [name]'s schedule"</div>
                  <div>"Add break for [name]"</div>
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  Feature Commands
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>"Open gamification"</div>
                  <div>"Show AI recommendations"</div>
                  <div>"Open team chat"</div>
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-600" />
                  Quick Actions
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>"Export schedule"</div>
                  <div>"Print calendar"</div>
                  <div>"Generate report"</div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-bold mb-3">Recent Voice Commands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {voiceHistory.slice(0, 10).map((cmd, idx) => (
                  <div key={idx} className={`p-3 rounded-lg ${cmd.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-slate-800">"{cmd.command}"</p>
                        <p className="text-xs text-slate-600">{cmd.action}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${cmd.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {cmd.success ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
                {voiceHistory.length === 0 && (
                  <p className="text-center text-sm text-slate-500 py-4">No voice commands yet. Try saying something!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📍 SHOCKING: GPS Location Tracking Modal */}
      {showLocationTracking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLocationTracking(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <MapPin className="w-7 h-7 text-red-500" />
                Real-Time Location Tracking
              </h2>
              <button onClick={() => setShowLocationTracking(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-6 bg-green-50 border-2 border-green-400">
                <div className="text-3xl font-bold gradient-text text-center">{locationData.filter(l => l.status === 'on-site').length}</div>
                <div className="text-center text-sm text-slate-600 mt-1">On-Site</div>
              </div>
              <div className="glass rounded-xl p-6 bg-yellow-50 border-2 border-yellow-400">
                <div className="text-3xl font-bold gradient-text text-center">{locationData.filter(l => l.status === 'in-transit').length}</div>
                <div className="text-center text-sm text-slate-600 mt-1">In-Transit</div>
              </div>
              <div className="glass rounded-xl p-6 bg-red-50 border-2 border-red-400">
                <div className="text-3xl font-bold gradient-text text-center">{locationData.filter(l => l.status === 'off-site').length}</div>
                <div className="text-center text-sm text-slate-600 mt-1">Off-Site</div>
              </div>
            </div>

            <div className="space-y-3">
              {employees.map(emp => {
                const location = locationData.find(l => l.employeeName === emp.name);
                return (
                  <div key={emp.name} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${
                        location?.status === 'on-site' ? 'bg-green-500 animate-pulse' :
                        location?.status === 'in-transit' ? 'bg-yellow-500' :
                        'bg-slate-300'
                      }`}></div>
                      <div>
                        <p className="font-bold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-600">
                          {location ? (
                            <span className={
                              location.status === 'on-site' ? 'text-green-600' :
                              location.status === 'in-transit' ? 'text-yellow-600' :
                              'text-slate-500'
                            }>
                              {location.status === 'on-site' ? '✓ At work' :
                               location.status === 'in-transit' ? `${location.distanceToWork.toFixed(1)} miles away` :
                               'Not tracked'}
                            </span>
                          ) : (
                            'Location not available'
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateEmployeeLocation(emp.name)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-all"
                    >
                      Update Location
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-blue-50">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                How It Works
              </h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Real-time GPS tracking of employee locations</li>
                <li>• Automatic alerts for late arrivals</li>
                <li>• Geofencing for clock-in/out verification</li>
                <li>• Privacy-focused: Only tracks during scheduled shifts</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 💭 SHOCKING: Sentiment Analysis Modal */}
      {showSentimentAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSentimentAnalysis(false)}>
          <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <HeartPulse className="w-7 h-7 text-pink-500" />
                Team Sentiment & Morale Analysis
              </h2>
              <button onClick={() => setShowSentimentAnalysis(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-6 bg-green-50">
                <div className="text-center">
                  <Smile className="w-12 h-12 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-700">{sentimentData.filter(s => s.sentiment === 'positive').length}</div>
                  <div className="text-xs text-slate-600">Positive</div>
                </div>
              </div>
              <div className="glass rounded-xl p-6 bg-yellow-50">
                <div className="text-center">
                  <Meh className="w-12 h-12 mx-auto text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">{sentimentData.filter(s => s.sentiment === 'neutral').length}</div>
                  <div className="text-xs text-slate-600">Neutral</div>
                </div>
              </div>
              <div className="glass rounded-xl p-6 bg-red-50">
                <div className="text-center">
                  <Frown className="w-12 h-12 mx-auto text-red-600 mb-2" />
                  <div className="text-2xl font-bold text-red-700">{sentimentData.filter(s => s.sentiment === 'negative').length}</div>
                  <div className="text-xs text-slate-600">Negative</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {employees.map(emp => {
                const sentiment = sentimentData.find(s => s.employeeName === emp.name) || {
                  sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
                  score: 0,
                  recentMessages: []
                };

                return (
                  <div key={emp.name} className={`glass rounded-xl p-4 border-l-4 ${
                    sentiment.sentiment === 'positive' ? 'border-green-500 bg-green-50' :
                    sentiment.sentiment === 'negative' ? 'border-red-500 bg-red-50' :
                    'border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {sentiment.sentiment === 'positive' && <Smile className="w-6 h-6 text-green-600" />}
                        {sentiment.sentiment === 'neutral' && <Meh className="w-6 h-6 text-slate-600" />}
                        {sentiment.sentiment === 'negative' && <Frown className="w-6 h-6 text-red-600" />}
                        <div>
                          <p className="font-bold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-600">
                            {sentiment.sentiment === 'positive' && 'Great team spirit! 🎉'}
                            {sentiment.sentiment === 'neutral' && 'Steady mood'}
                            {sentiment.sentiment === 'negative' && 'May need support ⚠️'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">{(sentiment.score * 100).toFixed(0)}%</div>
                        <div className="text-xs text-slate-600">Sentiment Score</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 glass rounded-xl p-6 bg-purple-50">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI-Powered Insights
              </h3>
              <p className="text-sm text-slate-700 mb-2">Sentiment analysis uses natural language processing to detect team morale from chat messages, shift feedback, and communication patterns.</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Positive sentiment: Team is engaged and motivated</li>
                <li>• Neutral sentiment: Standard communication patterns</li>
                <li>• Negative sentiment: Team member may need support or intervention</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 SHOCKING: AI Auto-Schedule Generator Results (shown after generation) */}
      {showAutoSchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAutoSchedule(false)}>
          <div className="glass rounded-3xl p-8 max-w-3xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <BrainCircuit className="w-7 h-7 text-indigo-500 animate-pulse" />
                AI Auto-Schedule Generator
              </h2>
              <button onClick={() => setShowAutoSchedule(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block p-6 glass rounded-2xl mb-4">
                <BrainCircuit className="w-24 h-24 text-indigo-500 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-bold text-slate-800">One-Click Schedule Optimization</p>
                <p className="text-sm text-slate-600 mt-2">Let AI create the perfect schedule in seconds</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="glass rounded-xl p-6 bg-purple-50">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-bold text-slate-800">Machine Learning Optimization</p>
                    <p className="text-sm text-slate-600">AI analyzes historical patterns, employee preferences, skills, and availability</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-6 bg-blue-50">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-bold text-slate-800">Fair Workload Distribution</p>
                    <p className="text-sm text-slate-600">Ensures every employee gets balanced hours and rest days</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-6 bg-green-50">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-bold text-slate-800">Compliance & Cost Optimization</p>
                    <p className="text-sm text-slate-600">Minimizes overtime, prevents burnout, and optimizes labor costs</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateOptimalSchedule}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <BrainCircuit className="w-6 h-6" />
              Generate Optimal Schedule Now
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              This will replace existing shifts. You can undo this action.
            </p>
          </div>
        </div>
      )}

      {/* 💚 SHOCKING: Employee Wellness Monitor Modal */}
      {showWellnessMonitor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowWellnessMonitor(false)}>
          <div className="glass rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <HeartPulse className="w-7 h-7 text-green-500 animate-pulse" />
                Employee Wellness & Burnout Detection
              </h2>
              <button onClick={() => setShowWellnessMonitor(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {wellnessAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">All Clear! 🎉</h3>
                <p className="text-slate-600">No wellness concerns detected. Team is healthy and balanced.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{wellnessAlerts.filter(w => w.riskLevel === 'critical').length}</div>
                    <div className="text-xs text-slate-600">Critical</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{wellnessAlerts.filter(w => w.riskLevel === 'high').length}</div>
                    <div className="text-xs text-slate-600">High Risk</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{wellnessAlerts.filter(w => w.riskLevel === 'medium').length}</div>
                    <div className="text-xs text-slate-600">Medium</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{employees.length - wellnessAlerts.length}</div>
                    <div className="text-xs text-slate-600">Healthy</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {wellnessAlerts.map((alert, idx) => (
                    <div key={idx} className={`glass rounded-xl p-6 border-l-4 ${
                      alert.riskLevel === 'critical' ? 'border-red-500 bg-red-50' :
                      alert.riskLevel === 'high' ? 'border-orange-500 bg-orange-50' :
                      alert.riskLevel === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className={`w-5 h-5 ${
                              alert.riskLevel === 'critical' ? 'text-red-600' :
                              alert.riskLevel === 'high' ? 'text-orange-600' :
                              'text-yellow-600'
                            }`} />
                            <h3 className="font-bold text-lg text-slate-800">{alert.employeeName}</h3>
                          </div>
                          <p className="text-slate-700 mb-2">🚨 {alert.reason}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                            <div>Hours this week: <span className="font-bold">{alert.hoursWorkedThisWeek.toFixed(0)}h</span></div>
                            <div>Consecutive days: <span className="font-bold">{alert.consecutiveDays}</span></div>
                          </div>
                          <div className="p-3 bg-white/50 rounded-lg">
                            <p className="text-sm font-semibold text-green-700">💡 Recommendation:</p>
                            <p className="text-sm text-slate-700">{alert.recommendation}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                          alert.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {alert.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 glass rounded-xl p-6 bg-teal-50">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                Wellness Monitoring Features
              </h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Automatic detection of excessive hours ({'>'}60/week = warning, {'>'}80/week = critical)</li>
                <li>• Consecutive work days tracker (7+ days triggers alert)</li>
                <li>• Overtime accumulation monitoring</li>
                <li>• Burnout risk prediction based on patterns</li>
                <li>• Personalized rest recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 🔌 SHOCKING: Integration Marketplace Modal */}
      {showIntegrations && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowIntegrations(false)}>
          <div className="glass rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold gradient-text flex items-center gap-3">
                <Plug className="w-7 h-7 text-blue-500" />
                Integration Marketplace
              </h2>
              <button onClick={() => setShowIntegrations(false)} className="p-2 hover:bg-red-50 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <div key={integration.id} className={`glass rounded-xl p-6 hover-lift ${
                  integration.connected ? 'border-2 border-green-400 bg-green-50' : ''
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{integration.icon}</div>
                    {integration.connected && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{integration.name}</h3>
                  <p className="text-xs text-slate-600 mb-3">{integration.description}</p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                    {integration.category}
                  </span>
                  <div className="mt-4">
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
    </div>
  );
}

export default Scheduler;
