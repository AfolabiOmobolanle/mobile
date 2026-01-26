import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Button from "../common/button";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { token, useApi } from "../../services/api";
import { useStyleConfig } from "../../services/styles";
import { flattenSubmissionRes } from "../../utils/format";
import LoadManager from "../common/loadManager";
import SubmissonItem from "./item";

const getStyles = ({ theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
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

const Submissions = () => {
  const navigation: NavigationProp<any> = useNavigation();

  // const navigation: useNavigation<StackNavigationProp>();
  const styles = useStyleConfig(getStyles);
  const [draftSubmissions, setDraftSubmissions] = useState<any[]>([]);

  const [filteredSubmissions, setFilteredSubmissions] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<"submitted" | "draft">("submitted");

  const [surveyId, setSurveyId] = useState("");
  const [surveys, setSurveys] = useState([]);
  const [id, setId] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [submittedForms, setSubmittedForms] = useState([]);


// Fetch submitted forms from API
const fetchSubmittedForms = async () => {
  try {
    const response = await fetch(
      "https://core.eko360.ng/api/v1/data_collector/survey_response/getAll",
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    setSubmittedForms(data?.data?.allSurveyResponses || []);
  } catch (err) {
    console.error("ERROR FETCHING SUBMITTED FORMS:", err);
  }
};
const loadDrafts = async () => {
  try {
    const drafts = await AsyncStorage.getItem("surveyDraft");
    if (drafts) {
      const parsedDrafts = JSON.parse(drafts);
      setDraftSubmissions(Array.isArray(parsedDrafts) ? parsedDrafts : []);
    } else {
      setDraftSubmissions([]);
    }
  } catch (e) {
    console.log("Error loading drafts", e);
    setDraftSubmissions([]);
  }
};


  const [{ loading, res, error }] = useApi({
    path: "data_collector/survey_response/getAll",
    method: "get",
    executeOnMount: true,
  });
  // console.log(
  //   JSON.stringify(res?.data?.allSurveyResponses),
  //   "Survey responses.."
  // );
  const showSubmissionsLoading = !res && loading;
  const submissions = useMemo(
    () =>
      res && res.data && res.data.allSurveyResponses
        ? res.data.allSurveyResponses.map((item: any) => ({
            id: item.id,
            surveyId: item.surveyId,
            status: item.status,
            title: item.survey ? item.survey.name : "",
            date: moment(item.createdAt).format("MMM Do YY"),
            time: moment(item.createdAt).format("h:mm a"),
            response: flattenSubmissionRes(item.responses),
          }))
        : [],
    [res]
  );
  useEffect(() => {
  loadDrafts();
}, []);

  useEffect(() => {
  if (submissions.length > 0) {
    console.log(
      "SUBMISSION STATUSES:",
      submissions.map((s) => ({
        id: s.id,
        status: s.status,
      }))
    );
  }
}, [submissions]);

const displayedSubmissions = useMemo(() => {
  if (activeTab === "draft") {
    // Show drafts: use AsyncStorage drafts OR pending submissions
    return draftSubmissions.length > 0 
      ? draftSubmissions 
      : submissions.filter(
          (item) => item.status === "pending"
        );
  }

  // Show submitted: accepted, rejected (exclude pending)
  return submissions.filter(
    (item) => item.status !== "pending"
  );
}, [activeTab, submissions, draftSubmissions]);
  // console.log("submissions", submissions);
  // const section = route.params ? route.params.section : '';

  const handleGetSurveys = (item: any) => {
    setSurveyId("");
    setSurveys([]);
    setTimeout(() => {
      setSurveyId(item?.surveyId);
      setId(item?.id);
    }, 50);
  };

  const getResponse = async () => {
    setModalIsVisible(true);
    setIsLoading(true);
    // console.log(surveyId, "surveyId====");
    fetch(
      `https://core.eko360.ng/api/v1/data_collector/user/survey_response/getAllBySurveyId/${surveyId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        // setModalIsVisible(false);
        // console.log(response);
        if (!response?.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        setIsLoading(false);
        // setModalIsVisible(false);
        // console.log("Data:", JSON.stringify(data?.data), "Data is back"); // Use the data
        if (data?.data) {
          setSurveys(data?.data);
        }
      })
      .catch((error) => {
        setModalIsVisible(false);
        setIsLoading(false);
        console.error("Fetch error:", error);
      });
  };

  useEffect(() => {
    if (surveyId) {
      getResponse();
    }
  }, [surveyId]);
useEffect(() => {
  fetchSubmittedForms();
}, []);
  const renderSubmission = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleGetSurveys(item)}>
        <SubmissonItem {...item} />
      </TouchableOpacity>
    ),
    []
  );

  // useEffect(() => {
  //   if (submissions?.length > 0) {
  //     //remove duplicates
  //     const unique = Array.from(
  //       new Map(submissions.map((item) => [item.title, item])).values()
  //     );
  //     setFilteredSubmissions([...unique]);
  //   }
  // }, [submissions]);

  const handleEdit = useCallback(() => {
    console.log(navigation);
    setModalIsVisible(false);
    navigation.navigate("fillSurvey", { surveyId, responseId: id });
    // navigator.navigate("fillSurvey", { surveyId, responseId: id });
  }, [id, surveyId]);

  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
    <LoadManager
        loading={showSubmissionsLoading}
        empty={displayedSubmissions.length < 1}
        emptyMessage={activeTab === "draft" ? "No Drafts" : "No Submissions created so far"}
        error={!!error}
        errorMessage={error}
      >
        <FlatList
          data={displayedSubmissions}
          renderItem={renderSubmission}
          keyExtractor={(item) => `${item.id}`}
        />
      </LoadManager>
      {modalIsVisible && (
        <Modal
          isVisible={modalIsVisible}
          onBackButtonPress={() => setModalIsVisible(false)}
          onBackdropPress={() => setModalIsVisible(false)}
          // presentationStyle="fullScreen"
          scrollHorizontal
          style={modalStyles.modalPreview}
        >
          <ScrollView>
            <View style={{ marginTop: 50 }}>
              {isLoading && (
                <ActivityIndicator size={"large"} color={"#07A0AB"} />
              )}
              {surveys &&
                surveys?.map((field, index_) => {
                  return (
                    <View key={index_} style={{}}>
                      {field?.responses?.map((str: any, index: number) => {
                        const obj = JSON.parse(str);

                        // Step 2: Extract the key-value pair
                        const [key, value] = Object.entries(obj)[0];
                        let result: any;
                        if (Number(key) !== 0) {
                          result = [key?.replace(/-/g, " "), value];
                        } else {
                          const itemKey = Object.keys(value)[0];
                          result = [itemKey?.replace(/-/g, " ")];
                        }

                        return (
                          <View key={index} style={{}}>
                            {result[0] === "file" ? (
                              <View
                                style={{
                                  marginBottom: 10,
                                }}
                              >
                                <TouchableOpacity
                                  style={{ flexDirection: "row" }}
                                  onPress={() => {
                                    Linking.openURL(
                                      `https://core.eko360.ng/uploads/${result[1]}`
                                    );
                                  }}
                                >
                                  <Text>{index}: </Text>
                                  <Text
                                    style={{
                                      textDecorationLine: "underline",
                                      textDecorationColor: "blue",
                                      color: "blue",
                                    }}
                                  >
                                    Download
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View
                                style={{
                                  marginTop: 10,
                                  borderTopWidth: 1,
                                  borderTopColor: "#f2f2f2",
                                  paddingTop: 10,
                                }}
                              >
                                <Text style={modalStyles?.label}>
                                  {result[0]}
                                </Text>
                                {result[1] && (
                                  <Text>- {result[1] && result[1]}</Text>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
            </View>
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
              onPress={() => setModalIsVisible(false)}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const modalStyles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginBottom: 2,
    // textTransform: "capitalize",
  },
  modalPreview: {
    padding: 30,
    margin: 0,
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingTop: 50,
  },
});

export default Submissions;