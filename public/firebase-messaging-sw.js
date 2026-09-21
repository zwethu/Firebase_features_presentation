/* eslint-disable no-undef */
// Firebase Cloud Messaging service worker.
//
// StudyFlow AI's in-app notification bell (Firestore-backed, real-time)
// already covers the full demo journey without this file. FCM push is
// strictly optional — this worker only matters if you've registered it via
// registerForPushNotifications() in src/services/messagingService.ts AND
// configured VITE_FCM_VAPID_KEY. The public config values below are safe
// to hardcode in a service worker (they are not secrets), but this file
// intentionally ships with placeholders so nothing fires unless a real
// project fills them in.
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'REPLACE_WITH_VITE_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_VITE_FIREBASE_APP_ID',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'StudyFlow AI'
  const options = {
    body: payload.notification?.body ?? '',
    icon: '/favicon.svg',
  }
  self.registration.showNotification(title, options)
})
