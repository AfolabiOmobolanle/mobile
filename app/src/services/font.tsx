import React, {
  createContext,
  useState,
  ReactChild,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import * as SecureStore from "expo-secure-store";

import { getFontSize } from "../config/font";
import { useMountState } from "./mounted";

//persist storage key
const fontStorageKey = "@fontScale";

const fontContext = createContext({
  fontScale: "medium",
  setFontScale: (scale: string) => {},
});

interface FontScaleProviderProps {
  children: ReactChild;
}
const FontScaleProvider: React.FC<FontScaleProviderProps> = ({ children }) => {
  const [fontScale, setFontScale] = useState("medium");
  const mounted = useMountState();

  //set font scale in storage
  const setPersistedFontScale = useCallback(async () => {
    const persistedFontScale =
      (await SecureStore.getItemAsync(fontStorageKey)) || "medium";

    if (mounted) {
      setFontScale(persistedFontScale);
    }
  }, [mounted, setFontScale]);
  useEffect(() => {
    setPersistedFontScale();
  }, [setPersistedFontScale]);

  const persistFontScale = async () => {
    try {
      await SecureStore.setItemAsync(fontStorageKey, fontScale);
    } catch (error) {
      console.log(error, "Font scale");
    }
  };

  //update font scale in storage
  useEffect(() => {
    persistFontScale();
  }, [fontScale, fontStorageKey]);

  return (
    <fontContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </fontContext.Provider>
  );
};

export const useFont = () => {
  const { fontScale, setFontScale } = useContext(fontContext);

  return {
    fontScale,
    setFontScale,
    fontSize: getFontSize(fontScale),
  };
};

export default FontScaleProvider;
