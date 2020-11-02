/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginScreen } from '../screen/Login/LoginScreen';
import { MainScreen } from '../screen/Main/MainScreen';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={LoginScreen} />
        <Route path="/" component={MainScreen} />
      </Switch>
    </div>
  );
}

export default App;
