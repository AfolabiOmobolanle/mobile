import * as SecureStore from "expo-secure-store";

const localStorage = {
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.log(error, "local storage store");
    }
  },
  getItem: async (key) => {
    try {
      const value = await SecureStore.getItemAsync(key);

      if (value !== undefined) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.log(error, "local storage on storage read");
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.log(error, "local storage clear");
    }
  },
};

export default localStorage;
