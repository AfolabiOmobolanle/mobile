import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import colors from '../../config/colors';
import { useStyleConfig } from '../../services/styles';
import font from '../../config/font';
import { LineChart } from 'react-native-chart-kit';

const getStyle = ({ fontSize, theme }) =>
  StyleSheet.create({
    container: {
      minHeight: '70%',
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
    description: {
      color: theme.textSub,
      fontSize: fontSize.p1,
      fontFamily: font.regular,
    },
  });

const TrendGraph = ({ dataSet = [], labels = [] }) => {
  const styles = useStyleConfig(getStyle);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trend graph</Text>
      <Text style={styles.description}>
        This graph show how early your submissions had been.{' '}
      </Text>

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: dataSet,
            },
          ],
        }}
        width={Dimensions.get('window').width - 20} // from react-native
        height={420}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: 'yellow',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(33, 155, 187, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(33, 155, 187, ${opacity})`,
          propsForBackgroundLines: {},
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        // bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default TrendGraph;
