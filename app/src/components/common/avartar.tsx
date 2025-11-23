import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import { useStyleConfig } from "../../services/styles";
import font from "../../config/font";
import { useAuth } from "../../services/auth";
import { useLogout } from "./logoutModal";

const getStyles = ({ fontSize, theme }) =>
  StyleSheet.create({
    avartar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    avartarImage: {
      width: "100%",
      height: "100%",
    },
    avatarInitial: {
      color: theme.backgroundDefault,
      fontSize: 20,
      fontWeight: "bold",
    },
    menu: {
      backgroundColor: theme.backgroundDefault,
    },
    userRow: {
      flexDirection: "row",
      marginBottom: 30,
    },
    userTextWapper: {
      justifyContent: "flex-start",
      flex: 1,
      paddingLeft: 10,
    },
    userTitle: {
      fontSize: font.p1,
      fontFamily: font.bold,
      color: theme.textDefault,
      textAlign: "left",
    },
    userText: {
      fontSize: font.p2,
      color: theme.textSub,
      fontFamily: font.regular,
    },
    option: {
      fontFamily: font.regular,
      color: theme.textDefault,
      fontSize: font.p1,
      marginBottom: 15,
    },
  });

// Avatar image or initials
const AvartarImage = ({ image, initial }) => {
  const styles = useStyleConfig(getStyles);
  const [randomColor, setRandomColor] = useState("rgb(1, 244, 116)");

  useEffect(() => {
    // Generate a random color using JS
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setRandomColor(`rgb(${r}, ${g}, ${b})`);
  }, []);

  return (
    <View style={[styles.avartar, { backgroundColor: randomColor }]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.avartarImage} resizeMode="cover" />
      ) : (
        <Text style={styles.avatarInitial}>{initial || "U"}</Text>
      )}
    </View>
  );
};

// User row with name & email
const User = ({ user = {} }) => {
  const styles = useStyleConfig(getStyles);
  const image = user?.image_url || null;
  const initial = user?.full_name?.[0] || "U";

  return (
    <View style={styles.userRow}>
      <AvartarImage image={image} initial={initial} />
      <View style={styles.userTextWapper}>
        <Text style={styles.userTitle}>Hi {user?.full_name || "User"}</Text>
        <Text style={styles.userText}>{user?.email || "No email"}</Text>
      </View>
    </View>
  );
};

// Main Avatar component with menu
const Avartar = ({ onProfileClick, onSettingClick }) => {
  const styles = useStyleConfig(getStyles);
  const { auth } = useAuth();
  const user = auth?.user || {};
  const image = user?.image_url || null;
  const initial = user?.full_name?.[0] || "U";
  const { logout } = useLogout();

  return (
    <Menu>
      <MenuTrigger>
        <AvartarImage image={image} initial={initial} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            paddingHorizontal: 30,
            paddingVertical: 15,
            width: 250,
            ...styles.menu,
          },
        }}
      >
        <MenuOption>
          <User user={user} />
        </MenuOption>
        <MenuOption onSelect={onProfileClick}>
          <Text style={styles.option}>Profile</Text>
        </MenuOption>
        <MenuOption onSelect={onSettingClick}>
          <Text style={styles.option}>Settings</Text>
        </MenuOption>
        <MenuOption onSelect={() => logout()}>
          <Text style={styles.option}>Logout</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default Avartar;
