import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import font from "../../config/font";
import { useApi } from "../../services/api";
import navigator from "../../services/navigation";
import { useStyleConfig } from "../../services/styles";
import { normalizeValue } from "../../utils/format";
import Button from "../common/button";
import { PreviewItem } from "../survey/preview";

const getStyles = ({ fontSize, theme }) =>
  StyleSheet.create({
    container: {
      marginBottom: 25,
      paddingHorizontal: 15,
    },
    title: {
      fontSize: fontSize.h3,
      color: theme.textDefault,
      fontFamily: font.regular,
    },
    description: {
      fontSize: fontSize.p,
      color: theme.textDefault,
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

interface SubmissonItemProps {
  title: String;
  date: String;
  type: String;
  time: String;
  response: object;
  id: Number;
  status: "pending" | "rejected" | "accepted";
  surveyId: Number;
}
const SubmissonItem: React.FC<SubmissonItemProps> = ({
  title,
  id,
  status,
  surveyId,
  date,
  type,
  time,
  response,
}) => {
  // console.log(response, "===+++=");
  const styles = useStyleConfig(getStyles);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const toggleModalVisibilty = useCallback(() => {
    setModalIsVisible((pState) => !pState);
  }, [setModalIsVisible]);

// Step 1: Make sure response exists and is an object
let parsedResponse: any = {};
let parsedFiles: string[] = [];

if (response) {
  if (typeof response === "string") {
    try {
      parsedResponse = JSON.parse(response);
    } catch (err) {
      console.warn("Failed to parse response string:", response);
      parsedResponse = {};
    }
  } else {
    parsedResponse = response;
  }

  // If response.files exists and is an array, use it
  if (parsedResponse.files && Array.isArray(parsedResponse.files)) {
    parsedFiles = parsedResponse.files;
  }
}


// Step 2: Safely extract name
const name =
  parsedResponse.fullname ||
  parsedResponse.full_name ||
  parsedResponse.name ||
  `${parsedResponse.firstname || parsedResponse.first_name || ""} ${
    parsedResponse.lastname || parsedResponse.last_name || ""
  }` ||
  "User"; // fallback

  const handleEdit = useCallback(() => {
    setModalIsVisible(false);
    navigator.navigate("fillSurvey", { surveyId, responseId: id });
  }, [id, surveyId]);

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

  const isAccepted = status === "accepted";
  const Wrapper = isAccepted ? View : TouchableOpacity;

  // console.log(fields, "fields");

  return (
    <>
      <View>
        <View style={{ ...styles.container, opacity: isAccepted ? 0.6 : 1 }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{title}</Text>
          <View style={styles.captionWrapper}>
            <Text style={styles.caption}>{date}</Text>
            <Text style={styles.caption}>{type}</Text>
            <Text style={styles.caption}>{time}</Text>
          </View>
        </View>
      </View>
      {modalIsVisible && (
        <Modal
          isVisible={modalIsVisible}
          onBackButtonPress={toggleModalVisibilty}
          onBackdropPress={toggleModalVisibilty}
          // presentationStyle="fullScreen"
          scrollHorizontal
          style={styles.modalPreview}
        >
          <ScrollView>
            <Text style={styles.title}>{title}</Text>
            <View style={{ marginTop: 50 }}>
{fields.map((field) => (
  <PreviewItem
    key={field.slug}
    label={field.label}
    type={field.type}
    value={normalizeValue(
      field.type === "file"
        ? parsedFiles.find((file) =>
            file.includes(field.label)
          ) || parsedFiles[0] || "No file"
        : parsedResponse[field.slug.toLowerCase()] || "N/A"
    )}
  />
))}


              ))}
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
              onPress={toggleModalVisibilty}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

export default SubmissonItem;
