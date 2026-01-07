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
  FileCheck
} from 'lucide-react';
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
}

interface ShiftPreset {
  label: string;
  start: string;
  end: string;
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
  
  // Customization State
  const [roles, setRoles] = useState(['Reception', 'Concierge', 'Manager']);
  const [employees, setEmployees] = useState<Employee[]>([
      { name: 'Izzy', rate: 18 }, 
      { name: 'Karen', rate: 18 }, 
      { name: 'Annalissia', rate: 18 }, 
      { name: 'Kenny', rate: 18 }
  ]);
  const [departments, setDepartments] = useState(['General']);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  
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
    if (!user || !selectedDate) return;
    
    const shiftData = { ...formData, date: selectedDate.toISOString(), timestamp: Date.now() };
    
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
      if (editingShift && editingShift.id) await updateDoc(doc(collectionRef, editingShift.id), shiftData);
      else await addDoc(collectionRef, shiftData);
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleDeleteShift = async () => {
    if (!user || !editingShift || !editingShift.id) return;
    try {
      let collectionRef = collection(db, `artifacts/${appId}/${usePrivateStorage ? 'users/' + user.uid : 'public/data'}/shifts`);
      await deleteDoc(doc(collectionRef, editingShift.id));
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleCopyShift = () => setClipboard({ ...formData });
  const handlePasteShift = () => { if (clipboard) setFormData({ ...clipboard }); };
  const handlePrint = () => { window.focus(); setTimeout(() => { window.print(); }, 200); };

  // AI Mock
  const handleAnalyzeSchedule = () => { alert("AI Analysis: Schedule looks balanced. No critical gaps found."); setIsAIModalOpen(false); };
  const handleDraftEmail = () => { alert("Draft copied to clipboard: 'Hi Team, here is the schedule...'"); setIsAIModalOpen(false); };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-50 border-r border-b border-slate-200 print:bg-white print:h-28"></div>);

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
        <div key={day} onClick={() => handleDayClick(day)} className={`h-24 md:h-32 border-r border-b border-slate-200 p-1 md:p-2 transition-colors relative overflow-hidden group ${isToday ? themeClasses.bgSoft + ' print:bg-white' : 'bg-white'} hover:bg-slate-50 print:hover:bg-white cursor-pointer print:cursor-default print:h-28`}>
          <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? themeClasses.primary + ' text-white print:bg-transparent print:text-black print:border print:border-black' : 'text-slate-700'}`}>{day}</span>
              <div className="flex gap-1 print:hidden">
                  {dayShifts.length > 0 && <button onClick={(e) => handleCopyDay(e, dayShifts)} className={`text-xs text-slate-400 ${themeClasses.text} opacity-0 group-hover:opacity-100 transition-opacity`} title="Copy Day"><Copy size={12} /></button>}
                  {dayClipboard && <button onClick={(e) => handlePasteDay(e, dateObj)} className="text-xs text-slate-400 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Paste Day"><Clipboard size={12} /></button>}
              </div>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)] no-scrollbar print:overflow-visible">
            {dayShifts.map(shift => {
              const theme = getThemeColors(shift.employeeName, shift.colorHue);
              const isDraft = shift.isDraft;
              const isTimeOff = shift.isTimeOff;

              if (isTimeOff) {
                  return (
                    <div key={shift.id} onClick={(e) => handleShiftClick(e, shift)} className="text-[10px] md:text-xs px-1.5 py-1 rounded border shadow-sm truncate flex items-center gap-1 hover:brightness-95 transition-all bg-slate-100 border-slate-300 text-slate-500 italic" style={{ backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%, #e2e8f0 100%)', backgroundSize: '10px 10px' }}>
                        <Ban size={10} /><span className="truncate">{shift.employeeName}: Off</span>
                    </div>
                  );
              }

              return (
                <div key={shift.id} onClick={(e) => handleShiftClick(e, shift)} className={`text-[10px] md:text-xs px-1.5 py-1 rounded border shadow-sm truncate flex items-center gap-1 hover:brightness-95 transition-all print:border-slate-300 print:shadow-none ${isDraft ? 'opacity-80 border-dashed border-2' : ''}`} style={{ backgroundColor: theme.bg, borderColor: isDraft ? theme.bg : theme.border, color: theme.text }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 print:hidden" /><span className="font-bold shrink-0">{shift.startTime}</span><span className="truncate font-medium">- {shift.employeeName}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) days.push(<div key={`empty-end-${i}`} className="h-24 md:h-32 bg-slate-50 border-r border-b border-slate-200 print:bg-white print:h-28"></div>);
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

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const modalTheme = getThemeColors(formData.employeeName || 'Preview', formData.colorHue);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${FONTS[appFont]} flex flex-col print:bg-white`}>
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10 shadow-sm gap-4 print:static print:shadow-none print:px-0 print:py-2">
        <div className="flex items-center gap-3">
          <img 
            src="/noxshift-logo.svg" 
            alt="NoxShift Logo" 
            className="w-10 h-10 print:w-12 print:h-12"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none print:text-2xl tracking-tight">NoxShift</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide print:text-slate-600">WORKFORCE MANAGEMENT</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg print:hidden mr-4">
                <Building className="w-4 h-4 ml-2 text-slate-400" />
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 outline-none p-1 cursor-pointer min-w-[120px]"
                >
                    <option value="All">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-xl shadow-inner print:bg-transparent print:shadow-none print:p-0"><button onClick={handlePrevMonth} className={`p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600 ${themeClasses.text} print:hidden`}><ChevronLeft className="w-5 h-5" /></button><span className="text-lg font-bold w-40 text-center tabular-nums print:text-left print:w-auto print:text-xl">{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</span><button onClick={handleNextMonth} className={`p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600 ${themeClasses.text} print:hidden`}><ChevronRight className="w-5 h-5" /></button></div>
        </div>

