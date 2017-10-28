import React from 'react';
import api from '../constructor/Api';
import { Link } from 'react-router-dom';

import { TweenMax, Back } from 'gsap';

import CircleFilter from '../filters/CircleFilter';
import TextFilter from '../filters/TextFilter';
import DesandroFilter from '../filters/DesandroFilter';
import UnaFilter from '../filters/UnaFilter';

export default class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      post: null,
    }
  }

  componentWillMount() {
    const postId = this.props.match.params.uuid;

    api.get(`posts/${postId}`, {
      context: this
    }).then(post => {
      this.setState({
        post: post.data
      });
      console.log(this.state.post)
      this.animateTransition();
    });
  }

  animateTransition = () => {
    TweenMax.to(this.imgWithFilter, 1, {opacity: 1, x: '0%', ease: Back.easeOut.config(1.7)});
    TweenMax.to('.info-item', 1, {opacity: 1, y: '0%', delay: 0.5, ease: Back.easeOut.config(1.7)});
  }


  renderFilter = (photo, filter) => {
    return <UnaFilter photo={photo} />
    // if (filter === 'circle') {
    //   return <CircleFilter photo={photo} />
    // }
    // if (filter === 'text') {
    //   return <TextFilter photo={photo} text='взгляд!' />
    // }
    // if (filter === 'desandro') {
    //   return <DesandroFilter photo={photo} />
    // }
    // if (filter === 'una') {
    //   return <UnaFilter photo={photo} />
    // }
  }

  render() {
    const { post } = this.state;

    if (!this.state.post) {
      return (
        <p>Загрузка...</p>
      )
    }

    return (
      <div className="profile">
        <Link className="back-to-grid" to='/grid'>
          НАЗАД
        </Link>

        <div className="imgWithFilter" ref={(div) => this.imgWithFilter = div}>
          {this.renderFilter(post.photo, post.filter)}
        </div>

        <div className="userInfo">
          <div className="info-container">
            <h1 className="info-item">{post.name}</h1>
            <h3 className="info-item">{post.position.toUpperCase()}</h3>
            <p className="info-item" dangerouslySetInnerHTML={{ __html: post.description }} />

          </div>

        </div>
      </div>
    );
  }
}
