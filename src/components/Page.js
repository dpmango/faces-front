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

  render(){

    if (!this.state.page) {
      return (
        <p>Загрузка...</p>
      )
    }

    return(
      <div className="s-page">
        <Topbar />
        <div className="s-page__content">
          <div className="s-page__title">{this.state.page.title}</div>
          <span dangerouslySetInnerHTML={{ __html: this.state.page.content }} />
        </div>
      </div>
    )
  }

}
