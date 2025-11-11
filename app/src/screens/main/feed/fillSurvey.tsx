import React, { useCallback, useContext, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";

import { screenStyle } from "../../styles";
import SecondaryHeader from "../../../components/common/secondayHeader";
import SurveyForm from "../../../components/survey/form";
import HeaderGroup from "../../../components/common/headerGroup";
import { useApi } from "../../../services/api";
import LoadManager from "../../../components/common/loadManager";
import { flattenSubmissionRes } from "../../../utils/format";
import { useAuth } from "../../../services/auth";
// import { UserActivityContext } from "../../../services/userActivity";
// import UserInactivity from "react-native-user-inactivity";

const FillSurveyScreen = ({ navigation, route }) => {
  const { surveyId, responseId } = route.params;
  const gotoPreview = useCallback(
    () => navigation.navigate("previewSurvey"),
    []
  );
  const handleBack = useCallback(() => navigation.goBack(), []);

  const [
    { loading: loadingSurvey, res: surveyResponse, error: surveyError },
    fetchSurvey,
  ] = useApi({
    method: "get",
    path: `admin/survey/getOne/${surveyId}`,
  });
  const [
    { loading: loadingResponse, res: response, error: responseError },
    fetchResponse,
  ] = useApi({
    method: "get",
    path: `data_collector/survey_response/getOne/${responseId}`,
  });

  const answers =
    responseId && response && response.data && response.data.responses
      ? flattenSubmissionRes(response.data.responses)
      : {};

  const survey =
    surveyResponse && surveyResponse.data
      ? {
          name: surveyResponse.data.name,
          id: surveyResponse.data.id,
          fields: surveyResponse.data.survey_fields,
          location: surveyResponse.data.location,
          responseId,
        }
      : { fields: [] };

  const { clearAuth } = useAuth();
  // const { active, setActive, timer } = useContext(UserActivityContext);

  useEffect(() => {
    fetchSurvey();
    fetchResponse();
  }, [surveyId]);

  // useEffect(() => {
  //   setActive(true);
  // }, []);

  // useEffect(() => {
  //   if (!active) {
  //     clearAuth();
  //   }
  // }, [active]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <UserInactivity
        isActive={active}
        timeForInactivity={timer}
        onAction={(isActive) => {
          setActive(isActive);
        }}
        style={{ flex: 1 }}
      > */}
      <SecondaryHeader
        title={survey.name || "Survey"}
        onBack={handleBack}
        rightContent={<HeaderGroup navigation={navigation} />}
      />
      <LoadManager
        loading={loadingSurvey || (loadingResponse && responseId)}
        error={surveyError}
        errorMessage={surveyError}
      >
        <SurveyForm {...survey} answers={answers} onSave={gotoPreview} />
      </LoadManager>
      {/* </UserInactivity> */}
    </SafeAreaView>
  );
};

export default FillSurveyScreen;
