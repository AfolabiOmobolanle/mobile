import React, { useCallback } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import SurveyCard from "./card";
import { useStyleConfig } from "../../services/styles";
import colors from "../../config/colors";
import font from "../../config/font";

const getStyles = ({ fontSize, theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      paddingBottom: 0,
      backgroundColor: theme.backgroundLight,
    },
    title: {
      color: colors.primary,
      fontSize: fontSize.h2,
      marginBottom: 15,
      fontFamily: font.regular,
    },
  });

interface SurveyListProps {
  surveys: Array<any>;
  onSurveyClick: () => void;
}
const SurveyList: React.FC<SurveyListProps> = ({ surveys, onSurveyClick }) => {
  const styles = useStyleConfig(getStyles);
  const renderSurvey = useCallback(
    ({ item }: any) => <SurveyCard {...item} onPress={onSurveyClick} />,
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={surveys}
        renderItem={renderSurvey}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
};

export default SurveyList;
