import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Conditionally import expo-notifications only on real devices
let Notifications: typeof import("expo-notifications") | null = null;
if (Device.isDevice) {
  Notifications = require("expo-notifications");
}

/**
 * Configure the global notification handler
 */
export const configureNotificationHandler = () => {
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

/**
 * Register device for push notifications and get the Expo push token
 */
export const registerDeviceForNotification = async (): Promise<string | null> => {
  if (!Notifications || !Device.isDevice) return null;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.log("Project ID not configured, skipping push token fetch");
      return null;
    }

    const tokenResult = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return tokenResult.data;
  } catch (err) {
    console.log("Error registering for notifications:", err);
    return null;
  }
};
