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
        if (draft[0]?.fileFields[a]?.value) {
          for (let i = 0; i < draft[0]?.fileFields[a]?.value.length; i++) {
            // console.log("first", draft[0]?.fileFields[a]?.value[i]);
            data.append("file", {
              type: draft[0]?.fileFields[a]?.value[i]?.mimeType,
              name: draft[0]?.fileFields[a]?.value[i]?.name,
              uri: draft[0]?.fileFields[a]?.value[i]?.uri,
            });
            // data.append("file", draft[0]?.fileFields[a]?.value[i]);
          }
        }
      }

      let response = await fetch(
        `https://core.eko360.ng/api/v1/data_collector/survey_response/create`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      response = await response.json();
      console.log(response, "--------");
      setIsLoading(false);

      if (response?.data?.message !== "Survey Response created successfully") {
        //remove from draft
        const result = drafts?.filter((item, inde) => inde !== index);
        await localStorage.removeItem("surveyDraft");
        setDrafts([...result]);
        await localStorage.setItem("surveyDraft", result);
        Alert.alert("Successful", "Draft submitted submitted successfully");
      } else {
        const errorMessage = response?.data
          ? typeof response?.data?.message === "string"
            ? response?.data?.message
            : "Unable to submit response at this time"
          : null;
        Alert.alert("Error", errorMessage);
      }
    } catch (e) {
      setIsLoading(false);
      console.log("error ON UPLOAD", e);
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
