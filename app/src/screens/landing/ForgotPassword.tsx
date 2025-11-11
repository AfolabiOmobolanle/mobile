import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Button from "../../components/common/button";
import { Input } from "../../components/landing/signInCard";
import { emailValidate, isRequired } from "../../services/form-validator";
import { useStyleConfig } from "../../services/styles";
import colors from "../../config/colors";
import font from "../../config/font";
import { useApi } from "../../services/api";
import { useScreenLoader } from "../../services/screenLoader";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    screen: {
      backgroundColor: theme.backgroundDefault,
      flex: 1,
      justifyContent: "center",
    },
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
    successText: {
      backgroundColor: "#afdc8d",
      fontSize: fontSize.p1,
      fontFamily: font.regular,
      color: theme.textDefault,
      padding: 15,
      margin: 30,
      borderRadius: 5,
    },
  });

const ForgotPasswordScreen = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);

  const { handleSubmit, control, errors, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const [{ error, success }, sendRecoveryCode] = useApi({
    method: "post",
    path: "auth/password/mobile/recover",
  });
  const loader = useScreenLoader();

  const submit = useCallback(
    async (values) => {
      loader.show();
      const res = await sendRecoveryCode({ email: values.email });
      loader.hide();
      if (res.ok) {
        navigation.navigate("Confirm Reset", { email: values.email });
      }
    },
    [sendRecoveryCode]
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headline}>Forgot Password</Text>
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
            // render={(controlProps) => (
            <Input
              placeholder="userone@mail.com"
              label="Email Address"
              autoFocus
              blurOnSubmit
              keyboardType="email-address"
              returnKeyType="done"
              error={errors?.email}
              // {...controlProps}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Button
          title={"Send"}
          disabled={formState.isSubmitting || !formState.isValid}
          onPress={handleSubmit(submit)}
        />
        <View>
          {(error || success) && (
            <Text style={success ? styles.successText : styles.errorText}>
              {success && "A reset Code has been sent to your mail"}
              {error && (error || "An error occured while changing password")}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
