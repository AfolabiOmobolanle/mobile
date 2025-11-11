export const emailValidate = (value: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(String(value).toLowerCase());

  return isValid ? null : 'Email not valid';
};

export const isRequired = (value: any) => {
  if (!value || value === '') {
    return 'Field is required';
  }

  return null;
};

export const numberValidate = (value: any) => {
  if (isNaN(value)) {
    return 'Field must be a number';
  }

  return null;
};

export const compareValue = (base: string, errorMessage: string) => (
  value: string
) => {
  console.log('base', base);
  if (base !== value) {
    return errorMessage;
  }

  return null;
};
