import React, { createRef, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/button";
import SecondaryHeader from "../components/common/secondayHeader";
import colors from "../config/colors";
import font from "../config/font";
import { useApi } from "../services/api";
import { useAuth } from "../services/auth";
import { useScreenLoader } from "../services/screenLoader";
import { useStyleConfig } from "../services/styles";
import { screenStyle } from "./styles";

const getStyles = ({ theme, fontSize }: any) =>
  StyleSheet.create({
    avartar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.darkLighest,
      margin: 30,
      position: "relative",
    },
    iconWrapper: {
      position: "absolute",
      backgroundColor: "#dedede",
      borderWidth: 1,
      borderColor: colors.white,
      width: 50,
      height: 50,
      borderRadius: 60,
      zIndex: 1,
      bottom: -10,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      padding: 15,
      alignItems: "center",
      backgroundColor: theme.backgroundDefault,
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

const ProfileScreen = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);
  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const handleChangePassword = useCallback(
    () => navigation.navigate("changePassword"),
    [navigation]
  );

  const { auth, updateUser: updateUserInStore } = useAuth();
  const user = auth ? auth.user || {} : {};
  console.log(user);
  const {
    control,
    errors,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      full_name: user?.full_name,
      email: user?.email,
      phone_number: `${user?.phone_number}`,
    },
  });

  const phoneRef = createRef();

  const [successful, setSuccessful] = useState(false);
  const [{ loading, error }, updateUser] = useApi({
    method: "put",
    path: `/admin/user/update/${user.id}`,
  });
  const loader = useScreenLoader();
  const [fullname, setFullname] = useState(user?.full_name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone_number);

  const submit = async () => {
    setSuccessful(false);
    loader.show();
    const res = await updateUser({
      email,
      full_name: fullname,
      phone_number: phone,
    });
    loader.hide();

    if (res.ok) {
      updateUserInStore({
        email,
        full_name: fullname,
        phone_number: phone,
      });
      setSuccessful(true);
    }
  };

  return (
    <SafeAreaView style={screenStyle}>
      <SecondaryHeader title="Profile" onBack={handleBackPress} />
      <View style={styles.container}>
        <View style={styles_.wrapper}>
          <Text style={styles_.label}>Full name</Text>
          <TextInput
            style={styles_.textInput}
            value={fullname}
            onChangeText={(fullname) => setFullname(fullname)}
          />
          <Text style={styles_.label}>Email</Text>
          <TextInput
            style={styles_.textInput}
            value={email}
            editable={false}
            onChangeText={(email) => setEmail(email)}
          />
          <Text style={styles_.label}>Phone number</Text>
          <TextInput
            style={styles_.textInput}
            value={phone}
            onChangeText={(phone) => setPhone(phone)}
          />
        </View>
        {/* <Controller
          name="full_name"
          control={control}
          rules={{
            validate: { required: isRequired },
          }}
          render={(controlProps) => (
            <Input
              label="Full name"
              autoFocus
              blurOnSubmit
              returnKeyType="next"
              error={errors?.full_name}
              onEndEditing={() => phoneRef.current.focus()}
              {...controlProps}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            validate: {
              required: isRequired,
              email: emailValidate,
            },
          }}
          render={(controlProps) => (
            <Input
              placeholder="userone@mail.com"
              label="Email Address"
              blurOnSubmit
              keyboardType="email-address"
              returnKeyType="next"
              error={errors?.email}
              disabled
              editable={false}
              {...controlProps}
            />
          )}
        />
        <Controller
          name="phone_number"
          control={control}
          rules={{
            validate: { required: isRequired },
          }}
          render={(controlProps) => (
            <Input
              label="Phone Number"
              ref={phoneRef}
              blurOnSubmit
              keyboardType="phone-pad"
              returnKeyType="done"
              error={errors?.phone_number}
              {...controlProps}
            />
          )}
        /> */}
        <Button
          title={loading ? "Updating ..." : "Update Profile"}
          style={{ minWidth: "100%", marginBottom: 50 }}
          onPress={handleSubmit(submit)}
        />
        <Button
          title="Change Password"
          style={{ minWidth: "100%" }}
          type="secondary"
          onPress={handleChangePassword}
        />
        <View>
          {(error || successful) && (
            <Text style={successful ? styles?.successText : styles?.errorText}>
              {successful && "Profile updated successfully"}
              {error && (error || "An error occured during update")}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
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
