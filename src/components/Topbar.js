import React from 'react';
import { Link } from 'react-router-dom';

import { Howl } from 'howler';

import Menu from './Menu'

export default class Topbar extends React.Component {
  constructor() {
    super();

    this.state = {
      opened: false,
      audioPlaying: false
    }
    this.bgAudio = new Howl({
      src: ['/piano2.mp3'],
      loop: true,
      volume: 0.25,
      rate: 0.70
    });
  }

  componentDidMount(){
    this.bgAudio.play();
    this.setState({
      audioPlaying: true
    })
  }

  audioControl = () => {
    if ( this.state.audioPlaying ){
      this.bgAudio.pause();
      this.setState({
        audioPlaying: false
      })
    } else {
      this.bgAudio.play();
      this.setState({
        audioPlaying: true
      })
    }
  }

  render(){
    return(
      <div className="topbar">
        <div className="topbar__nav btn btn-line">
          <span>ПОДЕЛИТЬСЯ</span>
        </div>
        <div className={`topbar__nav btn btn-line ${this.state.audioPlaying ? '' : 'is-active'} `} onClick={this.audioControl.bind(this)}>
          <span>ЗВУК</span>
        </div>
        <Menu />
      </div>
    )
  }

}
