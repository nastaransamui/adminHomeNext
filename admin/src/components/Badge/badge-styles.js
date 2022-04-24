import { makeStyles } from '@mui/styles';

const badgeStyle = makeStyles((theme) => {
  return {
    badge: {
      borderRadius: '12px',
      padding: '5px 12px',
      textTransform: 'uppercase',
      fontSize: '10px',
      fontWeight: '700',
      lineHeight: '1',
      color: theme.palette.primary.contrastText,
      textAlign: 'center',
      verticalAlign: 'baseline',
      display: 'inline-block',
    },
    primary: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: theme.palette.secondary.main,
    },
    danger: {
      backgroundColor: theme.palette.error.main,
    },
    success: {
      backgroundColor: theme.palette.success.main,
    },
    info: {
      backgroundColor: theme.palette.info.main,
    },
    secondary: {
      backgroundColor: theme.palette.secondary.main,
    },
    gray: {
      backgroundColor: theme.palette.grey.A100,
    },
  };
});

export default badgeStyle;
