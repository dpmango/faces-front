import React from 'react';
import api from '../constructor/Api';
import { Link } from 'react-router-dom';

import Topbar from './Topbar';

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      page: null,
    }
  }

  componentWillMount() {
    this.requestPage(this.props.match.params.pagename);
  }

  componentWillReceiveProps(nextProps) {
    let nextPagename = nextProps.match.params.pagename
    if (nextPagename !== this.props.match.params.pagename) {
      this.requestPage(nextPagename);
      this.refreshtopbar();
    }
  }

  requestPage = (pageName) => {
    api.get(`pages/${pageName}`, {
      context: this
    }).then(page => {
      console.log('got API responce', page)
      this.setState({
        page: page.data
      });
    });
  }

  refreshtopbar = () => {
    return true
  }

  render(){

    if (!this.state.page) {
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

    return(
      <div className="s-page">
        <Topbar willUpdate={this.refreshtopbar()}/>
        <div className="s-page__content">
          <div className="s-page__title">{this.state.page.title}</div>
          <span dangerouslySetInnerHTML={{ __html: this.state.page.content }} />
        </div>
      </div>
    )
  }

}
