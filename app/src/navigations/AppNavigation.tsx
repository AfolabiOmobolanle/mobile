import React, { useState, useEffect, useCallback, createRef } from "react";
import { Text } from "react-native";
import jwt_decode from "jwt-decode";

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
import { useSurveyFormContext } from "../context/surveyFormContext";

const stack = createStackNavigator();

const authIsValid = (token: string) => {
  const { exp } = jwt_decode(token) || { exp: 0 };

  if (Date.now() >= exp * 1000) {
    return false;
  }
  return true;
};

const AppNavigation = () => {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { auth, getPersistedAuth, setAuth } = useAuth();

  const { editedSurvey } = useSurveyFormContext();
  const hasActiveEditedSurvey = Object.keys(editedSurvey).length > 0;

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
          {hasActiveEditedSurvey && (
            <stack.Screen
              name="previewSurvey"
              component={PreviewSurveyScreen}
            />
          )}
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
