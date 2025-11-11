import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../config/colors';

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#26262621',
  },
  bannerInder: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});

interface ProgressBarProps {
  progress: Number;
  style?: Object;
  innerStyle?: Object;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 90,
  style = {},
  innerStyle,
}) => {
  return (
    <View
      style={{
        ...styles.bar,
        ...style,
      }}
    >
      <View
        style={{ ...styles.bannerInder, width: `${progress}%`, ...innerStyle }}
      />
    </View>
  );
};

export default ProgressBar;
