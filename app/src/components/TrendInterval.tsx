import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colors from '../config/colors';
import { useStyleConfig } from '../services/styles';

const getStyle = ({ theme }) =>
  StyleSheet.create({
    box: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      backgroundColor: theme.backgroundDefault,
      margin: 20,
      overflow: 'hidden',
    },
    interval: {
      padding: 10,
      flex: 1,
      borderRightWidth: 1,
      borderColor: '#ccc',
      backgroundColor: theme.backgroundDefault,
    },
    intervalIsActive: {
      backgroundColor: colors.primary,
    },
    intervalText: {
      textAlign: 'center',
    },
    intervalTextIsActive: {
      color: '#fff',
    },
    lastInterval: {
      borderRightWidth: 0,
    },
  });

interface IInterval {
  label: string;
  value: string;
}

interface IntervalProps extends IInterval {
  onPress: (value: string) => void;
  isActive?: boolean;
  isLastItem?: boolean;
}
const Interval: React.FC<IntervalProps> = ({
  label,
  value,
  onPress,
  isActive,
  isLastItem,
}) => {
  const style = useStyleConfig(getStyle);

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(value)}
      containerStyle={{
        ...style.interval,
        ...(isActive && style.intervalIsActive),
        ...(isLastItem && style.lastInterval),
      }}
    >
      <View>
        <Text
          style={{
            ...style.intervalText,
            ...(isActive && style.intervalTextIsActive),
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

interface TrendIntervalProps {
  intervals: IInterval[];
  value: string;
  onChange: (value: string) => void;
}
const TrendInterval: React.FC<TrendIntervalProps> = ({
  intervals = [],
  value,
  onChange,
}) => {
  const style = useStyleConfig(getStyle);

  return (
    <View style={style.box}>
      {intervals.map((int, idx) => (
        <Interval
          {...int}
          key={int.value}
          onPress={onChange}
          isActive={value === int.value}
          isLastItem={idx === intervals.length - 1}
        />
      ))}
    </View>
  );
};

export default TrendInterval;
