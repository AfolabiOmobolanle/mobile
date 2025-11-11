import React, { createContext, useState } from "react";

export const MyNotificationContext = createContext("");

const NotificationContext = ({ children }) => {
  const [isNotification, setIsNotication] = useState(false);

  return (
    <MyNotificationContext.Provider value={{ isNotification, setIsNotication }}>
      {children}
    </MyNotificationContext.Provider>
  );
};

export default NotificationContext;
