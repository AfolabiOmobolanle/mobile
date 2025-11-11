import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import colors from "../config/colors";

import FeedNavigation from "./FeedNavigation";
import TrendScreen from "../screens/main/Trend";
import SubmissionScreen from "../screens/main/Submission";
import font from "../config/font";
import { Text } from "react-native";
import LeaderBoardScreen from "../screens/main/Leaderboard";
import { useTheme } from "../services/theme";
import UploadFileScreen from "../components/upload/upload";

const tab = createBottomTabNavigator();

const TabIcon = ({ IconPack, ...iconProps }) => (
  <IconPack {...iconProps} size={20} />
);

const makeTabLabel =
  (title: String) =>
  ({ focused, color }) =>
    (
      <Text
        style={{
          fontFamily: focused ? font.bold : font.regular,
          color,
          fontSize: 12,
        }}
      >
        {title}
      </Text>
    );

const MainNavigation = () => {
  const { themeConfig, isDarkMode } = useTheme();
  const tabBg = themeConfig.backgroundDefault;

  return (
    <tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBarOptions={{
        activeTintColor: colors.primary,
        ...(isDarkMode && { inactiveTintColor: colors.white }),
        labelStyle: { textTransform: "capitalize", fontFamily: font.regular },
        activeBackgroundColor: tabBg,
        inactiveBackgroundColor: tabBg,
      }}
    >
      <tab.Screen
        name="home"
        component={FeedNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon IconPack={MaterialIcons} name="home" color={color} />
          ),
          tabBarLabel: makeTabLabel("Home"),
        }}
      />
      {/* <tab.Screen
        name="upload"
        component={UploadFileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon
              IconPack={MaterialIcons}
              name="cloud-upload"
              color={color}
            />
          ),
          tabBarLabel: makeTabLabel("Upload"),
        }}
      /> */}
      <tab.Screen
        name="leaderboard"
        component={LeaderBoardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon IconPack={Entypo} name="bar-graph" color={color} />
          ),
          tabBarLabel: makeTabLabel("Leaderboard"),
        }}
      />
      <tab.Screen
        name="submissions"
        component={SubmissionScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon IconPack={Entypo} name="archive" color={color} />
          ),
          tabBarLabel: makeTabLabel("Submission"),
        }}
      />
    </tab.Navigator>
  );
};

export default MainNavigation;
