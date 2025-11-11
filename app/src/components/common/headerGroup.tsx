import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { View } from "react-native";
import Avartar from "../../components/common/avartar";
import colors from "../../config/colors";
import { useApi } from "../../services/api";
import { useTheme } from "../../services/theme";

interface HeaderGroupType {
  navigation: any;
  isHome: boolean;
}
const HeaderGroup: React.FC<HeaderGroupType> = ({ navigation, isHome }) => {
  const { isDarkMode } = useTheme();
  const [iconState, setIconState] = useState(true);
  const notificationIconColor = useMemo(
    () => (isDarkMode ? colors.white : colors.dark),
    [isDarkMode]
  );

  const handleProfileClick = useCallback(
    () => navigation.navigate("profile"),
    []
  );
  const handleSettingClick = useCallback(
    () => navigation.navigate("settings"),
    []
  );
  const handleLogoutClick = useCallback(
    () => navigation.navigate("profile"),
    []
  );
  const handleNotificationClick = useCallback(() => {
    setIconState(false);
    navigation.navigate("notifications");
  }, []);

  const [
    { loading: loadingResponse, res: result, error: responseError },
    fetchNotifications,
  ] = useApi({
    method: "get",
    path: `data_collector/survey_response/notifications`,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notifications = result && result?.data?.getRejectedResponses;

  return (
    <>
      <Ionicons
        onPress={handleNotificationClick}
        // name="notifications-circle-outline"
        name="notifications"
        size={30}
        color={notificationIconColor}
        style={{ marginRight: 15 }}
      />
      {iconState && isHome && notifications?.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: 3,
            height: 10,
            width: 10,
            backgroundColor: "red",
            right: 55,
            borderRadius: 100,
          }}
        />
      )}
      <Avartar
        onProfileClick={handleProfileClick}
        onSettingClick={handleSettingClick}
        onLogoutClick={handleLogoutClick}
      />
    </>
  );
};

export default HeaderGroup;
