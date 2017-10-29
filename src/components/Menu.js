import React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      opened: false
    }
  }

  toggleMenu = () => {
    this.setState({
      opened: !this.state.opened ? true : false
    });
  }

  render(){
    return(
      <span className="">

        <div className={`hamburger hamburger--squeeze ${this.state.opened ? 'is-active' : ''} `} onClick={this.toggleMenu.bind(this)}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>

        <div className={`menu ${this.state.opened ? 'is-active' : ''} `}>
          <div className="menu__wrapper">
            <div className="menu__navigation">
              <div className="menu__li">
                <Link className="btn btn-line" to='/grid'>
                  <span>О Проекте</span>
                </Link>
              </div>
              <div className="menu__li">
                <Link className="btn btn-line" to='/grid'>
                  <span>О Бренде</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </span>
    )
  }

}
