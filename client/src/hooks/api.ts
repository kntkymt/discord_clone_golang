import axios from "axios";
import { useState } from "react";
import { constants } from "../config/constants";

axios.defaults.baseURL = constants.baseURL;
axios.defaults.withCredentials = true;

export const useGET = <T>(path: string) => {
  // 本当はundefinedがよい?
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const parse = (data: any) => {
    // createTime, updateTimeを取り出してDateにパースし、合体し直す
    type TimelessT = Omit<T, 'createTime' | 'updateTime'>
    const timelessObject = data as TimelessT;

    const createTime = new Date(data.createTime);
    const updateTime = new Date(data.updateTime);

    // 一度unknownにしないとキャストできない
    const object: unknown = {
      ...timelessObject,
      createTime: createTime,
      updateTime: updateTime
    };

    // キャストに失敗した場合にthrowしたいが、ジェネリクスだと上手くチェックできない?
    return object as T;
  };

  const load = async() => {
    setLoading(true);
    const response = await axios.get(path);
    setItem(parse(response.data));
    setLoading(false);
  };

  return {
    load,
    item,
    loading
  };
};

export const useGETArray = <T>(path: string) => {
  // 本当はundefinedがよい?
  const [item, setItem] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const parse = (data: any) => {
    const array = data as any[];

    const objectArray = array.map(value => {
      type TimelessT = Omit<T, 'createTime' | 'updateTime'>
      const timelessObject = value as TimelessT;

      const createTime = new Date(value.createTime);
      const updateTime = new Date(value.updateTime);

      const object: unknown = {
        ...timelessObject,
        createTime: createTime,
        updateTime: updateTime
      };

      return object as T;
    });

    return objectArray;
  };

  const load = async() => {
    setLoading(true);
    const response = await axios.get(path);
    setItem(parse(response.data));
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
