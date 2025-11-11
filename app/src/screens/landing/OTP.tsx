import { View, Text, Alert, StyleSheet, TextInput } from "react-native";
import React, { useRef, useState } from "react";
// import OTPTextInput from "react-native-otp-textinput";
// import OTPInputView from "@twotalltotems/react-native-otp-input";
// import OtpInputs from "react-native-otp-inputs";

import Button from "../../components/common/button";
import { useAuth } from "../../services/auth";
import localStorage from "../../services/storage";

const OTP = ({ route }) => {
  // console.log(route?.params?.auth.token);
  const { setAuth } = useAuth();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // "react-native-otp-textinput": "^1.1.1",
  const [otp, setOtp] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);

  const verifyCode = async () => {
    // await localStorage.setItem("otpVerified", "Yes");
    const code = `${otp}${otp2}${otp3}${otp4}`;
    console.log(code);

    if (code?.length === 4) {
      setIsLoading(true);
      try {
        let response = await fetch(
          `https://core.eko360.ng/api/v1/otpAuth/verifyToken`,
          {
            method: "post",
            body: JSON.stringify({
              id: route?.params?.auth?.user?.id,
              otpCode: code,
            }),
            headers: {
              Authorization: route?.params?.auth.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        response = await response.json();
        setIsLoading(false);
        // console.log(response, "verify otp response is here");
        if (response?.status === "success") {
          let resp = await localStorage.setItem("otpVerified", "Yes");
          setAuth(route?.params?.auth);
          route?.params?.onLoginSuccess();
        }
        if (response?.status === "error") {
          Alert.alert("", response?.message);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error?.message);
      }
    }
  };

  return (
    <View style={{ paddingTop: "20%", padding: 20 }}>
      <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 50 }}>
        Please enter OTP code sent to your email to continue
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={otp}
          onChangeText={(text) => {
            setOtp(text);
            if (text) {
              otp2Ref?.current?.focus();
            }
          }}
        />
        <TextInput
          ref={otp2Ref}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={otp2}
          onChangeText={(text) => {
            setOtp2(text);
            if (text) {
              otp3Ref?.current?.focus();
            }
          }}
        />
        <TextInput
          ref={otp3Ref}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={otp3}
          onChangeText={(text) => {
            setOtp3(text);
            if (text) {
              otp4Ref?.current?.focus();
            }
          }}
        />
        <TextInput
          ref={otp4Ref}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={otp4}
          onChangeText={(text) => setOtp4(text)}
        />
      </View>

      {/* <OtpInputs
        handleChange={(code) => console.log(code)}
        numberOfInputs={6}
        inputStyles={styles.input}
        autofillFromClipboard={false}
      /> */}
      {/* <OTPInputView
        style={{ height: 200 }}
        pinCount={4}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code) => {
          setValue(code);
          console.log(`Code is ${code}, you are good to go!`);
        }}
      /> */}
      {/* <OTPTextInput
        autoFocus
        handleTextChange={(text) => setValue(text)}
        // ref={(e) => (otpInput = e)}
      /> */}
      <View style={{ marginVertical: 20 }} />
      <Button
        title={isLoading ? "Please wait..." : "Verify"}
        onPress={() => verifyCode()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#000",
    width: 40,
    height: 45,
    margin: 5,
    textAlign: "center",
    borderRadius: 5,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "black",
    color: "black",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "black",
    fontSize: 20,
    borderBottomColor: "black",
  },

  underlineStyleHighLighted: {
    borderColor: "black",
  },
});

export default OTP;
