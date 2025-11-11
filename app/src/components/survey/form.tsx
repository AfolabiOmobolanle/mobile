import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../../config/colors";
import font from "../../config/font";
import { useSurveyFormContext } from "../../context/surveyFormContext";
import { useStyleConfig } from "../../services/styles";
import { FieldTypes } from "../../types/field";
import FormBuilder from "./formBuilder";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    containerMain: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
    },
    container: {
      padding: 15,
    },
    title: {
      fontSize: fontSize.h3,
      fontFamily: font.bold,
      color: theme.textDefault,
    },
    floatButton: {
      position: "absolute",
      right: 15,
      bottom: "10%",
      width: 60,
      height: 60,
      backgroundColor: colors.primary,
      zIndex: 1,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },
  });

interface FloatButtonProps {
  onPress: () => void;
}
const FloatButton: React.FC<FloatButtonProps> = ({ onPress }) => {
  const styles = useStyleConfig(getStyles);

  return (
    <TouchableOpacity style={styles.floatButton} onPress={onPress}>
      <View>
        <Feather name="check" size={24} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
};

interface SurveyFormProps {
  name: string;
  id: string | number;
  responseId: string | number;
  location: any;
  fields: FieldTypes[];
  answers: Object;
  onSave: (values?: any) => void;
}
const getFieldDefaultValue = (type: string) => {
  switch (type) {
    case "date":
    case "time":
      return new Date();

    case "number":
      return "0";

    default:
      return "";
  }
};
const SurveyForm: React.FC<SurveyFormProps> = ({
  onSave,
  fields,
  answers = {},
  location,
  name,
  responseId,
  id,
}) => {
  const styles = useStyleConfig(getStyles);

  const getDefaultValues = useCallback(() => {
    const defaultValues: any = {};
    fields.forEach((field) => {
      defaultValues[field.slug] =
        answers[field.slug.toLocaleLowerCase().trim()] ||
        getFieldDefaultValue(field.type);
    });

    return defaultValues;
  }, [fields, answers]);
  const { control, handleSubmit, errors, getValues } = useForm({
    defaultValues: getDefaultValues(),
  });
  const { saveFieldValues, setEditedSurvey } = useSurveyFormContext();

  const getFieldValues = useCallback(() => {
    const values = getValues();

    return fields.map((field) => ({
      type: field.type,
      label: field.label,
      slug: field.slug,
      value: values[field.slug],
    }));
  }, []);

  const submit = () => {
    const values_ = getValues();
    console.log(values_, "testing");
    saveFieldValues(getFieldValues());
    onSave(values_);
  };

  // const submit = useCallback((values: object) => {
  //   console.log("first", values);
  //   saveFieldValues(getFieldValues());
  //   onSave(values);
  // }, []);

  useEffect(() => {
    setEditedSurvey({ name, id, location, responseId });
  }, [name, id, responseId]);

  return (
    <View style={styles.containerMain}>
      <FloatButton onPress={() => submit()} />

      <ScrollView contentContainerStyle={[styles.container, { flex: 1 }]}>
        <FormBuilder fields={fields} control={control} errors={errors} />
      </ScrollView>
    </View>
  );
};

export default SurveyForm;
