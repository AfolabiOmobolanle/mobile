import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStyleConfig } from '../../services/styles';
import colors from '../../config/colors';
import font from '../../config/font';

const getStyle = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingBottom: 20,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 35,
      backgroundColor: colors.accent,
      marginRight: 15,
    },
    contentWrapper: {
      position: 'relative',
      borderBottomWidth: 1,
      borderBottomColor: '#26262621',
      flex: 1,
    },
    title: {
      fontSize: fontSize.p,
      color: theme.textDefault,
      marginBottom: 2,
      fontFamily: font.regular,
    },
    titleFocus: {
      fontFamily: font.bold,
    },
    date: {
      fontSize: fontSize.p1,
      fontFamily: font.regular,
    },
    dateFocus: {
      fontFamily: font.bold,
    },
    badge: {
      backgroundColor: colors.primary,
      position: 'absolute',
      right: 0,
      top: 8,
      width: 25,
      height: 25,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: colors.white,
      fontSize: fontSize.p1,
      fontFamily: font.regular,
    },
  });

interface FeedItemProps {
  image?: String;
  title: String;
  dates: String[];
  newCount?: String | Number;
  onPress: () => void;
}
const FeedItem: React.FC<FeedItemProps> = ({
  image,
  title,
  dates,
  newCount,
  onPress,
}) => {
  const styles = useStyleConfig(getStyle);
  const isFocused: Boolean | undefined = newCount && newCount > 0;
  const composeIsFocusedStyle = useCallback(
    (mainStyle, focusStyle) => ({
      ...mainStyle,
      ...(isFocused && focusStyle),
    }),
    [isFocused]
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.image} />
        <View style={styles.contentWrapper}>
          <Text style={composeIsFocusedStyle(styles.title, styles.titleFocus)}>
            {title}
          </Text>
          <Text style={composeIsFocusedStyle(styles.date, styles.dateFocus)}>
            {dates.join(';')}
          </Text>
        </View>
        {isFocused ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{newCount}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default FeedItem;
