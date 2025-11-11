import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
// import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { screenStyle } from "../../styles";
import HeaderGroup from "../../../components/common/headerGroup";
import SecondaryHeader from "../../../components/common/secondayHeader";
import PrimaryHeader from "../../../components/common/header";
import SurveyList from "../../../components/survey/list";
import { SURVEYS } from "../../../mock/survey";
import { useApi } from "../../../services/api";
import LoadManager from "../../../components/common/loadManager";
import { useStyleConfig } from "../../../services/styles";
// import UserInactivity from "react-native-user-inactivity";
import { useAuth } from "../../../services/auth";
// import { UserActivityContext } from "../../../services/userActivity";
import { MyNotificationContext } from "../../../context/notificationContext";
import { useIsFocused } from "@react-navigation/native";
const getStyle = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
  });

interface SurveyScreenProps {
  navigation: StackNavigationProp<{}>;
}
const SurveyScreen: React.FC<SurveyScreenProps> = ({ navigation }) => {
  const { isNotification, setIsNotication } = useContext(MyNotificationContext);

  const [survey_id, setSurvey_id] = useState("");
  const [{ loading, res }] = useApi({
    method: "get",
    path: "data_collector/survey_response/survey/getAll",
    executeOnMount: true,
  });
  const showLoading = !res && loading;

  const handleSurveyPress = useCallback(
    (id) => navigation.navigate("fillSurvey", { surveyId: id }),
    []
  );

  // console.log(JSON.stringify(res));

  const surveys = useMemo(
    () =>
      res && res.data && res.data.allSurveys
        ? res.data.allSurveys.map((sur) => ({
            id: sur.id,
            title: sur.name,
            filled: sur.filled,
            date: moment(sur.createdAt).format("MMM Do YY"),
            time: moment(sur.createdAt).format("h:mm a"),
          }))
        : [],
    [res]
  );
  // const { active, setActive, timer } = useContext(UserActivityContext);

  const style = useStyleConfig(getStyle);
  const { auth, clearAuth } = useAuth();

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       console.log("Failed to get push token for push notification!");
  //       return;
  //     }
  //     token = (
  //       await Notifications.getExpoPushTokenAsync({
  //         projectId: "com.eko.eko360",
  //       })
  //     ).data;
  //     console.log(token);
  //     Alert.alert("token", JSON.stringify(token));
  //   } else {
  //     console.log("Must use physical device for Push Notifications");
  //   }

  //   return token;
  // }

  async function registerForPushNotificationsAsync() {
    let token: string | undefined;

    if (Device.isDevice) {
      console.log("hhhhh");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        console.log("Not granted.....");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log("Not granted.....", existingStatus);

      if (finalStatus !== "granted") {
        console.log("Failed to get push token permission");
        return;
      }
      console.log("Permission status:", finalStatus);

      const response = await Notifications.getExpoPushTokenAsync({
        projectId: "com.lbseko360",
      });
      console.log(response, "response");
      token = response.data;
      console.log("Expo Push Token:n,,,", token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [userToken, setToken] = useState("");
  const isFucused = useIsFocused();

  useEffect(() => {
    if (Device.isDevice) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setToken(token);
        setExpoPushToken(token);
        console.log("Device push token,,,:", token);
      }
    });
  }, [isFucused]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          "New Notification",
          "You have a new notification for the survey you submitted"
        );
        console.log("Notification received:", notification);
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        Alert.alert(
          "New Notification",
          "You have a new notification for the survey you submitted"
        );
        console.log("Notification response:", response);
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const [{ loading: loadingSurvey, res: surveyResponse, error: surveyError }] =
    useApi({
      method: "get",
      path: `admin/survey/getOne/${survey_id}`,
      executeOnMount: survey_id ? true : false,
    });

  const submitToken = useCallback(async () => {
    let data = {
      deviceToken: userToken,
      userId: auth?.user?.id,
    };
    let response = await fetch(
      `https://core.eko360.ng/api/v1/firebase/userToken`,
      {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          Authorization: auth?.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    response = await response.json();
    console.log(response, "response is here");
  }, [userToken]);

  useEffect(() => {
    submitToken();
  }, [submitToken]);

  useEffect(() => {
    if (userToken) {
      submitToken();
    }
  }, []);

  // console.log(JSON.stringify(surveyResponse), "surveyError", survey_id);

  useEffect(() => {
    if (surveyResponse && survey_id) {
      const fields =
        surveyResponse && surveyResponse.data
          ? surveyResponse.data.survey_fields
          : [];
      let name = surveyResponse?.data?.name;
      let surveyId = surveyResponse?.data?.id;
      setSurvey_id("");

      //     // console.log(JSON.stringify(fields), "survey fields---");
      if (name && surveyId) {
        setIsNotication(true);
        navigation.navigate("notifications", { surveyId, fields, name });
      }
    }
  }, [surveyResponse, survey_id]);

  // useEffect(() => {
  //   setActive(true);
  // }, []);

  // useEffect(() => {
  //   if (!active) {
  //     clearAuth();
  //   }
  // }, [active]);

  return (
    <SafeAreaView style={style.container}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <PrimaryHeader
        title="Surveys"
        rightContent={<HeaderGroup navigation={navigation} isHome={true} />}
      />
      <LoadManager
        loading={showLoading}
        empty={!surveys.length}
        emptyMessage="No Survey Assigned"
      >
        <SurveyList surveys={surveys} onSurveyClick={handleSurveyPress} />
      </LoadManager>
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default SurveyScreen;
