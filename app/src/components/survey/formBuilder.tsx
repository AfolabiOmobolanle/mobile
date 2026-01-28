import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import { Modal } from "react-native";
import { Platform } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  Checkbox,
  RadioButton,
} from "react-native-paper";
import colors from "../../config/colors";
import font from "../../config/font";
import { isRequired, numberValidate } from "../../services/form-validator";
import { useStyleConfig } from "../../services/styles";
import { useTheme } from "../../services/theme";
import { FieldTypes } from "../../types/field";

const getStyles = ({ theme, fontSize }) =>
  StyleSheet.create({
    inputWrapper: {
      marginBottom: 25,
    },
    label: {
      fontFamily: font.regular,
      marginBottom: 5,
      color: theme.textDefault,
      fontSize: fontSize.p1,
    },
    formGroup: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    checkboxItem: {
      marginRight: 20,
    },
    inputFieldError: {
      color: "red",
    },
    inputStyle: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.textCaption,
      color: "#000000",
      padding: 5,
      backgroundColor: "white",
    },
    fileInputWrapper: {
      marginBottom: 20,
    },
    fileInputText: {
      fontFamily: font.regular,
      color: theme.textDefault,
      fontSize: fontSize.p,
      marginVertical: 10,
    },
  });

interface RadioItemPropTypes {
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  value: string;
}

const RadioItem: React.FC<RadioItemPropTypes> = ({
  value,
  onChange,
  label,
  checked,
}) => {
  const styles = useStyleConfig(getStyles);

  const handleChange = () => {
    onChange(value);
  };

  return (
    <View
      style={[
        { ...styles.formGroup, ...styles.checkboxItem },
        { alignItems: "center" },
      ]}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor: "lightgrey",
          borderRadius: 100,
          height: 20,
          width: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 4,
        }}
      >
        <RadioButton.Android
          value={value}
          status={checked ? "checked" : "unchecked"}
          onPress={handleChange}
          color={colors.primary}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

interface RadioPropTypes {
  value: string | number;
  onChange: (value: string | number) => void;
  options: string[];
  label: string;
  error: any;
}

const Radio: React.FC<RadioPropTypes> = ({
  value,
  onChange,
  options,
  label,
  error,
}) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.formGroup}>
        {options.map((opt: string) => (
          <RadioItem
            key={opt}
            value={opt}
            label={opt}
            checked={value === opt}
            onChange={onChange}
          />
        ))}
      </View>
      <Text style={styles.inputFieldError}>{error && error.message}</Text>
    </View>
  );
};

interface CheckItemPropTypes {
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  value: string;
}

const CheckItem: React.FC<CheckItemPropTypes> = ({
  checked,
  onChange,
  label,
  value,
}) => {
  const styles = useStyleConfig(getStyles);

  const handleChange = useCallback(() => onChange(value), [onChange, value]);

  return (
    <View
      style={[
        { ...styles.formGroup, ...styles.checkboxItem },
        { alignItems: "center" },
      ]}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor: "lightgrey",
          height: 20,
          width: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          marginBottom: 15,
        }}
      >
        <Checkbox.Android
          status={checked ? "checked" : "unchecked"}
          onPress={handleChange}
          color={colors.primary}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

interface CheckPropTypes {
  options: Array<string>;
  label: string;
  onChange: (value: any) => void;
  value: any;
  error: any;
}

const Check: React.FC<CheckPropTypes> = ({
  options,
  label,
  onChange,
  value = [],
  error,
}) => {
  const styles = useStyleConfig(getStyles);

  const itemIsChecked = useCallback(
    (opt: string) => value.includes(opt),
    [value]
  );

  const itemChangeHandler = useCallback(
    (opt: string) =>
      onChange(
        value.includes(opt)
          ? value.filter((item: string) => item !== opt)
          : [...value, opt]
      ),
    [value, onChange]
  );

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.formGroup}>
        {options.map((opt: string) => (
          <CheckItem
            key={opt}
            checked={itemIsChecked(opt)}
            onChange={itemChangeHandler}
            label={opt}
            value={opt}
          />
        ))}
      </View>
      <Text style={styles.inputFieldError}>{error && error.message}</Text>
    </View>
  );
};

export const Input = ({
  label,
  error,
  onChange,
  numberOfLines,
  placeholder,
  ...props
}: any) => {
  const styles = useStyleConfig(getStyles);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        numberOfLines={numberOfLines}
        onChangeText={onChange}
        placeholder={placeholder}
        style={{
          color: "black",
          backgroundColor: "white",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "lightgray",
          height: 48,
          paddingHorizontal: 12,
        }}
      />
      <Text style={styles.inputFieldError}>{error && error.message}</Text>
    </View>
  );
};
interface SelectPropTypes {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: Array<string>;
  onBlur: () => void;
  error: any;
}

