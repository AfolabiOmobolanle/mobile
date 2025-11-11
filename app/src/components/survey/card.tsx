import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useStyleConfig } from '../../services/styles';
import colors from '../../config/colors';
import font from '../../config/font';

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.backgroundDefault,
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      position: 'relative',
    },
    title: {
      fontSize: fontSize.h3,
      fontFamily: font.bold,
      color: theme.textDefault,
    },
    description: {
      fontSize: fontSize.p,
      color: theme.textDefault,
      fontFamily: font.regular,
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      backgroundColor: colors.accent,
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 10,
    },
    tagText: {
      color: colors.white,
      fontSize: fontSize.p2,
      fontFamily: font.light,
    },

    captionWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    caption: {
      textTransform: 'uppercase',
      color: theme.textSub,
      fontSize: fontSize.p2,
      fontFamily: font.regular,
    },
  });

interface SurveyCardProps {
  title: String;
  description: String;
  date: String;
  type: String;
  time: String;
  id: string | number;
  filled: boolean;
  onPress?: (id: string | number) => void;
}
const SurveyCard: React.FC<SurveyCardProps> = ({
  title,
  description,
  date,
  type,
  time,
  onPress = () => {},
  filled,
  id,
}) => {
  const styles = useStyleConfig(getStyles);

  const handlePress = useCallback(() => onPress(id), [onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {!filled && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>NEW</Text>
          </View>
        )}
        <View style={styles.captionWrapper}>
          <Text style={styles.caption}>{date}</Text>
          <Text style={styles.caption}>{type}</Text>
          <Text style={styles.caption}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SurveyCard;
