import { useState, useEffect } from "react";
import http from "./utils/http";

import {
  isPushNotificationSupported,
  initializePushNotifications,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription
} from "./push-notifications";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications() {
  const [userConsent, setSuserConsent] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] = useState(null);
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);

  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);

  const onClickAskUserPermission = () => {
    setLoading(true);
    initializePushNotifications().then(consent => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0
        });
      }
      setLoading(false);
    });
  };

  /**
   * creates a push notification subscription, that has to be sent to the push server
   */
  const onClickSusbribeToPushNotification = () => {
    setLoading(true);
    createNotificationSubscription()
      .then(function(subscrition) {
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };

  /**
   * sends the push susbcribtion to the push server
   */
  const onClickSendSubscriptionToPushServer = () => {
    setLoading(true);
    http
      .post("/subscription", userSubscription)
      .then(function(response) {
        setPushServerSubscriptionId(response.id);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(err);
      });
  };

  /**
   * request the push server to send a notification, passing the id
   */
  const onClickSendNotification = async () => {
    setLoading(true);
    await http.get(`/subscription/${pushServerSubscriptionId}`).catch(err => {
      setLoading(false);
      setError(err);
    });
    setLoading(false);
  };

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading
  };
}
