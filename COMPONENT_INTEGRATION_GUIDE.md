# NoxShift Integration - Component Wiring Guide

## Components Created (5 Total)

### 1. OracleAIPanel.tsx ✅
- **Location**: `src/features/oracle/OracleAIPanel.tsx`
- **Props**: `shifts`, `employees`, `onClose`
- **State Needed**: `showOracleAI` (boolean)
- **Displays**: Fixed sidebar (top-right) with 4 AI insights
- **Features**: Understaffing, cost optimization, performance recognition, burnout detection

### 2. ConflictDetector.tsx ✅
- **Location**: `src/features/conflicts/ConflictDetector.tsx`
- **Props**: `shifts`, `onClose`
- **State Needed**: `showConflicts` (boolean)
- **Displays**: Fixed panel (bottom-left) showing conflicts
- **Features**: Double-booking, overtime, understaffing detection

### 3. CoverageHeatmap.tsx ✅
- **Location**: `src/features/coverage/CoverageHeatmap.tsx`
- **Props**: `shifts`, `targetStaffing`
- **State Needed**: None (always visible or in modal)
- **Displays**: 5-day coverage grid with color-coded percentages
- **Features**: Visual staffing overview with percentage calculations

### 4. ShiftMarketplace.tsx ✅
- **Location**: `src/features/marketplace/ShiftMarketplace.tsx`
- **Props**: `onClose`, `employees`, `onClaimShift`
- **State Needed**: `showMarketplace` (boolean) - **ALREADY EXISTS IN SCHEDULER**
- **Displays**: Modal with bonus shifts and leaderboard
- **Features**: Claim shifts, earn bonuses, XP rewards, urgency levels

### 5. PTODonations.tsx ✅
- **Location**: `src/features/pto/PTODonations.tsx`
- **Props**: `onClose`, `employees`, `onDonate`
- **State Needed**: `showPTODonations` (boolean)
- **Displays**: Modal with donation requests and Wall of Generosity
- **Features**: PTO hour donations, progress tracking, community impact stats

## Integration Steps

### Step 1: Add Import Statements (Top of Scheduler.tsx)
```tsx
// Add these after existing imports (around line 130)
import { OracleAIPanel } from '../features/oracle/OracleAIPanel';
import { ConflictDetector } from '../features/conflicts/ConflictDetector';
import { CoverageHeatmap } from '../features/coverage/CoverageHeatmap';
import { ShiftMarketplace } from '../features/marketplace/ShiftMarketplace';
import { PTODonations } from '../features/pto/PTODonations';
```

### Step 2: Add State Variables (Around line 400-700)
```tsx
// Add these new state variables
const [showOracleAI, setShowOracleAI] = useState(false);
const [showConflicts, setShowConflicts] = useState(false);
const [showPTODonations, setShowPTODonations] = useState(false);
// Note: showMarketplace already exists at line 416!
```

### Step 3: Add Toggle Buttons to Menu Dropdown

**Find the "AI & Analytics" section** (around line 3320) and add:
```tsx
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
      <span className="text-[9px] bg-red-600 text-white px-1.5 py-0-5 rounded-full font-bold">NEW</span>
    </div>
    <div className="text-xs text-slate-500">Real-time scheduling conflicts</div>
  </div>
</button>
```

**Find the "Schedule Tools" section** (around line 3380) and add:
```tsx
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
```

### Step 4: Add Components to JSX (Before closing div of component)

**Find the end of the component return** (around line 8300+) and add before the final closing tags:
```tsx
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
```

### Step 5: Optional - Add Coverage Heatmap to Dashboard

**Add to Advanced Analytics Modal** (around line 5200+) or create a new button:
```tsx
{/* Add button in menu */}
<button onClick={() => { /* Show heatmap in modal or dashboard */ }} className="...">
  <Activity className="w-5 h-5 text-blue-600" />
  <div className="flex-1">
    <div className="font-semibold text-sm">Coverage Heatmap</div>
    <div className="text-xs text-slate-500">Visual staffing overview</div>
  </div>
</button>

{/* Use component */}
<CoverageHeatmap shifts={shifts} targetStaffing={5} />
```

## Summary

- **5 components** created and ready
- **3 new state variables** needed (1 already exists)
- **5 menu buttons** to add
- **4-5 JSX blocks** to add at end of component
- **Top navigation preserved** 100% (no changes to header/toolbar)
- **Non-breaking** - All features are optional toggles

## Next Steps

1. Add imports
2. Add state variables  
3. Add menu buttons
4. Add component JSX blocks
5. Test each feature independently
6. Commit changes

All components integrate with existing `shifts` and `employees` arrays. Firebase sync continues to work automatically since we're just reading and displaying data, not modifying the persistence layer.
