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
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
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

  loader.hide();

  const onSubmit = async (data) => {
    console.log(data, "---", error);
    loader.show();
    const res = await login(data);
    loader.hide();

    console.log(res, "----Login Response");

    if (res?.ok) {
      const auth = res.data.data || {};
      const role = (auth.user ? auth.user.role : null) || {};
      const isDataCollector = role.slug === "data-collector";

      if (isDataCollector) {
        if (rememberMe) {
          persistAuth(auth);
        }

        const otpVerified = await localStorage.getItem("otpVerified");
        console.log(otpVerified, "otpVerified");
        if (otpVerified && otpVerified == "Yes") {
          setAuth(auth);
          onLoginSuccess();
        } else {
          let response = await fetch(
            `https://core.eko360.ng/api/v1/otpAuth/generateToken`,
            {
              method: "post",
              body: JSON.stringify({ id: auth?.user?.id }),
              headers: {
                Authorization: auth?.token,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          response = await response.json();
          console.log(response?.data?.otpAuth_token, "OTP response is here");

          if (response?.message == "Otp Code created successfully") {
            navigation.navigate("OTP", {
              auth,
              onLoginSuccess,
              otpDetails: response?.data?.otpAuth_token,
            });
          }
        }

        // setAuth(auth);
        // onLoginSuccess();

        // setActive(true);
      }
      return;
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
