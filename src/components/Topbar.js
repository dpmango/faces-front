import React from 'react';
import { Link } from 'react-router-dom';

import Menu from './Menu'

export default class Topbar extends React.Component {
  constructor() {
    super();

    this.state = {
      opened: false
    }
  }

  render(){
    return(
      <div className="topbar">
        <Menu />
      </div>
    )
  }

}
