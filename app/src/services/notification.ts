import { Platform } from "react-native";
import * as Device from "expo-device";

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

    const tokenResult = await Notifications.getExpoPushTokenAsync({
      // Use your EAS project ID if needed
      projectId: Platform.OS === "ios" ? undefined : "YOUR_PROJECT_ID_HERE",
    });

    return tokenResult.data;
  } catch (err) {
    console.log("Error registering for notifications:", err);
    return null;
  }
};