const Select: React.FC<SelectPropTypes> = ({
  label,
  value,
  onChange,
  options = [],
  onBlur,
  error,
}) => {
  const styles = useStyleConfig(getStyles);
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find((opt) => opt === value) || "Select...";

  // iOS modal picker
  if (Platform.OS === "ios") {
    return (
      <View style={[styles.inputWrapper, { marginVertical: 20 }]}>
        <Text style={styles.label}>{label}</Text>
        
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderRadius: 5,
            backgroundColor: "white",
            padding: 12,
            height: 48,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: value ? "black" : "gray" }}>
            {selectedLabel}
          </Text>
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View style={{ backgroundColor: "white" }}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ padding: 15, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.primary,
                    fontWeight: "600",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
              <ScrollView style={{ maxHeight: 300 }}>
                {options.map((opt: string) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      onChange(opt);
                      setVisible(false);
                    }}
                    style={{
                      paddingVertical: 15,
                      paddingHorizontal: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0",
                      backgroundColor: value === opt ? "#f5f5f5" : "white",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: value === opt ? colors.primary : "black",
                        fontWeight: value === opt ? "600" : "400",
                      }}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Text style={styles.inputFieldError}>{error && error.message}</Text>
      </View>
    );
  }

  // Android native picker
  return (
    <View style={[styles.inputWrapper, { marginVertical: 20 }]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "lightgray",
          borderRadius: 5,
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={{
            height: 48,
            color: "black",
          }}
        >
          <Picker.Item label="Select..." value="" />
          {options.map((opt: string) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
      <Text style={styles.inputFieldError}>{error && error.message}</Text>
    </View>
  );
};





const DateTimeInput = ({
  onChange,
  value = new Date(),
  label,
  mode,
  error,
}: any) => {
  const styles = useStyleConfig(getStyles);

  const inputDisplay =
    mode === "date"
      ? moment(value).format("MMM Do YY")
      : moment(value).format("h:mm a");

  const [show, setShow] = useState(false);

  const handleChange = useCallback(
    (event: any, date: any) => {
      setShow(false);
      if (date) {
        onChange(date);
      }
    },
    [onChange]
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setShow(true)}>
        <View style={styles.inputWrapper} pointerEvents="none">
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={inputDisplay}
            editable={false}
            style={{
              color: "black",
              height: 48,
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
              paddingHorizontal: 12,
            }}
          />
          <Text style={styles.inputFieldError}>{error && error?.message}</Text>
        </View>
      </TouchableWithoutFeedback>
      {show && (
        <DateTimePicker
          value={new Date(value)}
          mode={mode as "date" | "time"}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export const FileInput = ({ label, value, onChange, error }: any) => {
  const styles = useStyleConfig(getStyles);

  const handlePress = useCallback(async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
    });

    if (!res.canceled && res.assets?.length > 0) {
      onChange(res.assets);
    }
  }, [onChange]);

  return (
    <View style={styles.fileInputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputStyle, { padding: 0 }]}>
        {!value ? (
          <TouchableOpacity onPress={handlePress} style={{ padding: 15 }}>
            <Text style={{ ...styles.fileInputText, opacity: 0.8 }}>
              Click and Select File To Upload
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={handlePress}>
              <Image
                source={{ uri: value.uri || value?.[0]?.uri }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onChange(null)}
              style={{
                marginTop: 10,
                alignSelf: "flex-end",
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  color: "#d00",
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.inputFieldError}>{error && error.message}</Text>
    </View>
  );
};

const getFieldComponent = (type: string) => {
  const lowerType = type.toLowerCase();

  switch (lowerType) {
    case "checkbox":
    case "check-box":
      return (props: any) => <Check {...props} />;

    case "select":
    case "dropdown":
      return (props: any) => <Select {...props} />;

    case "date":
    case "time":
      return (props: any) => <DateTimeInput {...props} mode={lowerType} />;

    case "radio":
    case "radio-box":
    case "radio-button":
      return (props: any) => <Radio {...props} />;

    case "file":
      return FileInput;

    default:
      const isTextArea = ["textarea", "paragraph", "text-area"].includes(
        lowerType
      );
      return (props: any) => (
        <Input
          {...props}
          multiline={isTextArea}
          {...(isTextArea && { numberOfLines: 10 })}
        />
      );
  }
};

interface BuildFieldArgsTypes {
  label: string;
  slug: string;
  required: boolean;
  type: string;
  options?: Array<any>;
  control: any;
  errors: any;
}

const BuildField = ({
  label,
  slug,
  required,
  type,
  options = [],
  control,
  errors,
}: BuildFieldArgsTypes) => {
  const Field = getFieldComponent(type);
  const isNumber = type === "number";

  return (
    <Controller
      key={slug}
      name={slug}
      control={control}
      rules={{
        validate: {
          ...(required && { required: isRequired }),
          ...(isNumber && { numberValidate }),
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
          label={label}
          name={slug}
          options={options}
          onBlur={onBlur}
          onChangeText={onChange}
          onChange={onChange}
          value={value}
          error={errors?.[slug]}
        />
      )}
    />
  );
};

interface FormBuilderPropTypes {
  fields: Array<FieldTypes>;
  control: any;
  errors: any;
}

const FormBuilder: React.FC<FormBuilderPropTypes> = ({
  fields,
  control,
  errors,
}) => {
  const formFields = fields.map((field) => (
    <BuildField key={field.slug} {...{ ...field, control, errors }} />
  ));

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 600 }}
      showsVerticalScrollIndicator={false}
    >
      {formFields}
    </ScrollView>
  );
};

export default FormBuilder;