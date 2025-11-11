import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/common/button";
import HeaderGroup from "../components/common/headerGroup";
import SecondaryHeader from "../components/common/secondayHeader";
import { PreviewItem } from "../components/survey/preview";
import font from "../config/font";
import theme from "../config/theme";
import { MyNotificationContext } from "../context/notificationContext";
import { useApi } from "../services/api";
import navigator from "../services/navigation";
import { useStyleConfig } from "../services/styles";
import { flattenSubmissionRes, normalizeValue } from "../utils/format";
import { screenStyle } from "./styles";

const getStyles = ({ fontSize, theme }) =>
  StyleSheet.create({
    container: {
      paddingBottom: 25,
      paddingHorizontal: 20,
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
    title: {
      fontSize: fontSize.p + 5,
      color: theme.textSub,
      fontFamily: font.regular,
    },
    description: {
      fontSize: fontSize.p,
      color: theme.textSub,
      fontFamily: font.regular,
    },
    captionWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    caption: {
      textTransform: "uppercase",
      color: theme.textSub,
      fontSize: fontSize.p2,
      fontFamily: font.regular,
    },
    modalPreview: {
      padding: 30,
      margin: 0,
      width: "100%",
      flex: 1,
      backgroundColor: theme.backgroundDefault,
      justifyContent: "space-between",
      paddingTop: 50,
    },
  });

const NotificationScreen = ({ navigation, route }) => {
  // console.log(route.params?.surveyId);
  const { isNotification, setIsNotication } = useContext(MyNotificationContext);

  const isFocused = useIsFocused();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [surveyId, setSurveyId] = useState("");
  const [response, setResponse] = useState([]);
  const [responseId, setResponseId] = useState("");
  const toggleModalVisibilty = () => {
    setModalIsVisible(!modalIsVisible);
  };

  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const styles = useStyleConfig(getStyles);

  const [
    { loading: loadingResponse, res: result, error: responseError },
    fetchNotifications,
  ] = useApi({
    method: "get",
    path: `data_collector/survey_response/notifications`,
  });

  // const [
  //   { loading: loadingResponse_, res: result_, error: responseError_ },
  //   fetchNotifications_,
  // ] = useApi({
  //   method: "get",
  //   path: `data_collector/survey_response/notifications`,
  //   executeOnMount: isNotification,
  // });

  useEffect(() => {
    //go to the survey rejected
    // if (route?.params?.name) {
    //   setTitle(route?.params?.name);
    //   setSurveyId(route?.params?.surveyId);
    //   setResponseId(route?.params?.surveyId);
    //   setResponse(route?.params?.fields);
    //   toggleModalVisibilty();
    // }
  }, [isFocused]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    //refetch notifications when available
    if (isNotification) {
      console.log("new notification");
      // fetchNotifications_();
      setIsNotication(false);
    }
  }, [isNotification]);

  const notifications = result && result?.data?.getRejectedResponses;
  // const notifications_ = result_ && result_?.data?.getRejectedResponses;

  // console.log(JSON.stringify(notifications), "----");

  const handleEdit = useCallback(() => {
    setModalIsVisible(false);
    navigator.navigate("fillSurvey", { surveyId, responseId });
  }, [responseId, surveyId]);

  const NotificationItem = ({
    name,
    slug,
    createdAt,
    status,
    surveyId,
    id,
    feedback,
    comment,
  }) => {
    const styles = useStyleConfig(getStyles);

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setTitle(name);
          setSurveyId(surveyId);
          setResponseId(id);
          setResponse(flattenSubmissionRes(feedback));
          toggleModalVisibilty();
        }}
      >
        <View style={styles.captionWrapper}>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            {/* <Text style={styles.description}>{slug}</Text> */}
          </View>
        </View>

        <View style={styles.captionWrapper}>
          <Text style={styles.caption}>
            {moment(createdAt).format("MMM Do YYYY")}
          </Text>
          <Text style={styles.caption}>
            {moment(createdAt).format("h:mm:ss a")}
          </Text>
          <Text
            style={{
              color: status === "rejected" ? "red" : "black",
              textTransform: "capitalize",
            }}
          >
            {status}
          </Text>
        </View>
        <View>
          <Text style={{ paddingTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Reason: </Text> {comment}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [{ loading: loadingSurvey, res: surveyResponse, error: surveyError }] =
    useApi({
      method: "get",
      path: `admin/survey/getOne/${surveyId}`,
      executeOnMount: true,
    });
  const fields =
    surveyResponse && surveyResponse.data
      ? surveyResponse.data.survey_fields
      : [];

  // useEffect(() => {
  //   if (route.params?.surveyId) {
  //     setSurveyId(route.params?.surveyId);
  //   }
  // }, []);

  return (
    <SafeAreaView style={screenStyle}>
      <SecondaryHeader
        title="Notifications"
        onBack={handleBackPress}
        style={{ elevation: 0 }}
        rightContent={<HeaderGroup navigation={navigation} />}
      />
      {/* <ScrollView contentContainerStyle={styles.container}> */}
      <FlatList
        data={
          // notifications_?.length > notifications?.length
          //   ? notifications_
          //   :
          notifications
        }
        // keyExtractor={(item, index) => item}
        renderItem={({ item }) => {
          return (
            item?.surveyId && (
              <NotificationItem
                status={item?.status}
                createdAt={item?.createdAt}
                name={item?.survey?.name}
                slug={item?.survey?.slug}
                surveyId={item?.surveyId}
                id={item?.id}
                feedback={item?.responses}
                comment={item?.comment}
              />
            )
          );
        }}
      />
      {/* </ScrollView> */}
      {modalIsVisible && (
        <Modal
          isVisible={modalIsVisible}
          onBackButtonPress={toggleModalVisibilty}
          onBackdropPress={toggleModalVisibilty}
          // presentationStyle="fullScreen"
          scrollHorizontal
          style={styles.modalPreview}
        >
          <SafeAreaView>
            <View
              style={{
                padding: 30,
                margin: 0,
                width: "100%",
                height: "100%",
                // flex: 1,
                backgroundColor: theme.backgroundDefault,
                // justifyContent: "space-between",
                paddingTop: 50,
              }}
            >
              <ScrollView>
                <Text style={styles.title}>{title}</Text>
                {route?.params?.fields ? (
                  <View style={{ marginTop: 50 }}>
                    {route?.params?.fields.map((field) => (
                      <PreviewItem
                        key={field.slug}
                        label={field.label}
                        type={field.type}
                        // value={normalizeValue(
                        //   field.type === "file"
                        //     ? response.files.filter((file) =>
                        //         file.includes(field.label)
                        //       )[0] || response.files[0]
                        //     : response[field.slug.toLowerCase()]
                        // )}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={{ marginTop: 50 }}>
                    {fields.map((field) => (
                      <PreviewItem
                        key={field.slug}
                        label={field.label}
                        type={field.type}
                        value={normalizeValue(
                          field.type === "file"
                            ? response.files.filter((file) =>
                                file.includes(field.label)
                              )[0] || response.files[0]
                            : response[field.slug.toLowerCase()]
                        )}
                      />
                    ))}
                  </View>
                )}
                {/* <View style={{ marginTop: 50 }}>
                  {fields.map((field) => (
                    <PreviewItem
                      key={field.slug}
                      label={field.label}
                      type={field.type}
                      value={normalizeValue(
                        field.type === "file"
                          ? response.files.filter((file) =>
                              file.includes(field.label)
                            )[0] || response.files[0]
                          : response[field.slug.toLowerCase()]
                      )}
                    />
                  ))}
                </View> */}
              </ScrollView>
              <View>
                <Button
                  title="Edit"
                  style={{ marginBottom: 20 }}
                  onPress={handleEdit}
                />
                <Button
                  title="Close"
                  type="secondary"
                  onPress={toggleModalVisibilty}
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
