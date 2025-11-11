import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FeedScreen from "../screens/main/feed/main";
import SurveyScreen from "../screens/main/feed/survey";
import SurveySuccessScreen from "../screens/main/feed/surveySuccess";

const stack = createStackNavigator();

const FeedNavigation = () => (
  <stack.Navigator screenOptions={{ headerShown: false }}>
    {/* <stack.Screen name="feed" component={FeedScreen} /> */}
    <stack.Screen name="survey" component={SurveyScreen} />
    <stack.Screen name="surveySuccess" component={SurveySuccessScreen} />
  </stack.Navigator>
);

export default FeedNavigation;
