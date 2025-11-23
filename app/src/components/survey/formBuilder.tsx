import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View,Image} from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  Checkbox,
  RadioButton,
  TextInput as TextInput_,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import colors from "../../config/colors";
import font from "../../config/font";
import { isRequired, numberValidate } from "../../services/form-validator";
import { useStyleConfig } from "../../services/styles";
import { useTheme } from "../../services/theme";
import { FieldTypes } from "../../types/field";

import { useEffect } from "react";

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
      // alignItems: 'center',
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
      // color: theme.textDefault,
      color: "#000000",
      padding: 5,
      // height: 50,
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
          onPress={() => handleChange()}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.label]}>{label}</Text>
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
            onChange={() => {
              onChange(opt);
            }}
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

  const handleChange = useCallback(() => onChange(value), [onChange]);

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
    [itemIsChecked, value]
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
  style,
  onChange,
  numberOfLines,
  placeholder,
  ...props
}: any) => {
  const styles = useStyleConfig(getStyles);
  const { themeConfig } = useTheme();

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        numberOfLines={numberOfLines}
        theme={{ colors: { text: themeConfig.textDefault } }}
        onChangeText={onChange}
        dense
        underlineColor="transparent"
        placeholder={placeholder}
        style={{
          color: "black",
          backgroundColor: "white",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "lightgray",
          height: 48,
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
  const { themeConfig, isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [radiovalue, setValue] = useState("");
  const [show, setShow] = useState(false);
  options = options ? options.map((opt) => ({ value: opt, label: opt })) : [];

  useEffect(() => {
    if (onChange) onChange(radiovalue);
  }, [radiovalue]);

  return (
    <View style={[styles.inputWrapper, { marginVertical: 20 }]}>
      <Text style={styles.label}>{label}</Text>
      {/* <DropDownPicker
        style={{ backgroundColor: "white" }}
        open={open}
        value={radiovalue}
        items={options}
        setOpen={setOpen}
        setValue={setValue}
        // onChangeValue={(val) => {
        //   // console.log(value);
        // }}
        // maxHeight={200}

        // setItems={onChange}
      /> */}
      <DropDown
        value={radiovalue}
        setValue={setValue}
        dropDownItemStyle={{ backgroundColor: "white" }}
        dropDownItemSelectedStyle={{
          backgroundColor: "lightgray",
        }}
        dropDownStyle={{
          borderColor: "#322b7c",
          borderWidth: 0.7,
          borderRadius: 4,
          borderStyle: "solid",
          backgroundColor: "white",
        }}
        list={options}
        visible={show}
        showDropDown={() => setShow(true)}
        onDismiss={() => setShow(false)}
        // theme={{
        //   colors: { text: themeConfig.textDefault },
        //   dark: isDarkMode,
        // }}
        inputProps={{
          right: (
            <TextInput_.Icon name={"menu-down"} onPress={() => setShow(true)} />
          ),

          // dense: true,
          onBlur,
          pointerEvents: "none",
          editable: false,

          style: {
            height: 48,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "lightgray",
            color: "black",
            borderRadius: 5,
          },
          underlineColor: "transparent",
        }}
      />
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
}) => {
  const styles = useStyleConfig(getStyles);
  const { themeConfig } = useTheme();

  const inputDisplay =
    mode === "date"
      ? moment(value).format("MMM Do YY")
      : moment(value).format("h:mm a");

  const [show, setShow] = useState(false);
  const handleChange = useCallback(
    (event: null, date) => {
      setShow(false);
      onChange(date);
    },
    [setShow, onChange]
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setShow(true)}>
        <View style={styles.inputWrapper} pointerEvents="none">
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={inputDisplay}
            // dense
            editable={false}
            style={{
              color: "black",
              height: 48,
              borderWidth: 1,
              borderColor: "lightgray",
              borderRadius: 5,
            }}
            // theme={{ colors: { text: themeConfig.textDefault } }}
          />
          <Text style={styles.inputFieldError}>{error && error?.message}</Text>
        </View>
      </TouchableWithoutFeedback>
      {show && (
        <DateTimePicker
          value={new Date(value)}
          mode={mode}
          v
          onChange={handleChange}
        />
      )}
    </>
  );
};

export const FileInput = ({ label, value, onChange, error }) => {
  const styles = useStyleConfig(getStyles);
  const valueIsString = typeof value === "string";

  const handlePress = useCallback(async () => {
    DocumentPicker.getDocumentAsync({
      // type: ["image/*", "application/pdf"],
      type: "*/*", // Allow all file types
      multiple: true,
    }).then((res) => {
      console.log(res, "===");
      if (res.assets?.length > 0) {
        onChange(res?.assets);
      }
    });

    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   aspect: [4, 3],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   onChange(result);
    // }
    // Alert.alert("", "Do you want to select an IMAGE?", [
    //   {
    //     text: "No",
    //     onPress: () => {

    //     },
    //   },
    //   {
    //     text: "Yes",
    //     onPress: async () => {

    //     },
    //   },
    // ]);
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
        {/* IMAGE PREVIEW */}
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

        {/* REMOVE BUTTON BELOW IMAGE */}
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
  type = type.toLowerCase();

  switch (type) {
    case "checkbox":
    case "check-box":
      return (props: any) => <Check {...props} />;

    case "select":
    case "dropdown":
      return (props: any) => <Select {...props} />;

    case "date":
    case "time":
      return (props: any) => <DateTimeInput {...props} mode={type} />;

    case "radio":
    case "radio-box":
    case "radio-button":
      return (props: any) => <Radio {...props} />;

    case "file":
      return FileInput;

    default:
      const isTextArea = ["textarea", "paragraph", "text-area"].includes(type);
      return (props: any) => (
        <Input
          {...props}
          multiline={isTextArea}
          {...(isTextArea && { numberOfLines: 10 })}
        />
      );
  }
};

interface buildFieldArgsTypes {
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
}: buildFieldArgsTypes) => {
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
      // render={({ onBlur, onChange, value }) => (
      render={({ field: { onChange, onBlur, value } }) => (
        <Field
          label={label}
          name={slug}
          options={options}
          onBlur={onBlur}
          onChangeText={onChange}
          onChange={onChange}
          value={value}
          error={errors?.slug}
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
