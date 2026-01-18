import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ notification, onRemove }: { notification: Notification; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(notification.id), 300);
    }, notification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notification, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/50 text-red-300',
    warning: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50 text-yellow-300',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-300',
  };

  return (
    <div
      className={`
        bg-gradient-to-r ${colors[notification.type]} 
        border-2 rounded-xl p-4 shadow-2xl backdrop-blur-xl
        min-w-[320px] max-w-md
        flex items-start gap-3
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[notification.type]}</div>
      <div className="flex-1">
        <p className="font-semibold">{notification.message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(notification.id), 300);
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Notification Context Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: Notification['type'], message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (message: string, duration?: number) => addNotification('success', message, duration),
    error: (message: string, duration?: number) => addNotification('error', message, duration),
    warning: (message: string, duration?: number) => addNotification('warning', message, duration),
    info: (message: string, duration?: number) => addNotification('info', message, duration),
  };
}
