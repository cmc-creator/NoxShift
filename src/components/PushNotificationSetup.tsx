import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { pushNotificationService } from '../services/pushNotificationService';

export default function PushNotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsSupported(pushNotificationService.isNotificationSupported());
    setPermission(pushNotificationService.getPermissionStatus());
  }, []);

  const handleEnableNotifications = async () => {
    const result = await pushNotificationService.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Send test notification
      await pushNotificationService.sendLocalNotification({
        title: '🎉 Notifications Enabled!',
        body: 'You\'ll now receive important updates from NoxShift',
        data: { url: '/notifications' }
      });
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-center">
        <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-yellow-300 text-sm">Push notifications not supported in this browser</p>
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="text-white font-bold">Notifications Enabled</h3>
            <p className="text-green-300 text-sm">You'll receive real-time updates</p>
          </div>
        </div>
        {showSuccess && (
          <div className="mt-3 p-2 bg-green-600 rounded-lg text-white text-sm text-center animate-pulse">
            Test notification sent! Check your device.
          </div>
        )}
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <BellOff className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="text-white font-bold">Notifications Blocked</h3>
            <p className="text-red-300 text-sm">Please enable in browser settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center">
      <Bell className="w-12 h-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Enable Push Notifications</h3>
      <p className="text-purple-200 mb-6">
        Get instant alerts for schedule changes, shift reminders, and team updates
      </p>
      <button
        onClick={handleEnableNotifications}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
      >
        Enable Notifications
      </button>
      <p className="text-xs text-purple-300 mt-4">
        You can change this anytime in your browser settings
      </p>
    </div>
  );
}
