import React, { createContext, useState, useContext } from "react";

const surveyFormContext = createContext({
  fieldValues: [],
  saveFieldValues: (values: any) => {},
  editedSurvey: {},
  setEditedSurvey: (values: any) => {},
});

type Props = {
  children: React.ReactNode;
};

export const SurveyFormContextProvider = (props: Props) => {
  const [values, setValues] = useState([]);
  const [survey, setSurvey] = useState({});

  return (
    <surveyFormContext.Provider
      value={{
        fieldValues: values,
        saveFieldValues: setValues,
        editedSurvey: survey,
        setEditedSurvey: setSurvey,
      }}
    >
      {props.children}
    </surveyFormContext.Provider>
  );
};

export const useSurveyFormContext = () => {
  return useContext(surveyFormContext);
};
