import React, { Component, createRef } from 'react';

export default class SidebarWraper extends Component {
  sidebarWrapper = createRef();

  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref={this.sidebarWrapper}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}
