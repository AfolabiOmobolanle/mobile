import React, { useCallback, useState } from "react";
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
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);

  const handleGetStorage = async () => {
    const surveys = await localStorage.getItem("surveyDraft");
    setDrafts([...surveys]);
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
  setIsLoading(true);
  try {
    const data = new FormData();

    data.append("surveyId", draft[0]["surveyId"]);
    data.append("name", draft[0]["name"]);
    data.append("responses", draft[0]?.responses);

    for (let a = 0; a < draft[0]?.fileFields?.length; a++) {
      const files = draft[0]?.fileFields[a]?.value || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file?.uri) {
          data.append("file", {
            uri: file.uri.startsWith("file://") ? file.uri : "file://" + file.uri,
            type: file.mimeType || "application/octet-stream",
            name: file.name || `file-${i}`,
          } as any); // cast for TS
        }
      }
    }

    let response = await fetch(
      `https://core.eko360.ng/api/v1/data_collector/survey_response/create`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          Accept: "application/json",
          // Don't set Content-Type manually
        },
        body: data,
      }
    );

    response = await response.json();
    setIsLoading(false);
    console.log(response, "--------");

    if (response?.data?.message === "Survey Response created successfully") {
      Alert.alert("Success", "Survey submitted successfully");
      const updatedDrafts = drafts.filter((_, inde) => inde !== index);
      await localStorage.removeItem("surveyDraft");
      await localStorage.setItem("surveyDraft", updatedDrafts);
      setDrafts(updatedDrafts);
    } else {
      const errorMessage =
        response?.data?.message || "Unable to submit response at this time";
      Alert.alert("Error", errorMessage);
    }
  } catch (e) {
    setIsLoading(false);
    console.log("error ON UPLOAD", e);
    Alert.alert("Error", "Failed to submit survey");
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
      <View style={styles.tab}>
        <TouchableOpacity
          onPress={() => {
            setIsActive("submitted");
            // handleGetStorage();
          }}
          style={[isActive === "submitted" ? styles.active : styles.notActive]}
        >
          <Text
            style={[isActive === "submitted" ? styles.label : styles.notLabel]}
          >
            Submitted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsActive("notsubmitted");
            handleGetStorage();
          }}
          style={[isActive !== "submitted" ? styles.active : styles.notActive]}
        >
          <Text
            style={[isActive !== "submitted" ? styles.label : styles.notLabel]}
          >
            Draft
          </Text>
        </TouchableOpacity>
      </View>
      {isActive === "submitted" ? (
        // <View style={{ marginTop: 20 }}>
        <Submissions />
      ) : (
        // </View>
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
              {drafts?.map((item, index) => {
                return (
                  <View style={styles.rowItem} key={index}>
                    <View>
                      <Text style={styles.row}>{item?.name}</Text>
                      <Text style={styles.date}>{item?.time}</Text>
                    </View>
                    <TouchableOpacity onPress={() => submit(index)}>
                      <Text style={styles.btn}>Submit now</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}

      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primaryDeep,
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
