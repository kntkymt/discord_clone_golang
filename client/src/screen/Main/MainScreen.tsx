/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { ServersScreen } from '../Servers/ServersScreen';

export const MainScreen: FunctionComponent = () => {
  const history = useHistory();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin, history]);

  return (
    <ServersScreen />
  );
};

