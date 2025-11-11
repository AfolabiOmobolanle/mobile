import React from "react";
import { SurveyFormContextProvider } from "../context/surveyFormContext";
import AppNavigation from "./AppNavigation";

const RootNavigation = () => {
  return (
    // <NavigationContainer ref={navigationRef}>
    <SurveyFormContextProvider>
      <AppNavigation />
    </SurveyFormContextProvider>
    // </NavigationContainer>
  );
};

export default RootNavigation;
