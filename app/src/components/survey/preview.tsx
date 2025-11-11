import React, { useCallback, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "../../components/common/button";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import config from "../../../config";
import font from "../../config/font";
import { useSurveyFormContext } from "../../context/surveyFormContext";
import { token, useApi } from "../../services/api";
import navigator from "../../services/navigation";
import { useScreenLoader } from "../../services/screenLoader";
import localStorage from "../../services/storage";
import { useStyleConfig } from "../../services/styles";
import { formatValueToText } from "../../utils/format";
import SubmissionStatus from "./status";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    scrollContainer: {
      flex: 1,
    },
    item: {
      marginBottom: 20,
    },
    itemLabel: {
      fontFamily: font.regular,
      color: theme.textDefault,
      fontSize: fontSize.p,
      textTransform: "capitalize",
    },
    itemValue: {
      color: theme.textSub,
      fontSize: fontSize.p,
      opacity: 0.8,
      textTransform: "capitalize",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    text: {
      color: theme.textDefault,
      textAlign: "center",
      padding: 20,
    },
  });

interface ItemProps {
  label: String;
  value: string;
  type?: string;
}
const Item: React.FC<ItemProps> = ({ label, value, type }) => {
  const styles = useStyleConfig(getStyles);
  const isFile = type === "file";

  const loader = useScreenLoader();

  const downloadFile = () => {
    console.log(value, "Values");
    const fileName = value?.substr(value?.lastIndexOf("/") + 1);
    const fileUrl = `${config.API_URL}/${fileName}`;
    Linking.openURL(fileUrl);
  };

  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text
        onPress={() => isFile && downloadFile()}
        style={{
          marginTop: 5,
          ...styles.itemValue,
          ...(isFile && { color: "blue", textDecorationLine: "underline" }),
        }}
      >
        {isFile ? "Download" : typeof value === "string" ? value : "N/A"}
      </Text>
    </View>
  );
};
export const PreviewItem = Item;

