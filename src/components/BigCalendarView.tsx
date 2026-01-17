import React from 'react';
import { Calendar, dateFnsLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

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
}

interface BigCalendarEvent extends CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  employeeName: string;
  role: string;
  department?: string;
  notes?: string;
  color?: string;
}

interface BigCalendarViewProps {
  shifts: Shift[];
  onEventClick?: (shift: Shift) => void;
  onEventDrop?: (shift: Shift, start: Date, end: Date) => void;
  onSelectSlot?: (start: Date, end: Date) => void;
}

const getThemeColors = (name: string, customHue?: number | null) => {
  let h;
  if (customHue !== undefined && customHue !== null) {
    h = customHue;
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

export default function BigCalendarView({ 
  shifts, 
  onEventClick, 
  onEventDrop,
  onSelectSlot 
}: BigCalendarViewProps) {
  // Convert shifts to calendar events
  const events: BigCalendarEvent[] = shifts.map((shift) => {
    const [year, month, day] = shift.date.split('-').map(Number);
    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    
    const start = new Date(year, month - 1, day, startHour, startMinute);
    const end = new Date(year, month - 1, day, endHour, endMinute);
    
    const colors = getThemeColors(shift.employeeName, shift.colorHue);
    
    return {
      id: shift.id,
      title: `${shift.employeeName} - ${shift.role}`,
      start,
      end,
      employeeName: shift.employeeName,
      role: shift.role,
      department: shift.department,
      notes: shift.notes,
      color: colors.bg,
    };
  });

  const eventStyleGetter = (event: BigCalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3b82f6',
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 6px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      }
    };
  };

  const handleEventDrop = ({ event, start, end }: any) => {
    if (onEventDrop) {
      const originalShift = shifts.find(s => s.id === event.id);
      if (originalShift) {
        onEventDrop(originalShift, start, end);
      }
    }
  };

  const handleSelectEvent = (event: BigCalendarEvent) => {
    if (onEventClick) {
      const originalShift = shifts.find(s => s.id === event.id);
      if (originalShift) {
        onEventClick(originalShift);
      }
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (onSelectSlot) {
      onSelectSlot(start, end);
    }
  };

  return (
    <div className="rounded-2xl p-4 bg-white/90 backdrop-blur-lg shadow-xl" style={{ height: '800px', minHeight: '800px' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        draggableAccessor={() => true}
        resizable
        onEventDrop={handleEventDrop}
        onEventResize={handleEventDrop}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        step={30}
        showMultiDayTimes
        popup
        components={{
          event: ({ event }: any) => {
            const calEvent = event as BigCalendarEvent;
            return (
              <div className="flex flex-col h-full justify-center">
                <div className="font-bold text-xs truncate leading-tight">{calEvent.employeeName}</div>
                <div className="text-[10px] opacity-90 truncate">{calEvent.role}</div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
