// Firebase Cloud Messaging Service Worker
// This file handles background push notifications

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker with your config
firebase.initializeApp({
  apiKey: "AIzaSyCTS2ux52QuPpb9aAzMZGYL46mJAjHbn2c",
  authDomain: "noxshift-2617b.firebaseapp.com",
  projectId: "noxshift-2617b",
  storageBucket: "noxshift-2617b.firebasestorage.app",
  messagingSenderId: "265911446290",
  appId: "1:265911446290:web:7332885b184cd1bc4021cb"
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'NoxShift Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/krono-avatar.png',
    badge: '/krono-avatar.png',
    data: payload.data || {},
    requireInteraction: false,
    tag: 'noxshift-notification',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Open NoxShift'
      }
    ]
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);
  
  event.notification.close();
  
  // Navigate to the app or specific URL
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('[firebase-messaging-sw.js] Service Worker initialized');
