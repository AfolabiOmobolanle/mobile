import { Fontisto } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import font from "../../config/font";
import { useStyleConfig } from "../../services/styles";

export const screenStyle = {
  flex: 1,
};

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundDefault,
      padding: 15,
      elevation: 4,
      paddingTop: Platform.OS === "android" ? 40 : 15,
      justifyContent: "space-between",
      flexDirection: "row",
    },
    contentWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    backIcon: {
      paddingRight: 15,
      marginRight: 10,
    },
    title: {
      color: colors.primary,
      fontSize: fontSize.h3,
      fontFamily: font.regular,
      // marginRight: 20,
      maxWidth: "75%",
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

interface SecondaryHeaderProps {
  title: String;
  style?: Object;
  onBack: () => void;
  rightContent?: ReactElement;
}
const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
  title,
  style,
  onBack,
  rightContent,
}) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.backIcon} onPress={() => onBack()}>
          <Fontisto
            name="angle-left"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
      <View style={styles.wrapper}>{rightContent}</View>
    </View>
  );
};

export default SecondaryHeader;
