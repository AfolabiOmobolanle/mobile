import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { screenStyle } from "../../styles";
import SecondaryHeader from "../../../components/common/secondayHeader";
import SurveyForm from "../../../components/survey/form";
import HeaderGroup from "../../../components/common/headerGroup";
import { useApi } from "../../../services/api";
import LoadManager from "../../../components/common/loadManager";
import { flattenSubmissionRes } from "../../../utils/format";
import { useAuth } from "../../../services/auth";

const FillSurveyScreen = ({ navigation, route }) => {
  const { surveyId, responseId } = route.params;
  const { token } = useAuth(); // Add this to get token
  const [assignmentData, setAssignmentData] = useState(null);

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

  // DEBUG: Log survey assignment data when loaded
  useEffect(() => {
    if (surveyResponse?.data) {
      const surveyData = surveyResponse.data;

      if (Array.isArray(surveyData.assignedTo)) {
        surveyData.assignedTo.forEach((item, idx) => {
        });
      } else if (typeof surveyData.assignedTo === "object") {
        console.log("Assignment Keys Count:", Object.keys(surveyData.assignedTo || {}).length);
      } else {
        console.log("Assignment Value:", surveyData.assignedTo);
      }
    }
  }, [surveyResponse]);

  // Fetch assignment check
  useEffect(() => {
    if (surveyId && token) {
      fetch(
        `https://core.eko360.ng/api/v1/admin/survey/checkAssignment/${surveyId}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
        .then(res => res.json())
        .then(data => {
          setAssignmentData(data);
        })
        .catch(err => {
          console.error("Assignment check failed:", err);
        });
    }
  }, [surveyId, token]);

  useEffect(() => {
    fetchSurvey();
    fetchResponse();
  }, [surveyId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaView>
  );
};

export default FillSurveyScreen;