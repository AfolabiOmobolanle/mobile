import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useStyleConfig } from '../../services/styles';
import images from '../../config/images';
import colors from '../../config/colors';

const getStyle = ({ theme, fontSize }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
    introduction: {
      backgroundColor: theme.backgroundDefault,
      padding: 30,
      alignItems: 'center',
    },
    introductionImage: {
      width: 240,
      height: 200,
    },
    introductionHeadline: {
      fontSize: fontSize.h2,
      marginVertical: 20,
      textAlign: 'center',
      color: theme.textDefault,
    },
    introductionText: {
      fontSize: fontSize.p1,
      color: theme.textSub,
      textAlign: 'center',
      marginBottom: 20,
    },
    landingButton: {
      borderWidth: 2,
      paddingVertical: 10,
      paddingHorizontal: 20,
      minWidth: 100,
      borderRadius: 3,
    },
    landingButtonText: {
      fontSize: fontSize.p2,
    },
  });

const LandingButton = ({ color = colors.primary, title = '' }) => {
  const styles = useStyleConfig(getStyle);

  return (
    <TouchableOpacity>
      <View style={{ ...styles.landingButton, borderColor: color }}>
        <Text style={{ ...styles.landingButtonText, color }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const LandingScreen = () => {
  const styles = useStyleConfig(getStyle);

  return (
    <View style={styles.container}>
      <View style={styles.introduction}>
        <Image source={images.landing1} style={styles.introductionImage} />
        <Text style={styles.introductionHeadline}>
          Impacting governance 360 at a time
        </Text>
        <Text style={styles.introductionText}>
          With its many capabilities, we are makinig government more efficient
          through data gathering, analysis and utilization. Welocme to Eko360.
        </Text>
        <LandingButton title="Learn More" />
      </View>
    </View>
  );
};

export default LandingScreen;
