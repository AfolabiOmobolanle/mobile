import { create } from "apisauce";
import { useState, useCallback, useEffect } from "react";
import { useMountState } from "./mounted";
import { useAuth } from "./auth";
import { useFocusEffect } from "@react-navigation/native";
import config from "../../config";
import { fileExtensionTypeMapping, getExtension } from "../utils/file";

export const API_BASE_URL = `${config.API_URL}/api/v1/`;

const api = create({
  baseURL: API_BASE_URL,
  // headers: { "content-type": "multipart/form-data" },
});

api.addResponseTransform((response) => {
  if (response.problem === "CLIENT_ERROR" || response.data) {
    const data = response.data || {};
    const error = data.error || data.responseMessage || data.message;
    response.problem = typeof error === "string" ? error : "An error ocurred";
  } else if (response.problem) {
    response.problem = response.problem.split("_").join(" ").toLowerCase();
  }
});

export let token: string;
const setToken = (_token: string) => (token = _token);
api.addAsyncRequestTransform((req) => async () => {
  if (token) {
    req.headers.Authorization = token;
  }
});

export default api;

interface UseApiArgs {
  method: "get" | "post" | "delete" | "patch" | "put";
  path: String;
  executeOnMount?: Boolean;
  refetchOnFocus?: boolean;
}
interface UseApiStateType {
  error: null | string | Object;
  loading: boolean;
  res: null | Object;
  success: null | string | Object;
}
export const useApi = ({
  method,
  path,
  executeOnMount,
  refetchOnFocus = true,
}: UseApiArgs): [UseApiStateType, (data?: any) => void] => {
  const mounted = useMountState();
  const { auth } = useAuth();
  const [state, updateState] = useState({
    error: null,
    success: false,
    loading: false,
    res: null,
  });

  const setState = useCallback(
    (newState) => updateState((prevState) => ({ ...prevState, ...newState })),
    [updateState]
  );

  const execute = useCallback(
    async (...args) => {
      setState({ error: null, loading: true, success: false });

      const res = await api[method](path, ...args);

      if (!mounted) {
        return;
      }

      if (res.ok) {
        setState({ loading: false, res: res.data, success: true });
      } else {
        setState({ loading: false, error: res.problem });
      }

      return res;
    },
    [path, method]
  );

  const effectHook = refetchOnFocus ? useFocusEffect : useEffect;

  useEffect(() => {
    if (auth) {
      setToken(auth.token);
      return;
    }

    setToken(null);
  }, [auth]);

  effectHook(
    useCallback(() => {
      if (executeOnMount) {
        execute();
      }
    }, [execute])
  );

  return [state, execute];
};

export const uploadFile = async (file: any) => {
  try {
    const data = new FormData();
    const type = fileExtensionTypeMapping[getExtension(file.name)];
    data.append("image", {
      uri: file.uri,
      type,
      name: file.name,
    });

    const uploadRes = await api.post(
      "data_collector/survey_response/upload",
      data,
      { headers: { "content-type": "multipart/form-data" } }
    );

    const fileName = file.name; //uploadRes.data.data;
    return fileName;
  } catch (e) {
    console.log("error ON UPLOAD", e);
  }
};
