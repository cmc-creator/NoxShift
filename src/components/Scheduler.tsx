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
  ClipboardCopy
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
    isTimeOff: false
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="min-h-[180px] bg-white/30 backdrop-blur-sm border-r border-b border-white/20 print:bg-white print:min-h-[150px]"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateObj.toISOString().split('T')[0];
      
      const dayShifts = shifts.filter(s => {
          const matchesDate = s.date.startsWith(dateStr);
          const matchesDept = selectedDepartment === 'All' || s.department === selectedDepartment || (!s.department && selectedDepartment === 'General');
          return matchesDate && matchesDept;
      });

      dayShifts.sort((a, b) => a.startTime.localeCompare(b.startTime));
      const isToday = new Date().toDateString() === dateObj.toDateString();

      days.push(
        <div key={day} onClick={() => handleDayClick(day)} className={`min-h-[180px] border-r border-b border-white/20 p-3 transition-all duration-300 relative overflow-hidden group ${isToday ? 'bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm ring-2 ring-purple-400/50 print:bg-white' : 'bg-white/50 backdrop-blur-sm'} hover:bg-white/80 hover:shadow-xl hover:scale-[1.01] hover:z-10 print:hover:bg-white cursor-pointer print:cursor-default print:min-h-[150px] animate-fade-in`}>
          <div className="flex justify-between items-start mb-1.5">
              <span className={`text-sm font-extrabold w-7 h-7 flex items-center justify-center rounded-xl shadow-sm transition-all duration-300 ${isToday ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 print:bg-transparent print:text-black print:border print:border-black' : 'text-slate-700 group-hover:bg-slate-100'}`}>{day}</span>
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
                  className={`text-xs px-3 py-2 rounded-lg border shadow-md shift-card animate-slide-in print:border-slate-300 print:shadow-none cursor-move hover:cursor-grab active:cursor-grabbing ${isDraft ? 'opacity-90 border-dashed border-2 animate-pulse' : ''}`} 
                  style={{ animationDelay: `${index * 50}ms`, backgroundColor: theme.bg, borderColor: isDraft ? theme.bg : theme.border, color: theme.text }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {employeePhotos[shift.employeeName] ? (
                      <img 
                        src={employeePhotos[shift.employeeName]} 
                        alt={shift.employeeName}
                        className="w-6 h-6 rounded-full object-cover border border-white/50 shadow-sm shrink-0"
                      />
                    ) : (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-white/50 shadow-sm shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)' }}
                      >
                        {getEmployeeInitials(shift.employeeName)}
                      </div>
                    )}
                    <span className="font-bold text-sm">{formatTime(shift.startTime, timeFormat === '24h')}</span>
                    <Grip className="w-3 h-3 ml-auto opacity-50 shrink-0 print:hidden" />
                  </div>
                  <div className="font-semibold text-xs leading-tight">{shift.employeeName}</div>
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

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

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
            <button onClick={handleExportCSV} className="glass hover:bg-white/80 text-slate-700 p-3 rounded-xl transition-all hover-lift flex items-center gap-2 print:hidden group" title="Export CSV">
              <Download className="w-5 h-5 group-hover:text-blue-600" />
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
    </div>
  );
}
