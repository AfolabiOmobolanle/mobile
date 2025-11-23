import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { getFontSize } from "../config/font";
import { useMountState } from "./mounted";

const fontStorageKey = "font_scale"; // ✅ valid key

interface FontContextType {
  fontScale: string;
  setFontScale: (scale: string) => void;
}

const FontContext = createContext<FontContextType>({
  fontScale: "medium",
  setFontScale: () => {},
});

interface FontScaleProviderProps {
  children: ReactNode;
}

const FontScaleProvider: React.FC<FontScaleProviderProps> = ({ children }) => {
  const [fontScale, setFontScale] = useState("medium");
  const mounted = useMountState();

  const loadFontScale = useCallback(async () => {
    try {
      const storedScale = await SecureStore.getItemAsync(fontStorageKey);
      if (storedScale && mounted) setFontScale(storedScale);
    } catch (error) {
      console.log("Error reading font scale from storage:", error);
    }
  }, [mounted]);

  useEffect(() => {
    loadFontScale();
  }, [loadFontScale]);

  useEffect(() => {
    const saveFontScale = async () => {
      try {
        await SecureStore.setItemAsync(fontStorageKey, fontScale);
      } catch (error) {
        console.log("Error saving font scale:", error);
      }
    };
    saveFontScale();
  }, [fontScale]);

  return (
    <FontContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  return {
    fontScale: context.fontScale,
    setFontScale: context.setFontScale,
    fontSize: getFontSize(context.fontScale),
  };
};

export default FontScaleProvider;
