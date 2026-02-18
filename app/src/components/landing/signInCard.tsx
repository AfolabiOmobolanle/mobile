import React, {
  useState,
  useCallback,
  forwardRef,
  createRef,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform
} from "react-native";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

let Notifications: typeof import("expo-notifications") | null = null;
if (Device.isDevice) {
  Notifications = require("expo-notifications");
}
import Constants from "expo-constants";

import { Checkbox } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

import Button from "../common/button";

import colors from "../../config/colors";
import { useStyleConfig } from "../../services/styles";
import font from "../../config/font";
import { emailValidate, isRequired } from "../../services/form-validator";
import { useApi } from "../../services/api";
import { useScreenLoader } from "../../services/screenLoader";
import { useAuth } from "../../services/auth";
import { useNavigation } from "@react-navigation/native";
import localStorage from "../../services/storage";
// import { UserActivityContext } from "../../services/userActivity";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    card: {
      margin: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: theme.backgroundDefault,
    },
    header: {
      marginBottom: 50,
    },
    headline: {
      fontSize: fontSize.h2,
      color: colors.primary,
      fontFamily: font.regular,
    },
    input: {
      marginBottom: 20,
      width: "100%",
      position: "relative",
    },
    inputField: {
      borderRadius: 5,
      borderColor: theme.textCaption,
      color: theme.textDefault,
      borderWidth: 1,
      padding: 10,
      fontFamily: font.regular,
    },
    fieldError: {
      borderColor: "red",
    },
    inputFieldError: {
      color: "red",
    },
    inputLabel: {
      marginBottom: 10,
      color: theme.textSub,
      fontFamily: font.bold,
    },
    bottomContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 23,
    },
    text: {
      fontFamily: font.regular,
      color: theme.textCaption,
    },
    forgotPassword: {
      color: theme.textCaption,
      fontSize: fontSize.p1,
      fontFamily: font.regular,
    },
    error: {},
    errorText: {
      backgroundColor: "red",
      fontSize: fontSize.p1,
      fontFamily: font.regular,
      color: theme.textDefault,
      padding: 15,
      margin: 30,
      borderRadius: 5,
    },
    passwordToggle: {
      position: "absolute",
      right: 15,
      top: 45,
    },
    passwordToggleText: {
      color: colors.primary,
    },
  });

interface InputProps {
  placeholder?: string;
  label?: string;
}
export const Input = forwardRef(
  (
    {
      placeholder,
      label,
      onBlur,
      onChange,
      value,
      error,
      secureTextEntry,
      ...textInputProps
    }: InputProps,
    ref
  ) => {
    const styles = useStyleConfig(getStyles);
    const [secureText, setSecureText] = useState(secureTextEntry);

    const toggleSecureText = useCallback(() => {
      setSecureText((prevState: boolean) => !prevState);
    }, []);

    return (
      <View style={styles.input}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={{ ...styles.inputField, ...(error && styles.fieldError) }}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={(value) => onChange(value)}
          value={value}
          ref={ref}
          autoCapitalize={"none"}
          secureTextEntry={secureText}
          {...textInputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={toggleSecureText}
          >
            <Text style={styles.passwordToggleText}>
              {secureText ? "Show" : "Hide"}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.inputFieldError}>{error && error.message}</Text>
      </View>
    );
  }
);

interface SignInCardProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}
const SignInCard: React.FC<SignInCardProps> = ({
  onLoginSuccess,
  onForgotPassword,
}) => {
  const styles = useStyleConfig(getStyles);
  // const { setActive } = useContext(UserActivityContext);
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);
  const toggleRememberMe = useCallback(
    () => setRememberMe((pState) => !pState),
    []
  );

  const { handleSubmit, control, errors, formState } = useForm({
    mode: "onChange",
  });
  const [{ error }, login] = useApi({ method: "post", path: "auth/login" });
  console.log(error, "errr");
  const loader = useScreenLoader();
  const { setAuth, persistAuth } = useAuth();

useEffect(() => {
  loader.hide();   
}, []);
async function getExpoPushToken() {
  try {
    if (!Device.isDevice || !Notifications) {
      console.log("Push notifications not available on this device");
      return null;
    }

    // Get existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
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

    console.log("FCM Token:", tokenResult.data);
    return tokenResult.data;
  } catch (err) {
    console.log("Error getting push token:", err);
    return null;
  }
}

