import React, { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useApi } from "../../services/api";

import Avartar from "../../components/common/avartar";
import LoadManager from "../../components/common/loadManager";
import SecondaryHeader from "../../components/common/secondayHeader";
import TrendGraph from "../../components/trend/graph";
import TrendInterval from "../../components/TrendInterval";
import { useStyleConfig } from "../../services/styles";
import { formatSurveyGraphRes } from "../../utils/format";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../services/auth";
import { dayList, monthList } from "../../utils/calender";
// import { UserActivityContext } from "../../services/userActivity";
// import UserInactivity from "react-native-user-inactivity";

const INTERVALS = [
  { label: "Monthly", value: "monthly" },
  { label: "Daily", value: "daily" },
];

const getStyles = ({ theme }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundDefault,
      flex: 1,
    },
    scrollContainer: {
      padding: 15,
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
  });

const TrendScreen = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);
  const navigation_: NavigationProp<any> = useNavigation();

  const handleBackClick = () => {
    navigation_.goBack();
  };
  // const handleBackClick = useCallback(() => {
  //   () => {
  //     navigator.navigate("main");
  //   };
  // }, [navigation]);

  const handleProfileClick = useCallback(
    () => navigation.navigate("profile"),
    []
  );
  const handleSettingClick = useCallback(
    () => navigation.navigate("settings"),
    []
  );
  const handleLogoutClick = useCallback(
    () => navigation.navigate("profile"),
    []
  );

  const [interval, setInterval] = useState(INTERVALS[0].value);

  const [{ res: graphRes, loading }] = useApi({
    method: "get",
    path: `leaderboard/mobile/graph/${interval}`,
    executeOnMount: true,
  });
  const data = graphRes ? graphRes.data : {};
  const responseData = data.allSurveyResponsesGraph || [];
  const surveyData = formatSurveyGraphRes(responseData);
  const position = data.userRanking ? data.userRanking.pos : null;
  const showLoading = loading && Object.keys(data).length > 0;

  console.log("survey data ====> ", surveyData);

  const isMonthlyInterval = interval === "monthly";
  const labels = isMonthlyInterval ? monthList : dayList;
  const dataSet = isMonthlyInterval
    ? monthList.map((month) => Number(surveyData[month.toLowerCase()] || 0))
    : dayList.map((day) => Number(surveyData[day.toLocaleLowerCase()] || 0));
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
      <SecondaryHeader
        title="Trend"
        onBack={() => {
          handleBackClick();
        }}
        rightContent={
          <Avartar
            onProfileClick={handleProfileClick}
            onSettingClick={handleSettingClick}
            onLogoutClick={handleLogoutClick}
          />
        }
      />
      <TrendInterval
        intervals={INTERVALS}
        onChange={setInterval}
        value={interval}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LoadManager loading={showLoading}>
          <>
            <TrendGraph dataSet={dataSet} labels={labels} />
            {/* <Progress position={position} /> */}
          </>
        </LoadManager>
      </ScrollView>
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default TrendScreen;
