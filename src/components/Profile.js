import React from 'react';
import api from '../constructor/Api';
import { Link, withRouter } from 'react-router-dom';
import {Helmet} from "react-helmet";

import { TweenMax, Back } from 'gsap';

import UnaFilter from '../filters/UnaFilter';

import Topbar from './Topbar';

export default class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      post: null,
      muteAudio: false
    }
  }

  componentWillMount() {
    const postId = this.props.match.params.uuid;

    this.getProfile(postId);
  }

  getProfile = (postId, delay) =>{
    api.get(`posts/${postId}`, {
      context: this
    }).then(post => {
      if ( delay ){
        let _that = this;
        let cacheImg = new Image();
        cacheImg.onload = () => {
          setTimeout(function(){
            _that.setState({
              post: post.data
            });
          }, delay);

          setTimeout(function(){
            _that.animateTransition();
            _that.hookYoutube();
          }, delay + 300);
        }
        cacheImg.src = post.data.photo.url;

        this.animateBack();

        this.props.history.push('/profile/' + postId )

      } else {
        this.setState({
          post: post.data
        });
        this.animateTransition();
        this.hookYoutube();
      }

    });
  }

  animateTransition = () => {
    TweenMax.to(this.imgWithFilter, 1, {opacity: 1, x: '0%', ease: Back.easeOut.config(1.7)});
    TweenMax.to('.profile-animation', 1, {opacity: 1, y: '0%', delay: 0.5, ease: Back.easeOut.config(1.7)});
  }

  animateBack = () => {
    TweenMax.to(this.imgWithFilter, 1, {opacity: 0, x: '-20%', ease: Back.easeOut.config(1.7)});
    TweenMax.to('.profile-animation', 1, {opacity: 0, y: '-50px', delay: 0.5, ease: Back.easeOut.config(1.7)});
  }


  renderFilter = (photo) => {
    return <img src={photo.url} />
    // return <UnaFilter photo={photo} />
  }

  prevProfile = () => {
    let prevPost = this.state.post.prev_post.id
    // let nextPost = this.state.post.id - 1;
    this.getProfile(prevPost, 700);
    this.hoverOutLink();
  }

  nextProfile = () => {
    let nextPost = this.state.post.next_post.id
    // let nextPost = this.state.post.id + 1;
    this.getProfile(nextPost, 700);
    this.hoverOutLink();
  }

  hoverOutLink = () => {
    var mouseMoveEvent = document.createEvent("MouseEvents");

    mouseMoveEvent.initMouseEvent(
       "mouseout", //event type : click, mousedown, mouseup, mouseover, mousemove, mouseout.
       true, //canBubble
       false, //cancelable
       window, //event's AbstractView : should be window
       1, // detail : Event's mouse click count
       50, // screenX
       50, // screenY
       50, // clientX
       50, // clientY
       false, // ctrlKey
       false, // altKey
       false, // shiftKey
       false, // metaKey
       0, // button : 0 = click, 1 = middle button, 2 = right button
       null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
    );

    document.querySelector('.profile-info__prev .btn').dispatchEvent(mouseMoveEvent)
    document.querySelector('.profile-info__next .btn').dispatchEvent(mouseMoveEvent)
  }

  hookYoutube = () => {
    var element = document.querySelector('iframe')

    // console.log(element)
    element.setAttribute('allowfullscreen', "1")

    element.setAttribute('src', element.getAttribute('src') + "version=3&enablejsapi=1")
    if (element){
      element.contentDocument.addEventListener('onStateChange', 'player_state_changed');

      element.contentDocument.addEventListener('click', function(){
        // alert('click')
      })
    }

    function player_state_changed(state) {
      /* This event is fired whenever the player's state changes.
         Possible values are:
         - unstarted (-1)
         - ended (0)
         - playing (1)
         - paused (2)
         - buffering (3)
         - video cued (5).
         When the SWF is first loaded it will broadcast an unstarted (-1) event.
         When the video is cued and ready to play it will broadcast a video cued event (5).
      */
      if (state == 1 || state == 2) {
        alert('the "play" button *might* have been clicked');
      }

    }

  }

  muteAudio = () => {
    this.setState({
      muteAudio: true
    })
  }

  renderPrevBtn = () => {
    if (this.state.post.prev_post){
      return(
        <div className="profile-info__prev" onClick={this.prevProfile.bind(this)}>
          <div className="btn btn-line">
            <span>Предыдущий</span>
          </div>
        </div>
      )
    } else {
      return
    }
  }
  renderNextBtn = () => {
    if (this.state.post.next_post){
      return(
        <div className="profile-info__next" onClick={this.nextProfile.bind(this)}>
          <div className="btn btn-line">
            <span>Следующий</span>
          </div>
        </div>
      )
    } else {
      return
    }
  }

  render() {
    const { post } = this.state;

    if (!this.state.post) {
      return (
        <div className="page-loading">
          <div className='preloader-squares'>
            <div className='square'></div>
            <div className='square'></div>
            <div className='square'></div>
            <div className='square'></div>
          </div>
          <p className="preloader-name">Загрузка...</p>
        </div>
      )
    }

    return (
      <div className="profile">
        <Helmet>
          <title>{post.seo_title || post.name} || HD VISIONS</title>
          <meta name="keywords" content={post.seo_keywords} />
          <meta name="description" content={post.seo_description} />
        </Helmet>
        <Topbar category={post.category} audio={this.state.muteAudio} shareTitle={post.seo_title || post.name} shareDescription={post.seo_keywords || post.description} shareImage={post.photo}/>

        <div className="profile__wrapper">
          <div className="profile-image" ref={(div) => this.imgWithFilter = div}>
            {this.renderFilter(post.photo)}
          </div>

          <div className="profile-info">
            <div className="profile-info__fixed">
              <h1 className="profile-info__name profile-animation">
                <span>{post.name}</span>
              </h1>
              <h3 className="profile-info__position profile-animation">{post.position.toUpperCase()}</h3>
            </div>
            <p className="profile-info__content profile-animation" onClick={this.muteAudio} ref={(div) => this.contentEl = div} dangerouslySetInnerHTML={{ __html: post.description }} />
          </div>
          {this.renderPrevBtn()}
          {this.renderNextBtn()}
          {/* <div className="profile-info__prev" onClick={this.prevProfile.bind(this)}>
            <div className="btn btn-line">
              <span>Предыдущий</span>
            </div>
          </div>
          <div className="profile-info__next" onClick={this.nextProfile.bind(this)}>
            <div className="btn btn-line">
              <span>Следующий</span>
            </div>
          </div> */}

        </div>
      </div>
    );
  }
}
