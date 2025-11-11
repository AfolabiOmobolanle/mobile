import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useStyleConfig } from '../../services/styles';
import font from '../../config/font';

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    input: {
      marginBottom: 30,
      width: '100%',
    },
    inputField: {
      borderRadius: 5,
      borderColor: '#26262640',
      borderWidth: 1,
      padding: 10,
      backgroundColor: '#c4c4c417',
      fontFamily: font.regular,
    },
    inputLabel: {
      marginBottom: 5,
      fontSize: fontSize.p1,
      color: theme.textDefault,
      fontFamily: font.bold,
    },
  });

interface InputProps {
  placeholder?: String;
  label?: String;
}
const Input: React.FC<InputProps> = ({ placeholder, label }) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={styles.input}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.inputField} placeholder={placeholder} />
    </View>
  );
};

export default Input;
