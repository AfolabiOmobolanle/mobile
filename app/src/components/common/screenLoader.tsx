import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import colors from '../../config/colors';

const ScreenLoader = () => {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0000003d',
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default ScreenLoader;
