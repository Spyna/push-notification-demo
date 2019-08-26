import { urlB64ToUint8Array } from "./utils/base64";

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

function initializePushNotifications() {
  // request user grant to show notification
  return Notification.requestPermission(function(result) {
    return result;
  });
}

function sendNotification() {
  const img = "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
  const text = "HEY! Take a look at this brand new t-shirt!";
  const title = "New Product Available ";
  const options = {
    body: text,
    icon: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: img,
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
  };
  navigator.serviceWorker.ready.then(function(serviceWorker) {
    serviceWorker.showNotification(title, options);
  });
}

const applicationServerKey = "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8";

const convertedKey = urlB64ToUint8Array(applicationServerKey);

function registerServiceWorker() {
  navigator.serviceWorker.register("/sw.js").then(function(swRegistration) {});
}

function subscribeForPushNotification(swRegistration) {
  return swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    })
    .then(function(subscription) {
      console.log("User is subscribed.", subscription.endpoint);
      return subscription;
    });
}

function subscribeUserToPushNotification() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready.then(function(serviceWorker) {
    // subscribe and return the subscription
    return subscribeForPushNotification(serviceWorker);
  });
}

function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function(serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function(pushSubscription) {
      return pushSubscription;
    });
}

export {
  isPushNotificationSupported,
  initializePushNotifications,
  registerServiceWorker,
  sendNotification,
  subscribeUserToPushNotification,
  getUserSubscription
};
