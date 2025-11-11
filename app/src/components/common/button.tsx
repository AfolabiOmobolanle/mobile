import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { useStyleConfig } from '../../services/styles';
import colors from '../../config/colors';
import font from '../../config/font';

const getStyles = ({ fontSize, theme }) =>
  StyleSheet.create({
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      minWidth: 120,
      borderRadius: 10,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 1,
    },
    buttonText: {
      fontSize: fontSize.p1,
      color: colors.white,
      textAlign: 'center',
      fontFamily: font.regular,
    },
    buttonSecondary: {
      backgroundColor: theme.backgroundDefault,
      borderColor: colors.primary,
    },
    buttonSecondaryText: {
      color: theme.textDefault,
    },
    buttonDisabled: {
      opacity: 0.8,
      backgroundColor: colors.darkLighest,
      borderColor: colors.darkLighest,
    },
  });

interface ButtonProps {
  onPress?: () => void;
  title: String;
  style?: Object;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  title = '',
  onPress,
  style,
  type,
  disabled,
}) => {
  const styles = useStyleConfig(getStyles);
  const isSecondary = type === 'secondary';

  const composeStyle = useCallback(
    (mainStyle: any, secondaryStyle: any) => ({
      ...mainStyle,
      ...(isSecondary && secondaryStyle),
    }),
    [isSecondary]
  );

  return (
    <TouchableOpacity onPress={disabled ? () => {} : onPress}>
      <View
        style={{
          ...composeStyle(styles.button, styles.buttonSecondary),
          ...style,
          ...(disabled && styles.buttonDisabled),
        }}
      >
        <Text
          style={composeStyle(styles.buttonText, styles.buttonSecondaryText)}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
