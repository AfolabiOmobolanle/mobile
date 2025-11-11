import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import SignInCard from "../../components/landing/signInCard";
import { useStyleConfig } from "../../services/styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { LandingStackParamList } from "../../navigations/LandingNavigation";

const getStyle = ({ theme }) =>
  StyleSheet.create({
    signInScreenStyle: {
      backgroundColor: theme.backgroundDefault,
      // paddingVertical: 20,
      flex: 1,
      justifyContent: "center",
    },
  });

interface SigninScreenProps {
  navigation: StackNavigationProp<LandingStackParamList, "SignIn">;
}
const SigninScreen = ({ navigation }: SigninScreenProps) => {
  const { signInScreenStyle } = useStyleConfig(getStyle);

  const handleLoginSuccess = useCallback(() => navigation.navigate("main"), []);
  const handleForgotPassword = useCallback(
    () => navigation.navigate("Forgot Password"),
    []
  );

  return (
    <KeyboardAvoidingView
      style={signInScreenStyle}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <SignInCard
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={handleForgotPassword}
      />
    </KeyboardAvoidingView>
  );
};

export default SigninScreen;
