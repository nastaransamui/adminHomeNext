import React from 'react';
import Alert from 'react-s-alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class MyCustomContentTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  render() {
    return (
      <div
        className={this.props.classNames}
        id={this.props.id}
        style={this.props.customFields.styles}>
        <span>
          {`${this.props.customFields.message.slice(0, 85)}`}{' '}
          {this.props.customFields.message.length >= 85 ? (
            <Button
              color='primary'
              onClick={() => {
                this.setState({ open: !this.state.open });
              }}>
              {this.state.open ? 'less..' : '...more'}
            </Button>
          ) : null}{' '}
        </span>
        <Dialog
          open={this.state.open}
          scroll='paper'
          aria-labelledby='scroll-dialog-title'
          aria-describedby='scroll-dialog-description'>
          <DialogTitle
            id='scroll-dialog-title'
            sx={{ padding: 1, minHeight: 30 }}></DialogTitle>
          <DialogContent dividers>
            <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
              {this.props.customFields.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: 1, minHeight: 30 }}></DialogActions>
        </Dialog>
        <span className='s-alert-close' onClick={this.props.handleClose}></span>
      </div>
    );
  }
}

export default MyCustomContentTemplate;
