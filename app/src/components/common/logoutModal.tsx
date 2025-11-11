import React, { createContext, useCallback, useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import font from '../../config/font';
import { useAuth } from '../../services/auth';
import { useStyleConfig } from '../../services/styles';
import Button from './button';

const LogoutModalContext = createContext({ showLogoutModal: () => {} });

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.81)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    modal: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: 5,
      padding: 20,
      zIndex: 10,
      margin: 30,
      maxWidth: 400,
    },
    title: {
      fontSize: fontSize.h3,
      color: theme.textDefault,
      fontFamily: font.regular,
      textAlign: "center",
    },
    titleWrapper: {
      borderBottomColor: theme.textCaption,
      borderBottomWidth: 1,
      padding: 20,
      paddingTop: 0,
      paddingBottom: 10,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 20,
    },
  });

interface LogoutModalPropTypes {
  children: any;
}
const LogoutModal: React.FC<LogoutModalPropTypes> = ({ children }) => {
  const styles = useStyleConfig(getStyles);

  const [show, setShow] = useState(false);
  const showLogoutModal = useCallback(() => setShow(true), []);
  const hideLogoutModal = useCallback(() => setShow(false), []);

  const { clearAuth } = useAuth();
  const handleYesClick = useCallback(() => {
    clearAuth();
    hideLogoutModal();
  }, [clearAuth, hideLogoutModal]);

  return (
    <LogoutModalContext.Provider value={{ showLogoutModal }}>
      {show && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>
                Are you sure you want to log out?
              </Text>
            </View>
            <View style={styles.actionRow}>
              <Button title="No" type="secondary" onPress={hideLogoutModal} />
              <Button title="Yes" onPress={handleYesClick} />
            </View>
          </View>
        </View>
      )}
      {children}
    </LogoutModalContext.Provider>
  );
};

export const useLogout = () => {
  const { showLogoutModal } = useContext(LogoutModalContext);

  return {
    logout: showLogoutModal,
  };
};

export default LogoutModal;