interface PreviewSurveyProps {
  onConfirmSuccess: () => void;
  onCancel: () => void;
}
const PreviewSurvey: React.FC<PreviewSurveyProps> = ({
  onConfirmSuccess,
  onCancel,
}) => {
  const navigation_: NavigationProp<any> = useNavigation();

  const styles = useStyleConfig(getStyles);
  const {
    fieldValues = [],
    saveFieldValues,
    editedSurvey,
    setEditedSurvey,
  } = useSurveyFormContext();

  const isEdit = !!editedSurvey.responseId;
  const [{ loading }, submitSurveyResponse] = useApi({
    method: isEdit ? "put" : "post",
    path: isEdit
      ? `data_collector/survey_response/update/${editedSurvey.responseId}`
      : "data_collector/survey_response/create",
  });

  const loader = useScreenLoader();

  const [statusModalState, setStatusModalState] = useState({
    status: "success",
    errorMessage: null,
    isVisible: false,
  });
  const toggleStatusModalVisibility = useCallback(
    (status?, errorMessage?) =>
      setStatusModalState((pState) => ({
        status,
        errorMessage,
        isVisible: !pState.isVisible,
      })),
    []
  );
  const handleBack = useCallback(() => {
    toggleStatusModalVisibility();
    navigation_.goBack();
    navigator.goBack();
  }, [toggleStatusModalVisibility, navigator]);

  const handleNext = () => {
    navigation_.navigate("main");
  };

  const handleReset = useCallback(() => {
    saveFieldValues([]);
    setEditedSurvey({});
    navigator.navigate("survey");
  }, []);
  // loader.hide();

  const saveDraft = async () => {
    loader.show();
    console.log("Yes...");
    const isFile = (field: any) => field.type === "file";
    const fileFields = fieldValues.filter((field: any) => isFile(field));
    const responses = fieldValues.map((field: any) => ({
      [field.slug]: isFile(field) ? "" : field.value,
    }));

    const data = {
      surveyId: editedSurvey.id,
      name: editedSurvey.name,
      responses: JSON.stringify(responses),
      fileFields,
      time: new Date().toDateString(),
    };
    try {
      const surveys = await localStorage.getItem("surveyDraft");
      if (surveys) {
        const allSurveys = [data, ...surveys];
        await localStorage.setItem("surveyDraft", allSurveys);
      } else {
        const allSurveys = [data];
        await localStorage.setItem("surveyDraft", allSurveys);
      }
      console.log("Completed...");

      loader.hide();
      // onCancel();
      navigation_.navigate("main");
    } catch (error) {
      console.log("Imcomplete", error);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      loader.show();
      console.log(token, "token");

      const isFile = (field: any) => field.type === "file";
      const fileFields = fieldValues.filter((field: any) => isFile(field));
      const notFileFields = fieldValues.filter((field: any) => !isFile(field));

      const responses = fieldValues.map((field: any) => ({
        [field.slug]: isFile(field) ? "" : field.value,
      }));
      console.log("responses...", JSON.stringify(responses), editedSurvey);

      const data = new FormData();
      data.append("surveyId", editedSurvey.id);
      data.append("name", editedSurvey.name);
      data.append("responses", JSON.stringify(responses));
      // const file = fileFields.length ? fileFields[0].value : null;
      // console.log(JSON.stringify(fileFields[0]?.value[0]), "fileFields");
      // console.log(JSON.stringify(fileFields[1]?.value), "fileFields");
      // return;

      for (let index = 0; index < fileFields?.length; index++) {
        if (fileFields[index]?.value) {
          for (let i = 0; i < fileFields[index]?.value.length; i++) {
            data.append("file", {
              type: fileFields[index]?.value[i]?.mimeType,
              name: fileFields[index]?.value[i]?.name,
              uri: fileFields[index]?.value[i]?.uri,
            });
            // data.append("file", fileFields[index]?.value[i]);
          }

          // data.append("file", fileFields[index]?.value[1]);
        }
      }
      // fileFields?.value.forEach((file, index) => {
      //   const realFile = file?.value;
      //   const fileExtension = getExtension(file.value.name);
      //   const type = fileExtensionTypeMapping[fileExtension];
      //   const fileName = `${file.label}_${file.value.name}`;
      //   // const fileName = `${file.label}.${getExtension(file.value.name)}`;
      //   if (realFile[index]?.file) {
      //     data.append("file", file[index]?.file);
      //   }
      //   if (realFile[index]?.uri) {
      //     data.append("file", file[index]?.uri);
      //   }
      //   // if (realFile.file || realFile.uri) {
      //   //   data.append(
      //   //     "file",
      //   //     realFile.file || {
      //   //       uri: realFile.uri,
      //   //       type,
      //   //       name: fileName,
      //   //     }
      //   //   );
      //   // }
      // });

      // console.log(JSON.stringify(data));

      const response = await fetch(
        isEdit
          ? `https://core.eko360.ng/api/v1/data_collector/survey_response/update/${editedSurvey.responseId}`
          : "https://core.eko360.ng/api/v1/data_collector/survey_response/create",
        {
          method: isEdit ? "put" : "post",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      const res = await response.json();

      console.log(res, "response is here");

      // return;

      // const res = await submitSurveyResponse(data, {
      //   headers: { "content-type": "multipart/form-data" },
      // });
      loader.hide();

      if (response?.ok) {
        toggleStatusModalVisibility("success");
      }
    } catch (e) {
      console.log("error ON UPLOAD", e);
      loader.hide();
      toggleStatusModalVisibility("error", "Error during submission");
    }
  }, [fieldValues]);

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      <SubmissionStatus
        {...statusModalState}
        onBack={handleBack}
        onNext={handleNext}
        onReset={handleReset}
      />
      <ScrollView style={styles.scrollContainer}>
        {fieldValues.map((field: any) => (
          <Item
            key={field.slug}
            label={field.label}
            value={formatValueToText(field.type, field.value)}
          />
        ))}
      </ScrollView>
      <View style={{ paddingBottom: 10 }} />

      <View style={styles.buttonContainer}>
        <Button
          title={"Save as draft"}
          type="secondary"
          onPress={() => saveDraft()}
        />
        <Button
          title={
            loading
              ? isEdit
                ? "Updating ..."
                : "Submitting ..."
              : isEdit
              ? "Update"
              : "Submit"
          }
          style={{ marginLeft: 15 }}
          onPress={handleSubmit}
        />
      </View>

      {/*  */}
      <View style={{ paddingBottom: 100 }} />
    </ScrollView>
  );
};

export default PreviewSurvey;
