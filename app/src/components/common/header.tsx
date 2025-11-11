import React, { ReactElement } from "react";
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "../../config/colors";
import font from "../../config/font";
import { useStyleConfig } from "../../services/styles";
import { useTheme } from "../../services/theme";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundDefault,
      elevation: 4,
      padding: 15,
      justifyContent: "space-between",
      flexDirection: "row",
      paddingTop: Platform.OS === "android" ? 40 : 15,
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      width: 30,
      height: 30,
      marginRight: 20,
    },
    title: {
      fontSize: fontSize.h3,
      color: colors.primary,
      fontFamily: font.light,
      width: "60%",
    },
  });

interface HeaderProps {
  title: String;
  rightContent: ReactElement;
  style?: StyleProp<{}>;
}
const PrimaryHeader: React.FC<HeaderProps> = ({
  title,
  rightContent,
  style,
}) => {
  const { themeConfig } = useTheme();
  const styles = useStyleConfig(getStyles);

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={[styles.wrapper]}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={themeConfig.logo}
        />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
      <View style={styles.wrapper}>{rightContent}</View>
    </View>
  );
};

export default PrimaryHeader;
