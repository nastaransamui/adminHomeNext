import React, { Component, createRef } from 'react';

export default class SidebarWraper extends Component {
  sidebarWrapper = createRef();
  componentDidMount() {
    // if (navigator.vendor||window.opera ||navigator.userAgentData.platform.indexOf('Win') > -1) {
    //   ps = new PerfectScrollbar(this.sidebarWrapper.current, {
    //     suppressScrollX: true,
    //     suppressScrollY: false,
    //   });
    // }
  }
  componentWillUnmount() {
    // if (navigator.userAgentData.platform.indexOf('Win') > -1) {
    //   ps.destroy();
    // }
  }
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
