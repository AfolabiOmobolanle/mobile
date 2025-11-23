import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getThemeConfig } from "../config/theme";
import { useMountState } from "./mounted";

const themeScheme = ["light", "dark"];
const themeStorageKey = "theme"; // ✅ valid key

interface ThemeContextType {
  theme: string;
  setTheme: (value: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themeScheme[0],
  setTheme: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>(themeScheme[0]);
  const mounted = useMountState();

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Load persisted theme
  const loadTheme = useCallback(async () => {
    try {
      const storedTheme = await SecureStore.getItemAsync(themeStorageKey);
      if (storedTheme && mounted) setTheme(storedTheme);
    } catch (error) {
      console.log("Error reading theme from storage:", error);
    }
  }, [mounted]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Persist theme whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await SecureStore.setItemAsync(themeStorageKey, theme);
      } catch (error) {
        console.log("Error saving theme:", error);
      }
    };
    saveTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return {
    ...context,
    isDarkMode: context.theme === "dark",
    themeConfig: getThemeConfig(context.theme),
  };
};
