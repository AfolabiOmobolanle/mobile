import React, { useCallback, useState } from 'react';
import { screenStyle } from './styles';
import { SafeAreaView, Text, View, StyleSheet, Switch } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useStyleConfig } from '../services/styles';
import colors from '../config/colors';
import SecondaryHeader from '../components/common/secondayHeader';
import Button from '../components/common/button';
import font, { fontScales } from '../config/font';
import { useTheme } from '../services/theme';
import { useFont } from '../services/font';
import { useLogout } from '../components/common/logoutModal';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from "@react-native-picker/picker";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      alignItems: 'center',
      backgroundColor: theme.backgroundDefault,
    },
    title: {
      color: colors.primary,
      fontSize: fontSize.p1,
      width: '100%',
      textTransform: 'uppercase',
      marginBottom: 5,
      fontFamily: font.regular,
    },
    section: {
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: '#26262621',
      paddingTop: 10,
      marginBottom: 20,
    },
    lastSection: {
      borderBottomColor: '#26262621',
      borderBottomWidth: 1,
      marginBottom: 30,
    },
    colorIndicator: {
      width: 25,
      height: 25,
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    sectionItem: {
      marginBottom: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionItemLabel: {
      fontSize: fontSize.p,
      color: theme.textDefault,
      fontFamily: font.regular,
    },
    sectionItemLText: {
      fontSize: fontSize.p,
      color: theme.textSub,
      fontFamily: font.regular,
    },
    inputStyle: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'transparent',
      padding: 0,
      textTransform: 'capitalize',
      color: theme.textDefault,
      height: 50,
      backgroundColor: 'transparent',
    },
  });

const SettingsScreen = ({ navigation }) => {
  const styles = useStyleConfig(getStyles);
  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);

  const { logout } = useLogout();

  const { toggleTheme, themeConfig, isDarkMode } = useTheme();

  const [showFontOptions, setShowFontOptions] = useState(false);
  const { fontScale, setFontScale } = useFont();
  const fontScaleOptions = fontScales.map((scale) => ({
    label: scale,
    value: scale,
  }));

  return (
    <SafeAreaView style={screenStyle}>
      <SecondaryHeader title="Settings" onBack={handleBackPress} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Appearance</Text>
        <View style={styles.section}>
          <View style={styles.sectionItem}>
        <View>
  <Text style={styles.sectionItemLabel}>Font Size</Text>
  <View
    style={{
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 5,
      backgroundColor: "white",
      overflow: "hidden",
    }}
  >
    <Picker
      selectedValue={fontScale}
      onValueChange={setFontScale}
      style={[styles.inputStyle, { height: 48 }]}
    >
      {fontScaleOptions.map((option) => (
        <Picker.Item
          key={option.value}
          label={option.label}
          value={option.value}
        />
      ))}
    </Picker>
  </View>
</View>
          </View>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>
        <Button title="Log Out" onPress={() => logout()} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
