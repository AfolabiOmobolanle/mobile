import React, { ReactElement, useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Alert } from "react-native";
import colors from "../../config/colors";
import { useStyleConfig } from "../../services/styles";

const getStyle = ({ theme, fontSize }) =>
  StyleSheet.create({
    viewStyle: {
      width: "100%",
      height: "100%",
      minHeight: 300,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundDefault,
    },
    viewText: {
      color: theme.textDefault,
      fontSize: fontSize.p1,
    },
  });

interface LoadManagerProps {
  loading: boolean;
  empty?: boolean;
  emptyMessage?: string;
  error?: boolean;
  errorMessage?: string;
  children: ReactElement;
}
const LoadManager: React.FC<LoadManagerProps> = ({
  loading,
  empty,
  emptyMessage = "No data currently",
  error,
  errorMessage = "An error occured",
  children,
}) => {
  const style = useStyleConfig(getStyle);
  if (loading) {
    return (
      <View style={style.viewStyle}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={style.viewStyle}>
        <Text style={style.viewText}>{errorMessage}</Text>
      </View>
    );
  }

  if (empty) {
    return (
      <View style={style.viewStyle}>
        <Text style={style.viewText}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default LoadManager;
