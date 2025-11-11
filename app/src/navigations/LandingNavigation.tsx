import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  LandingScreen,
  SigninScreen,
  ForgotPasswordScreen,
  ConfirmPasswordReset,
} from "../screens/landing";
import { LandingLogo, LandingButton } from "../components/landing/header";
import OTP from "../screens/landing/OTP";

export type LandingStackParamList = {
  Landing: undefined;
  SignIn: undefined;
};

const stack = createStackNavigator<LandingStackParamList>();

const LandingNavigation = () => {
  return (
    <stack.Navigator>
      <stack.Screen
        name="signin"
        component={SigninScreen}
        options={({ navigation }) => ({
          headerTitle: () => <LandingLogo />,
        })}
      />
      <stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
      <stack.Screen name="Confirm Reset" component={ConfirmPasswordReset} />
      <stack.Screen name="OTP" component={OTP} />
    </stack.Navigator>
  );
};

export default LandingNavigation;
