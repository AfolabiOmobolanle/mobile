import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import colors from '../../config/colors';
import { useStyleConfig } from '../../services/styles';
import { AntDesign } from '@expo/vector-icons';
import ProgressBar from '../common/progressBar';
import font from '../../config/font';

const getStyle = ({ fontSize, theme }) =>
  StyleSheet.create({
    container: {
      minHeight: 300,
    },
    title: {
      color: colors.primary,
      textTransform: 'uppercase',
      fontFamily: font.bold,
      paddingVertical: 5,
      borderBottomColor: '#26262621',
      borderBottomWidth: 1,
      fontSize: fontSize.p1,
      marginBottom: 10,
      letterSpacing: 2,
    },
    content: {
      flexDirection: 'row',
    },
    positionCard: {
      height: 150,
      width: 120,
      borderRadius: 8,
      backgroundColor: colors.accent,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    positionCardLabel: {
      textTransform: 'uppercase',
      marginBottom: 5,
      fontSize: fontSize.p,
      color: colors.white,
      fontFamily: font.regular,
    },
    positionCardNumber: {
      fontSize: fontSize.h1,
      color: colors.white,
      fontFamily: font.regular,
    },
    positonCardIcon: {
      position: 'absolute',
      right: -20,
      top: 52,
      color: theme.backgroundDefault,
    },
    contentWrapper: {
      justifyContent: 'center',
      paddingHorizontal: 20,
      flex: 1,
    },
    header: {
      textTransform: 'uppercase',
      fontSize: fontSize.p,
      color: theme.textDefault,
      fontFamily: font.regular,
    },
  });

const Progress = ({ position }) => {
  const styles = useStyleConfig(getStyle);

  return (
    <View>
      <Text style={styles.title}>This week</Text>
      <View style={styles.content}>
        <View style={styles.positionCard}>
          <Text style={styles.positionCardLabel}>position</Text>
          <Text style={styles.positionCardNumber}>{position}</Text>
          <AntDesign
            name="caretleft"
            size={45}
            style={styles.positonCardIcon}
            color={colors.white}
          />
          {/* </View>
        <View style={styles.contentWrapper}>
          <Text style={styles.header}>Progres Bar</Text>
          <ProgressBar progress={40} style={{ marginTop: 10 }} />
          <ProgressBar
            progress={90}
            style={{ marginTop: 10 }}
            innerStyle={{ backgroundColor: colors.accent }}
          /> */}
        </View>
      </View>
    </View>
  );
};

export default Progress;
