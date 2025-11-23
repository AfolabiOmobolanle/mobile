import React, { useEffect, useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";

import { configureNotificationHandler, registerDeviceForNotification } from "./src/services/notification";
import { ThemeProvider, useTheme } from "./src/services/theme";
import FontScaleProvider from "./src/services/font";
import {
  useFonts,
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_300Light,
} from "@expo-google-fonts/source-sans-pro";
import { ScreenLoaderProvider } from "./src/services/screenLoader";
import { AuthProvider } from "./src/services/auth";
import RootNavigation from "./src/navigations/RootNavigation";
import LogoutModal from "./src/components/common/logoutModal";
import { useMountState } from "./src/services/mounted";
import { useApi } from "./src/services/api";

// Conditionally import expo-notifications only on real devices
let Notifications: typeof import("expo-notifications") | null = null;
if (Device.isDevice) {
  Notifications = require("expo-notifications");
  configureNotificationHandler();
}

export default function App() {
  const [fontLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_300Light,
  });

  const { theme, themeConfig } = useTheme();
  const statusBarColor = theme === "dark" ? "light" : "dark";
  const statusBarBg = themeConfig.backgroundDefault;
  const mounted = useMountState();

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const [{ res }, sendDeviceToken] = useApi({
    method: "post",
    path: "notifications/mobile/push",
    refetchOnFocus: false,
  });

  // Register for push notifications & setup listeners
  useEffect(() => {
    if (!Device.isDevice || !Notifications) return;

    // Register device
    registerDeviceForNotification().then((token) => {
      if (mounted && token) {
        setExpoPushToken(token);
        sendDeviceToken(token);
      }
    });

    // Notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => setNotification(notif));

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [mounted]);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: themeConfig.backgroundDefault, flex: 1 }}>
      <ThemeProvider>
        <FontScaleProvider>
          <AuthProvider>
            <LogoutModal>
              <StatusBar style={statusBarColor} backgroundColor={statusBarBg} />
              <PaperProvider>
                <ScreenLoaderProvider>
                  <MenuProvider>
                    <RootNavigation />
                  </MenuProvider>
                </ScreenLoaderProvider>
              </PaperProvider>
            </LogoutModal>
          </AuthProvider>
        </FontScaleProvider>
      </ThemeProvider>
    </View>
  );
}
