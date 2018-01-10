import React from 'react';
import api from '../constructor/Api'
import CanvasGrid from '../constructor/CanvasGrid';

import Topbar from './Topbar';
// import { Link } from 'react-router-dom';

export default class Grid extends React.Component {
  constructor() {
    super();

    this.state = {
      transitioning: false,
      activeFilter: 'universe'
    }
  }

  componentDidMount() {
    api.get('posts', {
      data: {},
    }).then((res) => {
      console.log('got API responce', res.data)
      this.canvasGrid = new CanvasGrid(this.gridContainer, res.data, this.redirectToCard, this.state.activeFilter);
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

  setFilter = (filter) => {
    if (this.state.activeFilter !== filter){
      this.setState({
        activeFilter: filter
      }, () => {
        api.get('posts', {
          params: {
            filter: filter
          },
        }).then((res) => {
          if ( res.data.length > 0 ){
            this.canvasGrid.removeGrid();
            this.canvasGrid = new CanvasGrid(this.gridContainer, res.data, this.redirectToCard, this.state.activeFilter);
          }
        });
      });
    }

  }

  render() {
    return (
      <div className="grid">
        <Topbar />
        <div className="grid-filter">
          <span className={`btn btn-line ${this.state.activeFilter === "universe" ? 'is-active' : ''} `} onClick={this.setFilter.bind(this, 'universe')} >Universe</span>
          <span className={`btn btn-line ${this.state.activeFilter === "hero" ? 'is-active' : ''} `} onClick={this.setFilter.bind(this, 'hero')} >Герои</span>
          <span className={`btn btn-line ${this.state.activeFilter === "sharevision" ? 'is-active' : ''} `} onClick={this.setFilter.bind(this, 'sharevision')} >#ДЕЛИСЬВЗГЛЯДОМ</span>
        </div>
        {/* we can set filter here -- moon or _1977 (css only) */}
        <div className="grid-container inkwell" ref={(div) => this.gridContainer = div}></div>
        <div className={`grid-transition ${this.state.transitioning ? 'active' : ''} `}></div>
      </div>
    );
  }
}
