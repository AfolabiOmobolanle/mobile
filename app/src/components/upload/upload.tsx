import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import { SafeAreaViewComponent } from "react-native";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useApi } from "../../services/api";
import { useAuth } from "../../services/auth";
import { useScreenLoader } from "../../services/screenLoader";
import { useStyleConfig } from "../../services/styles";
import { fileExtensionTypeMapping, getExtension } from "../../utils/file";
import Button from "../common/button";
import PrimaryHeader from "../common/header";
import HeaderGroup from "../common/headerGroup";
import { FileInput, Input } from "../survey/formBuilder";
import SubmissionStatus from "../survey/status";

const getStyle = ({ theme }) =>
  StyleSheet.create({
    container: {
      padding: 15,
      paddingBottom: 0,
      backgroundColor: theme.backgroundLight,
    },
  });

interface UploadFileScreenProps {
  navigation: StackNavigationProp<{}>;
}
const UploadFileScreen: React.FC<UploadFileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<any>();
  const [desc, setDesc] = useState("");
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

  const { auth } = useAuth();
  const user = auth ? auth.user || {} : {};
  const isValid = !!name || !!file || !!desc;

  const style = useStyleConfig(getStyle);
  const loader = useScreenLoader();
  const [{ loading }, submitFileUpload] = useApi({
    method: "post",
    path: "files/upload",
  });

  const handleSubmit = async () => {
    if (file) {
      try {
        loader.show();
        const data = new FormData();
        const fileType = fileExtensionTypeMapping[getExtension(file.name)];

        data.append("name", name);
        data.append("description", desc);
        data.append(
          "file",
          file.file || { uri: file.uri, type: fileType, name: file.name }
        );
        data.append("userId", user.id);

        const res = await submitFileUpload(data);
        loader.hide();

        if (res.ok) {
          toggleStatusModalVisibility("success");
        } else {
          const errorMessage = res.data
            ? typeof res.data.message === "string"
              ? res.data.message
              : "Unable to submit response at this time"
            : null;
          toggleStatusModalVisibility("error", errorMessage);
        }
      } catch (e) {
        console.log("error ON UPLOAD", e);
        loader.hide();
        toggleStatusModalVisibility("error", "Error during file upload");
      }
    }
  };

  const handleStatusBack = useCallback(() => {
    toggleStatusModalVisibility();
  }, []);

  const handleStatusNext = useCallback(() => {
    toggleStatusModalVisibility();
    setName("");
    setDesc("");
    setFile(null);
  }, []);

  return (
    <SafeAreaView>
      <SubmissionStatus
        {...statusModalState}
        successMessage="File uploaded successfully!"
        nextButtonText="OK!"
        onClose={toggleStatusModalVisibility}
        onBack={handleStatusBack}
        onNext={handleStatusNext}
      />
      <PrimaryHeader
        title="File Upload"
        rightContent={<HeaderGroup navigation={navigation} />}
      />
      <View style={style.container}>
        <Input
          label="Name"
          placeholder="Enter Name"
          value={name}
          onChange={setName}
        />
        <FileInput
          label="Upload File"
          value={file}
          onChange={setFile}
          error={{}}
        />
        <Input
          label="Description"
          numberOfLines={10}
          value={desc}
          onChange={setDesc}
        />
        <Button
          title={loading ? "Submitting..." : "Submit"}
          disabled={!isValid}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

export default UploadFileScreen;
