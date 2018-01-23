import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../constructor/Api'
import { TweenMax, Back, Elastic } from 'gsap';

import Topbar from './Topbar';
import sprite from '../images/sprite.svg';
import logo from '../images/logo.png'
import background from '../images/starbg.jpg'

export default class Intro extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    this.animateIntro();
  }

  animateIntro = () => {
    TweenMax.to('.intro__bg', 13, {scale: 1, delay: 2.5});
    TweenMax.to('.intro__logo', 1, {opacity: 1, y: 0, delay: 1, ease: Back.easeOut.config(2)});
    [].forEach.call( document.querySelectorAll('.intro__control'), function(control, index) {
      TweenMax.to(control, 1, {opacity: 1, y: 0, delay: 2 + (index * 0.25), ease: Elastic.easeOut.config(1, 0.6)})
    })
    TweenMax.to('.intro__cta', 1, {opacity: 1, y: 0, delay: 4, ease: Back.easeOut.config(2)});
  }

  render() {
    return (
      <div className="intro">
        <Topbar />
        <div className="intro__wrapper">
          { /* <div className="intro__logo">
            <img src={logo} alt="logo"/>
          </div> */ }
          <div className="intro__description">
            <div className="intro__control">
              Используйте механизм бесконечной прокрутки
              <svg className="ico ico-i-move">
                <use xlinkHref={sprite + "#ico-i-move"} />
              </svg>
            </div>
            <div className="intro__control">
              Смотрите истории интересных людей
              <svg className="ico ico-i-user">
                <use xlinkHref={sprite + "#ico-i-user"} />
              </svg>
            </div>
            <div className="intro__control">
              Присылайте свои истории. #ДЕЛИСЬВЗГЛЯДОМ
              <svg className="ico ico-i-share">
                <use xlinkHref={sprite + "#ico-i-share"} />
              </svg>
            </div>
          </div>
        </div>
        <img className="intro__bg" src={background} />

        <div className="intro__cta">
          <Link className="btn btn-line" to='/grid'>
            <span>ИССЛЕДОВАТЬ</span>
          </Link>
        </div>

      </div>
    );
  }
}