// Function to store push token in backend
 async function storeFcmToken(auth, fcmToken) {
    try {
      if (!auth?.token || !fcmToken) return;

      const deviceId =
        Device.osInternalBuildId ||
        Device.androidId ||
        Constants.installationId ||
        "unknown";
      const deviceName = Device.deviceName || Device.modelName || "unknown";
      const deviceType = Platform.OS === "ios" ? "Ios" : "Android";

      // Store locally for offline use
      await SecureStore.setItemAsync("expoPushToken", fcmToken);

      const response = await fetch(
        "https://core.eko360.ng/api/v1/data_collector/firebase/store-token",
        {
          method: "POST",
          headers: {
            Authorization: auth.token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fcmToken,
            deviceId,
            deviceName,
            deviceType,
          }),
        }
      );

      const json = await response.json().catch(() => null);
      console.log("store-token response:", response.status, json);
    } catch (storeErr) {
      console.log("Error storing FCM token:", storeErr);
    }
  }

const onSubmit = async (data) => {
  console.log(data, "---", error);
  loader.show();

  try {
    const res = await login(data);
    loader.hide();
    console.log(res, "----Login Response");

    if (!res?.ok) return;

    const auth = res.data.data || {};
    const role = (auth.user ? auth.user.role : null) || {};
    const isDataCollector = role.slug === "data-collector";
    const demoEmail = auth?.user?.email;
    const isDemoAccount = demoEmail === "joel+test@findworka.com";

    if (!isDataCollector) return; 

    if (rememberMe) persistAuth(auth);

    // Try to get and store FCM token, but don't block login if it fails
    try {
      const fcmToken = await getExpoPushToken();
      if (fcmToken) {
        await storeFcmToken(auth, fcmToken);
      }
    } catch (fcmErr) {
      console.log("FCM token operation failed, continuing with login:", fcmErr);
    }

    const otpVerified = await localStorage.getItem("otpVerified");
    console.log(otpVerified, "otpVerified");

    if (isDemoAccount) {
      await localStorage.setItem("otpVerified", "Yes");
      setAuth(auth); 
      return;
    }

    if (otpVerified === "Yes") {
      setAuth(auth); 
      return; 
    }

    let otpResponse = await fetch(
      `https://core.eko360.ng/api/v1/otpAuth/generateToken`,
      {
        method: "POST",
        headers: {
          Authorization: auth.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: auth?.user?.id }),
      }
    );

    otpResponse = await otpResponse.json();
    console.log(otpResponse?.data?.otpAuth_token, "OTP response is here");

    if (otpResponse?.message === "Otp Code created successfully") {
      navigation.navigate("OTP", {
        auth,
        onLoginSuccess, // only if OTP flow still needs it
        otpDetails: otpResponse?.data?.otpAuth_token,
      });
    }
  } catch (e) {
    loader.hide();
    console.log("Login error:", e);
  }
};


  // [rememberMe, setAuth, persistAuth, onLoginSuccess];

  const passwordRef = createRef();

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headline}>Sign In</Text>
          </View>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              validate: {
                required: isRequired,
                email: emailValidate,
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="userone@mail.com"
                label="Email Address"
                autoFocus
                blurOnSubmit
                keyboardType="email-address"
                returnKeyType="next"
                error={errors?.email}
                onEndEditing={() => passwordRef?.current?.focus()}
                onChangeText={onChange}
                value={value}

                // {...controlProps}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ validate: { required: isRequired } }}
            render={({ field: { onChange, onBlur, value } }) => (
              // render={(controlProps) => (
              <Input
                ref={passwordRef}
                placeholder="password"
                label="Password"
                secureTextEntry
                returnKeyType="done"
                error={errors?.password}
                onChangeText={onChange}
                value={value}

                // {...controlProps}
              />
            )}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                borderWidth: 2,
                borderColor: "lightgrey",
                height: 20,
                width: 20,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
                // marginBottom: 15,
              }}
            >
              <Checkbox.Android
                status={rememberMe ? "checked" : "unchecked"}
                onPress={toggleRememberMe}
                color={colors.primary}
              />
            </View>

            <Text onPress={toggleRememberMe} style={[styles.text]}>
              Remember Me
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <Button
              title={formState.isSubmitting ? "Signing in ..." : "Sign In"}
              disabled={formState.isSubmitting || !formState.isValid}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.error}>
        {error && (
          <Text style={styles.errorText}>
            {error === "User not found" ||
            error === "Password is incorrect" ||
            error == "An error ocurred"
              ? "Invalid email or password"
              : error}
          </Text>
        )}
      </View>
    </>
  );
};

export default SignInCard;
