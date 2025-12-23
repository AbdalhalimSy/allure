/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAScs8Kb2AuP4Bk62JsNSC9QDosxVHRyhY",
  authDomain: "allure-app-e8416.firebaseapp.com",
  projectId: "allure-app-e8416",
  storageBucket: "allure-app-e8416.firebasestorage.app",
  messagingSenderId: "21758819406",
  appId: "1:21758819406:web:af499fd30b797e8887971f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "New notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo/logo-white.svg",
    badge: "/logo/logo-white.svg",
    tag: payload.data?.type || "notification",
    data: payload.data,
    requireInteraction: false,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let urlToOpen = "/";
  const type = event.notification?.data?.type;
  if (type === "payment_success") {
    urlToOpen = "/subscriptions?status=success";
  } else if (type === "payment_failed") {
    urlToOpen = "/payment?status=failed";
  } else if (type === "job") {
    urlToOpen = "/jobs";
  } else if (event.notification?.data?.screen) {
    urlToOpen = `/${event.notification.data.screen.toLowerCase()}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
      return null;
    })
  );
});
