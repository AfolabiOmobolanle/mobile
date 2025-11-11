import React, { useCallback, useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryHeader from "../../components/common/header";
import { screenStyle } from "../styles";
import font from "../../config/font";
import { useStyleConfig } from "../../services/styles";
import colors from "../../config/colors";
import Button from "../../components/common/button";
import ProgressBar from "../../components/common/progressBar";
import HeaderGroup from "../../components/common/headerGroup";
import { useAuth } from "../../services/auth";
import { useApi } from "../../services/api";
import LoadManager from "../../components/common/loadManager";
// import UserInactivity from "react-native-user-inactivity";
// import { UserActivityContext } from "../../services/userActivity";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    screen: {
      ...screenStyle,
      backgroundColor: theme.backgroundDefault,
    },
    container: {
      padding: 15,
      paddingBottom: 0,
      backgroundColor: theme.backgroundDefault,
    },
    headline: {
      fontFamily: font.regular,
      marginBottom: 10,
      color: theme.textDefault,
      fontSize: fontSize.p,
    },
    welcomeText: {
      fontSize: fontSize.p1,
      fontFamily: font.regular,
      color: theme.textDefault,
    },
    cardWrapper: {
      flexDirection: "row",
    },
    card: {
      height: 120,
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: "center",
      marginRight: 15,
      alignItems: "center",
      marginVertical: 30,
      width: "80%",
    },
    cardNumber: {
      fontFamily: font.regular,
      fontSize: fontSize.h1,
      marginBottom: -13,
      color: colors.white,
      margin: 0,
    },
    cardText: {
      fontFamily: font.regular,
      fontSize: fontSize.p2,
      color: colors.white,
      margin: 0,
    },
    leaderBoard: {
      marginTop: 20,
      padding: 15,
      borderColor: theme.textCaption,
      borderWidth: 1,
      borderRadius: 5,
    },
    leaderBoardHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      flexWrap: "wrap",
    },
    leaderBoardTitle: {
      fontFamily: font.bold,
      fontSize: fontSize.p1,
      color: theme.textDefault,
    },
    lItem: {
      flexDirection: "row",
      minHeight: 100,
      borderRadius: 10,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.textCaption,
      marginBottom: 15,
    },
    lItemIndicator: {
      width: 15,
      backgroundColor: colors.accent,
    },
    lItemContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
      flex: 1,
    },
    lItemNo: {
      fontSize: fontSize.h2,
      fontWeight: "bold",
      color: theme.textDefault,
    },
    lItemUser: {
      flex: 1,
      paddingLeft: 15,
      flexDirection: "row",
    },
    lItemName: {
      fontSize: fontSize.p,
      color: theme.textDefault,
    },
    lItemCaption: {
      color: theme.textCaption,
      fontSize: fontSize.p,
    },
    lItemAvartar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#26262621",
    },
    progressWrapper: {
      width: 100,
      justifyContent: "center",
      paddingRight: 10,
    },
    progressLabel: {
      color: theme.textDefault,
    },
  });

interface cardProps {
  label: String;
  count: String | Number;
}
const Card: React.FC<cardProps> = ({ label, count }) => {
  const styles = useStyleConfig(getStyles);
  return (
    <View style={styles.card}>
      <Text style={styles.cardNumber}>{count}</Text>
      <Text style={styles.cardText}>{label}</Text>
    </View>
  );
};

const LeaderBoardItem = ({ rank, user, submissions }) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={styles.lItem}>
      <View style={styles.lItemIndicator} />
      <View style={styles.lItemContent}>
        <Text style={styles.lItemNo}>{rank}</Text>
        <View style={styles.lItemUser}>
          {/* <View style={styles.lItemAvartar} /> */}
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.lItemName}>{user}</Text>
            <Text style={styles.lItemCaption}>{submissions} Submissions</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressWrapper}>
        {/* <Text style={styles.progressLabel}>Progress</Text>
        <ProgressBar
          progress={60}
          style={{ height: 3, marginVertical: 5 }}
          innerStyle={{ backgroundColor: colors.accent }}
        /> */}
        {/* <ProgressBar progress={60} style={{ height: 3 }} /> */}
      </View>
    </View>
  );
};

const LeaderBoard = ({ onGotoTrend, data = [] }) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={styles.leaderBoard}>
      <View style={styles.leaderBoardHead}>
        <Text style={styles.leaderBoardTitle}>Leaderboard Summary</Text>
        <Button title="See Trend Graph" onPress={onGotoTrend} />
      </View>
      {data.map((datum) => (
        <LeaderBoardItem
          key={datum["user.full_name"]}
          rank={datum.pos}
          user={datum["user.full_name"]}
          submissions={datum.count}
        />
      ))}
    </View>
  );
};

const LeaderBoardScreen = ({ navigation }) => {
  // const { active, setActive, timer } = useContext(UserActivityContext);

  const styles = useStyleConfig(getStyles);
  const handleGotoTrend = useCallback(() => navigation.navigate("trend"), []);

  // const {} = UserActivityContext;

  const { auth, clearAuth } = useAuth();
  const user = auth ? auth.user : {};
  const username = user.full_name;

  const [{ loading: loadingMetric, res: metricRes }] = useApi({
    method: "get",
    path: "leaderboard/mobile/summary",
    executeOnMount: true,
  });

  const metrics = metricRes ? metricRes.data : {};
  const showMetricLoading = !metricRes && loadingMetric;
  const leaderboard = metrics ? metrics.usersAndRankings : [];

  //

  // useEffect(() => {
  //   setActive(true);
  // }, []);

  // useEffect(() => {
  //   if (!active) {
  //     clearAuth();
  //   }
  // }, [active]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <PrimaryHeader
        title={`Hi ${username}`}
        style={{ elevation: 0, paddingTop: 15 }}
        rightContent={<HeaderGroup navigation={navigation} />}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headline}>Welcome</Text>
        <Text style={styles.welcomeText}>
          Hi {username}, this is how you are fairing in your submissions so far.
          The leaderboard shows your previous submision frequency. Take a look.
        </Text>
        <LoadManager loading={showMetricLoading}>
          <>
            <View style={styles.cardWrapper}>
              <Card
                label="Ranking"
                count={metrics.userRanking ? metrics.userRanking.rank : 0}
              />
              <Card
                label="Submission"
                count={metrics.userRanking ? metrics.userRanking.count : 0}
              />
              <Card label="Access Level" count={metrics.userAccessLevel} />
            </View>
            <LeaderBoard data={leaderboard} onGotoTrend={handleGotoTrend} />
          </>
        </LoadManager>
      </ScrollView>
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default LeaderBoardScreen;
