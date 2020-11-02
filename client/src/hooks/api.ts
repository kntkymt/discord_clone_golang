import axios from "axios";
import { useState } from "react";
import { constants } from "../config/constants";

axios.defaults.baseURL = constants.baseURL;
axios.defaults.withCredentials = true;

export const useGET = <T>(path: string) => {
  // 本当はundefinedがよい?
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async() => {
    setLoading(true);
    const response = await axios.get(path);
    setItem(response.data as T);
    setLoading(false);
  };

  return {
    load,
    item,
    loading
  };
};

export const usePOST = <T>(path: string) => {
  const [loading, setLoading] = useState(false);

  const send = async(item: T) => {
    setLoading(true);
    const response = await axios.post(path, item);
    setLoading(false);
  };

  return {
    send,
    loading
  };
};

export const useDELETE = (path: string) => {
  const [loading, setLoading] = useState(false);

  const send = async() => {
    setLoading(true);
    await axios.delete(path);
    setLoading(false);
  };

  return {
    send,
    loading
  };
};
