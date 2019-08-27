import "../styles/index.scss";
import http from "./utils/http";
import {
  isPushNotificationSupported,
  initializePushNotifications,
  registerServiceWorker,
  getUserSubscription,
  createNotificationSubscription
} from "./push-notifications.js";

/**
 * request the push server to send a notification, passing the id
 */
function sendNotification() {
  http.get(`/subscription/${subscritionId}`);
}

/**
 * updates the DOM printing the user consent and activates buttons
 * @param {String} userConsent
 */
function updateUserConsent(userConsent) {
  pushNotificationConsentSpan.innerHTML = userConsent;
  if (userConsent === "granted") {
    //enable push notification subscribe button
    susbribeToPushNotificationButton.disabled = false;
  } else {
    sendPushNotificationButton.disabled = true;
    susbribeToPushNotificationButton.disabled = true;
  }
}

/**
 * ask the user consent to receive push notification
 */
function askUserPermission() {
  initializePushNotifications().then(updateUserConsent);
}

/**
 * creates a push notification subscription, that has to be sent to the push server
 */
function susbribeToPushNotification() {
  createNotificationSubscription().then(function(subscrition) {
    showUserSubscription(subscrition);
  });
}

/**
 * displays the subscription details in the page and enables the "send Subscription Button"
 * @param {PushSubscription} subscrition 
 */
function showUserSubscription(subscrition) {
  userSubscrition = subscrition;
  document.getElementById("user-susbription").innerHTML = JSON.stringify(subscrition, null, " ");
  sendSubscriptionButton.disabled = false;
}

/**
 * sends the push susbcribtion to the push server
 */
function sendSubscriptionToPushServer() {
  http.post("/subscription", userSubscrition).then(function(response) {
    subscritionId = response.id;
    sendPushNotificationButton.disabled = false;
  });
}


let userSubscrition;
let subscritionId;

//checks if the browser supports push notification and service workers
const pushNotificationSuported = isPushNotificationSupported();

const pushNotificationConsentSpan = document.getElementById("push-notification-consent");
const pushNotificationSupportedSpan = document.getElementById("push-notification-supported");
pushNotificationSupportedSpan.innerHTML = pushNotificationSuported;

const askUserPemissionButton = document.getElementById("ask-user-permission-button");
askUserPemissionButton.addEventListener("click", askUserPermission);

const susbribeToPushNotificationButton = document.getElementById("create-notification-subscription-button");
susbribeToPushNotificationButton.addEventListener("click", susbribeToPushNotification);

const sendSubscriptionButton = document.getElementById("send-subscription-button");
sendSubscriptionButton.addEventListener("click", sendSubscriptionToPushServer);

const sendPushNotificationButton = document.getElementById("send-push-notification-button");
sendPushNotificationButton.addEventListener("click", sendNotification);

if (pushNotificationSuported) {
  updateUserConsent(Notification.permission);
  askUserPemissionButton.disabled = false;
  // register the service worker: file "sw.js" in the root of our project
  registerServiceWorker();
  getUserSubscription().then(function(subscrition) {
    if (subscrition) {
      showUserSubscription(subscrition);
    }
  });
}