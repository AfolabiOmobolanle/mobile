import React, { useState, useEffect, useCallback } from "react";
import { Text } from "react-native";
import { jwtDecode } from "jwt-decode";

import { createStackNavigator } from "@react-navigation/stack";
import LandingNavigation from "./LandingNavigation";
import MainNavigation from "./MainNavigation";
import SettingsScreen from "../screens/Settings";
import ProfileScreen from "../screens/Profile";
import TrendScreen from "../screens/main/Trend";
import NotificationScreen from "../screens/Notification";
import { useAuth } from "../services/auth";
import { navigate } from "../services/navigation";
import ChangePasswordScreen from "../screens/ChangePassword";
import FillSurveyScreen from "../screens/main/feed/fillSurvey";
import PreviewSurveyScreen from "../screens/main/feed/previewSurvey";

const stack = createStackNavigator();

const authIsValid = (token: string) => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const exp = decoded?.exp || 0;
    
    return Date.now() < exp * 1000;
  } catch (error) {
    return false;
  }
};

const AppNavigation = () => {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { auth, getPersistedAuth, setAuth } = useAuth();

  const setupAuth = useCallback(async () => {
    const persistedAuth: any = await getPersistedAuth();

    if (persistedAuth && authIsValid(persistedAuth.token) && !auth) {
      setAuth(persistedAuth);
    }

    setCheckedAuth(true);
  }, [auth, getPersistedAuth]);

  useEffect(() => {
    setupAuth();
  }, [auth]);

  useEffect(() => {
    if (checkedAuth && !auth) {
      navigate("landing");
    }
  }, [auth, checkedAuth]);

  if (!checkedAuth) {
    return <Text>Checking Auth ...</Text>;
  }

  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
      }}
    >
      {!auth && (
        <>
          <stack.Screen
            name="landing"
            component={LandingNavigation}
            options={{ headerShown: false }}
          />
        </>
      )}
      {auth && (
        <>
          <stack.Screen name="main" component={MainNavigation} />
          <stack.Screen name="fillSurvey" component={FillSurveyScreen} />
          <stack.Screen
            name="previewSurvey"
            component={PreviewSurveyScreen}
          />
          <stack.Screen name="settings" component={SettingsScreen} />
          <stack.Screen name="profile" component={ProfileScreen} />
          <stack.Screen
            name="changePassword"
            component={ChangePasswordScreen}
          />
          <stack.Screen name="trend" component={TrendScreen} />
          <stack.Screen name="notifications" component={NotificationScreen} />
        </>
      )}
    </stack.Navigator>
  );
};

export default AppNavigation;
