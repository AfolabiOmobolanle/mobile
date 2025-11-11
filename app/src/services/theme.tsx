import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  ReactChild,
  useEffect,
  useRef,
} from "react";
import * as SecureStore from "expo-secure-store";

import { getThemeConfig } from "../config/theme";
import { useMountState } from "./mounted";

const themeScheme = ["light", "dark"];
const themeStorageKey = "@theme";

const themeContext = createContext({
  theme: themeScheme[0],
  setTheme: (value: string) => {},
  toggleTheme: () => {},
});

interface ThemeProviderPropTypes {
  children: ReactChild;
}
export const ThemeProvider = ({ children }: ThemeProviderPropTypes) => {
  const [theme, setTheme] = useState(themeScheme[0]);
  const toggleTheme = useCallback(
    () =>
      setTheme((prevTheme) =>
        prevTheme === themeScheme[0] ? themeScheme[1] : themeScheme[0]
      ),
    []
  );

  //set theme in storage
  const mounted = useMountState();
  const setPersistedTheme = useCallback(async () => {
    const persistedTheme =
      (await SecureStore.getItemAsync(themeStorageKey)) || "light";
    if (mounted) {
      setTheme(persistedTheme);
    }
  }, [mounted, setTheme]);

  useEffect(() => {
    setPersistedTheme();
  }, [setPersistedTheme]);

  const setThemeStore = async () => {
    await SecureStore.setItemAsync(themeStorageKey, theme);
  };

  //update theme in storage
  useEffect(() => {
    setThemeStore();
  }, [theme, themeStorageKey]);

  return (
    <themeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme, ...themeControllers } = useContext(themeContext);

  return {
    ...themeControllers,
    isDarkMode: theme === "dark",
    theme,
    themeConfig: getThemeConfig(theme),
  };
};
