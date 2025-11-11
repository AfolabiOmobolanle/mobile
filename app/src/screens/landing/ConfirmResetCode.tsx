import React, { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from "react-native";
import font from "../../config/font";
import Button from "../../components/common/button";
import { Input } from "../../components/landing/signInCard";
import { isRequired, compareValue } from "../../services/form-validator";
import { useStyleConfig } from "../../services/styles";
import { Controller, useForm } from "react-hook-form";
import colors from "../../config/colors";
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
    caption: {
      fontSize: fontSize.p,
      color: theme.textDefault,
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

const ConfirmResetCode = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);

  const { handleSubmit, control, errors, formState, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      code: "",
      new_password: "",
      confirm_new_password: "",
    },
  });
  const newPassword = watch("new_password");

  const [{ error, success }, confirmReset] = useApi({
    method: "post",
    path: "auth/password/mobile/reset",
  });
  const loader = useScreenLoader();

  const submit = useCallback(
    async (values) => {
      loader.show();
      const res = await confirmReset({
        code: Number(values.code),
        new_password: values.new_password,
      });
      loader.hide();
    },
    [confirmReset]
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headline}>Confirm Reset</Text>
          <Text style={styles.caption}>A reset code was sent to your mail</Text>
        </View>
        <Controller
          name="code"
          control={control}
          defaultValue=""
          rules={{
            validate: {
              required: isRequired,
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Reset Code"
              autoFocus
              blurOnSubmit
              keyboardType="number"
              returnKeyType="done"
              error={errors?.code}
              onChangeText={onChange}
              value={value}

              // {...controlProps}
            />
          )}
        />
        <Controller
          name="new_password"
          control={control}
          defaultValue=""
          rules={{
            validate: {
              required: isRequired,
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            // render={(controlProps) => (
            <Input
              label="New Password"
              autoFocus
              blurOnSubmit
              returnKeyType="done"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              error={errors?.new_password}
              // {...controlProps}
            />
          )}
        />
        <Controller
          name="confirm_new_password"
          control={control}
          defaultValue=""
          rules={{
            validate: {
              required: isRequired,
              comparePassword: compareValue(
                newPassword,
                "Value does not match with new password"
              ),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            // render={(controlProps) => (
            <Input
              label="Confirm New Password"
              autoFocus
              blurOnSubmit
              returnKeyType="done"
              secureTextEntry
              error={errors?.confirm_new_password}
              // {...controlProps}
              onChangeText={onChange}
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
              {success && "New password Set Successfully"}
              {error &&
                (error || "An error occured while setting new password")}
            </Text>
          )}
          {success && (
            <Button
              style={{ width: "100%" }}
              onPress={() => navigation.navigate("signin")}
              type="secondary"
              title="Go to Login"
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfirmResetCode;
