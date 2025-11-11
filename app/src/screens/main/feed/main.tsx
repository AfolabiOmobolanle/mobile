import React, { useCallback, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import PrimaryHeader from "../../../components/common/header";
import Feeds from "../../../components/feed";

import { screenStyle } from "../../styles";
import { FEEDS } from "../../../mock/feed";
import HeaderGroup from "../../../components/common/headerGroup";
import { useAuth } from "../../../services/auth";
// import { UserActivityContext } from "../../../services/userActivity";
// import UserInactivity from "react-native-user-inactivity";

interface FeedScreenProps {
  navigation: StackNavigationProp<{}>;
}
const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const handleFeedClick = useCallback(() => navigation.navigate("survey"), []);
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
    <SafeAreaView style={screenStyle}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <PrimaryHeader
        title="Health"
        rightContent={<HeaderGroup navigation={navigation} />}
      />
      <Feeds feeds={FEEDS} onFeedClick={handleFeedClick} />
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default FeedScreen;
