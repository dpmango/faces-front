import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Intro from './components/Intro';
import Grid from './components/Grid';
import Profile from './components/Profile';
import ProfileForm from './components/ProfileForm';

import './css/app.css';

const Root = function() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Intro} />
        <Route path="/form" component={ProfileForm} />
        <Route exact path="/grid" component={Grid} />
        <Route path="/grid/:uuid" component={Profile} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<Root />, document.getElementById('app'));
