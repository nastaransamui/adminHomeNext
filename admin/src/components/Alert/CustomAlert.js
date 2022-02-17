import React from 'react';
import Alert from 'react-s-alert';

class MyCustomContentTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={this.props.classNames}
        id={this.props.id}
        style={this.props.customFields.styles}>
        <span>{this.props.customFields.message}</span>
        <span className='s-alert-close' onClick={this.props.handleClose}></span>
      </div>
    );
  }
}

export default MyCustomContentTemplate;
