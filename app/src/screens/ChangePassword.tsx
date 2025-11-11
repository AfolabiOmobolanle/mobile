import React, { createRef, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/button";
import SecondaryHeader from "../components/common/secondayHeader";
import colors from "../config/colors";
import font from "../config/font";
import { useApi } from "../services/api";
import { useScreenLoader } from "../services/screenLoader";
import { useStyleConfig } from "../services/styles";
import { screenStyle } from "./styles";

const getStyles = ({ theme, fontSize }: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      alignItems: "center",
      backgroundColor: theme.backgroundDefault,
    },
    errorText: {
      backgroundColor: "pink",
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

const ChangePasswordScreen = ({ navigation }) => {
  const handleBackClick = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const styles = useStyleConfig(getStyles);
  const [old_password, setOld_password] = useState("");
  const [new_password, setNew_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  const {
    control,
    errors,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });
  const newPassword = watch("new_password");
  const [{ error, success }, changePassword] = useApi({
    path: "auth/password/change",
    method: "post",
  });
  const loader = useScreenLoader();

  //refs
  const newPasswordRef = createRef();
  const confirmNewPasswordRef = createRef();

  const submit = async () => {
    loader.show();
    const res = await changePassword({
      old_password,
      new_password,
    });
    console.log(JSON.stringify(res));
    loader.hide();
  };

  useEffect(() => {
    if (success) {
      Alert.alert("", "Password changed successfully");
      setOld_password("");
      setNew_password("");
      setConfirm_password("");
      handleBackClick();
    }
  }, [success]);

  return (
    <SafeAreaView style={screenStyle}>
      <SecondaryHeader title="Change Password" onBack={handleBackClick} />
      <View style={styles.container}>
        <View style={styles_.wrapper}>
          <Text style={styles_.label}>Old password</Text>
          <TextInput
            style={styles_.textInput}
            value={old_password}
            onChangeText={(old_password) => setOld_password(old_password)}
            secureTextEntry
          />
          <Text style={styles_.label}>New password</Text>
          <TextInput
            style={styles_.textInput}
            value={new_password}
            secureTextEntry
            onChangeText={(new_password) => setNew_password(new_password)}
          />
          <Text style={styles_.label}>Confirm new password</Text>
          <TextInput
            style={styles_.textInput}
            value={confirm_password}
            secureTextEntry
            onChangeText={(confirm_password) =>
              setConfirm_password(confirm_password)
            }
          />
        </View>
        {/* <Controller
          name="old_password"
          control={control}
          rules={{
            validate: { required: isRequired },
          }}
          render={(controlProps) => (
            <Input
              label="Old Password"
              autoFocus
              blurOnSubmit
              returnKeyType="next"
              error={errors.old_password}
              // onEndEditing={() => newPasswordRef.current.focus()}
              secureTextEntry
              {...controlProps}
            />
          )}
        />
        <Controller
          name="new_password"
          control={control}
          rules={{
            validate: {
              required: isRequired,
            },
          }}
          render={(controlProps) => (
            <Input
              label="New Password"
              blurOnSubmit
              returnKeyType="next"
              error={errors.new_password}
              ref={newPasswordRef}
              // onEndEditing={() => confirmNewPasswordRef.current.focus()}
              secureTextEntry
              {...controlProps}
            />
          )}
        />
        <Controller
          name="confirm_new_password"
          control={control}
          rules={{
            validate: {
              required: isRequired,
              comparePassword: compareValue(
                newPassword,
                "Value does not match with new password"
              ),
            },
          }}
          render={(controlProps) => (
            <Input
              label="Confirm New Password"
              blurOnSubmit
              returnKeyType="next"
              error={errors.confirm_new_password}
              ref={confirmNewPasswordRef}
              secureTextEntry
              {...controlProps}
              // onEndEditing={() => confirmNewPasswordRef.current.focus()}
            />
          )}
        /> */}
        <Button
          title={"Change"}
          style={{ minWidth: "100%", marginBottom: 50 }}
          onPress={() => submit()}
          disabled={!isValid}
        />
        <View>
          {(error || success) && (
            <Text style={success ? styles.successText : styles.errorText}>
              {success && "Password changed successfully"}
              {error && (error || "An error occured while changing password")}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
const styles_ = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 4,
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    color: "black",
  },
  label: {
    fontSize: 12,
    color: colors.dark,
    textAlign: "left",
    marginBottom: 5,
    fontWeight: "500",
    marginTop: 20,
  },
});
