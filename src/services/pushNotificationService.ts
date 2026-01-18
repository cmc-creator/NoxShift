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
    // TODO: Add Firebase initialization
    // const { initializeApp } = await import('firebase/app');
    // const { getMessaging, getToken } = await import('firebase/messaging');
    // 
    // const firebaseConfig = {
    //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
    // };
    // 
    // const app = initializeApp(firebaseConfig);
    // const messaging = getMessaging(app);
    // 
    // this.fcmToken = await getToken(messaging, {
    //   vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    // });
    
    console.log('FCM initialization pending - Firebase setup required');
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
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
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
