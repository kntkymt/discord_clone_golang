import { useEffect } from 'react';
import { User } from '../model/User';
import { useGET } from './api';

export const useMe = () => {
  const { item, loading, load } = useGET<User>(`/private/me`);

  useEffect(() => {
    load();
  }, []);

  return {
    item,
    loading
  };
};