        <div className="flex items-center gap-4">
            {hasDrafts && (
                <button onClick={handlePublishAll} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm animate-pulse flex items-center gap-2 print:hidden">
                    <Send className="w-4 h-4" /> Publish
                </button>
            )}
            <button onClick={() => setShowStats(true)} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-2.5 rounded-lg transition-colors flex items-center gap-2 print:hidden" title="View Stats"><BarChart2 className="w-5 h-5" /></button>
            <button onClick={handleExportCSV} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-2.5 rounded-lg transition-colors flex items-center gap-2 print:hidden" title="Export CSV"><Download className="w-5 h-5" /></button>
            <button onClick={() => setIsAIModalOpen(true)} className={`${themeClasses.primary} ${themeClasses.hover} text-white p-2.5 rounded-lg transition-colors flex items-center gap-2 print:hidden shadow-sm`}><Sparkles className="w-5 h-5" /><span className="hidden lg:inline text-sm font-medium">AI</span></button>
            <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg transition-colors flex items-center gap-2 print:hidden"><Printer className="w-5 h-5" /><span className="hidden lg:inline text-sm font-medium">Print</span></button>
            <button onClick={() => setShowSettings(true)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600"><Settings className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 p-2 md:p-6 overflow-auto print:overflow-visible print:p-0 relative">
        {shifts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-100 max-w-md text-center pointer-events-auto animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100"><FileCheck className="w-8 h-8 text-green-600 ml-1" /></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Populate Finalized Schedule</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm">Click below to load the approved January 2026 roster for Izzy, Karen, Annalissia, and Kenny.</p>
                    <button onClick={applyFinalizedSchedule} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-200 hover:scale-[1.02]">Apply Finalized Jan 2026 Schedule</button>
                </div>
            </div>
        )}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 print:bg-white print:border-b-2 print:border-slate-800">{DAYS.map(day => <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider print:text-black print:font-bold">{day}</div>)}</div>
          <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px border-b border-slate-200 print:bg-slate-300 print:border-slate-300">{renderCalendarDays()}</div>
        </div>
      </main>

      <div className="bg-slate-50 border-t border-slate-200 py-1 px-4 flex items-center justify-between text-[10px] text-slate-400 print:hidden">
        <div className="flex items-center gap-2">{status.type === 'success' && <CheckCircle2 className="w-3 h-3 text-green-600" />}{status.type === 'error' && <AlertCircle className="w-3 h-3 text-red-600" />}<span>{status.msg}</span></div>
        <div className="relative flex items-center gap-2">
            <button onClick={() => setUsePrivateStorage(!usePrivateStorage)} className={`flex items-center gap-1 hover:text-slate-600 ${usePrivateStorage ? 'text-blue-600 font-bold' : ''}`} title="Switch Storage (Private/Public)">{usePrivateStorage ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}</button>
            <button onClick={() => setShowDebugMenu(!showDebugMenu)} className="flex items-center gap-1 hover:text-slate-600"><Settings className="w-3 h-3" /></button>
            {showDebugMenu && (<div className="absolute bottom-full right-0 mb-2 w-64 bg-white shadow-xl rounded-lg border border-slate-200 p-3 z-50"><h4 className="font-bold text-slate-800 mb-2">Tools</h4><button onClick={applyFinalizedSchedule} className="w-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 p-2 rounded flex items-center justify-center gap-2 font-semibold"><Settings className="w-3 h-3" /> Re-Apply Finalized Schedule</button><button onClick={() => setShowSettings(true)} className="w-full bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 p-2 rounded flex items-center justify-center gap-2 font-semibold mt-2"><Settings className="w-3 h-3" /> Customize Settings</button></div>)}
        </div>
      </div>

      {/* Modals - Stats, AI, Settings, Shift Form */}
      {/* Due to length, I'll continue in the next part */}
    </div>
  );
}
