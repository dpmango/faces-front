import React from 'react';
import api from '../constructor/Api'
import CanvasGrid from '../constructor/CanvasGrid';

import Topbar from './Topbar';
// import { Link } from 'react-router-dom';

export default class Grid extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      transitioning: false,
      activeFilter: 'universe'
    }
  }

  componentDidMount() {
    // console.log('filter param for grid', this.props.match.params.filter)
    if ( this.props.match.params.filter ){
      this.setFilter(this.props.match.params.filter)
    } else {
      api.get('posts', {
        data: {},
      }).then((res) => {
        // console.log('got API responce', res.data)
        this.apiDone(res.data);
      });
    }
  }

  componentWillUnmount() {
    this.canvasGrid.stopGrid();
  }

  componentWillReceiveProps(nextProps){
    // console.log('component recived props', nextProps.match.params.filter)
    if ( nextProps.match.params.filter ){
      this.setFilter(nextProps.match.params.filter)
    }
  }
  redirectToCard = (postId) => {
    this.setState({
      transitioning: true
    });

    setTimeout(() => {
      this.props.history.push(`/profile/${postId}`);
    }, 500);
  }

  setFilter = (filter) => {
    // console.log("this.state.activeFilter !== filter", this.state.activeFilter !== filter)
    if (this.state.activeFilter !== filter){

    }
    this.setState({
      activeFilter: filter,
      loaded: false
    }, () => {
      api.get('posts', {
        params: {
          filter: filter
        },
      }).then((res) => {
        // console.log('got API responce with filter', res.data)
        if ( res.data.length > 0 ){
          if ( this.canvasGrid ){
            this.canvasGrid.removeGrid();
          }
          this.apiDone(res.data);
          // this.canvasGrid = new CanvasGrid(this.gridContainer, res.data, this.redirectToCard, this.state.activeFilter);
        }
      });
    });
  }

  apiDone = (data) => {
    let images = [];

    data.map( (el, index) => {
      images.push(el.photo.url)
      if ( data.length == index + 1){
        this.placePreloaded(images, data);
      }
    })
  }

  imgPreload = (images) => {
    for (var i = 0; i < images.length; i++) {
      var imageObject = new Image();
      // imageObject.onload = function(){
      //
      // }
      imageObject.src = images[i];
    }
  }

  placePreloaded = (images, data) => {
    this.imgPreload(images);
    this.setState({
      loaded: true
    });
    this.canvasGrid = new CanvasGrid(this.gridContainer, data, this.redirectToCard, this.state.activeFilter);
  }


  render() {
    if (!this.state.loaded) {
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
      <div className="grid">
        <Topbar />
        <div className="grid-filter">
          <span className={`btn btn-line ${this.state.activeFilter === "universe" ? 'is-active' : ''} `} onClick={this.setFilter.bind(this, 'universe')} >ВСЕЛЕННАЯ</span>
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
