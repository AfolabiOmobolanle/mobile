import React from "react";
import { Text, View, StyleSheet, Image, Modal } from "react-native";
import Button from "../common/button";
import { useStyleConfig } from "../../services/styles";
import { icons } from "../../config/images";
import font from "../../config/font";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      width: "100%",
      backgroundColor: theme.backgroundDefault,
    },
    wrapper: {
      height: 400,
      justifyContent: "space-between",
      marginTop: "50%",
    },
    icon: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
    text: {
      color: theme.textDefault,
      fontSize: fontSize.p1,
      fontFamily: font.regular,
      textAlign: "center",
      width: 250,
    },
    contentWrapper: {
      alignItems: "center",
    },
  });

interface SubmissionStatusProps {
  onNext?: () => void;
  onReset?: () => void;
  onBack?: () => void;
  status: "success" | "error";
  isVisible: boolean;
  errorMessage: string;
  successMessage?: string;
  nextButtonText?: string;
  onClose: () => void;
}
export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  onNext,
  onBack,
  onReset,
  status,
  isVisible,
  onClose,
  errorMessage,
  successMessage,
  nextButtonText,
}) => {
  const styles = useStyleConfig(getStyles);
  const isSuccess = status === "success";
  const icon = isSuccess ? icons.success : icons.error;

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.contentWrapper}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.text}>
              {isSuccess
                ? successMessage || "Your form has been submitted successfully"
                : errorMessage || "Submision Failed"}
            </Text>
          </View>
          <View>
            {isSuccess ? (
              <>
                <Button
                  title={nextButtonText || "See Trend Graph"}
                  style={{ marginBottom: 15 }}
                  onPress={onNext}
                />
                {onReset && (
                  <Button
                    title="Exit form"
                    type="secondary"
                    onPress={onReset}
                  />
                )}
              </>
            ) : (
              <Button
                title="Go back to form"
                style={{ marginBottom: 15 }}
                onPress={onBack}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SubmissionStatus;
