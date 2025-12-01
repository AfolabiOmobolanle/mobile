import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PrimaryHeader from "../../components/common/header";
import HeaderGroup from "../../components/common/headerGroup";
import Submissions from "../../components/submission";
import colors from "../../config/colors";
import { screenStyle } from "../styles";
// import { UserActivityContext } from "../../services/userActivity";
import { token } from "../../services/api";
import { useAuth } from "../../services/auth";
import localStorage from "../../services/storage";
// import UserInactivity from "react-native-user-inactivity";


const SubmissionScreen = ({ navigation }) => {
  // const { active, setActive, timer } = useContext(UserActivityContext);
  const { clearAuth } = useAuth();
  const [isActive, setIsActive] = useState("submitted");
  const [submittedForms, setSubmittedForms] = useState<any[]>([]);
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
const flattenSubmissionRes = (responses: any) => {
  if (!responses) return {};

  let parsedResponses: any[] = [];

  try {
    if (typeof responses === "string") {
      parsedResponses = JSON.parse(responses); // parse stringified array
    } else if (Array.isArray(responses)) {
      parsedResponses = responses;
    }
  } catch (e) {
    console.warn("Failed to parse responses", responses, e);
    return {};
  }

  return parsedResponses.reduce((acc: any, resp: any) => {
    try {
      const parsed = typeof resp === "string" ? JSON.parse(resp) : resp;
      return { ...acc, ...parsed };
    } catch (e) {
      console.warn("Failed to parse individual response", resp, e);
      return acc;
    }
  }, {});
};

const fetchSubmittedForms = async () => {
  try {
    setIsLoading(true);
    let allResponses: any[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `https://core.eko360.ng/api/v1/data_collector/survey_response/getAll?page=${currentPage}`,
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

      allResponses = allResponses.concat(data?.data?.allSurveyResponses || []);
      totalPages = data?.data?.pages || 1;
      currentPage++;
    } while (currentPage <= totalPages);

    const mapped = allResponses
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((item: any) => ({
        id: item.id,
        surveyId: item.surveyId,
        status: item.status,
        title: item.survey?.name || "",
        date: moment(item.createdAt).format("MMM Do YY"),
        time: moment(item.createdAt).format("h:mm a"),
        response: flattenSubmissionRes(item.responses),
      }));

    setSubmittedForms(mapped);
  } catch (err) {
    console.error("Error fetching submitted forms:", err);
  } finally {
    setIsLoading(false);
  }
};



const handleGetStorage = async () => {
  const surveys = await localStorage.getItem("surveyDraft");
  if (!Array.isArray(surveys)) return setDrafts([]);

  // Filter surveys that belong to the current user
  const allowedSurveys = surveys.filter((survey) => survey.isAssigned);
  setDrafts(allowedSurveys);
};

  const submit = (index: number) => {
    const result = drafts?.filter((item, inde) => inde === index);
    Alert.alert(
      "Submit now",
      "Are you sure you want to submit this survey now?",
      [
        { text: "No", onPress: () => console.log("No") },
        { text: "Yes", onPress: () => handleSubmit(result, index) },
      ]
    );
  };

const handleSubmit = async (draft: any, index: number) => {
    if (!draft[0].isAssigned) {
    Alert.alert("Cannot Submit", "This survey is not assigned to you.");
    return;
  }
  setIsLoading(true);

  try {
    const data = new FormData();
    data.append("surveyId", draft[0].surveyId);
    data.append("name", draft[0].name);

    let formattedResponses = draft[0].responses;
    if (typeof formattedResponses === "string") {
      formattedResponses = JSON.parse(formattedResponses);
    }
    if (!Array.isArray(formattedResponses)) {
      formattedResponses = Object.keys(formattedResponses || {}).map(key => ({
        questionId: key,
        answer: formattedResponses[key],
      }));
    }
    data.append("responses", JSON.stringify(formattedResponses));

    // Files
    for (let a = 0; a < (draft[0]?.fileFields?.length || 0); a++) {
      const files = draft[0]?.fileFields[a]?.value || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file?.uri) {
          data.append("file", {
            uri: file.uri.startsWith("file://") ? file.uri : "file://" + file.uri,
            type: file.mimeType || "application/octet-stream",
            name: file.name || `file-${i}`,
          } as any);
        }
      }
    }

    // Submit safely
    const response = await fetch(
      "https://core.eko360.ng/api/v1/data_collector/survey_response/create",
      {
        method: "POST",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
        body: data,
      }
    );

    const responseText = await response.text();
    let json;
    try {
      json = JSON.parse(responseText);
    } catch {
      json = null;
    }

    if (!response.ok) {
      // Handle 401 separately
      if (response.status === 401) {
        Alert.alert("Unauthorized", json?.message || "Survey is not assigned to you.");
      } else {
        Alert.alert("Error", json?.message || "Failed to submit survey.");
      }
      console.error("Submit failed:", response.status, responseText);
      return;
    }

    console.log("---- SUBMIT RESULT ----", json);

    if (json?.status === "success") {
      Alert.alert("Success", "Survey submitted successfully");
      const updatedDrafts = drafts.filter((_, inde) => inde !== index);
      await localStorage.removeItem("surveyDraft");
      await localStorage.setItem("surveyDraft", updatedDrafts);
      setDrafts(updatedDrafts);
      await fetchSubmittedForms();
    } else {
      Alert.alert("Error", json?.message || "Failed to submit survey");
    }

  } catch (err) {
    console.error("Submit failed:", err);
    Alert.alert("Error", "Something went wrong while submitting.");
  } finally {
    setIsLoading(false);
  }
};



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
    title="Submissions"
    rightContent={<HeaderGroup navigation={navigation} />}
  />

  {/* Tab Buttons */}
  <View style={styles.tab}>
    <TouchableOpacity
      onPress={() => {
        setIsActive("submitted");
        // Refresh submitted forms when user switches to Submitted tab
        fetchSubmittedForms();
      }}
      style={[isActive === "submitted" ? styles.active : styles.notActive]}
    >
      <Text style={[isActive === "submitted" ? styles.label : styles.notLabel]}>
        Submitted
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setIsActive("notsubmitted");
        handleGetStorage(); // load drafts
      }}
      style={[isActive !== "submitted" ? styles.active : styles.notActive]}
    >
      <Text style={[isActive !== "submitted" ? styles.label : styles.notLabel]}>
        Draft
      </Text>
    </TouchableOpacity>
  </View>

  {/* Tab Content */}
  {isActive === "submitted" ? (
    <Submissions submittedForms={submittedForms} />

  ) : (
    <View style={{ paddingTop: 20, backgroundColor: "white", flex: 1 }}>
      {isLoading ? (
        <Text
          style={{
            color: colors.primary,
            fontSize: 18,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          Please wait... Submitting draft
        </Text>
      ) : (
        <ScrollView>
          {drafts?.map((item, index) => (
            <View style={styles.rowItem} key={index}>
              <View>
                <Text style={styles.row}>{item?.name}</Text>
                <Text style={styles.date}>{item?.time}</Text>
              </View>
            <TouchableOpacity
  onPress={() => submit(index)}
  disabled={!item.isAssigned} // disable if not assigned
  style={[
    styles.btn,
    !item.isAssigned && { backgroundColor: "#ccc" } 
  ]}
>
  <Text style={{ color: "white" }}>
    {item.isAssigned ? "Submit now" : "Not allowed"}
  </Text>
</TouchableOpacity>

            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )}
  {/* </UserInactivity> */}
</SafeAreaView>
  )
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    padding: 2,
    paddingHorizontal: 7,
    color: "white",
    borderRadius: 5,
    verticalAlign: "middle",
  },
  rowItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingVertical: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 24,
    alignItems: "center",
  },
  row: {
    paddingHorizontal: 24,
    // marginVertical: 10,
  },
  date: {
    color: "gray",
    paddingHorizontal: 24,
    fontSize: 12,
  },
  active: {
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    // marginRight: 10,
    width: "45%",
  },
  notActive: {
    width: "45%",
    // backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    // marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tab: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: "white",
    alignItems: "center",
  },
  label: {
    fontWeight: "400",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  notLabel: {
    fontWeight: "400",
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
  },
});
export default SubmissionScreen;
