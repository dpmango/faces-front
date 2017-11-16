import React from 'react';
import { Link } from 'react-router-dom';
import {ShareButtons} from 'react-share';
import { Howl } from 'howler';

// import Menu from './Menu';

import logo from '../images/logo.png'

// https://github.com/nygardk/react-share
const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  EmailShareButton,
} = ShareButtons;

export default class Topbar extends React.Component {
  constructor() {
    super();

    this.state = {
      opened: false,
      sharing: false,
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
    if ( !this.state.audioPlaying ){
      this.bgAudio.play();
      this.setState({
        audioPlaying: true
      })
    }
  }

  componentWillReceiveProps(nextProps){
    // if ( nextProps.willUpdate !== this.props.willUpdate){
      this.setState({
        opened: false,
        sharing: false
      })
    // }
  }

  componentWillUnmount(){
    if ( this.state.audioPlaying ){
      this.bgAudio.stop();
      this.setState({
        audioPlaying: false
      })
    }
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

  shareControl = () => {
    if ( this.state.sharing ){
      this.setState({
        sharing: false
      })
    } else {
      this.setState({
        sharing: true
      })
    }
  }

  toggleMenu = () => {
    // store.dispatch({
    //   type: "TOGGLE_MENU"
    // })
    this.setState({
      opened: !this.state.opened ? true : false
    });
  }

  render(){

    let share = {
      url: window.location.href,
      title: this.props.shareTitle ? 'HD-VISIONS' + this.props.shareTitle : 'HD-VISIONS',
      description: this.props.shareDescription ? this.props.shareDescription : null,
      photo: this.props.shareImage ? this.props.shareImage.thumb.url : window.location.origin + logo
    }

    return(
      <div className="topbar">
        <Link className="topbar__logo" to="/grid">
          <img src={logo} alt="logo"/>
        </Link>
        <Link className="topbar__nav topbar__back-grid btn btn-line" to="/grid">
          <span>НАЗАД</span>
        </Link>
        <div className={`topbar__nav btn btn-line ${this.state.sharing ? 'is-active' : ''} `}>
          <span onClick={this.shareControl.bind(this)}>ПОДЕЛИТЬСЯ</span>
          <div className={`topbar__share ${this.state.sharing ? 'is-active' : ''} `}>
            <VKShareButton className="topbar__share-el btn btn-line" url={share.url} title={share.title} description={share.description} image={share.photo}>
              <span>Вконтакте</span>
            </VKShareButton>
            <FacebookShareButton className="topbar__share-el btn btn-line" url={share.url}>
              <span>Facebook</span>
            </FacebookShareButton>
            <TwitterShareButton className="topbar__share-el btn btn-line" url={share.url} hashtags={['hdvisions']}>
              <span>Twitter</span>
            </TwitterShareButton>

          </div>
        </div>
        <div className={`topbar__nav btn btn-line ${this.state.audioPlaying ? '' : 'is-active'} `} onClick={this.audioControl.bind(this)}>
          <span>ЗВУК</span>
        </div>

        {/* menu */}

        <div className={`hamburger hamburger--squeeze ${this.state.opened ? 'is-active' : ''} `} onClick={this.toggleMenu.bind(this)}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>

        <div className={`menu ${this.state.opened ? 'is-active' : ''} `}>
          <div className="menu__wrapper">
            <div className="menu__navigation">
              <div className="menu__li">
                <Link className="btn btn-line" to='/grid'>
                  <span>UNIVERSE</span>
                </Link>
              </div>
              <div className="menu__li">
                <Link className="btn btn-line" to='/form'>
                  <span>#ДЕЛИСЬВЗГЛЯДОМ</span>
                </Link>
              </div>
              <div className="menu__li">
                <Link className="btn btn-line" to='/about'>
                  <span>О Проекте</span>
                </Link>
              </div>
              <div className="menu__li">
                <Link className="btn btn-line" to='/brand'>
                  <span>О Бренде</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
