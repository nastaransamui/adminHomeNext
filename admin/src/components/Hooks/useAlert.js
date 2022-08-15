import { useTheme } from '@mui/material';
import Alert from 'react-s-alert';

const alertCall = (theme, type, message, callback) => {
  const backgroundColor =
    type == 'error' ? theme.palette.error.dark : theme.palette.secondary.main;
  Alert[type]('', {
    customFields: {
      message: `${message}`,
      styles: {
        backgroundColor: backgroundColor,
        color: 'black',
        zIndex: 9999,
        padding: 10,
      },
    },
    onClose: function () {
      callback();
    },
    timeout: 'none',
    position: 'bottom',
    effect: 'bouncyflip',
  });
};

export default alertCall;
