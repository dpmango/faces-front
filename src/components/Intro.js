import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../constructor/Api'
import { TweenMax, Back } from 'gsap';

import Topbar from './Topbar';

export default class Intro extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.animateIntro();
    this.preloadImages();
  }

  animateIntro = () => {
    TweenMax.to('.intro__description', 1, {opacity: 1, delay: 1, ease: Back.easeOut.config(1.7)});
    TweenMax.to('.intro__cta', 1, {opacity: 1, delay: 3, ease: Back.easeOut.config(1.7)});
  }

  preloadImages = () => {
    let images = [];

    api.get('posts', {
      data: {},
    }).then((res) => {
      res.data.map( (el, index) => {
        images.push(el.photo.url)
        if ( res.data.length == index + 1){
          placePreloaded();
        }
      })
    });

    function preload() {
      for (var i = 0; i < images.length; i++) {
        var imageObject = new Image();
        imageObject.src = images[i];
      }
    }

    // problem:
    // images from S3 are different every request

    function placePreloaded(){
      preload(images)
    }

  }

  render() {
    return (
      <div className="intro">
        <Topbar />
        <div className="intro__description">
          <div className="intro__control">
            Используйте механизм бесконечной прокрутки
          </div>
          <div className="intro__control">
            Смотрите истории интересных людей
          </div>
          <div className="intro__control">
            Присылайте свои истории. #ДЕЛИСЬВЗГЛЯДОМ
          </div>

        </div>

        <div className="intro__cta">
          <Link className="btn btn-line" to='/grid'>
            <span>ИССЛЕДОВАТЬ</span>
          </Link>
        </div>

      </div>
    );
  }
}
