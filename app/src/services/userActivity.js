import React, { useState, createContext, useEffect } from "react";
import { useAuth } from "./auth";

export const UserActivityContext = createContext();

const UserActivityProvider = ({ children }) => {
  const [active, setActive] = useState(true);
  const [timer, setTimer] = useState(600000);

  return (
    <UserActivityContext.Provider value={{ active, setActive, timer }}>
      {children}
    </UserActivityContext.Provider>
  );
};
export default UserActivityProvider;
