import React, { useCallback, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
// import UserInactivity from "react-native-user-inactivity";

import { SurveySuccess } from "../../../components/survey/status";
import { useAuth } from "../../../services/auth";
import { useStyleConfig } from "../../../services/styles";
// import { UserActivityContext } from "../../../services/userActivity";

const getStyles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: theme.backgroundDefault,
    },
  });

const SurveySuccessScreen = ({ navigation }) => {
  const style = useStyleConfig(getStyles);

  const handleGotoTrend = useCallback(() => navigation.navigate("trend"), []);
  const handleGotoSurvey = useCallback(() => navigation.navigate("feed"), []);
  const { clearAuth } = useAuth();
  // const { active, setActive, timer } = useContext(UserActivityContext);

  // useEffect(() => {
  //   setActive(true);
  // }, []);

  // useEffect(() => {
  //   if (!active) {
  //     clearAuth();
  //   }
  // }, [active]);
  return (
    <View style={style.container}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <SurveySuccess
        gotoSurvey={handleGotoSurvey}
        gotoTrend={handleGotoTrend}
      />
      {/* </UserInactivity> */}
    </View>
  );
};

export default SurveySuccessScreen;
