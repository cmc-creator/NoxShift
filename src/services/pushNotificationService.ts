/**
 * Push Notification Service
 * Framework for mobile push notifications using Firebase Cloud Messaging (FCM)
 * 
 * SETUP REQUIRED:
 * 1. Create Firebase project at https://console.firebase.google.com/
 * 2. Enable Cloud Messaging in Firebase Console
 * 3. Install Firebase: npm install firebase
 * 4. Add Firebase config to .env file
 * 5. Generate service worker for background notifications
 */

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  timestamp: Date;
}

class PushNotificationService {
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';
  private fcmToken: string | null = null;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Check if push notifications are supported in this browser
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Request permission to send push notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('Push notifications not supported');
      return 'denied';
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('Notification permission:', this.permission);
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  /**
   * Initialize Firebase Cloud Messaging (requires Firebase setup)
   */
  async initializeFCM(): Promise<void> {
    try {
      const { app } = await import('../lib/firebase');
      const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
      
      const messaging = getMessaging(app);
      
      // Request permission first
      if (this.permission !== 'granted') {
        await this.requestPermission();
      }
      
      if (this.permission === 'granted') {
        // Get FCM token (VAPID key needed from Firebase Console)
        // To get VAPID key: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
        try {
          this.fcmToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_HERE',
          });
          
          if (this.fcmToken) {
            console.log('FCM Token obtained:', this.fcmToken);
          }
        } catch (tokenError) {
          console.warn('FCM token error (VAPID key needed):', tokenError);
        }
        
        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
          
          if (payload.notification) {
            this.sendLocalNotification({
              title: payload.notification.title || 'Notification',
              body: payload.notification.body || '',
              data: payload.data,
            });
          }
        });
      }
      
      console.log('FCM initialized successfully');
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  }

  /**
   * Register service worker for background notifications
   */
  async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      console.log('Service Worker registered successfully:', registration);
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('Service Worker is ready');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Send a local notification (no backend required)
   */
  async sendLocalNotification(notification: Omit<PushNotification, 'id' | 'timestamp'>): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Cannot send notification - permission not granted');
      return;
    }

    try {
      const options: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || '/noxshift-icon.png',
        badge: notification.badge || '/noxshift-badge.png',
        data: notification.data,
        tag: 'noxshift-notification',
        requireInteraction: false,
        timestamp: Date.now(),
      };

      const notif = new Notification(notification.title, options);
      
      notif.onclick = () => {
        window.focus();
        notif.close();
        if (notification.data?.url) {
          window.location.href = notification.data.url;
        }
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Get FCM token for backend registration
   */
  getFCMToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Subscribe to topics (requires FCM setup)
   */
  async subscribeToTopic(topic: string): Promise<void> {
    // TODO: Implement topic subscription via backend API
    console.log(`Topic subscription pending: ${topic}`);
  }

  /**
   * Unsubscribe from topics
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    // TODO: Implement topic unsubscription via backend API
    console.log(`Topic unsubscription pending: ${topic}`);
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Example usage:
// await pushNotificationService.requestPermission();
// await pushNotificationService.sendLocalNotification({
//   title: 'Shift Reminder',
//   body: 'Your shift starts in 30 minutes!',
//   data: { url: '/scheduler' }
// });
