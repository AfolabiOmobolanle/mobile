import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { generateSecureRandom } from "react-native-securerandom";

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
      fontSize: 30,
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
      fontSize: fontSize.p1,
      fontFamily: font.bold,
      color: theme.textDefault,
      textAlign: "left",
    },
    userText: {
      fontSize: fontSize.p2,
      color: theme.textSub,
      fontFamily: font.regular,
    },
    option: {
      fontFamily: font.regular,
      color: theme.textDefault,
      fontSize: fontSize.p1,
      marginBottom: 15,
    },
  });

const AvartarImage = ({ image, initial }) => {
  const styles = useStyleConfig(getStyles);
  const [randomColor, setRandomColor] = useState<string>("rgb(1, 244, 116)");

  const getColour = async () => {
    let randomBytes = await generateSecureRandom(3);
    setRandomColor(
      `rgb(${randomBytes[0]}, ${randomBytes[1]}, ${randomBytes[2]})`
    );
  };

  useEffect(() => {
    getColour();
  }, []);
  return (
    <View style={[styles.avartar, { backgroundColor: randomColor }]}>
      {image ? (
        <Image
          source={{
            uri: image,
          }}
          style={styles.avartarImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.avatarInitial}>{initial}</Text>
      )}
    </View>
  );
};

const User = ({ user = {} }) => {
  const styles = useStyleConfig(getStyles);
  const image = user ? user.image_url : null;

  return (
    <View style={styles.userRow}>
      <AvartarImage image={image} initial={user.full_name[0]} />
      <View style={styles.userTextWapper}>
        <Text style={styles.userTitle}>Hi {user.full_name}</Text>
        <Text style={styles.userText}>{user.email}</Text>
      </View>
    </View>
  );
};

const Avartar = ({ onProfileClick, onSettingClick }) => {
  const styles = useStyleConfig(getStyles);
  const { auth } = useAuth();
  const user = auth ? auth.user : {};
  const image = user ? user.image_url : null;
  const { logout } = useLogout();

  return (
    <Menu>
      <MenuTrigger>
        <AvartarImage
          image={image}
          initial={user.full_name ? user.full_name[0] : ""}
        />
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
