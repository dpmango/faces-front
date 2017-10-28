import React from 'react';
import api from '../constructor/Api'
import CanvasGrid from '../constructor/CanvasGrid';

import { Link } from 'react-router-dom';

import { TweenMax } from 'gsap';

export default class Grid extends React.Component {
  constructor() {
    super();

    this.state = {
      transitioning: false
    }
  }

  componentDidMount() {
    api.get('posts', {
      data: {},
    }).then((res) => {
      this.canvasGrid = new CanvasGrid(this.gridContainer, res.data, this.redirectToCard);
    });
  }

  componentWillUnmount() {
    this.canvasGrid.stopGrid();
  }

  redirectToCard = (postId) => {
    this.setState({
      transitioning: true
    });

    setTimeout(() => {
      this.props.history.push(`/grid/${postId}`);
    }, 500);
  }

  render() {
    return (
      <div className="grid">
        {/* we can set filter here -- moon or _1977 (css only) */}
        <div className="grid-container inkwell" ref={(div) => this.gridContainer = div}></div>
        <div className={`grid-transition ${this.state.transitioning ? 'active' : ''} `}></div>
      </div>
    );
  }
}
