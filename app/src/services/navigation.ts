import { NavigationContainerRef } from "@react-navigation/native";
import React from "react";

// export const navigationRef: any = createRef();
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const navigate = (name: string, params?: object) => {
  if (navigationRef?.current) {
    console.log("Navigation..");
    navigationRef.current.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
};

export const navigator = {
  navigate,
  goBack,
};

export default navigator;
