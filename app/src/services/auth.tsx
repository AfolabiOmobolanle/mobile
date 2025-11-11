import React, {
  createContext,
  useCallback,
  ReactElement,
  useState,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";

const authStorageKey = "@auth";
export const persistAuth = async (value: any) => {
  try {
    await SecureStore.setItemAsync(authStorageKey, JSON.stringify(value));
  } catch (error) {
    console.log(error, "Auth store");
  }
};

const clearPersistedAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(authStorageKey);
  } catch (error) {
    console.log(error, "error on storage clear");
  }
};

const getPersistedAuth = async () => {
  try {
    const value = await SecureStore.getItemAsync(authStorageKey);

    if (value !== undefined && value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error, "error on storage read");
  }
};

const authContext = createContext({
  auth: null,
  setAuth: (value: any) => value,
  clearAuth: () => {},
  updateUser: (values: any) => values,
});

interface IAuthProviderProps {
  children: ReactElement;
}
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const clearAuth = useCallback(async () => {
    await clearPersistedAuth();
    setAuth(null);
  }, []);

  const updateUser = useCallback(
    (update) => {
      if (auth) {
        const newAuth = {
          ...auth,
          user: {
            ...auth.user,
            ...update,
          },
        };
        setAuth(newAuth);
        persistAuth(newAuth);
      }
    },
    [auth]
  );

  return (
    <authContext.Provider value={{ auth, setAuth, clearAuth, updateUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return { ...useContext(authContext), persistAuth, getPersistedAuth };
};
