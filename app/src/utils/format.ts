import moment from "moment";

export const formatSlugToNormal = (slug: string = "") =>
  slug.split("-").join(" ");

//check if array of object
function isArrayOfObjects(value: any) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" && item !== null && !Array.isArray(item)
    )
  );
}
export const formatValueToText = (
  type: string = "",
  value: unknown
): string => {
  if (value instanceof Date) {
    const format = type === "time" ? "h:mm a" : "MMM Do YY";

    return moment(value).format(format);
  }

  const resultIsArrayOfObjects = isArrayOfObjects(value);
  if (resultIsArrayOfObjects && type === "file") {
    console.log("yes..");
    let names = [];
    for (let index = 0; index < value?.length; index++) {
      names.push(value[index]["name"]);
    }
    return names.join(", ");
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (type.toLocaleLowerCase() === "file") {
    return typeof value === "object" ? value.name : `${value}`;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return `${value}`;
};

export const normalizeValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
};

export const flattenSubmissionRes = (res: Array<any>) => {
  return res.reduce(
    (obj, item) => {
      const newObj = JSON.parse(item);
      if (newObj.file) {
        return { ...obj, files: [...obj.files, newObj.file] };
      }
      return { ...obj, ...objectKeyToLowercase(newObj) };
    },
    { files: [] }
  );
};

export const objectKeyToLowercase = (obj = {}) => {
  let newObj = {};

  Object.entries(obj).forEach(([key, value]) => {
    newObj = { ...newObj, [key.toLocaleLowerCase().trim()]: value };
  });

  return newObj;
};

export const formatSurveyGraphRes = (data: Array<any>) => {
  return data.reduce(
    (obj, item) => ({
      ...obj,
      ...{ [item.Month.toLowerCase().trim()]: item.count },
    }),
    {}
  );
  // return flattenSubmissionRes(data);
};
