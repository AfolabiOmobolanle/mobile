import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../../services/theme';
import colors from '../../config/colors';
import { useStyleConfig } from '../../services/styles';

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    logoStyle: {
      width: 30,
      height: 30,
    },
    buttonStyle: {
      backgroundColor: colors.primary,
      textTransform: 'capitalize',
      fontSize: fontSize.p2,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 10,
      minWidth: 80,
    },
    buttonTextStyle: {
      color: colors.white,
      textAlign: 'center',
    },
  });
export const LandingLogo = ({ onPress, style }) => {
  const { themeConfig } = useTheme();
  const { logoStyle } = useStyleConfig(getStyles);

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={themeConfig.logo}
        style={{ ...logoStyle, ...style }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export const LandingButton = ({ title, onPress }) => {
  const { buttonStyle, buttonTextStyle } = useStyleConfig(getStyles);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={buttonStyle}>
        <Text style={buttonTextStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
