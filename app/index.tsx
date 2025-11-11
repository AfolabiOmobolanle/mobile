import React, { useEffect, useRef, useState } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

import { ThemeProvider, useTheme } from "./src/services/theme";
import FontScaleProvider from "./src/services/font";
import {
  useFonts,
  SourceSansPro_700Bold,
  SourceSansPro_400Regular,
  SourceSansPro_300Light,
} from "@expo-google-fonts/source-sans-pro";
import { View, Text, Platform, Alert } from "react-native";
import { ScreenLoaderProvider } from "./src/services/screenLoader";
import { AuthProvider } from "./src/services/auth";
import RootNavigation from "./src/navigations/RootNavigation";
import LogoutModal from "./src/components/common/logoutModal";
import { useMountState } from "./src/services/mounted";
import { registerDeviceForNotification } from "./src/services/notification";
import * as Notifications from "expo-notifications";
import { useApi } from "./src/services/api";
import * as Device from "expo-device";

if (Device.isDevice) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [{ res }, sendDeviceToken] = useApi({
    method: "post",
    path: "notifications/mobile/push",
    refetchOnFocus: false,
  });

  // useEffect(() => {
  //   if (Device.isDevice && ["android", "ios"].includes(Platform.OS)) {
  //     registerDeviceForNotification().then((token) => {
  //       Alert.alert("token", JSON.stringify(token));
  //       if (mounted) {
  //         sendDeviceToken(token);
  //       }
  //     });
  //   } else {
  //     registerDeviceForNotification().then((token) => {
  //       console.log(token, "token...");
  //       Alert.alert("token", JSON.stringify(token));
  //       if (mounted) {
  //         sendDeviceToken(token);
  //       }
  //     });
  //     console.log("emmanuel is testing");
  //   }
  // }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(JSON.stringify(token))
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!!!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "com.lbseko360",
        })
      ).data;
      Alert.alert("token", JSON.stringify(token));
      console.log(token, "---");
    } else {
      // Alert.alert("Must use physical device for Push Notifications");
    }

    return token;
  }

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
