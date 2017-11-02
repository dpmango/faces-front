import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Intro from './components/Intro';
import Grid from './components/Grid';
import Profile from './components/Profile';
import SubmitProfile from './components/SubmitProfile';
import Page from './components/Page';

import './css/app.css';

import appStore from './reducers';
let store = createStore(appStore)

class Root extends React.Component {
  render(){
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Intro} />
            <Route exact path="/grid" component={Grid} />
            <Route path="/grid/:uuid" component={Profile} />
            <Route path="/form" component={SubmitProfile} />
            <Route path="/:pagename" component={Page} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('app')
);
