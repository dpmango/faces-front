import React from 'react';
import api from '../constructor/Api';
import { Link, withRouter } from 'react-router-dom';

import { TweenMax, Back } from 'gsap';

import UnaFilter from '../filters/UnaFilter';

import Topbar from './Topbar';

export default class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      post: null,
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
        let cacheImg = post.data.photo.url;

        this.animateBack();

        this.props.history.push('/grid/' + postId )

        setTimeout(function(){
          _that.setState({
            post: post.data
          });
        }, delay);

        setTimeout(function(){
          _that.animateTransition();
        }, delay + 300);

      } else {
        this.setState({
          post: post.data
        });
        this.animateTransition();
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
    let nextPost = this.state.post.id - 1;
    this.getProfile(nextPost, 1000);
  }

  nextProfile = () => {
    let nextPost = this.state.post.id + 1;
    this.getProfile(nextPost, 1000);
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
        <Topbar shareTitle={post.name} shareDescription={post.description} shareImage={post.photo}/>

        <div className="profile__wrapper">
          <div className="profile-image" ref={(div) => this.imgWithFilter = div}>
            {this.renderFilter(post.photo)}
          </div>

          <div className="profile-info">
            <div className="profile-info__fixed">
              <h1 className="profile-info__name profile-animation">{post.name}</h1>
              <h3 className="profile-info__position profile-animation">{post.position.toUpperCase()}</h3>
            </div>
            <p className="profile-info__content profile-animation" dangerouslySetInnerHTML={{ __html: post.description }} />
          </div>

          <div className="profile-info__prev" onClick={this.prevProfile.bind(this)}>
            <div className="btn btn-line">
              <span>Предидущий</span>
            </div>
          </div>

          <div className="profile-info__next" onClick={this.nextProfile.bind(this)}>
            <div className="btn btn-line">
              <span>Следующий</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
