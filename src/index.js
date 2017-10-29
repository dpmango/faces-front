import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Howl } from 'howler';

import Intro from './components/Intro';
import Grid from './components/Grid';
import Profile from './components/Profile';
import ProfileForm from './components/ProfileForm';
import Page from './components/Page';

import './css/app.css';

class Root extends React.Component {
  constructor() {
    super();
    this.bgAudio = new Howl({
      src: ['/piano2.mp3'],
      loop: true,
      volume: 0.25,
      rate: 0.70
    });
  };

  componentDidMount() {
    this.bgAudio.play();
  }
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Intro} />
          <Route path="/form" component={ProfileForm} />
          <Route exact path="/grid" component={Grid} />
          <Route path="/grid/:uuid" component={Profile} />
          <Route path="/:pagename" component={Page} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('app'));
