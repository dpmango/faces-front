import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { TweenMax, Back } from 'gsap';
import { Howl } from 'howler';

export default class Intro extends Component {
  constructor() {
    super();

    this.bgAudio = new Howl({
      src: ['/piano2.mp3'],
      loop: true,
      volume: 0.25,
      rate: 0.70
    });

  }
  componentDidMount() {
    this.animateIntro();

    this.bgAudio.play();
  }

  animateIntro = () => {
    TweenMax.to('.intro__description', 1, {opacity: 1, delay: 1, ease: Back.easeOut.config(1.7)});
    TweenMax.to('.intro__cta', 1, {opacity: 1, delay: 3, ease: Back.easeOut.config(1.7)});
  }

  render() {
    return (
      <div className="intro">

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
