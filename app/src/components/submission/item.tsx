import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import font from "../../config/font";
import { useStyleConfig } from "../../services/styles";

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
  });

interface SubmissonItemProps {
  title: String;
  date: String;
  time: String;
  status: "pending" | "rejected" | "accepted";
}

const SubmissonItem: React.FC<SubmissonItemProps> = ({
  title,
  status,
  date,
  time,
}) => {
  const styles = useStyleConfig(getStyles);
  const isAccepted = status === "accepted";

  return (
    <View style={{ ...styles.container, opacity: isAccepted ? 0.6 : 1 }}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.captionWrapper}>
        <Text style={styles.caption}>{date}</Text>
        <Text style={styles.caption}>{time}</Text>
      </View>
    </View>
  );
};

export default SubmissonItem;