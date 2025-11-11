import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// import UserInactivity from "react-native-user-inactivity";

import SecondaryHeader from "../../../components/common/secondayHeader";
import PreviewSurvey from "../../../components/survey/preview";
import { useAuth } from "../../../services/auth";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useStyleConfig } from "../../../services/styles";
// import { UserActivityContext } from "../../../services/userActivity";

const getStyles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
  });
const PreviewSurveyScreen = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);
  const navigation_: NavigationProp<any> = useNavigation();

  const handleConfirmSucceses = useCallback(
    () => navigation.navigate("surveySuccess"),
    []
  );
  const handleCancel = useCallback(() => navigation.goBack(), []);
  const handleCancel_ = () => navigation_.navigate("main");
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
    <SafeAreaView style={styles.container}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <SecondaryHeader title="Preview" onBack={handleCancel} />
      <PreviewSurvey
        onConfirmSuccess={handleConfirmSucceses}
        onCancel={handleCancel_}
      />
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default PreviewSurveyScreen;
